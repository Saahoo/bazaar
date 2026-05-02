'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  SparePartsSubcategory,
  SPARE_PARTS_SUBCATEGORIES,
  VEHICLE_SPARE_SUBCATEGORIES,
  SPARE_MAKE_MODELS,
} from '@/lib/constants/spare-parts-wizard';
import { SparePartsFilterState, EMPTY_SPARE_PARTS_FILTERS } from './FilterSidebar';

// Define constants locally (they're defined in FilterSidebar.tsx but not exported)
const SPARE_PART_TYPE_OPTIONS = ['Engine', 'Brake', 'Suspension', 'Electrical', 'Body', 'Interior', 'Other'];
const SPARE_ENGINE_TYPE_OPTIONS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const SPARE_TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];
const SPARE_OEM_OPTIONS = ['Original', 'Aftermarket'];
const SPARE_AVAILABILITY_OPTIONS = ['In Stock', 'Out of Stock'];
const SPARE_PLACEMENT_OPTIONS = ['Front', 'Rear', 'Left', 'Right', 'Universal'];
const SPARE_INSTALLATION_OPTIONS = ['Easy', 'Professional Required'];
const SPARE_INCLUDED_COMPONENT_OPTIONS = ['Bolts', 'Nuts', 'Wiring', 'Manual', 'Bracket', 'Other'];

interface SparePartsFilterEnhancedProps {
  locale: Locale;
  filters: SparePartsFilterState;
  onFiltersChange: (filters: SparePartsFilterState) => void;
  onClear?: () => void;
  onSearch?: () => void;
  resultCount?: number;
  priceMin?: string;
  priceMax?: string;
  onPriceMinChange?: (value: string) => void;
  onPriceMaxChange?: (value: string) => void;
}

