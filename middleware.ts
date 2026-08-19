import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const userRol = request.cookies.get('user_rol')?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/distribuidor');

  if (isProtectedRoute) {
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
