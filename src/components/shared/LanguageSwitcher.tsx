'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, redirect } from '@/utils/navigation';
import { locales } from '@/constants/local';
import { ROUTES } from '@/constants/routes';

export function LanguageSwitcher() {
  const locale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    redirect({ href: ROUTES.dashboard.home, locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-3 py-1 rounded ${
            locale === loc
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
} 