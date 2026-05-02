'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  HomeFurnitureSubcategory,
  HOME_FURNITURE_SUBCATEGORIES,
  HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS,
  getHomeFurnitureFieldTranslationKey,
  getHomeFurnitureOptionTranslationKey,
  isFurnitureSubcategory,
} from '@/lib/constants/home-furniture-wizard';
import { HomeFurnitureFilterState, EMPTY_HOME_FURNITURE_FILTERS } from './FilterSidebar';

// ─── Option constants for dropdowns ──────────────────────────────────────────
const FURNITURE_TYPE_OPTIONS = [
  'Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Desk',
  'Bookcase', 'Cabinet', 'Dresser', 'Bench', 'Other',
];

const MATERIAL_OPTIONS = [
  'Wood', 'Metal', 'Glass', 'Plastic', 'Fabric', 'Leather',
  'Rattan', 'Mixed', 'Other',
];

const COLOR_OPTIONS = [
  'White', 'Black', 'Brown', 'Grey', 'Beige', 'Natural Wood',
  'Blue', 'Green', 'Red', 'Gold', 'Silver', 'Other',
];

const STYLE_OPTIONS = [
  'Modern', 'Classic', 'Minimalist', 'Rustic', 'Industrial',
  'Scandinavian', 'Bohemian', 'Vintage', 'Luxury', 'Traditional', 'Other',
];

const USAGE_OPTIONS = ['Home', 'Office', 'Outdoor'];

const DECOR_TYPE_OPTIONS = [
  'Wall Art', 'Rug', 'Curtain', 'Mirror', 'Vase', 'Pillow',
  'Candle', 'Clock', 'Plant Pot', 'Other',
];

const THEME_OPTIONS = [
  'Vintage', 'Bohemian', 'Luxury', 'Nature', 'Abstract', 'Traditional', 'Other',
];

const KITCHEN_PRODUCT_TYPE_OPTIONS = [
  'Cookware', 'Utensils', 'Dinner Set', 'Appliance',
  'Storage Container', 'Cutlery', 'Glassware', 'Other',
];

const LIGHTING_TYPE_OPTIONS = [
  'Ceiling Light', 'Floor Lamp', 'Table Lamp', 'Wall Light',
  'LED Strip', 'Chandelier', 'Spotlight', 'Other',
];

const POWER_SOURCE_OPTIONS = ['Electric', 'Battery', 'Solar', 'USB'];

const LIGHT_COLOR_OPTIONS = ['Warm White', 'Cool White', 'Daylight', 'RGB', 'Tunable'];

const INSTALLATION_TYPE_OPTIONS = [
  'Ceiling Mount', 'Wall Mount', 'Floor Standing', 'Plug-in', 'Hardwired', 'Other',
];

const STORAGE_TYPE_OPTIONS = [
  'Cabinet', 'Shelf', 'Drawer Unit', 'Organizer', 'Rack',
  'Trunk', 'Box', 'Hanger', 'Other',
];

const SET_OR_SINGLE_OPTIONS = ['Single', 'Set'];

// ─── Props ───────────────────────────────────────────────────────────────────
interface HomeFurnitureFilterEnhancedProps {
  locale: Locale;
  filters: HomeFurnitureFilterState;
  onFiltersChange: (filters: HomeFurnitureFilterState) => void;
  onClear?: () => void;
  onSearch?: () => void;
  resultCount?: number;
  priceMin?: string;
  priceMax?: string;
  onPriceMinChange?: (value: string) => void;
  onPriceMaxChange?: (value: string) => void;
}

