'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';
import type { RealEstateLocationData } from './StepRealEstateLocation';
import type { RealEstatePricingData } from './StepRealEstatePricing';
import type { RealEstateSpecsData } from './StepRealEstateSpecs';
import type { RealEstateAmenitiesData } from './StepRealEstateAmenities';

export interface RealEstateContactData {
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

interface StepRealEstateContactReviewProps {
  locale: Locale;
  contact: RealEstateContactData;
  location: RealEstateLocationData;
  pricing: RealEstatePricingData;
  specs: RealEstateSpecsData;
  amenities: RealEstateAmenitiesData;
  onChange: (data: Partial<RealEstateContactData>) => void;
  onJumpToStep: (stepIndex: number) => void;
}

const summaryItemClass = 'rounded-2xl border border-slate-200 bg-slate-50 p-4';
const valueClass = 'mt-2 text-sm text-slate-900';

export const StepRealEstateContactReview: React.FC<StepRealEstateContactReviewProps> = ({
  locale,
  contact,
  location,
  pricing,
  specs,
  amenities,
  onChange,
  onJumpToStep,
}) => {
  const rtl = isRTL(locale);
  const t = useTranslations('postAd.realEstate');
  const [hasReadLegal, setHasReadLegal] = React.useState(contact.termsAccepted);

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('stepContact')}
        </h3>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-slate-500">Review your listing details before submit. Tap a section to edit.</p>
          </div>
          <div className={summaryItemClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Basic Location</div>
                <div className={valueClass}>{location.city || '—'}{location.area_district ? ` • ${location.area_district}` : ''}</div>
                <div className={valueClass}>{location.full_address || 'No full address provided'}</div>
              </div>
              <button type="button" className="text-sm text-primary-600" onClick={() => onJumpToStep(2)}>
                Edit
              </button>
            </div>
          </div>
          <div className={summaryItemClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Pricing</div>
                <div className={valueClass}>{pricing.price ? `${pricing.price} ${pricing.currency}` : 'No price set'}</div>
                <div className={valueClass}>{pricing.price_type ? pricing.price_type.replace(/([A-Z])/g, ' $1') : ''}</div>
                <div className={valueClass}>{pricing.negotiable ? 'Negotiable' : 'Firm price'}</div>
              </div>
              <button type="button" className="text-sm text-primary-600" onClick={() => onJumpToStep(3)}>
                Edit
              </button>
            </div>
          </div>
          <div className={summaryItemClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Property Specs</div>
                <div className={valueClass}>Area: {specs.area_size || '—'}</div>
                <div className={valueClass}>Bedrooms: {specs.bedrooms ?? '—'}</div>
                <div className={valueClass}>Bathrooms: {specs.bathrooms ?? '—'}</div>
              </div>
              <button type="button" className="text-sm text-primary-600" onClick={() => onJumpToStep(4)}>
                Edit
              </button>
            </div>
          </div>
          <div className={summaryItemClass}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Amenities</div>
                <div className={valueClass}>{Object.entries(amenities).filter(([, value]) => value).map(([key]) => key.replace(/_/g, ' ')).join(', ') || 'None selected'}</div>
              </div>
              <button type="button" className="text-sm text-primary-600" onClick={() => onJumpToStep(5)}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('contactName')}
          </label>
          <input
            type="text"
            value={contact.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
            placeholder={t('enterContactName')}
            className={`w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('phone')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder={t('enterPhone')}
                className={`w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500`}
                dir="ltr"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 right-3 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('whatsapp')}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={contact.whatsapp}
                onChange={(e) => onChange({ whatsapp: e.target.value })}
                placeholder={t('enterWhatsapp')}
                className={`w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500`}
                dir="ltr"
              />
              <MessageCircle className="w-4 h-4 text-slate-400 absolute top-1/2 right-3 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('email')}
          </label>
          <div className="relative">
            <input
              type="email"
              value={contact.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder={t('enterEmail')}
              className={`w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500`}
              dir="ltr"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 right-3 -translate-y-1/2" />
          </div>
        </div>

        <LegalReadNotice locale={locale} initialRead={hasReadLegal} onReadChange={setHasReadLegal} />

        <div className="flex items-start gap-3">
          <input
            id="re-contact-terms"
            type="checkbox"
            checked={contact.termsAccepted}
            onChange={(e) => onChange({ termsAccepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            disabled={!hasReadLegal}
          />
          <label htmlFor="re-contact-terms" className="text-sm text-slate-600">
            {t('agreeToTerms')}
          </label>
        </div>
      </div>
    </div>
  );
};
