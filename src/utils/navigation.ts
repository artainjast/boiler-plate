import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/constants/local';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale
}); 