// ─── Helper: FilterSection (collapsible) ─────────────────────────────────────
interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  isRtl: boolean;
  accentColor?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon,
  children,
  isOpen = true,
  onToggle,
  isRtl,
  accentColor = 'primary',
}) => {
  const colorMap: Record<string, string> = {
    primary: 'border-primary-200 bg-primary-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    emerald: 'border-emerald-200 bg-emerald-50/50',
    violet: 'border-violet-200 bg-violet-50/50',
    slate: 'border-slate-200 bg-slate-50/50',
  };
  const headerColorMap: Record<string, string> = {
    primary: 'text-primary-800 bg-primary-50',
    amber: 'text-amber-800 bg-amber-50',
    emerald: 'text-emerald-800 bg-emerald-50',
    violet: 'text-violet-800 bg-violet-50',
    slate: 'text-slate-800 bg-slate-50',
  };
  const borderClass = colorMap[accentColor] || colorMap.primary;
  const headerClass = headerColorMap[accentColor] || headerColorMap.primary;

  return (
    <div className={`rounded-xl border ${borderClass} shadow-sm overflow-hidden`}>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className={`w-full px-4 py-3 flex items-center justify-between text-sm font-semibold ${headerClass} hover:opacity-90 transition-opacity ${isRtl ? 'text-right flex-row-reverse' : 'text-left'}`}
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div className={`px-4 py-3 text-sm font-semibold ${headerClass} ${isRtl ? 'text-right' : 'text-left'}`}>
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
        </div>
      )}
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

