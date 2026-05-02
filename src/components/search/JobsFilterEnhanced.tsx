'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import {
  JobSubcategory,
  JOB_SUBCATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  BENEFIT_OPTIONS,
  CURRENCIES,
} from '@/lib/constants/jobs-wizard';
import { JobsFilterState, EMPTY_JOBS_FILTERS } from './FilterSidebar';

// ─── Props ───────────────────────────────────────────────────────────────────
interface JobsFilterEnhancedProps {
  locale: Locale;
  filters: JobsFilterState;
  onFiltersChange: (filters: JobsFilterState) => void;
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
    { value: '', label: isRtl ? 'همه' : 'All' },
    { value: 'yes', label: isRtl ? 'بله' : 'Yes' },
    { value: 'no', label: isRtl ? 'خیر' : 'No' },
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

// ─── Helper: SalaryRangeSlider ───────────────────────────────────────────────
interface SalaryRangeProps {
  minSalary: string;
  maxSalary: string;
  currency: string;
  onMinSalaryChange: (value: string) => void;
  onMaxSalaryChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  isRtl: boolean;
  currencyOptions: { value: string; label: string }[];
  minLabel: string;
  maxLabel: string;
  currencyLabel: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

const SalaryRange: React.FC<SalaryRangeProps> = ({
  minSalary,
  maxSalary,
  currency,
  onMinSalaryChange,
  onMaxSalaryChange,
  onCurrencyChange,
  isRtl,
  currencyOptions,
  minLabel,
  maxLabel,
  currencyLabel,
  minPlaceholder,
  maxPlaceholder,
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 gap-3">
      <SelectField
        label={currencyLabel}
        value={currency}
        onChange={onCurrencyChange}
        options={currencyOptions}
        isRtl={isRtl}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label={minLabel}
          value={minSalary}
          onChange={onMinSalaryChange}
          isRtl={isRtl}
          placeholder={minPlaceholder}
          min="0"
        />
        <NumberField
          label={maxLabel}
          value={maxSalary}
          onChange={onMaxSalaryChange}
          isRtl={isRtl}
          placeholder={maxPlaceholder}
          min="0"
        />
      </div>
    </div>
  </div>
);

// ─── Icon Components ─────────────────────────────────────────────────────────
const GeneralIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const JobDetailsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SalaryIcon = () => (
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

const ApplicationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const JobsFilterEnhanced: React.FC<JobsFilterEnhancedProps> = ({
  locale,
  filters,
  onFiltersChange,
  onClear,
  onSearch,
  resultCount,
}) => {
  const t = useTranslations('search');
  const tJO = useTranslations('postAd');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const [openSections, setOpenSections] = useState({
    general: true,
    jobDetails: true,
    salary: false,
    location: false,
    application: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setFilter = (updates: Partial<JobsFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  // ─── Translation helpers ─────────────────────────────────────────────────
  const getJobsLabel = (key: string, fallback: string): string => {
    try {
      const translated = tJO(`jobs.${key}` as Parameters<typeof tJO>[0]);
      if (translated && !translated.includes('jobs.')) {
        return translated;
      }
    } catch {
      // fall through
    }
    return fallback;
  };

  const getJobsOptionLabel = (key: string): string => {
    try {
      const translated = tJO(`jobs.${key}` as Parameters<typeof tJO>[0]);
      if (translated && !translated.includes('jobs.')) {
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
      JOB_SUBCATEGORIES.map((sub) => ({
        value: sub,
        label: getJobsOptionLabel(`subcategories.${sub}`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const employmentTypeOptions = useMemo(
    () =>
      EMPLOYMENT_TYPES.map((type) => ({
        value: type,
        label: getJobsOptionLabel(`employmentTypes.${type}`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const experienceLevelOptions = useMemo(
    () =>
      EXPERIENCE_LEVELS.map((level) => ({
        value: level.value,
        label: getJobsOptionLabel(`experienceLevels.${level.value}`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const currencyOptions = useMemo(
    () => CURRENCIES.map((c) => ({ value: c, label: c })),
    [],
  );

  const benefitOptions = useMemo(
    () =>
      BENEFIT_OPTIONS.map((b) => ({
        value: b.value,
        label: getJobsOptionLabel(`benefits.${b.labelKey.replace('benefits.', '')}`),
      })),
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

  const applicationMethodOptions = useMemo(
    () => [
      { value: 'email', label: getJobsOptionLabel('applicationMethods.email') },
      { value: 'external-link', label: getJobsOptionLabel('applicationMethods.external-link') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // ─── Remote toggle options (localized) ───────────────────────────────────
  const remoteToggleOptions = useMemo(
    () => [
      { value: '', label: tCommon('all') },
      { value: 'yes', label: tCommon('yes') },
      { value: 'no', label: tCommon('no') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // ─── Benefits toggle handler ─────────────────────────────────────────────
  const handleBenefitToggle = (value: string) => {
    const active = filters.benefits.includes(value);
    const next = active
      ? filters.benefits.filter((b) => b !== value)
      : [...filters.benefits, value];
    setFilter({ benefits: next });
  };

  // ─── Active filter count ────────────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.keywords) count++;
    if (filters.postedDate) count++;
    // sellerType intentionally excluded - irrelevant for jobs
    if (filters.employmentType) count++;
    if (filters.experienceLevel) count++;
    if (filters.minSalary) count++;
    if (filters.maxSalary) count++;
    if (filters.currency) count++;
    if (filters.benefits.length > 0) count++;
    if (filters.isRemote) count++;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.applicationMethod) count++;
    return count;
  }, [filters]);

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
            onChange={(v) => setFilter({ ...EMPTY_JOBS_FILTERS, subcategory: v as JobSubcategory | '' })}
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

      {/* ── Section 2: Job Details ───────────────────────────────────────── */}
      <FilterSection
        title={getJobsLabel('employmentType', 'Job Details')}
        icon={<JobDetailsIcon />}
        isOpen={openSections.jobDetails}
        onToggle={() => toggleSection('jobDetails')}
        isRtl={rtl}
        accentColor="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label={getJobsLabel('employmentType', 'Employment Type')}
            value={filters.employmentType}
            onChange={(v) => setFilter({ employmentType: v })}
            options={employmentTypeOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <SelectField
            label={getJobsLabel('experienceLevel', 'Experience Level')}
            value={filters.experienceLevel}
            onChange={(v) => setFilter({ experienceLevel: v })}
            options={experienceLevelOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
          <ToggleField
            label={getJobsLabel('remotePosition', 'Remote Position')}
            value={filters.isRemote}
            onChange={(v) => setFilter({ isRemote: v as '' | 'yes' | 'no' })}
            isRtl={rtl}
            options={remoteToggleOptions}
          />
          <div className="md:col-span-2">
            <MultiSelectTags
              label={getJobsLabel('benefitsLabel', 'Benefits')}
              selected={filters.benefits}
              onToggle={handleBenefitToggle}
              options={benefitOptions}
              isRtl={rtl}
            />
          </div>
        </div>
      </FilterSection>

      {/* ── Section 3: Salary Range ──────────────────────────────────────── */}
      <FilterSection
        title={getJobsLabel('salarySection', 'Salary Range')}
        icon={<SalaryIcon />}
        isOpen={openSections.salary}
        onToggle={() => toggleSection('salary')}
        isRtl={rtl}
        accentColor="emerald"
      >
        <SalaryRange
          minSalary={filters.minSalary}
          maxSalary={filters.maxSalary}
          currency={filters.currency}
          onMinSalaryChange={(v) => setFilter({ minSalary: v })}
          onMaxSalaryChange={(v) => setFilter({ maxSalary: v })}
          onCurrencyChange={(v) => setFilter({ currency: v })}
          isRtl={rtl}
          currencyOptions={currencyOptions}
          minLabel={getJobsLabel('minSalary', 'Min Salary')}
          maxLabel={getJobsLabel('maxSalary', 'Max Salary')}
          currencyLabel={getJobsLabel('currency', 'Currency')}
          minPlaceholder={getJobsLabel('minSalaryPlaceholder', 'Min')}
          maxPlaceholder={getJobsLabel('maxSalaryPlaceholder', 'Max')}
        />
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
            label={getJobsLabel('country', 'Country')}
            value={filters.country}
            onChange={(v) => setFilter({ country: v })}
            isRtl={rtl}
            placeholder={getJobsLabel('countryPlaceholder', 'Select country')}
          />
          <TextField
            label={getJobsLabel('city', 'City')}
            value={filters.city}
            onChange={(v) => setFilter({ city: v })}
            isRtl={rtl}
            placeholder={getJobsLabel('cityPlaceholder', 'Select city')}
          />
        </div>
      </FilterSection>

      {/* ── Section 5: Application ───────────────────────────────────────── */}
      <FilterSection
        title={getJobsLabel('applicationProcessSection', 'Application')}
        icon={<ApplicationIcon />}
        isOpen={openSections.application}
        onToggle={() => toggleSection('application')}
        isRtl={rtl}
        accentColor="violet"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label={getJobsLabel('applicationMethod', 'Application Method')}
            value={filters.applicationMethod}
            onChange={(v) => setFilter({ applicationMethod: v })}
            options={applicationMethodOptions}
            isRtl={rtl}
            placeholder={tCommon('all')}
          />
        </div>
      </FilterSection>

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
      <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => {
            setFilter(EMPTY_JOBS_FILTERS);
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

export default JobsFilterEnhanced;
