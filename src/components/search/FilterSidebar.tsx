// src/components/search/FilterSidebar.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/client';
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
import {
  SPARE_PARTS_SUBCATEGORIES,
  SPARE_MAKE_MODELS,
  VEHICLE_SPARE_SUBCATEGORIES,
  ELECTRONICS_OR_MACHINERY_SUBCATEGORIES,
  SparePartsSubcategory,
} from '@/lib/constants/spare-parts-wizard';
import {
  HealthBeautySubcategory,
  HEALTH_BEAUTY_SUBCATEGORIES,
  getHealthBeautyFieldTranslationKey,
  getHealthBeautyOptionTranslationKey,
} from '@/lib/constants/health-beauty-wizard';
import {
  HomeFurnitureSpecField,
  HomeFurnitureSubcategory,
  HOME_FURNITURE_SUBCATEGORIES,
  HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS,
  getHomeFurnitureSpecsConfig,
  getHomeFurnitureFieldTranslationKey,
  getHomeFurnitureOptionTranslationKey,
} from '@/lib/constants/home-furniture-wizard';
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

export interface SparePartsFilterState {
  subcategory: SparePartsSubcategory | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  seller_type: 'Individual' | 'Dealer' | '';
  keyword: string;
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  make: string;
  model: string;
  year_from: string;
  year_to: string;
  engine_type: '' | 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: '' | 'Manual' | 'Automatic';
  device_type: string;
  compatible_brand: string;
  compatible_model: string;
  version_series: string;
  part_name: string;
  part_type: string[];
  part_number: string;
  oem_aftermarket: '' | 'Original' | 'Aftermarket';
  material: string;
  color: string;
  weight_min: string;
  weight_max: string;
  dimension_length: string;
  dimension_width: string;
  dimension_height: string;
  warranty: '' | 'yes' | 'no';
  availability: '' | 'In Stock' | 'Out of Stock';
  placement: '' | 'Front' | 'Rear' | 'Left' | 'Right' | 'Universal';
  mileage: string;
  installation_type: '' | 'Easy' | 'Professional Required';
  included_components: string[];
  certification: string;
  voltage: string;
  power_rating: string;
  connector_type: string;
  compatibility_type: string;
  safety_certification: string;
  machine_type: string;
  load_capacity: string;
  operating_pressure: string;
  temperature_range: string;
  industrial_grade: '' | 'yes' | 'no';
}

export const EMPTY_SPARE_PARTS_FILTERS: SparePartsFilterState = {
  subcategory: '',
  postedDate: '',
  seller_type: '',
  keyword: '',
  condition: '',
  brand: '',
  make: '',
  model: '',
  year_from: '',
  year_to: '',
  engine_type: '',
  transmission: '',
  device_type: '',
  compatible_brand: '',
  compatible_model: '',
  version_series: '',
  part_name: '',
  part_type: [],
  part_number: '',
  oem_aftermarket: '',
  material: '',
  color: '',
  weight_min: '',
  weight_max: '',
  dimension_length: '',
  dimension_width: '',
  dimension_height: '',
  warranty: '',
  availability: '',
  placement: '',
  mileage: '',
  installation_type: '',
  included_components: [],
  certification: '',
  voltage: '',
  power_rating: '',
  connector_type: '',
  compatibility_type: '',
  safety_certification: '',
  machine_type: '',
  load_capacity: '',
  operating_pressure: '',
  temperature_range: '',
  industrial_grade: '',
};

export interface HealthBeautyFilterState {
  subcategory: HealthBeautySubcategory | '';
  keywords: string;
  condition: 'New' | 'Used' | 'Unopened' | '';
  brand: string;
  sellerType: 'Individual' | 'Dealer' | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  // cross-subcategory
  product_type: string;
  gender: string;
  formulation: string;
  // skincare
  skin_type: string;
  concern: string;
  has_spf: '' | 'yes' | 'no';
  organic_natural: '' | 'yes' | 'no';
  dermatologically_tested: '' | 'yes' | 'no';
  // haircare
  hair_type: string;
  sulfate_free: '' | 'yes' | 'no';
  organic: '' | 'yes' | 'no';
  // makeup
  finish: string;
  coverage: string;
  waterproof: '' | 'yes' | 'no';
  // fragrance
  fragrance_family: string;
  concentration: string;
  // health care
  prescription_required: '' | 'yes' | 'no';
  // beauty tools
  power_source: string;
  usage_area: string;
  warranty: '' | 'yes' | 'no';
}

export const EMPTY_HEALTH_BEAUTY_FILTERS: HealthBeautyFilterState = {
  subcategory: '',
  keywords: '',
  condition: '',
  brand: '',
  sellerType: '',
  postedDate: '',
  product_type: '',
  gender: '',
  formulation: '',
  skin_type: '',
  concern: '',
  has_spf: '',
  organic_natural: '',
  dermatologically_tested: '',
  hair_type: '',
  sulfate_free: '',
  organic: '',
  finish: '',
  coverage: '',
  waterproof: '',
  fragrance_family: '',
  concentration: '',
  prescription_required: '',
  power_source: '',
  usage_area: '',
  warranty: '',
};

