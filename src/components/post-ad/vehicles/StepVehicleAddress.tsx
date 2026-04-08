'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

export interface VehicleAddressData {
  city: string;
  street: string;
  area: string;
}

interface StepVehicleAddressProps {
  locale: Locale;
  data: VehicleAddressData;
  onChange: (data: Partial<VehicleAddressData>) => void;
}

export const StepVehicleAddress: React.FC<StepVehicleAddressProps> = ({
  locale,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
  const rtl = isRTL(locale);
  const { cities } = useCities();

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('address')}
      </h3>

      {/* City */}
      <div>
        <label className={labelClass}>
          {t('city')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={`${inputClass} appearance-none bg-white pr-10`}
            dir={rtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('selectCity')}</option>
            {cities.map((city) => (
              <option key={city.name_en} value={city.name_en}>
                {getManagedCityName(city, locale)}{city.country ? ` — ${city.country}` : ''}
              </option>
            ))}
          </select>
          <MapPin
            className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              rtl ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      {/* Street */}
      <div>
        <label className={labelClass}>{t('street')}</label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder={t('enterStreet')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Area */}
      <div>
        <label className={labelClass}>{t('area')}</label>
        <input
          type="text"
          value={data.area}
          onChange={(e) => onChange({ area: e.target.value })}
          placeholder={t('enterArea')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Map Location (placeholder) */}
      <div>
        <label className={labelClass}>
          {t('mapLocation')} <span className="text-red-500">*</span>
        </label>
        <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">{t('clickMapToPin')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
