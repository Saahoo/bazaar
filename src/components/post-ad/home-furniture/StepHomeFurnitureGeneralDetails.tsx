'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SelectField, InputField } from './HomeFurnitureFieldControls';

interface StepHomeFurnitureGeneralDetailsProps {
  locale: Locale;
  data: {
    price: number | '';
    condition: 'New' | 'Used' | 'Refurbished' | '';
    brand: string;
    sellerType: 'Individual' | 'Dealer' | '';
  };
  onChange: (
    updates: Partial<{
      price: number | '';
      condition: 'New' | 'Used' | 'Refurbished' | '';
      brand: string;
      sellerType: 'Individual' | 'Dealer' | '';
    }>
  ) => void;
}

export const StepHomeFurnitureGeneralDetails: React.FC<StepHomeFurnitureGeneralDetailsProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.homeFurniture');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}
      >
        <h3 className="text-lg font-bold text-slate-900">{t('stepGeneral')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('generalDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label={t('price')}
          required
          rtl={rtl}
          value={data.price}
          onChange={(value) => onChange({ price: value ? Number(value) : '' })}
          type="number"
          placeholder={t('pricePlaceholder')}
        />

        <SelectField
          label={t('condition')}
          required
          rtl={rtl}
          value={data.condition}
          onChange={(value) => onChange({ condition: value as 'New' | 'Used' | 'Refurbished' | '' })}
          options={[
            { value: 'New', label: t('optionLabels.new') },
            { value: 'Used', label: t('optionLabels.used') },
            { value: 'Refurbished', label: t('optionLabels.refurbished') },
          ]}
          placeholder={t('selectCondition')}
        />

        <InputField
          label={t('brand')}
          rtl={rtl}
          value={data.brand}
          onChange={(value) => onChange({ brand: value })}
          placeholder={t('brandPlaceholder')}
        />

        <SelectField
          label={t('sellerType')}
          required
          rtl={rtl}
          value={data.sellerType}
          onChange={(value) => onChange({ sellerType: value as 'Individual' | 'Dealer' | '' })}
          options={[
            { value: 'Individual', label: t('sellerTypeIndividual') },
            { value: 'Dealer', label: t('sellerTypeDealer') },
          ]}
          placeholder={t('selectSellerType')}
        />
      </div>
    </div>
  );
};
