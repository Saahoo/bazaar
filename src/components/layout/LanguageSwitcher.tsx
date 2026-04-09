// src/components/layout/LanguageSwitcher.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: Locale) => {
    setOpen(false);
    router.push(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-lg hover:bg-slate-100 transition ${
          compact ? 'px-2.5 py-2 text-sm' : 'px-3 py-2'
        }`}
        aria-haspopup="true"
        type="button"
      >
        <span className="text-base" suppressHydrationWarning>{LOCALE_FLAGS[currentLocale]}</span>
        {!compact && <span className="text-sm font-medium">{LOCALE_NAMES[currentLocale]}</span>}
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
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

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 z-50"
          role="menu"
        >
          {LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              role="menuitem"
              className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 transition flex items-center gap-2 ${
                currentLocale === locale ? 'bg-primary-50 text-primary-600' : 'text-slate-700'
              }`}
              type="button"
            >
              <span className="text-base" suppressHydrationWarning>{LOCALE_FLAGS[locale]}</span>
              <span className="text-sm font-medium">{LOCALE_NAMES[locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
