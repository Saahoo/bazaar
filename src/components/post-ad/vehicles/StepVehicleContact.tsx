'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

export interface VehicleContactData {
  phone: string;
  whatsapp: string;
  whatsappSameAsPhone: boolean;
  email: string;
  termsAccepted: boolean;
  // Additional contact methods
  telegram: string;
  signal: string;
  viber: string;
  // Contact preferences
  preferredContactMethod: 'phone' | 'whatsapp' | 'telegram' | 'signal' | 'viber' | 'email';
  contactHoursStart: string;
  contactHoursEnd: string;
  // Scheduling for test drives
  allowTestDriveScheduling: boolean;
  testDriveInstructions: string;
  // Communication preferences
  allowCalls: boolean;
  allowMessages: boolean;
}

interface StepVehicleContactProps {
  locale: Locale;
  data: VehicleContactData;
  onChange: (data: Partial<VehicleContactData>) => void;
}

export const StepVehicleContact: React.FC<StepVehicleContactProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
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
        {t('contactDetails')}
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
        <div className={`flex items-center gap-3 mb-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          <input
            type="checkbox"
            id="whatsapp-same"
            checked={data.whatsappSameAsPhone}
            onChange={(e) => {
              const checked = e.target.checked;
              onChange({
                whatsappSameAsPhone: checked,
                whatsapp: checked ? data.phone : '',
              });
            }}
            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <label
            htmlFor="whatsapp-same"
            className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
          >
            {t('sameAsPhone')}
          </label>
        </div>
        {!data.whatsappSameAsPhone && (
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
        )}
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
          id="vehicle-terms"
          checked={data.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          disabled={!hasReadLegal}
        />
        <label
          htmlFor="vehicle-terms"
          className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('termsAccepted')} <span className="text-red-500">*</span>
        </label>
      </div>
    </div>
  );
};
