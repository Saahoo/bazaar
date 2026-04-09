// src/components/search/FilterSidebar.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import {
  WHEEL_DRIVE_TYPES,
  ENGINE_TYPES,
  GEAR_TYPES,
  BODY_TYPES,
  VEHICLE_COLORS,
  AFGHANISTAN_CITIES,
  VEHICLE_DATA,
} from '@/lib/constants/vehicles';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

// ─── Vehicle Filter State ────────────────────────────────────────────────────
export interface VehicleFilterState {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  fuelTypes: string[];
  gearTypes: string[];
  bodyTypes: string[];
  kmMin: string;
  kmMax: string;
  enginePowerRange: string;
  engineCapacityRange: string;
  wheelDrive: string;
  color: string;
  numberPlateCity: string;
  fromOwner: string; // '' | 'true' | 'false'
  keywords: string;
}

export const EMPTY_VEHICLE_FILTERS: VehicleFilterState = {
  make: '',
  model: '',
  yearMin: '',
  yearMax: '',
  fuelTypes: [],
  gearTypes: [],
  bodyTypes: [],
  kmMin: '',
  kmMax: '',
  enginePowerRange: '',
  engineCapacityRange: '',
  wheelDrive: '',
  color: '',
  numberPlateCity: '',
  fromOwner: '',
  keywords: '',
};

// ─── Engine power / capacity bucket definitions ──────────────────────────────
const ENGINE_POWER_BUCKETS = [
  { key: 'up_50',    label: '≤ 50 hp' },
  { key: '51_75',    label: '51 – 75 hp' },
  { key: '76_100',   label: '76 – 100 hp' },
  { key: '101_150',  label: '101 – 150 hp' },
  { key: '151_200',  label: '151 – 200 hp' },
  { key: '201_300',  label: '201 – 300 hp' },
  { key: '300_plus', label: '300+ hp' },
];

const ENGINE_CAP_BUCKETS = [
  { key: 'up_1.3',   label: '≤ 1300 cc' },
  { key: '1.3_1.6',  label: '1301 – 1600 cc' },
  { key: '1.6_2.0',  label: '1601 – 2000 cc' },
  { key: '2.0_2.5',  label: '2001 – 2500 cc' },
  { key: '2.5_3.0',  label: '2501 – 3000 cc' },
  { key: '3.0_plus', label: '3000+ cc' },
];

// ─── Props ───────────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  locale: Locale;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  priceMin: string;
  onPriceMinChange: (value: string) => void;
  priceMax: string;
  onPriceMaxChange: (value: string) => void;
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedWheelDriveType: string;
  onWheelDriveTypeChange: (value: string) => void;
  vehicleFilters: VehicleFilterState;
  onVehicleFiltersChange: (filters: VehicleFilterState) => void;
}

const CONDITIONS = [
  { value: 'new',      translationKey: 'newCondition' },
  { value: 'like_new', translationKey: 'likeNew' },
  { value: 'good',     translationKey: 'good' },
  { value: 'fair',     translationKey: 'fair' },
] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────
const Section: React.FC<{ label: string; isRtl: boolean; children: React.ReactNode }> = ({ label, isRtl, children }) => (
  <div>
    <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </p>
    {children}
  </div>
);

const Sel: React.FC<{
  id?: string; label?: string; value: string; onChange: (v: string) => void; isRtl: boolean; children: React.ReactNode;
}> = ({ id, label, value, onChange, isRtl, children }) => (
  <select
    id={id}
    aria-label={label || id || 'filter'}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
  >
    {children}
  </select>
);

