'use client'

/**
 * src/app/attendant/layout.tsx
 * Guards the /attendant route — only attendants get in.
 */

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AttendantLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (!user) return null

  if (user.role !== 'attendant') {
    const dest = user.role === 'manager' ? '/manager'
               : user.role === 'agent'   ? '/agent'
               : '/customer'
    router.replace(dest)
    return null
  }

  return (
    <div className="relative">
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
