import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/dashboard?date=2024-01-15
// Returns: today's revenue, bay utilisation %, active vehicle count, top services
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId

  const dayStart = `${date}T00:00:00.000Z`
  const dayEnd   = `${date}T23:59:59.999Z`

  const supabase = await createClient()

  // Run all queries in parallel
  const [transactionsResult, vehiclesResult, baysResult] = await Promise.all([
    // Today's paid transactions
    supabase
      .from('transactions')
      .select('amount, services, payment_method')
      .eq('tenant_id', ctx.tenantId)
      .eq('branch_id', branch_id!)
      .eq('status', 'Paid')
      .gte('date', dayStart)
      .lte('date', dayEnd),

    // Active vehicles (non-completed)
    supabase
      .from('vehicles_live')
      .select('status')
      .eq('tenant_id', ctx.tenantId)
      .eq('branch_id', branch_id!)
      .neq('status', 'Completed'),

    // All bays for utilisation
    supabase
      .from('bays')
      .select('status')
      .eq('tenant_id', ctx.tenantId)
      .eq('branch_id', branch_id!),
  ])

  const transactions = transactionsResult.data ?? []
  const vehicles     = vehiclesResult.data ?? []
  const bays         = baysResult.data ?? []

  // Revenue totals
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0)

  const revenueByMethod = transactions.reduce((acc, t) => {
    acc[t.payment_method] = (acc[t.payment_method] ?? 0) + Number(t.amount)
    return acc
  }, {} as Record<string, number>)

  // Bay utilisation
  const totalBays    = bays.length
  const occupiedBays = bays.filter(b => b.status === 'Occupied').length
  const bayUtilisation = totalBays > 0
    ? Math.round((occupiedBays / totalBays) * 100)
    : 0

  // Top services (flatten all services arrays, count occurrences)
  const serviceCounts = transactions
    .flatMap(t => t.services ?? [])
    .reduce((acc, s) => {
      acc[s] = (acc[s] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topServices = Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // Vehicle status breakdown
  const vehicleStatusBreakdown = vehicles.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return NextResponse.json({
    date,
    revenue: {
      total:      totalRevenue,
      by_method:  revenueByMethod,
      tx_count:   transactions.length,
    },
    bays: {
      total:        totalBays,
      occupied:     occupiedBays,
      utilisation:  bayUtilisation,
    },
    vehicles: {
      active:     vehicles.length,
      by_status:  vehicleStatusBreakdown,
    },
    top_services: topServices,
  })
}
