'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';

export interface RealEstateAmenitiesData {
  security: boolean;
  gym: boolean;
  swimming_pool: boolean;
  garden: boolean;
  internet: boolean;
  cable_tv: boolean;
  pets_allowed: boolean;
  wheelchair_access: boolean;
  smart_home_features: boolean;
}

interface StepRealEstateAmenitiesProps {
  locale: Locale;
  data: RealEstateAmenitiesData;
  onChange: (data: Partial<RealEstateAmenitiesData>) => void;
}

const AMENITY_KEYS: Array<{ key: keyof RealEstateAmenitiesData; translationKey: string }> = [
  { key: 'security', translationKey: 'security' },
  { key: 'gym', translationKey: 'gym' },
  { key: 'swimming_pool', translationKey: 'swimmingPool' },
  { key: 'garden', translationKey: 'garden' },
  { key: 'internet', translationKey: 'internet' },
  { key: 'cable_tv', translationKey: 'cableTV' },
  { key: 'pets_allowed', translationKey: 'petsAllowed' },
  { key: 'wheelchair_access', translationKey: 'wheelchairAccess' },
  { key: 'smart_home_features', translationKey: 'smartHomeFeatures' },
];

export const StepRealEstateAmenities: React.FC<StepRealEstateAmenitiesProps> = ({ locale, data, onChange }) => {
  const rtl = isRTL(locale);
  const t = useTranslations('postAd.realEstate');

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('amenities')}
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {AMENITY_KEYS.map((amenity) => {
            const selected = data[amenity.key];
            return (
              <button
                type="button"
                key={amenity.key}
                onClick={() => onChange({ [amenity.key]: !selected })}
                className={`rounded-2xl border p-4 text-left transition ${
                  selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <div className="text-sm font-semibold">{t(amenity.translationKey)}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
