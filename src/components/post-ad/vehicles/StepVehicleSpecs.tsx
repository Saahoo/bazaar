'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import {
  VehicleType, EngineType, GearType, BodyType, WheelDriveType,
  VEHICLE_DATA,
  ENGINE_TYPES, GEAR_TYPES, BODY_TYPES, WHEEL_DRIVE_TYPES,
  getYearRange,
} from '@/lib/constants/vehicles';

export interface VehicleSpecsData {
  year: string;
  make: string;
  customMake: string;
  model: string;
  customModel: string;
  vin: string;
  engineType: EngineType | '';
  wheelDriveType: WheelDriveType | '';
  trimLevel: string;
  customTrim: string;
  bodyType: BodyType | '';
  customBodyType: string;
  gearType: GearType | '';
  engineSize: string;
  enginePower: string;
  // Motorcycle-specific fields
  bikeType?: string;
  displacementCC?: string;
  numberOfCylinders?: string;
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

  // Conditional logic helpers
  const isMotorcycle = vehicleType === 'motorcycle';

  const makeOptions = Object.entries(VEHICLE_DATA)
    .map(([makeName, entry]) => ({ makeName, makeKey: entry.makeKey }))
    .sort((a, b) => {
      const aOther = a.makeName.toLowerCase() === 'other';
      const bOther = b.makeName.toLowerCase() === 'other';
      if (aOther && !bOther) return 1;
      if (!aOther && bOther) return -1;
      return a.makeName.localeCompare(b.makeName, 'en', { sensitivity: 'base' });
    });

  const selectedMakeName = makeOptions.find((m) => m.makeKey === data.make)?.makeName;
  const selectedMakeEntry = selectedMakeName ? VEHICLE_DATA[selectedMakeName] : null;

  const modelOptions = selectedMakeEntry
    ? selectedMakeEntry.models.map((modelName) => ({
      modelName,
      modelKey: selectedMakeEntry.modelKeyMap[modelName] || modelName,
    }))
    : [];

  const selectedModelName = modelOptions.find((m) => m.modelKey === data.model)?.modelName;
  const selectedYear = Number(data.year);

  const trimLevels = (() => {
    if (!selectedMakeEntry || !selectedModelName) return [] as string[];

    const yearSpecific = Number.isFinite(selectedYear)
      ? selectedMakeEntry.trimsByYear[selectedModelName]?.[selectedYear]
      : undefined;

    if (Array.isArray(yearSpecific) && yearSpecific.length > 0) {
      return yearSpecific;
    }

    return selectedMakeEntry.trims[selectedModelName] || [];
  })();

  const years = getYearRange();

  const handleMakeChange = (makeKey: string) => {
    onChange({ make: makeKey, model: '', customMake: '', customModel: '', customTrim: '' });
  };

