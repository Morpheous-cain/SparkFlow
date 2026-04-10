import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // ── Build Supabase SSR client ──────────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write refreshed cookies onto both the request and the response
          // so the updated token is available to the route handler
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // ── Refresh session — MUST happen before any auth check ───────────────
  // getUser() validates the JWT with Supabase and refreshes it if expired
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Route classification ───────────────────────────────────────────────
  const isSignIn = pathname === '/signin' || pathname === '/'

  const isProtectedDashboard =
    pathname.startsWith('/manager') ||
    pathname.startsWith('/agent') ||
    pathname.startsWith('/attendant') ||
    pathname.startsWith('/customer')

  const isProtectedApi =
    pathname.startsWith('/api') &&
    !pathname.startsWith('/api/auth') &&
    !pathname.startsWith('/api/services')  // public service list if needed

  // ── Redirect unauthenticated users to /signin ─────────────────────────
  if ((isProtectedDashboard || isProtectedApi) && !user) {
    const redirectUrl = new URL('/signin', request.url)
    // Preserve the page they were trying to reach so we can send them back after login
    if (isProtectedDashboard) {
      redirectUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // ── Redirect already-authenticated users away from /signin ───────────
  // Avoids flicker: if they have a session and hit /, send them to /manager
  // The signin page itself also does this check client-side for a better UX
  if (isSignIn && user) {
    return NextResponse.redirect(new URL('/manager', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (Next.js image optimisation)
     * - favicon.ico
     * - Any file with an image extension
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
