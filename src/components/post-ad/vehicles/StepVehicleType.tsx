'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Car, Truck, Bike } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { VEHICLE_TYPES, VehicleType } from '@/lib/constants/vehicles';

interface StepVehicleTypeProps {
  locale: Locale;
  title: string;
  description: string;
  vehicleType: VehicleType | '';
  onChange: (data: { title?: string; description?: string; vehicleType?: VehicleType }) => void;
}

const TYPE_ICONS: Partial<Record<VehicleType, React.ReactNode>> = {
  sedan: <Car className="w-6 h-6" />,
  suv: <Car className="w-6 h-6" />,
  van: <Truck className="w-6 h-6" />,
  truck: <Truck className="w-6 h-6" />,
  pickup: <Truck className="w-6 h-6" />,
  hatchback: <Car className="w-6 h-6" />,
  coupe: <Car className="w-6 h-6" />,
  motorcycle: <Bike className="w-6 h-6" />,
};

export const StepVehicleType: React.FC<StepVehicleTypeProps> = ({
  locale,
  title,
  description,
  vehicleType,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
  const tPostAd = useTranslations('postAd');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6">
      {/* Ad Title */}
      <div>
        <label className={labelClass}>
          {t('adTitle')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={tPostAd('enterTitle')}
          className={inputClass}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Ad Description */}
      <div>
        <label className={labelClass}>
          {t('adDetails')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={tPostAd('enterDescription')}
          className={`${inputClass} resize-none`}
          dir={rtl ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Vehicle Type */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('vehicleType')} <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {VEHICLE_TYPES.map(({ key }) => {
            const isSelected = vehicleType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ vehicleType: key })}
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
                  {TYPE_ICONS[key] || <Car className="w-6 h-6" />}
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
    </div>
  );
};
