'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

export interface ElectronicsContactData {
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

interface StepElectronicsContactProps {
  locale: Locale;
  data: ElectronicsContactData;
  onChange: (data: ElectronicsContactData) => void;
}

const schema = z.object({
  phone: z.string().trim().min(5, 'required'),
  whatsapp: z.string().optional(),
  email: z.string().trim().email('invalid').or(z.literal('')),
  termsAccepted: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export const StepElectronicsContact: React.FC<StepElectronicsContactProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.electronics');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const [hasReadLegal, setHasReadLegal] = React.useState(data.termsAccepted);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      termsAccepted: data.termsAccepted,
    },
    mode: 'onBlur',
  });

  const watched = watch();

  useEffect(() => {
    if (!hasReadLegal) {
      setValue('termsAccepted', false, { shouldValidate: true });
    }
  }, [hasReadLegal, setValue]);

  useEffect(() => {
    onChange({
      phone: watched.phone || '',
      whatsapp: watched.whatsapp || '',
      email: watched.email || '',
      termsAccepted: watched.termsAccepted === true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.phone, watched.whatsapp, watched.email, watched.termsAccepted]);

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
        : 'border-slate-300 focus:ring-primary-200 focus:border-primary-500'
    } ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('contactHeading')}
      </h3>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('phone')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input type="tel" placeholder={t('phonePlaceholder')} className={inputClass(!!errors.phone)} dir="ltr" {...register('phone')} />
          <Phone className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
        </div>
        {errors.phone && <p className={`mt-1 text-sm text-red-500 ${rtl ? 'text-right' : 'text-left'}`}>{tForm('required')}</p>}
      </div>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>{t('whatsapp')}</label>
        <div className="relative">
          <input type="tel" placeholder={t('whatsappPlaceholder')} className={inputClass(false)} dir="ltr" {...register('whatsapp')} />
          <MessageCircle className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>{t('email')}</label>
        <div className="relative">
          <input type="email" placeholder={t('emailPlaceholder')} className={inputClass(!!errors.email)} dir="ltr" {...register('email')} />
          <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      <LegalReadNotice
        locale={locale}
        initialRead={hasReadLegal}
        onReadChange={setHasReadLegal}
      />

      <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="checkbox"
          id="electronics-terms"
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          disabled={!hasReadLegal}
          {...register('termsAccepted')}
        />
        <label htmlFor="electronics-terms" className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}>
          {t('terms')} <span className="text-red-500">*</span>
        </label>
      </div>
    </div>
  );
};
