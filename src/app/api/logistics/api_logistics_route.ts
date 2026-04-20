import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateLogisticsSchema = z.object({
  customer_name:      z.string().min(1),
  item_type:          z.string().min(1),
  address:            z.string().min(1),
  amount:             z.number().positive(),
  pickup_window:      z.string().optional(),
  assigned_staff_id:  z.string().uuid().optional(),
})

// GET /api/logistics
// Supports ?status= filter
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const status    = searchParams.get('status')
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId

  const supabase = await createClient()
  let query = supabase
    .from('logistics_requests')
    .select(`
      id, customer_name, item_type, status, address,
      request_time, amount, pickup_window, qr_tag,
      tracking_progress, assigned_staff_id, created_at,
      staff:assigned_staff_id ( id, name )
    `)
    .eq('tenant_id', ctx.tenantId)
    .order('request_time', { ascending: false })

  if (branch_id) query = query.eq('branch_id', branch_id)
  if (status)    query = query.eq('status', status)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/logistics
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const parsed = CreateLogisticsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Generate a QR tag: SPARK-XX-timestamp
  const prefix = parsed.data.item_type.substring(0, 2).toUpperCase()
  const qr_tag = `SPARK-${prefix}-${Date.now().toString().slice(-4)}`

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('logistics_requests')
    .insert({
      tenant_id:         ctx.tenantId,
      branch_id:         ctx.branchId,
      customer_name:     parsed.data.customer_name,
      item_type:         parsed.data.item_type,
      address:           parsed.data.address,
      amount:            parsed.data.amount,
      pickup_window:     parsed.data.pickup_window,
      assigned_staff_id: parsed.data.assigned_staff_id,
      status:            'Booking',
      request_time:      new Date().toISOString(),
      tracking_progress: 0,
      qr_tag,
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
