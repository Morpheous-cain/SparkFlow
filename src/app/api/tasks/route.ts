import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/tasks
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { title, description, priority = 'Medium', due_date, assigned_to } = body

  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tasks')
    .insert({
      tenant_id: ctx.tenantId,
      branch_id: ctx.branchId,
      title,
      ...(description  && { description }),
      priority,
      ...(due_date     && { due_date }),
      ...(assigned_to  && { assigned_to }),
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
