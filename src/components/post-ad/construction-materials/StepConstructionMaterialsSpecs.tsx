'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import {
  ConstructionMaterialsSubcategory,
  ConstructionMaterialsSpecField,
  getConstructionMaterialsSpecsConfig,
  CM_QUANTITY_UNIT_OPTIONS,
  CM_CONDITION_OPTIONS,
  CM_PRICE_TYPE_OPTIONS,
  CM_DELIVERY_OPTIONS,
} from '@/lib/constants/construction-materials-wizard';
import { InputField, SelectField, UnitField, ToggleField } from './ConstructionMaterialsFieldControls';

type ConstructionMaterialsSpecsData = {
  quantity: number | '';
  unit: string;
  condition: string;
  price: number | '';
  priceType: string;
  deliveryAvailable: string;
  minOrder: string;
  [key: string]: unknown;
};

interface StepConstructionMaterialsSpecsProps {
  locale: Locale;
  data: ConstructionMaterialsSpecsData;
  subcategory: ConstructionMaterialsSubcategory | '';
  onChange: (updates: Partial<ConstructionMaterialsSpecsData>) => void;
}

export const StepConstructionMaterialsSpecs: React.FC<StepConstructionMaterialsSpecsProps> = ({ locale, data, subcategory, onChange }) => {
  const t = useTranslations('postAd.constructionMaterials');
  const rtl = isRTL(locale);

  const getOptionLabel = (option: string) => {
    try {
      return t(`optionLabels.${option}`);
    } catch {
      return option;
    }
  };

  const specFields = subcategory ? getConstructionMaterialsSpecsConfig(subcategory) : [];

  const renderField = (field: ConstructionMaterialsSpecField) => {
    const { key, type, required, placeholder } = field;
    const label = t(getConstructionMaterialsFieldTranslationKey(key));
    const value = data[key] as string | number | boolean;

    const createTranslatedOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt),
      }));

    const createTranslatedUnitOptions = (opts: string[]) =>
      opts.map(opt => ({
        value: opt,
        label: getOptionLabel(opt),
      }));

    switch (type) {
      case 'text':
        return (
          <InputField
            key={key}
            label={label}
            value={(value as string) || ''}
            onChange={(v) => onChange({ [key]: v })}
            placeholder={placeholder ? t(`fields.${key}Placeholder`) : undefined}
            required={required}
            locale={locale}
          />
        );
      case 'number':
        return (
          <InputField
            key={key}
            label={label}
            value={(value as number | string) || ''}
            onChange={(v) => onChange({ [key]: v })}
            placeholder={placeholder ? t(`fields.${key}Placeholder`) : undefined}
            required={required}
            type="number"
            locale={locale}
          />
        );
      case 'select':
        return (
          <SelectField
            key={key}
            label={label}
            value={(value as string) || ''}
            onChange={(v) => onChange({ [key]: v })}
            options={createTranslatedOptions(field.options || [])}
            required={required}
            placeholder={t('selectOption')}
            locale={locale}
          />
        );
      case 'unit':
        return (
          <UnitField
            key={key}
            label={label}
            value={(value as number | string) || ''}
            onChange={(v) => onChange({ [key]: v })}
            unitValue={(data[`${key}Unit`] as string) || ''}
            onUnitChange={(v) => onChange({ [`${key}Unit`]: v })}
            unitOptions={createTranslatedUnitOptions(field.unitOptions || [])}
            required={required}
            placeholder={placeholder ? t(`fields.${key}Placeholder`) : undefined}
            locale={locale}
          />
        );
      case 'toggle':
        return (
          <ToggleField
            key={key}
            label={label}
            value={(value as boolean) || false}
            onChange={(v) => onChange({ [key]: v })}
            locale={locale}
          />
        );
      default:
        return null;
    }
  };

  const commonFieldKeys = ['quantity', 'unit', 'condition', 'price', 'priceType', 'deliveryAvailable', 'minOrder'];

  return (
    <div className="space-y-6">
      {!subcategory ? (
        <p className={`text-sm text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('selectSubcategoryFirst')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common fields rendered explicitly */}
          <UnitField
            label={t('fields.quantity')}
            value={data.quantity || ''}
            onChange={(v) => onChange({ quantity: v === '' ? '' : (Number(v) || '') })}
            unitValue={data.unit || ''}
            onUnitChange={(v) => onChange({ unit: v })}
            unitOptions={CM_QUANTITY_UNIT_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt),
            }))}
            required
            placeholder={t('fields.quantityPlaceholder')}
            locale={locale}
          />

          <SelectField
            label={t('fields.condition')}
            value={data.condition || ''}
            onChange={(v) => onChange({ condition: v })}
            options={CM_CONDITION_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt),
            }))}
            placeholder={t('selectOption')}
            locale={locale}
          />

          <InputField
            label={t('fields.price')}
            value={data.price || ''}
            onChange={(v) => onChange({ price: v === '' ? '' : (Number(v) || '') })}
            required
            type="number"
            locale={locale}
          />

          <SelectField
            label={t('fields.priceType')}
            value={data.priceType || ''}
            onChange={(v) => onChange({ priceType: v })}
            options={CM_PRICE_TYPE_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt),
            }))}
            required
            placeholder={t('selectOption')}
            locale={locale}
          />

          <SelectField
            label={t('fields.deliveryAvailable')}
            value={data.deliveryAvailable || ''}
            onChange={(v) => onChange({ deliveryAvailable: v })}
            options={CM_DELIVERY_OPTIONS.map(opt => ({
              value: opt,
              label: getOptionLabel(opt),
            }))}
            placeholder={t('selectOption')}
            locale={locale}
          />

          <InputField
            label={t('fields.minOrder')}
            value={data.minOrder || ''}
            onChange={(v) => onChange({ minOrder: v })}
            placeholder={t('fields.minOrderPlaceholder')}
            locale={locale}
          />

          {/* Subcategory-specific fields */}
          {specFields
            .filter((field) => !commonFieldKeys.includes(field.key))
            .map((field) => renderField(field))}
        </div>
      )}
    </div>
  );
};

// Helper function to get translation key for a field
function getConstructionMaterialsFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

export type { ConstructionMaterialsSpecsData };
