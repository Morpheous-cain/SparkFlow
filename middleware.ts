import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

// Routes that don't need authentication
const PUBLIC_ROUTES = [
  '/',
  '/api/auth/session',
];

// Role-based route protection
const ROLE_ROUTES: Record<string, string[]> = {
  '/manager': ['manager'],
  '/agent': ['agent', 'manager'],
  '/attendant': ['attendant', 'manager'],
  '/customer': ['customer'],
  '/saas-admin': ['saas-admin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes through immediately
  if (PUBLIC_ROUTES.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;

  // No session cookie — redirect to home
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const adminAuth = getAdminAuth();
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // Check if cookie has been revoked
    );

    // Check role-based access
    const matchedRoute = Object.keys(ROLE_ROUTES).find(route =>
      pathname.startsWith(route)
    );

    if (matchedRoute) {
      const allowedRoles = ROLE_ROUTES[matchedRoute];
      const userRole = decodedClaims.role as string;

      if (!userRole || !allowedRoles.includes(userRole)) {
        // User is authenticated but wrong role — redirect to their own dashboard
        const userDashboard = `/${userRole || ''}`;
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
    }

    // Attach user info to request headers for use in route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-uid', decodedClaims.uid);
    requestHeaders.set('x-user-role', decodedClaims.role as string ?? '');
    requestHeaders.set('x-user-email', decodedClaims.email ?? '');

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (error) {
    console.error('[middleware] Invalid session:', error);

    // Invalid or expired cookie — clear it and redirect to home
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      path: '/',
    });
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
