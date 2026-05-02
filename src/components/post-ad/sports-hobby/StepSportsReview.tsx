'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2, CheckCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { SportsHobbySubcategory, SPORTS_HOBBY_SUBCATEGORY_LABEL_KEYS, getSportsHobbySpecsConfig, getSportsHobbyFieldTranslationKey, getSportsHobbyOptionTranslationKey } from '@/lib/constants/sports-hobby-wizard';
import { SportsMediaData } from './StepSportsMedia';
import { UploadedPhoto } from '@/components/post-ad/ImageUploader';

interface StepSportsReviewProps {
  locale: Locale;
  title: string;
  description: string;
  subcategory: SportsHobbySubcategory | '';
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  specs: Record<string, unknown>;
  media: SportsMediaData;
  onEdit: (stepIndex: number) => void;
}

export const StepSportsReview: React.FC<StepSportsReviewProps> = ({
  locale,
  title,
  description,
  subcategory,
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
  const t = useTranslations('postAd.sportsHobby');
  const rtl = isRTL(locale);

  // Get subcategory label using translation key constants
  const subcategoryLabel = subcategory
    ? t(SPORTS_HOBBY_SUBCATEGORY_LABEL_KEYS[subcategory] as Parameters<typeof t>[0])
    : '-';

  // Get spec fields for the current subcategory
  const specFields = getSportsHobbySpecsConfig(subcategory);

  const getFieldLabel = (key: string) => {
    const translationKey = getSportsHobbyFieldTranslationKey(key);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : key;
  };

  const getOptionLabel = (value: string) => {
    const translationKey = getSportsHobbyOptionTranslationKey(value);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : value;
  };

  const stringifyValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map((item) => getOptionLabel(String(item))).join(', ');
    if (typeof value === 'boolean') return value ? t('optionLabels.yes') : t('optionLabels.no');
    if (typeof value === 'string') return getOptionLabel(value);
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  };

  // Extract consolidated fields from specs
  const price = specs.price as number | '';
  const currency = specs.currency as string || '';
  const condition = specs.condition as string || '';
  const brand = specs.brand as string || '';
  const brandOther = specs.brandOther as string || '';
  const sellerType = specs.seller_type as string || '';

  // Format price with currency
  const formattedPrice = price === '' || price === undefined ? '' : `${price} ${currency}`;

  // Get actual brand value (use brandOther if brand is "Other")
  const actualBrand = brand === 'Other' && brandOther ? brandOther : brand;

  // Prepare spec rows (excluding consolidated fields that will be shown separately)
  const specRows = specFields
    .filter((field) => {
      // Skip consolidated fields that are shown in the main spec section
      const consolidatedFields = ['price', 'currency', 'condition', 'brand', 'seller_type'];
      if (consolidatedFields.includes(field.key)) return false;

      const value = specs[field.key];
      if (!value || (typeof value === 'string' && value.trim() === '')) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
    .map((field) => {
      let value = specs[field.key];
      // Handle "Other" option with custom value
      if (value === 'Other') {
        const customKey = `${field.key}Other`;
        const customValue = specs[customKey];
        if (customValue && typeof customValue === 'string' && customValue.trim()) {
          value = customValue;
        }
      }
      return [field.key, stringifyValue(value)] as [string, string];
    });

  const sections = [
    {
      name: t('reviewBasicInfo'),
      editStep: 1, // shStepBasic
      rows: [
        ['title', title],
        ['description', description],
        ['subcategory', subcategoryLabel],
      ],
    },
    {
      name: t('reviewSpecifications'),
      editStep: 2, // shStepSpecs (now includes consolidated fields)
      rows: [
        ['price', formattedPrice],
        ['condition', stringifyValue(condition)],
        ['brand', stringifyValue(actualBrand)],
        ['sellerType', stringifyValue(sellerType)],
        ...specRows,
      ],
    },
    {
      name: t('reviewLocation'),
      editStep: 3, // shStepMedia (city/lat/lng come from media step)
      rows: [
        ['city', city],
        ['mapCoordinates', lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : '-'],
      ],
    },
    {
      name: t('reviewContact'),
      editStep: 4, // shStepContact
      rows: [
        ['phone', phone],
        ['whatsapp', whatsapp || '-'],
        ['email', email || '-'],
      ],
    },
    {
      name: t('reviewMedia'),
      editStep: 3, // shStepMedia
      rows: [
        ['photos', media.photos.length > 0 ? `${media.photos.length} ${t('photos')}` : t('noPhotos')],
        ['videos', media.videoUrl ? t('videoProvided') : t('noVideos')],
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`text-center ${rtl ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className={`text-2xl font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('reviewTitle')}
        </h3>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto ${rtl ? 'text-right' : 'text-left'}`}>
          {t('reviewDescription')}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className={`flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 ${
              rtl ? 'flex-row-reverse' : ''
            }`}>
              <h4 className="font-semibold text-slate-800">{section.name}</h4>
              <button
                type="button"
                onClick={() => onEdit(section.editStep)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition ${
                  rtl ? 'flex-row-reverse' : ''
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                {t('edit')}
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {section.rows.map(([key, value], rowIndex) => (
                <div
                  key={rowIndex}
                  className={`px-6 py-4 ${rtl ? 'text-right' : 'text-left'} ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="font-medium text-slate-700">
                      {getFieldLabel(String(key))}
                    </div>
                    <div className="md:col-span-2 text-slate-900">
                      {value || '-'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Media Preview */}
      {media.photos.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className={`px-6 py-4 bg-slate-50 border-b border-slate-200 ${rtl ? 'text-right' : 'text-left'}`}>
            <h4 className="font-semibold text-slate-800">{t('photoPreview')}</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.photos.slice(0, 10).map((photo: UploadedPhoto, index: number) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative"
                >
                  <img
                    src={photo.url}
                    alt={`${t('photo')} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 9 && media.photos.length > 10 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{media.photos.length - 10}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className={`text-sm text-slate-500 mt-4 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('totalPhotos', { count: media.photos.length })}
            </p>
          </div>
        </div>
      )}

      {/* Final Notes */}
      <div className={`bg-indigo-50 border border-indigo-200 rounded-xl p-6 ${rtl ? 'text-right' : 'text-left'}`}>
        <h5 className="font-semibold text-indigo-800 mb-2">{t('finalNotesTitle')}</h5>
        <ul className={`space-y-2 text-indigo-700 ${rtl ? 'list-disc pr-5 pl-0' : 'list-disc pl-5'}`}>
          <li>{t('finalNote1')}</li>
          <li>{t('finalNote2')}</li>
          <li>{t('finalNote3')}</li>
          <li>{t('finalNote4')}</li>
        </ul>
      </div>

      {/* Submit Confirmation */}
      <div className={`border border-green-200 bg-green-50 rounded-xl p-6 ${rtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-start gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h5 className="font-semibold text-green-800 mb-1">{t('readyToSubmit')}</h5>
            <p className="text-green-700 text-sm">
              {t('submitConfirmation')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