const MultiCheck: React.FC<{
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  isRtl: boolean;
}> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map(({ value, label }) => {
      const active = selected.includes(value);
      return (
        <button
          key={value}
          type="button"
          onClick={() => onToggle(value)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            active
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'bg-white border-slate-300 text-slate-600 hover:border-primary-400'
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  locale,
  selectedCategory,
  onCategoryChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  selectedConditions,
  onConditionsChange,
  selectedCity,
  onCityChange,
  selectedWheelDriveType,
  onWheelDriveTypeChange,
  vehicleFilters,
  onVehicleFiltersChange,
}) => {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const tVH = useTranslations('postAd.vehicles');
  const isRtl = isRTL(locale);
  const { cities } = useCities();

  const isVehicles = selectedCategory === 1;

  const setVF = (patch: Partial<VehicleFilterState>) =>
    onVehicleFiltersChange({ ...vehicleFilters, ...patch });

  const toggleMulti = (field: 'fuelTypes' | 'gearTypes' | 'bodyTypes', value: string) => {
    const current = vehicleFilters[field] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setVF({ [field]: next });
  };

  const handleConditionToggle = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  const allMakes = Object.keys(VEHICLE_DATA).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });

  const selectedMakeName = allMakes.find(
    (name) => VEHICLE_DATA[name]?.makeKey === vehicleFilters.make
  );
  const selectedMakeEntry = selectedMakeName ? VEHICLE_DATA[selectedMakeName] : undefined;
  const modelsForMake = selectedMakeEntry
    ? selectedMakeEntry.models.map((modelName) => ({
      key: selectedMakeEntry.modelKeyMap[modelName] || modelName,
      label: modelName,
    }))
    : [];

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 1; y >= 1980; y--) years.push(y);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-5">

      {/* Category */}
      <Section label={t('filter')} isRtl={isRtl}>
        <Sel id="category-filter" value={selectedCategory ?? ''} onChange={(v) => onCategoryChange(v === '' ? null : Number(v))} isRtl={isRtl}>
          <option value="">{tCommon('all')}</option>
          {MAIN_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{getCategoryName(cat.id, locale)}</option>
          ))}
        </Sel>
      </Section>

      {/* City */}
      <Section label={t('location')} isRtl={isRtl}>
        <Sel id="city-filter" value={selectedCity} onChange={onCityChange} isRtl={isRtl}>
          <option value="">{tCommon('all')}</option>
          {cities.map((city) => (
            <option key={city.name_en} value={city.name_en}>{getManagedCityName(city, locale)}</option>
          ))}
        </Sel>
      </Section>

      {/* Price Range */}
      <Section label={t('priceRange')} isRtl={isRtl}>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <input type="number" placeholder={t('minPrice')} value={priceMin} onChange={(e) => onPriceMinChange(e.target.value)} min="0"
            className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
          <input type="number" placeholder={t('maxPrice')} value={priceMax} onChange={(e) => onPriceMaxChange(e.target.value)} min="0"
            className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
        </div>
      </Section>

      {/* Condition (non-vehicle) */}
      {!isVehicles && (
        <Section label={t('condition')} isRtl={isRtl}>
          <div className="space-y-2">
            {CONDITIONS.map(({ value, translationKey }) => (
              <label key={value} className={`flex items-center gap-2 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`}>
                <input type="checkbox" checked={selectedConditions.includes(value)} onChange={() => handleConditionToggle(value)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700">{tCommon(translationKey)}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Wheel drive (non-vehicle) */}
      {!isVehicles && (
        <Section label={t('wheelDrive')} isRtl={isRtl}>
          <Sel id="wheel-drive-filter" value={selectedWheelDriveType} onChange={onWheelDriveTypeChange} isRtl={isRtl}>
            <option value="">{t('anyWheelDrive')}</option>
            {WHEEL_DRIVE_TYPES.map((wd) => (
              <option key={wd} value={wd}>{tVH((`wd_${wd}`) as Parameters<typeof tVH>[0])}</option>
            ))}
          </Sel>
        </Section>
      )}

      {/* ═══════════════════════════════════════════════════
          VEHICLE-ONLY FILTERS
         ═══════════════════════════════════════════════════ */}
      {isVehicles && (
        <>
          {/* Make */}
          <Section label={tVH('make')} isRtl={isRtl}>
            <Sel value={vehicleFilters.make} onChange={(v) => setVF({ make: v, model: '' })} isRtl={isRtl}>
              <option value="">{tVH('selectMake')}</option>
              {allMakes.map((name) => (
                <option key={name} value={VEHICLE_DATA[name].makeKey}>{name}</option>
              ))}
            </Sel>
          </Section>

          {/* Model */}
          <Section label={tVH('model')} isRtl={isRtl}>
            {modelsForMake.length > 0 ? (
              <Sel value={vehicleFilters.model} onChange={(v) => setVF({ model: v })} isRtl={isRtl}>
                <option value="">{tVH('selectModel')}</option>
                {modelsForMake.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
              </Sel>
            ) : (
              <input type="text" value={vehicleFilters.model} onChange={(e) => setVF({ model: e.target.value })}
                placeholder={vehicleFilters.make ? tVH('selectModel') : tVH('selectMakeFirst')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
            )}
          </Section>

          {/* Year Range */}
          <Section label={t('yearRange')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Sel value={vehicleFilters.yearMin} onChange={(v) => setVF({ yearMin: v })} isRtl={isRtl}>
                <option value="">Min</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </Sel>
              <Sel value={vehicleFilters.yearMax} onChange={(v) => setVF({ yearMax: v })} isRtl={isRtl}>
                <option value="">Max</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </Sel>
            </div>
          </Section>

          {/* Fuel Type */}
          <Section label={tVH('engineType')} isRtl={isRtl}>
            <MultiCheck
              options={ENGINE_TYPES.map((k) => ({ value: k, label: tVH(k as Parameters<typeof tVH>[0]) }))}
              selected={vehicleFilters.fuelTypes}
              onToggle={(v) => toggleMulti('fuelTypes', v)}
              isRtl={isRtl}
            />
          </Section>

          {/* Gear Type */}
          <Section label={tVH('gearType')} isRtl={isRtl}>
            <MultiCheck
              options={GEAR_TYPES.map((k) => ({ value: k, label: tVH(k as Parameters<typeof tVH>[0]) }))}
              selected={vehicleFilters.gearTypes}
              onToggle={(v) => toggleMulti('gearTypes', v)}
              isRtl={isRtl}
            />
          </Section>

          {/* Body Type */}
          <Section label={tVH('bodyType')} isRtl={isRtl}>
            <MultiCheck
              options={BODY_TYPES.map((k) => {
                let label = k;
                try { label = tVH(k as Parameters<typeof tVH>[0]); } catch { /* use key */ }
                return { value: k, label };
              })}
              selected={vehicleFilters.bodyTypes}
              onToggle={(v) => toggleMulti('bodyTypes', v)}
              isRtl={isRtl}
            />
          </Section>

          {/* Km Driven */}
          <Section label={t('kmRange')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input type="number" placeholder="Min km" value={vehicleFilters.kmMin} onChange={(e) => setVF({ kmMin: e.target.value })} min="0"
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              <input type="number" placeholder="Max km" value={vehicleFilters.kmMax} onChange={(e) => setVF({ kmMax: e.target.value })} min="0"
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
            </div>
          </Section>

          {/* Engine Power */}
          <Section label={t('enginePowerRange')} isRtl={isRtl}>
            <Sel value={vehicleFilters.enginePowerRange} onChange={(v) => setVF({ enginePowerRange: v })} isRtl={isRtl}>
              <option value="">Any</option>
              {ENGINE_POWER_BUCKETS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </Sel>
          </Section>

          {/* Engine Capacity */}
          <Section label={t('engineCapacityRange')} isRtl={isRtl}>
            <Sel value={vehicleFilters.engineCapacityRange} onChange={(v) => setVF({ engineCapacityRange: v })} isRtl={isRtl}>
              <option value="">Any</option>
              {ENGINE_CAP_BUCKETS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </Sel>
          </Section>

          {/* Wheel Drive */}
          <Section label={tVH('wheelDriveType')} isRtl={isRtl}>
            <MultiCheck
              options={WHEEL_DRIVE_TYPES.map((k) => ({ value: k, label: tVH((`wd_${k}`) as Parameters<typeof tVH>[0]) }))}
              selected={vehicleFilters.wheelDrive ? [vehicleFilters.wheelDrive] : []}
              onToggle={(v) => setVF({ wheelDrive: vehicleFilters.wheelDrive === v ? '' : v })}
              isRtl={isRtl}
            />
          </Section>

          {/* Color */}
          <Section label={tVH('color')} isRtl={isRtl}>
            <Sel value={vehicleFilters.color} onChange={(v) => setVF({ color: v })} isRtl={isRtl}>
              <option value="">{t('anyColor')}</option>
              {VEHICLE_COLORS.map((c) => (
                <option key={c} value={c}>{tVH((`color_${c}`) as Parameters<typeof tVH>[0])}</option>
              ))}
            </Sel>
          </Section>

          {/* Number Plate City */}
          <Section label={tVH('numberPlateCity')} isRtl={isRtl}>
            <Sel value={vehicleFilters.numberPlateCity} onChange={(v) => setVF({ numberPlateCity: v })} isRtl={isRtl}>
              <option value="">{t('anyPlateCity')}</option>
              {AFGHANISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Sel>
          </Section>

          {/* Seller Type */}
          <Section label={t('sellerType')} isRtl={isRtl}>
            <div className={`flex gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              {[
                { value: '', label: tCommon('all') },
                { value: 'true', label: t('ownerOnly') },
                { value: 'false', label: t('dealerOnly') },
              ].map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setVF({ fromOwner: value })}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition ${
                    vehicleFilters.fromOwner === value
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-primary-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Section>

          {/* Keywords */}
          <Section label={t('keywords')} isRtl={isRtl}>
            <input type="text" value={vehicleFilters.keywords} onChange={(e) => setVF({ keywords: e.target.value })}
              placeholder={t('keywords')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
          </Section>
        </>
      )}
    </div>
  );
};
