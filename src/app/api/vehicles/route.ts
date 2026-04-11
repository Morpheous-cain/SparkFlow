// src/app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAgent, requireAttendant } from '@/lib/auth-helpers'
import { z } from 'zod'

// ── Input schema ───────────────────────────────────────────────────────────────
const CheckInSchema = z.object({
  plate:        z.string().min(1).transform(s => s.toUpperCase().trim()),
  bay_id:       z.string().uuid().optional(),
  attendant_id: z.string().uuid().optional(),
  customer_id:  z.string().uuid().optional(),
  services:     z.array(z.string()).default([]),
  total_amount: z.number().min(0).default(0),
})

// ── GET /api/vehicles ──────────────────────────────────────────────────────────
// Returns all non-completed vehicles for the branch.
// Used by: attendant job console, agent workflow tab, manager bays page.
// Query params:
//   branch_id  — override the caller's branch (manager viewing other branches)
//   status     — filter by status (Queue, In-Bay, Ready, Completed)
//   plate      — search by plate (partial, case-insensitive)
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireAttendant()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId
  const status    = searchParams.get('status')
  const plate     = searchParams.get('plate')

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
    .order('arrival_time', { ascending: true })

  // Apply branch filter — always scope to branch unless manager omits it
  if (branch_id) {
    query = query.eq('branch_id', branch_id)
  }

  // By default exclude completed vehicles (they clutter the UI)
  // Pass status=Completed explicitly if you need them
  if (status) {
    query = query.eq('status', status)
  } else {
    query = query.neq('status', 'Completed')
  }

  // Plate search (agent workflow search)
  if (plate) {
    query = query.ilike('plate', `%${plate}%`)
  }

  const { data, error: dbError } = await query

  if (dbError) {
    console.error('GET /api/vehicles error:', dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// ── POST /api/vehicles ─────────────────────────────────────────────────────────
// Check in a new vehicle.
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const branchId = ctx.branchId

  const body = await request.json()
  console.log('🟢 Vehicle check-in payload:', body)

  const parsed = CheckInSchema.safeParse(body)
  if (!parsed.success) {
    console.error('❌ Validation error:', parsed.error.flatten())
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    // 1. Duplicate plate check
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles_live')
      .select('id, status')
      .eq('plate', parsed.data.plate)
      .eq('tenant_id', ctx.tenantId)
      .eq('branch_id', branchId!)
      .neq('status', 'Completed')
      .maybeSingle()

    if (checkError) {
      console.error('⚠️ DB error while checking vehicle:', checkError)
      return NextResponse.json(
        { error: 'Database error while checking vehicle' },
        { status: 500 }
      )
    }

    if (existingVehicle) {
      return NextResponse.json(
        { error: `${parsed.data.plate} is already checked in (status: ${existingVehicle.status})` },
        { status: 409 }
      )
    }

    // 2. Insert vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles_live')
      .insert({
        plate:        parsed.data.plate,
        tenant_id:    ctx.tenantId,
        branch_id:    branchId,
        customer_id:  parsed.data.customer_id ?? null,
        bay_id:       parsed.data.bay_id ?? null,
        attendant_id: parsed.data.attendant_id ?? null,
        services:     parsed.data.services,
        total_amount: parsed.data.total_amount,
        status:       'Queue',
        progress:     0,
      })
      .select()
      .single()

    if (vehicleError) {
      console.error('❌ Error inserting vehicle:', vehicleError)
      return NextResponse.json({ error: vehicleError.message }, { status: 500 })
    }

    // 3. Mark bay occupied if assigned
    if (parsed.data.bay_id) {
      const { error: bayError } = await supabase
        .from('bays')
        .update({
          status:                'Occupied',
          current_vehicle_plate: parsed.data.plate,
          updated_at:            new Date().toISOString(),
        })
        .eq('id', parsed.data.bay_id)
        .eq('tenant_id', ctx.tenantId)

      if (bayError) {
        console.error('⚠️ Bay update error (non-fatal):', bayError)
      }
    }

    console.log('✅ Vehicle checked in:', vehicle.plate)
    return NextResponse.json(vehicle, { status: 201 })

  } catch (err) {
    console.error('🔥 Unexpected error in POST /api/vehicles:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}