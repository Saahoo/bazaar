'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  HomeFurnitureSubcategory,
  HOME_FURNITURE_SUBCATEGORIES,
  HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS,
} from '@/lib/constants/home-furniture-wizard';
import { InputField } from './HomeFurnitureFieldControls';

interface StepHomeFurnitureBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    description: string;
    subcategory: HomeFurnitureSubcategory | '';
  };
  onChange: (
    updates: Partial<{ title: string; description: string; subcategory: HomeFurnitureSubcategory | '' }>
  ) => void;
}

export const StepHomeFurnitureBasicInfo: React.FC<StepHomeFurnitureBasicInfoProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.homeFurniture');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}
      >
        <h3 className="text-lg font-bold text-slate-900">{t('stepBasic')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('basicDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t('title')}
          required
          rtl={rtl}
          value={data.title}
          onChange={(value) => onChange({ title: value })}
          placeholder={t('titlePlaceholder')}
        />

        <div>
          <label
            className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {t('description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
            placeholder={t('descriptionPlaceholder')}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {t('subcategory')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.subcategory}
            onChange={(e) =>
              onChange({ subcategory: (e.target.value as HomeFurnitureSubcategory) || '' })
            }
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('subcategory')}
            title={t('subcategory')}
          >
            <option value="">{t('selectSubcategory')}</option>
            {HOME_FURNITURE_SUBCATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS[item.value] as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
