#!/bin/bash
# ============================================================
# STEP 2 — Install Supabase packages
# Run from the SparkFlow repo root after STEP 1
# ============================================================

echo "📦  Installing Supabase packages..."
npm install @supabase/supabase-js @supabase/ssr

echo "✅  Done. Now copy the three client files into src/lib/supabase/:"
echo "    client.ts  — browser client"
echo "    server.ts  — SSR client (reads cookies)"
echo "    admin.ts   — service role client (bypasses RLS)"
