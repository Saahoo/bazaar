'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { InputField, SelectField } from './HealthFieldControls';

interface StepHealthGeneralDetailsProps {
  locale: Locale;
  data: {
    price: number | '';
    currency: 'AFN' | 'USD' | 'PKR' | '';
    condition: 'New' | 'Used' | 'Unopened' | '';
    brand: string;
    seller_type: 'Individual' | 'Dealer' | '';
  };
  onChange: (updates: Partial<StepHealthGeneralDetailsProps['data']>) => void;
}

const CONDITION_OPTIONS = ['New', 'Used', 'Unopened'];
const CURRENCY_OPTIONS = ['AFN', 'USD', 'PKR'];

export const StepHealthGeneralDetails: React.FC<StepHealthGeneralDetailsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  const getConditionLabel = (value: string): string => {
    const key = `optionLabels.${value.toLowerCase()}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepGeneral')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('generalDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label={t('price')}
          required
          rtl={rtl}
          type="number"
          value={data.price}
          onChange={(value) => onChange({ price: value === '' ? '' : Number(value) })}
          placeholder={t('pricePlaceholder')}
        />

        <SelectField
          label={t('currency')}
          required
          rtl={rtl}
          value={data.currency}
          onChange={(value) => onChange({ currency: (value as 'AFN' | 'USD' | 'PKR') || '' })}
          placeholder={t('selectCurrency')}
          options={CURRENCY_OPTIONS}
        />

        <SelectField
          label={t('condition')}
          required
          rtl={rtl}
          value={data.condition}
          onChange={(value) => onChange({ condition: (value as 'New' | 'Used' | 'Unopened') || '' })}
          placeholder={t('selectCondition')}
          options={CONDITION_OPTIONS.map((item) => ({ value: item, label: getConditionLabel(item) }))}
        />

        <InputField
          label={t('brand')}
          required
          rtl={rtl}
          value={data.brand}
          onChange={(value) => onChange({ brand: value })}
          placeholder={t('brandPlaceholder')}
        />

        <div className="sm:col-span-2">
          <SelectField
            label={t('seller_type')}
            required
            rtl={rtl}
            value={data.seller_type}
            onChange={(value) => onChange({ seller_type: (value as 'Individual' | 'Dealer') || '' })}
            placeholder={t('selectSellerType')}
            options={[
              { value: 'Individual', label: t('sellerTypeIndividual') },
              { value: 'Dealer', label: t('sellerTypeDealer') },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
