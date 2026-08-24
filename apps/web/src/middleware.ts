import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing, type Locale } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATHS = ['/', '/login', '/register'];

function getLocaleAndPath(pathname: string): { locale: Locale; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && routing.locales.includes(first as Locale)) {
    const rest = '/' + segments.slice(1).join('/');
    return { locale: first as Locale, pathWithoutLocale: rest === '/' ? '/' : rest };
  }
  return { locale: routing.defaultLocale, pathWithoutLocale: pathname };
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('opshub_token')?.value;
  const { locale, pathWithoutLocale } = getLocaleAndPath(pathname);

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathWithoutLocale === p || (p !== '/' && pathWithoutLocale.startsWith(`${p}/`)),
  );

  if (!isPublic && !token) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && token && (pathWithoutLocale === '/' || pathWithoutLocale.startsWith('/login') || pathWithoutLocale.startsWith('/register'))) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
