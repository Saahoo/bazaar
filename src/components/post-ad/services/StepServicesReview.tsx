'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ServicesMediaData } from './StepServicesMedia';
import { ServicesSubcategory } from '@/lib/constants/services-wizard';

interface StepServicesReviewProps {
  locale: Locale;
  basic: {
    title: string;
    description: string;
    subcategory: ServicesSubcategory | '';
    service_type: string;
  };
  location: {
    city: string;
    area: string;
    service_radius_km: number | '';
    multiple_cities: string[];
    days_available: string[];
    working_hours_from: string;
    working_hours_to: string;
    emergency_service: boolean;
    advance_booking_required: boolean;
  };
  pricing: {
    pricing_type: string;
    price: number | '';
    currency: string;
    negotiable: boolean;
    call_out_fee: boolean;
    call_out_fee_amount: number | '';
  };
  specs: Record<string, unknown>;
  media: ServicesMediaData;
  contact: {
    contact_name: string;
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    social_media_links: string;
  };
  onEdit: (stepIndex: number) => void;
}

const toTitleCase = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const StepServicesReview: React.FC<StepServicesReviewProps> = ({
  locale,
  basic,
  location,
  pricing,
  specs,
  media,
  contact,
  onEdit,
}) => {
  const t = useTranslations('postAd.services');
  const rtl = isRTL(locale);

  const getFieldLabel = (key: string): string => {
    const parts = key.split('_');
    const translationKey = parts.join('_');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(translationKey as any);
    } catch {
      return toTitleCase(key);
    }
  };

  const stringify = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') return value ? t('yes') : t('no');
    return String(value);
  };

  const subcategoryLabel = basic.subcategory ? toTitleCase(basic.subcategory) : '-';
  const serviceTypeLabel = basic.service_type ? toTitleCase(basic.service_type) : '-';

  const specRows = Object.entries(specs).filter(([_key, value]) => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  const sections = [
    {
      title: t('stepBasic'),
      stepIndex: 1,
      rows: [
        ['title', basic.title],
        ['description', basic.description],
        ['subcategory', subcategoryLabel],
        ['service_type', serviceTypeLabel],
      ],
    },
    {
      title: t('stepLocation'),
      stepIndex: 2,
      rows: [
        ['city', location.city],
        ['area', location.area],
        ['service_radius_km', location.service_radius_km === '' ? '-' : `${location.service_radius_km} km`],
        ['multiple_cities', stringify(location.multiple_cities)],
        ['days_available', stringify(location.days_available)],
        ['working_hours', location.working_hours_from && location.working_hours_to ? `${location.working_hours_from} - ${location.working_hours_to}` : '-'],
        ['emergency_service', stringify(location.emergency_service)],
        ['advance_booking_required', stringify(location.advance_booking_required)],
      ],
    },
    {
      title: t('stepPricing'),
      stepIndex: 3,
      rows: [
        ['pricing_type', toTitleCase(pricing.pricing_type)],
        ['price', pricing.price === '' ? '-' : `${pricing.price}`],
        ['currency', pricing.currency],
        ['negotiable', stringify(pricing.negotiable)],
        ['call_out_fee', stringify(pricing.call_out_fee)],
        pricing.call_out_fee && pricing.call_out_fee_amount !== '' ? ['call_out_fee_amount', `${pricing.call_out_fee_amount}`] : null,
      ].filter(Boolean) as [string, string][],
    },
    {
      title: t('stepDetails'),
      stepIndex: 4,
      rows: specRows.map(([key, value]) => [key, stringify(value)]),
    },
    {
      title: t('stepMedia'),
      stepIndex: 5,
      rows: [
        ['images', String(media.images.length)],
        media.has_video ? ['video', media.video] : null,
        media.has_documents ? ['documents', media.documents] : null,
      ].filter(Boolean) as [string, string][],
    },
    {
      title: t('stepContact'),
      stepIndex: 6,
      rows: [
        ['contact_name', contact.contact_name],
        ['city', contact.city],
        ['phone', contact.phone],
        contact.whatsapp ? ['whatsapp', contact.whatsapp] : null,
        contact.email ? ['email', contact.email] : null,
        contact.website ? ['website', contact.website] : null,
        contact.social_media_links ? ['social_media_links', contact.social_media_links] : null,
        contact.lat !== null && contact.lng !== null ? ['map', `${contact.lat.toFixed(5)}, ${contact.lng.toFixed(5)}`] : null,
      ].filter(Boolean) as [string, string][],
    },
  ];

  return (
    <div className="space-y-5">
      <h3 className={`text-lg font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>{t('stepReview')}</h3>

      {sections.map((section) => (
        <div key={section.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className={`mb-3 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-slate-800">{section.title}</p>
            <button
              type="button"
              onClick={() => onEdit(section.stepIndex)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Edit2 className="h-3.5 w-3.5" />
              {t('edit')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.rows.map(([key, value]) => (
              <div key={`${section.title}-${key}`} className={`text-sm ${rtl ? 'text-right' : 'text-left'}`}>
                <span className="font-medium text-slate-600">{getFieldLabel(key)}:</span>{' '}
                <span className="text-slate-900">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
