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
  VEHICLE_DATA,
} from '@/lib/constants/vehicles';
import {
  ELECTRONICS_SUBCATEGORIES,
  ElectronicsSubcategory,
  ELECTRONICS_BRAND_MODELS,
} from '@/lib/constants/electronics-wizard';
import {
  FashionSubcategory,
  FASHION_BRANDS_BY_SUBCATEGORY,
  FASHION_SUBCATEGORY_LABEL_KEYS,
  FASHION_SUBCATEGORIES,
  getFashionFieldTranslationKey,
  getFashionOptionTranslationKey,
  isFashionClothingSubcategory,
} from '@/lib/constants/fashion-wizard';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';

const ELECTRONICS_SUBCATEGORY_LABEL_KEYS: Record<ElectronicsSubcategory, string> = {
  phones: 'subcategoryPhones',
  tablets: 'subcategoryTablets',
  tv: 'subcategoryTv',
  laptops: 'subcategoryLaptops',
  desktops: 'subcategoryDesktops',
  'home-appliances': 'subcategoryHomeAppliances',
  'music-instruments': 'subcategoryMusicInstruments',
  'other-electronics': 'subcategoryOther',
};

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

// ─── Real Estate Filter State ───────────────────────────────────────────────
export interface RealEstateFilterState {
  purpose: string;
  propertyType: string;
  areaGrossMin: string;
  areaGrossMax: string;
  areaNetMin: string;
  areaNetMax: string;
  rooms: string;
  roomsManual: string;
  balcony: string;
  buildingAge: string;
  buildingAgeManual: string;
}

export const EMPTY_REAL_ESTATE_FILTERS: RealEstateFilterState = {
  purpose: '',
  propertyType: '',
  areaGrossMin: '',
  areaGrossMax: '',
  areaNetMin: '',
  areaNetMax: '',
  rooms: '',
  roomsManual: '',
  balcony: '',
  buildingAge: '',
  buildingAgeManual: '',
};

// ─── Electronics Filter State ──────────────────────────────────────────────
export interface ElectronicsFilterState {
  subcategory: string;
  postedDate: string;
  sellerType: string;
  make: string;
  model: string;
  ram: string[];
  internalStorage: string;
  batteryCapacity: string;
  screenSize: string;
  refreshRate: string;
  cameraRearMp: string;
  cameraFrontMp: string;
  supports5g: string;
  dualSim: string;
  operatingSystem: string;
  color: string;
  condition: string;
  warranty: string;
  accessoriesIncluded: string;
  boxAvailable: string;
  resolution: string;
  smartTv: string;
  panelType: string;
  hdmiPorts: string;
  wallMountIncluded: string;
  processor: string;
  storageType: string;
  storageSize: string;
  gpu: string;
  touchscreen: string;
  batteryLife: string;
  usageType: string;
  keyboardBacklight: string;
  fingerprintSensor: string;
  formFactor: string;
  monitorIncluded: string;
  keyboardMouseIncluded: string;
  applianceType: string;
  energyRating: string;
  refrigeratorCapacityLiters: string;
  refrigeratorType: string;
  defrostType: string;
  refrigeratorInverter: string;
  washingMachineType: string;
  washingMachineCapacityKg: string;
  spinSpeed: string;
  washingMode: string;
  acType: string;
  acCapacity: string;
  acInverter: string;
  coolingArea: string;
  instrumentType: string;
  acousticElectric: string;
  skillLevel: string;
  deviceType: string;
  features: string[];
  keywords: string;
}

export const EMPTY_ELECTRONICS_FILTERS: ElectronicsFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  make: '',
  model: '',
  ram: [],
  internalStorage: '',
  batteryCapacity: '',
  screenSize: '',
  refreshRate: '',
  cameraRearMp: '',
  cameraFrontMp: '',
  supports5g: '',
  dualSim: '',
  operatingSystem: '',
  color: '',
  condition: '',
  warranty: '',
  accessoriesIncluded: '',
  boxAvailable: '',
  resolution: '',
  smartTv: '',
  panelType: '',
  hdmiPorts: '',
  wallMountIncluded: '',
  processor: '',
  storageType: '',
  storageSize: '',
  gpu: '',
  touchscreen: '',
  batteryLife: '',
  usageType: '',
  keyboardBacklight: '',
  fingerprintSensor: '',
  formFactor: '',
  monitorIncluded: '',
  keyboardMouseIncluded: '',
  applianceType: '',
  energyRating: '',
  refrigeratorCapacityLiters: '',
  refrigeratorType: '',
  defrostType: '',
  refrigeratorInverter: '',
  washingMachineType: '',
  washingMachineCapacityKg: '',
  spinSpeed: '',
  washingMode: '',
  acType: '',
  acCapacity: '',
  acInverter: '',
  coolingArea: '',
  instrumentType: '',
  acousticElectric: '',
  skillLevel: '',
  deviceType: '',
  features: [],
  keywords: '',
};

