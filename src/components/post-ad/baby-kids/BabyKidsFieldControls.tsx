'use client';

import React from 'react';

// ─── InputField ───────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
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
}) => (
  <div>
    <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : ''}`}>
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border ${error ? 'border-red-400' : 'border-slate-300'} bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
    />
    {error && <p className={`text-xs text-red-500 mt-1 ${rtl ? 'text-right' : ''}`}>{error}</p>}
  </div>
);

// ─── SelectField ──────────────────────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required,
  rtl,
  value,
  onChange,
  options,
  placeholder,
  error,
}) => (
  <div>
    <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : ''}`}>
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border ${error ? 'border-red-400' : 'border-slate-300'} bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const optValue = typeof option === 'string' ? option : option.value;
          const optLabel = typeof option === 'string' ? option : option.label;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${rtl ? 'left-0 right-auto' : ''}`}>
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && <p className={`text-xs text-red-500 mt-1 ${rtl ? 'text-right' : ''}`}>{error}</p>}
  </div>
);

// ─── ToggleField ──────────────────────────────────────────────────────────────
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
}) => (
  <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
    <div className={rtl ? 'text-right' : ''}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? (rtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-1'}`}
      />
    </button>
  </div>
);
