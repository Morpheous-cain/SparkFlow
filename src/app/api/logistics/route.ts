import { NextRequest, NextResponse } from 'next/server'
import { requireManager } from '@/lib/auth-helpers'
import { adminClient } from '@/lib/supabase/admin'

// GET /api/logistics
export async function GET(req: NextRequest) {
  const { error: authError, user } = await requireManager(req)
  if (authError) return authError

  const { data, error } = await adminClient
    .from('logistics_requests')
    .select('*')
    .eq('tenant_id', user.tenant_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/logistics
// Only inserts columns we know exist — DO NOT use customer_name, item_type, address
// Run: SELECT column_name FROM information_schema.columns WHERE table_name = 'logistics_requests';
// in Supabase SQL editor to see your actual columns, then update this route.
export async function POST(req: NextRequest) {
  const { error: authError, user } = await requireManager(req)
  if (authError) return authError

  const body = await req.json()

  // Build insert using only confirmed columns
  // tenant_id, branch_id are required by RLS
  // Add/remove fields below to match your actual logistics_requests schema
  const insert: Record<string, any> = {
    tenant_id: user.tenant_id,
    branch_id: user.branch_id,
  }

  // Optional fields — only include if they exist in your table
  if (body.status)            insert.status             = body.status ?? 'Pending'
  if (body.amount)            insert.amount             = body.amount
  if (body.pickup_window)     insert.pickup_window      = body.pickup_window
  if (body.qr_tag)            insert.qr_tag             = body.qr_tag
  if (body.tracking_progress !== undefined) insert.tracking_progress = body.tracking_progress
  if (body.assigned_staff_id) insert.assigned_staff_id  = body.assigned_staff_id

  // NOTE: customer_name, item_type, address do NOT exist in your schema.
  // To add them run this in Supabase SQL Editor:
  //   ALTER TABLE logistics_requests ADD COLUMN IF NOT EXISTS customer_name text;
  //   ALTER TABLE logistics_requests ADD COLUMN IF NOT EXISTS item_type text;
  //   ALTER TABLE logistics_requests ADD COLUMN IF NOT EXISTS address text;
  // Then uncomment below:
  // if (body.customer_name) insert.customer_name = body.customer_name
  // if (body.item_type)     insert.item_type     = body.item_type
  // if (body.address)       insert.address       = body.address

  const { data, error } = await adminClient
    .from('logistics_requests')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
