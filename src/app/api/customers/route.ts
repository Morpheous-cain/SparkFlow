import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAgent } from '@/lib/auth-helpers'
import { z } from 'zod'

const CreateCustomerSchema = z.object({
  name:              z.string().min(1),
  phone:             z.string().min(9),
  email:             z.string().email().optional(),
  subscription_tier: z.enum(['None', 'Silver', 'Gold', 'Platinum']).default('None'),
  user_id:           z.string().uuid().optional(),
})

// GET /api/customers?search=amina&tier=Gold&user_id=<uuid>
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const search  = searchParams.get('search')
  const tier    = searchParams.get('tier')
  const user_id = searchParams.get('user_id')   // ← ADDED: customer portal loyalty lookup
  const limit   = parseInt(searchParams.get('limit')  ?? '50')
  const offset  = parseInt(searchParams.get('offset') ?? '0')

  const supabase = await createClient()
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // ── ADDED: filter by auth user_id so customer portal can find its own record ──
  if (user_id) {
    query = query.eq('user_id', user_id)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (tier) query = query.eq('subscription_tier', tier)

  const { data, error: dbError, count } = await query
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ data, total: count, limit, offset })
}

// POST /api/customers
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireAgent()
  if (error) return error

  const body = await request.json()
  const parsed = CreateCustomerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('tenant_id', ctx.tenantId)
    .eq('phone', parsed.data.phone)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'A customer with this phone number already exists', existing_id: existing.id },
      { status: 409 }
    )
  }

  const { data, error: dbError } = await supabase
    .from('customers')
    .insert({
      ...parsed.data,
      tenant_id: ctx.tenantId,
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
