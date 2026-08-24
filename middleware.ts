import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAllowed = (req.auth?.user as any)?.isAllowed ?? false;

  const pathname = nextUrl.pathname;
  const firstSegment = pathname.split('/')[1];
  const locale = locales.includes(firstSegment) ? firstSegment : defaultLocale;

  const publicPaths = [
    `/${locale}/login`,
    `/${locale}/no-autorizado`,
    '/api/auth',
  ];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isApi = pathname.startsWith('/api/');
  const isStatic = pathname.startsWith('/_next/') || pathname.includes('/static/');

  if (isStatic || isApi || isPublic) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));
  }

  if (!isAllowed) {
    return NextResponse.redirect(new URL(`/${locale}/no-autorizado`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
