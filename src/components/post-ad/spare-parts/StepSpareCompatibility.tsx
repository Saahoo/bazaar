'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  ELECTRONICS_OR_MACHINERY_SUBCATEGORIES,
  SPARE_MAKE_MODELS,
  SparePartsSubcategory,
  VEHICLE_SPARE_SUBCATEGORIES,
} from '@/lib/constants/spare-parts-wizard';
import { InputField, SelectField, TextAreaField } from './SpareFieldControls';

interface SpareCompatibilityData {
  make: string;
  model: string;
  year_from: string;
  year_to: string;
  engine_type: string;
  transmission: string;
  part_compatibility_notes: string;
  device_type: string;
  compatible_brand: string;
  compatible_model: string;
  version_series: string;
  technical_compatibility_notes: string;
}

interface StepSpareCompatibilityProps {
  locale: Locale;
  subcategory: SparePartsSubcategory | '';
  data: SpareCompatibilityData;
  onChange: (updates: Partial<SpareCompatibilityData>) => void;
}

const ENGINE_OPTIONS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];
const DEVICE_TYPE_OPTIONS = ['Phone', 'Laptop', 'Machine', 'Tablet', 'Other'];

export const StepSpareCompatibility: React.FC<StepSpareCompatibilityProps> = ({ locale, subcategory, data, onChange }) => {
  const t = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const toOptionKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const optionLabel = (value: string): string => {
    const key = `optionLabels.${toOptionKey(value)}` as Parameters<typeof t>[0];
    return t.has(key) ? t(key) : value;
  };

  const isVehiclePart = VEHICLE_SPARE_SUBCATEGORIES.includes(subcategory as SparePartsSubcategory);
  const isDevicePart = ELECTRONICS_OR_MACHINERY_SUBCATEGORIES.includes(subcategory as SparePartsSubcategory);

  const modelOptions = useMemo(() => {
    if (!data.make || !SPARE_MAKE_MODELS[data.make]) return [];
    return SPARE_MAKE_MODELS[data.make];
  }, [data.make]);

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepCompatibility')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('compatibilityDescription')}</p>
      </div>

      {!subcategory && (
        <p className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('selectSubcategoryFirst')}
        </p>
      )}

      {isVehiclePart && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label={t('make')}
            required
            rtl={rtl}
            value={data.make}
            onChange={(value) => onChange({ make: value, model: '' })}
            placeholder={t('selectMake')}
            options={Object.keys(SPARE_MAKE_MODELS)}
          />

          <SelectField
            label={t('model')}
            required
            rtl={rtl}
            value={data.model}
            onChange={(value) => onChange({ model: value })}
            placeholder={data.make ? t('selectModel') : t('selectMakeFirst')}
            options={modelOptions}
          />

          <InputField
            label={t('year_from')}
            required
            rtl={rtl}
            type="number"
            value={data.year_from}
            onChange={(value) => onChange({ year_from: value })}
            placeholder="2000"
          />

          <InputField
            label={t('year_to')}
            required
            rtl={rtl}
            type="number"
            value={data.year_to}
            onChange={(value) => onChange({ year_to: value })}
            placeholder="2026"
          />

          <SelectField
            label={t('engine_type')}
            required
            rtl={rtl}
            value={data.engine_type}
            onChange={(value) => onChange({ engine_type: value })}
            placeholder={t('selectOne')}
            options={ENGINE_OPTIONS.map((item) => ({ value: item, label: optionLabel(item) }))}
          />

          <SelectField
            label={t('transmission')}
            required
            rtl={rtl}
            value={data.transmission}
            onChange={(value) => onChange({ transmission: value })}
            placeholder={t('selectOne')}
            options={TRANSMISSION_OPTIONS.map((item) => ({ value: item, label: optionLabel(item) }))}
          />

          <div className="sm:col-span-2">
            <TextAreaField
              label={t('part_compatibility_notes')}
              rtl={rtl}
              value={data.part_compatibility_notes}
              onChange={(value) => onChange({ part_compatibility_notes: value })}
              placeholder={t('compatibilityNotesPlaceholder')}
            />
          </div>
        </div>
      )}

      {isDevicePart && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label={t('device_type')}
            required
            rtl={rtl}
            value={data.device_type}
            onChange={(value) => onChange({ device_type: value })}
            placeholder={t('selectOne')}
            options={DEVICE_TYPE_OPTIONS.map((item) => ({ value: item, label: optionLabel(item) }))}
          />

          <InputField
            label={t('compatible_brand')}
            required
            rtl={rtl}
            value={data.compatible_brand}
            onChange={(value) => onChange({ compatible_brand: value })}
            placeholder={t('compatibleBrandPlaceholder')}
          />

          <InputField
            label={t('compatible_model')}
            required
            rtl={rtl}
            value={data.compatible_model}
            onChange={(value) => onChange({ compatible_model: value })}
            placeholder={t('compatibleModelPlaceholder')}
          />

          <InputField
            label={t('version_series')}
            rtl={rtl}
            value={data.version_series}
            onChange={(value) => onChange({ version_series: value })}
            placeholder={t('versionPlaceholder')}
          />

          <div className="sm:col-span-2">
            <TextAreaField
              label={t('technical_compatibility_notes')}
              rtl={rtl}
              value={data.technical_compatibility_notes}
              onChange={(value) => onChange({ technical_compatibility_notes: value })}
              placeholder={t('technicalNotesPlaceholder')}
            />
          </div>
        </div>
      )}

      {subcategory === 'other-parts' && (
        <p className={`rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 ${rtl ? 'text-right' : 'text-left'}`}>
          {t('otherPartsCompatibilityHint')}
        </p>
      )}
    </div>
  );
};
