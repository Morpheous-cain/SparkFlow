import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireManager } from '@/lib/auth-helpers'
import { z } from 'zod'

const RestockSchema = z.object({
  quantity: z.number().int().positive(),
})

// POST /api/inventory/[id]/restock
// Increments stock by the given quantity.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { ctx, error } = await requireManager()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const parsed = RestockSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  // Fetch current stock first (for the response)
  const { data: current, error: fetchError } = await supabase
    .from('inventory_items')
    .select('id, name, stock')
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .single()

  if (fetchError || !current) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
  }

  const { data, error: dbError } = await supabase
    .from('inventory_items')
    .update({
      stock:      current.stock + parsed.data.quantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({
    ...data,
    restocked_by:  parsed.data.quantity,
    previous_stock: current.stock,
  })
}
