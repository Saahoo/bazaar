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
  onChange: (specs: Record<string, string>) => void;
}

export const StepElectronicsSpecs: React.FC<StepElectronicsSpecsProps> = ({
  locale,
  subcategory,
  specs,
  onChange,
}) => {
  const t = useTranslations('postAd.electronics');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const fields = useMemo(() => getElectronicsSpecsConfig(subcategory), [subcategory]);
  const makeFieldId = useMemo(() => (fields.some((field) => field.id === 'make') ? 'make' : fields.some((field) => field.id === 'brand') ? 'brand' : null), [fields]);

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
      const parentValue = watched[field.dependsOn] || '';
      if (parentValue === 'Other') {
        if (watched[field.id]) {
          setValue(field.id, '', { shouldValidate: true });
        }
        return;
      }
      const options = field.optionsMap[parentValue] || [];
      const currentValue = watched[field.id] || '';
      if (currentValue && !options.includes(currentValue)) {
        setValue(field.id, '', { shouldValidate: true });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const hasError = !!errors[field.id];
          const parentValue = field.dependsOn ? watched[field.dependsOn] || '' : '';
          const dynamicOptions = field.optionsMap ? field.optionsMap[parentValue] || [] : field.options || [];
          const blocked = !!field.dependsOn && (!parentValue || parentValue === 'Other');
          const isMakeField = field.id === 'make' || field.id === 'brand';
          const showCustomMakeInput = isMakeField && watched[field.id] === 'Other';

          if (field.id === 'model' && parentValue === 'Other') {
            return null;
          }

          return (
            <div key={field.id} className={field.type === 'text' ? 'sm:col-span-2 space-y-3' : 'space-y-3'}>
              <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
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
                      {option}
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
                    {field.label} Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass(!!errors.customMake)}
                    dir={rtl ? 'rtl' : 'ltr'}
                    placeholder={`Enter ${field.label.toLowerCase()} name`}
                    {...register('customMake')}
                  />
                  {errors.customMake && (
                    <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
                      {String(errors.customMake.message || tForm('required'))}
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
