'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SparePartsSubcategory } from '@/lib/constants/spare-parts-wizard';
import { SpareMediaData } from './StepSpareMedia';

interface StepSpareReviewProps {
  locale: Locale;
  basic: {
    title: string;
    description: string;
    subcategory: SparePartsSubcategory | '';
  };
  general: {
    price: number | '';
    currency: string;
    condition: string;
    brand: string;
    seller_type: string;
  };
  contact: {
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
  };
  compatibility: Record<string, unknown>;
  specs: Record<string, unknown>;
  media: SpareMediaData;
  onEdit: (stepIndex: number) => void;
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const toDisplayRows = (source: Record<string, unknown>): Array<[string, string]> =>
  Object.entries(source).map(([key, value]) => [key, formatValue(value)]);

export const StepSpareReview: React.FC<StepSpareReviewProps> = ({ locale, basic, general, contact, compatibility, specs, media, onEdit }) => {
  const t = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const getLabel = (key: string) => {
    const translationKey = `fields.${key}` as Parameters<typeof t>[0];
    return t.has(translationKey) ? t(translationKey) : key;
  };

  const subcategoryLabel = basic.subcategory
    ? (() => {
        const key = `subcategories.${basic.subcategory}` as Parameters<typeof t>[0];
        return t.has(key) ? t(key) : basic.subcategory;
      })()
    : '-';

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
      title: t('stepCompatibility'),
      stepIndex: 3,
      rows: toDisplayRows(compatibility),
    },
    {
      title: t('stepSpecs'),
      stepIndex: 4,
      rows: toDisplayRows(specs),
    },
    {
      title: t('stepMedia'),
      stepIndex: 5,
      rows: [
        ['images', String(media.images.length)],
        ['video', media.video],
      ],
    },
    {
      title: t('stepContact'),
      stepIndex: 6,
      rows: [
        ['city', contact.city],
        ['phone', contact.phone],
        ['whatsapp', contact.whatsapp],
        ['email', contact.email],
        ['map', contact.lat !== null && contact.lng !== null ? `${contact.lat.toFixed(5)}, ${contact.lng.toFixed(5)}` : ''],
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
                <span className="font-medium text-slate-600">{getLabel(key)}:</span>{' '}
                <span className="text-slate-900">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
