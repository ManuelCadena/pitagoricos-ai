import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAllowed = (req.auth?.user as any)?.isAllowed ?? false;

  const pathname = nextUrl.pathname;
  const firstSegment = pathname.split('/')[1];
  
  // Redirect root to default locale
  if (pathname === '/') {
    const acceptLanguage = req.headers.get('accept-language') || '';
    const preferredLocale = acceptLanguage.startsWith('en') ? 'en' : defaultLocale;
    return NextResponse.redirect(new URL(`/${preferredLocale}`, nextUrl));
  }

  const locale = locales.includes(firstSegment) ? firstSegment : defaultLocale;

  // Redirect paths without locale to default locale
  if (!locales.includes(firstSegment) && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, nextUrl));
  }

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
