import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/expenses
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('expenses')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { category, description, amount, type = 'Direct', expense_date } = body

  if (!category || !description || amount === undefined) {
    return NextResponse.json(
      { error: 'category, description, and amount are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('expenses')
    .insert({
      tenant_id: ctx.tenantId,
      branch_id: ctx.branchId,
      category,
      description,
      amount,
      type,
      ...(expense_date && { expense_date }),
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
