'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SportsHobbySubcategory, SportsHobbySpecField, getSportsHobbySpecsConfig } from '@/lib/constants/sports-hobby-wizard';

interface StepSportsSpecsProps {
  locale: Locale;
  subcategory: SportsHobbySubcategory | '';
  specs: Record<string, unknown>;
  onChange: (specs: Record<string, unknown>) => void;
}

const toStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');
const toArrayValue = (value: unknown): string[] => (Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
const toBooleanValue = (value: unknown): boolean => value === true;
const withOtherOption = (options: string[] | undefined, fieldKey?: string): string[] => {
  const source = options || [];
  // Fields that should not have "Other" option
  const noOtherFields = ['currency', 'seller_type', 'condition'];
  if (fieldKey && noOtherFields.includes(fieldKey)) {
    return source;
  }
  return source.includes('Other') ? source : [...source, 'Other'];
};

export const StepSportsSpecs: React.FC<StepSportsSpecsProps> = ({ locale, subcategory, specs, onChange }) => {
  const t = useTranslations('postAd.sportsHobby');
  const rtl = isRTL(locale);
  const fields = useMemo(() => getSportsHobbySpecsConfig(subcategory), [subcategory]);

  const getFieldLabel = (field: SportsHobbySpecField | string) => {
    const fieldKey = typeof field === 'string' ? field : field.key;
    const fallback = typeof field === 'string' ? field : field.label;
    const translationKey = `fields.${fieldKey}`;
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : fallback;
  };

  const getOptionLabel = (option: string) => {
    const optionKey = option
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\+/g, 'plus')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    const translationKey = `optionLabels.${optionKey}`;
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : option;
  };

  const mapOptions = (options: string[] | undefined) => (options || []).map((option) => ({ value: option, label: getOptionLabel(option) }));

  const handleFieldChange = (fieldKey: string, value: string | string[] | boolean | number) => {
    const newSpecs = { ...specs, [fieldKey]: value };
    onChange(newSpecs);
  };

  const handleCustomFieldChange = (fieldKey: string, customValue: string) => {
    const newSpecs = { ...specs, [`custom_${fieldKey}`]: customValue };
    onChange(newSpecs);
  };

  const renderField = (field: SportsHobbySpecField) => {
    const value = specs[field.key];
    const customValue = specs[`custom_${field.key}`];
    const label = getFieldLabel(field);
    const options = mapOptions(field.options);
    const optionsWithOther = mapOptions(withOtherOption(field.options, field.key));
    const inputClass = `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 border-slate-300 focus:ring-primary-200 focus:border-primary-500 bg-white ${rtl ? 'text-right' : 'text-left'}`;
    const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

    switch (field.type) {
      case 'text':
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className={labelClass}>
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                value={toStringValue(value)}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className={`${inputClass} resize-none`}
                dir={rtl ? 'rtl' : 'ltr'}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type="text"
                value={toStringValue(value)}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className={inputClass}
                dir={rtl ? 'rtl' : 'ltr'}
                placeholder={field.placeholder}
              />
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <label className={labelClass}>
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={toStringValue(value)}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className={labelClass}>
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={toStringValue(value)}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
              aria-label={label}
              title={label}
            >
              <option value="">{field.placeholder || `Select ${label.toLowerCase()}`}</option>
              {optionsWithOther.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {toStringValue(value) === 'Other' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={toStringValue(customValue)}
                  onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                  className={inputClass}
                  dir={rtl ? 'rtl' : 'ltr'}
                  placeholder={`Specify ${label.toLowerCase()}`}
                />
              </div>
            )}
          </div>
        );

      case 'multiselect':
        const selectedValues = toArrayValue(value);
        return (
          <div key={field.key} className="space-y-2">
            <label className={labelClass}>
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option.value} className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v) => v !== option.value);
                      handleFieldChange(field.key, newValues);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="space-y-2">
            <label className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="checkbox"
                checked={toBooleanValue(value)}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-slate-700">
                {label} {field.required && <span className="text-red-500">*</span>}
              </span>
            </label>
          </div>
        );

      case 'toggle':
        return (
          <div key={field.key} className="space-y-2">
            <label className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-slate-700">
                {label} {field.required && <span className="text-red-500">*</span>}
              </span>
              <button
               type="button"
               role="switch"
               aria-checked={toBooleanValue(value) ? 'true' : 'false'}
               onClick={() => handleFieldChange(field.key, !toBooleanValue(value))}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                 toBooleanValue(value) ? 'bg-primary-600' : 'bg-slate-300'
               }`}
             >
               <span
                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                   toBooleanValue(value) ? (rtl ? 'translate-x-[-1.25rem]' : 'translate-x-6') : 'translate-x-1'
                 }`}
               />
             </button>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('specsHeading')}
      </h3>
      <p className={`text-sm text-slate-600 mb-6 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('specsDescription')}
      </p>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
};