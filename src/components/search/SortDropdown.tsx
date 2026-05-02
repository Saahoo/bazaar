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
        className={`rounded-xl border border-slate-200/80 bg-white/60 px-3 py-2 text-sm backdrop-blur-sm transition-all duration-200 focus:border-primary-400 focus:bg-white/80 focus:shadow-lg focus:ring-4 focus:ring-primary-100/50 focus:outline-none ${isRtl ? 'text-right' : 'text-left'}`}
      >
        <option value="newest">{t('sortNewest')}</option>
        <option value="oldest">{t('sortOldest')}</option>
        <option value="priceLow">{t('sortPriceLow')}</option>
        <option value="priceHigh">{t('sortPriceHigh')}</option>
      </select>
    </div>
  );
};
