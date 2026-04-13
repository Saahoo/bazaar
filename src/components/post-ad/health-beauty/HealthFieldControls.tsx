'use client';

import React from 'react';

type Option = string | { value: string; label: string };

interface BaseFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

interface MultiSelectFieldProps extends BaseFieldProps {
  value: string[];
  options: Option[];
  onChange: (value: string[]) => void;
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ToggleFieldProps extends BaseFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
}

const normalizeOption = (option: Option) => (typeof option === 'string' ? { value: option, label: option } : option);

const labelClass = (rtl: boolean) => `block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

const inputClass = (rtl: boolean) =>
  `w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 ${rtl ? 'text-right' : 'text-left'}`;

export const InputField: React.FC<InputFieldProps> = ({ label, required, rtl, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className={labelClass(rtl)}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass(rtl)}
      dir={type === 'number' || type === 'date' ? 'ltr' : rtl ? 'rtl' : 'ltr'}
    />
  </div>
);

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, required, rtl, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <label className={labelClass(rtl)}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass(rtl)}
      dir={rtl ? 'rtl' : 'ltr'}
    />
  </div>
);

export const SelectField: React.FC<SelectFieldProps> = ({ label, required, rtl, value, options, onChange, placeholder = 'Select an option' }) => (
  <div>
    <label className={labelClass(rtl)}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass(rtl)} bg-white`}
      dir={rtl ? 'rtl' : 'ltr'}
      aria-label={label}
      title={label}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const normalized = normalizeOption(option);
        return (
          <option key={normalized.value} value={normalized.value}>
            {normalized.label}
          </option>
        );
      })}
    </select>
  </div>
);

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({ label, required, rtl, value, options, onChange }) => (
  <div>
    <label className={labelClass(rtl)}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      {options.map((option) => {
        const normalized = normalizeOption(option);
        const selected = value.includes(normalized.value);
        return (
          <button
            key={normalized.value}
            type="button"
            onClick={() => {
              if (selected) {
                onChange(value.filter((item) => item !== normalized.value));
                return;
              }
              onChange([...value, normalized.value]);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected
                ? 'border-primary-500 bg-primary-100 text-primary-700'
                : 'border-slate-300 bg-white text-slate-600 hover:border-primary-300'
            }`}
          >
            {normalized.label}
          </button>
        );
      })}
    </div>
  </div>
);

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, rtl, checked, onChange }) => (
  <label className={`inline-flex items-center gap-2 text-sm text-slate-700 ${rtl ? 'flex-row-reverse' : ''}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-200"
    />
    {label}
  </label>
);

export const ToggleField: React.FC<ToggleFieldProps> = ({ label, required, rtl, value, onChange, trueLabel = 'Yes', falseLabel = 'No' }) => (
  <div>
    <p className={labelClass(rtl)}>
      {label} {required && <span className="text-red-500">*</span>}
    </p>
    <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
          value ? 'border-primary-500 bg-primary-100 text-primary-700' : 'border-slate-300 bg-white text-slate-700'
        }`}
      >
        {trueLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
          !value ? 'border-primary-500 bg-primary-100 text-primary-700' : 'border-slate-300 bg-white text-slate-700'
        }`}
      >
        {falseLabel}
      </button>
    </div>
  </div>
);
