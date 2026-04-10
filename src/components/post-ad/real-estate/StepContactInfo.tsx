'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

export interface ContactInfoData {
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

interface StepContactInfoProps {
  locale: Locale;
  data: ContactInfoData;
  onChange: (data: Partial<ContactInfoData>) => void;
}

export const StepContactInfo: React.FC<StepContactInfoProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.realEstate');
  const tForm = useTranslations('form');
  const tPostAd = useTranslations('postAd');
  const rtl = isRTL(locale);
  const [hasReadLegal, setHasReadLegal] = React.useState(data.termsAccepted);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('stepContact')}
      </h3>

      {/* Phone */}
      <div>
        <label className={labelClass}>
          {t('phone')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder={tPostAd('enterPhone')}
            className={inputClass}
            dir="ltr"
          />
          <Phone
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <label className={labelClass}>{t('whatsapp')}</label>
        <div className="relative">
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => onChange({ whatsapp: e.target.value })}
            placeholder={t('enterWhatsapp')}
            className={inputClass}
            dir="ltr"
          />
          <MessageCircle
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>{t('email')}</label>
        <div className="relative">
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder={tPostAd('enterEmail')}
            className={inputClass}
            dir="ltr"
          />
          <Mail
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      <LegalReadNotice
        locale={locale}
        initialRead={hasReadLegal}
        onReadChange={setHasReadLegal}
      />

      {/* Terms */}
      <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="checkbox"
          id="re-terms"
          checked={data.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          disabled={!hasReadLegal}
        />
        <label
          htmlFor="re-terms"
          className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('termsAccepted')} <span className="text-red-500">*</span>
        </label>
      </div>
    </div>
  );
};
