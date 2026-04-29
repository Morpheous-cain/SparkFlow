import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/payroll
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('payroll_records')
    .select(`*, staff:staff(id, name)`)
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

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
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { staff_id, month, base_amount, commission = 0, deductions = 0 } = body

  if (!staff_id || !month || base_amount === undefined) {
    return NextResponse.json({ error: 'staff_id, month, and base_amount are required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('payroll_records')
<<<<<<< HEAD
    .insert({
      tenant_id:  ctx.tenantId,
      branch_id:  ctx.branchId,
      staff_id,
      month,
      base_amount,
      commission,
      deductions,
      // net_pay is GENERATED ALWAYS — never insert it
    })
    .select('*, staff:staff(id, name)')
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Normalise to camelCase
  const record = {
    id:          data.id,
    staffId:     data.staff_id,
    staffName:   (data as any).staff?.name ?? 'Unknown',
    month:       data.month,
    baseAmount:  data.base_amount,
    commission:  data.commission,
    deductions:  data.deductions,
    netPay:      data.net_pay,
    status:      data.status,
  }

  return NextResponse.json(record, { status: 201 })
=======
    .insert({ tenant_id: ctx.tenantId, branch_id: ctx.branchId, staff_id, month, base_amount, commission, deductions })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
}
