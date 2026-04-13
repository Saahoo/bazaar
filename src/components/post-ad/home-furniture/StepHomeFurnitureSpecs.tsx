'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  HomeFurnitureSubcategory,
  HomeFurnitureSpecField,
  getHomeFurnitureSpecsConfig,
  getHomeFurnitureFieldTranslationKey,
  getHomeFurnitureOptionTranslationKey,
} from '@/lib/constants/home-furniture-wizard';
import { InputField, SelectField, MultiSelectField, ToggleField } from './HomeFurnitureFieldControls';

interface StepHomeFurnitureSpecsProps {
  locale: Locale;
  subcategory: HomeFurnitureSubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

const toStringValue = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const toNumberValue = (value: unknown): string =>
  value !== undefined && value !== null && value !== '' ? String(value) : '';

const toArrayValue = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const toBooleanValue = (value: unknown): boolean => value === true;

const withOtherOption = (options: string[] | undefined): string[] => {
  const source = options || [];
  return source.includes('Other') ? source : [...source, 'Other'];
};

export const StepHomeFurnitureSpecs: React.FC<StepHomeFurnitureSpecsProps> = ({
  locale,
  subcategory,
  specs,
  onChange,
}) => {
  const t = useTranslations('postAd.homeFurniture');
  const rtl = isRTL(locale);
  const fields = useMemo(() => getHomeFurnitureSpecsConfig(subcategory), [subcategory]);

  const getFieldLabel = (field: HomeFurnitureSpecField) => {
    const translationKey = getHomeFurnitureFieldTranslationKey(field.key);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : field.label;
  };

  const getOptionLabel = (option: string) => {
    const translationKey = getHomeFurnitureOptionTranslationKey(option);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : option;
  };

  const mapOptions = (options: string[] | undefined) =>
    (options || []).map((option) => ({ value: option, label: getOptionLabel(option) }));

  const updateSpec = (key: string, value: unknown) => {
    onChange({ ...specs, [key]: value });
  };

  const renderField = (field: HomeFurnitureSpecField) => {
    const customKey = `${field.key}Other`;
    const fieldLabel = getFieldLabel(field);

    if (field.type === 'text') {
      return (
        <InputField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          value={toStringValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          placeholder={fieldLabel}
        />
      );
    }

    if (field.type === 'number') {
      return (
        <InputField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          type="number"
          value={toNumberValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value ? Number(value) : '')}
          placeholder={fieldLabel}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <div className="space-y-3">
          <SelectField
            label={fieldLabel}
            required={field.required}
            rtl={rtl}
            value={toStringValue(specs[field.key])}
            onChange={(value) => {
              const nextSpecs: Record<string, unknown> = { ...specs, [field.key]: value };
              if (value !== 'Other') nextSpecs[customKey] = '';
              onChange(nextSpecs);
            }}
            options={mapOptions(withOtherOption(field.options))}
            placeholder={t('selectOne')}
          />
          {toStringValue(specs[field.key]) === 'Other' && (
            <InputField
              label={t('customValueFor', { field: fieldLabel })}
              required={field.required}
              rtl={rtl}
              value={toStringValue(specs[customKey])}
              onChange={(value) => updateSpec(customKey, value)}
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    if (field.type === 'multiselect') {
      const selected = toArrayValue(specs[field.key]);
      const hasOther = selected.includes('Other');
      return (
        <div className="space-y-3">
          <MultiSelectField
            label={fieldLabel}
            required={field.required}
            rtl={rtl}
            value={selected}
            onChange={(value) => {
              const nextSpecs: Record<string, unknown> = { ...specs, [field.key]: value };
              if (!value.includes('Other')) nextSpecs[customKey] = '';
              onChange(nextSpecs);
            }}
            options={mapOptions(withOtherOption(field.options))}
          />
          {hasOther && (
            <InputField
              label={t('customValueFor', { field: fieldLabel })}
              required
              rtl={rtl}
              value={toStringValue(specs[customKey])}
              onChange={(value) => updateSpec(customKey, value)}
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    // toggle
    return (
      <ToggleField
        label={fieldLabel}
        required={field.required}
        rtl={rtl}
        value={toBooleanValue(specs[field.key])}
        onChange={(value) => updateSpec(field.key, value)}
        trueLabel={t('optionLabels.yes')}
        falseLabel={t('optionLabels.no')}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}
      >
        <h3 className="text-lg font-bold text-slate-900">{t('stepSpecs')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('specsDescription')}</p>
      </div>

      {!subcategory && (
        <p
          className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {t('selectSubcategoryFirst')}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={field.type === 'multiselect' ? 'sm:col-span-2' : field.type === 'toggle' ? '' : ''}
          >
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};
