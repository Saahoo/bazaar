// src/components/search/FilterSidebar.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { POPULAR_CITIES, getCityName } from '@/lib/constants/cities';

interface FilterSidebarProps {
  locale: Locale;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  priceMin: string;
  onPriceMinChange: (value: string) => void;
  priceMax: string;
  onPriceMaxChange: (value: string) => void;
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CONDITIONS = [
  { value: 'new', translationKey: 'newCondition' },
  { value: 'like_new', translationKey: 'likeNew' },
  { value: 'good', translationKey: 'good' },
  { value: 'fair', translationKey: 'fair' },
] as const;

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  locale,
  selectedCategory,
  onCategoryChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  selectedConditions,
  onConditionsChange,
  selectedCity,
  onCityChange,
}) => {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  const handleConditionToggle = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-5">
      {/* Category Filter */}
      <div>
        <label
          htmlFor="category-filter"
          className={`block text-sm font-semibold text-slate-800 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {t('filter')} - {tCommon('search')}
        </label>
        <select
          id="category-filter"
          value={selectedCategory ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            onCategoryChange(val === '' ? null : Number(val));
          }}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          <option value="">{tCommon('all')}</option>
          {MAIN_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {getCategoryName(cat.id, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className={`block text-sm font-semibold text-slate-800 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('priceRange')}
        </label>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <input
            type="number"
            placeholder={t('minPrice')}
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            min="0"
            className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
          />
          <input
            type="number"
            placeholder={t('maxPrice')}
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            min="0"
            className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
          />
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <label className={`block text-sm font-semibold text-slate-800 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('condition')}
        </label>
        <div className="space-y-2">
          {CONDITIONS.map(({ value, translationKey }) => (
            <label
              key={value}
              className={`flex items-center gap-2 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedConditions.includes(value)}
                onChange={() => handleConditionToggle(value)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">
                {tCommon(translationKey)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div>
        <label
          htmlFor="city-filter"
          className={`block text-sm font-semibold text-slate-800 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {t('location')}
        </label>
        <select
          id="city-filter"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          <option value="">{tCommon('all')}</option>
          {POPULAR_CITIES.map((city) => (
            <option key={city.name_en} value={city.name_en}>
              {getCityName(city.name_en, locale)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
