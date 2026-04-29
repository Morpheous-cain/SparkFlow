import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateStaffSchema = z.object({
  name:        z.string().min(1),
  role:        z.enum(['manager', 'agent', 'attendant', 'driver']),
  branch_id:   z.string().uuid(),
  email:       z.string().email(),
  password:    z.string().min(8),
  base_salary: z.number().min(0).default(0),
})

// GET /api/staff
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const role      = searchParams.get('role')
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId

  const supabase = await createClient()
  let query = supabase
    .from('staff')
    .select('id, name, role, branch_id, performance, rating, attendance_status, points, created_at')
    .eq('tenant_id', ctx.tenantId)
    .eq('branch_id', branch_id!)
    .order('name')

  if (role) query = query.eq('role', role)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/staff
// Creates both an auth user AND a staff profile AND a user_roles entry.
// Uses the admin client because creating auth users requires the service role key.
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const parsed = CreateStaffSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Use admin client to create the Supabase auth user
  const admin = createAdminClient()
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email:         parsed.data.email,
    password:      parsed.data.password,
    email_confirm: true, // auto-confirm for staff created by manager
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Create the staff profile
  const supabase = await createClient()
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .insert({
      user_id:     authUser.user.id,
      tenant_id:   ctx.tenantId,
      branch_id:   parsed.data.branch_id,
      name:        parsed.data.name,
      role:        parsed.data.role,
      base_salary: parsed.data.base_salary,
    })
    .select()
    .single()

  if (staffError) {
    // Roll back: delete the auth user we just created
    await admin.auth.admin.deleteUser(authUser.user.id)
    return NextResponse.json({ error: staffError.message }, { status: 500 })
  }

  // Create user_roles entry
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id:   authUser.user.id,
      role:      parsed.data.role,
      tenant_id: ctx.tenantId,
      branch_id: parsed.data.branch_id,
    })

  if (roleError) {
    // Non-fatal — log but don't fail the whole request
    console.error('Failed to create user_roles entry:', roleError.message)
  }

  return NextResponse.json(staffRecord, { status: 201 })
}
