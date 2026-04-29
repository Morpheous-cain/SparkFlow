import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/branches
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('branches')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: true })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}
