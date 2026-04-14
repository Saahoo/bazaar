'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { Home, Building2, Warehouse, TreePine, Users, MapPin } from 'lucide-react';
import type { RealEstatePropertyType, ListingType } from './types';

const PROPERTY_TYPE_KEYS: Array<{ key: RealEstatePropertyType; translationKey: string; icon: React.ReactNode }> = [
  { key: 'apartment', translationKey: 'apartment', icon: <Building2 className="w-6 h-6" /> },
  { key: 'house_villa', translationKey: 'house', icon: <Home className="w-6 h-6" /> },
  { key: 'commercial', translationKey: 'commercial', icon: <Building2 className="w-6 h-6" /> },
  { key: 'office', translationKey: 'office', icon: <Building2 className="w-6 h-6" /> },
  { key: 'shop_retail', translationKey: 'shop', icon: <Building2 className="w-6 h-6" /> },
  { key: 'land_plot', translationKey: 'land', icon: <TreePine className="w-6 h-6" /> },
  { key: 'industrial', translationKey: 'warehouse', icon: <Warehouse className="w-6 h-6" /> },
  { key: 'room_shared', translationKey: 'garage', icon: <Users className="w-6 h-6" /> },
  { key: 'other', translationKey: 'other', icon: <MapPin className="w-6 h-6" /> },
];

const LISTING_TYPE_KEYS: Array<{ key: ListingType; translationKey: string }> = [
  { key: 'sale', translationKey: 'forSale' },
  { key: 'rent', translationKey: 'forRent' },
];

interface StepRealEstateBasicInfoProps {
  locale: Locale;
  propertyType: RealEstatePropertyType | '';
  listingType: ListingType;
  title: string;
  description: string;
  onChange: (data: Partial<{ propertyType: RealEstatePropertyType; listingType: ListingType; title: string; description: string }>) => void;
}

export const StepRealEstateBasicInfo: React.FC<StepRealEstateBasicInfoProps> = ({
  locale,
  propertyType,
  listingType,
  title,
  description,
  onChange,
}) => {
  const rtl = isRTL(locale);
  const t = useTranslations('postAd.realEstate');

  const inputClass = `w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('stepBasicInfo')}
        </h3>
        <div className="grid gap-4">
          <div>
            <label className={labelClass}>
              {t('title')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder={t('titlePlaceholder')}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={t('descriptionPlaceholder')}
              className={`${inputClass} resize-none`}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={labelClass}>
              {t('propertyType')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROPERTY_TYPE_KEYS.map((type) => {
                const selected = propertyType === type.key;
                return (
                  <button
                    type="button"
                    key={type.key}
                    onClick={() => onChange({ propertyType: type.key })}
                    className={`group border rounded-2xl p-4 text-left transition duration-200 ${
                      selected
                        ? 'border-primary-500 bg-primary-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${selected ? 'text-primary-700' : 'text-slate-700'}`}>
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${selected ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                        {type.icon}
                      </div>
                      <span className="text-sm font-medium">{t(type.translationKey)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {t('listingType')} <span className="text-red-500">*</span>
            </label>
            <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
              {LISTING_TYPE_KEYS.map((type) => {
                const selected = listingType === type.key;
                return (
                  <button
                    type="button"
                    key={type.key}
                    onClick={() => onChange({ listingType: type.key })}
                    className={`px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition ${
                      selected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {t(type.translationKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