  const handleModelChange = (modelKey: string) => {
    onChange({ model: modelKey, customModel: '' });
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
          aria-label={t('year')}
          title={t('year')}
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
          aria-label={t('make')}
          title={t('make')}
          value={data.make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className={`${inputClass} bg-white`}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{t('selectMake')}</option>
          {makeOptions.map((m) => (
            <option key={m.makeKey} value={m.makeKey}>{m.makeName}</option>
          ))}
          <option value="__other__">{t('other')}</option>
        </select>
        {data.make === '__other__' && (
          <input
            type="text"
            value={data.customMake}
            onChange={(e) => onChange({ customMake: e.target.value })}
            placeholder={t('enterMake')}
            className={`${inputClass} mt-2`}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        )}
      </div>

      {/* Model */}
      <div>
        <label className={labelClass}>
          {t('model')} <span className="text-red-500">*</span>
        </label>
        {data.make === '__other__' ? (
          <input
            type="text"
            value={data.customModel}
            onChange={(e) => onChange({ customModel: e.target.value })}
            placeholder={t('enterModel')}
            className={inputClass}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        ) : (
          <>
            <select
              aria-label={t('model')}
              title={t('model')}
              value={data.model}
              onChange={(e) => handleModelChange(e.target.value)}
              className={`${inputClass} bg-white`}
              disabled={!data.make}
              dir={rtl ? 'rtl' : 'ltr'}
            >
              <option value="">{data.make ? t('selectModel') : t('selectMakeFirst')}</option>
              {modelOptions.map((m) => (
                <option key={m.modelKey} value={m.modelKey}>{m.modelName}</option>
              ))}
              {data.make && <option value="__other__">{t('other')}</option>}
            </select>
            {data.model === '__other__' && (
              <input
                type="text"
                value={data.customModel}
                onChange={(e) => onChange({ customModel: e.target.value })}
                placeholder={t('enterModel')}
                className={`${inputClass} mt-2`}
                dir={rtl ? 'rtl' : 'ltr'}
              />
            )}
          </>
        )}
      </div>

      {/* Trim / Option */}
      <div>
        <label className={labelClass}>{t('trimLevel')}</label>
        <select
          aria-label={t('trimLevel')}
          title={t('trimLevel')}
          value={data.trimLevel}
          onChange={(e) => onChange({ trimLevel: e.target.value, customTrim: '' })}
          className={`${inputClass} bg-white`}
          disabled={!data.make}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <option value="">{data.make ? t('selectTrim') : t('selectMakeFirst')}</option>
          {trimLevels.map((tl) => (
            <option key={tl} value={tl}>{t.has(`trim_${tl}`) ? t(`trim_${tl}`) : tl}</option>
          ))}
          <option value="__other__">{t('other')}</option>
        </select>
        {data.trimLevel === '__other__' && (
          <input
            type="text"
            value={data.customTrim}
            onChange={(e) => onChange({ customTrim: e.target.value })}
            placeholder={t('enterTrim')}
            className={`${inputClass} mt-2`}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        )}
      </div>

      {/* VIN */}
      <div>
        <label className={labelClass}>{t('vin')}</label>
        <input
          type="text"
          value={data.vin}
          onChange={(e) => onChange({ vin: e.target.value })}
          placeholder={t('enterVIN')}
          className={inputClass}
          dir="ltr"
          maxLength={17}
        />
        <p className={`mt-1 text-xs text-slate-400 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('vinHint')}
        </p>
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
                onClick={() => onChange({ bodyType: bt, customBodyType: bt === 'other' ? data.customBodyType : '' })}
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
        {data.bodyType === 'other' && (
          <input
            type="text"
            value={data.customBodyType}
            onChange={(e) => onChange({ customBodyType: e.target.value })}
            placeholder={t('enterBodyType')}
            className={`${inputClass} mt-2`}
            dir={rtl ? 'rtl' : 'ltr'}
          />
        )}
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

      {/* Wheel Drive Type */}
      <div>
        <label className={labelClass}>{t('wheelDriveType')}</label>
        <div className={`flex flex-wrap gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {WHEEL_DRIVE_TYPES.map((wd) => {
            const isSelected = data.wheelDriveType === wd;
            return (
              <button
                key={wd}
                type="button"
                onClick={() => onChange({ wheelDriveType: wd })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {t((`wd_${wd}`) as Parameters<typeof t>[0])}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engine Size + Power */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('engineSize')}</label>
          <input
            type="text"
            value={data.engineSize}
            onChange={(e) => onChange({ engineSize: e.target.value })}
            placeholder={isMotorcycle ? t('enterEngineSizeCC') : t('enterEngineSize')}
            className={inputClass}
            dir="ltr"
          />
          <p className={`mt-1 text-xs text-slate-400 ${rtl ? 'text-right' : 'text-left'}`}>
            {isMotorcycle ? t('engineSizeHintCC') : t('engineSizeHint')}
          </p>
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
          <p className={`mt-1 text-xs text-slate-400 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('enginePowerHint')}
          </p>
        </div>
      </div>

      {/* Motorcycle-specific fields */}
      {isMotorcycle && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('bikeType')}</label>
              <select
                aria-label={t('bikeType')}
                title={t('bikeType')}
                value={data.bikeType || ''}
                onChange={(e) => onChange({ bikeType: e.target.value })}
                className={`${inputClass} bg-white`}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('selectBikeType')}</option>
                <option value="sport">{t('bikeType_sport')}</option>
                <option value="cruiser">{t('bikeType_cruiser')}</option>
                <option value="touring">{t('bikeType_touring')}</option>
                <option value="offRoad">{t('bikeType_offRoad')}</option>
                <option value="scooter">{t('bikeType_scooter')}</option>
                <option value="standard">{t('bikeType_standard')}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('numberOfCylinders')}</label>
              <select
                aria-label={t('numberOfCylinders')}
                title={t('numberOfCylinders')}
                value={data.numberOfCylinders || ''}
                onChange={(e) => onChange({ numberOfCylinders: e.target.value })}
                className={`${inputClass} bg-white`}
                dir={rtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('selectCylinders')}</option>
                <option value="1">{t('cylinders_1')}</option>
                <option value="2">{t('cylinders_2')}</option>
                <option value="3">{t('cylinders_3')}</option>
                <option value="4">{t('cylinders_4')}</option>
                <option value="6">{t('cylinders_6')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('displacementCC')}</label>
            <input
              type="text"
              value={data.displacementCC || ''}
              onChange={(e) => onChange({ displacementCC: e.target.value })}
              placeholder={t('enterDisplacementCC')}
              className={inputClass}
              dir="ltr"
            />
          </div>
        </>
      )}
    </div>
  );
};
