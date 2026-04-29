import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
<<<<<<< HEAD

// GET /api/expenses
=======
import { z } from 'zod'

const CreateExpenseSchema = z.object({
  category:     z.string().min(1),
  description:  z.string().min(1),
  amount:       z.number().positive(),
  expense_date: z.string().optional(), // ISO date string, defaults to today
  type:         z.enum(['Direct', 'Indirect', 'Petty Cash']),
  branch_id:    z.string().uuid().optional(),
})

// GET /api/expenses
// Supports ?branch_id=, ?type=, ?from=YYYY-MM-DD, ?to=YYYY-MM-DD
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

<<<<<<< HEAD
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('expenses')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
=======
  const { searchParams } = new URL(request.url)
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId
  const type      = searchParams.get('type')
  const from      = searchParams.get('from')
  const to        = searchParams.get('to')

  const supabase = await createClient()
  let query = supabase
    .from('expenses')
    .select('id, category, description, amount, expense_date, type, branch_id, created_at')
    .eq('tenant_id', ctx.tenantId)
    .order('expense_date', { ascending: false })

  if (branch_id) query = query.eq('branch_id', branch_id)
  if (type)      query = query.eq('type', type)
  if (from)      query = query.gte('expense_date', from)
  if (to)        query = query.lte('expense_date', to)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
<<<<<<< HEAD
  const { category, description, amount, type = 'Direct', expense_date } = body

  if (!category || !description || amount === undefined) {
    return NextResponse.json(
      { error: 'category, description, and amount are required' },
      { status: 400 }
    )
=======
  const parsed = CreateExpenseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('expenses')
    .insert({
<<<<<<< HEAD
      tenant_id: ctx.tenantId,
      branch_id: ctx.branchId,
      category,
      description,
      amount,
      type,
      ...(expense_date && { expense_date }),
=======
      tenant_id:    ctx.tenantId,
      branch_id:    parsed.data.branch_id ?? ctx.branchId,
      category:     parsed.data.category,
      description:  parsed.data.description,
      amount:       parsed.data.amount,
      expense_date: parsed.data.expense_date ?? new Date().toISOString().split('T')[0],
      type:         parsed.data.type,
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
