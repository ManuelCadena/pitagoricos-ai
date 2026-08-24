import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAllowed = (req.auth?.user as any)?.isAllowed ?? false;

  const publicPaths = ['/login', '/no-autorizado', '/api/auth'];
  const isPublic = publicPaths.some((p) => nextUrl.pathname.startsWith(p));
  const isApi = nextUrl.pathname.startsWith('/api/');

  if (isApi || isPublic) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (!isAllowed) {
    return NextResponse.redirect(new URL('/no-autorizado', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
