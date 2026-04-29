import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth-helpers'

// GET /api/transactions/[id]
// Manager sees any transaction; customer sees only their own.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('transactions')
    .select(`
      *,
      customer:customers(id, name, phone, email)
    `)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  // Customers can only view their own transactions (RLS enforces this too,
  // but we add an explicit check here for a clear 403 vs silent 404)
  if (ctx.role === 'customer' && data.customer_id !== ctx.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(data)
}
