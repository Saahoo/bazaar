'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ServicesSubcategory, getServicesSpecsConfig } from '@/lib/constants/services-wizard';
import { InputField, SelectField, MultiSelectField, ToggleField, TextAreaField } from './ServicesFieldControls';

interface StepServicesDetailsProps {
  locale: Locale;
  subcategory: ServicesSubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

export const StepServicesDetails: React.FC<StepServicesDetailsProps> = ({ locale, subcategory, specs, onChange }) => {
  const t = useTranslations('postAd.services');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  if (!subcategory) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <p className="text-slate-600 text-sm">{t('selectSubcategoryFirst')}</p>
      </div>
    );
  }

  const fields = getServicesSpecsConfig(subcategory as ServicesSubcategory);

  const handleFieldChange = (key: string, value: unknown) => {
    onChange({ ...specs, [key]: value });
  };

  const translateLabel = (labelKey: string): string => {
    const parts = labelKey.split('.');
    if (parts[0] === 'services') {
      // Try services namespace
      const fieldPath = parts.slice(1).join('.');
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(fieldPath as any);
      } catch {
        // Key doesn't exist, fall through
      }
    }
    // Fall back to common or just return the labelKey
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return tCommon(labelKey as any);
    } catch {
      return labelKey;
    }
  };

  const translateOptionLabel = (optionLabel: string): string => {
    // Check if key starts with 'services.'
    if (optionLabel.startsWith('services.')) {
      const fieldPath = optionLabel.slice('services.'.length);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(fieldPath as any);
      } catch {
        return optionLabel;
      }
    }
    // Try as a direct translation key in common namespace
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return tCommon(optionLabel as any);
    } catch {
      return optionLabel;
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepDetails')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('detailsDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fields.map((field) => {
          const value = specs[field.key];
          const label = translateLabel(field.labelKey);

          if (field.type === 'text' || field.type === 'textarea') {
            return (
              <div key={field.key}>
                {field.type === 'text' ? (
                  <InputField
                    label={label}
                    required={field.required}
                    rtl={rtl}
                    value={(value as string) || ''}
                    onChange={(v) => handleFieldChange(field.key, v)}
                    placeholder={`${label}...`}
                  />
                ) : (
                  <TextAreaField
                    label={label}
                    required={field.required}
                    rtl={rtl}
                    value={(value as string) || ''}
                    onChange={(v) => handleFieldChange(field.key, v)}
                    placeholder={`${label}...`}
                    rows={3}
                  />
                )}
              </div>
            );
          }

          if (field.type === 'number') {
            return (
              <InputField
                key={field.key}
                label={label}
                required={field.required}
                rtl={rtl}
                type="number"
                value={(value as number) || ''}
                onChange={(v) => handleFieldChange(field.key, v ? Number(v) : '')}
                placeholder={`${label}...`}
              />
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <SelectField
                key={field.key}
                label={label}
                required={field.required}
                rtl={rtl}
                value={(value as string) || ''}
                onChange={(v) => handleFieldChange(field.key, v)}
                options={field.options.map((opt) => ({
                  value: opt.value,
                  label: opt.labelKey ? translateOptionLabel(opt.labelKey) : translateOptionLabel(opt.value),
                }))}
                placeholder={`${t('select')}...`}
              />
            );
          }

          if (field.type === 'multiselect' && field.options) {
            return (
              <MultiSelectField
                key={field.key}
                label={label}
                required={field.required}
                rtl={rtl}
                value={Array.isArray(value) ? (value as string[]) : []}
                onChange={(v) => handleFieldChange(field.key, v)}
                options={field.options.map((opt) => ({
                  value: opt.value,
                  label: opt.labelKey ? translateOptionLabel(opt.labelKey) : translateOptionLabel(opt.value),
                }))}
              />
            );
          }

          if (field.type === 'toggle') {
            return (
              <ToggleField
                key={field.key}
                label={label}
                required={field.required}
                rtl={rtl}
                value={(value as boolean) || false}
                onChange={(v) => handleFieldChange(field.key, v)}
                trueLabel={t('yes')}
                falseLabel={t('no')}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
