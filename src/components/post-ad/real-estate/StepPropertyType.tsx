'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Home, Building2, Castle, TreePine, MapPinned } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';

export type PropertyType = 'apartment' | 'residence' | 'villa' | 'farmHouse' | 'land';
export type PropertyPurpose = 'forRent' | 'forSale' | 'forLease';

interface StepPropertyTypeProps {
  locale: Locale;
  propertyType: PropertyType | '';
  purpose: PropertyPurpose | '';
  onChange: (data: { propertyType?: PropertyType; purpose?: PropertyPurpose }) => void;
}

const PROPERTY_TYPES: { key: PropertyType; icon: React.ReactNode }[] = [
  { key: 'apartment', icon: <Building2 className="w-6 h-6" /> },
  { key: 'residence', icon: <Home className="w-6 h-6" /> },
  { key: 'villa', icon: <Castle className="w-6 h-6" /> },
  { key: 'farmHouse', icon: <TreePine className="w-6 h-6" /> },
  { key: 'land', icon: <MapPinned className="w-6 h-6" /> },
];

const PURPOSES: PropertyPurpose[] = ['forRent', 'forSale', 'forLease'];

export const StepPropertyType: React.FC<StepPropertyTypeProps> = ({
  locale,
  propertyType,
  purpose,
  onChange,
}) => {
  const t = useTranslations('postAd.realEstate');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-8">
      {/* Property Type */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('propertyType')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROPERTY_TYPES.map(({ key, icon }) => {
            const isSelected = propertyType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ propertyType: key })}
                className={`group p-4 rounded-xl border-2 transition duration-200 flex flex-col items-center text-center gap-3 cursor-pointer hover:shadow-md ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}
                >
                  {icon}
                </div>
                <span
                  className={`font-medium text-sm transition ${
                    isSelected ? 'text-primary-700' : 'text-slate-700 group-hover:text-primary-600'
                  }`}
                >
                  {t(key)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purpose */}
      {propertyType && (
        <div>
          <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('purpose')}
          </h3>
          <div className={`flex flex-wrap gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            {PURPOSES.map((p) => {
              const isSelected = purpose === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ purpose: p })}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold border-2 transition cursor-pointer ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {t(p)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
