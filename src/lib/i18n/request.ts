// src/lib/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { Locale } from './config';

export async function getMessages(locale: Locale) {
  return (
    await (locale === 'en'
      ? import('../../locales/en/common.json')
      : locale === 'ps'
        ? import('../../locales/ps/common.json')
        : import('../../locales/fa/common.json'))
  ).default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessages(locale as Locale),
  };
});
