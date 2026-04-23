'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { Currency, CURRENCIES, BENEFIT_OPTIONS, ApplicationMethod } from '@/lib/constants/jobs-wizard';
import { getDatePlaceholder } from '@/lib/utils/formatting';
import { InputField, SelectField, CheckboxField } from './JobsFieldControls';
import { cn } from '@/lib/utils/cn';

interface StepJobCompensationProps {
  locale: Locale;
  data: {
    currency: Currency;
    minSalary: number | '';
    maxSalary: number | '';
    salaryNegotiable: boolean;
    salaryNotDisclosed: boolean;
    benefits: string[];
    otherBenefits: string;
    applicationDeadline: string;
    applicationMethod: ApplicationMethod | '';
    applicationEmail: string;
    applicationUrl: string;
    hiringManagerName: string;
  };
  onChange: (updates: Partial<{
    currency: Currency;
    minSalary: number | '';
    maxSalary: number | '';
    salaryNegotiable: boolean;
    salaryNotDisclosed: boolean;
    benefits: string[];
    otherBenefits: string;
    applicationDeadline: string;
    applicationMethod: ApplicationMethod | '';
    applicationEmail: string;
    applicationUrl: string;
    hiringManagerName: string;
  }>) => void;
}

export const StepJobCompensation: React.FC<StepJobCompensationProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.jobs');
  const rtl = isRTL(locale);

  const currencyOptions = CURRENCIES.map(currency => ({
    value: currency,
    label: currency
  }));

  const applicationMethodOptions = [
    { value: 'email', label: t('applicationMethods.email') },
    { value: 'external-link', label: t('applicationMethods.externalLink') }
  ];

  const handleBenefitToggle = (benefitValue: string) => {
    const newBenefits = data.benefits.includes(benefitValue)
      ? data.benefits.filter(b => b !== benefitValue)
      : [...data.benefits, benefitValue];
    onChange({ benefits: newBenefits });
  };

  const isSalaryDisabled = data.salaryNotDisclosed;

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepCompensation')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('compensationDescription')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">{t('salarySection')}</h4>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SelectField
              label={t('currency')}
              required={!data.salaryNotDisclosed}
              rtl={rtl}
              value={data.currency}
              onChange={(value) => onChange({ currency: value as Currency })}
              placeholder={t('selectCurrency')}
              options={currencyOptions}
              disabled={isSalaryDisabled}
            />
            
            <InputField
              label={t('minSalary')}
              required={!data.salaryNotDisclosed}
              rtl={rtl}
              value={data.minSalary.toString()}
              onChange={(value) => onChange({ minSalary: value === '' ? '' : Number(value) })}
              placeholder={t('minSalaryPlaceholder')}
              type="number"
              disabled={isSalaryDisabled}
            />
            
            <InputField
              label={t('maxSalary')}
              required={!data.salaryNotDisclosed}
              rtl={rtl}
              value={data.maxSalary.toString()}
              onChange={(value) => onChange({ maxSalary: value === '' ? '' : Number(value) })}
              placeholder={t('maxSalaryPlaceholder')}
              type="number"
              disabled={isSalaryDisabled}
            />
          </div>

          <div className="space-y-3">
            <CheckboxField
              label={t('salaryNegotiable')}
              checked={data.salaryNegotiable}
              onChange={(checked) => onChange({ salaryNegotiable: checked })}
              disabled={isSalaryDisabled}
            />
            
            <CheckboxField
              label={t('salaryNotDisclosed')}
              checked={data.salaryNotDisclosed}
              onChange={(checked) => {
                onChange({ salaryNotDisclosed: checked });
                if (checked) {
                  onChange({ minSalary: '', maxSalary: '', salaryNegotiable: false });
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">{t('benefitsSection')}</h4>
          <p className="text-sm text-slate-600">{t('benefitsDescription')}</p>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {BENEFIT_OPTIONS.map((benefit) => (
              <div key={benefit.value} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`benefit-${benefit.value}`}
                  checked={data.benefits.includes(benefit.value)}
                  onChange={() => handleBenefitToggle(benefit.value)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={`benefit-${benefit.value}`}
                  className="text-sm font-medium text-slate-700"
                >
                  {t(`benefits.${benefit.labelKey}`)}
                </label>
              </div>
            ))}
          </div>
          
          <InputField
            label={t('otherBenefits')}
            rtl={rtl}
            value={data.otherBenefits}
            onChange={(value) => onChange({ otherBenefits: value })}
            placeholder={t('otherBenefitsPlaceholder')}
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-900">{t('applicationProcessSection')}</h4>
          
          <InputField
            label={t('applicationDeadline')}
            rtl={rtl}
            value={data.applicationDeadline}
            onChange={(value) => onChange({ applicationDeadline: value })}
            placeholder={getDatePlaceholder(locale)}
            type="date"
          />
          
          <InputField
            label={t('hiringManagerName')}
            rtl={rtl}
            value={data.hiringManagerName}
            onChange={(value) => onChange({ hiringManagerName: value })}
            placeholder={t('hiringManagerNamePlaceholder')}
          />
          
          <SelectField
            label={t('applicationMethod')}
            required
            rtl={rtl}
            value={data.applicationMethod}
            onChange={(value) => onChange({ applicationMethod: value as ApplicationMethod || '' })}
            placeholder={t('selectApplicationMethod')}
            options={applicationMethodOptions}
          />
          
          {data.applicationMethod === 'email' && (
            <InputField
              label={t('applicationEmail')}
              required
              rtl={rtl}
              value={data.applicationEmail}
              onChange={(value) => onChange({ applicationEmail: value })}
              placeholder={t('applicationEmailPlaceholder')}
              type="email"
            />
          )}
          
          {data.applicationMethod === 'external-link' && (
            <InputField
              label={t('applicationUrl')}
              required
              rtl={rtl}
              value={data.applicationUrl}
              onChange={(value) => onChange({ applicationUrl: value })}
              placeholder={t('applicationUrlPlaceholder')}
              type="url"
            />
          )}
        </div>
      </div>
    </div>
  );
};