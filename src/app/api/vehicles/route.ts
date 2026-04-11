// src/app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAgent } from '@/lib/auth-helpers';
import { z } from 'zod';

const CheckInSchema = z.object({
  plate:       z.string().min(1).transform(s => s.toUpperCase().trim()),
  bay_id:      z.string().uuid().optional(),
  attendant_id: z.string().uuid().optional(),
  customer_id: z.string().uuid().optional(),
  services:    z.array(z.string()).default([]),
  total_amount: z.number().min(0).default(0),
});

export async function POST(request: NextRequest) {
  // -----------------------------------------------------------------
  // 1️⃣ Auth & payload validation
  // -----------------------------------------------------------------
  const { ctx, error } = await requireAgent();
  if (error) return error;

  const body = await request.json();
  console.log('🟢 Received vehicle‑check‑in payload:', body);

  const parsed = CheckInSchema.safeParse(body);
  console.log('🔎 Zod parsing result:', parsed);
  if (!parsed.success) {
    console.error('❌ Validation error:', parsed.error.flatten());
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = await createClient();

  // -----------------------------------------------------------------
  // 2️⃣ Does a vehicle with the same plate already exist (and not Completed)?
  // -----------------------------------------------------------------
  try {
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles_live')
      .select('id, status')
      .eq('plate', parsed.data.plate)
      .eq('tenant_id', ctx.tenantId)
      .eq('branch_id', ctx.branchId)          // 👈 *** THIS LINE IS NEW ***
      .neq('status', 'Completed')
      .maybeSingle();

    console.log('🔎 Existing‑vehicle query result:', { existingVehicle, checkError });

    if (checkError) {
      console.error('❌ RLS / DB error while checking existing vehicle:', checkError);
      return NextResponse.json(
        { error: 'Database error while checking vehicle' },
        { status: 500 }
      );
    }

    if (existingVehicle) {
      return NextResponse.json(
        {
          error: `Vehicle ${parsed.data.plate} is already checked in with status: ${existingVehicle.status}`,
        },
        { status: 409 }
      );
    }
  } catch (e) {
    console.error('⚡️ Unexpected error while checking for duplicates:', e);
    return NextResponse.json(
      { error: 'Unexpected server error during duplicate check' },
      { status: 500 }
    );
  }

  // -----------------------------------------------------------------
  // 3️⃣ Insert the new vehicle
  // -----------------------------------------------------------------
  const insertPayload = {
    plate:        parsed.data.plate,
    tenant_id:    ctx.tenantId,
    branch_id:    ctx.branchId!,                 // <-- always present for an agent
    customer_id: parsed.data.customer_id ?? null,
    bay_id:       parsed.data.bay_id ?? null,
    services:     parsed.data.services,
    total_amount: parsed.data.total_amount,
    status:       'Queue',
    progress:     0,
  };

  console.log('🚀 Inserting vehicle with payload:', insertPayload);

  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles_live')
    .insert(insertPayload)
    .select()
    .single();

  if (vehicleError) {
    console.error('❌ Error inserting vehicle:', vehicleError);
    return NextResponse.json({ error: vehicleError.message }, { status: 500 });
  }

  // -----------------------------------------------------------------
  // 4️⃣ If a bay was assigned, mark it Occupied
  // -----------------------------------------------------------------
  if (parsed.data.bay_id) {
    const { error: bayError } = await supabase
      .from('bays')
      .update({
        status:                'Occupied',
        current_vehicle_plate: parsed.data.plate,
        updated_at:            new Date().toISOString(),
      })
      .eq('id', parsed.data.bay_id)
      .eq('tenant_id', ctx.tenantId);

    if (bayError) {
      // We *don’t* want the whole check‑in to fail because a bay update fails.
      // Log it, but still return the newly created vehicle.
      console.error('⚠️ Bay update error (non‑fatal):', bayError);
    }
  }

  console.log('✅ Vehicle inserted successfully:', vehicle);
  return NextResponse.json(vehicle, { status: 201 });
}
