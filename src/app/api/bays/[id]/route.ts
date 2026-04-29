import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const UpdateBaySchema = z.object({
  name:                  z.string().min(1).optional(),
  status:                z.enum(['Available', 'Occupied', 'Under Maintenance']).optional(),
  current_vehicle_plate: z.string().nullable().optional(),
})

// GET /api/bays/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('bays')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError) return NextResponse.json({ error: 'Bay not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/bays/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateBaySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('bays')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/bays/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { error: dbError } = await supabase
    .from('bays')
    .delete()
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
