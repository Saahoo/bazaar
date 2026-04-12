'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { getSpareSpecFields, SparePartsSubcategory, SpareSpecField } from '@/lib/constants/spare-parts-wizard';
import { InputField, MultiSelectField, SelectField, ToggleField } from './SpareFieldControls';

interface StepSpareSpecificationsProps {
  locale: Locale;
  subcategory: SparePartsSubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

const toStringValue = (value: unknown): string => (typeof value === 'string' || typeof value === 'number' ? String(value) : '');
const toArrayValue = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const toBoolValue = (value: unknown): boolean => value === true;

export const StepSpareSpecifications: React.FC<StepSpareSpecificationsProps> = ({ locale, subcategory, specs, onChange }) => {
  const t = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const fields = useMemo(() => getSpareSpecFields(subcategory), [subcategory]);

  const toOptionKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const getFieldLabel = (field: SpareSpecField): string => {
    const key = `specFields.${field.key}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : field.label;
  };
  const getOptionLabel = (value: string): string => {
    const key = `optionLabels.${toOptionKey(value)}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  const updateSpec = (key: string, value: unknown) => {
    onChange({ ...specs, [key]: value });
  };

  const renderField = (field: SpareSpecField) => {
    const fieldLabel = getFieldLabel(field);

    if (field.type === 'text' || field.type === 'number') {
      return (
        <InputField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          type={field.type}
          value={toStringValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          placeholder={fieldLabel}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <SelectField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          value={toStringValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          options={(field.options || []).map((item) => ({ value: item, label: getOptionLabel(item) }))}
          placeholder={t('selectOne')}
        />
      );
    }

    if (field.type === 'multiselect') {
      return (
        <MultiSelectField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          value={toArrayValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          options={(field.options || []).map((item) => ({ value: item, label: getOptionLabel(item) }))}
        />
      );
    }

    return (
      <ToggleField
        label={fieldLabel}
        required={field.required}
        rtl={rtl}
        value={toBoolValue(specs[field.key])}
        onChange={(value) => updateSpec(field.key, value)}
        trueLabel={t('yes')}
        falseLabel={t('no')}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepSpecs')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('specsDescription')}</p>
      </div>

      {!subcategory && (
        <p className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('selectSubcategoryFirst')}
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
