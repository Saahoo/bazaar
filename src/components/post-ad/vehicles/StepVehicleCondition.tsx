'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { CURRENCIES } from '@/lib/constants/currencies';
import {
  VEHICLE_COLORS, VehicleColor, HandDrive, HAND_DRIVES,
  DAMAGE_TYPES, DamageType, VehicleOption,
  AFGHANISTAN_CITIES, VehicleType, getOptionsForVehicle,
} from '@/lib/constants/vehicles';

export interface VehicleConditionData {
  price: number | '';
  currency: string;
  mileage: string;
  color: VehicleColor | '';
  hasDamage: boolean | null;
  exchange: boolean | null;
  hasNumberPlate: boolean | null;
  numberPlateCity: string;
  handDrive: HandDrive | '';
  damageDetails: DamageType[];
  otherOptions: VehicleOption[];
}

interface StepVehicleConditionProps {
  locale: Locale;
  vehicleType: VehicleType;
  make: string;
  model: string;
  data: VehicleConditionData;
  onChange: (data: Partial<VehicleConditionData>) => void;
}

export const StepVehicleCondition: React.FC<StepVehicleConditionProps> = ({
  locale,
  vehicleType,
  make,
  model,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
  const tForm = useTranslations('form');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const availableOptions = getOptionsForVehicle(vehicleType, make, model);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  const toggleDamageType = (dt: DamageType) => {
    const current = data.damageDetails || [];
    if (current.includes(dt)) {
      onChange({ damageDetails: current.filter((d) => d !== dt) });
    } else {
      onChange({ damageDetails: [...current, dt] });
    }
  };

  const toggleOption = (opt: VehicleOption) => {
    const current = data.otherOptions || [];
    if (current.includes(opt)) {
      onChange({ otherOptions: current.filter((o) => o !== opt) });
    } else {
      onChange({ otherOptions: [...current, opt] });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('conditionAndPrice')}
      </h3>

      {/* Price + Currency */}
      <div>
        <label className={labelClass}>
          {tForm('price')} <span className="text-red-500">*</span>
        </label>
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          <input
            type="number"
            min="0"
            value={data.price === '' ? '' : data.price}
            onChange={(e) => onChange({ price: e.target.value ? Number(e.target.value) : '' })}
            placeholder={t('enterPrice')}
            className={`${inputClass} flex-1`}
            dir="ltr"
          />
          <select
            value={data.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className={`px-3 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 w-28 ${rtl ? 'text-right' : ''}`}
          >
            {Object.values(CURRENCIES).map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} {curr.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mileage */}
      <div>
        <label className={labelClass}>{t('mileage')}</label>
        <input
          type="text"
          value={data.mileage}
          onChange={(e) => onChange({ mileage: e.target.value })}
          placeholder={t('enterMileage')}
          className={inputClass}
          dir="ltr"
        />
      </div>

      {/* Color */}
      <div>
        <label className={labelClass}>{t('color')}</label>
        <select
          value={data.color}
          onChange={(e) => onChange({ color: e.target.value as VehicleColor })}
          className={`${inputClass} bg-white`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{t('selectColor')}</option>
          {VEHICLE_COLORS.map((c) => (
            <option key={c} value={c}>{t(`color_${c}`)}</option>
          ))}
        </select>
      </div>

      {/* Damage: Yes / No */}
      <div>
        <label className={labelClass}>{t('damage')}</label>
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ hasDamage: val, damageDetails: val ? data.damageDetails : [] })}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition ${
                data.hasDamage === val
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {val ? tCommon('yes') : tCommon('no')}
            </button>
          ))}
        </div>
      </div>

      {/* Damage Details (if yes) */}
      {data.hasDamage && (
        <div>
          <label className={labelClass}>{t('damageDetails')}</label>
          <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            {DAMAGE_TYPES.map((dt) => {
              const isSelected = (data.damageDetails || []).includes(dt);
              return (
                <button
                  key={dt}
                  type="button"
                  onClick={() => toggleDamageType(dt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                    isSelected
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  {t(`damage_${dt}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Exchange */}
      <div>
        <label className={labelClass}>{t('exchange')}</label>
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ exchange: val })}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition ${
                data.exchange === val
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {val ? tCommon('yes') : tCommon('no')}
            </button>
          ))}
        </div>
      </div>

      {/* Number Plate */}
      <div>
        <label className={labelClass}>{t('numberPlate')}</label>
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ hasNumberPlate: val, numberPlateCity: val ? data.numberPlateCity : '' })}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition ${
                data.hasNumberPlate === val
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {val ? tCommon('yes') : tCommon('no')}
            </button>
          ))}
        </div>
      </div>

      {/* Number Plate City (if yes) */}
      {data.hasNumberPlate && (
        <div>
          <label className={labelClass}>{t('numberPlateCity')}</label>
          <select
            value={data.numberPlateCity}
            onChange={(e) => onChange({ numberPlateCity: e.target.value })}
            className={`${inputClass} bg-white`}
            dir={rtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('selectCity')}</option>
            {AFGHANISTAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}

      {/* Hand Drive */}
      <div>
        <label className={labelClass}>{t('handDrive')}</label>
        <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          {HAND_DRIVES.map((hd) => (
            <button
              key={hd}
              type="button"
              onClick={() => onChange({ handDrive: hd })}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition ${
                data.handDrive === hd
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {t(`drive_${hd}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Other Options */}
      <div>
        <h3 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('otherOptions')}
        </h3>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {availableOptions.map((opt) => {
            const isSelected = (data.otherOptions || []).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleOption(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t(`opt_${opt}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
