'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { CURRENCIES } from '@/lib/constants/currencies';
import type { ListingType, RealEstatePriceType, RealEstateFurnishing } from './types';

export interface RealEstatePricingData {
  price: number | '';
  currency: string;
  price_type: RealEstatePriceType;
  negotiable: boolean;
  available_from: string;
  furnishing: RealEstateFurnishing;
}

interface StepRealEstatePricingProps {
  locale: Locale;
  listingType: ListingType;
  data: RealEstatePricingData;
  onChange: (data: Partial<RealEstatePricingData>) => void;
}

const PRICE_TYPE_KEYS: Array<{ key: RealEstatePriceType; translationKey: string }> = [
  { key: 'total', translationKey: 'totalPrice' },
  { key: 'monthly', translationKey: 'monthlyRent' },
  { key: 'yearly', translationKey: 'yearlyRent' },
];

const FURNISHING_TYPE_KEYS: Array<{ key: RealEstateFurnishing; translationKey: string }> = [
  { key: 'furnished', translationKey: 'furnished' },
  { key: 'semiFurnished', translationKey: 'semiFurnished' },
  { key: 'unfurnished', translationKey: 'unfurnished' },
];

export const StepRealEstatePricing: React.FC<StepRealEstatePricingProps> = ({
  locale,
  listingType,
  data,
  onChange,
}) => {
  const rtl = isRTL(locale);
  const t = useTranslations('postAd.realEstate');

  const inputClass = `w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`;
  const priceOptions = listingType === 'rent' ? PRICE_TYPE_KEYS.filter((item) => item.key !== 'total') : PRICE_TYPE_KEYS;

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('stepPricing')}
        </h3>

        <div className="grid gap-4">
          <div>
            <label className={labelClass}>
              {t('price')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="number"
                min="0"
                value={data.price}
                onChange={(e) => onChange({ price: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder={t('pricePlaceholder')}
                className={`${inputClass} flex-1`}
                dir="ltr"
              />
              <select
                value={data.currency}
                onChange={(e) => onChange({ currency: e.target.value })}
                className={`${inputClass} w-full sm:w-40`}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                {Object.values(CURRENCIES).map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {t('priceType')} <span className="text-red-500">*</span>
            </label>
            <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
              {priceOptions.map((option) => {
                const selected = data.price_type === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onChange({ price_type: option.key })}
                    className={`px-5 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {t(option.translationKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('availableFrom')}</label>
              <input
                type="date"
                value={data.available_from}
                onChange={(e) => onChange({ available_from: e.target.value })}
                className={inputClass}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label className={labelClass}>{t('furnishing')}</label>
              <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                {FURNISHING_TYPE_KEYS.map((option) => {
                  const selected = data.furnishing === option.key;
                  return (
                    <button
                      type="button"
                      key={option.key}
                      onClick={() => onChange({ furnishing: option.key })}
                      className={`px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition ${
                        selected
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {t(option.translationKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="re-negotiable"
              type="checkbox"
              checked={data.negotiable}
              onChange={(e) => onChange({ negotiable: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="re-negotiable" className="text-sm text-slate-700">
              {t('negotiable')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
