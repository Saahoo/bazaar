// src/components/admin/adminShared.ts
// Shared types, labels, and utilities for the admin panel modules

import { Locale } from '@/lib/i18n/config';

export interface CategoryRow {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string;
  parent_id: number | null;
  options_json?: Record<string, unknown> | null;
  icon_name?: string | null;
  sort_order?: number | null;
}

export interface CityRow {
  id: number;
  name_en: string;
  name_ps: string | null;
  name_fa: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  sort_order: number;
}

export interface CurrencyRow {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
  sort_order: number;
}

export interface ListingRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: { display_name: string | null } | null;
}

export interface ReportRow {
  id: string;
  listing_id: string;
  listing_title: string;
  reported_by: string;
  reporter_name: string;
  reason: string;
  description: string | null;
  status: string;
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface UserProfileRow {
  id: string;
  display_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  city: string | null;
  role: string;
  is_blocked: boolean;
  is_suspended: boolean;
  listing_restricted: boolean;
  suspended_until: string | null;
  block_reason: string | null;
  suspension_reason: string | null;
  listing_restriction_reason: string | null;
  created_at: string;
  is_seller: boolean;
  listing_count?: number;
}

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
  step?: string;
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
  step?: string;
  values: string[];
  sub_lists: WizardSubList[];
}

export interface WizardFormConfig {
  sections: WizardSection[];
  lists: WizardListGroup[];
}

export interface AdSenseSlotConfig {
  enabled: boolean;
  client: string;
  slot: string;
  format: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive: boolean;
  style: {
    margin_top: number;
    margin_bottom: number;
    max_width: string;
    bg_color: string;
  };
}

export interface AdSenseGlobalConfig {
  enabled: boolean;
  publisher_id: string;
  auto_ads: boolean;
  page_level_ads: boolean;
  anchor_ads: boolean;
  vignette_ads: boolean;
}

export interface HomepageBlockOrderItem {
  id: string;
  enabled: boolean;
  order: number;
}

// Section header component for consistent styling
export const SECTION_LABELS: Record<string, Record<Locale, string>> = {
  categories: {
    en: 'Categories Management',
    ps: 'د کټګورۍ اداره',
    fa: 'مدیریت دسته‌بندی‌ها',
  },
  cities: {
    en: 'Cities Management',
    ps: 'د ښارونو اداره',
    fa: 'مدیریت شهرها',
  },
  currencies: {
    en: 'Currencies Management',
    ps: 'د اسعار اداره',
    fa: 'مدیریت ارزها',
  },
  listingForms: {
    en: 'Listing Forms Management',
    ps: 'د اعلان فورمونه اداره',
    fa: 'مدیریت فرم‌های آگهی',
  },
  homepageLayout: {
    en: 'Homepage Layout Manager',
    ps: 'د کورپاڼې بڼه اداره',
    fa: 'مدیریت طرح صفحه اصلی',
  },
  moderation: {
    en: 'Content Moderation',
    ps: 'د اعلان څارنه',
    fa: 'نظارت محتوا',
  },
  reports: {
    en: 'Reports Review',
    ps: 'د گزارشونو بیاکتنه',
    fa: 'بررسی گزارش‌ها',
  },
  users: {
    en: 'User Management',
    ps: 'د کارونکي اداره',
    fa: 'مدیریت کاربران',
  },
  monetization: {
    en: 'Monetization & AdSense',
    ps: 'عاید او AdSense',
    fa: 'درآمدزایی و AdSense',
  },
  dashboard: {
    en: 'Admin Dashboard',
    ps: 'اډمین ډشبورډ',
    fa: 'داشبورد ادمین',
  },
};

export const REPORT_REASON_LABELS: Record<string, Record<Locale, string>> = {
  spam: { en: 'Spam', ps: 'سپیم', fa: 'هرزنامه' },
  fraud_scam: { en: 'Fraud / Scam', ps: 'دروغ / غلا', fa: 'تقلب / کلاهبرداری' },
  duplicate_listing: { en: 'Duplicate Listing', ps: 'تکراري اعلان', fa: 'آگهی تکراری' },
  wrong_category: { en: 'Wrong Category', ps: 'غلطه کټګوري', fa: 'دسته‌بندی اشتباه' },
  prohibited_item: { en: 'Prohibited Item', ps: 'منع شوی توکی', fa: 'کالای ممنوعه' },
  offensive_content: { en: 'Offensive Content', ps: 'توهیني منځپانګه', fa: 'محتوای توهین‌آمیز' },
  other: { en: 'Other', ps: 'نور', fa: 'سایر' },
};

