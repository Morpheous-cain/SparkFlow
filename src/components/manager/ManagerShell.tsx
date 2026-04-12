'use client'

// src/components/manager/ManagerShell.tsx
// Client component that handles auth guard + sidebar layout.
// Kept separate from layout.tsx so the layout can be a server component,
// which is required for the sidebar to persist across sub-page navigations.

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Sidebar } from '@/components/manager/Sidebar'

export function ManagerShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3 bg-[#f1f5f9]">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  // No session
  if (!user) return null

  // Wrong role — redirect to correct dashboard
  if (user.role !== 'manager') {
    const dest = user.role === 'attendant' ? '/attendant'
               : user.role === 'agent'     ? '/agent'
               : '/customer'
    router.replace(dest)
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      <Sidebar onSignOut={signOut} userEmail={user.email} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
