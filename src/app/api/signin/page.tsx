'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Waves, Loader2, ArrowLeft, LayoutDashboard, UserCheck, Wrench, Car } from 'lucide-react'

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  manager:   { label: 'Manager Portal',   color: '#00A8CC', icon: LayoutDashboard },
  agent:     { label: 'Agent Desk',       color: '#10B981', icon: UserCheck },
  attendant: { label: 'Attendant Console',color: '#F59E0B', icon: Wrench },
  customer:  { label: 'Customer Portal',  color: '#8B5CF6', icon: Car },
}

// ── Role → destination ────────────────────────────────────────────────────
function roleToPath(role: string | null): string {
  switch (role) {
    case 'manager':   return '/manager'
    case 'agent':     return '/agent'
    case 'attendant': return '/attendant'
    case 'customer':  return '/customer'
    default:          return '/manager'
  }
}

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const roleMeta = roleParam ? ROLE_META[roleParam] : null

  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [loading, setLoading]               = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError]                   = useState<string | null>(null)

  // ── Check if already signed in ─────────────────────────────────────────
  // If they have a valid session, skip the sign-in page entirely
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          router.replace(roleToPath(data.role))
        }
      } catch {
        // no session — stay on sign-in page
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  // ── Sign in handler ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    try {
      setLoading(true)

      // 1. Sign in — sets Supabase session cookie
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Invalid email or password.')
        return
      }

      // 2. Use the role returned directly from the sign-in response
      //    (POST /api/auth/session already returns { user: { role, ... } })
      const role = data?.user?.role ?? null

      // 3. Redirect to the correct dashboard for this role
      router.push(roleToPath(role))

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Loading screen while checking existing session ─────────────────────
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-sm">Checking session...</span>
      </div>
    )
  }

  // ── Sign-in form ───────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Back to portal selector */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="size-3" /> All Portals
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <Waves className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">SparkFlow</h1>

          {/* Role context badge */}
          {roleMeta ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{ borderColor: roleMeta.color + '40', backgroundColor: roleMeta.color + '10' }}>
              <roleMeta.icon size={12} style={{ color: roleMeta.color }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: roleMeta.color }}>
                {roleMeta.label}
              </span>
            </div>
          ) : (
            <p className="text-slate-500 text-sm font-medium">Sign in to your account</p>
          )}
        </div>

        <Card className="border-none shadow-xl rounded-[2rem]">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@sparkflow.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-12 rounded-xl border-2 font-medium"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-2 font-medium"
                  disabled={loading}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="size-4 animate-spin mr-2" /> Signing in...</>
                  : 'Sign In'
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signup link — show only on customer portal */}
        {roleMeta?.label === 'Customer Portal' && (
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            New customer?{' '}
            <a href="/signup" className="text-primary font-bold hover:underline">
              Create a free account
            </a>
          </p>
        )}

        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          SparkFlow ERP · Immersicloud Consulting
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
