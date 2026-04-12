'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SPARE_PARTS_SUBCATEGORIES, SparePartsSubcategory } from '@/lib/constants/spare-parts-wizard';
import { InputField, SelectField, TextAreaField } from './SpareFieldControls';

interface StepSpareBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    description: string;
    subcategory: SparePartsSubcategory | '';
  };
  onChange: (updates: Partial<{ title: string; description: string; subcategory: SparePartsSubcategory | '' }>) => void;
}

export const StepSpareBasicInfo: React.FC<StepSpareBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const getSubcategoryLabel = (value: SparePartsSubcategory): string => {
    const key = `subcategories.${value}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
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
          onChange={(value) => onChange({ subcategory: (value as SparePartsSubcategory) || '' })}
          placeholder={t('selectSubcategory')}
          options={SPARE_PARTS_SUBCATEGORIES.map((item) => ({ value: item.value, label: getSubcategoryLabel(item.value) }))}
        />
      </div>
    </div>
  );
};
