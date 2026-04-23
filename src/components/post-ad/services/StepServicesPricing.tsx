'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { CURRENCIES } from '@/lib/constants/currencies';
import { PricingType } from '@/lib/constants/services-wizard';
import { InputField, SelectField, ToggleField } from './ServicesFieldControls';

interface StepServicesPricingProps {
  locale: Locale;
  data: {
    pricing_type: PricingType | '';
    price: number | '';
    currency: string;
    negotiable: boolean;
    call_out_fee: boolean;
    call_out_fee_amount: number | '';
  };
  onChange: (updates: Partial<{
    pricing_type: PricingType | '';
    price: number | '';
    currency: string;
    negotiable: boolean;
    call_out_fee: boolean;
    call_out_fee_amount: number | '';
  }>) => void;
}

export const StepServicesPricing: React.FC<StepServicesPricingProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.services');
  const rtl = isRTL(locale);

  const pricingTypeOptions = [
    { value: 'fixed-price', label: t('pricingTypeOptions.fixedPrice') },
    { value: 'hourly-rate', label: t('pricingTypeOptions.hourlyRate') },
    { value: 'daily-rate', label: t('pricingTypeOptions.dailyRate') },
    { value: 'custom-quote', label: t('pricingTypeOptions.customQuote') },
  ];

  const currencyOptions = Object.values(CURRENCIES).map((currency) => ({ value: currency.code, label: `${currency.symbol} ${currency.code}` }));

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepPricing')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('pricingDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SelectField
          label={t('pricingType')}
          required
          rtl={rtl}
          value={data.pricing_type}
          onChange={(value) => onChange({ pricing_type: (value as PricingType) || '' })}
          placeholder={t('selectPricingType')}
          options={pricingTypeOptions}
        />

        <div className={`grid grid-cols-2 gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <InputField
            label={t('price')}
            required
            rtl={rtl}
            type="number"
            value={data.price}
            onChange={(value) => onChange({ price: value ? Number(value) : '' })}
            placeholder={t('pricePlaceholder')}
          />

          <SelectField
            label={t('currency')}
            required
            rtl={rtl}
            value={data.currency}
            onChange={(value) => onChange({ currency: value })}
            placeholder={t('selectCurrency')}
            options={currencyOptions}
          />
        </div>

        <ToggleField
          label={t('negotiable')}
          rtl={rtl}
          value={data.negotiable}
          onChange={(value) => onChange({ negotiable: value })}
          trueLabel={t('yes')}
          falseLabel={t('no')}
        />

        <ToggleField
          label={t('callOutFee')}
          rtl={rtl}
          value={data.call_out_fee}
          onChange={(value) => onChange({ call_out_fee: value })}
          trueLabel={t('yes')}
          falseLabel={t('no')}
        />

        {data.call_out_fee && (
          <InputField
            label={t('callOutFeeAmount')}
            rtl={rtl}
            type="number"
            value={data.call_out_fee_amount}
            onChange={(value) => onChange({ call_out_fee_amount: value ? Number(value) : '' })}
            placeholder={t('amountPlaceholder')}
          />
        )}
      </div>
    </div>
  );
};
