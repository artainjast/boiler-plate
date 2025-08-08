export type Locale = (typeof locales)[number];

export const locales = ['en'] as const;
export const defaultLocale: Locale = 'en';
export const COOKIE_NAME = 'NEXT_LOCALE';
export const TOKEN_LOCAL_STORAGE_NAME = 'site-token';
export const REFRESH_TOKEN_LOCAL_STORAGE_NAME = 'refresh-token';
