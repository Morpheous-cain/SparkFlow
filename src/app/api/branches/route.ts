import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/branches
<<<<<<< HEAD
=======
// Returns all branches for the authenticated manager's tenant
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()
<<<<<<< HEAD

  const { data, error: dbError } = await supabase
    .from('branches')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: true })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json(data ?? [])
=======
  const { data, error: dbError } = await supabase
    .from('branches')
    .select(`
      id, name, location, status, phone, created_at,
      manager:staff ( id, name )
    `)
    .eq('tenant_id', ctx.tenantId)
    .order('name')

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
}
