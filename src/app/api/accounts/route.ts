import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/accounts
// Returns: { chart_of_accounts, expenses, summary: { total_revenue, total_expenses, net_profit } }
// Optional query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  const supabase = await createClient()

  // Chart of accounts
  const { data: coa, error: coaError } = await supabase
    .from('chart_of_accounts')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('code', { ascending: true })

  if (coaError) return NextResponse.json({ error: coaError.message }, { status: 500 })

  // Expenses (with optional date filter)
  let expQuery = supabase
    .from('expenses')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (from) expQuery = expQuery.gte('expense_date', from)
  if (to)   expQuery = expQuery.lte('expense_date', to)

  const { data: expenses, error: expError } = await expQuery
  if (expError) return NextResponse.json({ error: expError.message }, { status: 500 })

  // Revenue from transactions
  let txQuery = supabase
    .from('transactions')
    .select('amount')
    .eq('tenant_id', ctx.tenantId)
    .eq('status', 'Paid')

  if (from) txQuery = txQuery.gte('date', from)
  if (to)   txQuery = txQuery.lte('date', to)

  const { data: txs, error: txError } = await txQuery
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 })

  const total_revenue  = (txs ?? []).reduce((sum: number, t: any) => sum + Number(t.amount), 0)
  const total_expenses = (expenses ?? []).reduce((sum: number, e: any) => sum + Number(e.amount), 0)
  const net_profit     = total_revenue - total_expenses

  return NextResponse.json({
    chart_of_accounts: coa ?? [],
    expenses:          expenses ?? [],
    summary: {
      total_revenue,
      total_expenses,
      net_profit,
    },
  })
}
