'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { getCategoryName } from '@/lib/constants/categories';
import {
  CONSTRUCTION_MATERIALS_SUBCATEGORIES,
  CONSTRUCTION_MATERIALS_SUBCATEGORY_LABEL_KEYS,
  ConstructionMaterialsSubcategory,
} from '@/lib/constants/construction-materials-wizard';
import { InputField } from './ConstructionMaterialsFieldControls';

interface StepConstructionMaterialsBasicInfoProps {
  locale: Locale;
  data: {
    subcategory: ConstructionMaterialsSubcategory | '';
    title: string;
    description: string;
  };
  onChange: (updates: Partial<{ subcategory: ConstructionMaterialsSubcategory | ''; title: string; description: string }>) => void;
}

export const StepConstructionMaterialsBasicInfo: React.FC<StepConstructionMaterialsBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.constructionMaterials');
  const rtl = isRTL(locale);
  const categoryName = getCategoryName(18, locale);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Category Display */}
      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('category')}
        </label>
        <div className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 ${rtl ? 'text-right' : 'text-left'}`}>
          {categoryName}
        </div>
      </div>

      {/* Subcategory */}
      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('subcategory')}
          <span className="text-red-500 mr-1">*</span>
        </label>
        <select
          value={data.subcategory}
          onChange={(e) => onChange({ subcategory: e.target.value as ConstructionMaterialsSubcategory | '' })}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
        >
          <option value="">{t('selectSubcategory')}</option>
          {CONSTRUCTION_MATERIALS_SUBCATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {t(`subcategories.${CONSTRUCTION_MATERIALS_SUBCATEGORY_LABEL_KEYS[item.value]}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <InputField
        label={t('fields.title')}
        value={data.title}
        onChange={(value) => onChange({ title: value })}
        placeholder={t('fields.titlePlaceholder')}
        required
        locale={locale}
      />

      {/* Description */}
      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('fields.description')}
          <span className="text-red-500 mr-1">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t('fields.descriptionPlaceholder')}
          rows={4}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
        />
      </div>
    </div>
  );
};
