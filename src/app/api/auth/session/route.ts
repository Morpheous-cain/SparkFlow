import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';

// How long the session cookie lasts — 5 days
const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing ID token' },
        { status: 400 }
      );
    }

    const adminAuth = getAdminAuth();

    // Verify the ID token is valid before creating a session
    await adminAuth.verifyIdToken(idToken);

    // Exchange the ID token for a long-lived session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    const response = NextResponse.json(
      { status: 'success' },
      { status: 200 }
    );

    // Set the session cookie — HttpOnly so JS cannot read it
    response.cookies.set('session', sessionCookie, {
      maxAge: SESSION_DURATION / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;

  } catch (error: unknown) {
    console.error('[session] Error creating session cookie:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json(
      { status: 'success' },
      { status: 200 }
    );

    // Clear the session cookie on logout
    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;

  } catch (error: unknown) {
    console.error('[session] Error clearing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}