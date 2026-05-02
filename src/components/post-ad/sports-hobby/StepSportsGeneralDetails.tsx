'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SPORTS_HOBBY_BRANDS_BY_SUBCATEGORY, SPORTS_HOBBY_CONDITIONS } from '@/lib/constants/sports-hobby-wizard';
import { SportsHobbySubcategory } from '@/lib/constants/sports-hobby-wizard';

interface StepSportsGeneralDetailsProps {
  locale: Locale;
  subcategory: SportsHobbySubcategory | '';
  data: {
    price: number | '';
    currency: 'AFN' | 'USD' | 'PKR' | '';
    condition: 'New' | 'Used' | 'Refurbished' | '';
    brand: string;
    brandOther: string;
    sellerType: 'Individual' | 'Dealer' | '';
    city: string;
  };
  onChange: (updates: Partial<StepSportsGeneralDetailsProps['data']>) => void;
}

const CURRENCY_OPTIONS = ['AFN', 'USD', 'PKR'];

export const StepSportsGeneralDetails: React.FC<StepSportsGeneralDetailsProps> = ({ 
  locale, 
  subcategory, 
  data, 
  onChange 
}) => {
  const t = useTranslations('postAd.sportsHobby');
  const rtl = isRTL(locale);

  // Get brand options for the current subcategory
  const brandOptions = subcategory ? SPORTS_HOBBY_BRANDS_BY_SUBCATEGORY[subcategory] || [] : [];
  const optionsWithOther = brandOptions.includes('Other') ? brandOptions : [...brandOptions, 'Other'];

  const getConditionLabel = (value: string): string => {
    const key = `optionLabels.${value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  const getBrandLabel = (option: string): string => {
    if (option === 'Other') return t('other');
    const key = `optionLabels.${option.toLowerCase().replace(/&/g, 'and').replace(/'/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : option;
  };

  const inputClass = (hasError: boolean = false) =>
    `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
        : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('generalDetails')}
        </h3>
        <p className={`text-sm text-slate-500 mt-1 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('generalDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Price */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('price')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.price}
            onChange={(e) => onChange({ price: e.target.value ? Number(e.target.value) : '' })}
            placeholder={t('pricePlaceholder')}
            className={inputClass()}
            min="0"
            step="0.01"
          />
        </div>

        {/* Currency */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('currency')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.currency}
            onChange={(e) => onChange({ currency: e.target.value as 'AFN' | 'USD' | 'PKR' | '' })}
            className={`${inputClass()} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('currency')}
            title={t('currency')}
          >
            <option value="">{t('selectCurrency')}</option>
            {CURRENCY_OPTIONS.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('condition')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.condition}
            onChange={(e) => onChange({ condition: e.target.value as 'New' | 'Used' | 'Refurbished' | '' })}
            className={`${inputClass()} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('condition')}
            title={t('condition')}
          >
            <option value="">{t('selectCondition')}</option>
            {SPORTS_HOBBY_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {getConditionLabel(condition)}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('brand')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.brand}
            onChange={(e) => onChange({ 
              brand: e.target.value, 
              brandOther: e.target.value === 'Other' ? data.brandOther : '' 
            })}
            className={`${inputClass()} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('brand')}
            title={t('brand')}
          >
            <option value="">{t('selectBrand')}</option>
            {optionsWithOther.map((brand) => (
              <option key={brand} value={brand}>
                {getBrandLabel(brand)}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Other (if "Other" is selected) */}
        {data.brand === 'Other' && (
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('brandOther')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.brandOther}
              onChange={(e) => onChange({ brandOther: e.target.value })}
              placeholder={t('brandOtherPlaceholder')}
              className={inputClass()}
            />
          </div>
        )}

        {/* Seller Type */}
        <div className="sm:col-span-2">
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('sellerType')} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.sellerType}
            onChange={(e) => onChange({ sellerType: e.target.value as 'Individual' | 'Dealer' | '' })}
            className={`${inputClass()} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={t('sellerType')}
            title={t('sellerType')}
          >
            <option value="">{t('selectSellerType')}</option>
            <option value="Individual">{t('sellerTypeIndividual')}</option>
            <option value="Dealer">{t('sellerTypeDealer')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};