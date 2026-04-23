'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { POPULAR_CITIES } from '@/lib/constants/cities';
import { InputField, SelectField, CheckboxField } from './ServicesFieldControls';

interface StepServicesContactProps {
  locale: Locale;
  data: {
    contact_name: string;
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    social_media_links: string;
    termsAccepted: boolean;
  };
  onChange: (updates: Partial<{
    contact_name: string;
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    social_media_links: string;
    termsAccepted: boolean;
  }>) => void;
}

export const StepServicesContact: React.FC<StepServicesContactProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.services');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const cityOptions = POPULAR_CITIES.map((city) => ({ value: city.name_en, label: locale === 'fa' ? city.name_fa : locale === 'ps' ? city.name_ps : city.name_en }));

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepContact')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('contactDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t('contactName')}
          rtl={rtl}
          value={data.contact_name}
          onChange={(value) => onChange({ contact_name: value })}
          placeholder={t('contactNamePlaceholder')}
        />

        <SelectField
          label={t('city')}
          required
          rtl={rtl}
          value={data.city}
          onChange={(value) => onChange({ city: value })}
          placeholder={t('selectCity')}
          options={cityOptions}
        />

        <InputField
          label={t('phone')}
          required
          rtl={rtl}
          value={data.phone}
          onChange={(value) => onChange({ phone: value })}
          placeholder={t('phonePlaceholder')}
        />

        <InputField
          label={t('whatsapp')}
          rtl={rtl}
          value={data.whatsapp}
          onChange={(value) => onChange({ whatsapp: value })}
          placeholder={t('whatsappPlaceholder')}
        />

        <InputField
          label={t('email')}
          rtl={rtl}
          value={data.email}
          onChange={(value) => onChange({ email: value })}
          placeholder={t('emailPlaceholder')}
        />

        <InputField
          label={t('website')}
          rtl={rtl}
          value={data.website}
          onChange={(value) => onChange({ website: value })}
          placeholder={t('websitePlaceholder')}
        />

        <InputField
          label={t('socialMediaLinks')}
          rtl={rtl}
          value={data.social_media_links}
          onChange={(value) => onChange({ social_media_links: value })}
          placeholder={t('socialMediaPlaceholder')}
        />

        <CheckboxField
          label={tCommon('termsAccepted')}
          rtl={rtl}
          checked={data.termsAccepted}
          onChange={(checked) => onChange({ termsAccepted: checked })}
        />
      </div>
    </div>
  );
};
