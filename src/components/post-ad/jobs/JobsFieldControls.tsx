'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface InputFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'number' | 'date';
  maxLength?: number;
  showCounter?: boolean;
  error?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  rtl,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  showCounter = false,
  error,
  disabled = false,
}) => {
  const remaining = maxLength ? maxLength - value.length : 0;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            'block w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500',
            rtl ? 'text-right' : 'text-left',
            error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 bg-white',
            disabled && 'cursor-not-allowed bg-slate-100 text-slate-500'
          )}
        />
        {showCounter && maxLength && (
          <div className={cn(
            'absolute top-3 text-xs',
            rtl ? 'left-3' : 'right-3'
          )}>
            <span className={remaining < 0 ? 'text-red-500' : 'text-slate-400'}>
              {remaining}
            </span>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required = false,
  rtl,
  value,
  onChange,
  placeholder,
  options,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-blue-500',
          rtl ? 'text-right' : 'text-left',
          error && 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500',
          disabled && 'cursor-not-allowed bg-slate-100 text-slate-500'
        )}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  required?: boolean;
  rtl: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  required = false,
  rtl,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          'block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500',
          rtl ? 'text-right' : 'text-left',
          error && 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500',
          disabled && 'cursor-not-allowed bg-slate-100 text-slate-500'
        )}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  description,
  disabled = false,
}) => {
  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1">
        <label htmlFor={label} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
};

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  enabledLabel?: string;
  disabledLabel?: string;
  disabled?: boolean;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  checked,
  onChange,
  enabledLabel = 'Yes',
  disabledLabel = 'No',
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            checked
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {enabledLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            !checked
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {disabledLabel}
        </button>
      </div>
    </div>
  );
};