export interface HomeFurnitureFilterState {
  subcategory: HomeFurnitureSubcategory | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  sellerType: 'Individual' | 'Dealer' | '';
  keywords: string;
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  furniture_type: string;
  material: string;
  color: string[];
  length: string;
  width: string;
  height: string;
  weight: string;
  seating_capacity: string;
  style: string;
  assembly_required: '' | 'yes' | 'no';
  condition_details: string;
  usage: string;
  warranty: string;
  included_items: string;
  decor_type: string;
  theme: string;
  handmade: '' | 'yes' | 'no';
  set_or_single: string;
  product_type: string;
  capacity: string;
  dishwasher_safe: '' | 'yes' | 'no';
  microwave_safe: '' | 'yes' | 'no';
  set_size: string;
  lighting_type: string;
  power_source: string;
  wattage: string;
  light_color: string;
  smart_lighting: '' | 'yes' | 'no';
  dimmable: '' | 'yes' | 'no';
  installation_type: string;
  storage_type: string;
  compartments: string;
  wall_mounted: '' | 'yes' | 'no';
  lockable: '' | 'yes' | 'no';
  custom_spec_1_key: string;
  custom_spec_1_value: string;
  custom_spec_2_key: string;
  custom_spec_2_value: string;
  custom_spec_3_key: string;
  custom_spec_3_value: string;
}

export const EMPTY_HOME_FURNITURE_FILTERS: HomeFurnitureFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  keywords: '',
  condition: '',
  brand: '',
  furniture_type: '',
  material: '',
  color: [],
  length: '',
  width: '',
  height: '',
  weight: '',
  seating_capacity: '',
  style: '',
  assembly_required: '',
  condition_details: '',
  usage: '',
  warranty: '',
  included_items: '',
  decor_type: '',
  theme: '',
  handmade: '',
  set_or_single: '',
  product_type: '',
  capacity: '',
  dishwasher_safe: '',
  microwave_safe: '',
  set_size: '',
  lighting_type: '',
  power_source: '',
  wattage: '',
  light_color: '',
  smart_lighting: '',
  dimmable: '',
  installation_type: '',
  storage_type: '',
  compartments: '',
  wall_mounted: '',
  lockable: '',
  custom_spec_1_key: '',
  custom_spec_1_value: '',
  custom_spec_2_key: '',
  custom_spec_2_value: '',
  custom_spec_3_key: '',
  custom_spec_3_value: '',
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
const SPARE_PART_TYPE_OPTIONS = ['Engine', 'Brake', 'Suspension', 'Electrical', 'Body', 'Interior', 'Other'];
const SPARE_ENGINE_TYPE_OPTIONS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const SPARE_TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];
const SPARE_OEM_OPTIONS = ['Original', 'Aftermarket'];
const SPARE_AVAILABILITY_OPTIONS = ['In Stock', 'Out of Stock'];
const SPARE_PLACEMENT_OPTIONS = ['Front', 'Rear', 'Left', 'Right', 'Universal'];
const SPARE_INSTALLATION_OPTIONS = ['Easy', 'Professional Required'];
const SPARE_INCLUDED_COMPONENT_OPTIONS = ['Bolts', 'Nuts', 'Wiring', 'Manual', 'Bracket', 'Other'];

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
  sparePartsFilters: SparePartsFilterState;
  onSparePartsFiltersChange: (filters: SparePartsFilterState) => void;
  onElectronicsClear?: () => void;
  onElectronicsSearch?: () => void;
  onFashionClear?: () => void;
  onFashionSearch?: () => void;
  onSparePartsClear?: () => void;
  onSparePartsSearch?: () => void;
  healthBeautyFilters: HealthBeautyFilterState;
  onHealthBeautyFiltersChange: (filters: HealthBeautyFilterState) => void;
  onHealthBeautyClear?: () => void;
  onHealthBeautySearch?: () => void;
  homeFurnitureFilters: HomeFurnitureFilterState;
  onHomeFurnitureFiltersChange: (filters: HomeFurnitureFilterState) => void;
  onHomeFurnitureClear?: () => void;
  onHomeFurnitureSearch?: () => void;
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