export interface FashionFilterState {
  subcategory: FashionSubcategory | '';
  postedDate: string;
  sellerType: 'Individual' | 'Dealer' | '';
  keywords: string;
  condition: 'New' | 'Used' | '';
  brand: string;
  clothingType: string;
  gender: string;
  size: string[];
  fitType: string;
  color: string[];
  material: string;
  sleeveType: string;
  pattern: string;
  season: string;
  occasion: string;
  authenticity: string;
  warranty: string;
  tagsAvailable: '' | 'yes' | 'no';
  model: string;
  shoeType: string;
  originalBox: '' | 'yes' | 'no';
  usageType: string;
  bagType: string;
  closureType: string;
  strapType: string;
  waterproof: '' | 'yes' | 'no';
  type: string;
  style: string;
  displayType: string;
  strapMaterial: string;
  dialShape: string;
  movement: string;
  waterResistant: '' | 'yes' | 'no';
  stoneType: string;
  certification: '' | 'yes' | 'no';
}

export const EMPTY_FASHION_FILTERS: FashionFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  keywords: '',
  condition: '',
  brand: '',
  clothingType: '',
  gender: '',
  size: [],
  fitType: '',
  color: [],
  material: '',
  sleeveType: '',
  pattern: '',
  season: '',
  occasion: '',
  authenticity: '',
  warranty: '',
  tagsAvailable: '',
  model: '',
  shoeType: '',
  originalBox: '',
  usageType: '',
  bagType: '',
  closureType: '',
  strapType: '',
  waterproof: '',
  type: '',
  style: '',
  displayType: '',
  strapMaterial: '',
  dialShape: '',
  movement: '',
  waterResistant: '',
  stoneType: '',
  certification: '',
};

const RAM_OPTIONS = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB+'];
const STORAGE_OPTIONS = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
const REFRESH_RATE_OPTIONS = ['60Hz', '90Hz', '120Hz+'];
const OS_MOBILE_OPTIONS = ['Android', 'iOS'];
const TV_RESOLUTION_OPTIONS = ['HD', 'Full HD', '4K', '8K'];
const TV_PANEL_OPTIONS = ['LED', 'OLED', 'QLED'];
const TV_OS_OPTIONS = ['Android TV', 'Tizen', 'WebOS'];
const LAPTOP_PROCESSOR_OPTIONS = ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'];
const STORAGE_TYPE_OPTIONS = ['HDD', 'SSD', 'NVMe'];
const GPU_OPTIONS = ['Integrated', 'NVIDIA', 'AMD'];
const LAPTOP_RESOLUTION_OPTIONS = ['HD', 'FHD', '2K', '4K'];
const USAGE_TYPE_OPTIONS = ['Gaming', 'Business', 'Student', 'Design'];
const DESKTOP_FORM_FACTOR_OPTIONS = ['Tower', 'Mini PC', 'All-in-One'];
const APPLIANCE_TYPE_OPTIONS = ['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Other'];
const ENERGY_RATING_OPTIONS = ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'];
const REFRIGERATOR_TYPE_OPTIONS = ['Single Door', 'Double Door', 'Side-by-Side'];
const DEFROST_TYPE_OPTIONS = ['Direct Cool', 'Frost Free'];
const WASHING_MACHINE_TYPE_OPTIONS = ['Front Load', 'Top Load'];
const WASHING_MODE_OPTIONS = ['Automatic', 'Semi'];
const AC_TYPE_OPTIONS = ['Split', 'Window'];
const INSTRUMENT_TYPE_OPTIONS = ['Guitar', 'Piano', 'Drums', 'Violin', 'Keyboard', 'Other'];
const SKILL_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Professional'];
const OTHER_FEATURE_OPTIONS = ['Bluetooth', 'Wi-Fi', 'NFC', 'Fast Charging', 'Water Resistant'];
const FASHION_COLOR_OPTIONS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Brown', 'Beige'];
const FASHION_SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const FASHION_CLOTHING_BRANDS = Array.from(
  new Set([
    ...FASHION_BRANDS_BY_SUBCATEGORY['men-clothing'],
    ...FASHION_BRANDS_BY_SUBCATEGORY['women-clothing'],
    ...FASHION_BRANDS_BY_SUBCATEGORY['kids-clothing'],
  ])
);

const FASHION_BRANDS_BY_FILTER_SUBCATEGORY: Record<FashionSubcategory, string[]> = {
  'men-clothing': FASHION_CLOTHING_BRANDS,
  'women-clothing': FASHION_CLOTHING_BRANDS,
  'kids-clothing': FASHION_CLOTHING_BRANDS,
  shoes: FASHION_BRANDS_BY_SUBCATEGORY.shoes,
  bags: FASHION_BRANDS_BY_SUBCATEGORY.bags,
  accessories: FASHION_BRANDS_BY_SUBCATEGORY.accessories,
  watches: FASHION_BRANDS_BY_SUBCATEGORY.watches,
  jewelry: FASHION_BRANDS_BY_SUBCATEGORY.jewelry,
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
  realEstateFilters: RealEstateFilterState;
  onRealEstateFiltersChange: (filters: RealEstateFilterState) => void;
  electronicsFilters: ElectronicsFilterState;
  onElectronicsFiltersChange: (filters: ElectronicsFilterState) => void;
  fashionFilters: FashionFilterState;
  onFashionFiltersChange: (filters: FashionFilterState) => void;
  onElectronicsClear?: () => void;
  onElectronicsSearch?: () => void;
  onFashionClear?: () => void;
  onFashionSearch?: () => void;
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
}> = ({ id, label = 'Filter', value, onChange, isRtl, children }) => {
  const fallbackId = React.useId();
  const selectId = id || fallbackId;
  const labelId = `${selectId}-label`;

  return (
    <>
      <label id={labelId} htmlFor={selectId} className="sr-only">{label}</label>
      <select
        id={selectId}
        aria-labelledby={labelId}
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
      >
        {children}
      </select>
    </>
  );
};

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

