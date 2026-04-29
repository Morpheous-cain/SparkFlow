import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
<<<<<<< HEAD
=======
import { z } from 'zod'

const UpdateTaskSchema = z.object({
  title:       z.string().min(1).optional(),
  description: z.string().optional(),
  status:      z.enum(['Todo', 'In Progress', 'Done']).optional(),
  priority:    z.enum(['Low', 'Medium', 'High']).optional(),
  due_date:    z.string().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
})
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f

// PATCH /api/tasks/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
<<<<<<< HEAD
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
=======
  const parsed = UpdateTaskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updatePayload: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  // Auto-set completed_at when marking Done, clear it if reverting
  if (parsed.data.status === 'Done') {
    updatePayload.completed_at = new Date().toISOString()
  } else if (parsed.data.status && parsed.data.status !== 'Done') {
    updatePayload.completed_at = null
  }
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tasks')
<<<<<<< HEAD
    .update(update)
=======
    .update(updatePayload)
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
    .eq('id', params.id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
<<<<<<< HEAD
=======
  if (!data)   return NextResponse.json({ error: 'Task not found' }, { status: 404 })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
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
