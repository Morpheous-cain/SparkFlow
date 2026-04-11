// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// -----------------------------------------------------------------
//  Input validation
// -----------------------------------------------------------------
const SignInSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

// -----------------------------------------------------------------
//  POST /api/auth/session – sign‑in and set JWT cookie
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
  // 2️⃣  Sign‑in with Supabase Auth (public anon key client)
  // -------------------------------------------------------------
  const supabase = await createClient();

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
  // 3️⃣  Pull the user’s role / tenant / branch from `user_roles`
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
  // 4️⃣  **Set the HttpOnly auth cookie** so future requests are
  //     authenticated.  The `setAuthCookie` helper lives on the
  //     *server* version of the Supabase client.  Because our
  //     `createClient()` returns a normal client (which lacks typings
  //     for the method), we cast to `any` – the method still works at
  //     runtime.
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

  // -----------------------------------------------------------------
  // 5️⃣  Build the Set‑Cookie header
  // -----------------------------------------------------------------
  // Options mirror what Supabase docs recommend.
  // Adjust maxAge / sameSite / secure to your needs.
  const cookie = (supabase as any).auth.setAuthCookie(
    data.session?.access_token ?? '',
    {
      maxAge:   60 * 60 * 24 * 7,         // 7 days
      httpOnly: true,
      sameSite: 'lax',
      path:     '/',
      secure:   process.env.NODE_ENV === 'production',
    }
  );

  response.headers.set('Set-Cookie', cookie);
  return response;
}

// -----------------------------------------------------------------
//  DELETE /api/auth/session – sign‑out & clear cookie
// -----------------------------------------------------------------
export async function DELETE() {
  const supabase = await createClient();

  // Revoke the server‑side session (removes refresh token, etc.)
  await supabase.auth.signOut();

  // Build a response that clears the auth cookie on the client
  const response = NextResponse.json({ success: true });

  // Setting the cookie with an empty value & maxAge 0 removes it.
  const clearCookie = (supabase as any).auth.setAuthCookie('', {
    maxAge:   0,
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    secure:   process.env.NODE_ENV === 'production',
  });

  response.headers.set('Set-Cookie', clearCookie);
  return response;
}