// Helper component for range slider
interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  valueMin: string;
  valueMax: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
  isRtl: boolean;
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  isRtl,
  unit = '',
}) => {
  const t = useTranslations('search');
  const minNum = valueMin ? Number(valueMin) : min;
  const maxNum = valueMax ? Number(valueMax) : max;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        <span className="ml-2 text-xs text-slate-500">
          {valueMin || min}{unit} - {valueMax || max}{unit}
        </span>
      </label>
      <div className="space-y-4">
        <div className="relative pt-6">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minNum}
            onChange={(e) => onChangeMin(e.target.value)}
            className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            aria-label={`${t('minimum')} ${label}`}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxNum}
            onChange={(e) => onChangeMax(e.target.value)}
            className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
            aria-label={`${t('maximum')} ${label}`}
          />
          <div className="h-2 bg-slate-200 rounded-lg">
            <div 
              className="h-full bg-primary-500 rounded-lg"
              style={{ 
                left: `${((minNum - min) / (max - min)) * 100}%`,
                right: `${100 - ((maxNum - min) / (max - min)) * 100}%`
              }}
            />
          </div>
        </div>
        <div className={`flex justify-between text-xs text-slate-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
        <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">{t('min')}</label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={valueMin}
              onChange={(e) => onChangeMin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              aria-label={`${t('minimum')} ${label}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-slate-600 mb-1">{t('max')}</label>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={valueMax}
              onChange={(e) => onChangeMax(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              aria-label={`${t('maximum')} ${label}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for multi-select with tags
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
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  const filteredOptions = options.filter(opt => 
    !selected.includes(opt.value) && 
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(value => {
          const option = options.find(opt => opt.value === value);
          return (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full"
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
            {filteredOptions.map(option => (
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
        {options.map(option => (
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

// Helper component for filter section
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  isRtl: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isOpen = true,
  onToggle,
  isRtl,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className={`w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors ${isRtl ? 'text-right flex-row-reverse' : ''}`}
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span>{title}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div className={`px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-50 ${isRtl ? 'text-right' : 'text-left'}`}>
          {title}
        </div>
      )}
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

export const SparePartsFilterEnhanced: React.FC<SparePartsFilterEnhancedProps> = ({
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
  const tCommon = useTranslations('common');
  const tSP = useTranslations('postAd.spareParts');
  const rtl = isRTL(locale);

  const [openSections, setOpenSections] = useState({
    general: true,
    compatibility: true,
    specifications: true,
    advanced: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const setFilter = (updates: Partial<SparePartsFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const spareModels = filters.make ? SPARE_MAKE_MODELS[filters.make] || [] : [];
  const isVehicleSpare = VEHICLE_SPARE_SUBCATEGORIES.includes(filters.subcategory as SparePartsSubcategory);
  const isElectronicsSpare = filters.subcategory === 'electronics-parts';
  const isMachinerySpare = filters.subcategory === 'machinery-parts';

  // Generate years for dropdown (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const getSpareLabel = (key: string, fallback: string) => {
    // Try direct key first (e.g., condition, make, model, subcategory)
    const directKey = key as Parameters<typeof tSP>[0];
    if (tSP.has(directKey)) return tSP(directKey);
    // Try specFields sub-key (e.g., part_name, weight, voltage, etc.)
    const specKey = `specFields.${key}` as Parameters<typeof tSP>[0];
    if (tSP.has(specKey)) return tSP(specKey);
    return fallback;
  };

  const getSpareOptionLabel = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const key = `optionLabels.${normalized}` as Parameters<typeof tSP>[0];
    return tSP.has(key) ? tSP(key) : value;
  };

  // Convert string arrays to options for MultiSelectTags
  const partTypeOptions = SPARE_PART_TYPE_OPTIONS.map(value => ({ value, label: getSpareOptionLabel(value) }));
  const includedComponentOptions = SPARE_INCLUDED_COMPONENT_OPTIONS.map(value => ({ value, label: getSpareOptionLabel(value) }));

  // Weight range handlers
  const handleWeightMinChange = (value: string) => {
    setFilter({ weight_min: value });
  };

  const handleWeightMaxChange = (value: string) => {
    setFilter({ weight_max: value });
  };

  return (
    <div className="space-y-4">
      {/* Result count preview */}
      {resultCount !== undefined && (
        <div className={`p-3 bg-primary-50 border border-primary-200 rounded-lg ${rtl ? 'text-right' : 'text-left'}`}>
          <p className="text-sm font-medium text-primary-800">
            {t('showingResults', { count: resultCount })}
          </p>
          <p className="text-xs text-primary-600 mt-1">
            {t('adjustFilters')}
          </p>
        </div>
      )}

      {/* General Filters */}
      <FilterSection
        title={t('generalFilters')}
        isOpen={openSections.general}
        onToggle={() => toggleSection('general')}
        isRtl={rtl}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('subcategory')}
            </label>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilter({ 
                ...EMPTY_SPARE_PARTS_FILTERS, 
                subcategory: e.target.value as SparePartsSubcategory | '' 
              })}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
              aria-label={t('subcategory')}
            >
              <option value="">{tCommon('all')}</option>
              {SPARE_PARTS_SUBCATEGORIES.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {getSpareLabel(`subcategories.${sub.value}`, sub.label)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('keywords')}
            </label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilter({ keyword: e.target.value })}
              placeholder={t('keywords')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
              aria-label={t('keywords')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {getSpareLabel('condition', 'Condition')}
            </label>
            <select
              value={filters.condition}
              onChange={(e) => setFilter({ condition: e.target.value as SparePartsFilterState['condition'] })}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
              aria-label={getSpareLabel('condition', 'Condition')}
            >
              <option value="">{tCommon('all')}</option>
              <option value="New">{getSpareOptionLabel('New')}</option>
              <option value="Used">{getSpareOptionLabel('Used')}</option>
              <option value="Refurbished">{getSpareOptionLabel('Refurbished')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {getSpareLabel('seller_type', 'Seller Type')}
            </label>
            <select
              value={filters.seller_type}
              onChange={(e) => setFilter({ seller_type: e.target.value as SparePartsFilterState['seller_type'] })}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
              aria-label={getSpareLabel('seller_type', 'Seller Type')}
            >
              <option value="">{tCommon('all')}</option>
              <option value="Individual">{t('individual')}</option>
              <option value="Dealer">{t('dealer')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('postedDate')}
            </label>
            <select
              value={filters.postedDate}
              onChange={(e) => setFilter({ postedDate: e.target.value as SparePartsFilterState['postedDate'] })}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
              aria-label={t('postedDate')}
            >
              <option value="">{t('anyTime')}</option>
              <option value="today">{t('today')}</option>
              <option value="last7">{t('last7Days')}</option>
              <option value="last30">{t('last30Days')}</option>
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Compatibility Filters */}
      <FilterSection
        title={tSP('compatibility')}
        isOpen={openSections.compatibility}
        onToggle={() => toggleSection('compatibility')}
        isRtl={rtl}
      >
        <div className="space-y-4">
          {isVehicleSpare && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('make', 'Make')}
                  </label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilter({ make: e.target.value, model: '' })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('make', 'Make')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {Object.keys(SPARE_MAKE_MODELS).map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('model', 'Model')}
                  </label>
                  <select
                    value={filters.model}
                    onChange={(e) => setFilter({ model: e.target.value })}
                    disabled={!filters.make}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('model', 'Model')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {spareModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('year_from', 'Year From')}
                  </label>
                  <select
                    value={filters.year_from}
                    onChange={(e) => setFilter({ year_from: e.target.value })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('year_from', 'Year From')}
                  >
                    <option value="">{t('any')}</option>
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('year_to', 'Year To')}
                  </label>
                  <select
                    value={filters.year_to}
                    onChange={(e) => setFilter({ year_to: e.target.value })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('year_to', 'Year To')}
                  >
                    <option value="">{t('any')}</option>
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('engine_type', 'Engine Type')}
                  </label>
                  <select
                    value={filters.engine_type}
                    onChange={(e) => setFilter({ engine_type: e.target.value as SparePartsFilterState['engine_type'] })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('engine_type', 'Engine Type')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_ENGINE_TYPE_OPTIONS.map(option => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('transmission', 'Transmission')}
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilter({ transmission: e.target.value as SparePartsFilterState['transmission'] })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('transmission', 'Transmission')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_TRANSMISSION_OPTIONS.map(option => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {(isElectronicsSpare || isMachinerySpare) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('compatible_brand', 'Compatible Brand')}
                </label>
                <input
                  type="text"
                  value={filters.compatible_brand}
                  onChange={(e) => setFilter({ compatible_brand: e.target.value })}
                  placeholder={getSpareLabel('compatible_brand', 'Compatible Brand')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('compatible_brand', 'Compatible Brand')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('compatible_model', 'Compatible Model')}
                </label>
                <input
                  type="text"
                  value={filters.compatible_model}
                  onChange={(e) => setFilter({ compatible_model: e.target.value })}
                  placeholder={getSpareLabel('compatible_model', 'Compatible Model')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('compatible_model', 'Compatible Model')}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('part_name', 'Part Name')}
              </label>
              <input
                type="text"
                value={filters.part_name}
                onChange={(e) => setFilter({ part_name: e.target.value })}
                placeholder={getSpareLabel('part_name', 'Part Name')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('part_name', 'Part Name')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('part_number', 'Part Number')}
              </label>
              <input
                type="text"
                value={filters.part_number}
                onChange={(e) => setFilter({ part_number: e.target.value })}
                placeholder={getSpareLabel('part_number', 'Part Number')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('part_number', 'Part Number')}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Specifications Filters */}
      <FilterSection
        title={tSP('specifications')}
        isOpen={openSections.specifications}
        onToggle={() => toggleSection('specifications')}
        isRtl={rtl}
      >
        <div className="space-y-4">
          <MultiSelectTags
            label={getSpareLabel('part_type', 'Part Type')}
            options={partTypeOptions}
            selected={filters.part_type}
            onChange={(selected) => setFilter({ part_type: selected })}
            isRtl={rtl}
            placeholder={t('selectPartTypes')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('oem_aftermarket', 'OEM/Aftermarket')}
              </label>
              <select
                value={filters.oem_aftermarket}
                onChange={(e) => setFilter({ oem_aftermarket: e.target.value as SparePartsFilterState['oem_aftermarket'] })}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('oem_aftermarket', 'OEM/Aftermarket')}
              >
                <option value="">{tCommon('all')}</option>
                {SPARE_OEM_OPTIONS.map(option => (
                  <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('material', 'Material')}
              </label>
              <input
                type="text"
                value={filters.material}
                onChange={(e) => setFilter({ material: e.target.value })}
                placeholder={getSpareLabel('material', 'Material')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('material', 'Material')}
              />
            </div>
          </div>

          <RangeSlider
            label={getSpareLabel('weight', 'Weight')}
            min={0}
            max={1000}
            step={1}
            valueMin={filters.weight_min}
            valueMax={filters.weight_max}
            onChangeMin={handleWeightMinChange}
            onChangeMax={handleWeightMaxChange}
            isRtl={rtl}
            unit=" kg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('dimension_length', 'Length')}
              </label>
              <input
                type="number"
                min="0"
                value={filters.dimension_length}
                onChange={(e) => setFilter({ dimension_length: e.target.value })}
                placeholder={getSpareLabel('dimension_length', 'Length')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('dimension_length', 'Length')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('dimension_width', 'Width')}
              </label>
              <input
                type="number"
                min="0"
                value={filters.dimension_width}
                onChange={(e) => setFilter({ dimension_width: e.target.value })}
                placeholder={getSpareLabel('dimension_width', 'Width')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('dimension_width', 'Width')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {getSpareLabel('dimension_height', 'Height')}
              </label>
              <input
                type="number"
                min="0"
                value={filters.dimension_height}
                onChange={(e) => setFilter({ dimension_height: e.target.value })}
                placeholder={getSpareLabel('dimension_height', 'Height')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={getSpareLabel('dimension_height', 'Height')}
              />
            </div>
          </div>

          {isVehicleSpare && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('availability', 'Availability')}
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilter({ availability: e.target.value as SparePartsFilterState['availability'] })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('availability', 'Availability')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_AVAILABILITY_OPTIONS.map(option => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {getSpareLabel('placement', 'Placement')}
                  </label>
                  <select
                    value={filters.placement}
                    onChange={(e) => setFilter({ placement: e.target.value as SparePartsFilterState['placement'] })}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                    aria-label={getSpareLabel('placement', 'Placement')}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPARE_PLACEMENT_OPTIONS.map(option => (
                      <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('mileage', 'Mileage')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.mileage}
                  onChange={(e) => setFilter({ mileage: e.target.value })}
                  placeholder={getSpareLabel('mileage', 'Mileage')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('mileage', 'Mileage')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('installation_type', 'Installation Type')}
                </label>
                <select
                  value={filters.installation_type}
                  onChange={(e) => setFilter({ installation_type: e.target.value as SparePartsFilterState['installation_type'] })}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('installation_type', 'Installation Type')}
                >
                  <option value="">{tCommon('all')}</option>
                  {SPARE_INSTALLATION_OPTIONS.map(option => (
                    <option key={option} value={option}>{getSpareOptionLabel(option)}</option>
                  ))}
                </select>
              </div>

              <MultiSelectTags
                label={getSpareLabel('included_components', 'Included Components')}
                options={includedComponentOptions}
                selected={filters.included_components}
                onChange={(selected) => setFilter({ included_components: selected })}
                isRtl={rtl}
                placeholder={t('selectIncludedComponents')}
              />
            </>
          )}

          {isElectronicsSpare && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('voltage', 'Voltage')}
                </label>
                <input
                  type="text"
                  value={filters.voltage}
                  onChange={(e) => setFilter({ voltage: e.target.value })}
                  placeholder={getSpareLabel('voltage', 'Voltage')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('voltage', 'Voltage')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('power_rating', 'Power Rating')}
                </label>
                <input
                  type="text"
                  value={filters.power_rating}
                  onChange={(e) => setFilter({ power_rating: e.target.value })}
                  placeholder={getSpareLabel('power_rating', 'Power Rating')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('power_rating', 'Power Rating')}
                />
              </div>
            </div>
          )}

          {isMachinerySpare && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('load_capacity', 'Load Capacity')}
                </label>
                <input
                  type="text"
                  value={filters.load_capacity}
                  onChange={(e) => setFilter({ load_capacity: e.target.value })}
                  placeholder={getSpareLabel('load_capacity', 'Load Capacity')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('load_capacity', 'Load Capacity')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {getSpareLabel('operating_pressure', 'Operating Pressure')}
                </label>
                <input
                  type="text"
                  value={filters.operating_pressure}
                  onChange={(e) => setFilter({ operating_pressure: e.target.value })}
                  placeholder={getSpareLabel('operating_pressure', 'Operating Pressure')}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                  aria-label={getSpareLabel('operating_pressure', 'Operating Pressure')}
                />
              </div>
            </div>
          )}
        </div>
      </FilterSection>

      {/* Price Range */}
      {(priceMin !== undefined || priceMax !== undefined) && (
        <FilterSection
          title={t('priceRange')}
          isOpen={true}
          onToggle={() => {}}
          isRtl={rtl}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('minPrice')}
              </label>
              <input
                type="number"
                min="0"
                value={priceMin ?? ''}
                onChange={(e) => onPriceMinChange?.(e.target.value)}
                placeholder={t('minPrice')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={t('minPrice')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('maxPrice')}
              </label>
              <input
                type="number"
                min="0"
                value={priceMax ?? ''}
                onChange={(e) => onPriceMaxChange?.(e.target.value)}
                placeholder={t('maxPrice')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${rtl ? 'text-right' : 'text-left'}`}
                aria-label={t('maxPrice')}
              />
            </div>
          </div>
        </FilterSection>
      )}

      {/* Action Buttons */}
      <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => {
            onFiltersChange(EMPTY_SPARE_PARTS_FILTERS);
            onClear?.();
          }}
          className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          aria-label={t('clearFilters')}
        >
          {t('clearFilters')}
        </button>
        <button
          type="button"
          onClick={() => onSearch?.()}
          className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
          aria-label={t('applyFilters')}
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};
