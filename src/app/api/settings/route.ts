import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'

// GET /api/settings
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tenant_settings')
    .select('*')
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (dbError && dbError.code !== 'PGRST116') {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json(data ?? {})
}

// PATCH /api/settings
export async function PATCH(request: NextRequest) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const body = await request.json()
  const { logo_url, invoice_prefix, sms_notifications, email_notifications, mpesa_till_number, business_phone, business_email, address } = body

  const supabase = await createClient()
  const { data, error: dbError } = await supabase
    .from('tenant_settings')
    .upsert({
      tenant_id: ctx.tenantId,
      ...(logo_url            !== undefined && { logo_url }),
      ...(invoice_prefix      !== undefined && { invoice_prefix }),
      ...(sms_notifications   !== undefined && { sms_notifications }),
      ...(email_notifications !== undefined && { email_notifications }),
      ...(mpesa_till_number   !== undefined && { mpesa_till_number }),
      ...(business_phone      !== undefined && { business_phone }),
      ...(business_email      !== undefined && { business_email }),
      ...(address             !== undefined && { address }),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'tenant_id' })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
