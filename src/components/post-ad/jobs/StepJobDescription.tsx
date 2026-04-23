'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ExperienceLevel, EXPERIENCE_LEVELS } from '@/lib/constants/jobs-wizard';
import { InputField, SelectField, TextAreaField } from './JobsFieldControls';
import { Plus, Trash2 } from 'lucide-react';

interface StepJobDescriptionProps {
  locale: Locale;
  data: {
    jobDescription: string;
    responsibilities: string[];
    requirements: string[];
    preferredQualifications: string[];
    experienceLevel: ExperienceLevel | '';
  };
  onChange: (updates: Partial<{
    jobDescription: string;
    responsibilities: string[];
    requirements: string[];
    preferredQualifications: string[];
    experienceLevel: ExperienceLevel | '';
  }>) => void;
}

export const StepJobDescription: React.FC<StepJobDescriptionProps> = ({ locale, data, onChange }) => {
  const t = useTranslations('postAd.jobs');
  const rtl = isRTL(locale);

  const experienceLevelOptions = EXPERIENCE_LEVELS.map(level => ({
    value: level.value,
    label: `${t(`experienceLevels.${level.value}`)} (${level.years})`
  }));

  const handleAddResponsibility = () => {
    onChange({ responsibilities: [...data.responsibilities, ''] });
  };

  const handleUpdateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...data.responsibilities];
    newResponsibilities[index] = value;
    onChange({ responsibilities: newResponsibilities });
  };

  const handleRemoveResponsibility = (index: number) => {
    const newResponsibilities = data.responsibilities.filter((_, i) => i !== index);
    onChange({ responsibilities: newResponsibilities });
  };

  const handleAddRequirement = () => {
    onChange({ requirements: [...data.requirements, ''] });
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const newRequirements = [...data.requirements];
    newRequirements[index] = value;
    onChange({ requirements: newRequirements });
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = data.requirements.filter((_, i) => i !== index);
    onChange({ requirements: newRequirements });
  };

  const handleAddPreferredQualification = () => {
    onChange({ preferredQualifications: [...data.preferredQualifications, ''] });
  };

  const handleUpdatePreferredQualification = (index: number, value: string) => {
    const newQualifications = [...data.preferredQualifications];
    newQualifications[index] = value;
    onChange({ preferredQualifications: newQualifications });
  };

  const handleRemovePreferredQualification = (index: number) => {
    const newQualifications = data.preferredQualifications.filter((_, i) => i !== index);
    onChange({ preferredQualifications: newQualifications });
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepDescription')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('descriptionDescription')}</p>
      </div>

      <div className="space-y-6">
        <TextAreaField
          label={t('jobDescription')}
          required
          rtl={rtl}
          value={data.jobDescription}
          onChange={(value) => onChange({ jobDescription: value })}
          placeholder={t('jobDescriptionPlaceholder')}
          rows={6}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">{t('responsibilities')}</h4>
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addResponsibility')}</span>
            </button>
          </div>
          <p className="text-sm text-slate-600">{t('responsibilitiesDescription')}</p>
          
          <div className="space-y-3">
            {data.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <InputField
                    label={`${t('responsibility')} ${index + 1}`}
                    required={index === 0}
                    rtl={rtl}
                    value={responsibility}
                    onChange={(value) => handleUpdateResponsibility(index, value)}
                    placeholder={t('responsibilityPlaceholder')}
                  />
                </div>
                {data.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="mt-6 rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={t('removeResponsibility')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">{t('requirements')}</h4>
            <button
              type="button"
              onClick={handleAddRequirement}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addRequirement')}</span>
            </button>
          </div>
          <p className="text-sm text-slate-600">{t('requirementsDescription')}</p>
          
          <div className="space-y-3">
            {data.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <InputField
                    label={`${t('requirement')} ${index + 1}`}
                    required={index === 0}
                    rtl={rtl}
                    value={requirement}
                    onChange={(value) => handleUpdateRequirement(index, value)}
                    placeholder={t('requirementPlaceholder')}
                  />
                </div>
                {data.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="mt-6 rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={t('removeRequirement')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">{t('preferredQualifications')}</h4>
            <button
              type="button"
              onClick={handleAddPreferredQualification}
              className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addPreferredQualification')}</span>
            </button>
          </div>
          <p className="text-sm text-slate-600">{t('preferredQualificationsDescription')}</p>
          
          <div className="space-y-3">
            {data.preferredQualifications.map((qualification, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <InputField
                    label={`${t('preferredQualification')} ${index + 1}`}
                    rtl={rtl}
                    value={qualification}
                    onChange={(value) => handleUpdatePreferredQualification(index, value)}
                    placeholder={t('preferredQualificationPlaceholder')}
                  />
                </div>
                {data.preferredQualifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePreferredQualification(index)}
                    className="mt-6 rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={t('removePreferredQualification')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <SelectField
          label={t('experienceLevel')}
          required
          rtl={rtl}
          value={data.experienceLevel}
          onChange={(value) => onChange({ experienceLevel: value as ExperienceLevel || '' })}
          placeholder={t('selectExperienceLevel')}
          options={experienceLevelOptions}
        />
      </div>
    </div>
  );
};