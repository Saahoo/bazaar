// src/components/layout/LanguageSwitcher.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from '@/lib/i18n/routing';
import { LOCALE_NAMES, LOCALE_FLAGS, LOCALES, Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  compact = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-2 py-1 rounded text-sm font-medium transition ${
              currentLocale === locale
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={LOCALE_NAMES[locale]}
          >
            <span suppressHydrationWarning>{LOCALE_FLAGS[locale]}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
        aria-haspopup="true"
      >
        <span className="text-xl" suppressHydrationWarning>{LOCALE_FLAGS[currentLocale]}</span>
        <span className="text-sm font-medium">{LOCALE_NAMES[currentLocale]}</span>
        <svg
          className="w-4 h-4 text-slate-400 group-hover:text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
        role="menu"
      >
        {LOCALES.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            role="menuitem"
            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-center gap-2 ${
              currentLocale === locale ? 'bg-primary-50 text-primary-600' : ''
            }`}
          >
            <span className="text-xl" suppressHydrationWarning>{LOCALE_FLAGS[locale]}</span>
            <span>{LOCALE_NAMES[locale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
