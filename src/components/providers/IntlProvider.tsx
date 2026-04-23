'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

/**
 * Client-side wrapper for NextIntlClientProvider to handle non-serializable props.
 *
 * This component is marked with 'use client' to allow passing function props
 * (onError, getMessageFallback) which cannot be serialized across server-client boundary.
 */

interface IntlProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const now = new Date();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      now={now}
      onError={(error) => {
        // Silence MISSING_MESSAGE errors to prevent console spam
        if (error.code !== 'MISSING_MESSAGE') {
          console.error('next-intl error:', error);
        }
      }}
      getMessageFallback={({ key }) => {
        // Smart fallback for missing translation keys
        // Handles both namespace-prefixed keys and raw values
        if (key.startsWith('postAd.realEstate.')) {
          return humanizeKey(key.replace(/^postAd\.realEstate\./, ''));
        }
        if (key.startsWith('common.')) {
          return humanizeKey(key.replace(/^common\./, ''));
        }
        if (key.includes('.')) {
          return humanizeKey(key.split('.').pop() ?? key);
        }
        return humanizeKey(key);
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Convert translation keys to human-readable format.
 * Handles camelCase, snake_case, and dynamic values like city names.
 *
 * @param key - The raw key to humanize
 * @returns Human-readable string
 *
 * @example
 * humanizeKey('propertyType') → 'Property Type'
 * humanizeKey('area_district') → 'Area District'
 * humanizeKey('Kandahar afghanistan') → 'Kandahar Afghanistan'
 * humanizeKey('١١') → '۱۱' (normalized Eastern digits)
 */
function humanizeKey(key: string): string {
  // Handle Eastern Arabic/Persian digits
  let normalized = key.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) =>
    String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  ).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (d) =>
    String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  );

  // Replace underscores and dashes with spaces
  normalized = normalized.replace(/[-_]/g, ' ');

  // Handle camelCase: insert space before uppercase letters
  normalized = normalized.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split into words, trim, and title-case each word
  const words = normalized.split(/\s+/).filter(word => word.length > 0);
  const titleCased = words.map(word =>
    word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word
  );

  return titleCased.join(' ');
}