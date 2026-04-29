import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
<<<<<<< HEAD

// GET /api/subscriptions
// Returns: { plans, vouchers, promotions }
=======
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
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()

<<<<<<< HEAD
  const [plansRes, vouchersRes, promotionsRes] = await Promise.all([
    supabase
      .from('subscription_plans')
      .select('*')
      .eq('tenant_id', ctx.tenantId)
      .eq('is_active', true)
      .order('price', { ascending: true }),
    supabase
      .from('vouchers')
      .select('*')
      .eq('tenant_id', ctx.tenantId)
      .order('created_at', { ascending: false }),
    supabase
      .from('promotions')
      .select('*')
      .eq('tenant_id', ctx.tenantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ])

  if (plansRes.error)      return NextResponse.json({ error: plansRes.error.message },      { status: 500 })
  if (vouchersRes.error)   return NextResponse.json({ error: vouchersRes.error.message },   { status: 500 })
  if (promotionsRes.error) return NextResponse.json({ error: promotionsRes.error.message }, { status: 500 })

  // Normalise plans to camelCase for frontend
  const plans = (plansRes.data ?? []).map((p: any) => ({
    id:       p.id,
    name:     p.name,
    price:    p.price,
    discount: p.discount,
    benefits: p.benefits ?? [],
    isActive: p.is_active,
  }))

  // Normalise vouchers
  const vouchers = (vouchersRes.data ?? []).map((v: any) => ({
    id:       v.id,
    code:     v.code,
    discount: v.discount,
    type:     v.type,
    expiry:   v.expiry,
    status:   v.status,
  }))

  // Normalise promotions
  const promotions = (promotionsRes.data ?? []).map((p: any) => ({
    id:          p.id,
    title:       p.title,
    description: p.description,
    startDate:   p.start_date,
    endDate:     p.end_date,
    isActive:    p.is_active,
  }))

  return NextResponse.json({ plans, vouchers, promotions })
}

// POST /api/subscriptions
// Body: { action: 'create_voucher', code, discount, type, expiry }
//    OR { action: 'create_promotion', title, description, start_date, end_date }
//    OR { action: 'create_plan', name, price, discount, benefits }
=======
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
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
<<<<<<< HEAD
  const { action } = body
=======
  const { action, ...rest } = body
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f

  const supabase = await createClient()

  if (action === 'create_voucher') {
<<<<<<< HEAD
    const { code, discount, type, expiry } = body
    if (!code || discount === undefined || !type || !expiry) {
      return NextResponse.json({ error: 'code, discount, type, and expiry are required' }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('vouchers')
      .insert({ tenant_id: ctx.tenantId, code: code.toUpperCase(), discount, type, expiry })
=======
    const parsed = CreateVoucherSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('vouchers')
      .insert({ tenant_id: ctx.tenantId, ...parsed.data })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
      .select()
      .single()
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  if (action === 'create_promotion') {
<<<<<<< HEAD
    const { title, description, start_date, end_date } = body
    if (!title || !start_date || !end_date) {
      return NextResponse.json({ error: 'title, start_date, and end_date are required' }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('promotions')
      .insert({ tenant_id: ctx.tenantId, title, description, start_date, end_date })
=======
    const parsed = CreatePromotionSchema.safeParse(rest)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('promotions')
      .insert({ tenant_id: ctx.tenantId, ...parsed.data })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
      .select()
      .single()
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

<<<<<<< HEAD
  if (action === 'create_plan') {
    const { name, price, discount = 0, benefits = [] } = body
    if (!name || price === undefined) {
      return NextResponse.json({ error: 'name and price are required' }, { status: 400 })
    }
    const { data, error: dbError } = await supabase
      .from('subscription_plans')
      .insert({ tenant_id: ctx.tenantId, name, price, discount, benefits })
      .select()
      .single()
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  return NextResponse.json({ error: 'Invalid action. Use: create_voucher, create_promotion, create_plan' }, { status: 400 })
=======
  return NextResponse.json({ error: 'Unknown action. Use create_voucher or create_promotion.' }, { status: 400 })
>>>>>>> cf2696b58bfcdaf8b5cd7b0a5b1b777ae0d0753f
}
