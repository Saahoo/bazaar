'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { HEALTH_BEAUTY_SUBCATEGORIES, HealthBeautySubcategory } from '@/lib/constants/health-beauty-wizard';
import { InputField, SelectField, TextAreaField } from './HealthFieldControls';

interface StepHealthBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    description: string;
    subcategory: HealthBeautySubcategory | '';
  };
  onChange: (updates: Partial<{ title: string; description: string; subcategory: HealthBeautySubcategory | '' }>) => void;
}

export const StepHealthBasicInfo: React.FC<StepHealthBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  const getSubcategoryLabel = (value: HealthBeautySubcategory): string => {
    const key = `subcategories.${value}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
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

        <TextAreaField
          label={t('description')}
          required
          rtl={rtl}
          value={data.description}
          onChange={(value) => onChange({ description: value })}
          placeholder={t('descriptionPlaceholder')}
          rows={5}
        />

        <SelectField
          label={t('subcategory')}
          required
          rtl={rtl}
          value={data.subcategory}
          onChange={(value) => onChange({ subcategory: (value as HealthBeautySubcategory) || '' })}
          placeholder={t('selectSubcategory')}
          options={HEALTH_BEAUTY_SUBCATEGORIES.map((item) => ({ value: item.value, label: getSubcategoryLabel(item.value) }))}
        />
      </div>
    </div>
  );
};
