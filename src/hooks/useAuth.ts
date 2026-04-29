'use client'

/**
 * useAuth — shared hook for all page components
 *
 * Usage:
 *   const { user, loading, signOut } = useAuth()
 *
 *   if (loading) return <Spinner />
 *   if (!user)   return null  // middleware already redirects, this is a safety net
 *
 *   // user.role is 'manager' | 'agent' | 'attendant' | 'customer'
 *   // user.email, user.id, user.branch_id, user.tenant_id are also available
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type AuthUser = {
  id:         string
  email:      string
  role:       'manager' | 'agent' | 'attendant' | 'customer'
  tenant_id:  string
  branch_id:  string
}

type UseAuthResult = {
  user:    AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthResult {
  const router  = useRouter()
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // ── Fetch current session ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (cancelled) return
        if (res.ok) {
          const data = await res.json()
          setUser({
            id:        data.id        ?? data.uid ?? '',
            email:     data.email     ?? '',
            role:      data.role      ?? 'customer',
            tenant_id: data.tenant_id ?? '',
            branch_id: data.branch_id ?? '',
          })
        } else {
          // 401 — session gone, send to sign in
          router.replace('/signin')
        }
      })
      .catch(() => {
        if (!cancelled) router.replace('/signin')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [router])

  // ── Sign out ──────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch {
      // ignore network errors — still redirect
    }
    setUser(null)
    router.push('/signin')
  }, [router])

  return { user, loading, signOut }
}
