import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/auth/signup
// Creates a Supabase auth user + customer profile + user_roles entry
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, password } = body

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'name, email and password are required' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // 1. Create Supabase auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, phone },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  // 2. Get tenant_id (use first tenant for now — single-tenant setup)
  const { data: tenant } = await admin
    .from('tenants')
    .select('id')
    .limit(1)
    .single()

  if (!tenant) {
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: 'No tenant found' }, { status: 500 })
  }

  // 3. Create customer profile
  const { error: custError } = await admin
    .from('customers')
    .insert({
      user_id:           userId,
      tenant_id:         tenant.id,
      name,
      email,
      phone:             phone ?? null,
      subscription_tier: 'None',
      loyalty_points:    0,
      total_visits:      0,
      total_spent:       0,
    })

  if (custError) {
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: custError.message }, { status: 500 })
  }

  // 4. Create user_roles entry
  await admin
    .from('user_roles')
    .insert({
      user_id:   userId,
      role:      'customer',
      tenant_id: tenant.id,
    })

  return NextResponse.json({ success: true, userId }, { status: 201 })
}
