'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Waves, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

function SignUpContent() {
  const router = useRouter()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [done,     setDone]     = useState(false)

  const pwdStrong = password.length >= 8
  const pwdMatch  = password === confirm && confirm.length > 0

  async function handleSignUp() {
    setError(null)

    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email and password are required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Sign-up failed. Please try again.')
        return
      }

      setDone(true)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#060E1E] px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="size-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Account Created!</h1>
            <p className="text-slate-500 text-sm mt-2">
              Welcome to SparkFlow, <strong>{name}</strong>. You can now sign in to track your vehicles and manage your loyalty points.
            </p>
          </div>
          <Button
            onClick={() => router.push('/signin?role=customer')}
            className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm border-none shadow-xl"
          >
            Sign In Now
          </Button>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#060E1E] px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Back link */}
        <button
          onClick={() => router.push('/signin?role=customer')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="size-3" /> Back to Sign In
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <Waves className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">SparkFlow</h1>
          <div className="px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
            <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Customer Portal — Create Account</span>
          </div>
        </div>

        {/* Card */}
        <Card className="border-none shadow-xl rounded-3xl dark:bg-[#0F1F3D]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black uppercase tracking-tight dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="dark:text-slate-400">Track your vehicle, earn loyalty points and manage your wash history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
                <p className="text-red-700 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Kamau"
                className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-primary"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-primary"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Phone (M-Pesa)</Label>
              <Input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+254 700 000 000"
                className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</Label>
              <div className="relative">
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="h-12 rounded-xl border-2 pr-12 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <p className={`text-[10px] font-bold mt-1 ${pwdStrong ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pwdStrong ? '✓ Strong password' : '✗ Too short — minimum 8 characters'}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-1">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Confirm Password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="h-12 rounded-xl border-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-semibold focus-visible:ring-primary"
              />
              {confirm.length > 0 && (
                <p className={`text-[10px] font-bold mt-1 ${pwdMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pwdMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm border-none shadow-xl shadow-primary/20 mt-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button onClick={() => router.push('/signin?role=customer')} className="text-primary font-bold hover:underline">
                Sign In
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          SparkFlow ERP · Immersicloud Consulting
        </p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  )
}
