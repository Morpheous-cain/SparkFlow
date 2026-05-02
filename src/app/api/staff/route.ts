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
// NOTE: staff table does NOT have email or base_salary columns.
// Those live in auth.users and will be added via migration if needed.
// For now we select only confirmed columns.
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
    .order('name')

  // Only filter by branch if we have one
  if (branch_id) query = query.eq('branch_id', branch_id)
  if (role)      query = query.eq('role', role)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Normalise — add email as null so frontend doesn't crash on member.email
  const normalised = (data ?? []).map((s: any) => ({
    ...s,
    email:       null,
    base_salary: 0,
  }))

  return NextResponse.json(normalised)
}

// POST /api/staff
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body   = await request.json()
  const parsed = CreateStaffSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const admin = createAdminClient()

  // Create Supabase auth user
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email:         parsed.data.email,
    password:      parsed.data.password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Create staff profile — only columns that exist in the table
  const supabase = await createClient()
  const { data: staffRecord, error: staffError } = await supabase
    .from('staff')
    .insert({
      user_id:   authUser.user.id,
      tenant_id: ctx.tenantId,
      branch_id: parsed.data.branch_id,
      name:      parsed.data.name,
      role:      parsed.data.role,
      // base_salary not in schema yet — skip
    })
    .select()
    .single()

  if (staffError) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return NextResponse.json({ error: staffError.message }, { status: 500 })
  }

  // Create user_roles entry
  await supabase.from('user_roles').insert({
    user_id:   authUser.user.id,
    role:      parsed.data.role,
    tenant_id: ctx.tenantId,
    branch_id: parsed.data.branch_id,
  })

  return NextResponse.json({ ...staffRecord, email: parsed.data.email }, { status: 201 })
}
