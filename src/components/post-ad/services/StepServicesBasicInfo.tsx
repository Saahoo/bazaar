'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SERVICES_SUBCATEGORIES, ServicesSubcategory, ServiceType } from '@/lib/constants/services-wizard';
import { InputField, SelectField, TextAreaField } from './ServicesFieldControls';

interface StepServicesBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    description: string;
    subcategory: ServicesSubcategory | '';
    service_type: ServiceType | '';
  };
  onChange: (updates: Partial<{
    title: string;
    description: string;
    subcategory: ServicesSubcategory | '';
    service_type: ServiceType | '';
  }>) => void;
}

export const StepServicesBasicInfo: React.FC<StepServicesBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.services');
  const rtl = isRTL(locale);

  const getSubcategoryLabel = (value: ServicesSubcategory): string => {
    const key = value.replace(/-/g, '_') as Parameters<typeof t>[0];
    return t.has(`subcategories.${key}`) ? t(`subcategories.${key}`) : value;
  };

  const serviceTypeOptions = [
    { value: 'on-site', label: t('serviceTypeOptions.onSite') },
    { value: 'at-shop', label: t('serviceTypeOptions.atShop') },
    { value: 'online-remote', label: t('serviceTypeOptions.onlineRemote') },
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
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
          onChange={(value) => onChange({ subcategory: (value as ServicesSubcategory) || '' })}
          placeholder={t('selectSubcategory')}
          options={SERVICES_SUBCATEGORIES.map((item) => ({ value: item.value, label: getSubcategoryLabel(item.value) }))}
        />

        <SelectField
          label={t('serviceType')}
          required
          rtl={rtl}
          value={data.service_type}
          onChange={(value) => onChange({ service_type: (value as ServiceType) || '' })}
          placeholder={t('selectServiceType')}
          options={serviceTypeOptions}
        />
      </div>
    </div>
  );
};
