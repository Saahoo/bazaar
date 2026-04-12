'use client';

import React from 'react';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

interface MultiSelectFieldProps extends BaseFieldProps {
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
}

interface CheckboxFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ToggleFieldProps extends BaseFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

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
      dir={type === 'number' ? 'ltr' : rtl ? 'rtl' : 'ltr'}
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
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
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
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (selected) {
                onChange(value.filter((item) => item !== option));
                return;
              }
              onChange([...value, option]);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected
                ? 'border-primary-500 bg-primary-100 text-primary-700'
                : 'border-slate-300 bg-white text-slate-600 hover:border-primary-300'
            }`}
          >
            {option}
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

export const ToggleField: React.FC<ToggleFieldProps> = ({ label, required, rtl, value, onChange }) => (
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
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
          !value ? 'border-primary-500 bg-primary-100 text-primary-700' : 'border-slate-300 bg-white text-slate-700'
        }`}
      >
        No
      </button>
    </div>
  </div>
);
