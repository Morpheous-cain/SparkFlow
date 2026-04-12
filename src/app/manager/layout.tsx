'use client'

/**
 * src/app/manager/layout.tsx
 *
 * Wraps every /manager page with:
 *   - Auth guard (managers only)
 *   - Left sidebar navigation
 *   - Scrollable main content area
 */

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Sidebar } from '@/components/manager/Sidebar'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  // ── No session — middleware already redirects, safety net ────────────────
  if (!user) return null

  // ── Wrong role — bounce to correct dashboard ─────────────────────────────
  if (user.role !== 'manager') {
    const dest = user.role === 'attendant' ? '/attendant'
               : user.role === 'agent'     ? '/agent'
               : '/customer'
    router.replace(dest)
    return null
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* Left sidebar */}
      <Sidebar
        onSignOut={signOut}
        userEmail={user.email}
      />

      {/* Main content — scrollable */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}