export const MODERATION_REASON_OPTIONS: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: 'policy_violation', label: 'Violates posting rules' },
    { value: 'spam', label: 'Spam / fake listing' },
    { value: 'fraud_risk', label: 'Fraud risk' },
    { value: 'prohibited_item', label: 'Prohibited item' },
  ],
  ps: [
    { value: 'policy_violation', label: 'د قوانینو خلاف اعلان' },
    { value: 'spam', label: 'سپم/ناسم اعلان' },
    { value: 'fraud_risk', label: 'د درغلۍ خطر' },
    { value: 'prohibited_item', label: 'منع شوی توکی' },
  ],
  fa: [
    { value: 'policy_violation', label: 'نقض قوانین آگهی' },
    { value: 'spam', label: 'اسپم/آگهی نامعتبر' },
    { value: 'fraud_risk', label: 'ریسک کلاهبرداری' },
    { value: 'prohibited_item', label: 'کالای ممنوعه' },
  ],
};

export const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

export const EMPTY_WIZARD_CONFIG: WizardFormConfig = {
  sections: [],
  lists: [],
};

export const normalizeWizardConfig = (value: unknown): WizardFormConfig => {
  if (!value || typeof value !== 'object') return EMPTY_WIZARD_CONFIG;

  const raw = value as Record<string, unknown>;
  const rawSections = Array.isArray(raw.sections) ? raw.sections : [];
  const rawLists = Array.isArray(raw.lists) ? raw.lists : [];

  const sections: WizardSection[] = rawSections.map((section, sectionIdx) => {
    const s = (section && typeof section === 'object' ? section : {}) as Record<string, unknown>;
    const rawFields = Array.isArray(s.fields) ? s.fields : [];

    return {
      id: String(s.id || `section_${sectionIdx + 1}`),
      title: String(s.title || ''),
      step: s.step ? String(s.step) : undefined,
      fields: rawFields.map((field, fieldIdx) => {
        const f = (field && typeof field === 'object' ? field : {}) as Record<string, unknown>;
        const rawType = String(f.type || 'text');
        const type: WizardFieldType = ['text', 'number', 'textarea', 'select', 'checkbox'].includes(rawType)
          ? (rawType as WizardFieldType)
          : 'text';

        return {
          id: String(f.id || `field_${sectionIdx + 1}_${fieldIdx + 1}`),
          label: String(f.label || ''),
          type,
          required: Boolean(f.required),
          options: normalizeStringArray(f.options),
        };
      }),
    };
  });

  const lists: WizardListGroup[] = rawLists.map((list, listIdx) => {
    const l = (list && typeof list === 'object' ? list : {}) as Record<string, unknown>;
    const rawSubLists = (Array.isArray(l.sub_lists) ? l.sub_lists : Array.isArray(l.subLists) ? l.subLists : []) as unknown[];

    return {
      id: String(l.id || `list_${listIdx + 1}`),
      title: String(l.title || ''),
      step: l.step ? String(l.step) : undefined,
      values: normalizeStringArray(l.values),
      sub_lists: rawSubLists.map((sub, subIdx) => {
        const s = (sub && typeof sub === 'object' ? sub : {}) as Record<string, unknown>;
        return {
          id: String(s.id || `sub_${listIdx + 1}_${subIdx + 1}`),
          title: String(s.title || ''),
          values: normalizeStringArray(s.values),
        };
      }),
    };
  });

  return { sections, lists };
};

export const hasWizardContent = (config: WizardFormConfig): boolean =>
  config.sections.length > 0 || config.lists.length > 0;

export const deepCloneWizardConfig = (config: WizardFormConfig): WizardFormConfig =>
  JSON.parse(JSON.stringify(config)) as WizardFormConfig;

