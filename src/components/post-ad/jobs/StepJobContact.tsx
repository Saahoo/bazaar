'use client';

import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';
import { InputField } from './JobsFieldControls';
import { Locale, isRTL } from '@/lib/i18n/config';

interface StepJobContactProps {
  locale: Locale;
  data: {
    contactPhone: string;
    contactEmail: string;
    termsAccepted: boolean;
  };
  onChange: (updates: Partial<{
    contactPhone: string;
    contactEmail: string;
    termsAccepted: boolean;
  }>) => void;
}

export const StepJobContact: React.FC<StepJobContactProps> = ({ locale, data, onChange }) => {
  const [hasReadLegal, setHasReadLegal] = useState(false);
  const t = useTranslations('postAd.jobs');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">
        {t('stepContact')}
      </h2>
      
      <p className="text-slate-600">
        {t('contactDescription')}
      </p>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="contactPhone"
          className="block text-sm font-medium text-slate-700"
        >
          {tForm('phone')}
          <span className="text-red-500"> *</span>
        </label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Phone className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="tel"
            id="contactPhone"
            value={data.contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
            className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
            placeholder={tForm('enterPhone')}
            required
          />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {t('contactPhoneDescription')}
        </p>
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium text-slate-700"
        >
          {tForm('email')}
          <span className="text-red-500"> *</span>
        </label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            id="contactEmail"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
            placeholder={tForm('enterEmail')}
            required
          />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {t('contactEmailDescription')}
        </p>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {t('termsHeading')}
        </h3>
        
        <LegalReadNotice
          locale={locale}
          initialRead={hasReadLegal}
          onReadChange={setHasReadLegal}
        />

        <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              id="terms"
              checked={data.termsAccepted}
              onChange={(e) => onChange({ termsAccepted: e.target.checked })}
              disabled={!hasReadLegal}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="text-sm leading-5">
            <label
              htmlFor="terms"
              className={`font-medium ${hasReadLegal ? 'text-slate-700' : 'text-slate-400'} ${rtl ? 'text-right' : ''}`}
            >
              {t('acceptTerms')}
              <span className="text-red-500"> *</span>
            </label>
            <p className={`text-slate-500 ${rtl ? 'text-right' : ''}`}>
              {t('termsRequirement')}
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              {t('contactHelpText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};