import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAttendant, requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateBaySchema = z.object({
  name:       z.string().min(1),
  branch_id:  z.string().uuid(),
  tenant_id:  z.string().uuid(),
})

// GET /api/bays?branch_id=xxx
// Returns all bays for a branch. Staff only.
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireAttendant()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('bays')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .eq('branch_id', branch_id)
    .order('name')

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/bays
// Creates a new bay. Manager only.
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const parsed = CreateBaySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Ensure the bay belongs to the manager's tenant
  if (parsed.data.tenant_id !== ctx.tenantId) {
    return NextResponse.json({ error: 'Tenant mismatch' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('bays')
    .insert({ ...parsed.data, status: 'Available' })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
