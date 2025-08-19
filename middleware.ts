import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const UNAUTH_PATHS = ["login", "register"];
  const AUTH_PATHS = ["map"];
  const path = request.nextUrl.pathname;
  const isAuthPath = UNAUTH_PATHS.some((value) => path.includes(value));
  const isUnauthPath = AUTH_PATHS.some((value) => path.includes(value));

  if (isAuthPath) {
    return NextResponse.next();
  }

  if( isUnauthPath) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/map', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/map/:path*'],
};


  