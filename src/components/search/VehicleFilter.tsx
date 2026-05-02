// src/components/search/VehicleFilter.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  VEHICLE_TYPES,
  ENGINE_TYPES,
  GEAR_TYPES,
  VEHICLE_COLORS,
  WHEEL_DRIVE_TYPES,
  HAND_DRIVES,
  MAKES_BY_TYPE,
  VehicleMake,
} from '@/lib/constants/vehicles';
import { POPULAR_CITIES } from '@/lib/constants/cities';

export interface VehicleFilterState {
  vehicleType: string;
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  fuelTypes: string[];
  gearTypes: string[];
  bodyTypes: string[];
  kmMin: string;
  kmMax: string;
  enginePowerRange: string;
  engineCapacityRange: string;
  wheelDrive: string;
  handDrive: string;
  color: string;
  numberPlateCity: string;
  fromOwner: string;
  vin: string;
  has360Spin: string;
  dealerName: string;
  dealerLicense: string;
  keywords: string;
}

export const EMPTY_VEHICLE_FILTERS: VehicleFilterState = {
  vehicleType: '',
  make: '',
  model: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: '',
  fuelTypes: [],
  gearTypes: [],
  bodyTypes: [],
  kmMin: '',
  kmMax: '',
  enginePowerRange: '',
  engineCapacityRange: '',
  wheelDrive: '',
  handDrive: '',
  color: '',
  numberPlateCity: '',
  fromOwner: '',
  vin: '',
  has360Spin: '',
  dealerName: '',
  dealerLicense: '',
  keywords: '',
};

interface VehicleFilterProps {
  locale: Locale;
  vehicleFilters: VehicleFilterState;
  onVehicleFiltersChange: (filters: VehicleFilterState) => void;
}

const Section: React.FC<{ label: string; isRtl: boolean; children: React.ReactNode }> = ({ label, isRtl, children }) => (
  <div className="space-y-2">
    <h3 className={`text-sm font-semibold text-slate-800 ${isRtl ? 'text-right' : 'text-left'}`}>{label}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Sel: React.FC<{
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  children: React.ReactNode;
}> = ({ id, label, value, onChange, isRtl, children }) => {
  const tSearch = useTranslations('search');
  const defaultLabel = tSearch('filter');
  
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <option value="">{label || defaultLabel}</option>
      {children}
    </select>
  );
};

