import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/accounts
<<<<<<< HEAD
// Returns: { chart_of_accounts, expenses, summary: { total_revenue, total_expenses, net_profit } }
// Optional query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
=======
// Returns chart_of_accounts + expenses summary + revenue from transactions
// All in one call so the Accounts page only needs 1 fetch
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
<<<<<<< HEAD
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
=======
  const from = searchParams.get('from') // ISO date, defaults to start of current month
  const to   = searchParams.get('to')   // ISO date, defaults to today

  const now       = new Date()
  const fromDate  = from ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const toDate    = to   ?? now.toISOString().split('T')[0]

  const supabase = await createClient()

  const [coaRes, expensesRes, revenueRes] = await Promise.all([
    supabase
      .from('chart_of_accounts')
      .select('id, code, name, type, balance')
      .eq('tenant_id', ctx.tenantId)
      .order('code'),

    supabase
      .from('expenses')
      .select('id, category, description, amount, expense_date, type, branch_id')
      .eq('tenant_id', ctx.tenantId)
      .gte('expense_date', fromDate)
      .lte('expense_date', toDate)
      .order('expense_date', { ascending: false }),

    supabase
      .from('transactions')
      .select('amount, status, created_at')
      .eq('tenant_id', ctx.tenantId)
      .eq('status', 'Paid')
      .gte('created_at', `${fromDate}T00:00:00`)
      .lte('created_at', `${toDate}T23:59:59`),
  ])

  if (coaRes.error)      return NextResponse.json({ error: coaRes.error.message }, { status: 500 })
  if (expensesRes.error) return NextResponse.json({ error: expensesRes.error.message }, { status: 500 })
  if (revenueRes.error)  return NextResponse.json({ error: revenueRes.error.message }, { status: 500 })

  const totalRevenue = (revenueRes.data ?? []).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = (expensesRes.data ?? []).reduce((sum, e) => sum + e.amount, 0)

  return NextResponse.json({
    chart_of_accounts: coaRes.data,
    expenses:          expensesRes.data,
    summary: {
      total_revenue:  totalRevenue,
      total_expenses: totalExpenses,
      net_profit:     totalRevenue - totalExpenses,
      from:           fromDate,
      to:             toDate,
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
    },
  })
}
