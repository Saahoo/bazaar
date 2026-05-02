'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2, CheckCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AnimalsLivestockSubcategory, ANIMALS_SUBCATEGORIES, getAnimalsFieldTranslationKey, getAnimalsOptionTranslationKey } from '@/lib/constants/animals-livestock-wizard';
import { AnimalsMediaData } from './StepAnimalsMedia';
import { UploadedPhoto } from '@/components/post-ad/ImageUploader';

interface StepAnimalsReviewProps {
  locale: Locale;
  title: string;
  description: string;
  subcategory: AnimalsLivestockSubcategory | '';
  breed: string;
  quantity: number | '';
  age: number | '';
  ageUnit: string;
  healthStatus: string;
  price: number | '';
  priceType: string;
  street: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  sellerName: string;
  phone: string;
  email: string;
  preferredContact: string;
  hidePhone: boolean;
  specs: Record<string, unknown>;
  media: AnimalsMediaData;
  onEdit: (stepIndex: number) => void;
}

export const StepAnimalsReview: React.FC<StepAnimalsReviewProps> = ({
  locale,
  title,
  description,
  subcategory,
  breed,
  quantity,
  age,
  ageUnit,
  healthStatus,
  price,
  priceType,
  street,
  city,
  postalCode,
  lat,
  lng,
  sellerName,
  phone,
  email,
  preferredContact,
  hidePhone,
  specs,
  media,
  onEdit,
}) => {
  const t = useTranslations('postAd.animals');
  const rtl = isRTL(locale);

  const subcategoryLabel = subcategory
    ? ANIMALS_SUBCATEGORIES.find((cat) => cat.value === subcategory)?.label || subcategory
    : '-';

  const getFieldLabel = (key: string) => {
    const translationKey = getAnimalsFieldTranslationKey(key);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : key;
  };

  const getOptionLabel = (value: string) => {
    const translationKey = getAnimalsOptionTranslationKey(value);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : value;
  };

  const stringifyValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map((item) => getOptionLabel(String(item))).join(', ');
    if (typeof value === 'boolean') return value ? t('optionLabels.yes') : t('optionLabels.no');
    if (typeof value === 'string') return getOptionLabel(value);
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
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
      name: t('reviewSpecifications'),
      editStep: 2,
      rows: [
        ['breed', breed],
        ['quantity', quantity],
        ['age', age ? `${age} ${ageUnit}` : '-'],
        ['healthStatus', stringifyValue(healthStatus)],
        ['price', price ? `${price} (${priceType})` : '-'],
        ...Object.entries(specs).map(([key, value]) => [key, stringifyValue(value)]),
      ],
    },
    {
      name: t('reviewLocation'),
      editStep: 3,
      rows: [
        ['city', city],
        ['street', street || '-'],
        ['postalCode', postalCode || '-'],
        ['mapCoordinates', lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : '-'],
      ],
    },
    {
      name: t('reviewContact'),
      editStep: 3,
      rows: [
        ['sellerName', sellerName],
        ['phone', hidePhone ? t('hiddenFromPublic') : phone],
        ['email', email],
        ['preferredContact', stringifyValue(preferredContact)],
      ],
    },
    {
      name: t('reviewMedia'),
      editStep: 4,
      rows: [
        ['photos', media.photos.length > 0 ? `${media.photos.length} ${t('photos')}` : t('noPhotos')],
        ['videos', media.videos && media.videos.length > 0 ? `${media.videos.length} ${t('videos')}` : t('noVideos')],
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className={`text-center ${rtl ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className={`text-2xl font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('reviewTitle')}
        </h3>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto ${rtl ? 'text-right' : 'text-left'}`}>
          {t('reviewDescription')}
        </p>
      </div>

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
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition ${
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
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 ${rtl ? 'text-right' : 'text-left'}`}>
        <h5 className="font-semibold text-blue-800 mb-2">{t('finalNotesTitle')}</h5>
        <ul className={`space-y-2 text-blue-700 ${rtl ? 'list-disc pr-5 pl-0' : 'list-disc pl-5'}`}>
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