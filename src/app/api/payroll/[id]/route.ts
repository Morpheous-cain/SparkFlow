import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// PATCH /api/payroll/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { status } = body

  if (!['Approved', 'Disbursed'].includes(status)) {
    return NextResponse.json({ error: 'status must be Approved or Disbursed' }, { status: 400 })
  }

  const update: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === 'Disbursed') {
    update.disbursed_at = new Date().toISOString()
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('payroll_records')
    .update(update)
    .eq('id', params.id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
