'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isRTL, Locale } from '@/lib/i18n/config';

interface StepElectronicsBasicInfoProps {
  locale: Locale;
  data: {
    title: string;
    details: string;
  };
  onChange: (data: { title: string; details: string }) => void;
}

const schema = z.object({
  title: z.string().trim().min(3, 'required').max(100, 'required'),
  details: z.string().trim().min(10, 'required').max(1500, 'required'),
});

type FormValues = z.infer<typeof schema>;

export const StepElectronicsBasicInfo: React.FC<StepElectronicsBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.electronics');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      details: data.details,
    },
    mode: 'onBlur',
  });

  const watched = watch();

  useEffect(() => {
    onChange({
      title: watched.title || '',
      details: watched.details || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.title, watched.details]);

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
        : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('basicHeading')}
      </h3>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('adTitle')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t('titlePlaceholder')}
          className={inputClass(!!errors.title)}
          dir={rtl ? 'rtl' : 'ltr'}
          {...register('title')}
        />
        {errors.title && <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>}
      </div>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('adDetails')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder={t('detailsPlaceholder')}
          className={`${inputClass(!!errors.details)} resize-none`}
          dir={rtl ? 'rtl' : 'ltr'}
          {...register('details')}
        />
        {errors.details && <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>}
      </div>
    </div>
  );
};
