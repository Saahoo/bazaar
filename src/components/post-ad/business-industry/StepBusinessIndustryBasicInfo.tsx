'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { BusinessIndustrySubcategory, BUSINESS_INDUSTRY_SUBCATEGORIES } from '@/lib/constants/business-industry-wizard';
import { getCategoryName } from '@/lib/constants/categories';
import { InputField } from './BusinessIndustryFieldControls';

interface StepBusinessIndustryBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    description: string;
    subcategory: BusinessIndustrySubcategory | '';
  };
  onChange: (updates: Partial<{ title: string; description: string; subcategory: BusinessIndustrySubcategory | '' }>) => void;
}

export const StepBusinessIndustryBasicInfo: React.FC<StepBusinessIndustryBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.businessIndustry');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('basicHeading')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('basicDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t('adTitle')}
          required
          rtl={rtl}
          value={data.title}
          onChange={(value) => onChange({ title: value })}
          placeholder={t('titlePlaceholder')}
        />

        <div>
          <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('adDetails')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
            placeholder={t('detailsPlaceholder')}
            dir={rtl ? 'rtl' : 'ltr'}
          />
          <p className="mt-1 text-xs text-slate-500">
            {t('richTextHint')}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('categoryLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm">
            {getCategoryName(16, locale)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {t('categoryDescription')}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('subcategoryLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.subcategory}
            onChange={(e) => onChange({ subcategory: (e.target.value as BusinessIndustrySubcategory) || '' })}
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('subcategoryLabel')}
            title={t('subcategoryLabel')}
          >
            <option value="">{t('subcategoryPlaceholder')}</option>
            {BUSINESS_INDUSTRY_SUBCATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(`subcategories.${item.value}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {t('subcategoryDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};