const RE_PURPOSE_OPTIONS = ['forRent', 'forSale', 'forLease'] as const;
const RE_PROPERTY_TYPES = ['apartment', 'residence', 'villa', 'farmHouse', 'land'] as const;
const RE_BUILDING_AGES = ['new', 'age1_5', 'age5_10', 'age10_20', 'age20plus'] as const;

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
  realEstateFilters,
  onRealEstateFiltersChange,
  electronicsFilters,
  onElectronicsFiltersChange,
  fashionFilters,
  onFashionFiltersChange,
  onElectronicsClear,
  onElectronicsSearch,
  onFashionClear,
  onFashionSearch,
}) => {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const tVH = useTranslations('postAd.vehicles');
  const tRE = useTranslations('postAd.realEstate');
  const tEL = useTranslations('postAd.electronics');
  const tFA = useTranslations('postAd.fashion');
  const isRtl = isRTL(locale);
  const { cities } = useCities();

  const isVehicles = selectedCategory === 1;
  const isRealEstate = selectedCategory === 2;
  const isElectronics = selectedCategory === 3;
  const isFashion = selectedCategory === 4;

  const [fashionGeneralOpen, setFashionGeneralOpen] = React.useState(true);
  const [fashionSpecificOpen, setFashionSpecificOpen] = React.useState(true);

  const setVF = (patch: Partial<VehicleFilterState>) =>
    onVehicleFiltersChange({ ...vehicleFilters, ...patch });

  const setREF = (patch: Partial<RealEstateFilterState>) =>
    onRealEstateFiltersChange({ ...realEstateFilters, ...patch });

  const setEF = (patch: Partial<ElectronicsFilterState>) =>
    onElectronicsFiltersChange({ ...electronicsFilters, ...patch });

  const setFF = (patch: Partial<FashionFilterState>) =>
    onFashionFiltersChange({ ...fashionFilters, ...patch });

  const toggleFashionMulti = (field: 'size' | 'color', value: string) => {
    const current = fashionFilters[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setFF({ [field]: next });
  };

  const selectedFashionBrandOptions = fashionFilters.subcategory
    ? FASHION_BRANDS_BY_FILTER_SUBCATEGORY[fashionFilters.subcategory]
    : [];

  const getFashionFieldLabel = (field: string) => {
    const translationKey = getFashionFieldTranslationKey(field);
    return tFA.has(translationKey as Parameters<typeof tFA>[0])
      ? tFA(translationKey as Parameters<typeof tFA>[0])
      : field;
  };

  const getFashionOptionLabel = (option: string) => {
    const translationKey = getFashionOptionTranslationKey(option);
    return tFA.has(translationKey as Parameters<typeof tFA>[0])
      ? tFA(translationKey as Parameters<typeof tFA>[0])
      : option;
  };

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

  const renderFashionSelect = (label: string, key: keyof FashionFilterState, options: string[]) => (
    <Section label={getFashionFieldLabel(label)} isRtl={isRtl}>
      <Sel
        value={String(fashionFilters[key] || '')}
        onChange={(v) => setFF({ [key]: v } as Partial<FashionFilterState>)}
        isRtl={isRtl}
      >
        <option value="">{tCommon('all')}</option>
        {options.map((option) => (
          <option key={option} value={option}>{getFashionOptionLabel(option)}</option>
        ))}
      </Sel>
    </Section>
  );

  const renderFashionYesNo = (label: string, key: keyof FashionFilterState) => (
    <Section label={getFashionFieldLabel(label)} isRtl={isRtl}>
      <Sel
        value={String(fashionFilters[key] || '')}
        onChange={(v) => setFF({ [key]: v } as Partial<FashionFilterState>)}
        isRtl={isRtl}
      >
        <option value="">{tCommon('all')}</option>
        <option value="yes">{tCommon('yes')}</option>
        <option value="no">{tCommon('no')}</option>
      </Sel>
    </Section>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-5">

      {/* Category */}
      <Section label={t('filter')} isRtl={isRtl}>
        <Sel id="category-filter" value={selectedCategory?.toString() ?? ''} onChange={(v) => onCategoryChange(v === '' ? null : Number(v))} isRtl={isRtl}>
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

      {/* Condition (non-vehicle/non-real-estate/non-electronics) */}
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && (
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

      {/* Wheel drive (non-vehicle/non-real-estate/non-electronics) */}
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && (
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
          REAL ESTATE-ONLY FILTERS
         ═══════════════════════════════════════════════════ */}
      {isRealEstate && (
        <>
          <Section label={tRE('purpose')} isRtl={isRtl}>
            <Sel value={realEstateFilters.purpose} onChange={(v) => setREF({ purpose: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
            </Sel>
          </Section>

          <Section label={tRE('propertyType')} isRtl={isRtl}>
            <Sel value={realEstateFilters.propertyType} onChange={(v) => setREF({ propertyType: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_PROPERTY_TYPES.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
            </Sel>
          </Section>

          <Section label={tRE('areaGross')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={realEstateFilters.areaGrossMin}
                onChange={(e) => setREF({ areaGrossMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={realEstateFilters.areaGrossMax}
                onChange={(e) => setREF({ areaGrossMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          <Section label={tRE('areaNet')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={realEstateFilters.areaNetMin}
                onChange={(e) => setREF({ areaNetMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={realEstateFilters.areaNetMax}
                onChange={(e) => setREF({ areaNetMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          <Section label={tRE('rooms')} isRtl={isRtl}>
            <Sel
              value={realEstateFilters.rooms}
              onChange={(v) => setREF({ rooms: v, roomsManual: v === '__manual__' ? realEstateFilters.roomsManual : '' })}
              isRtl={isRtl}
            >
              <option value="">{tCommon('all')}</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
              <option value="__manual__">Manual</option>
            </Sel>
            {realEstateFilters.rooms === '__manual__' && (
              <input
                type="number"
                min="0"
                value={realEstateFilters.roomsManual}
                onChange={(e) => setREF({ roomsManual: e.target.value })}
                placeholder="Enter rooms"
                className={`mt-2 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            )}
          </Section>

          <Section label={tRE('balcony')} isRtl={isRtl}>
            <Sel value={realEstateFilters.balcony} onChange={(v) => setREF({ balcony: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={String(n)}>{n}</option>
              ))}
            </Sel>
          </Section>

          <Section label={tRE('buildingAge')} isRtl={isRtl}>
            <Sel
              value={realEstateFilters.buildingAge}
              onChange={(v) => setREF({ buildingAge: v, buildingAgeManual: v === '__manual__' ? realEstateFilters.buildingAgeManual : '' })}
              isRtl={isRtl}
            >
              <option value="">{tCommon('all')}</option>
              {RE_BUILDING_AGES.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
              <option value="__manual__">Manual</option>
            </Sel>
            {realEstateFilters.buildingAge === '__manual__' && (
              <input
                type="text"
                value={realEstateFilters.buildingAgeManual}
                onChange={(e) => setREF({ buildingAgeManual: e.target.value })}
                placeholder="Enter building age"
                className={`mt-2 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            )}
          </Section>
        </>
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
                let label: string = k;
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
              {cities.map((c) => <option key={c.name_en} value={c.name_en}>{getManagedCityName(c, locale)}</option>)}
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

      {/* ═══════════════════════════════════════════════════
          ELECTRONICS-ONLY FILTERS
         ═══════════════════════════════════════════════════ */}
      {isElectronics && (
        <>
          <Section label={t('subcategory')} isRtl={isRtl}>
            <Sel id="electronics-subcategory-filter" value={electronicsFilters.subcategory} onChange={(v) => setEF({ ...EMPTY_ELECTRONICS_FILTERS, subcategory: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {ELECTRONICS_SUBCATEGORIES.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {tEL(ELECTRONICS_SUBCATEGORY_LABEL_KEYS[sub.value as ElectronicsSubcategory] as Parameters<typeof tEL>[0])}
                </option>
              ))}
            </Sel>
          </Section>

          <Section label={t('keywords')} isRtl={isRtl}>
            <input
              type="text"
              value={electronicsFilters.keywords}
              onChange={(e) => setEF({ keywords: e.target.value })}
              placeholder={t('keywords')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </Section>

          <Section label={t('condition')} isRtl={isRtl}>
            <Sel id="electronics-condition-filter" value={electronicsFilters.condition} onChange={(v) => setEF({ condition: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="new">{tCommon('newCondition')}</option>
              <option value="used">{tCommon('used')}</option>
              <option value="refurbished">{tCommon('refurbished')}</option>
            </Sel>
          </Section>

          <Section label={t('postedDate')} isRtl={isRtl}>
            <Sel value={electronicsFilters.postedDate} onChange={(v) => setEF({ postedDate: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="today">{t('today')}</option>
              <option value="last7">{t('last7Days')}</option>
              <option value="last30">{t('last30Days')}</option>
            </Sel>
          </Section>

          <Section label={t('sellerType')} isRtl={isRtl}>
            <Sel value={electronicsFilters.sellerType} onChange={(v) => setEF({ sellerType: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="individual">{t('individual')}</option>
              <option value="dealer">{t('dealer')}</option>
            </Sel>
          </Section>

          <Section label={t('make')} isRtl={isRtl}>
            <Sel id="electronics-make-filter" value={electronicsFilters.make} onChange={(v) => setEF({ make: v, model: '' })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {Object.keys(ELECTRONICS_BRAND_MODELS[electronicsFilters.subcategory as keyof typeof ELECTRONICS_BRAND_MODELS] || {}).sort().map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Sel>
          </Section>

          <Section label={t('model')} isRtl={isRtl}>
            <Sel id="electronics-model-filter" value={electronicsFilters.model} onChange={(v) => setEF({ model: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {(ELECTRONICS_BRAND_MODELS[electronicsFilters.subcategory as keyof typeof ELECTRONICS_BRAND_MODELS]?.[electronicsFilters.make] || []).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Sel>
          </Section>

          {(electronicsFilters.subcategory === 'phones' || electronicsFilters.subcategory === 'tablets') && (
            <>
              <Section label={t('ram')} isRtl={isRtl}>
                <MultiCheck
                  options={RAM_OPTIONS.map((v) => ({ value: v, label: v }))}
                  selected={electronicsFilters.ram}
                  onToggle={(v) => {
                    const next = electronicsFilters.ram.includes(v)
                      ? electronicsFilters.ram.filter((x) => x !== v)
                      : [...electronicsFilters.ram, v];
                    setEF({ ram: next });
                  }}
                  isRtl={isRtl}
                />
              </Section>
              <Section label="Internal Storage" isRtl={isRtl}>
                <Sel value={electronicsFilters.internalStorage} onChange={(v) => setEF({ internalStorage: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Battery Capacity" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.batteryCapacity} onChange={(e) => setEF({ batteryCapacity: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('screenSize')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Refresh Rate" isRtl={isRtl}>
                <Sel value={electronicsFilters.refreshRate} onChange={(v) => setEF({ refreshRate: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {REFRESH_RATE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Camera (Rear MP)" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.cameraRearMp} onChange={(e) => setEF({ cameraRearMp: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Camera (Front MP)" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.cameraFrontMp} onChange={(e) => setEF({ cameraFrontMp: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="5G Supported" isRtl={isRtl}>
                <Sel value={electronicsFilters.supports5g} onChange={(v) => setEF({ supports5g: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Dual SIM" isRtl={isRtl}>
                <Sel value={electronicsFilters.dualSim} onChange={(v) => setEF({ dualSim: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Operating System" isRtl={isRtl}>
                <Sel value={electronicsFilters.operatingSystem} onChange={(v) => setEF({ operatingSystem: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {OS_MOBILE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('color')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.color} onChange={(e) => setEF({ color: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Accessories Included" isRtl={isRtl}>
                <Sel value={electronicsFilters.accessoriesIncluded} onChange={(v) => setEF({ accessoriesIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Box Available" isRtl={isRtl}>
                <Sel value={electronicsFilters.boxAvailable} onChange={(v) => setEF({ boxAvailable: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'tv' && (
            <>
              <Section label={t('screenSize')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Resolution" isRtl={isRtl}>
                <Sel value={electronicsFilters.resolution} onChange={(v) => setEF({ resolution: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_RESOLUTION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Smart TV" isRtl={isRtl}>
                <Sel value={electronicsFilters.smartTv} onChange={(v) => setEF({ smartTv: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Panel Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.panelType} onChange={(v) => setEF({ panelType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_PANEL_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Refresh Rate" isRtl={isRtl}>
                <Sel value={electronicsFilters.refreshRate} onChange={(v) => setEF({ refreshRate: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {REFRESH_RATE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="HDMI Ports" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.hdmiPorts} onChange={(e) => setEF({ hdmiPorts: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Operating System" isRtl={isRtl}>
                <Sel value={electronicsFilters.operatingSystem} onChange={(v) => setEF({ operatingSystem: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_OS_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Wall Mount Included" isRtl={isRtl}>
                <Sel value={electronicsFilters.wallMountIncluded} onChange={(v) => setEF({ wallMountIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {(electronicsFilters.subcategory === 'laptops' || electronicsFilters.subcategory === 'desktops') && (
            <>
              <Section label="Processor" isRtl={isRtl}>
                <Sel value={electronicsFilters.processor} onChange={(v) => setEF({ processor: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {LAPTOP_PROCESSOR_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('ram')} isRtl={isRtl}>
                <Sel value={electronicsFilters.internalStorage} onChange={(v) => setEF({ internalStorage: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {['4GB', '8GB', '16GB', '32GB', '64GB'].map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Storage Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.storageType} onChange={(v) => setEF({ storageType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Storage Size" isRtl={isRtl}>
                <Sel value={electronicsFilters.storageSize} onChange={(v) => setEF({ storageSize: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="GPU" isRtl={isRtl}>
                <Sel value={electronicsFilters.gpu} onChange={(v) => setEF({ gpu: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {GPU_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>

              {electronicsFilters.subcategory === 'laptops' && (
                <>
                  <Section label={t('screenSize')} isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Resolution" isRtl={isRtl}>
                    <Sel value={electronicsFilters.resolution} onChange={(v) => setEF({ resolution: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {LAPTOP_RESOLUTION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Touchscreen" isRtl={isRtl}>
                    <Sel value={electronicsFilters.touchscreen} onChange={(v) => setEF({ touchscreen: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Battery Life" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.batteryLife} onChange={(e) => setEF({ batteryLife: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Operating System" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.operatingSystem} onChange={(e) => setEF({ operatingSystem: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Usage Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.usageType} onChange={(v) => setEF({ usageType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {USAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Keyboard Backlight" isRtl={isRtl}>
                    <Sel value={electronicsFilters.keyboardBacklight} onChange={(v) => setEF({ keyboardBacklight: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Fingerprint Sensor" isRtl={isRtl}>
                    <Sel value={electronicsFilters.fingerprintSensor} onChange={(v) => setEF({ fingerprintSensor: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                </>
              )}

              {electronicsFilters.subcategory === 'desktops' && (
                <>
                  <Section label="Form Factor" isRtl={isRtl}>
                    <Sel value={electronicsFilters.formFactor} onChange={(v) => setEF({ formFactor: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {DESKTOP_FORM_FACTOR_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Operating System" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.operatingSystem} onChange={(e) => setEF({ operatingSystem: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Monitor Included" isRtl={isRtl}>
                    <Sel value={electronicsFilters.monitorIncluded} onChange={(v) => setEF({ monitorIncluded: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Keyboard/Mouse Included" isRtl={isRtl}>
                    <Sel value={electronicsFilters.keyboardMouseIncluded} onChange={(v) => setEF({ keyboardMouseIncluded: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Usage Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.usageType} onChange={(v) => setEF({ usageType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {USAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                </>
              )}

              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'home-appliances' && (
            <>
              <Section label="Appliance Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.applianceType} onChange={(v) => setEF({ applianceType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {APPLIANCE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Energy Rating" isRtl={isRtl}>
                <Sel value={electronicsFilters.energyRating} onChange={(v) => setEF({ energyRating: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {ENERGY_RATING_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>

              {electronicsFilters.applianceType === 'Refrigerator' && (
                <>
                  <Section label="Capacity (Liters)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.refrigeratorCapacityLiters} onChange={(e) => setEF({ refrigeratorCapacityLiters: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.refrigeratorType} onChange={(v) => setEF({ refrigeratorType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {REFRIGERATOR_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Defrost Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.defrostType} onChange={(v) => setEF({ defrostType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {DEFROST_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Inverter Technology" isRtl={isRtl}>
                    <Sel value={electronicsFilters.refrigeratorInverter} onChange={(v) => setEF({ refrigeratorInverter: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                </>
              )}

              {electronicsFilters.applianceType === 'Washing Machine' && (
                <>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.washingMachineType} onChange={(v) => setEF({ washingMachineType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {WASHING_MACHINE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Capacity (kg)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.washingMachineCapacityKg} onChange={(e) => setEF({ washingMachineCapacityKg: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Spin Speed" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.spinSpeed} onChange={(e) => setEF({ spinSpeed: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Automatic/Semi" isRtl={isRtl}>
                    <Sel value={electronicsFilters.washingMode} onChange={(v) => setEF({ washingMode: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {WASHING_MODE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                </>
              )}

              {(electronicsFilters.applianceType === 'Air Conditioner' || electronicsFilters.applianceType === 'AC') && (
                <>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.acType} onChange={(v) => setEF({ acType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {AC_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Capacity (BTU/Ton)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.acCapacity} onChange={(e) => setEF({ acCapacity: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Inverter" isRtl={isRtl}>
                    <Sel value={electronicsFilters.acInverter} onChange={(v) => setEF({ acInverter: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Cooling Area" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.coolingArea} onChange={(e) => setEF({ coolingArea: e.target.value })} placeholder="Enter value" title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                </>
              )}
            </>
          )}

          {electronicsFilters.subcategory === 'music-instruments' && (
            <>
              <Section label="Instrument Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.instrumentType} onChange={(v) => setEF({ instrumentType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {INSTRUMENT_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Acoustic / Electric" isRtl={isRtl}>
                <Sel value={electronicsFilters.acousticElectric} onChange={(v) => setEF({ acousticElectric: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="acoustic">Acoustic</option>
                  <option value="electric">Electric</option>
                </Sel>
              </Section>
              <Section label="Accessories Included" isRtl={isRtl}>
                <Sel value={electronicsFilters.accessoriesIncluded} onChange={(v) => setEF({ accessoriesIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Skill Level" isRtl={isRtl}>
                <Sel value={electronicsFilters.skillLevel} onChange={(v) => setEF({ skillLevel: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {SKILL_LEVEL_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'other-electronics' && (
            <>
              <Section label="Device Type" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.deviceType} onChange={(e) => setEF({ deviceType: e.target.value })} placeholder="Enter value" title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Features" isRtl={isRtl}>
                <MultiCheck
                  options={OTHER_FEATURE_OPTIONS.map((v) => ({ value: v, label: v }))}
                  selected={electronicsFilters.features}
                  onToggle={(v) => {
                    const next = electronicsFilters.features.includes(v)
                      ? electronicsFilters.features.filter((x) => x !== v)
                      : [...electronicsFilters.features, v];
                    setEF({ features: next });
                  }}
                  isRtl={isRtl}
                />
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setEF(EMPTY_ELECTRONICS_FILTERS);
                onElectronicsClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => onElectronicsSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </>
      )}

      {isFashion && (
        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setFashionGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {fashionGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={fashionFilters.subcategory}
                    onChange={(v) => setFF({ ...EMPTY_FASHION_FILTERS, subcategory: v as FashionSubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {FASHION_SUBCATEGORIES.map((sub) => (
                      <option key={sub.value} value={sub.value}>{tFA(FASHION_SUBCATEGORY_LABEL_KEYS[sub.value] as Parameters<typeof tFA>[0])}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={fashionFilters.keywords}
                    onChange={(e) => setFF({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel value={fashionFilters.condition} onChange={(v) => setFF({ condition: v as 'New' | 'Used' | '' })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="New">{tFA('optionLabels.new')}</option>
                    <option value="Used">{tFA('optionLabels.used')}</option>
                  </Sel>
                </Section>

                <Section label={tFA('brand')} isRtl={isRtl}>
                  <Sel value={fashionFilters.brand} onChange={(v) => setFF({ brand: v })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {selectedFashionBrandOptions.map((brand) => (
                      <option key={brand} value={brand}>{getFashionOptionLabel(brand)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel value={fashionFilters.sellerType} onChange={(v) => setFF({ sellerType: v as 'Individual' | 'Dealer' | '' })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{tFA('sellerTypeIndividual')}</option>
                    <option value="Dealer">{tFA('sellerTypeDealer')}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel value={fashionFilters.postedDate} onChange={(v) => setFF({ postedDate: v })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setFashionSpecificOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('subcategoryFilters')}
            </button>
            {fashionSpecificOpen && (
              <div className="space-y-4 px-3 pb-3">
                {fashionFilters.subcategory && isFashionClothingSubcategory(fashionFilters.subcategory) && (
                  <>
                    {renderFashionSelect('clothingType', 'clothingType', ['T-shirt', 'Shirt', 'Jeans', 'Dress', 'Jacket', 'Hoodie'])}
                    {renderFashionSelect('gender', 'gender', ['Men', 'Women', 'Kids', 'Unisex'])}
                    <Section label={getFashionFieldLabel('size')} isRtl={isRtl}>
                      <MultiCheck
                        options={FASHION_SIZE_OPTIONS.map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.size}
                        onToggle={(v) => toggleFashionMulti('size', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('fitType', 'fitType', ['Slim', 'Regular', 'Oversized'])}
                    <Section label={getFashionFieldLabel('color')} isRtl={isRtl}>
                      <MultiCheck
                        options={FASHION_COLOR_OPTIONS.map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.color}
                        onToggle={(v) => toggleFashionMulti('color', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('material', 'material', ['Cotton', 'Polyester', 'Wool', 'Denim', 'Leather', 'Silk', 'Linen'])}
                    {renderFashionSelect('sleeveType', 'sleeveType', ['Short', 'Long', 'Sleeveless'])}
                    {renderFashionSelect('pattern', 'pattern', ['Solid', 'Printed', 'Striped', 'Checked'])}
                    {renderFashionSelect('season', 'season', ['Summer', 'Winter', 'All Season'])}
                    {renderFashionSelect('occasion', 'occasion', ['Casual', 'Formal', 'Party', 'Sportswear'])}
                    {renderFashionSelect('authenticity', 'authenticity', ['Original', 'Replica'])}
                    {renderFashionYesNo('tagsAvailable', 'tagsAvailable')}
                    {renderFashionYesNo('warranty', 'warranty')}
                  </>
                )}

                {fashionFilters.subcategory === 'shoes' && (
                  <>
                    {renderFashionSelect('model', 'model', ['Air Max', 'Classic', 'Runner', 'Street'])}
                    {renderFashionSelect('shoeType', 'shoeType', ['Sneakers', 'Formal', 'Boots', 'Sandals', 'Heels', 'Sports'])}
                    {renderFashionSelect('gender', 'gender', ['Men', 'Women', 'Unisex'])}
                    <Section label={getFashionFieldLabel('size')} isRtl={isRtl}>
                      <MultiCheck
                        options={['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((v) => ({ value: v, label: v }))}
                        selected={fashionFilters.size}
                        onToggle={(v) => toggleFashionMulti('size', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    <Section label={getFashionFieldLabel('color')} isRtl={isRtl}>
                      <MultiCheck
                        options={FASHION_COLOR_OPTIONS.map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.color}
                        onToggle={(v) => toggleFashionMulti('color', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('material', 'material', ['Leather', 'Synthetic', 'Mesh', 'Canvas'])}
                    {renderFashionYesNo('originalBox', 'originalBox')}
                    {renderFashionYesNo('warranty', 'warranty')}
                    {renderFashionSelect('usageType', 'usageType', ['Running', 'Casual', 'Formal', 'Hiking'])}
                  </>
                )}

                {fashionFilters.subcategory === 'bags' && (
                  <>
                    {renderFashionSelect('bagType', 'bagType', ['Handbag', 'Backpack', 'Travel Bag', 'Laptop Bag', 'Wallet'])}
                    {renderFashionSelect('material', 'material', ['Leather', 'Synthetic', 'Canvas', 'Nylon'])}
                    <Section label={getFashionFieldLabel('color')} isRtl={isRtl}>
                      <MultiCheck
                        options={FASHION_COLOR_OPTIONS.map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.color}
                        onToggle={(v) => toggleFashionMulti('color', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    <Section label={getFashionFieldLabel('size')} isRtl={isRtl}>
                      <MultiCheck
                        options={['Small', 'Medium', 'Large'].map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.size}
                        onToggle={(v) => toggleFashionMulti('size', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('closureType', 'closureType', ['Zipper', 'Magnetic', 'Buckle'])}
                    {renderFashionSelect('strapType', 'strapType', ['Single', 'Double', 'Adjustable'])}
                    {renderFashionYesNo('waterproof', 'waterproof')}
                    {renderFashionSelect('authenticity', 'authenticity', ['Original', 'Replica'])}
                    {renderFashionYesNo('warranty', 'warranty')}
                  </>
                )}

                {fashionFilters.subcategory === 'watches' && (
                  <>
                    {renderFashionSelect('model', 'model', ['Classic', 'Sport', 'Smart Pro', 'Vintage'])}
                    {renderFashionSelect('gender', 'gender', ['Men', 'Women', 'Unisex'])}
                    {renderFashionSelect('displayType', 'displayType', ['Analog', 'Digital', 'Smart'])}
                    {renderFashionSelect('strapMaterial', 'strapMaterial', ['Leather', 'Metal', 'Rubber', 'Fabric'])}
                    {renderFashionSelect('dialShape', 'dialShape', ['Round', 'Square', 'Rectangle'])}
                    {renderFashionSelect('movement', 'movement', ['Quartz', 'Automatic'])}
                    {renderFashionYesNo('waterResistant', 'waterResistant')}
                    {renderFashionYesNo('originalBox', 'originalBox')}
                    {renderFashionYesNo('warranty', 'warranty')}
                  </>
                )}

                {fashionFilters.subcategory === 'jewelry' && (
                  <>
                    {renderFashionSelect('type', 'type', ['Ring', 'Necklace', 'Bracelet', 'Earrings'])}
                    {renderFashionSelect('material', 'material', ['Gold', 'Silver', 'Diamond', 'Platinum', 'Artificial'])}
                    {renderFashionSelect('gender', 'gender', ['Men', 'Women', 'Unisex'])}
                    <Section label={getFashionFieldLabel('size')} isRtl={isRtl}>
                      <MultiCheck
                        options={['XS', 'S', 'M', 'L', 'XL'].map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.size}
                        onToggle={(v) => toggleFashionMulti('size', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('stoneType', 'stoneType', ['None', 'Diamond', 'Ruby', 'Emerald', 'Sapphire'])}
                    {renderFashionYesNo('certification', 'certification')}
                    {renderFashionSelect('authenticity', 'authenticity', ['Original', 'Replica'])}
                    {renderFashionYesNo('warranty', 'warranty')}
                  </>
                )}

                {fashionFilters.subcategory === 'accessories' && (
                  <>
                    {renderFashionSelect('type', 'type', ['Belt', 'Hat', 'Sunglasses', 'Scarf'])}
                    {renderFashionSelect('material', 'material', ['Leather', 'Cotton', 'Metal', 'Plastic'])}
                    <Section label={getFashionFieldLabel('color')} isRtl={isRtl}>
                      <MultiCheck
                        options={FASHION_COLOR_OPTIONS.map((v) => ({ value: v, label: getFashionOptionLabel(v) }))}
                        selected={fashionFilters.color}
                        onToggle={(v) => toggleFashionMulti('color', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    {renderFashionSelect('gender', 'gender', ['Men', 'Women', 'Unisex'])}
                    {renderFashionSelect('style', 'style', ['Casual', 'Formal'])}
                    {renderFashionYesNo('warranty', 'warranty')}
                  </>
                )}
              </div>
            )}
          </div>

          <Section label={t('priceSlider')} isRtl={isRtl}>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="200000"
                step="100"
                value={priceMin ? Number(priceMin) : 0}
                onChange={(e) => onPriceMinChange(e.target.value)}
                aria-label={t('minPrice')}
                title={t('minPrice')}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="200000"
                step="100"
                value={priceMax ? Number(priceMax) : 200000}
                onChange={(e) => onPriceMaxChange(e.target.value)}
                aria-label={t('maxPrice')}
                title={t('maxPrice')}
                className="w-full"
              />
            </div>
          </Section>

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setFF(EMPTY_FASHION_FILTERS);
                onFashionClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onFashionSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
