import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAttendant } from '@/lib/auth-helpers'
import { z } from 'zod'

// Valid state machine transitions
const TRANSITIONS: Record<string, string> = {
  'Queue':  'In-Bay',
  'In-Bay': 'Ready',
  'Ready':  'Completed',
}

const UpdateVehicleSchema = z.object({
  // Explicit status advance — must follow the state machine
  status:       z.enum(['Queue', 'In-Bay', 'Ready', 'Completed']).optional(),
  // Attendant assignment (agent sets this at check-in)
  attendant_id: z.string().uuid().optional(),
  // Bay assignment
  bay_id:       z.string().uuid().nullable().optional(),
  // Progress override (0-100)
  progress:     z.number().min(0).max(100).optional(),
  // Services update
  services:     z.array(z.string()).optional(),
  total_amount: z.number().min(0).optional(),
})

// GET /api/vehicles/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAttendant()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('vehicles_live')
    .select(`
      *,
      customer:customers(id, name, phone, subscription_tier, loyalty_points),
      bay:bays(id, name),
      attendant:staff(id, name)
    `)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/vehicles/[id]
// Drives the state machine. Uses the Postgres RPC for the bay side-effect.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAttendant()
  if (error) return error

  const { id } = await params
  console.log('PATCH Vehicle Request:', { id, tenantId: ctx.tenantId })

  const body = await request.json()
  const parsed = UpdateVehicleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  // If advancing status, validate the transition is legal
  if (parsed.data.status) {
    console.log('Validating status transition for:', parsed.data.status)
    
    const { data: current, error: fetchError } = await supabase
      .from('vehicles_live')
      .select('status, tenant_id')
      .eq('id', id)
      .single()

    if (fetchError || !current) {
      console.error('Vehicle fetch error:', fetchError)
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Verify tenant access
    if (current.tenant_id !== ctx.tenantId) {
      return NextResponse.json({ error: 'Unauthorized access to vehicle' }, { status: 403 })
    }

    const expectedNext = TRANSITIONS[current.status]
    if (parsed.data.status !== expectedNext) {
      return NextResponse.json(
        { error: `Invalid transition: ${current.status} → ${parsed.data.status}. Expected → ${expectedNext}` },
        { status: 422 }
      )
    }

    console.log('Calling RPC with:', {
      p_vehicle_id: id,
      p_new_status: parsed.data.status,
      p_tenant_id: ctx.tenantId,
    })

    // Use the RPC to handle state change + bay side-effect atomically
    const { error: rpcError } = await supabase.rpc('advance_vehicle_status', {
      p_vehicle_id: id,
      p_new_status: parsed.data.status,
      p_tenant_id: ctx.tenantId,
    })

    if (rpcError) {
      console.error('RPC Error Details:', {
        error: rpcError,
        message: rpcError.message,
        code: rpcError.code,
        hint: rpcError.hint,
        details: rpcError.details
      });
      return NextResponse.json({ 
        error: 'Failed to update vehicle status',
        details: rpcError.message,
        code: rpcError.code
      }, { status: 500 })
    }
  }

  // Apply any non-status field updates (attendant, bay, progress, services)
  const nonStatusUpdates: Record<string, unknown> = {}
  if (parsed.data.attendant_id !== undefined) nonStatusUpdates.attendant_id = parsed.data.attendant_id
  if (parsed.data.bay_id       !== undefined) nonStatusUpdates.bay_id       = parsed.data.bay_id
  if (parsed.data.progress     !== undefined) nonStatusUpdates.progress     = parsed.data.progress
  if (parsed.data.services     !== undefined) nonStatusUpdates.services     = parsed.data.services
  if (parsed.data.total_amount !== undefined) nonStatusUpdates.total_amount = parsed.data.total_amount

  if (Object.keys(nonStatusUpdates).length > 0) {
    const { error: updateError } = await supabase
      .from('vehicles_live')
      .update(nonStatusUpdates)
      .eq('id', id)
      .eq('tenant_id', ctx.tenantId)
      
    if (updateError) {
      console.error('Update Error:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update vehicle fields',
        details: updateError.message 
      }, { status: 500 })
    }
  }

  // Fetch and return the updated vehicle
  const { data: updated, error: fetchError } = await supabase
    .from('vehicles_live')
    .select(`*, bay:bays(id, name), attendant:staff(id, name)`)
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Fetch Updated Vehicle Error:', fetchError);
    return NextResponse.json({ 
      error: 'Failed to fetch updated vehicle',
      details: fetchError.message 
    }, { status: 500 })
  }

  return NextResponse.json(updated)
}
