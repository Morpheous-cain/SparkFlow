import { NextRequest, NextResponse } from 'next/server'
import { requireManager } from '@/lib/auth-helpers'
import { adminClient } from '@/lib/supabase/admin'

// PATCH /api/payroll/[id]
// Body: { status: 'Approved' | 'Disbursed' }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error: authError, user } = await requireManager(req)
  if (authError) return authError

  const body = await req.json()
  const { status } = body

  if (!['Approved', 'Disbursed'].includes(status)) {
    return NextResponse.json(
      { error: 'status must be Approved or Disbursed' },
      { status: 400 }
    )
  }

  const update: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }

  // Set disbursed_at timestamp when disbursing
  if (status === 'Disbursed') {
    update.disbursed_at = new Date().toISOString()
  }

  const { data, error } = await adminClient
    .from('payroll_records')
    .update(update)
    .eq('id', params.id)
    .eq('tenant_id', user.tenant_id) // RLS safety — can't patch another tenant's records
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
