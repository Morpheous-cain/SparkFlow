import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth-helpers'
import { z } from 'zod'

const UpdateStaffSchema = z.object({
  name:              z.string().min(1).optional(),
  attendance_status: z.enum(['Present', 'Late', 'Absent', 'On-Leave']).optional(),
  // Manager-only fields:
  performance:       z.number().min(0).max(10).optional(),
  rating:            z.number().min(0).max(5).optional(),
  base_salary:       z.number().min(0).optional(),
  points:            z.number().int().min(0).optional(),
})

// Staff-editable fields (self-service)
const STAFF_EDITABLE = ['attendance_status'] as const

// GET /api/staff/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })

  // Non-managers can only view their own profile
  if (ctx.role !== 'manager' && data.user_id !== ctx.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Hide salary from non-managers
  if (ctx.role !== 'manager') {
    const { base_salary: _, ...safeData } = data
    return NextResponse.json(safeData)
  }

  return NextResponse.json(data)
}

// PATCH /api/staff/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateStaffSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  let updatePayload: Partial<typeof parsed.data> = parsed.data

  if (ctx.role !== 'manager') {
    // Verify they own this staff record
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('staff')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== ctx.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Restrict to self-editable fields
    updatePayload = Object.fromEntries(
      Object.entries(parsed.data).filter(([key]) =>
        STAFF_EDITABLE.includes(key as typeof STAFF_EDITABLE[number])
      )
    ) as Partial<typeof parsed.data>
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('staff')
    .update(updatePayload)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
