// src/lib/i18n/config.ts
export const LOCALES = ['en', 'ps', 'fa'] as const;
export const DEFAULT_LOCALE = 'en' as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ps: 'پښتو',
  fa: 'دری',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'EN',
  ps: 'PS',
  fa: 'FA',
};

export const isRTL = (locale: Locale): boolean => {
  return locale === 'ps' || locale === 'fa';
};

export const getDir = (locale: Locale): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

export const i18nConfig = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
};