interface DbCategory {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string | null;
  parent_id: number | null;
  sort_order: number | null;
}

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
  sparePartsFilters,
  onSparePartsFiltersChange,
  onElectronicsClear,
  onElectronicsSearch,
  onFashionClear,
  onFashionSearch,
  onSparePartsClear,
  onSparePartsSearch,
  healthBeautyFilters,
  onHealthBeautyFiltersChange,
  onHealthBeautyClear,
  onHealthBeautySearch,
  homeFurnitureFilters,
  onHomeFurnitureFiltersChange,
  onHomeFurnitureClear,
  onHomeFurnitureSearch,
}) => {
  const supabase = createClient();
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const tVH = useTranslations('postAd.vehicles');
  const tRE = useTranslations('postAd.realEstate');
  const tEL = useTranslations('postAd.electronics');
  const tFA = useTranslations('postAd.fashion');
  const tSP = useTranslations('postAd.spareParts');
  const tHB = useTranslations('postAd.healthBeauty');
  const tHF = useTranslations('postAd.homeFurniture');
  const isRtl = isRTL(locale);
  const { cities } = useCities();

  const [dbCategories, setDbCategories] = React.useState<DbCategory[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name_en, name_ps, name_fa, slug, parent_id, sort_order')
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (!mounted) return;
      setDbCategories(((data as DbCategory[]) || []).filter((c) => c.slug !== 'mobile-phones' && c.slug !== 'phones'));
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const getLocalizedDbCategoryName = (category: DbCategory): string => {
    switch (locale) {
      case 'ps':
        return category.name_ps;
      case 'fa':
        return category.name_fa;
      case 'en':
      default:
        return category.name_en;
    }
  };

  const selectedDbCategory = dbCategories.find((c) => c.id === selectedCategory);
  const selectedCategorySlug = (selectedDbCategory?.slug || '').toLowerCase();

  const isVehicles = selectedCategory === 1;
  const isRealEstate = selectedCategory === 2;
  const isElectronics = selectedCategory === 3;
  const isFashion = selectedCategory === 4;
  const isSpareParts = selectedCategory === 5;
  const isHealthBeauty =
    selectedCategorySlug === 'health-beauty' ||
    selectedCategorySlug === 'health-and-beauty' ||
    selectedCategory === 13 ||
    selectedCategory === 18;
  const isHomeFurniture =
    selectedCategorySlug === 'home-furniture' ||
    selectedCategorySlug === 'home-and-furniture' ||
    selectedCategory === 6;

  const [fashionGeneralOpen, setFashionGeneralOpen] = React.useState(true);
  const [fashionSpecificOpen, setFashionSpecificOpen] = React.useState(true);
  const [spareGeneralOpen, setSpareGeneralOpen] = React.useState(true);
  const [spareCompatibilityOpen, setSpareCompatibilityOpen] = React.useState(true);
  const [spareSpecsOpen, setSpareSpecsOpen] = React.useState(true);
  const [hbGeneralOpen, setHbGeneralOpen] = React.useState(true);
  const [hbSpecificOpen, setHbSpecificOpen] = React.useState(true);
  const [hfGeneralOpen, setHfGeneralOpen] = React.useState(true);
  const [hfSpecificOpen, setHfSpecificOpen] = React.useState(true);

  const setVF = (patch: Partial<VehicleFilterState>) =>
    onVehicleFiltersChange({ ...vehicleFilters, ...patch });

  const setREF = (patch: Partial<RealEstateFilterState>) =>
    onRealEstateFiltersChange({ ...realEstateFilters, ...patch });

  const setEF = (patch: Partial<ElectronicsFilterState>) =>
    onElectronicsFiltersChange({ ...electronicsFilters, ...patch });

  const setFF = (patch: Partial<FashionFilterState>) =>
    onFashionFiltersChange({ ...fashionFilters, ...patch });

  const setSP = (patch: Partial<SparePartsFilterState>) =>
    onSparePartsFiltersChange({ ...sparePartsFilters, ...patch });

  const setHB = (patch: Partial<HealthBeautyFilterState>) =>
    onHealthBeautyFiltersChange({ ...healthBeautyFilters, ...patch });

  const setHF = (patch: Partial<HomeFurnitureFilterState>) =>
    onHomeFurnitureFiltersChange({ ...homeFurnitureFilters, ...patch });

  const getHFFieldLabel = (field: string, fallbackLabel?: string) => {
    const translationKey = getHomeFurnitureFieldTranslationKey(field);
    const fullKey = translationKey as Parameters<typeof tHF>[0];
    return tHF.has(fullKey) ? tHF(fullKey) : (fallbackLabel || field);
  };

  const getHFOptionLabel = (option: string) => {
    const translationKey = getHomeFurnitureOptionTranslationKey(option);
    const fullKey = translationKey as Parameters<typeof tHF>[0];
    return tHF.has(fullKey) ? tHF(fullKey) : option;
  };

  const toggleHomeFurnitureMulti = (field: 'color', value: string) => {
    const current = homeFurnitureFilters[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setHF({ [field]: next } as Partial<HomeFurnitureFilterState>);
  };

  const getHBFieldLabel = (field: string) => {
    const translationKey = getHealthBeautyFieldTranslationKey(field);
    const fullKey = translationKey as Parameters<typeof tHB>[0];
    return tHB.has(fullKey) ? tHB(fullKey) : field;
  };

  const getHBOptionLabel = (option: string) => {
    const translationKey = getHealthBeautyOptionTranslationKey(option);
    const fullKey = translationKey as Parameters<typeof tHB>[0];
    return tHB.has(fullKey) ? tHB(fullKey) : option;
  };

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

  const getSpareLabel = (key: string, fallback: string) => {
    return tSP.has(key as Parameters<typeof tSP>[0])
      ? tSP(key as Parameters<typeof tSP>[0])
      : fallback;
  };

  const getSpareOptionLabel = (option: string) => {
    const normalized = option
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/\//g, '_')
      .replace(/-/g, '_');
    const key = `optionLabels.${normalized}`;
    return tSP.has(key as Parameters<typeof tSP>[0])
      ? tSP(key as Parameters<typeof tSP>[0])
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

  const spareModels = sparePartsFilters.make ? SPARE_MAKE_MODELS[sparePartsFilters.make] || [] : [];
  const isVehicleSpare = VEHICLE_SPARE_SUBCATEGORIES.includes(sparePartsFilters.subcategory as SparePartsSubcategory);
  const isDeviceSpare = ELECTRONICS_OR_MACHINERY_SUBCATEGORIES.includes(sparePartsFilters.subcategory as SparePartsSubcategory);
  const isElectronicsSpare = sparePartsFilters.subcategory === 'electronics-parts';
  const isMachinerySpare = sparePartsFilters.subcategory === 'machinery-parts';

  const toggleSpareMulti = (field: 'part_type' | 'included_components', value: string) => {
    const current = sparePartsFilters[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setSP({ [field]: next });
  };

  const homeFurnitureSpecFields = homeFurnitureFilters.subcategory
    ? getHomeFurnitureSpecsConfig(homeFurnitureFilters.subcategory)
    : [];

  const renderHomeFurnitureField = (field: HomeFurnitureSpecField) => {
    const key = field.key as keyof HomeFurnitureFilterState;
    const label = getHFFieldLabel(field.key, field.label);

    if (field.type === 'multiselect') {
      const selected = homeFurnitureFilters[key] as string[];
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <MultiCheck
            options={(field.options || []).map((option) => ({ value: option, label: getHFOptionLabel(option) }))}
            selected={selected || []}
            onToggle={(v) => toggleHomeFurnitureMulti('color', v)}
            isRtl={isRtl}
          />
        </Section>
      );
    }

    if (field.type === 'toggle') {
      const value = String(homeFurnitureFilters[key] || '');
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <Sel
            value={value}
            onChange={(v) => setHF({ [key]: v } as Partial<HomeFurnitureFilterState>)}
            isRtl={isRtl}
          >
            <option value="">{tCommon('all')}</option>
            <option value="yes">{tCommon('yes')}</option>
            <option value="no">{tCommon('no')}</option>
          </Sel>
        </Section>
      );
    }

    if (field.type === 'select') {
      const value = String(homeFurnitureFilters[key] || '');
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <Sel
            value={value}
            onChange={(v) => setHF({ [key]: v } as Partial<HomeFurnitureFilterState>)}
            isRtl={isRtl}
          >
            <option value="">{tCommon('all')}</option>
            {(field.options || []).map((option) => (
              <option key={option} value={option}>{getHFOptionLabel(option)}</option>
            ))}
          </Sel>
        </Section>
      );
    }

    const value = String(homeFurnitureFilters[key] || '');
    const inputType = field.type === 'number' ? 'number' : 'text';
    return (
      <Section key={field.key} label={label} isRtl={isRtl}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => setHF({ [key]: e.target.value } as Partial<HomeFurnitureFilterState>)}
          placeholder={label}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        />
      </Section>
    );
  };

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
          {dbCategories.length > 0
            ? dbCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{getLocalizedDbCategoryName(cat)}</option>
            ))
            : MAIN_CATEGORIES.map((cat) => (
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
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && !isSpareParts && !isHealthBeauty && !isHomeFurniture && (
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
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && !isSpareParts && !isHealthBeauty && !isHomeFurniture && (
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

      {isSpareParts && (
        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setSpareGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {spareGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.subcategory}
                    onChange={(v) => setSP({ ...EMPTY_SPARE_PARTS_FILTERS, subcategory: v as SparePartsSubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_PARTS_SUBCATEGORIES.map((sub) => (
                      <option key={sub.value} value={sub.value}>{getSpareLabel(`subcategories.${sub.value}`, sub.label)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.keyword}
                    onChange={(e) => setSP({ keyword: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('condition', 'Condition')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.condition}
                    onChange={(v) => setSP({ condition: v as SparePartsFilterState['condition'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="New">{getSpareOptionLabel('new')}</option>
                    <option value="Used">{getSpareOptionLabel('used')}</option>
                    <option value="Refurbished">{getSpareOptionLabel('refurbished')}</option>
                  </Sel>
                </Section>

                <Section label={getSpareLabel('brand', 'Brand / Manufacturer')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.brand}
                    onChange={(e) => setSP({ brand: e.target.value })}
                    placeholder={getSpareLabel('brand', 'Brand / Manufacturer')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.seller_type}
                    onChange={(v) => setSP({ seller_type: v as SparePartsFilterState['seller_type'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{getSpareLabel('sellerTypeIndividual', t('individual'))}</option>
                    <option value="Dealer">{getSpareLabel('sellerTypeDealer', t('dealer'))}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.postedDate}
                    onChange={(v) => setSP({ postedDate: v as SparePartsFilterState['postedDate'] })}
                    isRtl={isRtl}
                  >
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
              onClick={() => setSpareCompatibilityOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {getSpareLabel('stepCompatibility', 'Compatibility')}
            </button>
            {spareCompatibilityOpen && (
              <div className="space-y-4 px-3 pb-3">
                {isVehicleSpare && (
                  <>
                    <Section label={getSpareLabel('make', 'Make')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.make}
                        onChange={(v) => setSP({ make: v, model: '' })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {Object.keys(SPARE_MAKE_MODELS).map((make) => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </Sel>
                    </Section>

                    <Section label={getSpareLabel('model', 'Model')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.model}
                        onChange={(v) => setSP({ model: v })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {spareModels.map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </Sel>
                    </Section>

                    <Section label={getSpareLabel('year_from', 'From Year')} isRtl={isRtl}>
                      <Sel value={sparePartsFilters.year_from} onChange={(v) => setSP({ year_from: v })} isRtl={isRtl}>
                        <option value="">{tCommon('all')}</option>
                        {years.map((y) => <option key={`from-${y}`} value={String(y)}>{y}</option>)}
                      </Sel>
                    </Section>

                    <Section label={getSpareLabel('year_to', 'To Year')} isRtl={isRtl}>
                      <Sel value={sparePartsFilters.year_to} onChange={(v) => setSP({ year_to: v })} isRtl={isRtl}>
                        <option value="">{tCommon('all')}</option>
                        {years.map((y) => <option key={`to-${y}`} value={String(y)}>{y}</option>)}
                      </Sel>
                    </Section>

                    <Section label={getSpareLabel('engine_type', 'Engine Type')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.engine_type}
                        onChange={(v) => setSP({ engine_type: v as SparePartsFilterState['engine_type'] })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {SPARE_ENGINE_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                        ))}
                      </Sel>
                    </Section>

                    <Section label={getSpareLabel('transmission', 'Transmission')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.transmission}
                        onChange={(v) => setSP({ transmission: v as SparePartsFilterState['transmission'] })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {SPARE_TRANSMISSION_OPTIONS.map((option) => (
                          <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                        ))}
                      </Sel>
                    </Section>
                  </>
                )}

                {isDeviceSpare && (
                  <>
                    <Section label={getSpareLabel('device_type', 'Device Type')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.device_type}
                        onChange={(e) => setSP({ device_type: e.target.value })}
                        placeholder={getSpareLabel('device_type', 'Device Type')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('compatible_brand', 'Compatible Brand')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.compatible_brand}
                        onChange={(e) => setSP({ compatible_brand: e.target.value })}
                        placeholder={getSpareLabel('compatible_brand', 'Compatible Brand')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('compatible_model', 'Compatible Model')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.compatible_model}
                        onChange={(e) => setSP({ compatible_model: e.target.value })}
                        placeholder={getSpareLabel('compatible_model', 'Compatible Model')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('version_series', 'Version / Series')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.version_series}
                        onChange={(e) => setSP({ version_series: e.target.value })}
                        placeholder={getSpareLabel('version_series', 'Version / Series')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setSpareSpecsOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {getSpareLabel('stepSpecs', 'Part Specifications')}
            </button>
            {spareSpecsOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={getSpareLabel('specFields.part_name', 'Part Name')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.part_name}
                    onChange={(e) => setSP({ part_name: e.target.value })}
                    placeholder={getSpareLabel('specFields.part_name', 'Part Name')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.part_type', 'Part Type')} isRtl={isRtl}>
                  <MultiCheck
                    options={SPARE_PART_TYPE_OPTIONS.map((option) => ({ value: option, label: getSpareOptionLabel(option) }))}
                    selected={sparePartsFilters.part_type}
                    onToggle={(v) => toggleSpareMulti('part_type', v)}
                    isRtl={isRtl}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.part_number', 'Part Number / SKU')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.part_number}
                    onChange={(e) => setSP({ part_number: e.target.value })}
                    placeholder={getSpareLabel('specFields.part_number', 'Part Number / SKU')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.oem_aftermarket', 'OEM / Aftermarket')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.oem_aftermarket}
                    onChange={(v) => setSP({ oem_aftermarket: v as SparePartsFilterState['oem_aftermarket'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_OEM_OPTIONS.map((option) => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={getSpareLabel('specFields.material', 'Material')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.material}
                    onChange={(e) => setSP({ material: e.target.value })}
                    placeholder={getSpareLabel('specFields.material', 'Material')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.color', 'Color')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.color}
                    onChange={(e) => setSP({ color: e.target.value })}
                    placeholder={getSpareLabel('specFields.color', 'Color')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.weight', 'Weight Range')} isRtl={isRtl}>
                  <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="number"
                      min="0"
                      value={sparePartsFilters.weight_min}
                      onChange={(e) => setSP({ weight_min: e.target.value })}
                      placeholder={t('minPrice')}
                      className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                    <input
                      type="number"
                      min="0"
                      value={sparePartsFilters.weight_max}
                      onChange={(e) => setSP({ weight_max: e.target.value })}
                      placeholder={t('maxPrice')}
                      className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                  </div>
                </Section>

                <Section label={getSpareLabel('specFields.dimension_length', 'Length')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.dimension_length}
                    onChange={(e) => setSP({ dimension_length: e.target.value })}
                    placeholder={getSpareLabel('specFields.dimension_length', 'Length')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.dimension_width', 'Width')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.dimension_width}
                    onChange={(e) => setSP({ dimension_width: e.target.value })}
                    placeholder={getSpareLabel('specFields.dimension_width', 'Width')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.dimension_height', 'Height')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sparePartsFilters.dimension_height}
                    onChange={(e) => setSP({ dimension_height: e.target.value })}
                    placeholder={getSpareLabel('specFields.dimension_height', 'Height')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSpareLabel('specFields.warranty', 'Warranty')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.warranty}
                    onChange={(v) => setSP({ warranty: v as SparePartsFilterState['warranty'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="yes">{tCommon('yes')}</option>
                    <option value="no">{tCommon('no')}</option>
                  </Sel>
                </Section>

                <Section label={getSpareLabel('specFields.availability', 'Availability')} isRtl={isRtl}>
                  <Sel
                    value={sparePartsFilters.availability}
                    onChange={(v) => setSP({ availability: v as SparePartsFilterState['availability'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_AVAILABILITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </Sel>
                </Section>

                {isVehicleSpare && (
                  <>
                    <Section label={getSpareLabel('specFields.placement', 'Placement')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.placement}
                        onChange={(v) => setSP({ placement: v as SparePartsFilterState['placement'] })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {SPARE_PLACEMENT_OPTIONS.map((option) => (
                          <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                        ))}
                      </Sel>
                    </Section>
                    <Section label={getSpareLabel('specFields.mileage', 'Mileage')} isRtl={isRtl}>
                      <input
                        type="number"
                        min="0"
                        value={sparePartsFilters.mileage}
                        onChange={(e) => setSP({ mileage: e.target.value })}
                        placeholder={getSpareLabel('specFields.mileage', 'Mileage')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.installation_type', 'Installation Type')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.installation_type}
                        onChange={(v) => setSP({ installation_type: v as SparePartsFilterState['installation_type'] })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        {SPARE_INSTALLATION_OPTIONS.map((option) => (
                          <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                        ))}
                      </Sel>
                    </Section>
                    <Section label={getSpareLabel('specFields.included_components', 'Included Components')} isRtl={isRtl}>
                      <MultiCheck
                        options={SPARE_INCLUDED_COMPONENT_OPTIONS.map((option) => ({ value: option, label: getSpareOptionLabel(option) }))}
                        selected={sparePartsFilters.included_components}
                        onToggle={(v) => toggleSpareMulti('included_components', v)}
                        isRtl={isRtl}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.certification', 'Certification')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.certification}
                        onChange={(e) => setSP({ certification: e.target.value })}
                        placeholder={getSpareLabel('specFields.certification', 'Certification')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                  </>
                )}

                {isElectronicsSpare && (
                  <>
                    <Section label={getSpareLabel('specFields.voltage', 'Voltage')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.voltage}
                        onChange={(e) => setSP({ voltage: e.target.value })}
                        placeholder={getSpareLabel('specFields.voltage', 'Voltage')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.power_rating', 'Power Rating')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.power_rating}
                        onChange={(e) => setSP({ power_rating: e.target.value })}
                        placeholder={getSpareLabel('specFields.power_rating', 'Power Rating')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.connector_type', 'Connector Type')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.connector_type}
                        onChange={(e) => setSP({ connector_type: e.target.value })}
                        placeholder={getSpareLabel('specFields.connector_type', 'Connector Type')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.compatibility_type', 'Compatibility Type')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.compatibility_type}
                        onChange={(e) => setSP({ compatibility_type: e.target.value })}
                        placeholder={getSpareLabel('specFields.compatibility_type', 'Compatibility Type')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.safety_certification', 'Safety Certification')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.safety_certification}
                        onChange={(e) => setSP({ safety_certification: e.target.value })}
                        placeholder={getSpareLabel('specFields.safety_certification', 'Safety Certification')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                  </>
                )}

                {isMachinerySpare && (
                  <>
                    <Section label={getSpareLabel('specFields.machine_type', 'Machine Type')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.machine_type}
                        onChange={(e) => setSP({ machine_type: e.target.value })}
                        placeholder={getSpareLabel('specFields.machine_type', 'Machine Type')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.load_capacity', 'Load Capacity')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.load_capacity}
                        onChange={(e) => setSP({ load_capacity: e.target.value })}
                        placeholder={getSpareLabel('specFields.load_capacity', 'Load Capacity')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.operating_pressure', 'Operating Pressure')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.operating_pressure}
                        onChange={(e) => setSP({ operating_pressure: e.target.value })}
                        placeholder={getSpareLabel('specFields.operating_pressure', 'Operating Pressure')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.temperature_range', 'Temperature Range')} isRtl={isRtl}>
                      <input
                        type="text"
                        value={sparePartsFilters.temperature_range}
                        onChange={(e) => setSP({ temperature_range: e.target.value })}
                        placeholder={getSpareLabel('specFields.temperature_range', 'Temperature Range')}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                      />
                    </Section>
                    <Section label={getSpareLabel('specFields.industrial_grade', 'Industrial Grade')} isRtl={isRtl}>
                      <Sel
                        value={sparePartsFilters.industrial_grade}
                        onChange={(v) => setSP({ industrial_grade: v as SparePartsFilterState['industrial_grade'] })}
                        isRtl={isRtl}
                      >
                        <option value="">{tCommon('all')}</option>
                        <option value="yes">{tCommon('yes')}</option>
                        <option value="no">{tCommon('no')}</option>
                      </Sel>
                    </Section>
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
                setSP(EMPTY_SPARE_PARTS_FILTERS);
                onSparePartsClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onSparePartsSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════
          HOME & FURNITURE FILTERS
         ═══════════════════════════════════════════════════ */}
      {isHomeFurniture && (
        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setHfGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {hfGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={homeFurnitureFilters.subcategory}
                    onChange={(v) => setHF({ ...EMPTY_HOME_FURNITURE_FILTERS, subcategory: v as HomeFurnitureSubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {HOME_FURNITURE_SUBCATEGORIES.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {tHF(HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS[sub.value] as Parameters<typeof tHF>[0])}
                      </option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={homeFurnitureFilters.keywords}
                    onChange={(e) => setHF({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel
                    value={homeFurnitureFilters.condition}
                    onChange={(v) => setHF({ condition: v as HomeFurnitureFilterState['condition'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="New">{getHFOptionLabel('New')}</option>
                    <option value="Used">{getHFOptionLabel('Used')}</option>
                    <option value="Refurbished">{getHFOptionLabel('Refurbished')}</option>
                  </Sel>
                </Section>

                <Section label={getHFFieldLabel('brand')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={homeFurnitureFilters.brand}
                    onChange={(e) => setHF({ brand: e.target.value })}
                    placeholder={getHFFieldLabel('brand')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel
                    value={homeFurnitureFilters.sellerType}
                    onChange={(v) => setHF({ sellerType: v as HomeFurnitureFilterState['sellerType'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{tHF('sellerTypeIndividual')}</option>
                    <option value="Dealer">{tHF('sellerTypeDealer')}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel
                    value={homeFurnitureFilters.postedDate}
                    onChange={(v) => setHF({ postedDate: v as HomeFurnitureFilterState['postedDate'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>
              </div>
            )}
          </div>

          {homeFurnitureFilters.subcategory && (
            <div className="rounded-lg border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setHfSpecificOpen((v) => !v)}
                className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {t('subcategoryFilters')}
              </button>
              {hfSpecificOpen && (
                <div className="space-y-4 px-3 pb-3">
                  {homeFurnitureSpecFields.map((field) => renderHomeFurnitureField(field))}
                </div>
              )}
            </div>
          )}

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
                setHF(EMPTY_HOME_FURNITURE_FILTERS);
                onHomeFurnitureClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onHomeFurnitureSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════
          HEALTH & BEAUTY FILTERS
         ═══════════════════════════════════════════════════ */}
      {isHealthBeauty && (
        <>
          {/* General Filters */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50">
            <button
              type="button"
              onClick={() => setHbGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-emerald-800 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {hbGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={healthBeautyFilters.subcategory}
                    onChange={(v) => setHB({ ...EMPTY_HEALTH_BEAUTY_FILTERS, subcategory: v as HealthBeautySubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {HEALTH_BEAUTY_SUBCATEGORIES.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {tHB.has((`subcategories.${sub.value}`) as Parameters<typeof tHB>[0])
                          ? tHB((`subcategories.${sub.value}`) as Parameters<typeof tHB>[0])
                          : sub.label}
                      </option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={healthBeautyFilters.keywords}
                    onChange={(e) => setHB({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.condition} onChange={(v) => setHB({ condition: v as HealthBeautyFilterState['condition'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="New">{getHBOptionLabel('New')}</option>
                    <option value="Used">{getHBOptionLabel('Used')}</option>
                    <option value="Unopened">{getHBOptionLabel('Unopened')}</option>
                  </Sel>
                </Section>

                <Section label={getHBFieldLabel('brand')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={healthBeautyFilters.brand}
                    onChange={(e) => setHB({ brand: e.target.value })}
                    placeholder={getHBFieldLabel('brand')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.sellerType} onChange={(v) => setHB({ sellerType: v as HealthBeautyFilterState['sellerType'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{tHB('sellerTypeIndividual')}</option>
                    <option value="Dealer">{tHB('sellerTypeDealer')}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.postedDate} onChange={(v) => setHB({ postedDate: v as HealthBeautyFilterState['postedDate'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>
              </div>
            )}
          </div>

          {/* Subcategory-specific Filters */}
          {healthBeautyFilters.subcategory && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50">
              <button
                type="button"
                onClick={() => setHbSpecificOpen((v) => !v)}
                className={`w-full px-3 py-2 text-sm font-semibold text-emerald-800 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {t('subcategoryFilters')}
              </button>
              {hbSpecificOpen && (
                <div className="space-y-4 px-3 pb-3">

                  {/* Skincare */}
                  {healthBeautyFilters.subcategory === 'skincare' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Face Mask', 'Exfoliator', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concern')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concern} onChange={(v) => setHB({ concern: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Acne', 'Anti-aging', 'Hydration', 'Brightening', 'Pigmentation', 'Pores', 'Redness'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('formulation')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.formulation} onChange={(v) => setHB({ formulation: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Gel', 'Cream', 'Liquid', 'Foam', 'Lotion', 'Balm'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('gender')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.gender} onChange={(v) => setHB({ gender: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Unisex', 'Male', 'Female'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('has_spf')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.has_spf} onChange={(v) => setHB({ has_spf: v as HealthBeautyFilterState['has_spf'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic_natural')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic_natural} onChange={(v) => setHB({ organic_natural: v as HealthBeautyFilterState['organic_natural'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('dermatologically_tested')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.dermatologically_tested} onChange={(v) => setHB({ dermatologically_tested: v as HealthBeautyFilterState['dermatologically_tested'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Haircare */}
                  {healthBeautyFilters.subcategory === 'haircare' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Shampoo', 'Conditioner', 'Hair Oil', 'Serum', 'Mask', 'Leave-in', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('hair_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.hair_type} onChange={(v) => setHB({ hair_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Normal', 'Curly', 'Damaged'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concern')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concern} onChange={(v) => setHB({ concern: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Hair Fall', 'Dandruff', 'Growth', 'Repair', 'Frizz Control'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('formulation')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.formulation} onChange={(v) => setHB({ formulation: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Liquid', 'Cream', 'Oil', 'Gel', 'Foam'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('sulfate_free')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.sulfate_free} onChange={(v) => setHB({ sulfate_free: v as HealthBeautyFilterState['sulfate_free'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic} onChange={(v) => setHB({ organic: v as HealthBeautyFilterState['organic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Makeup */}
                  {healthBeautyFilters.subcategory === 'makeup' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Foundation', 'Lipstick', 'Mascara', 'Concealer', 'Blush', 'Eyeliner', 'Powder', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('finish')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.finish} onChange={(v) => setHB({ finish: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Matte', 'Glossy', 'Natural', 'Dewy'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('coverage')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.coverage} onChange={(v) => setHB({ coverage: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Light', 'Medium', 'Full'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('waterproof')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.waterproof} onChange={(v) => setHB({ waterproof: v as HealthBeautyFilterState['waterproof'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Fragrances */}
                  {healthBeautyFilters.subcategory === 'fragrances' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Perfume', 'Body Spray', 'Deodorant'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('gender')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.gender} onChange={(v) => setHB({ gender: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Unisex', 'Male', 'Female'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('fragrance_family')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.fragrance_family} onChange={(v) => setHB({ fragrance_family: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concentration')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concentration} onChange={(v) => setHB({ concentration: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['EDT', 'EDP', 'Parfum'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Personal Care */}
                  {healthBeautyFilters.subcategory === 'personal-care' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Soap', 'Body Wash', 'Toothpaste', 'Shaving', 'Sanitary', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic} onChange={(v) => setHB({ organic: v as HealthBeautyFilterState['organic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Health Care Products */}
                  {healthBeautyFilters.subcategory === 'health-care-products' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Vitamins', 'Supplements', 'Medical Items', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('prescription_required')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.prescription_required} onChange={(v) => setHB({ prescription_required: v as HealthBeautyFilterState['prescription_required'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Beauty Tools & Devices */}
                  {healthBeautyFilters.subcategory === 'beauty-tools-devices' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Hair Dryer', 'Trimmer', 'Facial Device', 'Massager', 'Other'].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('power_source')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.power_source} onChange={(v) => setHB({ power_source: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Battery', 'Electric'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('usage_area')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.usage_area} onChange={(v) => setHB({ usage_area: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Face', 'Hair', 'Body'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('warranty')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.warranty} onChange={(v) => setHB({ warranty: v as HealthBeautyFilterState['warranty'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                </div>
              )}
            </div>
          )}

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setHB(EMPTY_HEALTH_BEAUTY_FILTERS);
                onHealthBeautyClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onHealthBeautySearch?.()}
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