// ─── Helper: MultiSelectTags ─────────────────────────────────────────────────
interface MultiSelectTagsProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  isRtl: boolean;
  placeholder?: string;
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
  label,
  options,
  selected,
  onChange,
  isRtl,
  placeholder,
}) => {
  const t = useTranslations('search');
  const [inputValue, setInputValue] = useState('');
  const resolvedPlaceholder = placeholder || t('selectOptions');

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const filteredOptions = options.filter(
    (opt) =>
      !selected.includes(opt.value) &&
      opt.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full"
              >
                {option?.label || value}
                <button
                  type="button"
                  onClick={() => handleRemove(value)}
                  className="text-primary-600 hover:text-primary-800 focus:outline-none"
                  aria-label={`${t('remove')} ${option?.label || value}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={resolvedPlaceholder}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
          aria-label={`${t('keywords')} ${label}`}
        />
        {inputValue && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  handleToggle(option.value);
                  setInputValue('');
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
              selected.includes(option.value)
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Helper: SelectField ─────────────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  isRtl: boolean;
  allLabel?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  isRtl,
  allLabel,
}) => {
  const tCommon = useTranslations('common');
  const resolvedAll = allLabel || tCommon('all');

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        aria-label={label}
      >
        <option value="">{resolvedAll}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ─── Helper: ToggleField ─────────────────────────────────────────────────────
interface ToggleFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
}

const ToggleField: React.FC<ToggleFieldProps> = ({ label, value, onChange, isRtl }) => {
  const tCommon = useTranslations('common');

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        aria-label={label}
      >
        <option value="">{tCommon('all')}</option>
        <option value="yes">{tCommon('yes')}</option>
        <option value="no">{tCommon('no')}</option>
      </select>
    </div>
  );
};

// ─── Helper: NumberField ─────────────────────────────────────────────────────
interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  isRtl,
  placeholder,
  min,
  max,
  step,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        aria-label={label}
      />
    </div>
  );
};

// ─── Helper: TextField ───────────────────────────────────────────────────────
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, isRtl, placeholder }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        aria-label={label}
      />
    </div>
  );
};

// ─── Helper: PriceRangeSlider ────────────────────────────────────────────────
interface PriceRangeSliderProps {
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  isRtl: boolean;
  maxPrice?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  isRtl,
  maxPrice = 500000,
}) => {
  const t = useTranslations('search');
  const minNum = priceMin ? Number(priceMin) : 0;
  const maxNum = priceMax ? Number(priceMax) : maxPrice;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        {t('priceRange')}
        <span className="ml-2 text-xs text-slate-500">
          {priceMin || '0'} - {priceMax || maxPrice.toLocaleString()}
        </span>
      </label>
      <div className="relative pt-6">
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={minNum}
          onChange={(e) => onPriceMinChange(e.target.value)}
          className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
          aria-label={t('minPrice')}
        />
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={maxNum}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
          aria-label={t('maxPrice')}
        />
        <div className="h-2 bg-slate-200 rounded-lg">
          <div
            className="h-full bg-primary-500 rounded-lg"
            style={{
              left: `${(minNum / maxPrice) * 100}%`,
              right: `${100 - (maxNum / maxPrice) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1">
          <label className="block text-xs text-slate-600 mb-1">{t('min')}</label>
          <input
            type="number"
            min={0}
            max={maxPrice}
            step={500}
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            aria-label={t('minPrice')}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-600 mb-1">{t('max')}</label>
          <input
            type="number"
            min={0}
            max={maxPrice}
            step={500}
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            aria-label={t('maxPrice')}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const GeneralIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SpecsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const DimensionsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const FeaturesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PriceIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const HomeFurnitureFilterEnhanced: React.FC<HomeFurnitureFilterEnhancedProps> = ({
  locale,
  filters,
  onFiltersChange,
  onClear,
  onSearch,
  resultCount,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
}) => {
  const t = useTranslations('search');
  const tHF = useTranslations('postAd');
  const rtl = isRTL(locale);

  const [openSections, setOpenSections] = useState({
    general: true,
    specifications: true,
    dimensions: false,
    features: false,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setFilter = (updates: Partial<HomeFurnitureFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  // ─── Translation helpers ─────────────────────────────────────────────────
  const getHFLabel = (key: string, fallback: string) => {
    const translationKey = getHomeFurnitureFieldTranslationKey(key);
    const fullKey = `homeFurniture.${translationKey}` as Parameters<typeof tHF>[0];
    try {
      const translated = tHF(fullKey);
      if (translated && !translated.includes('homeFurniture.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return fallback;
  };

  const getHFOptionLabel = (option: string) => {
    const translationKey = getHomeFurnitureOptionTranslationKey(option);
    const fullKey = `homeFurniture.${translationKey}` as Parameters<typeof tHF>[0];
    try {
      const translated = tHF(fullKey);
      if (translated && !translated.includes('homeFurniture.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return option;
  };

  const getSubcategoryLabel = (subValue: string) => {
    const labelKey = HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS[subValue as HomeFurnitureSubcategory];
    if (labelKey) {
      const fullKey = `homeFurniture.${labelKey}` as Parameters<typeof tHF>[0];
      try {
        const translated = tHF(fullKey);
        if (translated && !translated.includes('homeFurniture.')) {
          return translated;
        }
      } catch {
        // fall through
      }
    }
    const sub = HOME_FURNITURE_SUBCATEGORIES.find((s) => s.value === subValue);
    return sub?.label || subValue;
  };

  // ─── Multi-select change handler ─────────────────────────────────────────
  const handleColorChange = (selected: string[]) => {
    setFilter({ color: selected });
  };

  // ─── Determine subcategory type ──────────────────────────────────────────
  const subcategory = filters.subcategory;
  const isFurniture = subcategory ? isFurnitureSubcategory(subcategory) : false;
  const isDecor = subcategory === 'home-decor';
  const isKitchen = subcategory === 'kitchen-dining';
  const isLighting = subcategory === 'lighting';
  const isStorage = subcategory === 'storage-organization';

  // ─── Build option arrays with translated labels ──────────────────────────
  const colorOptions = useMemo(
    () => COLOR_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const materialOptions = useMemo(
    () => MATERIAL_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const styleOptions = useMemo(
    () => STYLE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const furnitureTypeOptions = useMemo(
    () => FURNITURE_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const usageOptions = useMemo(
    () => USAGE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const decorTypeOptions = useMemo(
    () => DECOR_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const themeOptions = useMemo(
    () => THEME_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const kitchenProductTypeOptions = useMemo(
    () => KITCHEN_PRODUCT_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const lightingTypeOptions = useMemo(
    () => LIGHTING_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const powerSourceOptions = useMemo(
    () => POWER_SOURCE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const lightColorOptions = useMemo(
    () => LIGHT_COLOR_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const installationTypeOptions = useMemo(
    () => INSTALLATION_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const storageTypeOptions = useMemo(
    () => STORAGE_TYPE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const setOrSingleOptions = useMemo(
    () => SET_OR_SINGLE_OPTIONS.map((v) => ({ value: v, label: getHFOptionLabel(v) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // ─── Active filter count ────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.keywords) count++;
    if (filters.condition) count++;
    if (filters.brand) count++;
    if (filters.sellerType) count++;
    if (filters.postedDate) count++;
    if (filters.furniture_type) count++;
    if (filters.material) count++;
    if (filters.color.length > 0) count++;
    if (filters.style) count++;
    if (filters.usage) count++;
    if (filters.assembly_required) count++;
    if (filters.decor_type) count++;
    if (filters.theme) count++;
    if (filters.handmade) count++;
    if (filters.set_or_single) count++;
    if (filters.product_type) count++;
    if (filters.dishwasher_safe) count++;
    if (filters.microwave_safe) count++;
    if (filters.lighting_type) count++;
    if (filters.power_source) count++;
    if (filters.light_color) count++;
    if (filters.smart_lighting) count++;
    if (filters.dimmable) count++;
    if (filters.installation_type) count++;
    if (filters.storage_type) count++;
    if (filters.wall_mounted) count++;
    if (filters.lockable) count++;
    if (filters.length) count++;
    if (filters.width) count++;
    if (filters.height) count++;
    if (filters.weight) count++;
    if (filters.seating_capacity) count++;
    if (filters.wattage) count++;
    if (filters.set_size) count++;
    if (filters.compartments) count++;
    if (filters.capacity) count++;
    if (filters.condition_details) count++;
    if (filters.warranty) count++;
    if (filters.included_items) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Result count & active filters preview */}
      <div className={`p-3 bg-primary-50 border border-primary-200 rounded-lg ${rtl ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-primary-800">
            {resultCount !== undefined
              ? t('showingResults', { count: resultCount })
              : t('adjustFilters')}
          </p>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
              {activeFilterCount} {t('features')}
            </span>
          )}
        </div>
        <p className="text-xs text-primary-600 mt-1">{t('adjustFilters')}</p>
      </div>

      {/* ═══ General Filters ═══ */}
      <FilterSection
        title={t('generalFilters')}
        icon={<GeneralIcon />}
        isOpen={openSections.general}
        onToggle={() => toggleSection('general')}
        isRtl={rtl}
        accentColor="primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subcategory */}
          <SelectField
            label={t('subcategory')}
            value={filters.subcategory}
            onChange={(v) =>
              setFilter({ ...EMPTY_HOME_FURNITURE_FILTERS, subcategory: v as HomeFurnitureSubcategory | '' })
            }
            options={HOME_FURNITURE_SUBCATEGORIES.map((sub) => ({
              value: sub.value,
              label: getSubcategoryLabel(sub.value),
            }))}
            isRtl={rtl}
          />

          {/* Keywords */}
          <TextField
            label={t('keywords')}
            value={filters.keywords}
            onChange={(v) => setFilter({ keywords: v })}
            isRtl={rtl}
            placeholder={t('keywords')}
          />

          {/* Condition */}
          <SelectField
            label={t('condition')}
            value={filters.condition}
            onChange={(v) => setFilter({ condition: v as HomeFurnitureFilterState['condition'] })}
            options={[
              { value: 'New', label: getHFOptionLabel('New') },
              { value: 'Used', label: getHFOptionLabel('Used') },
              { value: 'Refurbished', label: getHFOptionLabel('Refurbished') },
            ]}
            isRtl={rtl}
          />

          {/* Brand */}
          <TextField
            label={getHFLabel('brand', 'Brand')}
            value={filters.brand}
            onChange={(v) => setFilter({ brand: v })}
            isRtl={rtl}
            placeholder={getHFLabel('brand', 'Brand')}
          />

          {/* Seller Type */}
          <SelectField
            label={t('sellerType')}
            value={filters.sellerType}
            onChange={(v) => setFilter({ sellerType: v as HomeFurnitureFilterState['sellerType'] })}
            options={[
              { value: 'Individual', label: t('individual') },
              { value: 'Dealer', label: t('dealer') },
            ]}
            isRtl={rtl}
          />

          {/* Posted Date */}
          <SelectField
            label={t('postedDate')}
            value={filters.postedDate}
            onChange={(v) => setFilter({ postedDate: v as HomeFurnitureFilterState['postedDate'] })}
            options={[
              { value: 'today', label: t('today') },
              { value: 'last7', label: t('last7Days') },
              { value: 'last30', label: t('last30Days') },
            ]}
            isRtl={rtl}
            allLabel={t('anyTime')}
          />
        </div>
      </FilterSection>

      {/* ═══ Specification Filters (subcategory-specific) ═══ */}
      {subcategory && (
        <FilterSection
          title={t('subcategoryFilters')}
          icon={<SpecsIcon />}
          isOpen={openSections.specifications}
          onToggle={() => toggleSection('specifications')}
          isRtl={rtl}
          accentColor="amber"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ── Furniture subcategories (Living Room, Bedroom, Dining, Office, Outdoor) ── */}
            {isFurniture && (
              <>
                <SelectField
                  label={getHFLabel('furniture_type', 'Furniture Type')}
                  value={filters.furniture_type}
                  onChange={(v) => setFilter({ furniture_type: v })}
                  options={furnitureTypeOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('material', 'Material')}
                  value={filters.material}
                  onChange={(v) => setFilter({ material: v })}
                  options={materialOptions}
                  isRtl={rtl}
                />
                <div className="md:col-span-2">
                  <MultiSelectTags
                    label={getHFLabel('color', 'Color')}
                    options={colorOptions}
                    selected={filters.color}
                    onChange={handleColorChange}
                    isRtl={rtl}
                    placeholder={t('selectOptions')}
                  />
                </div>
                <SelectField
                  label={getHFLabel('style', 'Style')}
                  value={filters.style}
                  onChange={(v) => setFilter({ style: v })}
                  options={styleOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('usage', 'Usage')}
                  value={filters.usage}
                  onChange={(v) => setFilter({ usage: v })}
                  options={usageOptions}
                  isRtl={rtl}
                />
                <NumberField
                  label={getHFLabel('seating_capacity', 'Seating Capacity')}
                  value={filters.seating_capacity}
                  onChange={(v) => setFilter({ seating_capacity: v })}
                  isRtl={rtl}
                  min={1}
                  max={20}
                />
                <ToggleField
                  label={getHFLabel('assembly_required', 'Assembly Required')}
                  value={filters.assembly_required}
                  onChange={(v) => setFilter({ assembly_required: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
              </>
            )}

            {/* ── Home Decor ── */}
            {isDecor && (
              <>
                <SelectField
                  label={getHFLabel('decor_type', 'Decor Type')}
                  value={filters.decor_type}
                  onChange={(v) => setFilter({ decor_type: v })}
                  options={decorTypeOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('material', 'Material')}
                  value={filters.material}
                  onChange={(v) => setFilter({ material: v })}
                  options={materialOptions}
                  isRtl={rtl}
                />
                <div className="md:col-span-2">
                  <MultiSelectTags
                    label={getHFLabel('color', 'Color')}
                    options={colorOptions}
                    selected={filters.color}
                    onChange={handleColorChange}
                    isRtl={rtl}
                    placeholder={t('selectOptions')}
                  />
                </div>
                <SelectField
                  label={getHFLabel('style', 'Style')}
                  value={filters.style}
                  onChange={(v) => setFilter({ style: v })}
                  options={styleOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('theme', 'Theme')}
                  value={filters.theme}
                  onChange={(v) => setFilter({ theme: v })}
                  options={themeOptions}
                  isRtl={rtl}
                />
                <ToggleField
                  label={getHFLabel('handmade', 'Handmade')}
                  value={filters.handmade}
                  onChange={(v) => setFilter({ handmade: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('set_or_single', 'Set or Single Item')}
                  value={filters.set_or_single}
                  onChange={(v) => setFilter({ set_or_single: v })}
                  options={setOrSingleOptions}
                  isRtl={rtl}
                />
              </>
            )}

            {/* ── Kitchen & Dining ── */}
            {isKitchen && (
              <>
                <SelectField
                  label={getHFLabel('product_type', 'Product Type')}
                  value={filters.product_type}
                  onChange={(v) => setFilter({ product_type: v })}
                  options={kitchenProductTypeOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('material', 'Material')}
                  value={filters.material}
                  onChange={(v) => setFilter({ material: v })}
                  options={materialOptions}
                  isRtl={rtl}
                />
                <div className="md:col-span-2">
                  <MultiSelectTags
                    label={getHFLabel('color', 'Color')}
                    options={colorOptions}
                    selected={filters.color}
                    onChange={handleColorChange}
                    isRtl={rtl}
                    placeholder={t('selectOptions')}
                  />
                </div>
                <ToggleField
                  label={getHFLabel('dishwasher_safe', 'Dishwasher Safe')}
                  value={filters.dishwasher_safe}
                  onChange={(v) => setFilter({ dishwasher_safe: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <ToggleField
                  label={getHFLabel('microwave_safe', 'Microwave Safe')}
                  value={filters.microwave_safe}
                  onChange={(v) => setFilter({ microwave_safe: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <NumberField
                  label={getHFLabel('set_size', 'Set Size (pieces)')}
                  value={filters.set_size}
                  onChange={(v) => setFilter({ set_size: v })}
                  isRtl={rtl}
                  min={1}
                  max={100}
                />
              </>
            )}

            {/* ── Lighting ── */}
            {isLighting && (
              <>
                <SelectField
                  label={getHFLabel('lighting_type', 'Type')}
                  value={filters.lighting_type}
                  onChange={(v) => setFilter({ lighting_type: v })}
                  options={lightingTypeOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('power_source', 'Power Source')}
                  value={filters.power_source}
                  onChange={(v) => setFilter({ power_source: v })}
                  options={powerSourceOptions}
                  isRtl={rtl}
                />
                <NumberField
                  label={getHFLabel('wattage', 'Wattage (W)')}
                  value={filters.wattage}
                  onChange={(v) => setFilter({ wattage: v })}
                  isRtl={rtl}
                  min={1}
                  max={2000}
                />
                <SelectField
                  label={getHFLabel('light_color', 'Light Color')}
                  value={filters.light_color}
                  onChange={(v) => setFilter({ light_color: v })}
                  options={lightColorOptions}
                  isRtl={rtl}
                />
                <ToggleField
                  label={getHFLabel('smart_lighting', 'Smart Lighting')}
                  value={filters.smart_lighting}
                  onChange={(v) => setFilter({ smart_lighting: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <ToggleField
                  label={getHFLabel('dimmable', 'Dimmable')}
                  value={filters.dimmable}
                  onChange={(v) => setFilter({ dimmable: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <div className="md:col-span-2">
                  <SelectField
                    label={getHFLabel('installation_type', 'Installation Type')}
                    value={filters.installation_type}
                    onChange={(v) => setFilter({ installation_type: v })}
                    options={installationTypeOptions}
                    isRtl={rtl}
                  />
                </div>
              </>
            )}

            {/* ── Storage & Organization ── */}
            {isStorage && (
              <>
                <SelectField
                  label={getHFLabel('storage_type', 'Storage Type')}
                  value={filters.storage_type}
                  onChange={(v) => setFilter({ storage_type: v })}
                  options={storageTypeOptions}
                  isRtl={rtl}
                />
                <SelectField
                  label={getHFLabel('material', 'Material')}
                  value={filters.material}
                  onChange={(v) => setFilter({ material: v })}
                  options={materialOptions}
                  isRtl={rtl}
                />
                <div className="md:col-span-2">
                  <MultiSelectTags
                    label={getHFLabel('color', 'Color')}
                    options={colorOptions}
                    selected={filters.color}
                    onChange={handleColorChange}
                    isRtl={rtl}
                    placeholder={t('selectOptions')}
                  />
                </div>
                <NumberField
                  label={getHFLabel('compartments', 'Number of Compartments')}
                  value={filters.compartments}
                  onChange={(v) => setFilter({ compartments: v })}
                  isRtl={rtl}
                  min={1}
                  max={50}
                />
                <ToggleField
                  label={getHFLabel('wall_mounted', 'Wall Mounted')}
                  value={filters.wall_mounted}
                  onChange={(v) => setFilter({ wall_mounted: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
                <ToggleField
                  label={getHFLabel('lockable', 'Lockable')}
                  value={filters.lockable}
                  onChange={(v) => setFilter({ lockable: v as '' | 'yes' | 'no' })}
                  isRtl={rtl}
                />
              </>
            )}

            {/* ── Other (custom specs) ── */}
            {subcategory === 'other' && (
              <>
                <TextField
                  label={getHFLabel('product_type', 'Product Type')}
                  value={filters.product_type}
                  onChange={(v) => setFilter({ product_type: v })}
                  isRtl={rtl}
                />
              </>
            )}
          </div>
        </FilterSection>
      )}

      {/* ═══ Dimensions & Size ═══ */}
      {(isFurniture || isDecor || isStorage) && (
        <FilterSection
          title={getHFLabel('dimensions', 'Dimensions & Size')}
          icon={<DimensionsIcon />}
          isOpen={openSections.dimensions}
          onToggle={() => toggleSection('dimensions')}
          isRtl={rtl}
          accentColor="violet"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField
              label={getHFLabel('length', 'Length (cm)')}
              value={filters.length}
              onChange={(v) => setFilter({ length: v })}
              isRtl={rtl}
              min={1}
              placeholder="0"
            />
            <NumberField
              label={getHFLabel('width', 'Width (cm)')}
              value={filters.width}
              onChange={(v) => setFilter({ width: v })}
              isRtl={rtl}
              min={1}
              placeholder="0"
            />
            <NumberField
              label={getHFLabel('height', 'Height (cm)')}
              value={filters.height}
              onChange={(v) => setFilter({ height: v })}
              isRtl={rtl}
              min={1}
              placeholder="0"
            />
          </div>
          {(isFurniture || isStorage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <NumberField
                label={getHFLabel('weight', 'Weight (kg)')}
                value={filters.weight}
                onChange={(v) => setFilter({ weight: v })}
                isRtl={rtl}
                min={0.1}
                step={0.1}
                placeholder="0"
              />
              {isStorage && (
                <TextField
                  label={getHFLabel('capacity', 'Capacity')}
                  value={filters.capacity}
                  onChange={(v) => setFilter({ capacity: v })}
                  isRtl={rtl}
                />
              )}
            </div>
          )}
        </FilterSection>
      )}

      {/* ═══ Features & Details ═══ */}
      {subcategory && (
        <FilterSection
          title={getHFLabel('features', 'Features & Details')}
          icon={<FeaturesIcon />}
          isOpen={openSections.features}
          onToggle={() => toggleSection('features')}
          isRtl={rtl}
          accentColor="emerald"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label={getHFLabel('condition_details', 'Condition Details')}
              value={filters.condition_details}
              onChange={(v) => setFilter({ condition_details: v })}
              isRtl={rtl}
              placeholder={getHFLabel('condition_details', 'Condition Details')}
            />
            <TextField
              label={getHFLabel('warranty', 'Warranty')}
              value={filters.warranty}
              onChange={(v) => setFilter({ warranty: v })}
              isRtl={rtl}
              placeholder={getHFLabel('warranty', 'Warranty')}
            />
            {isFurniture && (
              <div className="md:col-span-2">
                <TextField
                  label={getHFLabel('included_items', 'Included Items')}
                  value={filters.included_items}
                  onChange={(v) => setFilter({ included_items: v })}
                  isRtl={rtl}
                  placeholder={getHFLabel('included_items', 'Included Items')}
                />
              </div>
            )}
          </div>
        </FilterSection>
      )}

      {/* ═══ Price Range ═══ */}
      <FilterSection
        title={t('priceSlider')}
        icon={<PriceIcon />}
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
        isRtl={rtl}
        accentColor="slate"
      >
        {onPriceMinChange && onPriceMaxChange && (
          <PriceRangeSlider
            priceMin={priceMin || ''}
            priceMax={priceMax || ''}
            onPriceMinChange={onPriceMinChange}
            onPriceMaxChange={onPriceMaxChange}
            isRtl={rtl}
          />
        )}
      </FilterSection>

      {/* ═══ Action Buttons ═══ */}
      <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => {
            setFilter(EMPTY_HOME_FURNITURE_FILTERS);
            onClear?.();
          }}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          {t('clearFilters')}
        </button>
        <button
          type="button"
          onClick={() => onSearch?.()}
          className="flex-1 px-4 py-2.5 rounded-lg border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm"
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};
