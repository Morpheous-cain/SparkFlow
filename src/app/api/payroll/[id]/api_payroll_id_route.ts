import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const UpdatePayrollSchema = z.object({
  status:        z.enum(['Approved', 'Disbursed']),
  mpesa_receipt: z.string().optional(),
})

// PATCH /api/payroll/[id]
// Approve or mark as disbursed. Disbursed requires mpesa_receipt.
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const parsed = UpdatePayrollSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (parsed.data.status === 'Disbursed' && !parsed.data.mpesa_receipt) {
    return NextResponse.json({ error: 'mpesa_receipt is required when disbursing' }, { status: 400 })
  }

  const supabase = await createClient()
  const updatePayload: Record<string, unknown> = {
    status:     parsed.data.status,
    updated_at: new Date().toISOString(),
  }

  if (parsed.data.status === 'Disbursed') {
    updatePayload.mpesa_receipt = parsed.data.mpesa_receipt
    updatePayload.disbursed_at  = new Date().toISOString()
  }

  const { data, error: dbError } = await supabase
    .from('payroll_records')
    .update(updatePayload)
    .eq('id', params.id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  if (!data)   return NextResponse.json({ error: 'Payroll record not found' }, { status: 404 })
  return NextResponse.json(data)
}
