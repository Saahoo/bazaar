'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  BusinessIndustrySubcategory,
  BusinessIndustrySpecField,
  getBusinessIndustrySpecsConfig,
  getBusinessIndustryOptionTranslationKey,
  getBusinessIndustryFieldTranslationKey,
  CONDITION_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  INDUSTRY_SECTOR_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
  WARRANTY_OPTIONS,
} from '@/lib/constants/business-industry-wizard';
import { InputField, SelectField, ToggleField } from './BusinessIndustryFieldControls';

type BusinessIndustrySpecsData = {
  subcategory: BusinessIndustrySubcategory | '';
  condition: string;
  businessType: string;
  industrySector: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  warranty: string;
  [key: string]: string | number | boolean | undefined;
};

interface StepBusinessIndustrySpecsProps {
  locale: Locale;
  data: BusinessIndustrySpecsData;
  onChange: (updates: Partial<BusinessIndustrySpecsData>) => void;
}

export const StepBusinessIndustrySpecs: React.FC<StepBusinessIndustrySpecsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.businessIndustry');
  const rtl = isRTL(locale);

  // Helper to get translated option label
  const getOptionLabel = (option: string) => {
    const translationKey = getBusinessIndustryOptionTranslationKey(option);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : option;
  };

  const subcategory = data.subcategory as BusinessIndustrySubcategory;
  const specConfig = subcategory ? getBusinessIndustrySpecsConfig(subcategory) : [];

  const handleFieldChange = (key: string, value: string | number | boolean | undefined) => {
    onChange({ [key]: value });
  };

  // Common field keys that are rendered explicitly at the top
  const commonFieldKeys = ['condition', 'businessType', 'industrySector', 'price', 'priceType', 'deliveryAvailable', 'warranty'];

  const renderField = (field: BusinessIndustrySpecField) => {
    const { key, label, type, required, options, placeholder } = field;
    const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';

    // Helper to create option objects with translated labels
    const createTranslatedOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt)
      }));

    // Get field translation key
    const fieldTranslationKey = getBusinessIndustryFieldTranslationKey(key);
    const fieldLabel = t.has(fieldTranslationKey as Parameters<typeof t>[0])
      ? t(fieldTranslationKey as Parameters<typeof t>[0])
      : label;

    switch (type) {
      case 'text':
        return (
          <InputField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            placeholder={placeholder || undefined}
          />
        );
      case 'number':
        return (
          <InputField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            placeholder={placeholder || undefined}
            type="number"
          />
        );
      case 'select':
        return (
          <SelectField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            options={options ? createTranslatedOptions(options) : []}
            placeholder={placeholder || undefined}
          />
        );
      case 'toggle':
        return (
          <ToggleField
            key={key}
            label={fieldLabel}
            rtl={rtl}
            checked={!!data[key]}
            onChange={(checked) => handleFieldChange(key, checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('specsHeading')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('specsDescription')}</p>
      </div>

      {!subcategory ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-amber-800">
            {t('selectSubcategoryFirst')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Condition */}
          <SelectField
            label={t('conditionLabel')}
            required
            rtl={rtl}
            value={data.condition || ''}
            onChange={(val) => handleFieldChange('condition', val)}
            options={CONDITION_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('conditionPlaceholder')}
          />

          {/* Seller Type / Business Type */}
          <SelectField
            label={t('businessTypeLabel')}
            required
            rtl={rtl}
            value={data.businessType || ''}
            onChange={(val) => handleFieldChange('businessType', val)}
            options={BUSINESS_TYPE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('businessTypePlaceholder')}
          />

          {/* Industry Sector */}
          <SelectField
            label={t('industrySectorLabel')}
            required={false}
            rtl={rtl}
            value={data.industrySector || ''}
            onChange={(val) => handleFieldChange('industrySector', val)}
            options={INDUSTRY_SECTOR_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('industrySectorPlaceholder')}
          />

          {/* Price */}
          <InputField
            label={t('priceLabel')}
            required
            rtl={rtl}
            value={data.price || ''}
            onChange={(val) => handleFieldChange('price', val)}
            placeholder={t('pricePlaceholder')}
            type="number"
          />

          {/* Price Type */}
          <SelectField
            label={t('priceTypeLabel')}
            required
            rtl={rtl}
            value={data.priceType || ''}
            onChange={(val) => handleFieldChange('priceType', val)}
            options={PRICE_TYPE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('priceTypePlaceholder')}
          />

          {/* Delivery Available */}
          <SelectField
            label={t('deliveryAvailableLabel')}
            required={false}
            rtl={rtl}
            value={data.deliveryAvailable || ''}
            onChange={(val) => handleFieldChange('deliveryAvailable', val)}
            options={DELIVERY_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('deliveryAvailablePlaceholder')}
          />

          {/* Warranty */}
          <SelectField
            label={t('warrantyLabel')}
            required={false}
            rtl={rtl}
            value={data.warranty || ''}
            onChange={(val) => handleFieldChange('warranty', val)}
            options={WARRANTY_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('warrantyPlaceholder')}
          />

          {/* Render subcategory-specific spec fields dynamically */}
          {specConfig
            .filter(field => !commonFieldKeys.includes(field.key))
            .map(renderField)}
        </div>
      )}
    </div>
  );
};
