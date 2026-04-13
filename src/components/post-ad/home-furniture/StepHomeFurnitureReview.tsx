'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  HomeFurnitureSubcategory,
  HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS,
  getHomeFurnitureFieldTranslationKey,
  getHomeFurnitureOptionTranslationKey,
} from '@/lib/constants/home-furniture-wizard';
import { HomeFurnitureMediaData } from './StepHomeFurnitureMedia';

interface StepHomeFurnitureReviewProps {
  locale: Locale;
  title: string;
  description: string;
  subcategory: HomeFurnitureSubcategory | '';
  price: number | '';
  condition: string;
  brand: string;
  sellerType: string;
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  specs: Record<string, unknown>;
  media: HomeFurnitureMediaData;
  onEdit: (stepIndex: number) => void;
}

export const StepHomeFurnitureReview: React.FC<StepHomeFurnitureReviewProps> = ({
  locale,
  title,
  description,
  subcategory,
  price,
  condition,
  brand,
  sellerType,
  city,
  lat,
  lng,
  phone,
  whatsapp,
  email,
  specs,
  media,
  onEdit,
}) => {
  const t = useTranslations('postAd.homeFurniture');
  const rtl = isRTL(locale);

  const subcategoryLabel = subcategory
    ? t(HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS[subcategory] as Parameters<typeof t>[0])
    : '-';

  const getFieldLabel = (key: string) => {
    const translationKey = getHomeFurnitureFieldTranslationKey(key);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : key;
  };

  const getOptionLabel = (value: string) => {
    const translationKey = getHomeFurnitureOptionTranslationKey(value);
    return t.has(translationKey as Parameters<typeof t>[0])
      ? t(translationKey as Parameters<typeof t>[0])
      : value;
  };

  const stringifyValue = (value: unknown): string => {
    if (Array.isArray(value))
      return value.map((item) => getOptionLabel(String(item))).join(', ');
    if (typeof value === 'boolean')
      return value ? t('optionLabels.yes') : t('optionLabels.no');
    if (typeof value === 'string') return getOptionLabel(value);
    return String(value || '');
  };

  const sections = [
    {
      name: t('reviewBasicInfo'),
      editStep: 1,
      rows: [
        ['title', title],
        ['description', description],
        ['subcategory', subcategoryLabel],
      ],
    },
    {
      name: t('reviewGeneralDetails'),
      editStep: 2,
      rows: [
        ['price', price === '' ? '' : String(price)],
        ['condition', stringifyValue(condition)],
        ['brand', brand],
        ['sellerType', stringifyValue(sellerType)],
      ],
    },
    {
      name: t('reviewSpecs'),
      editStep: 3,
      rows: Object.entries(specs)
        .filter(([key]) => !key.endsWith('Other'))
        .map(([key, value]) => [key, stringifyValue(value)]),
    },
    {
      name: t('reviewMedia'),
      editStep: 4,
      rows: [
        ['images', t('photosCount', { count: media.images.length })],
        ['video', media.video],
      ],
    },
    {
      name: t('reviewContact'),
      editStep: 5,
      rows: [
        ['city', city],
        ['phone', phone],
        ['whatsapp', whatsapp],
        ['email', email],
        ['map', lat !== null && lng !== null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : ''],
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <h3
        className={`text-lg font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}
      >
        {t('reviewHeading')}
      </h3>

      {sections.map((section) => (
        <div key={section.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div
            className={`mb-3 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <p className="text-sm font-semibold text-slate-800">{section.name}</p>
            <button
              type="button"
              onClick={() => onEdit(section.editStep)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Edit2 className="h-3.5 w-3.5" />
              {t('editSection')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.rows.map(([key, value]) => (
              <div
                key={`${section.name}-${key}`}
                className={`text-sm ${rtl ? 'text-right' : 'text-left'}`}
              >
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
