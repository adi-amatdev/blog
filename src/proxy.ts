import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

const publicAdminPaths = ['/admin/login', '/api/admin/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getSessionFromRequest(request, response);

  if (!session.authenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
