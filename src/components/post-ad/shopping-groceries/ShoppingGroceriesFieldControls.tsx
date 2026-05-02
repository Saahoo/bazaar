'use client';

import React from 'react';

interface InputFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required,
  rtl,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}) => {
  return (
    <div>
      <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border ${error ? 'border-red-500' : 'border-slate-300'} bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
        placeholder={placeholder}
        dir={rtl ? 'rtl' : 'ltr'}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

type Option = string | { value: string; label: string };

interface SelectFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
}

const normalizeOption = (option: Option) => (typeof option === 'string' ? { value: option, label: option } : option);

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required,
  rtl,
  value,
  onChange,
  options,
  placeholder,
  error,
}) => {
  return (
    <div>
      <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border ${error ? 'border-red-500' : 'border-slate-300'} bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
        dir={rtl ? 'rtl' : 'ltr'}
        aria-label={label}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const normalized = normalizeOption(option);
          return (
            <option key={normalized.value} value={normalized.value}>
              {normalized.label}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface UnitFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  unitValue: string;
  onChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  unitOptions: Option[];
  placeholder?: string;
  error?: string;
}

export const UnitField: React.FC<UnitFieldProps> = ({
  label,
  required,
  rtl,
  value,
  unitValue,
  onChange,
  onUnitChange,
  unitOptions,
  placeholder,
  error,
}) => {
  return (
    <div>
      <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 rounded-xl border ${error ? 'border-red-500' : 'border-slate-300'} bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`}
          placeholder={placeholder}
          dir={rtl ? 'rtl' : 'ltr'}
        />
        <select
          value={unitValue}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-32 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          dir={rtl ? 'rtl' : 'ltr'}
        >
          {unitOptions.map((option) => {
            const normalized = normalizeOption(option);
            return (
              <option key={normalized.value} value={normalized.value}>
                {normalized.label}
              </option>
            );
          })}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface ToggleFieldProps {
  label: string;
  rtl: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  rtl,
  checked,
  onChange,
  description,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className={rtl ? 'text-right' : 'text-left'}>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-slate-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};
