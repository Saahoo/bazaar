'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { BABY_KIDS_SUBCATEGORIES, BabyKidsSubcategory } from '@/lib/constants/baby-kids-wizard';
import { InputField } from './BabyKidsFieldControls';

interface StepBabyKidsBasicInfoProps {
  locale: Locale;
  data: {
    subcategory: BabyKidsSubcategory | '';
    title: string;
    description: string;
  };
  onChange: (updates: Partial<{ subcategory: BabyKidsSubcategory | ''; title: string; description: string }>) => void;
}

export const StepBabyKidsBasicInfo: React.FC<StepBabyKidsBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.babyKids');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : ''}`}>
          {t('basicHeading')}
        </h2>
        <p className={`text-sm text-slate-500 mt-1 ${rtl ? 'text-right' : ''}`}>
          {t('basicDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t('fields.title')}
          required
          rtl={rtl}
          value={data.title}
          onChange={(value) => onChange({ title: value })}
          placeholder={t('titlePlaceholder')}
        />

        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : ''}`}>
            {t('fields.description')}
            <span className="text-red-500 mr-1">*</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={t('detailsPlaceholder')}
            rows={4}
            className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          />
          <p className={`text-xs text-slate-400 mt-1 ${rtl ? 'text-right' : ''}`}>
            {t('richTextHint')}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : ''}`}>
            {t('subcategoryLabel')}
            <span className="text-red-500 mr-1">*</span>
          </label>
          <p className={`text-xs text-slate-500 mb-2 ${rtl ? 'text-right' : ''}`}>
            {t('subcategoryDescription')}
          </p>
          <select
            value={data.subcategory}
            onChange={(e) => onChange({ subcategory: e.target.value as BabyKidsSubcategory | '' })}
            className={`w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
          >
            <option value="">{t('subcategoryPlaceholder')}</option>
            {BABY_KIDS_SUBCATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(`subcategories.${item.value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
