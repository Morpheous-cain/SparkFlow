import { NextRequest, NextResponse } from 'next/server'
import { requireManager } from '@/lib/auth-helpers'
import { adminClient } from '@/lib/supabase/admin'

// GET /api/payroll
export async function GET(req: NextRequest) {
  const { error: authError, user } = await requireManager(req)
  if (authError) return authError

  const { data, error } = await adminClient
    .from('payroll_records')
    .select(`
      *,
      staff:staff(id, name)
    `)
    .eq('tenant_id', user.tenant_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Normalise to camelCase shape expected by the frontend
  const normalised = (data ?? []).map((r: any) => ({
    id:          r.id,
    staffId:     r.staff_id,
    staffName:   r.staff?.name ?? 'Unknown',
    month:       r.month,
    baseAmount:  r.base_amount,
    commission:  r.commission,
    deductions:  r.deductions,
    netPay:      r.net_pay,
    status:      r.status,
    mpesaReceipt: r.mpesa_receipt,
    disbursedAt: r.disbursed_at,
  }))

  return NextResponse.json(normalised)
}

// POST /api/payroll
export async function POST(req: NextRequest) {
  const { error: authError, user } = await requireManager(req)
  if (authError) return authError

  const body = await req.json()
  const { staff_id, month, base_amount, commission, deductions } = body

  if (!staff_id || !month || base_amount === undefined) {
    return NextResponse.json(
      { error: 'staff_id, month, and base_amount are required' },
      { status: 400 }
    )
  }

  const { data, error } = await adminClient
    .from('payroll_records')
    .insert({
      tenant_id:   user.tenant_id,
      branch_id:   user.branch_id,
      staff_id,
      month,
      base_amount:  base_amount ?? 0,
      commission:   commission  ?? 0,
      deductions:   deductions  ?? 0,
      // net_pay is GENERATED — do NOT insert it
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
