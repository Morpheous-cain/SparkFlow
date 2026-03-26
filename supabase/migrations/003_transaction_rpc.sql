-- ============================================================
-- SparkFlow — Migration 003: Atomic transaction RPC
-- Run AFTER 002_rls_policies.sql
-- This function wraps 3 writes in one DB transaction so if any
-- step fails (e.g. inventory short), everything rolls back.
-- ============================================================

CREATE OR REPLACE FUNCTION create_transaction(
  p_tenant_id       uuid,
  p_branch_id       uuid,
  p_plate           text,
  p_customer_id     uuid,
  p_amount          numeric,
  p_payment_method  text,
  p_services        text[],
  p_duration        int,
  p_inventory_usage jsonb  -- [{ "item_id": "uuid", "qty": 2 }, ...]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as DB owner, bypasses RLS for the internal writes
AS $$
DECLARE
  v_transaction_id  uuid;
  v_item            jsonb;
  v_current_stock   int;
  v_item_id         uuid;
  v_qty             int;
BEGIN
  -- 1. Validate and decrement each inventory item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_inventory_usage)
  LOOP
    v_item_id := (v_item->>'item_id')::uuid;
    v_qty     := (v_item->>'qty')::int;

    SELECT stock INTO v_current_stock
    FROM inventory_items
    WHERE id = v_item_id AND tenant_id = p_tenant_id
    FOR UPDATE;  -- lock the row to prevent race conditions

    IF v_current_stock IS NULL THEN
      RAISE EXCEPTION 'Inventory item % not found', v_item_id;
    END IF;

    IF v_current_stock < v_qty THEN
      RAISE EXCEPTION 'Insufficient stock for item %. Have %, need %',
        v_item_id, v_current_stock, v_qty;
    END IF;

    UPDATE inventory_items
    SET stock = stock - v_qty, updated_at = now()
    WHERE id = v_item_id;
  END LOOP;

  -- 2. Insert the transaction record
  INSERT INTO transactions (
    tenant_id, branch_id, plate, customer_id,
    amount, status, payment_method, services, duration
  )
  VALUES (
    p_tenant_id, p_branch_id, p_plate, p_customer_id,
    p_amount, 'Pending', p_payment_method, p_services, p_duration
  )
  RETURNING id INTO v_transaction_id;

  -- 3. Update customer lifetime value (if customer is known)
  IF p_customer_id IS NOT NULL THEN
    UPDATE customers
    SET
      total_spent = total_spent + p_amount,
      total_visits = total_visits + 1
    WHERE id = p_customer_id;
  END IF;

  RETURN v_transaction_id;
END;
$$;

-- Grant execute to authenticated users (RLS on the tables still applies
-- for SELECT; the SECURITY DEFINER only bypasses RLS for the writes inside)
GRANT EXECUTE ON FUNCTION create_transaction TO authenticated;


-- ── Helper: advance vehicle state machine ──────────────────
-- Called by PATCH /api/vehicles/[id]
-- Handles the bay status side-effect automatically.

CREATE OR REPLACE FUNCTION advance_vehicle_status(
  p_vehicle_id  uuid,
  p_new_status  text,
  p_tenant_id   uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bay_id uuid;
BEGIN
  -- Get current bay assignment
  SELECT bay_id INTO v_bay_id
  FROM vehicles_live
  WHERE id = p_vehicle_id AND tenant_id = p_tenant_id;

  -- Update the vehicle
  UPDATE vehicles_live
  SET status = p_new_status,
      progress = CASE p_new_status
        WHEN 'In-Bay'    THEN 25
        WHEN 'Ready'     THEN 90
        WHEN 'Completed' THEN 100
        ELSE progress
      END
  WHERE id = p_vehicle_id;

  -- If completing: free the bay
  IF p_new_status = 'Completed' AND v_bay_id IS NOT NULL THEN
    UPDATE bays
    SET status = 'Available', current_vehicle_plate = NULL, updated_at = now()
    WHERE id = v_bay_id;
  END IF;

  -- If moving In-Bay: mark bay as Occupied
  IF p_new_status = 'In-Bay' AND v_bay_id IS NOT NULL THEN
    UPDATE bays
    SET status = 'Occupied', updated_at = now()
    WHERE id = v_bay_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION advance_vehicle_status TO authenticated;
