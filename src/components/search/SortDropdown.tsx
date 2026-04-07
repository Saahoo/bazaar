// src/components/search/SortDropdown.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';

interface SortDropdownProps {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ locale, value, onChange }) => {
  const t = useTranslations('search');
  const isRtl = isRTL(locale);

  return (
    <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <label htmlFor="sort-select" className="text-sm font-medium text-slate-600 whitespace-nowrap">
        {t('sort')}:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
      >
        <option value="newest">{t('sortNewest')}</option>
        <option value="oldest">{t('sortOldest')}</option>
        <option value="priceLow">{t('sortPriceLow')}</option>
        <option value="priceHigh">{t('sortPriceHigh')}</option>
      </select>
    </div>
  );
};
