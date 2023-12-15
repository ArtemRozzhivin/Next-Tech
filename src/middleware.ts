import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['uk', 'en'],

  // Used when no locale matches
  defaultLocale: 'uk'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|uk)/:path*']
};