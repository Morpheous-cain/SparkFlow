import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateTransactionSchema = z.object({
  plate:            z.string().min(1).transform(s => s.toUpperCase().trim()),
  customer_id:      z.string().uuid().optional(),
  amount:           z.number().positive(),
  payment_method:   z.enum(['M-Pesa', 'Cash', 'Card']),
  services:         z.array(z.string()).min(1),
  duration:         z.number().int().min(0).optional(),
  // Inventory items consumed by this transaction
  // Pass an empty array [] if no inventory tracking needed
  inventory_usage:  z.array(z.object({
    item_id: z.string().uuid(),
    qty:     z.number().int().positive(),
  })).default([]),
})

// GET /api/transactions?from=2024-01-01&to=2024-01-31&status=Paid
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const from      = searchParams.get('from')
  const to        = searchParams.get('to')
  const status    = searchParams.get('status')
  const plate     = searchParams.get('plate')
  const limit     = parseInt(searchParams.get('limit') ?? '50')
  const offset    = parseInt(searchParams.get('offset') ?? '0')

  const supabase = await createClient()
  let query = supabase
    .from('transactions')
    .select('*, customer:customers(id, name, phone)', { count: 'exact' })
    .eq('tenant_id', ctx.tenantId)
    .eq('branch_id', ctx.branchId!)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (from)   query = query.gte('date', from)
  if (to)     query = query.lte('date', to)
  if (status) query = query.eq('status', status)
  if (plate)  query = query.ilike('plate', `%${plate}%`)

  const { data, error: dbError, count } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data, total: count, limit, offset })
}

// POST /api/transactions
// Uses the Postgres RPC to atomically:
//   1. Decrement inventory stock for each used item
//   2. Insert the transaction record (status = Pending until M-Pesa confirms)
//   3. Update customer.total_spent + total_visits
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const body = await request.json()
  const parsed = CreateTransactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: transactionId, error: rpcError } = await supabase.rpc(
    'create_transaction',
    {
      p_tenant_id:       ctx.tenantId,
      p_branch_id:       ctx.branchId,
      p_plate:           parsed.data.plate,
      p_customer_id:     parsed.data.customer_id ?? null,
      p_amount:          parsed.data.amount,
      p_payment_method:  parsed.data.payment_method,
      p_services:        parsed.data.services,
      p_duration:        parsed.data.duration ?? 0,
      p_inventory_usage: parsed.data.inventory_usage,
    }
  )

  if (rpcError) {
    // Surface inventory shortage errors clearly to the client
    if (rpcError.message.includes('Insufficient stock')) {
      return NextResponse.json({ error: rpcError.message }, { status: 409 })
    }
    return NextResponse.json({ error: rpcError.message }, { status: 500 })
  }

  // Fetch the created transaction to return full record
  const { data: transaction } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  return NextResponse.json(transaction, { status: 201 })
}
