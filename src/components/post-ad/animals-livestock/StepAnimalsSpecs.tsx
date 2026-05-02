'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AnimalsLivestockSubcategory, getAnimalsSpecsConfig, getBreedSuggestions, HEALTH_STATUS_OPTIONS, PRICE_TYPE_OPTIONS, AGE_UNIT_OPTIONS, getAnimalsOptionTranslationKey, getAnimalsFieldTranslationKey } from '@/lib/constants/animals-livestock-wizard';
import { InputField, SelectField, UnitField, BreedAutosuggest, ToggleField } from './AnimalsFieldControls';


type AnimalsSpecsData = {
  subcategory: AnimalsLivestockSubcategory | '';
  breed: string;
  quantity: string;
  age: string;
  ageUnit: string;
  healthStatus: string;
  price: string;
  priceType: string;
  [key: string]: string | number | boolean | undefined;
};

interface StepAnimalsSpecsProps {
  locale: Locale;
  data: AnimalsSpecsData;
  onChange: (updates: Partial<AnimalsSpecsData>) => void;
}

export const StepAnimalsSpecs: React.FC<StepAnimalsSpecsProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.animals');
  const rtl = isRTL(locale);

  // Helper to get translated option label
  const getOptionLabel = (option: string) => {
    const translationKey = getAnimalsOptionTranslationKey(option);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : option;
  };

  const subcategory = data.subcategory as AnimalsLivestockSubcategory;
  const specConfig = subcategory ? getAnimalsSpecsConfig(subcategory) : [];
  const breedSuggestions = subcategory ? getBreedSuggestions(subcategory) : [];
  const translatedBreedSuggestions = breedSuggestions.map(breed => ({
    value: breed,
    label: getOptionLabel(breed)
  }));


  const handleFieldChange = (key: string, value: string | number | boolean | undefined) => {
    onChange({ [key]: value });
  };


  const renderField = (field: import('@/lib/constants/animals-livestock-wizard').AnimalsSpecField) => {
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
    const fieldTranslationKey = getAnimalsFieldTranslationKey(key);
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
            placeholder={placeholder ? t(placeholder) || placeholder : undefined}
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
            placeholder={placeholder ? t(placeholder) || placeholder : undefined}
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
            placeholder={placeholder ? t(placeholder) || placeholder : undefined}
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
            placeholder={placeholder ? t(placeholder) || placeholder : undefined}
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
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
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
          {/* Breed with auto-suggestions */}
          <div className="md:col-span-2">
            <BreedAutosuggest
              label={t('breedLabel')}
              required
              rtl={rtl}
              value={data.breed || ''}
              onChange={(val) => handleFieldChange('breed', val)}
              suggestions={translatedBreedSuggestions}
              placeholder={t('breedPlaceholder')}
            />
          </div>

          {/* Quantity */}
          <InputField
            label={t('quantityLabel')}
            required
            rtl={rtl}
            value={data.quantity || ''}
            onChange={(val) => handleFieldChange('quantity', val)}
            placeholder={t('quantityPlaceholder')}
            type="number"
          />

          {/* Age with unit */}
          <UnitField
            label={t('ageLabel')}
            required={false}
            rtl={rtl}
            value={data.age || ''}
            unitValue={data.ageUnit || 'months'}
            onChange={(val) => handleFieldChange('age', val)}
            onUnitChange={(unit) => handleFieldChange('ageUnit', unit)}
            unitOptions={AGE_UNIT_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('agePlaceholder')}
          />

          {/* Health Status */}
          <SelectField
            label={t('healthStatusLabel')}
            required
            rtl={rtl}
            value={data.healthStatus || ''}
            onChange={(val) => handleFieldChange('healthStatus', val)}
            options={HEALTH_STATUS_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt)
            }))}
            placeholder={t('healthStatusPlaceholder')}
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

          {/* Render other spec fields based on subcategory */}
          {specConfig
            .filter(field => 
              !['breed', 'quantity', 'age', 'healthStatus', 'price', 'priceType'].includes(field.key)
            )
            .map(renderField)}
        </div>
      )}
    </div>
  );
};