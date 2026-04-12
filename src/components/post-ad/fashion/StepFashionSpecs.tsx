'use client';

import React, { useMemo, useEffect } from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  FashionSubcategory,
  FashionSpecField,
  getDefaultGenderForFashionSubcategory,
  getFashionSpecsConfig,
  isFashionClothingSubcategory,
} from '@/lib/constants/fashion-wizard';
import { CheckboxField, InputField, MultiSelectField, SelectField, ToggleField } from './FashionFieldControls';

interface StepFashionSpecsProps {
  locale: Locale;
  subcategory: FashionSubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

const toStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');
const toArrayValue = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const toBooleanValue = (value: unknown): boolean => value === true;
const withOtherOption = (options: string[] | undefined): string[] => {
  const source = options || [];
  return source.includes('Other') ? source : [...source, 'Other'];
};

export const StepFashionSpecs: React.FC<StepFashionSpecsProps> = ({ locale, subcategory, specs, onChange }) => {
  const rtl = isRTL(locale);
  const fields = useMemo(() => getFashionSpecsConfig(subcategory), [subcategory]);

  useEffect(() => {
    if (!subcategory || !isFashionClothingSubcategory(subcategory)) return;
    const defaultGender = getDefaultGenderForFashionSubcategory(subcategory);
    const currentGender = toStringValue(specs.gender);
    if (!currentGender && defaultGender) {
      onChange({ ...specs, gender: defaultGender });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategory]);

  const updateSpec = (key: string, value: unknown) => {
    onChange({ ...specs, [key]: value });
  };

  const renderField = (field: FashionSpecField) => {
    const customKey = `${field.key}Other`;

    if (field.type === 'text') {
      return (
        <InputField
          label={field.key}
          required={field.required}
          rtl={rtl}
          value={toStringValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          placeholder={field.label}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <div className="space-y-3">
          <SelectField
            label={field.key}
            required={field.required}
            rtl={rtl}
            value={toStringValue(specs[field.key])}
            onChange={(value) => {
              const nextSpecs: Record<string, unknown> = { ...specs, [field.key]: value };
              if (value !== 'Other') nextSpecs[customKey] = '';
              onChange(nextSpecs);
            }}
            options={withOtherOption(field.options)}
            placeholder={`Select ${field.label}`}
          />
          {toStringValue(specs[field.key]) === 'Other' && (
            <InputField
              label={customKey}
              required={field.required}
              rtl={rtl}
              value={toStringValue(specs[customKey])}
              onChange={(value) => updateSpec(customKey, value)}
              placeholder={`Enter ${field.label}`}
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
            label={field.key}
            required={field.required}
            rtl={rtl}
            value={selected}
            onChange={(value) => {
              const nextSpecs: Record<string, unknown> = { ...specs, [field.key]: value };
              if (!value.includes('Other')) nextSpecs[customKey] = '';
              onChange(nextSpecs);
            }}
            options={withOtherOption(field.options)}
          />
          {hasOther && (
            <InputField
              label={customKey}
              required
              rtl={rtl}
              value={toStringValue(specs[customKey])}
              onChange={(value) => updateSpec(customKey, value)}
              placeholder={`Enter ${field.label}`}
            />
          )}
        </div>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <CheckboxField
          label={field.key}
          required={field.required}
          rtl={rtl}
          checked={toBooleanValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
        />
      );
    }

    return (
      <ToggleField
        label={field.key}
        required={field.required}
        rtl={rtl}
        value={toBooleanValue(specs[field.key])}
        onChange={(value) => updateSpec(field.key, value)}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">Product Specifications</h3>
        <p className="mt-1 text-sm text-slate-600">Fields change automatically by subcategory.</p>
      </div>

      {!subcategory && (
        <p className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 ${rtl ? 'text-right' : 'text-left'}`}>
          Select subcategory in Step 1 first.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.type === 'multiselect' ? 'sm:col-span-2' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};
