import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/auth/me — returns current user uid, email, role, tenant, branch
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role, tenant_id, branch_id')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: roleData?.role ?? null,
    tenant_id: roleData?.tenant_id ?? null,
    branch_id: roleData?.branch_id ?? null,
  })
}
