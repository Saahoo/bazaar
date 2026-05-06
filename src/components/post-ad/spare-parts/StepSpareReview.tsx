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

export const StepSpareReview: React.FC<StepSpareReviewProps> = ({ locale, basic, general, contact, compatibility, specs, media, onEdit }) => {
  const t = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const toOptionKey = (value: string): string =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  const optionLabel = (value: string): string => {
    const key = `optionLabels.${toOptionKey(value)}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (Array.isArray(value)) return value.map((v) => optionLabel(String(v))).join(', ');
    if (typeof value === 'boolean') return value ? t('yes') : t('no');
    const str = String(value);
    const optKey = `optionLabels.${toOptionKey(str)}` as Parameters<typeof t>[0];
    return t.has(optKey) ? t(optKey) : str;
  };

  const getLabel = (key: string) => {
    const specKey = `specFields.${key}` as Parameters<typeof t>[0];
    if (t.has(specKey)) return t(specKey);
    const fieldKey = `fields.${key}` as Parameters<typeof t>[0];
    return t.has(fieldKey) ? t(fieldKey) : key;
  };

  const subcategoryLabel = basic.subcategory
    ? (() => {
        const key = `subcategories.${basic.subcategory}` as Parameters<typeof t>[0];
        return t.has(key) ? t(key) : basic.subcategory;
      })()
    : '-';

  const conditionLabel = general.condition
    ? optionLabel(general.condition)
    : '-';

  const sellerTypeLabel = general.seller_type
    ? (() => {
        if (general.seller_type === 'Individual') return t('sellerTypeIndividual');
        if (general.seller_type === 'Dealer') return t('sellerTypeDealer');
        return general.seller_type;
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
        ['condition', conditionLabel],
        ['brand', general.brand],
        ['seller_type', sellerTypeLabel],
      ],
    },
    {
      title: t('stepCompatibility'),
      stepIndex: 3,
      rows: Object.entries(compatibility).map(([key, value]) => [key, formatValue(value)]),
    },
    {
      title: t('stepSpecs'),
      stepIndex: 4,
      rows: Object.entries(specs).map(([key, value]) => [key, formatValue(value)]),
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
