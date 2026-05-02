'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  FoodAgricultureSubcategory,
  FoodAgricultureSpecField,
  getFoodAgricultureSpecsConfig,
  getFoodAgricultureOptionTranslationKey,
  getFoodAgricultureFieldTranslationKey,
  QUANTITY_UNIT_OPTIONS,
  GRADE_OPTIONS,
  FRESHNESS_OPTIONS,
  CERTIFICATION_OPTIONS,
  PRICE_TYPE_OPTIONS,
  DELIVERY_OPTIONS,
} from '@/lib/constants/food-agriculture-wizard';
import { InputField, SelectField, UnitField, ToggleField } from './FoodAgricultureFieldControls';

type FoodAgricultureSpecsData = {
  subcategory: FoodAgricultureSubcategory | '';
  quantity: string;
  unit: string;
  grade: string;
  freshness: string;
  origin: string;
  certification: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  minOrder: string;
  [key: string]: string | number | boolean | undefined;
};

interface StepFoodAgricultureSpecsProps {
  locale: Locale;
  data: FoodAgricultureSpecsData;
  onChange: (updates: Partial<FoodAgricultureSpecsData>) => void;
}

export const StepFoodAgricultureSpecs: React.FC<StepFoodAgricultureSpecsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.foodAgriculture');
  const rtl = isRTL(locale);

  // Helper to get translated option label
  const getOptionLabel = (option: string) => {
    const translationKey = getFoodAgricultureOptionTranslationKey(option);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : option;
  };

  const subcategory = data.subcategory as FoodAgricultureSubcategory;
  const specConfig = subcategory ? getFoodAgricultureSpecsConfig(subcategory) : [];

  const handleFieldChange = (key: string, value: string | number | boolean | undefined) => {
    onChange({ [key]: value });
  };

  // Common field keys that are rendered explicitly at the top
  const commonFieldKeys = ['quantity', 'unit', 'grade', 'freshness', 'origin', 'certification', 'price', 'priceType', 'deliveryAvailable', 'minOrder'];

  const renderField = (field: FoodAgricultureSpecField) => {
    const { key, label, type, required, options, unitOptions, placeholder } = field;
    const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';

    // Helper to create option objects with translated labels
    const createTranslatedOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt)
      }));

    // Helper to create unit option objects with translated labels
    const createTranslatedUnitOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt)
      }));

    // Get field translation key
    const fieldTranslationKey = getFoodAgricultureFieldTranslationKey(key);
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
      case 'unit':
        return (
          <UnitField
            key={key}
            label={fieldLabel}
            required={required}
            rtl={rtl}
            value={data[key] !== undefined && data[key] !== null ? String(data[key]) : ''}
            unitValue={data[`${key}Unit`] !== undefined && data[`${key}Unit`] !== null ? String(data[`${key}Unit`]) : (unitOptions?.[0] || '')}
            onChange={(val) => handleFieldChange(key, val)}
            onUnitChange={(unit) => handleFieldChange(`${key}Unit`, unit)}
            unitOptions={unitOptions ? createTranslatedUnitOptions(unitOptions) : []}
            placeholder={placeholder || undefined}
          />
        );
      case 'toggle':
        return (
          <ToggleField
            key={key}
            label={fieldLabel}
            rtl={rtl}
            checked={!!value}
            onChange={(checked) => handleFieldChange(key, checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-green-50 via-emerald-50 to-lime-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
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
          {/* Quantity with Unit */}
          <UnitField
            label={t('quantityLabel')}
            required
            rtl={rtl}
            value={data.quantity || ''}
            unitValue={data.unit || 'kg'}
            onChange={(val) => handleFieldChange('quantity', val)}
            onUnitChange={(unit) => handleFieldChange('unit', unit)}
            unitOptions={QUANTITY_UNIT_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('quantityPlaceholder')}
          />

          {/* Grade/Quality */}
          <SelectField
            label={t('gradeLabel')}
            required={false}
            rtl={rtl}
            value={data.grade || ''}
            onChange={(val) => handleFieldChange('grade', val)}
            options={GRADE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('gradePlaceholder')}
          />

          {/* Freshness/Condition */}
          <SelectField
            label={t('freshnessLabel')}
            required={false}
            rtl={rtl}
            value={data.freshness || ''}
            onChange={(val) => handleFieldChange('freshness', val)}
            options={FRESHNESS_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('freshnessPlaceholder')}
          />

          {/* Origin/Source */}
          <InputField
            label={t('originLabel')}
            required={false}
            rtl={rtl}
            value={data.origin || ''}
            onChange={(val) => handleFieldChange('origin', val)}
            placeholder={t('originPlaceholder')}
          />

          {/* Certification */}
          <SelectField
            label={t('certificationLabel')}
            required={false}
            rtl={rtl}
            value={data.certification || ''}
            onChange={(val) => handleFieldChange('certification', val)}
            options={CERTIFICATION_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('certificationPlaceholder')}
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

          {/* Minimum Order */}
          <InputField
            label={t('minOrderLabel')}
            required={false}
            rtl={rtl}
            value={data.minOrder || ''}
            onChange={(val) => handleFieldChange('minOrder', val)}
            placeholder={t('minOrderPlaceholder')}
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
