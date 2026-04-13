'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { getHealthBeautyFieldTranslationKey, getHealthBeautyOptionTranslationKey, HealthBeautySubcategory } from '@/lib/constants/health-beauty-wizard';
import { HealthMediaData } from './StepHealthMedia';

interface StepHealthReviewProps {
  locale: Locale;
  basic: {
    title: string;
    description: string;
    subcategory: HealthBeautySubcategory | '';
  };
  general: {
    price: number | '';
    currency: string;
    condition: string;
    brand: string;
    seller_type: string;
  };
  specs: Record<string, unknown>;
  media: HealthMediaData;
  contact: {
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
  };
  onEdit: (stepIndex: number) => void;
}

const toTitleCase = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const StepHealthReview: React.FC<StepHealthReviewProps> = ({ locale, basic, general, specs, media, contact, onEdit }) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  const getFieldLabel = (key: string): string => {
    const translationKey = getHealthBeautyFieldTranslationKey(key) as Parameters<typeof t>[0];
    return t.has(translationKey) ? t(translationKey) : toTitleCase(key);
  };

  const getOptionLabel = (value: string): string => {
    const translationKey = getHealthBeautyOptionTranslationKey(value) as Parameters<typeof t>[0];
    return t.has(translationKey) ? t(translationKey) : value;
  };

  const stringify = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        return value
          .map((item) => {
            const pair = item as { key?: string; value?: string };
            return pair.key && pair.value ? `${pair.key}: ${pair.value}` : '';
          })
          .filter(Boolean)
          .join(', ');
      }
      return value.map((item) => getOptionLabel(String(item))).join(', ');
    }
    if (typeof value === 'boolean') return value ? t('yes') : t('no');
    if (typeof value === 'string') return getOptionLabel(value);
    return String(value);
  };

  const subcategoryLabel = basic.subcategory
    ? (() => {
        const key = `subcategories.${basic.subcategory}` as Parameters<typeof t>[0];
        return t.has(key) ? t(key) : basic.subcategory;
      })()
    : '-';

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
      ],
    },
    {
      title: t('stepGeneral'),
      stepIndex: 2,
      rows: [
        ['price', general.price === '' ? '-' : `${general.price}`],
        ['currency', general.currency],
        ['condition', general.condition],
        ['brand', general.brand],
        ['seller_type', general.seller_type],
      ],
    },
    {
      title: t('stepSpecs'),
      stepIndex: 3,
      rows: specRows.map(([key, value]) => [key, stringify(value)]),
    },
    {
      title: t('stepMedia'),
      stepIndex: 4,
      rows: [
        ['images', String(media.images.length)],
        ['video', media.video],
      ],
    },
    {
      title: t('stepContact'),
      stepIndex: 5,
      rows: [
        ['city', contact.city],
        ['phone', contact.phone],
        ['whatsapp', contact.whatsapp],
        ['email', contact.email],
        ['map', contact.lat !== null && contact.lng !== null ? `${contact.lat.toFixed(5)}, ${contact.lng.toFixed(5)}` : '-'],
      ],
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
