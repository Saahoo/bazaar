'use client';

import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isRTL, Locale } from '@/lib/i18n/config';
import { ElectronicsSubcategory, getElectronicsSpecsConfig } from '@/lib/constants/electronics-wizard';

interface StepElectronicsSpecsProps {
  locale: Locale;
  subcategory: ElectronicsSubcategory | '';
  specs: Record<string, string>;
  price: number | '';
  negotiable: boolean;
  condition: string;
  requireCondition: boolean;
  onChange: (specs: Record<string, string>) => void;
  onDetailsChange: (details: { price?: number | ''; negotiable?: boolean; condition?: string }) => void;
}

export const StepElectronicsSpecs: React.FC<StepElectronicsSpecsProps> = ({
  locale,
  subcategory,
  specs,
  price,
  negotiable,
  condition,
  requireCondition,
  onChange,
  onDetailsChange,
}) => {
  const t = useTranslations('postAd.electronics');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const fields = useMemo(() => getElectronicsSpecsConfig(subcategory), [subcategory]);
  const makeFieldId = useMemo(() => (fields.some((field) => field.id === 'make') ? 'make' : fields.some((field) => field.id === 'brand') ? 'brand' : null), [fields]);
  const conditions = useMemo(
    () => [
      { value: 'New', label: t('conditionNew') },
      { value: 'Like New', label: t('conditionLikeNew') },
      { value: 'Used', label: t('conditionUsed') },
      { value: 'Refurbished', label: t('conditionRefurbished') },
    ],
    [t]
  );

  const getFieldLabel = (fieldId: string, fallback: string) => {
    const labelKey = `fields.${fieldId}`;
    return t.has(labelKey) ? t(labelKey) : fallback;
  };

  const getOptionLabel = (option: string) => {
    const optionKey = option
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\+/g, 'plus')
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    const translationKey = `optionLabels.${optionKey}`;
    return t.has(translationKey) ? t(translationKey) : option;
  };

  const getCustomFieldKey = (fieldId: string) => `custom_${fieldId}`;

  const schema = useMemo(
    () =>
      z
        .object({})
        .catchall(z.string().optional())
        .superRefine((values, ctx) => {
          const selectedMake = makeFieldId ? (values[makeFieldId] || '') : '';
          const isOtherMake = selectedMake === 'Other';

          fields.forEach((field) => {
            if (!field.required) return;
            if (field.id === 'model' && isOtherMake) return;
            const value = values[field.id];
            if (!value || String(value).trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [field.id],
                message: tForm('required'),
              });
              return;
            }

            if (String(value) === 'Other') {
              const customFieldKey = getCustomFieldKey(field.id);
              const customValue = (field.id === 'make' || field.id === 'brand')
                ? values.customMake
                : values[customFieldKey];

              if (!customValue || String(customValue).trim() === '') {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [field.id === 'make' || field.id === 'brand' ? 'customMake' : customFieldKey],
                  message: tForm('required'),
                });
              }
            }
          });

          if (isOtherMake) {
            const customMake = values.customMake || '';
            if (String(customMake).trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['customMake'],
                message: tForm('required'),
              });
            }
          }
        }),
    [fields, makeFieldId, tForm]
  );

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues: specs,
    mode: 'onBlur',
  });

  const watched = watch();

  useEffect(() => {
    onChange(watched || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watched)]);

  useEffect(() => {
    fields.forEach((field) => {
      if (!field.dependsOn || !field.optionsMap) return;
      // reset showWhen-hidden fields
    });
    fields.forEach((field) => {
      if (!field.dependsOn || !field.optionsMap) return;
      const parentValue = watched[field.dependsOn] || '';
      if (parentValue === 'Other') {
        if (watched[field.id]) {
          setValue(field.id, '', { shouldValidate: true });
        }
        const customFieldKey = getCustomFieldKey(field.id);
        if (watched[customFieldKey]) {
          setValue(customFieldKey, '', { shouldValidate: true });
        }
        return;
      }
      const options = field.optionsMap[parentValue] || [];
      const currentValue = watched[field.id] || '';
      if (currentValue && !options.includes(currentValue)) {
        setValue(field.id, '', { shouldValidate: true });
        const customFieldKey = getCustomFieldKey(field.id);
        if (watched[customFieldKey]) {
          setValue(customFieldKey, '', { shouldValidate: true });
        }
      }
    });
  }, [fields, watched, setValue]);

  // Reset values for showWhen-hidden fields
  useEffect(() => {
    fields.forEach((field) => {
      if (!field.showWhen) return;
      const parentVal = watched[field.showWhen.field] || '';
      if (!field.showWhen.values.includes(parentVal) && watched[field.id]) {
        setValue(field.id, '', { shouldValidate: false });
      }
    });
  }, [fields, watched, setValue]);

  useEffect(() => {
    if (!makeFieldId) return;
    const selectedMake = watched[makeFieldId] || '';
    if (selectedMake !== 'Other' && watched.customMake) {
      setValue('customMake', '', { shouldValidate: true });
    }
  }, [makeFieldId, watched, setValue]);

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
        : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('specsHeading')}
      </h3>

      {fields.length === 0 && (
        <p className={`text-sm text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('selectSubcategoryFirst')}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="space-y-3">
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('price')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => onDetailsChange({ price: e.target.value ? Number(e.target.value) : '' })}
            placeholder={t('pricePlaceholder')}
            className={inputClass(false)}
            dir="ltr"
          />
        </div>

        <div className={`flex items-center gap-3 pt-8 ${rtl ? 'flex-row-reverse' : ''}`}>
          <input
            type="checkbox"
            id="el-negotiable"
            checked={negotiable}
            onChange={(e) => onDetailsChange({ negotiable: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
          />
          <label htmlFor="el-negotiable" className="text-sm font-medium text-slate-700 cursor-pointer">
            {t('negotiable')}
          </label>
        </div>

        {requireCondition && (
          <div className="space-y-3 sm:col-span-2">
            <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('condition')} <span className="text-red-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => onDetailsChange({ condition: e.target.value })}
              className={`${inputClass(false)} bg-white`}
              dir={rtl ? 'rtl' : 'ltr'}
              aria-label={t('condition')}
              title={t('condition')}
            >
              <option value="">{t('selectOne')}</option>
              {conditions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const hasError = !!errors[field.id];
          const parentValue = field.dependsOn ? watched[field.dependsOn] || '' : '';
          const dynamicOptions = field.optionsMap ? field.optionsMap[parentValue] || [] : field.options || [];
          const blocked = !!field.dependsOn && (!parentValue || parentValue === 'Other');
          const isMakeField = field.id === 'make' || field.id === 'brand';
          const showCustomMakeInput = isMakeField && watched[field.id] === 'Other';
          const customFieldKey = getCustomFieldKey(field.id);
          const showCustomOptionInput = field.type === 'select' && watched[field.id] === 'Other' && !isMakeField;
          const fieldLabel = getFieldLabel(field.id, field.label);

          if (field.id === 'model' && parentValue === 'Other') {
            return null;
          }

          // Hide field based on showWhen condition
          if (field.showWhen) {
            const parentVal = watched[field.showWhen.field] || '';
            if (!field.showWhen.values.includes(parentVal)) {
              return null;
            }
          }

          return (
            <div key={field.id} className={field.type === 'text' ? 'sm:col-span-2 space-y-3' : 'space-y-3'}>
              <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  className={`${inputClass(hasError)} bg-white`}
                  disabled={blocked}
                  {...register(field.id)}
                >
                  <option value="">{blocked ? t('pickFirst') : t('selectOne')}</option>
                  {dynamicOptions.map((option) => (
                    <option key={option} value={option}>
                      {getOptionLabel(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={inputClass(hasError)}
                  dir={rtl ? 'rtl' : 'ltr'}
                  {...register(field.id)}
                />
              )}

              {showCustomMakeInput && (
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
                    {t.has('customNameLabel') ? t('customNameLabel', { field: fieldLabel }) : `${fieldLabel} Name`} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass(!!errors.customMake)}
                    dir={rtl ? 'rtl' : 'ltr'}
                    placeholder={
                      t.has('customNamePlaceholder')
                        ? t('customNamePlaceholder', { field: fieldLabel })
                        : `Enter ${fieldLabel} name`
                    }
                    {...register('customMake')}
                  />
                  {errors.customMake && (
                    <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
                      {String(errors.customMake.message || tForm('required'))}
                    </p>
                  )}
                </div>
              )}

              {showCustomOptionInput && (
                <div>
                  <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
                    {t.has('customNameLabel') ? t('customNameLabel', { field: fieldLabel }) : `${fieldLabel} Name`}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    className={inputClass(!!errors[customFieldKey])}
                    dir={rtl ? 'rtl' : 'ltr'}
                    placeholder={
                      t.has('customNamePlaceholder')
                        ? t('customNamePlaceholder', { field: fieldLabel })
                        : `Enter ${fieldLabel} name`
                    }
                    {...register(customFieldKey)}
                  />
                  {errors[customFieldKey] && (
                    <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
                      {String(errors[customFieldKey]?.message || tForm('required'))}
                    </p>
                  )}
                </div>
              )}

              {hasError && (
                <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
                  {String(errors[field.id]?.message || tForm('required'))}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
