'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2, CheckCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  HealthBeautySubcategory,
  HEALTH_BEAUTY_SUBCATEGORY_LABEL_KEYS,
  getHealthBeautyFieldTranslationKey,
  getHealthBeautyOptionTranslationKey,
} from '@/lib/constants/health-beauty-wizard';
import { HealthMediaData } from './StepHealthMedia';
import { UploadedPhoto } from '@/components/post-ad/ImageUploader';

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
    street: string;
    postalCode: string;
    lat: number | null;
    lng: number | null;
    sellerName: string;
    phone: string;
    whatsapp: string;
    email: string;
    preferredContact: string;
    hidePhone: boolean;
  };
  onEdit: (stepIndex: number) => void;
}

export const StepHealthReview: React.FC<StepHealthReviewProps> = ({
  locale,
  basic,
  general,
  specs,
  media,
  contact,
  onEdit,
}) => {
  const t = useTranslations('postAd.healthBeauty');
  const rtl = isRTL(locale);

  const subcategoryLabel = basic.subcategory
    ? t(HEALTH_BEAUTY_SUBCATEGORY_LABEL_KEYS[basic.subcategory] as Parameters<typeof t>[0])
    : '-';

  const getFieldLabel = (key: string) => {
    const translationKey = getHealthBeautyFieldTranslationKey(key);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : key;
  };

  const getOptionLabel = (value: string) => {
    const translationKey = getHealthBeautyOptionTranslationKey(value);
    return t.has(translationKey as Parameters<typeof t>[0]) ? t(translationKey as Parameters<typeof t>[0]) : value;
  };

  const stringifyValue = (value: unknown): string => {
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
    if (typeof value === 'boolean') return value ? t('optionLabels.yes') : t('optionLabels.no');
    if (typeof value === 'string') return getOptionLabel(value);
    return String(value);
  };

  // Build specs rows from the specs object, filtering out empty values
  const specsRows = Object.entries(specs)
    .filter(([_key, value]) => {
      if (value === '' || value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
    .map(([key, value]) => [key, stringifyValue(value)] as [string, string]);

  const sections = [
    {
      name: t('reviewBasicInfo'),
      editStep: 1,
      rows: [
        ['title', basic.title],
        ['description', basic.description],
        ['subcategory', subcategoryLabel],
      ],
    },
    {
      name: t('reviewGeneralDetails'),
      editStep: 2,
      rows: [
        ['price', general.price === '' ? '-' : `${general.price}`],
        ['currency', stringifyValue(general.currency)],
        ['condition', stringifyValue(general.condition)],
        ['brand', general.brand || '-'],
        ['seller_type', stringifyValue(general.seller_type)],
      ],
    },
    {
      name: t('reviewSpecifications'),
      editStep: 3,
      rows: specsRows,
    },
    {
      name: t('reviewLocation'),
      editStep: 5,
      rows: [
        ['city', contact.city],
        ['street', contact.street || '-'],
        ['postalCode', contact.postalCode || '-'],
        ['mapCoordinates', contact.lat !== null && contact.lng !== null ? `${contact.lat.toFixed(4)}, ${contact.lng.toFixed(4)}` : '-'],
      ],
    },
    {
      name: t('reviewContact'),
      editStep: 5,
      rows: [
        ['sellerName', contact.sellerName],
        ['phone', contact.hidePhone ? t('hiddenFromPublic') : contact.phone],
        ['whatsapp', contact.whatsapp || '-'],
        ['email', contact.email || '-'],
        ['preferredContact', stringifyValue(contact.preferredContact)],
      ],
    },
    {
      name: t('reviewMedia'),
      editStep: 4,
      rows: [
        ['images', media.images.length > 0 ? `${media.images.length} ${t('photos')}` : t('noPhotos')],
        ['video', media.video || t('noVideos')],
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className={`text-center ${rtl ? 'text-right' : 'text-left'}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
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
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition ${
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
      {media.images.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className={`px-6 py-4 bg-slate-50 border-b border-slate-200 ${rtl ? 'text-right' : 'text-left'}`}>
            <h4 className="font-semibold text-slate-800">{t('photoPreview')}</h4>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.images.slice(0, 10).map((photo: UploadedPhoto, index: number) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative"
                >
                  <img
                    src={photo.url}
                    alt={`${t('photo')} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 9 && media.images.length > 10 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        +{media.images.length - 10}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className={`text-sm text-slate-500 mt-4 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('totalPhotos', { count: media.images.length })}
            </p>
          </div>
        </div>
      )}

      {/* Final Notes */}
      <div className={`bg-emerald-50 border border-emerald-200 rounded-xl p-6 ${rtl ? 'text-right' : 'text-left'}`}>
        <h5 className="font-semibold text-emerald-800 mb-2">{t('finalNotesTitle')}</h5>
        <ul className={`space-y-2 text-emerald-700 ${rtl ? 'list-disc pr-5 pl-0' : 'list-disc pl-5'}`}>
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
