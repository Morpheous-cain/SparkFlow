// src/lib/auth-helpers.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Role = 'manager' | 'agent' | 'attendant' | 'customer' | 'saas-admin' | 'driver';

interface UserContext {
  userId: string;
  role: Role;
  tenantId: string;
  branchId: string | null;
}

// -----------------------------------------------------------------
//  Fetch the current user + role in one call.
//  Returns null if unauthenticated or role not found.
// -----------------------------------------------------------------
export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();

  // `supabase.auth.getUser()` reads the JWT cookie that we set above
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Look up the role/tenant/branch from the `user_roles` table.
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role, tenant_id, branch_id')
    .eq('user_id', user.id)
    .single();

  if (roleError || !roleData) {
    console.error('❌ getUserContext – unable to fetch role data', roleError);
    return null;
  }

  return {
    userId:   user.id,
    role:     roleData.role as Role,
    tenantId: roleData.tenant_id,
    branchId: roleData.branch_id,
  };
}

// -----------------------------------------------------------------
//  Guard helpers – call at the top of API routes.
//  Returns a 401/403 NextResponse on failure, or the context on success.
// -----------------------------------------------------------------
export async function requireAuth():
  Promise<{ ctx: UserContext; error: null } | { ctx: null; error: NextResponse }> {
  const ctx = await getUserContext();

  if (!ctx) {
    return {
      ctx: null,
      error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
    };
  }

  return { ctx, error: null };
}

export async function requireManager():
  Promise<{ ctx: UserContext; error: null } | { ctx: null; error: NextResponse }> {
  const { ctx, error } = await requireAuth();
  if (error) return { ctx: null, error };
  if (ctx!.role !== 'manager') {
    return {
      ctx: null,
      error: NextResponse.json({ error: 'Manager access required' }, { status: 403 }),
    };
  }
  return { ctx: ctx!, error: null };
}

export async function requireAgent():
  Promise<{ ctx: UserContext; error: null } | { ctx: null; error: NextResponse }> {
  const { ctx, error } = await requireAuth();
  if (error) return { ctx: null, error };
  if (!['manager', 'agent'].includes(ctx!.role)) {
    return {
      ctx: null,
      error: NextResponse.json({ error: 'Agent access required' }, { status: 403 }),
    };
  }
  return { ctx: ctx!, error: null };
}

export async function requireAttendant():
  Promise<{ ctx: UserContext; error: null } | { ctx: null; error: NextResponse }> {
  const { ctx, error } = await requireAuth();
  if (error) return { ctx: null, error };
  if (!['manager', 'agent', 'attendant'].includes(ctx!.role)) {
    return {
      ctx: null,
      error: NextResponse.json({ error: 'Staff access required' }, { status: 403 }),
    };
  }
  return { ctx: ctx!, error: null };
}

// -----------------------------------------------------------------
//  Convenience booleans (useful in UI code)
// -----------------------------------------------------------------
export const isManager   = (role: Role) => role === 'manager';
export const isAgent     = (role: Role) => ['manager', 'agent'].includes(role);
export const isAttendant = (role: Role) => ['manager', 'agent', 'attendant'].includes(role);
export const isCustomer  = (role: Role) => role === 'customer';
