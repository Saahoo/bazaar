'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { EmploymentType, EMPLOYMENT_TYPES, JOB_SUBCATEGORIES } from '@/lib/constants/jobs-wizard';
import { InputField, SelectField, ToggleField, CheckboxField } from './JobsFieldControls';

interface StepJobBasicInfoProps {
  locale: Locale;
  data: {
    jobTitle: string;
    employmentType: EmploymentType | '';
    isRemote: boolean;
    country: string;
    city: string;
    workCanBeDoneRemotely: boolean;
  };
  onChange: (updates: Partial<{
    jobTitle: string;
    employmentType: EmploymentType | '';
    isRemote: boolean;
    country: string;
    city: string;
    workCanBeDoneRemotely: boolean;
  }>) => void;
}

export const StepJobBasicInfo: React.FC<StepJobBasicInfoProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.jobs');
  const rtl = isRTL(locale);

  const employmentTypeOptions = EMPLOYMENT_TYPES.map(type => ({
    value: type,
    label: t(`employmentTypes.${type}`)
  }));

  const subcategoryOptions = JOB_SUBCATEGORIES.map(cat => ({
    value: cat,
    label: t(`subcategories.${cat}`)
  }));

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepBasic')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('basicDescription')}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-blue-100 p-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-slate-900">{t('categoryIndicator.title')}</h4>
            <p className="text-sm text-slate-600">{t('categoryIndicator.description')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t('jobTitle')}
          required
          rtl={rtl}
          value={data.jobTitle}
          onChange={(value) => onChange({ jobTitle: value })}
          placeholder={t('jobTitlePlaceholder')}
          maxLength={100}
          showCounter
        />

        <SelectField
          label={t('employmentType')}
          required
          rtl={rtl}
          value={data.employmentType}
          onChange={(value) => onChange({ employmentType: value as EmploymentType || '' })}
          placeholder={t('selectEmploymentType')}
          options={employmentTypeOptions}
        />

        <ToggleField
          label={t('remotePosition')}
          checked={data.isRemote}
          onChange={(checked) => onChange({ isRemote: checked })}
          enabledLabel={t('yes')}
          disabledLabel={t('no')}
        />

        {!data.isRemote && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label={t('country')}
                required
                rtl={rtl}
                value={data.country}
                onChange={(value) => onChange({ country: value })}
                placeholder={t('countryPlaceholder')}
              />
              <InputField
                label={t('city')}
                required
                rtl={rtl}
                value={data.city}
                onChange={(value) => onChange({ city: value })}
                placeholder={t('cityPlaceholder')}
              />
            </div>

            <CheckboxField
              label={t('workCanBeDoneRemotely')}
              checked={data.workCanBeDoneRemotely}
              onChange={(checked) => onChange({ workCanBeDoneRemotely: checked })}
              description={t('workCanBeDoneRemotelyDescription')}
            />
          </>
        )}
      </div>
    </div>
  );
};