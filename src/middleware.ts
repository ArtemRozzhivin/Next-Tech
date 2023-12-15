import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './navigation';

export default createMiddleware({
  locales,   // A list of all locales that are supported
  defaultLocale: 'uk', // Used when no locale matches
  localePrefix, // How to handle locale prefixes in the URL
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|uk)/:path*']
};