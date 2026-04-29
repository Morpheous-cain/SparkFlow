// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// -----------------------------------------------------------------
//  Input validation – email + password
// -----------------------------------------------------------------
const SignInSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

// -----------------------------------------------------------------
//  POST /api/auth/session – sign‑in and set an HttpOnly JWT cookie
// -----------------------------------------------------------------
export async function POST(request: NextRequest) {
  // -------------------------------------------------------------
  // 1️⃣  Parse & validate payload
  // -------------------------------------------------------------
  const body = await request.json();
  const parsed = SignInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // -------------------------------------------------------------
  // 2️⃣  Build a **regular** Supabase client (the one you already use)
  // -------------------------------------------------------------
  const supabase = await createClient();

  // -------------------------------------------------------------
  // 3️⃣  Sign‑in with email + password
  // -------------------------------------------------------------
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }

  // -------------------------------------------------------------
  // 4️⃣  Grab the user’s role / tenant / branch from `user_roles`
  // -------------------------------------------------------------
  const {
    data: roleData,
    error: roleError,
  } = await supabase
    .from('user_roles')
    .select('role, tenant_id, branch_id')
    .eq('user_id', data.user?.id)
    .single();

  if (roleError) {
    console.error('❌ Could not fetch role data', roleError);
    return NextResponse.json(
      { error: 'Unable to determine user role' },
      { status: 500 }
    );
  }

  // -------------------------------------------------------------
  // 5️⃣  Build the JSON response that the front‑end expects
  // -------------------------------------------------------------
  const response = NextResponse.json({
    user: {
      id:        data.user?.id,
      email:     data.user?.email,
      role:      roleData?.role ?? null,
      tenant_id: roleData?.tenant_id ?? null,
      branch_id: roleData?.branch_id ?? null,
    },
  });

  // -------------------------------------------------------------
  // 6️⃣  **Manually create the Set‑Cookie header**.
  //     Supabase returns the access token in `data.session.access_token`.
  // -------------------------------------------------------------
  const accessToken = data.session?.access_token ?? '';

  // Cookie name `sb-access-token` matches what the Supabase client expects.
  // Adjust maxAge (7 days) or other options if you need a different TTL.
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds
  const cookieParts = [
    `sb-access-token=${accessToken}`,
    `Path=/`,
    `HttpOnly`,
    `Max-Age=${maxAge}`,
    `SameSite=Lax`,
    process.env.NODE_ENV === 'production' ? `Secure` : '',
  ]
    .filter(Boolean) // removes the empty string when not in prod
    .join('; ');

  // Attach the cookie to the response
  response.headers.set('Set-Cookie', cookieParts);
  return response;
}

// -----------------------------------------------------------------
//  DELETE /api/auth/session – sign‑out and clear the auth cookie
// -----------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  // Use the same client we used for sign‑in
  const supabase = await createClient();

  // Invalidate the server‑side session (revokes refresh token, etc.)
  await supabase.auth.signOut();

  // Build a simple success response
  const response = NextResponse.json({ success: true });

  // Clear the cookie by setting an empty value and Max‑Age=0
  const clearCookie = [
    `sb-access-token=`,
    `Path=/`,
    `HttpOnly`,
    `Max-Age=0`,
    `SameSite=Lax`,
    process.env.NODE_ENV === 'production' ? `Secure` : '',
  ]
    .filter(Boolean)
    .join('; ');

  response.headers.set('Set-Cookie', clearCookie);
  return response;
}
