import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
<<<<<<< HEAD

// GET /api/tasks
=======
import { z } from 'zod'

const CreateTaskSchema = z.object({
  title:       z.string().min(1),
  description: z.string().optional(),
  priority:    z.enum(['Low', 'Medium', 'High']).default('Medium'),
  due_date:    z.string().optional(),        // ISO date string
  assigned_to: z.string().uuid().optional(),
  branch_id:   z.string().uuid().optional(),
})

// GET /api/tasks
// Supports ?status=Todo|In+Progress|Done, ?priority=, ?assigned_to=
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

<<<<<<< HEAD
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
=======
  const { searchParams } = new URL(request.url)
  const status      = searchParams.get('status')
  const priority    = searchParams.get('priority')
  const assigned_to = searchParams.get('assigned_to')

  const supabase = await createClient()
  let query = supabase
    .from('tasks')
    .select(`
      id, title, description, status, priority, due_date,
      completed_at, created_at, updated_at,
      assigned_to:assigned_to ( id, name, role )
    `)
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (status)      query = query.eq('status', status)
  if (priority)    query = query.eq('priority', priority)
  if (assigned_to) query = query.eq('assigned_to', assigned_to)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
<<<<<<< HEAD
  const { title, description, priority = 'Medium', due_date, assigned_to } = body

  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
=======
  const parsed = CreateTaskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tasks')
    .insert({
<<<<<<< HEAD
      tenant_id: ctx.tenantId,
      branch_id: ctx.branchId,
      title,
      ...(description  && { description }),
      priority,
      ...(due_date     && { due_date }),
      ...(assigned_to  && { assigned_to }),
=======
      tenant_id:   ctx.tenantId,
      branch_id:   parsed.data.branch_id ?? ctx.branchId,
      title:       parsed.data.title,
      description: parsed.data.description,
      priority:    parsed.data.priority,
      due_date:    parsed.data.due_date,
      assigned_to: parsed.data.assigned_to,
      status:      'Todo',
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
