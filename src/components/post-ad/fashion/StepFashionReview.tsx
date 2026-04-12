'use client';

import React from 'react';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { FashionSubcategory, FASHION_SUBCATEGORIES } from '@/lib/constants/fashion-wizard';
import { FashionMediaData } from './StepFashionMedia';

interface StepFashionReviewProps {
  locale: Locale;
  title: string;
  description: string;
  subcategory: FashionSubcategory | '';
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
  media: FashionMediaData;
  onEdit: (stepIndex: number) => void;
}

const humanize = (value: string): string => value.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

export const StepFashionReview: React.FC<StepFashionReviewProps> = ({
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
  const rtl = isRTL(locale);

  const subcategoryLabel = FASHION_SUBCATEGORIES.find((option) => option.value === subcategory)?.label || subcategory || '-';

  const sections = [
    {
      name: 'Step 1: Basic Information',
      editStep: 1,
      rows: [
        ['title', title],
        ['description', description],
        ['subcategory', subcategoryLabel],
      ],
    },
    {
      name: 'Step 2: General Details',
      editStep: 2,
      rows: [
        ['price', price === '' ? '' : `${price}`],
        ['condition', condition],
        ['brand', brand],
        ['sellerType', sellerType],
      ],
    },
    {
      name: 'Step 3: Specifications',
      editStep: 3,
      rows: Object.entries(specs)
        .filter(([key]) => !key.endsWith('Other'))
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || ''),
        ]),
    },
    {
      name: 'Step 4: Media Upload',
      editStep: 4,
      rows: [
        ['images', `${media.images.length}`],
        ['video', media.video],
      ],
    },
    {
      name: 'Step 5: Contact & Terms',
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
      <h3 className={`text-lg font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>Review & Submit</h3>

      {sections.map((section) => (
        <div key={section.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className={`mb-3 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-slate-800">{section.name}</p>
            <button
              type="button"
              onClick={() => onEdit(section.editStep)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.rows.map(([key, value]) => (
              <div key={`${section.name}-${key}`} className={`text-sm ${rtl ? 'text-right' : 'text-left'}`}>
                <span className="font-medium text-slate-600">{humanize(key)}:</span>{' '}
                <span className="text-slate-900">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