const MultiCheck: React.FC<{
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(({ value, label }) => {
      const isSelected = selected.includes(value);
      return (
        <button
          key={value}
          type="button"
          onClick={() => onToggle(value)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            isSelected
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const VehicleFilter: React.FC<VehicleFilterProps> = ({
  locale,
  vehicleFilters,
  onVehicleFiltersChange,
}) => {
  const tSearch = useTranslations('search');
  const tCommon = useTranslations('common');
  const tVH = (key: string) => tCommon(`vehicles.${key}` as Parameters<typeof tCommon>[0]);
  const isRtl = isRTL(locale);

  const setVF = (updates: Partial<VehicleFilterState>) => {
    onVehicleFiltersChange({ ...vehicleFilters, ...updates });
  };

  const toggleMulti = (field: 'fuelTypes' | 'gearTypes' | 'bodyTypes', value: string) => {
    const current = vehicleFilters[field];
    const newArray = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setVF({ [field]: newArray });
  };

  // Get makes based on selected vehicle type
  // Get makes for selected vehicle type, or all makes deduplicated
  const allMakes: VehicleMake[] = React.useMemo(() => {
    if (vehicleFilters.vehicleType) {
      return MAKES_BY_TYPE[vehicleFilters.vehicleType as keyof typeof MAKES_BY_TYPE] || [];
    }
    // Flatten all makes and deduplicate by key
    const flattened = Object.values(MAKES_BY_TYPE).flat();
    const seen = new Set<string>();
    const unique: VehicleMake[] = [];
    for (const make of flattened) {
      if (!seen.has(make.key)) {
        seen.add(make.key);
        unique.push(make);
      }
    }
    return unique;
  }, [vehicleFilters.vehicleType]);

  const selectedMakeEntry = allMakes.find((m) => m.key === vehicleFilters.make);
  const modelsForMake = selectedMakeEntry?.models || [];

  // Generate year options (last 30 years) - client-side only to avoid hydration mismatch
  const [yearOptions, setYearOptions] = React.useState<number[]>([]);

  React.useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYearOptions(Array.from({ length: 30 }, (_, i) => currentYear - i));
  }, []);

  return (
    <div className="space-y-6">
      {/* Vehicle Type */}
      <Section label={tVH('vehicleType')} isRtl={isRtl}>
        <Sel
          id="vehicle-type-filter"
          label={tSearch('any')}
          value={vehicleFilters.vehicleType}
          onChange={(v) => setVF({ vehicleType: v, make: '', model: '' })}
          isRtl={isRtl}
        >
          {VEHICLE_TYPES.map((type) => (
            <option key={type.key} value={type.key}>
              {type[`name_${locale}` as keyof typeof type] || type.name_en}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Make */}
      <Section label={tVH('make')} isRtl={isRtl}>
        <Sel
          id="vehicle-make-filter"
          label={tSearch('any')}
          value={vehicleFilters.make}
          onChange={(v) => setVF({ make: v, model: '' })}
          isRtl={isRtl}
        >
          {allMakes.map((make) => (
            <option key={make.key} value={make.key}>
              {locale === 'en' ? make.name_en : locale === 'fa' ? make.name_fa : make.name_ps}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Model */}
      <Section label={tVH('model')} isRtl={isRtl}>
        <Sel
          id="vehicle-model-filter"
          label={vehicleFilters.make ? tSearch('any') : tVH('selectMakeFirst')}
          value={vehicleFilters.model}
          onChange={(v) => setVF({ model: v })}
          isRtl={isRtl}
        >
          {modelsForMake.map((model) => (
            <option key={model.key} value={model.key}>
              {model.name}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Year Range */}
      <Section label={tSearch('yearRange')} isRtl={isRtl}>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Sel
            id="year-min-filter"
            label={tSearch('min')}
            value={vehicleFilters.yearMin}
            onChange={(v) => setVF({ yearMin: v })}
            isRtl={isRtl}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Sel>
          <Sel
            id="year-max-filter"
            label={tSearch('max')}
            value={vehicleFilters.yearMax}
            onChange={(v) => setVF({ yearMax: v })}
            isRtl={isRtl}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Sel>
        </div>
      </Section>

      {/* Price Range */}
      <Section label={tSearch('priceRange')} isRtl={isRtl}>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <input
              type="number"
              placeholder={tSearch('min')}
              value={vehicleFilters.priceMin}
              onChange={(e) => setVF({ priceMin: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder={tSearch('max')}
              value={vehicleFilters.priceMax}
              onChange={(e) => setVF({ priceMax: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </Section>

      {/* Fuel Type */}
      <Section label={tVH('engineType')} isRtl={isRtl}>
        <MultiCheck
          options={ENGINE_TYPES.map((type) => ({
            value: type,
            label: tVH(type),
          }))}
          selected={vehicleFilters.fuelTypes}
          onToggle={(v) => toggleMulti('fuelTypes', v)}
        />
      </Section>

      {/* Gear Type */}
      <Section label={tVH('gearType')} isRtl={isRtl}>
        <MultiCheck
          options={GEAR_TYPES.map((type) => ({
            value: type,
            label: tVH(type),
          }))}
          selected={vehicleFilters.gearTypes}
          onToggle={(v) => toggleMulti('gearTypes', v)}
        />
      </Section>

      {/* Km Driven */}
      <Section label={tSearch('kmRange')} isRtl={isRtl}>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <input
              type="number"
              placeholder={tSearch('minKm')}
              value={vehicleFilters.kmMin}
              onChange={(e) => setVF({ kmMin: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder={tSearch('maxKm')}
              value={vehicleFilters.kmMax}
              onChange={(e) => setVF({ kmMax: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </Section>

      {/* Wheel Drive */}
      <Section label={tVH('wheelDriveType')} isRtl={isRtl}>
        <Sel
          id="wheel-drive-filter"
          label={tSearch('anyWheelDrive')}
          value={vehicleFilters.wheelDrive}
          onChange={(v) => setVF({ wheelDrive: v })}
          isRtl={isRtl}
        >
          {WHEEL_DRIVE_TYPES.map((type) => (
            <option key={type} value={type}>
              {tVH(`wd_${type}`)}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Hand Drive */}
      <Section label={tVH('handDrive')} isRtl={isRtl}>
        <Sel
          id="hand-drive-filter"
          label={tSearch('any')}
          value={vehicleFilters.handDrive}
          onChange={(v) => setVF({ handDrive: v })}
          isRtl={isRtl}
        >
          {HAND_DRIVES.map((type) => (
            <option key={type} value={type}>
              {tVH(type)}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Color */}
      <Section label={tVH('color')} isRtl={isRtl}>
        <Sel
          id="color-filter"
          label={tSearch('anyColor')}
          value={vehicleFilters.color}
          onChange={(v) => setVF({ color: v })}
          isRtl={isRtl}
        >
          {VEHICLE_COLORS.map((color) => (
            <option key={color} value={color}>
              {tVH(`color_${color}`)}
            </option>
          ))}
        </Sel>
      </Section>

      {/* Number Plate City */}
      <Section label={tVH('numberPlateCity')} isRtl={isRtl}>
        <Sel
          id="number-plate-city-filter"
          label={tSearch('anyPlateCity')}
          value={vehicleFilters.numberPlateCity}
          onChange={(v) => setVF({ numberPlateCity: v })}
          isRtl={isRtl}
        >
          {POPULAR_CITIES.map((city) => (
            <option key={city.name_en} value={city.name_en}>
              {locale === 'en' ? city.name_en : locale === 'fa' ? city.name_fa : city.name_ps}
            </option>
          ))}
        </Sel>
      </Section>

      {/* 360° Spin Available */}
      <Section label={tVH('has360Spin')} isRtl={isRtl}>
        <Sel
          id="has360spin-filter"
          label={tSearch('any')}
          value={vehicleFilters.has360Spin}
          onChange={(v) => setVF({ has360Spin: v })}
          isRtl={isRtl}
        >
          <option value="">{tSearch('any')}</option>
          <option value="yes">{tCommon('yes')}</option>
          <option value="no">{tCommon('no')}</option>
        </Sel>
      </Section>

      {/* Keywords */}
      <Section label={tSearch('keywords')} isRtl={isRtl}>
        <input
          type="text"
          placeholder={tVH('adDetails')}
          value={vehicleFilters.keywords}
          onChange={(e) => setVF({ keywords: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </Section>
    </div>
  );
};