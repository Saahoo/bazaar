'use client';

import React from 'react';
import { isRTL, Locale } from '@/lib/i18n/config';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  locale: Locale;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  locale,
}) => {
  const rtl = isRTL(locale);
  return (
    <div>
      <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | { value: string; label: string })[];
  required?: boolean;
  placeholder?: string;
  locale: Locale;
}

const normalizeOption = (opt: string | { value: string; label: string }): { value: string; label: string } =>
  typeof opt === 'string' ? { value: opt, label: opt } : opt;

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required,
  placeholder,
  locale,
}) => {
  const rtl = isRTL(locale);
  return (
    <div>
      <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, idx) => {
          const { value: optValue, label: optLabel } = normalizeOption(option);
          return (
            <option key={idx} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
};

interface UnitFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  unitValue: string;
  onUnitChange: (value: string) => void;
  unitOptions: (string | { value: string; label: string })[];
  required?: boolean;
  placeholder?: string;
  locale: Locale;
}

export const UnitField: React.FC<UnitFieldProps> = ({
  label,
  value,
  onChange,
  unitValue,
  onUnitChange,
  unitOptions,
  required,
  placeholder,
  locale,
}) => {
  const rtl = isRTL(locale);
  return (
    <div>
      <label className={`block text-sm font-medium text-slate-700 mb-1 ${rtl ? 'text-right' : 'text-left'}`}>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
        />
        <select
          value={unitValue}
          onChange={(e) => onUnitChange(e.target.value)}
          className={`w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${rtl ? 'text-right' : 'text-left'}`}
        >
          {unitOptions.map((option, idx) => {
            const { value: optValue, label: optLabel } = normalizeOption(option);
            return (
              <option key={idx} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  locale: Locale;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ label, value, onChange, locale }) => {
  const rtl = isRTL(locale);
  return (
    <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? (rtl ? '-translate-x-6' : 'translate-x-6') : (rtl ? '-translate-x-1' : 'translate-x-1')
          }`}
        />
      </button>
    </div>
  );
};
