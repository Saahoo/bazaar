'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Tag } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { getCategoryName } from '@/lib/constants/categories';
import { CURRENCIES } from '@/lib/constants/currencies';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import type { PostAdFormData } from './PostAdWizard';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

interface StepContactData {
  city: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
}

interface StepContactProps {
  locale: Locale;
  data: StepContactData;
  onChange: (data: Partial<StepContactData>) => void;
  formData: PostAdFormData;
  selectedCategoryName?: string | null;
}

export const StepContact: React.FC<StepContactProps> = ({
  locale,
  data,
  onChange,
  formData,
  selectedCategoryName,
}) => {
  const tForm = useTranslations('form');
  const tPostAd = useTranslations('postAd');
  const rtl = isRTL(locale);
  const { cities } = useCities();
  const [hasReadLegal, setHasReadLegal] = React.useState(data.termsAccepted);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const currencyData = CURRENCIES[formData.currency] || CURRENCIES['AFN'];

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {tPostAd('stepContact')}
      </h3>

      {/* City */}
      <div>
        <label
          className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('location')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={`${inputClass} appearance-none bg-white pr-10`}
            dir={rtl ? 'rtl' : 'ltr'}
            aria-label={tForm('location')}
            title={tForm('location')}
          >
            <option value="">{tPostAd('selectCity')}</option>
            {cities.map((city) => (
              <option key={city.name_en} value={city.name_en}>
                {getManagedCityName(city, locale)}{city.country ? ` — ${city.country}` : ''}
              </option>
            ))}
          </select>
          <MapPin
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('phone')} <span className="text-red-500">*</span>
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

      {/* Email */}
      <div>
        <label
          className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('email')}
        </label>
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
          id="terms"
          checked={data.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          disabled={!hasReadLegal}
        />
        <label
          htmlFor="terms"
          className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
        >
          {tForm('termsAccepted')} <span className="text-red-500">*</span>
        </label>
      </div>

      {/* Preview */}
      {(formData.title || formData.categoryId) && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h4
            className={`text-sm font-semibold text-slate-700 mb-4 ${rtl ? 'text-right' : 'text-left'}`}
          >
            {tPostAd('previewListing')}
          </h4>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
            {formData.title && (
              <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                <Tag className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className={rtl ? 'text-right' : 'text-left'}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{tForm('title')}</p>
                  <p className="text-sm font-medium text-slate-900">{formData.title}</p>
                </div>
              </div>
            )}

            {formData.categoryId && (
              <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                <Tag className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className={rtl ? 'text-right' : 'text-left'}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {tForm('category')}
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedCategoryName ?? getCategoryName(formData.categoryId, locale)}
                  </p>
                </div>
              </div>
            )}

            {formData.price !== '' && (
              <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                <Tag className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className={rtl ? 'text-right' : 'text-left'}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{tForm('price')}</p>
                  <p className="text-sm font-medium text-slate-900">
                    {currencyData.symbol}
                    {Number(formData.price).toLocaleString()} {formData.currency}
                  </p>
                </div>
              </div>
            )}

            {data.city && (
              <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className={rtl ? 'text-right' : 'text-left'}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {tForm('location')}
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {getManagedCityName(cities.find((c) => c.name_en === data.city) || { name_en: data.city }, locale)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
