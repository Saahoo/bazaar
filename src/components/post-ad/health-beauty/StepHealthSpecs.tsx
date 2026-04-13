'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  getHealthBeautyFieldTranslationKey,
  getHealthBeautyOptionTranslationKey,
  getHealthBeautySpecsConfig,
  HealthBeautySpecField,
  HealthBeautySubcategory,
} from '@/lib/constants/health-beauty-wizard';
import { InputField, MultiSelectField, SelectField, ToggleField } from './HealthFieldControls';

interface StepHealthSpecsProps {
  locale: Locale;
  subcategory: HealthBeautySubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

interface KeyValueEntry {
  key: string;
  value: string;
}

const toStringValue = (value: unknown): string => (typeof value === 'string' || typeof value === 'number' ? String(value) : '');
const toArrayValue = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const toBoolValue = (value: unknown): boolean => value === true;

const toKeyValueArray = (value: unknown): KeyValueEntry[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const cast = entry as Record<string, unknown>;
      return {
        key: typeof cast.key === 'string' ? cast.key : '',
        value: typeof cast.value === 'string' ? cast.value : '',
      };
    })
    .filter((entry): entry is KeyValueEntry => entry !== null);
};

export const StepHealthSpecs: React.FC<StepHealthSpecsProps> = ({ locale, subcategory, specs, onChange }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  const fields = useMemo(() => getHealthBeautySpecsConfig(subcategory), [subcategory]);

  const getFieldLabel = (field: HealthBeautySpecField): string => {
    const key = getHealthBeautyFieldTranslationKey(field.key) as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : field.label;
  };

  const getOptionLabel = (value: string): string => {
    const key = getHealthBeautyOptionTranslationKey(value) as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  const updateSpec = (key: string, value: unknown) => {
    onChange({ ...specs, [key]: value });
  };

  const renderField = (field: HealthBeautySpecField) => {
    const fieldLabel = getFieldLabel(field);

    if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
      return (
        <InputField
          label={fieldLabel}
          required={field.required}
          rtl={rtl}
          type={field.type}
          value={toStringValue(specs[field.key])}
          onChange={(value) => updateSpec(field.key, value)}
          placeholder={field.type === 'date' ? '' : fieldLabel}
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
        onChange={(value) => {
          const nextSpecs = { ...specs, [field.key]: value };
          if (field.key === 'has_spf' && !value) {
            nextSpecs.spf_value = '';
          }
          onChange(nextSpecs);
        }}
        trueLabel={t('yes')}
        falseLabel={t('no')}
      />
    );
  };

  const customSpecs = toKeyValueArray(specs.custom_specifications);

  const updateCustomSpec = (index: number, key: 'key' | 'value', value: string) => {
    const next = [...customSpecs];
    next[index] = { ...next[index], [key]: value };
    updateSpec('custom_specifications', next);
  };

  const addCustomSpec = () => {
    updateSpec('custom_specifications', [...customSpecs, { key: '', value: '' }]);
  };

  const removeCustomSpec = (index: number) => {
    updateSpec('custom_specifications', customSpecs.filter((_, idx) => idx !== index));
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
        {fields.map((field) => {
          const isWide = field.type === 'multiselect' || field.key === 'ingredients';
          const isSpfValue = field.key === 'spf_value';
          const hasSpf = toBoolValue(specs.has_spf);

          if (isSpfValue && !hasSpf) return null;

          return (
            <div key={field.key} className={isWide ? 'sm:col-span-2' : ''}>
              {renderField(field)}
            </div>
          );
        })}
      </div>

      {subcategory === 'other' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className={`mb-3 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-slate-800">{t('customSpecsHeading')}</p>
            <button
              type="button"
              onClick={addCustomSpec}
              className="rounded-lg border border-primary-300 bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              {t('addCustomSpec')}
            </button>
          </div>

          {customSpecs.length === 0 && (
            <p className={`text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>{t('customSpecsHint')}</p>
          )}

          <div className="space-y-2">
            {customSpecs.map((entry, index) => (
              <div key={`custom-${index}`} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={entry.key}
                  onChange={(e) => updateCustomSpec(index, 'key', e.target.value)}
                  placeholder={t('customSpecKeyPlaceholder')}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
                />
                <input
                  value={entry.value}
                  onChange={(e) => updateCustomSpec(index, 'value', e.target.value)}
                  placeholder={t('customSpecValuePlaceholder')}
                  className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
                />
                <button
                  type="button"
                  onClick={() => removeCustomSpec(index)}
                  className="rounded-xl border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  {t('remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