export const DEFAULT_WIZARD_STEPS = ['stepDetails', 'stepContact'];
export const REAL_ESTATE_WIZARD_STEPS = ['reStepType', 'reStepDetails', 'reStepAddress', 'reStepContact'];
export const VEHICLES_WIZARD_STEPS = ['vhStepType', 'vhStepSpecs', 'vhStepCondition', 'vhStepAddress', 'vhStepContact'];
export const ELECTRONICS_WIZARD_STEPS = ['elStepBasic', 'elStepSpecs', 'elStepPrice', 'elStepLocation', 'elStepContact'];

export const getWizardStepsForSlug = (slug: string | undefined): string[] => {
  if (slug === 'real-estate') return REAL_ESTATE_WIZARD_STEPS;
  if (slug === 'vehicles') return VEHICLES_WIZARD_STEPS;
  if (slug === 'electronics') return ELECTRONICS_WIZARD_STEPS;
  return DEFAULT_WIZARD_STEPS;
};

export const BUILTIN_WIZARD_TEMPLATES: Record<string, WizardFormConfig> = {
  vehicles: {
    sections: [
      {
        id: 'vh_basic',
        title: 'Vehicle Basic Details',
        step: 'vhStepType',
        fields: [
          { id: 'title', label: 'Title', type: 'text', required: true, options: [] },
          { id: 'description', label: 'Description', type: 'textarea', required: true, options: [] },
          { id: 'vehicle_type', label: 'Vehicle Type', type: 'select', required: true, options: ['sedan', 'suv', 'truck', 'pickup', 'van', 'motorcycle'] },
        ],
      },
      {
        id: 'vh_specs',
        title: 'Vehicle Specs',
        step: 'vhStepSpecs',
        fields: [
          { id: 'year', label: 'Year', type: 'number', required: true, options: [] },
          { id: 'make', label: 'Make', type: 'text', required: true, options: [] },
          { id: 'model', label: 'Model', type: 'text', required: true, options: [] },
          { id: 'mileage', label: 'Mileage', type: 'number', required: false, options: [] },
          { id: 'price', label: 'Price', type: 'number', required: true, options: [] },
        ],
      },
    ],
    lists: [
      {
        id: 'vh_damage',
        title: 'Damage Details',
        step: 'vhStepCondition',
        values: ['No damage', 'Minor scratches', 'Body repair', 'Engine issue'],
        sub_lists: [
          { id: 'vh_damage_area', title: 'Damage Area', values: ['Front', 'Rear', 'Left side', 'Right side'] },
        ],
      },
    ],
  },
  'real-estate': {
    sections: [
      {
        id: 're_type',
        title: 'Property Type & Purpose',
        step: 'reStepType',
        fields: [
          { id: 'property_type', label: 'Property Type', type: 'select', required: true, options: ['house', 'apartment', 'land', 'office', 'shop'] },
          { id: 'purpose', label: 'Purpose', type: 'select', required: true, options: ['sale', 'rent'] },
        ],
      },
      {
        id: 're_details',
        title: 'Property Details',
        step: 'reStepDetails',
        fields: [
          { id: 'title', label: 'Title', type: 'text', required: true, options: [] },
          { id: 'description', label: 'Description', type: 'textarea', required: true, options: [] },
          { id: 'price', label: 'Price', type: 'number', required: true, options: [] },
          { id: 'rooms', label: 'Rooms', type: 'number', required: false, options: [] },
          { id: 'bathrooms', label: 'Bathrooms', type: 'number', required: false, options: [] },
          { id: 'area', label: 'Area (sqm)', type: 'number', required: false, options: [] },
        ],
      },
    ],
    lists: [
      {
        id: 're_neighborhood',
        title: 'Neighborhood Features',
        step: 'reStepAddress',
        values: ['Park', 'School', 'Hospital', 'Market', 'Mosque', 'Transport'],
        sub_lists: [
          { id: 're_utilities', title: 'Utilities', values: ['Water', 'Electricity', 'Gas', 'Internet'] },
        ],
      },
    ],
  },
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');