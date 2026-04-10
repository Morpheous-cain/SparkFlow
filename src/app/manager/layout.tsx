'use client'

/**
 * src/app/manager/layout.tsx
 *
 * Wraps every page under /manager.
 * - Guards auth: if no session, redirects to /signin
 * - Shows a loading state while session is being checked
 * - Adds a Sign Out button accessible from every manager page
 *
 * The sidebar/nav that already exists in the project sits inside this layout.
 * If there is already a layout.tsx here, REPLACE it with this file.
 * Keep any existing sidebar JSX — just add the useAuth() call and the
 * sign-out button as shown below.
 */

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  // ── No user — middleware should have redirected, but safety net here ──
  if (!user) return null

  // ── Only managers can access /manager ─────────────────────────────────
  if (user.role !== 'manager') {
    // Wrong role — redirect to their correct dashboard
    const dest = user.role === 'attendant' ? '/attendant'
               : user.role === 'agent'     ? '/agent'
               : '/customer'
    router.replace(dest)
    return null
  }

  return (
    <div className="relative">
      {/* Sign-out button — fixed top-right, visible on all manager pages */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl bg-white shadow-sm border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 font-bold text-xs uppercase tracking-widest"
        >
          <LogOut className="size-3.5" />
          Sign Out
        </Button>
      </div>

      {children}
    </div>
  )
}
