import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateVoucherSchema = z.object({
  code:     z.string().min(3).toUpperCase(),
  discount: z.number().positive(),
  type:     z.enum(['Percentage', 'Fixed']),
  expiry:   z.string(),  // ISO date string
})

const CreatePromotionSchema = z.object({
  title:       z.string().min(1),
  description: z.string().optional(),
  start_date:  z.string(),
  end_date:    z.string(),
})

// GET /api/subscriptions
// Returns plans, active vouchers, and active promotions in one call
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

  const [plansRes, vouchersRes, promotionsRes, subsRes] = await Promise.all([
    supabase
      .from('subscription_plans')
      .select('id, name, price, discount, benefits, is_active')
      .eq('tenant_id', ctx.tenantId)
      .eq('is_active', true)
      .order('price'),

    supabase
      .from('vouchers')
      .select('id, code, discount, type, expiry, status')
      .eq('tenant_id', ctx.tenantId)
      .order('created_at', { ascending: false }),

    supabase
      .from('promotions')
      .select('id, title, description, start_date, end_date, is_active')
      .eq('tenant_id', ctx.tenantId)
      .order('start_date', { ascending: false }),

    supabase
      .from('customer_subscriptions')
      .select('id, status, started_at, expires_at, plan:plan_id(name), customer:customer_id(id, name)')
      .eq('tenant_id', ctx.tenantId)
      .eq('status', 'Active'),
  ])

  if (plansRes.error)      return NextResponse.json({ error: plansRes.error.message }, { status: 500 })
  if (vouchersRes.error)   return NextResponse.json({ error: vouchersRes.error.message }, { status: 500 })
  if (promotionsRes.error) return NextResponse.json({ error: promotionsRes.error.message }, { status: 500 })

  return NextResponse.json({
    plans:       plansRes.data,
    vouchers:    vouchersRes.data,
    promotions:  promotionsRes.data,
    active_subs: subsRes.data ?? [],
  })
}

// POST /api/subscriptions
// Body: { action: 'create_voucher' | 'create_promotion', ...data }
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { action, ...rest } = body

  const supabase = await createClient()

  if (action === 'create_voucher') {
    const parsed = CreateVoucherSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('vouchers')
      .insert({ tenant_id: ctx.tenantId, ...parsed.data })
      .select()
      .single()
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  if (action === 'create_promotion') {
    const parsed = CreatePromotionSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('promotions')
      .insert({ tenant_id: ctx.tenantId, ...parsed.data })
      .select()
      .single()
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  return NextResponse.json({ error: 'Unknown action. Use create_voucher or create_promotion.' }, { status: 400 })
}
