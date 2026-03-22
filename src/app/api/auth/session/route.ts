import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// POST /api/auth/session — sign in, set JWT cookie
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = SignInSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  // Fetch the user's role from user_roles table
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, tenant_id, branch_id')
    .eq('user_id', data.user.id)
    .single()

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      role: roleData?.role ?? null,
      tenant_id: roleData?.tenant_id ?? null,
      branch_id: roleData?.branch_id ?? null,
    },
  })
}

// DELETE /api/auth/session — sign out, clear cookie
export async function DELETE() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.json({ success: true })
}
