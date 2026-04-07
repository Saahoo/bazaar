'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import {
  VehicleType, EngineType, GearType, BodyType,
  getMakesForType, getModelsForMake, getMakeName,
  ENGINE_TYPES, GEAR_TYPES, BODY_TYPES, ENGINE_SIZES,
  TRIM_LEVELS, getYearRange,
} from '@/lib/constants/vehicles';

export interface VehicleSpecsData {
  year: string;
  make: string;
  model: string;
  engineType: EngineType | '';
  trimLevel: string;
  bodyType: BodyType | '';
  gearType: GearType | '';
  engineSize: string;
  enginePower: string;
}

interface StepVehicleSpecsProps {
  locale: Locale;
  vehicleType: VehicleType;
  data: VehicleSpecsData;
  onChange: (data: Partial<VehicleSpecsData>) => void;
}

export const StepVehicleSpecs: React.FC<StepVehicleSpecsProps> = ({
  locale,
  vehicleType,
  data,
  onChange,
}) => {
  const t = useTranslations('postAd.vehicles');
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  const makes = getMakesForType(vehicleType);
  const models = data.make ? getModelsForMake(vehicleType, data.make) : [];
  const years = getYearRange();

  const handleMakeChange = (makeKey: string) => {
    onChange({ make: makeKey, model: '' });
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {t('specifications')}
      </h3>

      {/* Year */}
      <div>
        <label className={labelClass}>
          {t('year')} <span className="text-red-500">*</span>
        </label>
        <select
          value={data.year}
          onChange={(e) => onChange({ year: e.target.value })}
          className={`${inputClass} bg-white`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{t('selectYear')}</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {/* Make */}
      <div>
        <label className={labelClass}>
          {t('make')} <span className="text-red-500">*</span>
        </label>
        <select
          value={data.make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className={`${inputClass} bg-white`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{t('selectMake')}</option>
          {makes.map((m) => (
            <option key={m.key} value={m.key}>{getMakeName(m, locale)}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className={labelClass}>
          {t('model')} <span className="text-red-500">*</span>
        </label>
        <select
          value={data.model}
          onChange={(e) => onChange({ model: e.target.value })}
          className={`${inputClass} bg-white`}
          disabled={!data.make}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{data.make ? t('selectModel') : t('selectMakeFirst')}</option>
          {models.map((m) => (
            <option key={m.key} value={m.key}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Engine Type */}
      <div>
        <label className={labelClass}>{t('engineType')}</label>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {ENGINE_TYPES.map((et) => {
            const isSelected = data.engineType === et;
            return (
              <button
                key={et}
                type="button"
                onClick={() => onChange({ engineType: et })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t(et)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trim / Options Level */}
      <div>
        <label className={labelClass}>{t('trimLevel')}</label>
        <select
          value={data.trimLevel}
          onChange={(e) => onChange({ trimLevel: e.target.value })}
          className={`${inputClass} bg-white`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{t('selectTrim')}</option>
          {TRIM_LEVELS.map((tl) => (
            <option key={tl} value={tl}>{t(`trim_${tl}`)}</option>
          ))}
        </select>
      </div>

      {/* Body Type */}
      <div>
        <label className={labelClass}>{t('bodyType')}</label>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {BODY_TYPES.map((bt) => {
            const isSelected = data.bodyType === bt;
            return (
              <button
                key={bt}
                type="button"
                onClick={() => onChange({ bodyType: bt })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t(bt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gear Type */}
      <div>
        <label className={labelClass}>{t('gearType')}</label>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {GEAR_TYPES.map((gt) => {
            const isSelected = data.gearType === gt;
            return (
              <button
                key={gt}
                type="button"
                onClick={() => onChange({ gearType: gt })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t(gt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engine Size + Power */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('engineSize')}</label>
          <select
            value={data.engineSize}
            onChange={(e) => onChange({ engineSize: e.target.value })}
            className={`${inputClass} bg-white`}
          >
            <option value="">{t('selectEngineSize')}</option>
            {ENGINE_SIZES.map((s) => (
              <option key={s} value={s}>{s} L</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('enginePower')}</label>
          <input
            type="text"
            value={data.enginePower}
            onChange={(e) => onChange({ enginePower: e.target.value })}
            placeholder={t('enterEnginePower')}
            className={inputClass}
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
};
