import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/accounts
// Returns chart_of_accounts + expenses summary + revenue from transactions
// All in one call so the Accounts page only needs 1 fetch
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
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
    },
  })
}
