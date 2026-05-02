'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  AnimalsLivestockSubcategory,
  ANIMALS_SUBCATEGORIES,
  ANIMALS_SPEC_CONFIG,
  AGE_UNIT_OPTIONS,
  AnimalsSpecField,
} from '@/lib/constants/animals-livestock-wizard';
import { AnimalsLivestockFilterState, EMPTY_ANIMALS_LIVESTOCK_FILTERS } from './FilterSidebar';

// ─── Props ───────────────────────────────────────────────────────────────────
interface AnimalsFilterEnhancedProps {
  locale: Locale;
  filters: AnimalsLivestockFilterState;
  onFiltersChange: (filters: AnimalsLivestockFilterState) => void;
  onClear?: () => void;
  onSearch?: () => void;
  resultCount?: number;
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
  const accentMap: Record<string, string> = {
    primary: 'from-primary-500 to-primary-600',
    amber: 'from-amber-500 to-amber-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    slate: 'from-slate-500 to-slate-600',
    blue: 'from-blue-500 to-blue-600',
    rose: 'from-rose-500 to-rose-600',
    cyan: 'from-cyan-500 to-cyan-600',
    teal: 'from-teal-500 to-teal-600',
  };

  const gradient = accentMap[accentColor] || accentMap.primary;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${gradient} text-white hover:opacity-95 transition-opacity ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className={`flex-1 text-sm font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
            {title}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      ) : (
        <div
          className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${gradient} text-white ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className={`flex-1 text-sm font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>
            {title}
          </span>
        </div>
      )}
      {isOpen && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Helper: SelectField ─────────────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isRtl: boolean;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, isRtl, placeholder }) => (
  <div className="space-y-1.5">
    <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm bg-white
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
        ${isRtl ? 'text-right' : 'text-left'}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// ─── Helper: ToggleField ─────────────────────────────────────────────────────
interface ToggleFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  options?: { value: string; label: string }[];
}

