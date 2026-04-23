// src/lib/constants/jobs-wizard.ts
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';

export type ExperienceLevel = 'entry-level' | 'mid-level' | 'senior' | 'executive';

export type JobSubcategory = 
  | 'technology-it'
  | 'finance-accounting'
  | 'healthcare-medical'
  | 'education-teaching'
  | 'sales-marketing'
  | 'administration'
  | 'customer-service'
  | 'manufacturing'
  | 'construction'
  | 'transportation-logistics'
  | 'hospitality-tourism'
  | 'other';

export type ApplicationMethod = 'email' | 'external-link';

export interface BenefitOption {
  value: string;
  labelKey: string;
}

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'temporary'
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; labelKey: string; years: string }[] = [
  { value: 'entry-level', labelKey: 'experience.entryLevel', years: '0-2 years' },
  { value: 'mid-level', labelKey: 'experience.midLevel', years: '2-5 years' },
  { value: 'senior', labelKey: 'experience.senior', years: '5+ years' },
  { value: 'executive', labelKey: 'experience.executive', years: '10+ years' }
];

export const JOB_SUBCATEGORIES: JobSubcategory[] = [
  'technology-it',
  'finance-accounting',
  'healthcare-medical',
  'education-teaching',
  'sales-marketing',
  'administration',
  'customer-service',
  'manufacturing',
  'construction',
  'transportation-logistics',
  'hospitality-tourism',
  'other'
];

export const BENEFIT_OPTIONS: BenefitOption[] = [
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

export const CURRENCIES = ['AFN', 'USD', 'PKR', 'EUR', 'GBP'] as const;
export type Currency = typeof CURRENCIES[number];

// Default values for form initialization
export const DEFAULT_JOB_FORM_DATA = {
  // Step 1: Basic Details
  jobTitle: '',
  employmentType: '' as EmploymentType | '',
  isRemote: false,
  country: '',
  city: '',
  workCanBeDoneRemotely: false,
  
  // Step 2: Description & Requirements
  jobDescription: '',
  responsibilities: [''],
  requirements: [''],
  preferredQualifications: [''],
  experienceLevel: '' as ExperienceLevel | '',
  
  // Step 3: Compensation & Logistics
  currency: 'AFN' as Currency,
  minSalary: '' as number | '',
  maxSalary: '' as number | '',
  salaryNegotiable: false,
  salaryNotDisclosed: false,
  benefits: [] as string[],
  otherBenefits: '',
  applicationDeadline: '',
  applicationMethod: '' as ApplicationMethod | '',
  applicationEmail: '',
  applicationUrl: '',
  hiringManagerName: '',
  
  // Common/Contact fields
  contactPhone: '',
  contactEmail: '',
  termsAccepted: false
};