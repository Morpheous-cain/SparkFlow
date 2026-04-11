import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth-helpers'
import { z } from 'zod'

const CheckInSchema = z.object({
  plate:       z.string().min(1).transform(s => s.toUpperCase().trim()),
  bay_id:      z.string().uuid().optional(),
  attendant_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  services:    z.array(z.string()).default([]),
  total_amount: z.number().min(0).default(0),
})

// POST /api/vehicles — check in a new vehicle
// Also marks the assigned bay as Occupied.
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const body = await request.json()
  console.log('Received check-in request body:', body)

  const parsed = CheckInSchema.safeParse(body)
  console.log('Zod parsing result:', parsed)
  
  if (!parsed.success) {
    console.error('Validation error:', parsed.error.flatten())
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    // Log the parsed data
    console.log('Parsed data:', parsed.data)

    // Check if vehicle with same plate already exists and is not completed
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles_live')
      .select('id, status')
      .eq('plate', parsed.data.plate)
      .eq('tenant_id', ctx.tenantId)
      .neq('status', 'Completed')
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing vehicle:', checkError)
      return NextResponse.json({ error: 'Database error while checking vehicle' }, { status: 500 })
    }

    if (existingVehicle) {
      return NextResponse.json({ 
        error: `Vehicle ${parsed.data.plate} is already checked in with status: ${existingVehicle.status}` 
      }, { status: 409 })
    }

    // Insert the vehicle
    const insertData = {
      plate:        parsed.data.plate,
      tenant_id:    ctx.tenantId,
      branch_id:    ctx.branchId!, // Make sure this is available from auth context
      customer_id:  parsed.data.customer_id ?? null,
      bay_id:       parsed.data.bay_id ?? null,
      services:     parsed.data.services,
      total_amount: parsed.data.total_amount,
      status:       'Queue',
      progress:     0,
    }

    console.log('Inserting vehicle with data:', insertData)

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles_live')
      .insert(insertData)
      .select()
      .single()

    if (vehicleError) {
      console.error('Error inserting vehicle:', vehicleError)
      return NextResponse.json({ error: vehicleError.message }, { status: 500 })
    }

    // If a bay was assigned, mark it Occupied
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
        console.error('Error updating bay:', bayError)
        // Don't fail the whole operation, just log the error
      }
    }

    console.log('Vehicle inserted successfully:', vehicle)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
