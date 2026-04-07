import createIntlMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ps', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  // 1. Refresh Supabase auth session (keeps cookies alive)
  const supabaseResponse = await updateSession(request);

  // 2. Run i18n middleware for locale routing
  const intlResponse = intlMiddleware(request);

  // Merge Supabase cookies into the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
