import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const userRol = request.cookies.get('user_rol')?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/distribuidor');
  // Redirecting a Server Action POST here (instead of letting it reach the action)
  // sends a plain 3xx that the action client can't parse, crashing with
  // "An unexpected response was received from the server." Let these through;
  // the actions themselves tolerate a missing/expired session.
  const isServerAction = request.headers.has('next-action');

  if (isProtectedRoute && !isServerAction) {
    if (!accessToken || userRol !== 'distribuidora') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'no_access');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/distribuidor/:path*'],
};
