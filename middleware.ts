import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/constants/local';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,

  // Locale detection strategy
  localeDetection: true,

  // Optionally, you can configure a custom locale prefix
  // localePrefix: 'as-needed' // or 'always' or 'never'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en)/:path*']
}; 