const ToggleField: React.FC<ToggleFieldProps> = ({ label, value, onChange, isRtl, options }) => {
  const toggleOptions = options || [
    { value: '', label: 'All' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  return (
    <div className="space-y-1.5">
      <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
        {label}
      </label>
      <div className={`flex gap-1 rounded-lg border border-slate-300 p-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
        {toggleOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              value === opt.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
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
  min?: string;
  max?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ label, value, onChange, isRtl, placeholder, min, max }) => (
  <div className="space-y-1.5">
    <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
        ${isRtl ? 'text-right' : 'text-left'}`}
    />
  </div>
);

// ─── Helper: TextField ───────────────────────────────────────────────────────
interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, isRtl, placeholder }) => (
  <div className="space-y-1.5">
    <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
        ${isRtl ? 'text-right' : 'text-left'}`}
    />
  </div>
);

// ─── Helper: UnitField (number input + unit select) ──────────────────────────
interface UnitFieldProps {
  label: string;
  value: string;
  unitValue: string;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  unitOptions: { value: string; label: string }[];
  isRtl: boolean;
  placeholder?: string;
}

const UnitField: React.FC<UnitFieldProps> = ({
  label,
  value,
  unitValue,
  onValueChange,
  onUnitChange,
  unitOptions,
  isRtl,
  placeholder,
}) => (
  <div className="space-y-1.5">
    <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </label>
    <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        min="0"
        className={`flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${isRtl ? 'text-right' : 'text-left'}`}
      />
      <select
        value={unitValue}
        onChange={(e) => onUnitChange(e.target.value)}
        aria-label={label}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {unitOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// ─── Icon Components ─────────────────────────────────────────────────────────
const GeneralIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const AnimalDetailsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const PricingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpecFieldsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const AnimalsFilterEnhanced: React.FC<AnimalsFilterEnhancedProps> = ({
  locale,
  filters,
  onFiltersChange,
  onClear,
  onSearch,
  resultCount,
}) => {
  const t = useTranslations('search');
  const tAnimals = useTranslations('postAd');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const [openSections, setOpenSections] = useState({
    general: true,
    animalDetails: true,
    pricing: false,
    subcategorySpecs: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setFilter = (updates: Partial<AnimalsLivestockFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  // ─── Translation helpers ─────────────────────────────────────────────────
  const getAnimalsFieldLabel = (key: string, fallback: string): string => {
    try {
      const translated = tAnimals(`animals.fields.${key}` as Parameters<typeof tAnimals>[0]);
      if (translated && !translated.includes('animals.fields.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return fallback;
  };

  const getAnimalsOptionLabel = (key: string): string => {
    try {
      const translated = tAnimals(`animals.optionLabels.${key}` as Parameters<typeof tAnimals>[0]);
      if (translated && !translated.includes('animals.optionLabels.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return key;
  };

  const getAnimalsSubcategoryLabel = (key: string): string => {
    try {
      const translated = tAnimals(`animals.subcategories.${key}` as Parameters<typeof tAnimals>[0]);
      if (translated && !translated.includes('animals.subcategories.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return key;
  };

  // ─── Build option arrays with translated labels ──────────────────────────
  const subcategoryOptions = useMemo(
    () =>
      ANIMALS_SUBCATEGORIES.map((sub) => ({
        value: sub.value,
        label: getAnimalsSubcategoryLabel(sub.value),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const sellerTypeOptions = useMemo(
    () => [
      { value: 'Individual', label: t('individual') },
      { value: 'Dealer', label: t('dealer') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const postedDateOptions = useMemo(
    () => [
      { value: 'today', label: t('today') },
      { value: 'last7', label: t('last7Days') },
      { value: 'last30', label: t('last30Days') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const yesNoToggleOptions = useMemo(
    () => [
      { value: '', label: tCommon('all') },
      { value: 'yes', label: tCommon('yes') },
      { value: 'no', label: tCommon('no') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const ageUnitOptions = useMemo(
    () =>
      AGE_UNIT_OPTIONS.map((unit) => ({
        value: unit,
        label: getAnimalsOptionLabel(unit),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // ─── Subcategory spec fields (exclude common fields already rendered above) ─
  const ANIMALS_COMMON_FIELD_KEYS = new Set([
    'breed', 'quantity', 'age', 'healthStatus', 'gender', 'color', 'weight', 'price', 'priceType',
  ]);

  const specFields = useMemo(
    () =>
      filters.subcategory
        ? (ANIMALS_SPEC_CONFIG[filters.subcategory] || []).filter(
            (field) => !ANIMALS_COMMON_FIELD_KEYS.has(field.key),
          )
        : [],
    [filters.subcategory],
  );

  // ─── Render a single spec field ──────────────────────────────────────────
  const renderSpecField = (field: AnimalsSpecField) => {
    const key = field.key as keyof AnimalsLivestockFilterState;
    const label = getAnimalsFieldLabel(field.key, field.label);

    // Handle toggle fields (yes/no)
    if (field.type === 'toggle') {
      const value = String(filters[key] || '');
      return (
        <ToggleField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<AnimalsLivestockFilterState>)}
          isRtl={rtl}
          options={yesNoToggleOptions}
        />
      );
    }

    // Handle unit fields (combined input + unit select)
    if (field.type === 'unit') {
      const unitKey = `${key}Unit` as keyof AnimalsLivestockFilterState;
      const value = String(filters[key] || '');
      const unitValue = String(filters[unitKey] || '');
      const unitOpts = field.unitOptions
        ? field.unitOptions.map((u) => ({ value: u, label: getAnimalsOptionLabel(u) }))
        : ageUnitOptions;
      return (
        <UnitField
          key={field.key}
          label={label}
          value={value}
          unitValue={unitValue}
          onValueChange={(v) => setFilter({ [key]: v } as Partial<AnimalsLivestockFilterState>)}
          onUnitChange={(v) => setFilter({ [unitKey]: v } as Partial<AnimalsLivestockFilterState>)}
          unitOptions={unitOpts}
          isRtl={rtl}
          placeholder={label}
        />
      );
    }

    // Handle select fields
    if (field.type === 'select') {
      const value = String(filters[key] || '');
      return (
        <SelectField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<AnimalsLivestockFilterState>)}
          options={(field.options || []).map((opt) => ({
            value: opt,
            label: getAnimalsOptionLabel(opt),
          }))}
          isRtl={rtl}
          placeholder={tCommon('all')}
        />
      );
    }

    // Handle number fields
    if (field.type === 'number') {
      const value = String(filters[key] || '');
      return (
        <NumberField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<AnimalsLivestockFilterState>)}
          isRtl={rtl}
          placeholder={label}
          min="0"
        />
      );
    }

    // Default: text field
    const value = String(filters[key] || '');
    return (
      <TextField
        key={field.key}
        label={label}
        value={value}
        onChange={(v) => setFilter({ [key]: v } as Partial<AnimalsLivestockFilterState>)}
        isRtl={rtl}
        placeholder={field.placeholder || label}
      />
    );
  };

  // ─── Active filter count ────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.keywords) count++;
    if (filters.sellerType) count++;
    if (filters.postedDate) count++;
    if (filters.breed) count++;
    if (filters.quantity) count++;
    if (filters.age) count++;
    if (filters.healthStatus) count++;
    if (filters.gender) count++;
    if (filters.color) count++;
    if (filters.weight) count++;
    if (filters.price) count++;
    if (filters.priceType) count++;
    // Count subcategory-specific spec fields
    specFields.forEach((field) => {
      const key = field.key as keyof AnimalsLivestockFilterState;
      const val = filters[key];
      if (typeof val === 'string' && val !== '') count++;
    });
    return count;
  }, [filters, specFields]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Header with active count ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-sm font-bold text-slate-800">{t('generalFilters')}</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-primary-600 text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {resultCount !== undefined && (
          <span className="text-xs text-slate-500">
            {t('showingResults', { count: resultCount })}
          </span>
        )}
      </div>

      {/* ── Section 1: General ───────────────────────────────────────────── */}
      <FilterSection
        title={t('generalFilters')}
        icon={<GeneralIcon />}
        isOpen={openSections.general}
        onToggle={() => toggleSection('general')}
        isRtl={rtl}
        accentColor="primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label={t('subcategory')}
            value={filters.subcategory}
            onChange={(v) => setFilter({ ...EMPTY_ANIMALS_LIVESTOCK_FILTERS, subcategory: v as AnimalsLivestockSubcategory | '' })}
            options={subcategoryOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <TextField
            label={t('keywords')}
            value={filters.keywords}
            onChange={(v) => setFilter({ keywords: v })}
            isRtl={rtl}
            placeholder={t('keywords')}
          />
          <SelectField
            label={t('sellerType')}
            value={filters.sellerType}
            onChange={(v) => setFilter({ sellerType: v as 'Individual' | 'Dealer' | '' })}
            options={sellerTypeOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <SelectField
            label={t('postedDate')}
            value={filters.postedDate}
            onChange={(v) => setFilter({ postedDate: v as '' | 'today' | 'last7' | 'last30' })}
            options={postedDateOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
        </div>
      </FilterSection>

      {/* ── Section 2: Animal Details ────────────────────────────────────── */}
      <FilterSection
        title={getAnimalsFieldLabel('breed', 'Animal Details')}
        icon={<AnimalDetailsIcon />}
        isOpen={openSections.animalDetails}
        onToggle={() => toggleSection('animalDetails')}
        isRtl={rtl}
        accentColor="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label={getAnimalsFieldLabel('breed', 'Breed')}
            value={filters.breed}
            onChange={(v) => setFilter({ breed: v })}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('breed', 'Breed')}
          />
          <NumberField
            label={getAnimalsFieldLabel('quantity', 'Quantity')}
            value={filters.quantity}
            onChange={(v) => setFilter({ quantity: v })}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('quantity', 'Quantity')}
            min="0"
          />
          <UnitField
            label={getAnimalsFieldLabel('age', 'Age')}
            value={filters.age}
            unitValue={filters.ageUnit}
            onValueChange={(v) => setFilter({ age: v })}
            onUnitChange={(v) => setFilter({ ageUnit: v })}
            unitOptions={ageUnitOptions}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('age', 'Age')}
          />
          <SelectField
            label={getAnimalsFieldLabel('healthStatus', 'Health Status')}
            value={filters.healthStatus}
            onChange={(v) => setFilter({ healthStatus: v })}
            options={[
              { value: 'Vaccinated', label: getAnimalsOptionLabel('Vaccinated') },
              { value: 'Dewormed', label: getAnimalsOptionLabel('Dewormed') },
              { value: 'Veterinary Certificate Available', label: getAnimalsOptionLabel('Veterinary Certificate Available') },
              { value: 'Healthy (No Issues)', label: getAnimalsOptionLabel('Healthy (No Issues)') },
              { value: 'Under Treatment', label: getAnimalsOptionLabel('Under Treatment') },
              { value: 'Not Vaccinated', label: getAnimalsOptionLabel('Not Vaccinated') },
            ]}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <SelectField
            label={getAnimalsFieldLabel('gender', 'Gender')}
            value={filters.gender}
            onChange={(v) => setFilter({ gender: v })}
            options={[
              { value: 'Male', label: getAnimalsOptionLabel('Male') },
              { value: 'Female', label: getAnimalsOptionLabel('Female') },
              { value: 'Mixed', label: getAnimalsOptionLabel('Mixed') },
            ]}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <TextField
            label={getAnimalsFieldLabel('color', 'Color/Markings')}
            value={filters.color}
            onChange={(v) => setFilter({ color: v })}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('color', 'Color/Markings')}
          />
          <TextField
            label={getAnimalsFieldLabel('weight', 'Weight (approx)')}
            value={filters.weight}
            onChange={(v) => setFilter({ weight: v })}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('weight', 'Weight (approx)')}
          />
        </div>
      </FilterSection>

      {/* ── Section 3: Pricing ───────────────────────────────────────────── */}
      <FilterSection
        title={t('priceRange')}
        icon={<PricingIcon />}
        isOpen={openSections.pricing}
        onToggle={() => toggleSection('pricing')}
        isRtl={rtl}
        accentColor="emerald"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberField
            label={getAnimalsFieldLabel('price', 'Price')}
            value={filters.price}
            onChange={(v) => setFilter({ price: v })}
            isRtl={rtl}
            placeholder={getAnimalsFieldLabel('price', 'Price')}
            min="0"
          />
          <SelectField
            label={getAnimalsFieldLabel('priceType', 'Price Type')}
            value={filters.priceType}
            onChange={(v) => setFilter({ priceType: v })}
            options={[
              { value: 'Fixed', label: getAnimalsOptionLabel('Fixed') },
              { value: 'Negotiable', label: getAnimalsOptionLabel('Negotiable') },
              { value: 'Per Head', label: getAnimalsOptionLabel('Per Head') },
            ]}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
        </div>
      </FilterSection>

      {/* ── Section 4: Subcategory-specific fields ───────────────────────── */}
      {specFields.length > 0 && (
        <FilterSection
          title={t('subcategoryFilters')}
          icon={<SpecFieldsIcon />}
          isOpen={openSections.subcategorySpecs}
          onToggle={() => toggleSection('subcategorySpecs')}
          isRtl={rtl}
          accentColor="violet"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specFields.map((field) => renderSpecField(field))}
          </div>
        </FilterSection>
      )}

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
      <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => {
            setFilter(EMPTY_ANIMALS_LIVESTOCK_FILTERS);
            onClear?.();
          }}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {t('clearFilters')}
        </button>
        <button
          type="button"
          onClick={() => onSearch?.()}
          className="flex-1 px-4 py-2.5 rounded-lg border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};

export default AnimalsFilterEnhanced;
