'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  ServicesSubcategory,
  ServiceType,
  PricingType,
  SERVICES_SUBCATEGORIES,
  getServicesSpecsConfig,
  ServicesSpecField,
} from '@/lib/constants/services-wizard';
import { CURRENCIES } from '@/lib/constants/jobs-wizard';
import { ServicesFilterState, EMPTY_SERVICES_FILTERS } from './FilterSidebar';

// ─── Props ───────────────────────────────────────────────────────────────────
interface ServicesFilterEnhancedProps {
  locale: Locale;
  filters: ServicesFilterState;
  onFiltersChange: (filters: ServicesFilterState) => void;
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

// ─── Helper: MultiSelectTags ─────────────────────────────────────────────────
interface MultiSelectTagsProps {
  label: string;
  selected: string[];
  onToggle: (value: string) => void;
  options: { value: string; label: string }[];
  isRtl: boolean;
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({ label, selected, onToggle, options, isRtl }) => {
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(
    () =>
      search.trim()
        ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
        : options,
    [search, options],
  );

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium text-slate-700 ${isRtl ? 'text-right' : 'text-left'}`}>
        {label}
      </label>

      {selected.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {selected.map((value) => {
            const opt = options.find((o) => o.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200"
              >
                {opt?.label || value}
                <button
                  type="button"
                  onClick={() => onToggle(value)}
                  className="hover:text-primary-900 transition-colors"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {options.length > 5 && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="..."
          className={`w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs
            focus:outline-none focus:ring-1 focus:ring-primary-500
            ${isRtl ? 'text-right' : 'text-left'}`}
        />
      )}

      <div className="flex flex-wrap gap-1.5">
        {filteredOptions.map((option) => {
          const isActive = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Icon Components ─────────────────────────────────────────────────────────
const GeneralIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ServiceDetailsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PricingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AvailabilityIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SpecFieldsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const ServicesFilterEnhanced: React.FC<ServicesFilterEnhancedProps> = ({
  locale,
  filters,
  onFiltersChange,
  onClear,
  onSearch,
  resultCount,
}) => {
  const t = useTranslations('search');
  const tSV = useTranslations('postAd');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const [openSections, setOpenSections] = useState({
    general: true,
    serviceDetails: true,
    pricing: false,
    location: false,
    availability: false,
    subcategorySpecs: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setFilter = (updates: Partial<ServicesFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  // ─── Translation helpers ─────────────────────────────────────────────────
  const getServicesLabel = (key: string, fallback: string): string => {
    try {
      const translated = tSV(`services.${key}` as Parameters<typeof tSV>[0]);
      if (translated && !translated.includes('services.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return fallback;
  };

  const getServicesOptionLabel = (key: string): string => {
    try {
      const translated = tSV(`services.${key}` as Parameters<typeof tSV>[0]);
      if (translated && !translated.includes('services.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return key;
  };

  /**
   * Resolve a labelKey from the wizard config.
   * Handles both `services.*` keys (via tSV / postAd namespace)
   * and `common.*` keys (via tCommon / common namespace).
   */
  const resolveLabelKey = (labelKey: string, fallback: string): string => {
    try {
      if (labelKey.startsWith('common.')) {
        const commonKey = labelKey.replace('common.', '') as Parameters<typeof tCommon>[0];
        const translated = tCommon(commonKey);
        if (translated && translated !== commonKey) return translated;
      } else if (labelKey.startsWith('services.')) {
        const translated = tSV(labelKey as Parameters<typeof tSV>[0]);
        if (translated && !translated.includes('services.')) return translated;
      }
    } catch {
      // fall through
    }
    return fallback;
  };

  // ─── Build option arrays with translated labels ──────────────────────────
  const subcategoryOptions = useMemo(
    () =>
      SERVICES_SUBCATEGORIES.map((sub) => ({
        value: sub.value,
        label: resolveLabelKey(sub.labelKey, sub.value),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const serviceTypeOptions = useMemo(
    () => [
      { value: 'on-site', label: getServicesOptionLabel('serviceTypeOptions.onSite') },
      { value: 'at-shop', label: getServicesOptionLabel('serviceTypeOptions.atShop') },
      { value: 'online-remote', label: getServicesOptionLabel('serviceTypeOptions.onlineRemote') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const pricingTypeOptions = useMemo(
    () => [
      { value: 'fixed-price', label: getServicesOptionLabel('pricingTypeOptions.fixedPrice') },
      { value: 'hourly-rate', label: getServicesOptionLabel('pricingTypeOptions.hourlyRate') },
      { value: 'daily-rate', label: getServicesOptionLabel('pricingTypeOptions.dailyRate') },
      { value: 'custom-quote', label: getServicesOptionLabel('pricingTypeOptions.customQuote') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const currencyOptions = useMemo(
    () => CURRENCIES.map((c) => ({ value: c, label: c })),
    [],
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

  // ─── Subcategory spec fields ─────────────────────────────────────────────
  const specFields = useMemo(
    () => (filters.subcategory ? getServicesSpecsConfig(filters.subcategory) : []),
    [filters.subcategory],
  );

  // ─── Render a single spec field ──────────────────────────────────────────
  const renderSpecField = (field: ServicesSpecField) => {
    const key = field.key as keyof ServicesFilterState;
    const label = resolveLabelKey(field.labelKey, field.key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

    if (field.type === 'multiselect') {
      const selected = (filters[key] as string[]) || [];
      return (
        <MultiSelectTags
          key={field.key}
          label={label}
          selected={selected}
          onToggle={(v) => {
            const current = (filters[key] as string[]) || [];
            const next = current.includes(v)
              ? current.filter((x) => x !== v)
              : [...current, v];
            setFilter({ [key]: next } as Partial<ServicesFilterState>);
          }}
          options={(field.options || []).map((opt) => ({
            value: opt.value,
            label: resolveLabelKey(opt.labelKey, opt.value),
          }))}
          isRtl={rtl}
        />
      );
    }

    if (field.type === 'toggle') {
      const value = String(filters[key] || '');
      return (
        <ToggleField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<ServicesFilterState>)}
          isRtl={rtl}
          options={yesNoToggleOptions}
        />
      );
    }

    if (field.type === 'select') {
      const value = String(filters[key] || '');
      return (
        <SelectField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<ServicesFilterState>)}
          options={(field.options || []).map((opt) => ({
            value: opt.value,
            label: resolveLabelKey(opt.labelKey, opt.value),
          }))}
          isRtl={rtl}
          placeholder={tCommon('all')}
        />
      );
    }

    if (field.type === 'number') {
      const value = String(filters[key] || '');
      return (
        <NumberField
          key={field.key}
          label={label}
          value={value}
          onChange={(v) => setFilter({ [key]: v } as Partial<ServicesFilterState>)}
          isRtl={rtl}
          placeholder={label}
          min="0"
        />
      );
    }

    // text / textarea
    const value = String(filters[key] || '');
    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-1.5">
          <label className={`block text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {label}
          </label>
          <textarea
            value={value}
            onChange={(e) => setFilter({ [key]: e.target.value } as Partial<ServicesFilterState>)}
            placeholder={label}
            rows={3}
            className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${rtl ? 'text-right' : 'text-left'}`}
          />
        </div>
      );
    }

    return (
      <TextField
        key={field.key}
        label={label}
        value={value}
        onChange={(v) => setFilter({ [key]: v } as Partial<ServicesFilterState>)}
        isRtl={rtl}
        placeholder={label}
      />
    );
  };

  // ─── Active filter count ────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.keywords) count++;
    if (filters.postedDate) count++;
    if (filters.serviceType) count++;
    if (filters.pricingType) count++;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.currency) count++;
    if (filters.city) count++;
    if (filters.emergencyAvailable) count++;
    // Count active spec fields
    specFields.forEach((field) => {
      const key = field.key as keyof ServicesFilterState;
      const val = filters[key];
      if (Array.isArray(val) && val.length > 0) count++;
      else if (typeof val === 'string' && val !== '') count++;
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
            onChange={(v) => setFilter({ ...EMPTY_SERVICES_FILTERS, subcategory: v as ServicesSubcategory | '' })}
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
            label={t('postedDate')}
            value={filters.postedDate}
            onChange={(v) => setFilter({ postedDate: v as '' | 'today' | 'last7' | 'last30' })}
            options={postedDateOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
        </div>
      </FilterSection>

      {/* ── Section 2: Service Details ───────────────────────────────────── */}
      <FilterSection
        title={getServicesLabel('stepDetails', 'Service Details')}
        icon={<ServiceDetailsIcon />}
        isOpen={openSections.serviceDetails}
        onToggle={() => toggleSection('serviceDetails')}
        isRtl={rtl}
        accentColor="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label={getServicesLabel('serviceType', 'Service Delivery')}
            value={filters.serviceType}
            onChange={(v) => setFilter({ serviceType: v as ServiceType | '' })}
            options={serviceTypeOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <SelectField
            label={getServicesLabel('pricingType', 'Pricing Type')}
            value={filters.pricingType}
            onChange={(v) => setFilter({ pricingType: v as PricingType | '' })}
            options={pricingTypeOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
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
        <div className="space-y-3">
          <SelectField
            label={t('currency')}
            value={filters.currency}
            onChange={(v) => setFilter({ currency: v })}
            options={currencyOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label={t('minPrice')}
              value={filters.priceMin}
              onChange={(v) => setFilter({ priceMin: v })}
              isRtl={rtl}
              placeholder={t('min')}
              min="0"
            />
            <NumberField
              label={t('maxPrice')}
              value={filters.priceMax}
              onChange={(v) => setFilter({ priceMax: v })}
              isRtl={rtl}
              placeholder={t('max')}
              min="0"
            />
          </div>
        </div>
      </FilterSection>

      {/* ── Section 4: Location ──────────────────────────────────────────── */}
      <FilterSection
        title={t('location')}
        icon={<LocationIcon />}
        isOpen={openSections.location}
        onToggle={() => toggleSection('location')}
        isRtl={rtl}
        accentColor="amber"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label={getServicesLabel('city', 'City')}
            value={filters.city}
            onChange={(v) => setFilter({ city: v })}
            isRtl={rtl}
            placeholder={getServicesLabel('selectCity', 'Select city')}
          />
        </div>
      </FilterSection>

      {/* ── Section 5: Availability ──────────────────────────────────────── */}
      <FilterSection
        title={getServicesLabel('daysAvailable', 'Availability')}
        icon={<AvailabilityIcon />}
        isOpen={openSections.availability}
        onToggle={() => toggleSection('availability')}
        isRtl={rtl}
        accentColor="rose"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleField
            label={getServicesLabel('emergencyService', 'Emergency Service')}
            value={filters.emergencyAvailable}
            onChange={(v) => setFilter({ emergencyAvailable: v as '' | 'yes' | 'no' })}
            isRtl={rtl}
            options={yesNoToggleOptions}
          />
        </div>
      </FilterSection>

      {/* ── Section 6: Subcategory-specific fields ───────────────────────── */}
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
            setFilter(EMPTY_SERVICES_FILTERS);
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

export default ServicesFilterEnhanced;
