import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreatePayrollSchema = z.object({
  staff_id:    z.string().uuid(),
  month:       z.string().min(1),       // e.g. 'May 2024'
  base_amount: z.number().min(0),
  commission:  z.number().min(0).default(0),
  deductions:  z.number().min(0).default(0),
})

// GET /api/payroll
// Supports ?month=May+2024 and ?branch_id=uuid filters
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const month     = searchParams.get('month')
  const branch_id = searchParams.get('branch_id') ?? ctx.branchId
  const status    = searchParams.get('status')

  const supabase = await createClient()
  let query = supabase
    .from('payroll_records')
    .select(`
      id, month, base_amount, commission, deductions, net_pay,
      status, mpesa_receipt, disbursed_at, created_at,
      staff:staff_id ( id, name, role )
    `)
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })

  if (branch_id) query = query.eq('branch_id', branch_id)
  if (month)     query = query.eq('month', month)
  if (status)    query = query.eq('status', status)

  const { data, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/payroll
// Creates a draft payroll record for a staff member
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const parsed = CreatePayrollSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  // Verify staff belongs to this tenant
  const { data: staffRow, error: staffError } = await supabase
    .from('staff')
    .select('id, branch_id')
    .eq('id', parsed.data.staff_id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (staffError || !staffRow) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })
  }

  const { data, error: insertError } = await supabase
    .from('payroll_records')
    .insert({
      tenant_id:   ctx.tenantId,
      branch_id:   staffRow.branch_id,
      staff_id:    parsed.data.staff_id,
      month:       parsed.data.month,
      base_amount: parsed.data.base_amount,
      commission:  parsed.data.commission,
      deductions:  parsed.data.deductions,
      status:      'Draft',
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
