'use client';

import React from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';

export type WizardFieldType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox';

export interface WizardField {
  id: string;
  label: string;
  type: WizardFieldType;
  required: boolean;
  options: string[];
}

export interface WizardSection {
  id: string;
  title: string;
  fields: WizardField[];
}

export interface WizardSubList {
  id: string;
  title: string;
  values: string[];
}

export interface WizardListGroup {
  id: string;
  title: string;
  values: string[];
  sub_lists: WizardSubList[];
}

export interface WizardFormConfig {
  sections: WizardSection[];
  lists: WizardListGroup[];
}

interface DynamicWizardFieldsProps {
  locale: Locale;
  config: WizardFormConfig;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

const fieldKey = (sectionId: string, fieldId: string) => `section.${sectionId}.field.${fieldId}`;
const listKey = (listId: string) => `list.${listId}`;
const subListKey = (listId: string, subId: string) => `list.${listId}.sub.${subId}`;

const toStringValue = (value: unknown): string => (typeof value === 'string' || typeof value === 'number' ? String(value) : '');

const toBooleanValue = (value: unknown): boolean => value === true;

const toArrayValue = (value: unknown): string[] => (Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []);

const toggleArrayValue = (arr: string[], val: string): string[] =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

export const DynamicWizardFields: React.FC<DynamicWizardFieldsProps> = ({ locale, config, values, onChange }) => {
  const rtl = isRTL(locale);

  const inputClass =
    `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-slate-200">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        Extra Details
      </h3>

      {config.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          <h4 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
            {section.title || 'Section'}
          </h4>

          {section.fields.map((field) => {
            const key = fieldKey(section.id, field.id);
            const raw = values[key];

            return (
              <div key={field.id}>
                <label className={labelClass}>
                  {field.label || 'Field'} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={toStringValue(raw)}
                    onChange={(e) => onChange(key, e.target.value)}
                    rows={4}
                    className={inputClass}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={toStringValue(raw)}
                    onChange={(e) => onChange(key, e.target.value)}
                    className={`${inputClass} bg-white`}
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label className={`inline-flex items-center gap-2 text-sm text-slate-700 ${rtl ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="checkbox"
                      checked={toBooleanValue(raw)}
                      onChange={(e) => onChange(key, e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Yes
                  </label>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={toStringValue(raw)}
                    onChange={(e) => onChange(key, field.type === 'number' ? e.target.value : e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {config.lists.map((list) => {
        const listValues = toArrayValue(values[listKey(list.id)]);
        return (
          <div key={list.id} className="space-y-3 border border-slate-200 rounded-lg p-4">
            <h4 className={`text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : 'text-left'}`}>
              {list.title || 'List'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {list.values.map((value) => {
                const selected = listValues.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange(listKey(list.id), toggleArrayValue(listValues, value))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${selected ? 'bg-primary-50 border-primary-400 text-primary-700' : 'bg-white border-slate-300 text-slate-700 hover:border-primary-300'}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>

            {list.sub_lists.map((sub) => {
              const subValues = toArrayValue(values[subListKey(list.id, sub.id)]);
              return (
                <div key={sub.id} className="space-y-2 pl-2 border-l-2 border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">{sub.title || 'Sub-list'}</p>
                  <div className="flex flex-wrap gap-2">
                    {sub.values.map((value) => {
                      const selected = subValues.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => onChange(subListKey(list.id, sub.id), toggleArrayValue(subValues, value))}
                          className={`px-2.5 py-1 rounded-full text-xs border transition ${selected ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-300'}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const isWizardRequiredFieldsValid = (config: WizardFormConfig, values: Record<string, unknown>): boolean => {
  for (const section of config.sections) {
    for (const field of section.fields) {
      if (!field.required) continue;
      const key = fieldKey(section.id, field.id);
      const val = values[key];

      if (field.type === 'checkbox') {
        if (val !== true) return false;
        continue;
      }

      if (typeof val === 'string' && val.trim() !== '') continue;
      if (typeof val === 'number' && !Number.isNaN(val)) continue;
      return false;
    }
  }

  return true;
};
