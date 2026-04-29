import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth-helpers'
import { z } from 'zod'

// Fields a customer is allowed to update on their own profile
const CUSTOMER_EDITABLE_FIELDS = ['name', 'email'] as const

const UpdateCustomerSchema = z.object({
  name:              z.string().min(1).optional(),
  phone:             z.string().min(9).optional(),
  email:             z.string().email().nullable().optional(),
  subscription_tier: z.enum(['None', 'Silver', 'Gold', 'Platinum']).optional(),
  loyalty_points:    z.number().int().min(0).optional(),
})

// GET /api/customers/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const supabase = await createClient()

  const { data, error: dbError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  // Customers can only view their own record
  if (ctx.role === 'customer' && data.user_id !== ctx.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(data)
}

// PATCH /api/customers/[id]
// Managers can update anything. Customers can only update their own name/email.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateCustomerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // If caller is a customer, restrict which fields they can update
  let updatePayload: Partial<typeof parsed.data> = parsed.data
  if (ctx.role === 'customer') {
    // First verify they own this record
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== ctx.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Strip fields customers aren't allowed to self-update
    updatePayload = Object.fromEntries(
      Object.entries(parsed.data).filter(([key]) =>
        CUSTOMER_EDITABLE_FIELDS.includes(key as typeof CUSTOMER_EDITABLE_FIELDS[number])
      )
    ) as Partial<typeof parsed.data>
  }

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('customers')
    .update(updatePayload)
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
