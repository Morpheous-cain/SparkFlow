import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// PATCH /api/tasks/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { status, title, priority, due_date, assigned_to, description } = body

  const update: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (status      !== undefined) update.status      = status
  if (title       !== undefined) update.title        = title
  if (priority    !== undefined) update.priority     = priority
  if (due_date    !== undefined) update.due_date     = due_date
  if (assigned_to !== undefined) update.assigned_to  = assigned_to
  if (description !== undefined) update.description  = description

  // Auto-set completed_at when marking Done
  if (status === 'Done') update.completed_at = new Date().toISOString()
  if (status === 'Todo' || status === 'In Progress') update.completed_at = null

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tasks')
    .update(update)
    .eq('id', params.id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()
  const { error: dbError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', params.id)
    .eq('tenant_id', ctx.tenantId)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
