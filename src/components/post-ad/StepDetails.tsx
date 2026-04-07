'use client';

import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isRTL, Locale } from '@/lib/i18n/config';
import { CURRENCIES } from '@/lib/constants/currencies';

const detailsSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().positive(),
  currency: z.string().min(1),
  condition: z.string().min(1),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export interface StepDetailsHandle {
  validate: () => Promise<boolean>;
}

interface StepDetailsData {
  title: string;
  description: string;
  price: number | '';
  currency: string;
  condition: string;
}

interface StepDetailsProps {
  locale: Locale;
  data: StepDetailsData;
  onChange: (data: Partial<StepDetailsData>) => void;
}

const CONDITIONS = ['new', 'like_new', 'good', 'fair'] as const;

export const StepDetails = forwardRef<StepDetailsHandle, StepDetailsProps>(
  ({ locale, data, onChange }, ref) => {
    const tForm = useTranslations('form');
    const tPostAd = useTranslations('postAd');
    const tCommon = useTranslations('common');
    const rtl = isRTL(locale);

    const conditionLabels: Record<string, string> = {
      new: tCommon('newCondition'),
      like_new: tCommon('likeNew'),
      good: tCommon('good'),
      fair: tCommon('fair'),
    };

    const {
      register,
      trigger,
      formState: { errors },
      watch,
      setValue,
    } = useForm<DetailsFormValues>({
      resolver: zodResolver(detailsSchema),
      defaultValues: {
        title: data.title,
        description: data.description,
        price: data.price === '' ? undefined : data.price,
        currency: data.currency || 'AFN',
        condition: data.condition,
      },
      mode: 'onBlur',
    });

    // Sync form changes back to parent
    const watchedValues = watch();

    useEffect(() => {
      const { title, description, price, currency, condition } = watchedValues;
      onChange({
        title: title || '',
        description: description || '',
        price: price || '',
        currency: currency || 'AFN',
        condition: condition || '',
      });
      // Only sync when watched values change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      watchedValues.title,
      watchedValues.description,
      watchedValues.price,
      watchedValues.currency,
      watchedValues.condition,
    ]);

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const result = await trigger();
        return result;
      },
    }));

    const inputClass = (hasError: boolean) =>
      `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
        hasError
          ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
          : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
      } ${rtl ? 'text-right' : 'text-left'}`;

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          {tPostAd('stepDetails')}
        </h3>

        {/* Title */}
        <div>
          <label
            className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {tForm('title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={tPostAd('enterTitle')}
            className={inputClass(!!errors.title)}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('title')}
          />
          {errors.title && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {tForm('required')}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {tForm('description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder={tPostAd('enterDescription')}
            className={`${inputClass(!!errors.description)} resize-none`}
            dir={rtl ? 'rtl' : 'ltr'}
            {...register('description')}
          />
          {errors.description && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {tForm('required')}
            </p>
          )}
        </div>

        {/* Price + Currency */}
        <div>
          <label
            className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {tForm('price')} <span className="text-red-500">*</span>
          </label>
          <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="number"
              min="0"
              step="1"
              placeholder={tPostAd('enterPrice')}
              className={`${inputClass(!!errors.price)} flex-1`}
              dir="ltr"
              {...register('price')}
            />
            <select
              className={`px-3 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition w-28 ${rtl ? 'text-right' : 'text-left'}`}
              {...register('currency')}
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {errors.price && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {tForm('required')}
            </p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label
            className={`block text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {tForm('condition')} <span className="text-red-500">*</span>
          </label>
          <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            {CONDITIONS.map((cond) => {
              const isSelected = watchedValues.condition === cond;
              return (
                <label
                  key={cond}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                  } ${rtl ? 'flex-row-reverse' : ''}`}
                >
                  <input
                    type="radio"
                    value={cond}
                    className="sr-only"
                    {...register('condition')}
                    onChange={() => setValue('condition', cond, { shouldValidate: true })}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-500' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <span className="text-sm font-medium">{conditionLabels[cond]}</span>
                </label>
              );
            })}
          </div>
          {errors.condition && (
            <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>
              {tPostAd('selectCondition')}
            </p>
          )}
        </div>
      </div>
    );
  }
);

StepDetails.displayName = 'StepDetails';
