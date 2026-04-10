'use client';

import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isRTL, Locale } from '@/lib/i18n/config';

interface StepElectronicsPriceProps {
  locale: Locale;
  data: {
    price: number | '';
    negotiable: boolean;
    condition: string;
  };
  requireCondition: boolean;
  onChange: (data: { price: number | ''; negotiable: boolean; condition: string }) => void;
}

type FormValues = {
  price: number | undefined;
  negotiable: boolean;
  condition: string;
};

export const StepElectronicsPrice: React.FC<StepElectronicsPriceProps> = ({ locale, data, requireCondition, onChange }) => {
  const t = useTranslations('postAd.electronics');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);

  const CONDITIONS = [
    { value: 'New', label: t('conditionNew') },
    { value: 'Like New', label: t('conditionLikeNew') },
    { value: 'Used', label: t('conditionUsed') },
    { value: 'Refurbished', label: t('conditionRefurbished') },
  ];

  const schema = useMemo(
    () =>
      z.object({
        price: z.coerce.number().positive(tForm('required')),
        negotiable: z.boolean(),
        condition: requireCondition ? z.string().min(1, tForm('required')) : z.string().optional().default(''),
      }),
    [requireCondition, tForm]
  );

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: data.price === '' ? undefined : data.price,
      negotiable: data.negotiable,
      condition: data.condition,
    },
    mode: 'onBlur',
  });

  const watched = watch();

  useEffect(() => {
    onChange({
      price: watched.price && Number.isFinite(Number(watched.price)) ? Number(watched.price) : '',
      negotiable: !!watched.negotiable,
      condition: watched.condition || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.price, watched.negotiable, watched.condition]);

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
        : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('priceHeading')}
      </h3>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('price')} <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min="0"
          step="1"
          placeholder={t('pricePlaceholder')}
          className={inputClass(!!errors.price)}
          dir="ltr"
          {...register('price')}
        />
        {errors.price && <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>}
      </div>

      <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="checkbox"
          id="el-negotiable"
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          {...register('negotiable')}
        />
        <label htmlFor="el-negotiable" className={`text-sm text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('negotiable')}
        </label>
      </div>

      {requireCondition && (
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('condition')} <span className="text-red-500">*</span>
          </label>
          <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            {CONDITIONS.map(({ value, label }) => {
              const selected = watched.condition === value;
              return (
                <label
                  key={value}
                  className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition text-sm ${
                    selected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <input type="radio" value={value} className="sr-only" {...register('condition')} />
                  {label}
                </label>
              );
            })}
          </div>
          {errors.condition && <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>}
        </div>
      )}
    </div>
  );
};
