import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/logistics
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('logistics_requests')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
<<<<<<< HEAD
    .order('request_time', { ascending: false })
=======
    .order('created_at', { ascending: false })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/logistics
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { customer_name, item_type, address, amount, status = 'Pending' } = body

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('logistics_requests')
    .insert({
      tenant_id: ctx.tenantId,
      branch_id: ctx.branchId,
      ...(customer_name && { customer_name }),
      ...(item_type     && { item_type }),
      ...(address       && { address }),
      ...(amount        && { amount }),
      status,
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
