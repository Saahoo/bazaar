'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { EmploymentType, ExperienceLevel, ApplicationMethod } from '@/lib/constants/jobs-wizard';
import { formatNumber, formatDate, formatSalaryRange } from '@/lib/utils/formatting';
import { Check, Edit2 } from 'lucide-react';

interface StepJobReviewProps {
  locale: Locale;
  data: {
    jobTitle: string;
    employmentType: EmploymentType | '';
    isRemote: boolean;
    country: string;
    city: string;
    workCanBeDoneRemotely: boolean;
    jobDescription: string;
    responsibilities: string[];
    requirements: string[];
    preferredQualifications: string[];
    experienceLevel: ExperienceLevel | '';
    currency: string;
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
    contactPhone: string;
    contactEmail: string;
    termsAccepted: boolean;
  };
  onEditSection: (section: 'basic' | 'description' | 'compensation' | 'contact') => void;
}

export const StepJobReview: React.FC<StepJobReviewProps> = ({ locale, data, onEditSection }) => {
  const t = useTranslations('postAd.jobs');
  const rtl = isRTL(locale);

  const formatEmploymentType = (type: EmploymentType | '') => {
    if (!type) return t('notSpecified');
    return t(`employmentTypes.${type}`);
  };

  const formatExperienceLevel = (level: ExperienceLevel | '') => {
    if (!level) return t('notSpecified');
    const levelMap: Record<ExperienceLevel, string> = {
      'entry-level': '0-2 years',
      'mid-level': '2-5 years',
      'senior': '5+ years',
      'executive': '10+ years'
    };
    return `${t(`experienceLevels.${level}`)} (${levelMap[level as ExperienceLevel] || ''})`;
  };

  const formatApplicationMethod = (method: ApplicationMethod | '') => {
    if (!method) return t('notSpecified');
    return t(`applicationMethods.${method}`);
  };

  const formatSalary = () => {
    if (data.salaryNotDisclosed) return t('salaryNotDisclosedLabel');
    
    return formatSalaryRange(
      data.minSalary,
      data.maxSalary,
      data.currency,
      locale,
      data.salaryNegotiable,
      t
    );
  };

  const formatBenefits = () => {
    const benefitLabels = data.benefits.map(benefit => {
      const benefitOption = BENEFIT_OPTIONS.find(b => b.value === benefit);
      return benefitOption ? t(`benefits.${benefitOption.labelKey}`) : benefit;
    });
    
    if (data.otherBenefits) {
      benefitLabels.push(data.otherBenefits);
    }
    
    return benefitLabels.length > 0 ? benefitLabels.join(', ') : t('noneSpecified');
  };

  const BENEFIT_OPTIONS = [
    { value: 'health-insurance', labelKey: 'benefits.healthInsurance' },
    { value: 'paid-time-off', labelKey: 'benefits.paidTimeOff' },
    { value: 'retirement-plan', labelKey: 'benefits.retirementPlan' },
    { value: 'flexible-schedule', labelKey: 'benefits.flexibleSchedule' },
    { value: 'remote-work', labelKey: 'benefits.remoteWork' },
    { value: 'bonuses', labelKey: 'benefits.bonuses' },
    { value: 'training-development', labelKey: 'benefits.trainingDevelopment' },
    { value: 'meal-allowance', labelKey: 'benefits.mealAllowance' },
    { value: 'transportation-allowance', labelKey: 'benefits.transportationAllowance' }
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border border-slate-200 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-4 ${rtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-lg font-bold text-slate-900">{t('stepReview')}</h3>
        <p className="mt-1 text-sm text-slate-600">{t('reviewDescription')}</p>
      </div>

      <div className="space-y-8">
        {/* Basic Details Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">{t('basicDetails')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('basic')}
              className="flex items-center space-x-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="h-4 w-4" />
              <span>{t('edit')}</span>
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('jobTitle')}</dt>
              <dd className="mt-1 text-sm text-slate-900">{data.jobTitle || t('notSpecified')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('employmentType')}</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatEmploymentType(data.employmentType)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('remotePosition')}</dt>
              <dd className="mt-1 text-sm text-slate-900">{data.isRemote ? t('yes') : t('no')}</dd>
            </div>
            {!data.isRemote && (
              <>
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t('location')}</dt>
                  <dd className="mt-1 text-sm text-slate-900">
                    {data.city && data.country ? `${data.city}, ${data.country}` : t('notSpecified')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t('workCanBeDoneRemotely')}</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.workCanBeDoneRemotely ? t('yes') : t('no')}</dd>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description & Requirements Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Check className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">{t('descriptionRequirements')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('description')}
              className="flex items-center space-x-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="h-4 w-4" />
              <span>{t('edit')}</span>
            </button>
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('jobDescription')}</dt>
              <dd className="mt-2 text-sm text-slate-900 whitespace-pre-wrap">
                {data.jobDescription || t('notSpecified')}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('responsibilities')}</dt>
              <dd className="mt-2">
                {data.responsibilities.filter(r => r.trim()).length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-900">
                    {data.responsibilities.filter(r => r.trim()).map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">{t('noneSpecified')}</p>
                )}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('requirements')}</dt>
              <dd className="mt-2">
                {data.requirements.filter(r => r.trim()).length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-900">
                    {data.requirements.filter(r => r.trim()).map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">{t('noneSpecified')}</p>
                )}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('preferredQualifications')}</dt>
              <dd className="mt-2">
                {data.preferredQualifications.filter(q => q.trim()).length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-900">
                    {data.preferredQualifications.filter(q => q.trim()).map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">{t('noneSpecified')}</p>
                )}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-slate-500">{t('experienceLevel')}</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatExperienceLevel(data.experienceLevel)}</dd>
            </div>
          </div>
        </div>

        {/* Compensation & Logistics Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-amber-100 p-2">
                <Check className="h-5 w-5 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">{t('compensationLogistics')}</h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('compensation')}
              className="flex items-center space-x-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Edit2 className="h-4 w-4" />
              <span>{t('edit')}</span>
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">{t('salary')}</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatSalary()}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-500">{t('benefits')}</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatBenefits()}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-500">{t('applicationDeadline')}</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {data.applicationDeadline ? formatDate(data.applicationDeadline, locale) : t('notSpecified')}
                </dd>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">{t('hiringManagerName')}</dt>
                <dd className="mt-1 text-sm text-slate-900">{data.hiringManagerName || t('notSpecified')}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-500">{t('applicationMethod')}</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatApplicationMethod(data.applicationMethod)}</dd>
              </div>
              
              {data.applicationMethod === 'email' && data.applicationEmail && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t('applicationEmail')}</dt>
                  <dd className="mt-1 text-sm text-slate-900">{data.applicationEmail}</dd>
                </div>
              )}
              
              {data.applicationMethod === 'external-link' && data.applicationUrl && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">{t('applicationUrl')}</dt>
                  <dd className="mt-1 text-sm text-slate-900 break-all">{data.applicationUrl}</dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact & Terms Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">
                {locale === 'en' ? 'Contact Information & Terms' :
                 locale === 'ps' ? 'د اړیکې معلومات او شرطونه' :
                 'اطلاعات تماس و شرایط'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('contact')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Edit2 className="h-4 w-4" />
              {locale === 'en' ? 'Edit' :
               locale === 'ps' ? 'سمون' :
               'ویرایش'}
            </button>
          </div>
          
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  {locale === 'en' ? 'Phone Number' :
                   locale === 'ps' ? 'د تلیفون شمیره' :
                   'شماره تلفن'}
                </dt>
                <dd className="mt-1 text-sm text-slate-900">{data.contactPhone || (locale === 'en' ? 'Not specified' : locale === 'ps' ? 'نه دی ټاکل شوی' : 'مشخص نشده')}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-500">
                  {locale === 'en' ? 'Email Address' :
                   locale === 'ps' ? 'برېښنالیک پته' :
                   'آدرس ایمیل'}
                </dt>
                <dd className="mt-1 text-sm text-slate-900">{data.contactEmail || (locale === 'en' ? 'Not specified' : locale === 'ps' ? 'نه دی ټاکل شوی' : 'مشخص نشده')}</dd>
              </div>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-slate-500">
                {locale === 'en' ? 'Terms & Conditions' :
                 locale === 'ps' ? 'شرطونه او شرایط' :
                 'شرایط و ضوابط'}
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {data.termsAccepted ?
                  (locale === 'en' ? 'Accepted' :
                   locale === 'ps' ? 'ومنل شوی' :
                   'پذیرفته شده') :
                  (locale === 'en' ? 'Not accepted' :
                   locale === 'ps' ? 'نه دی منل شوی' :
                   'پذیرفته نشده')}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};