import { createClient } from '@supabase/supabase-js'

// WARNING: This client uses the service role key and bypasses ALL Row Level Security.
// Only use server-side, never expose to the browser.
// Use for: admin mutations, seeding, cron jobs, M-Pesa callback processing.

export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
