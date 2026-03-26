import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth-helpers'
import { z } from 'zod'

const CheckInSchema = z.object({
  plate:       z.string().min(1).transform(s => s.toUpperCase().trim()),
  bay_id:      z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  services:    z.array(z.string()).default([]),
  total_amount: z.number().min(0).default(0),
})

// GET /api/vehicles?status=Queue&branch_id=xxx
// Returns active (non-completed) vehicles for the branch.
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const status    = searchParams.get('status')
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId

  const supabase = await createClient()
  let query = supabase
    .from('vehicles_live')
    .select(`
      *,
      customer:customers(id, name, phone, subscription_tier),
      bay:bays(id, name),
      attendant:staff(id, name)
    `)
    .eq('tenant_id', ctx.tenantId)
    .eq('branch_id', branch_id)
    .neq('status', 'Completed')
    .order('arrival_time', { ascending: true })

  if (status) query = query.eq('status', status)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/vehicles — check in a new vehicle
// Also marks the assigned bay as Occupied.
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const body = await request.json()
  const parsed = CheckInSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  // Insert the vehicle
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles_live')
    .insert({
      plate:        parsed.data.plate,
      tenant_id:    ctx.tenantId,
      branch_id:    ctx.branchId!,
      customer_id:  parsed.data.customer_id ?? null,
      bay_id:       parsed.data.bay_id ?? null,
      services:     parsed.data.services,
      total_amount: parsed.data.total_amount,
      status:       'Queue',
      progress:     0,
    })
    .select()
    .single()

  if (vehicleError) {
    return NextResponse.json({ error: vehicleError.message }, { status: 500 })
  }

  // If a bay was assigned, mark it Occupied
  if (parsed.data.bay_id) {
    await supabase
      .from('bays')
      .update({
        status:                'Occupied',
        current_vehicle_plate: parsed.data.plate,
        updated_at:            new Date().toISOString(),
      })
      .eq('id', parsed.data.bay_id)
      .eq('tenant_id', ctx.tenantId)
  }

  return NextResponse.json(vehicle, { status: 201 })
}
