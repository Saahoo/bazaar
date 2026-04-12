'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, LogIn, Save, Eye } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { StepCategory } from './StepCategory';
import { StepDetails, StepDetailsHandle } from './StepDetails';
import { StepPhotos, StepPhotosData } from './StepPhotos';
import { StepContact } from './StepContact';
// Real Estate steps
import { StepPropertyType, PropertyType, PropertyPurpose } from './real-estate/StepPropertyType';
import { StepPropertyDetails, StepPropertyDetailsHandle, PropertyDetailsData } from './real-estate/StepPropertyDetails';
import { StepAddress, AddressData } from './real-estate/StepAddress';
import { StepMedia, MediaData } from './real-estate/StepMedia';
import { StepContactInfo, ContactInfoData } from './real-estate/StepContactInfo';
// Vehicles steps
import { StepVehicleType } from './vehicles/StepVehicleType';
import { StepVehicleSpecs, VehicleSpecsData } from './vehicles/StepVehicleSpecs';
import { StepVehicleCondition, VehicleConditionData } from './vehicles/StepVehicleCondition';
import { StepVehicleAddress, VehicleAddressData } from './vehicles/StepVehicleAddress';
import { StepVehicleMedia, VehicleMediaData } from './vehicles/StepVehicleMedia';
import { StepVehicleContact, VehicleContactData } from './vehicles/StepVehicleContact';
import { StepElectronicsBasicInfo } from './electronics/StepElectronicsBasicInfo';
import { StepElectronicsSpecs } from './electronics/StepElectronicsSpecs';
import { StepElectronicsMedia, ElectronicsMediaData } from './electronics/StepElectronicsMedia';
import { StepElectronicsDetails } from './electronics/StepElectronicsDetails';
import { StepElectronicsReview } from './electronics/StepElectronicsReview';
import { StepFashionBasicInfo } from './fashion/StepFashionBasicInfo';
import { StepFashionGeneralDetails } from './fashion/StepFashionGeneralDetails';
import { StepFashionSpecs } from './fashion/StepFashionSpecs';
import { StepFashionMedia, FashionMediaData } from './fashion/StepFashionMedia';
import { StepFashionContact } from './fashion/StepFashionContact';
import { StepFashionReview } from './fashion/StepFashionReview';
import { DynamicWizardFields, WizardFormConfig, isWizardRequiredFieldsValid } from './DynamicWizardFields';
import { ElectronicsSubcategory, getElectronicsSpecsConfig, hasConditionInSpecs } from '@/lib/constants/electronics-wizard';
import { FashionSubcategory, FASHION_BRANDS_BY_SUBCATEGORY, getFashionSpecsConfig } from '@/lib/constants/fashion-wizard';
import type { VehicleType as VehicleTypeEnum } from '@/lib/constants/vehicles';

// Category slugs (more reliable than hardcoded IDs across environments)
const REAL_ESTATE_SLUG = 'real-estate';
const VEHICLES_SLUG = 'vehicles';
const ELECTRONICS_SLUG = 'electronics';
const FASHION_SLUGS = ['fashion-clothing', 'fashion'];

export interface PostAdFormData {
  categoryId: number | null;
  title: string;
  description: string;
  price: number | '';
  currency: string;
  condition: string;
  city: string;
  phone: string;
  email: string;
  termsAccepted: boolean;
  photos: StepPhotosData;
}

export interface RealEstateFormData {
  propertyType: PropertyType | '';
  purpose: PropertyPurpose | '';
  propertyDetails: PropertyDetailsData;
  address: AddressData;
  media: MediaData;
  contact: ContactInfoData;
}

export interface VehiclesFormData {
  title: string;
  description: string;
  vehicleType: VehicleTypeEnum | '';
  specs: VehicleSpecsData;
  condition: VehicleConditionData;
  address: VehicleAddressData;
  media: VehicleMediaData;
  contact: VehicleContactData;
}

export interface ElectronicsFormData {
  subcategory: ElectronicsSubcategory | '';
  title: string;
  details: string;
  specs: Record<string, string>;
  price: number | '';
  negotiable: boolean;
  condition: string;
  media: ElectronicsMediaData;
  city: string;
  sellerType: 'individual' | 'dealer' | '';
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
}

export interface FashionFormData {
  subcategory: FashionSubcategory | '';
  title: string;
  description: string;
  price: number | '';
  condition: 'New' | 'Used' | '';
  brand: string;
  brandOther: string;
  sellerType: 'Individual' | 'Dealer' | '';
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
  specs: Record<string, unknown>;
  media: FashionMediaData;
}

const INITIAL_FORM_DATA: PostAdFormData = {
  categoryId: null,
  title: '',
  description: '',
  price: '',
  currency: 'AFN',
  condition: '',
  city: '',
  phone: '',
  email: '',
  termsAccepted: false,
  photos: { photos: [] },
};

const INITIAL_RE_DATA: RealEstateFormData = {
  propertyType: '',
  purpose: '',
  propertyDetails: {
    title: '', description: '', price: '', currency: 'AFN', deposit: '',
    areaGross: '', areaNet: '', rooms: '', bathrooms: '', kitchenType: '',
    balcony: '', buildingAge: '', floor: '', totalFloors: '',
    lift: false, carParking: false, fromWho: '',
  },
  address: { city: '', district: '', street: '', unit: '', neighborhood: [], lat: null, lng: null },
  media: { photos: [], videoUrl: '' },
  contact: { phone: '', whatsapp: '', email: '', termsAccepted: false },
};

const INITIAL_VH_DATA: VehiclesFormData = {
  title: '',
  description: '',
  vehicleType: '',
  specs: {
    year: '', make: '', customMake: '', model: '', customModel: '',
    engineType: '', wheelDriveType: '', trimLevel: '', customTrim: '',
    bodyType: '', customBodyType: '', gearType: '', engineSize: '', enginePower: '',
  },
  condition: {
    price: '', currency: 'AFN', mileage: '', color: '', customColor: '', sellerSource: '',
    hasDamage: null, exchange: null, hasNumberPlate: null,
    numberPlateCity: '', handDrive: '', damageDetails: '', otherOptions: [],
  },
  address: { city: '', street: '', area: '', lat: null, lng: null },
  media: { photos: [], videoUrl: '' },
  contact: { phone: '', whatsapp: '', whatsappSameAsPhone: false, email: '', termsAccepted: false },
};

const INITIAL_EL_DATA: ElectronicsFormData = {
  subcategory: '',
  title: '',
  details: '',
  specs: {},
  price: '',
  negotiable: false,
  condition: '',
  media: {
    photos: [],
    videoUrl: '',
  },
  city: '',
  sellerType: '',
  phone: '',
  whatsapp: '',
  email: '',
  termsAccepted: false,
};

const INITIAL_FA_DATA: FashionFormData = {
  subcategory: '',
  title: '',
  description: '',
  price: '',
  condition: '',
  brand: '',
  brandOther: '',
  sellerType: '',
  city: '',
  lat: null,
  lng: null,
  phone: '',
  whatsapp: '',
  email: '',
  termsAccepted: false,
  specs: {},
  media: {
    images: [],
    video: '',
  },
};

// Default steps for non-specialized categories
const DEFAULT_STEPS = ['stepCategory', 'stepDetails', 'stepPhotos', 'stepContact'] as const;
// Real estate steps
const RE_STEPS = ['stepCategory', 'reStepType', 'reStepDetails', 'reStepAddress', 'reStepMedia', 'reStepContact'] as const;
// Vehicle steps
const VH_STEPS = ['stepCategory', 'vhStepType', 'vhStepSpecs', 'vhStepCondition', 'vhStepAddress', 'vhStepMedia', 'vhStepContact'] as const;
// Electronics steps
const EL_STEPS = ['stepCategory', 'elStepBasic', 'elStepSpecs', 'elStepMedia', 'elStepDetails', 'elStepReview'] as const;
// Fashion & Clothing steps
const FA_STEPS = ['stepCategory', 'faStepBasic', 'faStepGeneral', 'faStepSpecs', 'faStepMedia', 'faStepContact', 'faStepReview'] as const;

const isFashionSlug = (categorySlug: string | null): boolean => {
  if (!categorySlug) return false;
  return FASHION_SLUGS.includes(categorySlug);
};

const getStepsForCategorySlug = (categorySlug: string | null): readonly string[] => {
  if (categorySlug === REAL_ESTATE_SLUG) return RE_STEPS;
  if (categorySlug === VEHICLES_SLUG) return VH_STEPS;
  if (categorySlug === ELECTRONICS_SLUG) return EL_STEPS;
  if (isFashionSlug(categorySlug)) return FA_STEPS;
  return DEFAULT_STEPS;
};

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

const normalizeWizardConfig = (value: unknown): WizardFormConfig => {
  if (!value || typeof value !== 'object') return { sections: [], lists: [] };

  const raw = value as Record<string, unknown>;
  const rawSections = Array.isArray(raw.sections) ? raw.sections : [];
  const rawLists = Array.isArray(raw.lists) ? raw.lists : [];

  const sections: WizardFormConfig['sections'] = rawSections.map((section, sectionIdx) => {
    const s = (section && typeof section === 'object' ? section : {}) as Record<string, unknown>;
    const rawFields = Array.isArray(s.fields) ? s.fields : [];

    return {
      id: String(s.id || `section_${sectionIdx + 1}`),
      title: String(s.title || ''),
      step: s.step ? String(s.step) : undefined,
      fields: rawFields.map((field, fieldIdx) => {
        const f = (field && typeof field === 'object' ? field : {}) as Record<string, unknown>;
        const rawType = String(f.type || 'text');
        const type = ['text', 'number', 'textarea', 'select', 'checkbox'].includes(rawType)
          ? (rawType as 'text' | 'number' | 'textarea' | 'select' | 'checkbox')
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

  const lists: WizardFormConfig['lists'] = rawLists.map((list, listIdx) => {
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

const getConfigForStep = (config: WizardFormConfig, step: string): WizardFormConfig => {
  const sections = config.sections.filter((section) => !section.step || section.step === step);
  const lists = config.lists.filter((list) => !list.step || list.step === step);
  return { sections, lists };
};

const normalizeElectronicsSpecsForSubmit = (specs: Record<string, string>): Record<string, string> => {
  const normalized: Record<string, string> = {};

  Object.entries(specs).forEach(([key, value]) => {
    if (key === 'customMake') return;
    if (key.startsWith('custom_')) return;

    if (value === 'Other') {
      const customValue = key === 'make' || key === 'brand'
        ? (specs.customMake || '').trim()
        : (specs[`custom_${key}`] || '').trim();

      normalized[key] = customValue || value;
      return;
    }

    normalized[key] = value;
  });

  return normalized;
};

const normalizeVehicleSpecsForSubmit = (specs: VehicleSpecsData): VehicleSpecsData => {
  const normalized = { ...specs };
  if (normalized.bodyType === 'other' && normalized.customBodyType.trim()) {
    normalized.bodyType = normalized.customBodyType.trim() as VehicleSpecsData['bodyType'];
  }
  return normalized;
};

const normalizeVehicleConditionForSubmit = (condition: VehicleConditionData): VehicleConditionData => {
  const normalized = { ...condition };
  if (normalized.color === 'other' && normalized.customColor.trim()) {
    normalized.color = normalized.customColor.trim() as VehicleConditionData['color'];
  }
  return normalized;
};

const normalizeFashionSpecsForSubmit = (specs: Record<string, unknown>): Record<string, unknown> => {
  const normalized: Record<string, unknown> = {};

  Object.entries(specs).forEach(([key, value]) => {
    if (key.endsWith('Other')) return;

    if (typeof value === 'string' && value === 'Other') {
      const customValue = specs[`${key}Other`];
      normalized[key] = typeof customValue === 'string' && customValue.trim() ? customValue.trim() : value;
      return;
    }

    if (Array.isArray(value) && value.includes('Other')) {
      const customValue = specs[`${key}Other`];
      const base = value.filter((item) => item !== 'Other');
      if (typeof customValue === 'string' && customValue.trim()) {
        normalized[key] = [...base, customValue.trim()];
      } else {
        normalized[key] = base;
      }
      return;
    }

    normalized[key] = value;
  });

  return normalized;
};

type StepKey =
  | typeof DEFAULT_STEPS[number]
  | typeof RE_STEPS[number]
  | typeof VH_STEPS[number]
  | typeof EL_STEPS[number]
  | typeof FA_STEPS[number];

interface PostAdWizardProps {
  locale: Locale;
}

export const PostAdWizard: React.FC<PostAdWizardProps> = ({ locale }) => {
  const t = useTranslations('postAd');
  const tRE = useTranslations('postAd.realEstate');
  const tVH = useTranslations('postAd.vehicles');
  const tEL = useTranslations('postAd.electronics');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const rtl = isRTL(locale);
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PostAdFormData>(INITIAL_FORM_DATA);
  const [reData, setReData] = useState<RealEstateFormData>(INITIAL_RE_DATA);
  const [vhData, setVhData] = useState<VehiclesFormData>(INITIAL_VH_DATA);
  const [elData, setElData] = useState<ElectronicsFormData>(INITIAL_EL_DATA);
  const [faData, setFaData] = useState<FashionFormData>(INITIAL_FA_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wizardConfig, setWizardConfig] = useState<WizardFormConfig>({ sections: [], lists: [] });
  const [wizardValues, setWizardValues] = useState<Record<string, unknown>>({});
  const [loadingWizardConfig, setLoadingWizardConfig] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [submittedListingId, setSubmittedListingId] = useState<string | null>(null);
  const supabase = createClient();

  const detailsRef = useRef<StepDetailsHandle>(null);
  const reDetailsRef = useRef<StepPropertyDetailsHandle>(null);

  const updateFormData = useCallback((updates: Partial<PostAdFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateREData = useCallback((updates: Partial<RealEstateFormData>) => {
    setReData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateVHData = useCallback((updates: Partial<VehiclesFormData>) => {
    setVhData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateELData = useCallback((updates: Partial<ElectronicsFormData>) => {
    setElData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFAData = useCallback((updates: Partial<FashionFormData>) => {
    setFaData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCategorySelect = useCallback(
    (categoryId: number, categorySlug?: string, categoryName?: string) => {
      const changingCategory = formData.categoryId !== categoryId;
      updateFormData({ categoryId });
      setSelectedCategorySlug(categorySlug || null);
      setSelectedCategoryName(categoryName || null);
      setCurrentStep((prev) => (prev === 0 ? 1 : prev));
      if (changingCategory) {
        setReData(INITIAL_RE_DATA);
        setVhData(INITIAL_VH_DATA);
        setElData(INITIAL_EL_DATA);
        setFaData(INITIAL_FA_DATA);
        setWizardValues({});
      }
    },
    [updateFormData, formData.categoryId]
  );

  useEffect(() => {
    let mounted = true;

    const loadWizardConfig = async () => {
      if (!formData.categoryId) {
        if (mounted) {
          setWizardConfig({ sections: [], lists: [] });
          setSelectedCategorySlug(null);
          setSelectedCategoryName(null);
        }
        return;
      }

      setLoadingWizardConfig(true);
      const { data } = await supabase
        .from('categories')
        .select('options_json, slug, name_en, name_ps, name_fa')
        .eq('id', formData.categoryId)
        .single();

      if (!mounted) return;

      const raw = (data?.options_json || {}) as Record<string, unknown>;
      const wfSource = raw.wizard_forms ?? raw.wizardForms ?? raw.wizard_form ?? raw.wizard;
      setSelectedCategorySlug((data?.slug as string | undefined) || null);
      setSelectedCategoryName(
        data
          ? locale === 'ps'
            ? (data.name_ps as string)
            : locale === 'fa'
              ? (data.name_fa as string)
              : (data.name_en as string)
          : null
      );
      setWizardConfig(normalizeWizardConfig(wfSource));
      setLoadingWizardConfig(false);
    };

    loadWizardConfig();

    return () => {
      mounted = false;
    };
  }, [formData.categoryId, supabase]);

  useEffect(() => {
    const draftId = searchParams.get('draft');
    if (!user || !draftId) return;

    let mounted = true;

    const loadDraft = async () => {
      setLoadingDraft(true);
      setSubmitError(null);

      const { data: draftRow, error: draftError } = await supabase
        .from('listing_drafts')
        .select('id, category_id, draft_data')
        .eq('id', draftId)
        .eq('user_id', user.id)
        .single();

      if (draftError || !draftRow) {
        if (mounted) {
          setSubmitError(
            locale === 'en'
              ? 'Draft could not be loaded.'
              : locale === 'ps'
                ? 'مسوده پورته نه سوه.'
                : 'پیش‌نویس بارگذاری نشد.'
          );
          setLoadingDraft(false);
        }
        return;
      }

      const draftData = (draftRow.draft_data || {}) as Record<string, unknown>;
      const draftFormData = (draftData.formData || {}) as Partial<PostAdFormData>;
      const draftReData = (draftData.reData || {}) as Partial<RealEstateFormData>;
      const draftVhData = (draftData.vhData || {}) as Partial<VehiclesFormData>;
      const draftElData = (draftData.elData || {}) as Partial<ElectronicsFormData>;
      const draftFaData = (draftData.faData || {}) as Partial<FashionFormData>;
      const categoryId = draftRow.category_id ?? draftFormData.categoryId ?? null;

      let categorySlug: string | null = null;
      if (categoryId) {
        const { data: categoryRow } = await supabase
          .from('categories')
          .select('slug, name_en, name_ps, name_fa')
          .eq('id', categoryId)
          .single();
        categorySlug = (categoryRow?.slug as string | undefined) || null;
        if (categoryRow) {
          setSelectedCategoryName(
            locale === 'ps'
              ? (categoryRow.name_ps as string)
              : locale === 'fa'
                ? (categoryRow.name_fa as string)
                : (categoryRow.name_en as string)
          );
        }
      }

      if (!mounted) return;

      setCurrentDraftId(draftRow.id);
      setSelectedCategorySlug(categorySlug);
      setFormData({
        ...INITIAL_FORM_DATA,
        ...draftFormData,
        categoryId,
      });
      setReData({
        ...INITIAL_RE_DATA,
        ...draftReData,
        propertyType: draftReData.propertyType ?? INITIAL_RE_DATA.propertyType,
        purpose: draftReData.purpose ?? INITIAL_RE_DATA.purpose,
        propertyDetails: {
          ...INITIAL_RE_DATA.propertyDetails,
          ...((draftReData.propertyDetails as Partial<PropertyDetailsData> | undefined) || {}),
        },
        address: {
          ...INITIAL_RE_DATA.address,
          ...((draftReData.address as Partial<AddressData> | undefined) || {}),
        },
        media: {
          ...INITIAL_RE_DATA.media,
          ...((draftReData.media as Partial<MediaData> | undefined) || {}),
        },
        contact: {
          ...INITIAL_RE_DATA.contact,
          ...((draftReData.contact as Partial<ContactInfoData> | undefined) || {}),
        },
      });
      setVhData({
        ...INITIAL_VH_DATA,
        ...draftVhData,
        specs: {
          ...INITIAL_VH_DATA.specs,
          ...((draftVhData.specs as Partial<VehicleSpecsData> | undefined) || {}),
        },
        condition: {
          ...INITIAL_VH_DATA.condition,
          ...((draftVhData.condition as Partial<VehicleConditionData> | undefined) || {}),
        },
        address: {
          ...INITIAL_VH_DATA.address,
          ...((draftVhData.address as Partial<VehicleAddressData> | undefined) || {}),
        },
        media: {
          ...INITIAL_VH_DATA.media,
          ...((draftVhData.media as Partial<VehicleMediaData> | undefined) || {}),
        },
        contact: {
          ...INITIAL_VH_DATA.contact,
          ...((draftVhData.contact as Partial<VehicleContactData> | undefined) || {}),
        },
      });
      setElData({
        ...INITIAL_EL_DATA,
        ...draftElData,
        subcategory: draftElData.subcategory ?? INITIAL_EL_DATA.subcategory,
        specs: {
          ...INITIAL_EL_DATA.specs,
          ...((draftElData.specs as Record<string, string> | undefined) || {}),
        },
        media: {
          ...INITIAL_EL_DATA.media,
          ...((draftElData.media as Partial<ElectronicsMediaData> | undefined) || {}),
        },
      });
      setFaData({
        ...INITIAL_FA_DATA,
        ...draftFaData,
        subcategory: draftFaData.subcategory ?? INITIAL_FA_DATA.subcategory,
        specs: {
          ...INITIAL_FA_DATA.specs,
          ...((draftFaData.specs as Record<string, unknown> | undefined) || {}),
        },
        media: {
          ...INITIAL_FA_DATA.media,
          ...((draftFaData.media as Partial<FashionMediaData> | undefined) || {}),
        },
      });
      setWizardValues(((draftData.wizardValues as Record<string, unknown> | undefined) || {}));

      const savedStep = typeof draftData.currentStep === 'number' ? draftData.currentStep : (categoryId ? 1 : 0);
      const restoredSteps = getStepsForCategorySlug(categorySlug);
      setCurrentStep(Math.max(0, Math.min(savedStep, restoredSteps.length - 1)));
      setLoadingDraft(false);
    };

    loadDraft();

    return () => {
      mounted = false;
    };
  }, [locale, searchParams, supabase, user]);

  // Auth gate — require login to post an ad
  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <LogIn className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{tAuth('loginTitle')}</h2>
        <p className="text-slate-500 mb-6 text-sm">
          {locale === 'en'
            ? 'You need to be logged in to post an ad.'
            : locale === 'ps'
              ? 'د اعلان د خپرولو لپاره تاسو باید ننوتل سوي وئ.'
              : 'برای ارسال آگهی باید وارد شوید.'}
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          {tAuth('loginButton')}
        </Link>
      </div>
    );
  }

  if (loadingDraft) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">{tCommon('loading')}</p>
      </div>
    );
  }

  const isRealEstate = selectedCategorySlug === REAL_ESTATE_SLUG;
  const isVehicles = selectedCategorySlug === VEHICLES_SLUG;
  const isElectronics = selectedCategorySlug === ELECTRONICS_SLUG;
  const isFashion = isFashionSlug(selectedCategorySlug);
  const steps: readonly string[] = getStepsForCategorySlug(selectedCategorySlug);

  const getStepLabel = (step: string): string => {
    switch (step) {
      case 'stepCategory': return t('stepCategory');
      case 'stepDetails': return t('stepDetails');
      case 'stepPhotos': return t('stepPhotos');
      case 'stepContact': return t('stepContact');
      case 'reStepType': return tRE('stepType');
      case 'reStepDetails': return tRE('stepDetails');
      case 'reStepAddress': return tRE('stepAddress');
      case 'reStepMedia': return tRE('stepMedia');
      case 'reStepContact': return tRE('stepContact');
      case 'vhStepType': return tVH('stepType');
      case 'vhStepSpecs': return tVH('stepSpecs');
      case 'vhStepCondition': return tVH('stepCondition');
      case 'vhStepAddress': return tVH('stepAddress');
      case 'vhStepMedia': return tVH('stepMedia');
      case 'vhStepContact': return tVH('stepContact');
      case 'elStepBasic': return tEL('stepBasic');
      case 'elStepSpecs': return tEL('stepSpecs');
      case 'elStepMedia': return tEL('stepMedia');
      case 'elStepDetails': return tEL('stepContact');
      case 'elStepReview': return tEL('stepReview');
      case 'faStepBasic': return 'Basic Information';
      case 'faStepGeneral': return 'General Details';
      case 'faStepSpecs': return 'Specifications';
      case 'faStepMedia': return 'Media Upload';
      case 'faStepContact': return 'Contact & Terms';
      case 'faStepReview': return 'Review & Submit';
      default: return '';
    }
  };

  const currentStepKey = steps[currentStep] as StepKey;

  const fallbackDynamicSteps = new Set<StepKey>(['stepDetails', 'reStepDetails', 'vhStepSpecs']);
  const hasStepScopedWizard = wizardConfig.sections.some((s) => !!s.step) || wizardConfig.lists.some((l) => !!l.step);
  const dynamicConfigForCurrentStep = getConfigForStep(wizardConfig, currentStepKey);
  const hasDynamicFields = dynamicConfigForCurrentStep.sections.length > 0 || dynamicConfigForCurrentStep.lists.length > 0;
  const shouldShowDynamicFields = hasStepScopedWizard ? hasDynamicFields : fallbackDynamicSteps.has(currentStepKey);

  const canProceed = (): boolean => {
    const requiredDynamicValid = !shouldShowDynamicFields || !hasDynamicFields || isWizardRequiredFieldsValid(dynamicConfigForCurrentStep, wizardValues);

    switch (currentStepKey) {
      case 'stepCategory':
        return formData.categoryId !== null;
      case 'stepDetails':
        return requiredDynamicValid;
      case 'stepPhotos':
        return true;
      case 'stepContact':
        return formData.city !== '' && formData.phone !== '' && formData.termsAccepted;
      // Real estate steps
      case 'reStepType':
        return reData.propertyType !== '' && reData.purpose !== '';
      case 'reStepDetails':
        return requiredDynamicValid;
      case 'reStepAddress':
        return reData.address.city !== '';
      case 'reStepMedia':
        return true;
      case 'reStepContact':
        return reData.contact.phone !== '' && reData.contact.termsAccepted;
      // Vehicle steps
      case 'vhStepType':
        return vhData.title !== '' && vhData.title.length <= 100 && vhData.description.length >= 50 && vhData.vehicleType !== '';
      case 'vhStepSpecs':
        return vhData.specs.year !== '' && (vhData.specs.make !== '' || vhData.specs.customMake !== '') && (vhData.specs.model !== '' || vhData.specs.customModel !== '') && requiredDynamicValid;
      case 'vhStepCondition':
        return vhData.condition.price !== '' && vhData.condition.mileage !== '' && vhData.condition.sellerSource !== '';
      case 'vhStepAddress':
        return vhData.address.city !== '';
      case 'vhStepMedia':
        return vhData.media.photos.length >= 1;
      case 'vhStepContact':
        return vhData.contact.phone !== '' && vhData.contact.termsAccepted;
      // Electronics steps
      case 'elStepBasic':
        return elData.title.trim().length >= 3 && elData.details.trim().length >= 10 && elData.subcategory !== '';
      case 'elStepSpecs': {
        if (elData.price === '') return false;
        if (!hasConditionInSpecs(elData.subcategory) && elData.condition.trim() === '') return false;

        const fields = getElectronicsSpecsConfig(elData.subcategory);
        const selectedMake = (elData.specs.make || elData.specs.brand || '').trim();
        const isOtherMake = selectedMake === 'Other';
        if (isOtherMake && !(elData.specs.customMake || '').trim()) return false;

        return fields.every((field) => {
          if (!field.required) return true;
          if (field.id === 'model' && isOtherMake) return true;
          const value = elData.specs[field.id];
          if (!value || value.trim() === '') return false;
          if (value === 'Other') {
            if (field.id === 'make' || field.id === 'brand') {
              return !!(elData.specs.customMake || '').trim();
            }
            return !!(elData.specs[`custom_${field.id}`] || '').trim();
          }
          return true;
        });
      }
      case 'elStepMedia':
        return elData.media.photos.length >= 1;
      case 'elStepDetails':
        return elData.city !== '' && elData.phone.trim() !== '' && elData.termsAccepted;
      case 'elStepReview':
        return true;
      // Fashion & Clothing steps
      case 'faStepBasic':
        return faData.title.trim().length >= 3 && faData.description.trim().length >= 10 && faData.subcategory !== '';
      case 'faStepGeneral':
        return faData.price !== '' && faData.condition !== '' && (faData.brand !== '' && (faData.brand !== 'Other' || faData.brandOther.trim() !== '')) && faData.sellerType !== '';
      case 'faStepSpecs': {
        const fields = getFashionSpecsConfig(faData.subcategory);
        return fields.every((field) => {
          if (!field.required) return true;
          const value = faData.specs[field.key];
          if (field.type === 'multiselect') {
            return Array.isArray(value) && value.length > 0;
          }
          if (field.type === 'checkbox' || field.type === 'toggle') {
            return typeof value === 'boolean';
          }
          if (typeof value === 'string' && value === 'Other') {
            const custom = faData.specs[`${field.key}Other`];
            return typeof custom === 'string' && custom.trim().length > 0;
          }
          if (Array.isArray(value) && value.includes('Other')) {
            const custom = faData.specs[`${field.key}Other`];
            return typeof custom === 'string' && custom.trim().length > 0;
          }
          return typeof value === 'string' && value.trim().length > 0;
        });
      }
      case 'faStepMedia':
        return faData.media.images.length >= 1;
      case 'faStepContact':
        return faData.city.trim() !== '' && faData.phone.trim() !== '' && faData.termsAccepted;
      case 'faStepReview':
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStepKey === 'stepDetails' && detailsRef.current) {
      const valid = await detailsRef.current.validate();
      if (!valid) return;
    }
    if (currentStepKey === 'reStepDetails' && reDetailsRef.current) {
      const valid = await reDetailsRef.current.validate();
      if (!valid) return;
    }

    if (!canProceed()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed() || !user) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!formData.categoryId) {
        throw new Error(locale === 'en'
          ? 'Please select a valid category.'
          : locale === 'ps'
            ? 'مهرباني وکړئ یو معتبر کټګورۍ وټاکئ.'
            : 'لطفا یک دسته‌بندی معتبر انتخاب کنید.');
      }

      const { data: selectedCategoryRow, error: selectedCategoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', formData.categoryId)
        .single();

      if (selectedCategoryError || !selectedCategoryRow) {
        throw new Error(locale === 'en'
          ? 'Selected category is no longer available. Please choose another category.'
          : locale === 'ps'
            ? 'ټاکل شوې کټګورۍ نور شتون نه لري. مهرباني وکړئ بله کټګورۍ وټاکئ.'
            : 'دسته‌بندی انتخاب‌شده دیگر موجود نیست. لطفا دسته‌بندی دیگری انتخاب کنید.');
      }

      // Build metadata based on category
      let metadata: Record<string, unknown> = {};
      let title = formData.title;
      let description = formData.description;
      let price = typeof formData.price === 'number' ? formData.price : 0;
      let currency = formData.currency;
      let city = formData.city;
      let _phone = formData.phone;
      let condition = formData.condition;
      let photosList = formData.photos.photos;
      let fromOwner = true;

      if (isRealEstate) {
        metadata = {
          propertyType: reData.propertyType,
          purpose: reData.purpose,
          ...reData.propertyDetails,
          ...reData.address,
          wizard_forms: wizardValues,
        };
        title = reData.propertyDetails.title || title;
        description = reData.propertyDetails.description || description;
        price = Number(reData.propertyDetails.price) || price;
        currency = reData.propertyDetails.currency || currency;
        city = reData.address.city || city;
        _phone = reData.contact.phone || _phone;
        condition = 'good';
        photosList = reData.media.photos;
      } else if (isVehicles) {
        const isSourceOwner = vhData.condition.sellerSource === 'owner';
        const normalizedVehicleSpecs = normalizeVehicleSpecsForSubmit(vhData.specs);
        const normalizedVehicleCondition = normalizeVehicleConditionForSubmit(vhData.condition);
        metadata = {
          vehicleType: vhData.vehicleType,
          ...normalizedVehicleSpecs,
          ...normalizedVehicleCondition,
          wizard_forms: wizardValues,
        };
        fromOwner = isSourceOwner;
        title = vhData.title || title;
        description = vhData.description || description;
        price = Number(vhData.condition.price) || price;
        currency = vhData.condition.currency || currency;
        city = vhData.address.city || city;
        _phone = vhData.contact.phone || _phone;
        condition = 'good';
        photosList = vhData.media.photos;
      } else if (isElectronics) {
        const specsWithCondition = normalizeElectronicsSpecsForSubmit(elData.specs);
        metadata = {
          subcategory: elData.subcategory,
          ...specsWithCondition,
          negotiable: elData.negotiable,
          sellerType: elData.sellerType,
          media: {
            video: elData.media.videoUrl,
          },
          contact: {
            phone: elData.phone,
            whatsapp: elData.whatsapp,
            email: elData.email,
          },
          wizard_forms: wizardValues,
        };
        title = elData.title || title;
        description = elData.details || description;
        price = Number(elData.price) || price;
        city = elData.city || city;
        _phone = elData.phone || _phone;
        condition = (elData.specs.condition || elData.condition || condition || 'good') as string;
        photosList = elData.media.photos;
      } else if (isFashion) {
        const normalizedFashionSpecs = normalizeFashionSpecsForSubmit(faData.specs);
        const normalizedBrand = faData.brand === 'Other' ? faData.brandOther.trim() : faData.brand;
        metadata = {
          subcategory: faData.subcategory,
          condition: faData.condition,
          brand: normalizedBrand,
          sellerType: faData.sellerType,
          ...normalizedFashionSpecs,
          location: {
            city: faData.city,
            lat: faData.lat,
            lng: faData.lng,
          },
          contact: {
            phone: faData.phone,
            whatsapp: faData.whatsapp,
            email: faData.email,
          },
          media: {
            video: faData.media.video,
          },
          wizard_forms: wizardValues,
        };
        title = faData.title || title;
        description = faData.description || description;
        price = Number(faData.price) || price;
        city = faData.city || city;
        _phone = faData.phone || _phone;
        condition = (faData.condition || condition || 'good') as string;
        photosList = faData.media.images;
      } else {
        metadata = {
          ...metadata,
          wizard_forms: wizardValues,
        };
      }

      // Insert listing
      const { data: listing, error: insertError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          category_id: formData.categoryId,
          title,
          description,
          price,
          currency,
          condition: condition || 'good',
          city,
          phone_visible: true,
          from_owner: fromOwner,
          metadata,
          status: 'active',
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Listing insert failed:', insertError);
        throw new Error(insertError.message);
      }

      // Insert photos into photos table
      if (listing && photosList.length > 0) {
        const photoRows = photosList.map((photo, index) => ({
          listing_id: listing.id,
          photo_url: photo.url,
          display_order: index,
          uploaded_by: user.id,
        }));

        const { error: photosError } = await supabase
          .from('photos')
          .insert(photoRows);

        if (photosError) {
          console.error('Photos insert failed:', photosError);
        }
      }

      if (currentDraftId) {
        await supabase
          .from('listing_drafts')
          .delete()
          .eq('id', currentDraftId)
          .eq('user_id', user.id);
      }

      setSubmittedListingId(listing.id as string);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit listing.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setFormData(INITIAL_FORM_DATA);
    setReData(INITIAL_RE_DATA);
    setVhData(INITIAL_VH_DATA);
    setElData(INITIAL_EL_DATA);
    setFaData(INITIAL_FA_DATA);
    setCurrentStep(0);
    setSubmitted(false);
    setSubmittedListingId(null);
    setWizardValues({});
    setShowPreview(false);
  };

  const handleClearFashionForm = () => {
    setFaData(INITIAL_FA_DATA);
    setCurrentStep(1);
    setSubmitError(null);
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    setSavingDraft(true);
    try {
      if (!formData.categoryId) {
        throw new Error(
          locale === 'en'
            ? 'Please select a category before saving a draft.'
            : locale === 'ps'
              ? 'د مسودې د ذخیره کولو مخکې مهرباني وکړئ کټګوري وټاکئ.'
              : 'لطفا قبل از ذخیره پیش‌نویس یک دسته‌بندی انتخاب کنید.'
        );
      }

      let draftData: Record<string, unknown> = { formData, wizardValues, currentStep };
      if (isRealEstate) draftData = { ...draftData, reData };
      else if (isVehicles) draftData = { ...draftData, vhData };
      else if (isElectronics) draftData = { ...draftData, elData };
      else if (isFashion) draftData = { ...draftData, faData };

      const { data: savedDraft, error: draftError } = await supabase.from('listing_drafts').upsert({
        user_id: user.id,
        category_id: formData.categoryId,
        draft_data: draftData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,category_id' }).select('id').single();

      if (draftError) {
        throw new Error(draftError.message);
      }

      setCurrentDraftId((savedDraft?.id as string | undefined) || currentDraftId);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (
        locale === 'en'
          ? 'Failed to save draft.'
          : locale === 'ps'
            ? 'د مسودې ذخیره کول ناکام شول.'
            : 'ذخیره پیش‌نویس ناموفق بود.'
      );
      setSubmitError(message);
    } finally {
      setSavingDraft(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{tCommon('success')}</h2>
        <p className="text-slate-600 mb-8">{t('success')}</p>
        <div className={`flex items-center justify-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <Link
            href={submittedListingId ? `/${locale}/listing/${submittedListingId}` : `/${locale}`}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            {t('viewListing')}
          </Link>
          <button
            onClick={handlePostAnother}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            {t('postAnother')}
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStepKey) {
      case 'stepCategory':
        return (
          <StepCategory
            locale={locale}
            selectedCategory={formData.categoryId}
            onSelect={handleCategorySelect}
          />
        );
      case 'stepDetails':
        return (
          <StepDetails
            ref={detailsRef}
            locale={locale}
            data={{
              title: formData.title,
              description: formData.description,
              price: formData.price,
              currency: formData.currency,
              condition: formData.condition,
            }}
            onChange={(data) => updateFormData(data)}
          />
        );
      case 'stepPhotos':
        return (
          <StepPhotos
            locale={locale}
            data={formData.photos}
            onChange={(data) => updateFormData({ photos: { ...formData.photos, ...data } })}
            folder={`listings/${selectedCategorySlug || 'general'}`}
          />
        );
      case 'stepContact':
        return (
          <StepContact
            locale={locale}
            data={{
              city: formData.city,
              phone: formData.phone,
              email: formData.email,
              termsAccepted: formData.termsAccepted,
            }}
            onChange={(data) => updateFormData(data)}
            formData={formData}
            selectedCategoryName={selectedCategoryName}
          />
        );
      // Real Estate steps
      case 'reStepType':
        return (
          <StepPropertyType
            locale={locale}
            propertyType={reData.propertyType}
            purpose={reData.purpose}
            onChange={(data) => updateREData(data as Partial<RealEstateFormData>)}
          />
        );
      case 'reStepDetails':
        return (
          <StepPropertyDetails
            ref={reDetailsRef}
            locale={locale}
            purpose={reData.purpose as PropertyPurpose}
            propertyType={reData.propertyType as PropertyType}
            data={reData.propertyDetails}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                propertyDetails: { ...prev.propertyDetails, ...data },
              }))
            }
          />
        );
      case 'reStepAddress':
        return (
          <StepAddress
            locale={locale}
            data={reData.address}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                address: { ...prev.address, ...data },
              }))
            }
          />
        );
      case 'reStepMedia':
        return (
          <StepMedia
            locale={locale}
            data={reData.media}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                media: { ...prev.media, ...data },
              }))
            }
          />
        );
      case 'reStepContact':
        return (
          <StepContactInfo
            locale={locale}
            data={reData.contact}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...data },
              }))
            }
          />
        );
      // Vehicle steps
      case 'vhStepType':
        return (
          <StepVehicleType
            locale={locale}
            title={vhData.title}
            description={vhData.description}
            vehicleType={vhData.vehicleType}
            onChange={(data) => {
              if ('vehicleType' in data && data.vehicleType !== vhData.vehicleType) {
                // Reset specs when vehicle type changes
                updateVHData({
                  ...data,
                  specs: { ...INITIAL_VH_DATA.specs },
                });
              } else {
                updateVHData(data);
              }
            }}
          />
        );
      case 'vhStepSpecs':
        return (
          <StepVehicleSpecs
            locale={locale}
            vehicleType={vhData.vehicleType as VehicleTypeEnum}
            data={vhData.specs}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                specs: { ...prev.specs, ...data },
              }))
            }
          />
        );
      case 'vhStepCondition':
        return (
          <StepVehicleCondition
            locale={locale}
            vehicleType={vhData.vehicleType as VehicleTypeEnum}
            make={vhData.specs.make}
            model={vhData.specs.model}
            data={vhData.condition}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                condition: { ...prev.condition, ...data },
              }))
            }
          />
        );
      case 'vhStepAddress':
        return (
          <StepVehicleAddress
            locale={locale}
            data={vhData.address}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                address: { ...prev.address, ...data },
              }))
            }
          />
        );
      case 'vhStepMedia':
        return (
          <StepVehicleMedia
            locale={locale}
            data={vhData.media}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                media: { ...prev.media, ...data },
              }))
            }
          />
        );
      case 'vhStepContact':
        return (
          <StepVehicleContact
            locale={locale}
            data={vhData.contact}
            onChange={(data) =>
              setVhData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...data },
              }))
            }
          />
        );
      // Electronics steps
      case 'elStepBasic':
        return (
          <StepElectronicsBasicInfo
            locale={locale}
            data={{ title: elData.title, details: elData.details, subcategory: elData.subcategory }}
            onChange={(data) => {
              if (data.subcategory !== undefined && data.subcategory !== elData.subcategory) {
                // Reset specs when subcategory changes
                updateELData({ ...data, specs: {}, condition: '' });
              } else {
                updateELData(data);
              }
            }}
          />
        );
      case 'elStepSpecs':
        return (
          <StepElectronicsSpecs
            locale={locale}
            subcategory={elData.subcategory}
            specs={elData.specs}
            price={elData.price}
            negotiable={elData.negotiable}
            condition={elData.condition}
            requireCondition={!hasConditionInSpecs(elData.subcategory)}
            onChange={(specs) => updateELData({ specs })}
            onDetailsChange={(detailsUpdate) => updateELData(detailsUpdate as Partial<ElectronicsFormData>)}
          />
        );
      case 'elStepMedia':
        return (
          <StepElectronicsMedia
            locale={locale}
            data={elData.media}
            onChange={(mediaUpdate) =>
              setElData((prev) => ({
                ...prev,
                media: { ...prev.media, ...mediaUpdate },
              }))
            }
          />
        );
      case 'elStepDetails':
        return (
          <StepElectronicsDetails
            locale={locale}
            data={{
              city: elData.city,
              sellerType: elData.sellerType,
              phone: elData.phone,
              whatsapp: elData.whatsapp,
              email: elData.email,
              termsAccepted: elData.termsAccepted,
            }}
            onChange={(detailsUpdate) => {
              updateELData(detailsUpdate as Partial<ElectronicsFormData>);
            }}
          />
        );
      case 'elStepReview':
        return (
          <StepElectronicsReview
            locale={locale}
            subcategory={elData.subcategory}
            title={elData.title}
            details={elData.details}
            price={elData.price}
            negotiable={elData.negotiable}
            condition={elData.condition}
            contactData={{
              city: elData.city,
              sellerType: elData.sellerType,
              phone: elData.phone,
              whatsapp: elData.whatsapp,
              email: elData.email,
              termsAccepted: elData.termsAccepted,
            }}
            specs={elData.specs}
            media={elData.media}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      // Fashion & Clothing steps
      case 'faStepBasic':
        return (
          <StepFashionBasicInfo
            locale={locale}
            data={{
              title: faData.title,
              description: faData.description,
              subcategory: faData.subcategory,
            }}
            onChange={(updates) => {
              if (updates.subcategory !== undefined && updates.subcategory !== faData.subcategory) {
                updateFAData({ ...updates, specs: {}, brand: '' });
                return;
              }
              updateFAData(updates);
            }}
          />
        );
      case 'faStepGeneral':
        return (
          <StepFashionGeneralDetails
            locale={locale}
            data={{
              price: faData.price,
              condition: faData.condition,
              brand: faData.brand,
              brandOther: faData.brandOther,
              sellerType: faData.sellerType,
            }}
            brandOptions={faData.subcategory ? FASHION_BRANDS_BY_SUBCATEGORY[faData.subcategory] || [] : []}
            onChange={(updates) => updateFAData(updates)}
          />
        );
      case 'faStepSpecs':
        return (
          <StepFashionSpecs
            locale={locale}
            subcategory={faData.subcategory}
            specs={faData.specs}
            onChange={(specs) => updateFAData({ specs })}
          />
        );
      case 'faStepMedia':
        return (
          <StepFashionMedia
            locale={locale}
            data={faData.media}
            onChange={(updates) => updateFAData({ media: { ...faData.media, ...updates } })}
          />
        );
      case 'faStepReview':
        return (
          <StepFashionReview
            locale={locale}
            title={faData.title}
            description={faData.description}
            subcategory={faData.subcategory}
            price={faData.price}
            condition={faData.condition}
            brand={faData.brand === 'Other' ? faData.brandOther : faData.brand}
            sellerType={faData.sellerType}
            city={faData.city}
            lat={faData.lat}
            lng={faData.lng}
            phone={faData.phone}
            whatsapp={faData.whatsapp}
            email={faData.email}
            specs={faData.specs}
            media={faData.media}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      case 'faStepContact':
        return (
          <StepFashionContact
            locale={locale}
            data={{
              city: faData.city,
              lat: faData.lat,
              lng: faData.lng,
              phone: faData.phone,
              whatsapp: faData.whatsapp,
              email: faData.email,
              termsAccepted: faData.termsAccepted,
            }}
            onChange={(updates) => updateFAData(updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className={`flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span
                  className={`text-xs font-medium text-center hidden sm:block ${
                    index === currentStep ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  {getStepLabel(step)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center justify-between">
            <span>{submitError}</span>
            <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
          </div>
        )}
        {renderStepContent()}
        {loadingWizardConfig && shouldShowDynamicFields && (
          <p className="text-sm text-slate-500 mt-4">Loading extra fields...</p>
        )}
        {!loadingWizardConfig && shouldShowDynamicFields && hasDynamicFields && (
          <DynamicWizardFields
            locale={locale}
            config={dynamicConfigForCurrentStep}
            values={wizardValues}
            onChange={(key, value) => setWizardValues((prev) => ({ ...prev, [key]: value }))}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={`flex items-center justify-between gap-2 flex-wrap ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } ${rtl ? 'flex-row-reverse' : ''}`}
        >
          {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {tCommon('previous')}
        </button>

        <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {/* Save Draft */}
          {formData.categoryId !== null && (
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition border-2 ${
                draftSaved
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-primary-300 hover:bg-primary-50'
              } ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <Save className="w-4 h-4" />
              {draftSaved ? tCommon('saved') : savingDraft ? tCommon('loading') : t('saveDraft')}
            </button>
          )}

          {isFashion && (
            <button
              onClick={handleClearFashionForm}
              className={`px-4 py-2.5 rounded-lg font-medium transition border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 ${rtl ? 'text-right' : 'text-left'}`}
            >
              Clear form
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                canProceed()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-primary-300 text-white cursor-not-allowed'
              } ${rtl ? 'flex-row-reverse' : ''}`}
            >
              {tCommon('next')}
              {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              {/* Preview Ad */}
              <button
                onClick={() => setShowPreview(true)}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition border-2 ${
                  canProceed()
                    ? 'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100'
                    : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                } ${rtl ? 'flex-row-reverse' : ''}`}
              >
                <Eye className="w-4 h-4" />
                {t('previewAd')}
              </button>
              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition ${
                  canProceed() && !submitting
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-primary-300 text-white cursor-not-allowed'
                } ${rtl ? 'flex-row-reverse' : ''}`}
              >
                {submitting ? tCommon('loading') : t('submitListing')}
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className={`flex items-center justify-between mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-xl font-bold text-slate-900">{t('previewAd')}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 text-sm">
              {isVehicles && (
                <>
                  <div><span className="font-semibold text-slate-700">{t('stepDetails')}:</span> {vhData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('vehicleType')}:</span> {vhData.vehicleType}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('year')}:</span> {vhData.specs.year}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('make')}:</span> {vhData.specs.make === '__other__' ? vhData.specs.customMake : vhData.specs.make}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('model')}:</span> {vhData.specs.model === '__other__' ? vhData.specs.customModel : vhData.specs.model}</div>
                  <div><span className="font-semibold text-slate-700">{tCommon('price')}:</span> {vhData.condition.price} {vhData.condition.currency}</div>
                  <div><span className="font-semibold text-slate-700">{tVH('mileage')}:</span> {vhData.condition.mileage} km</div>
                  <div><span className="font-semibold text-slate-700">{tVH('city')}:</span> {vhData.address.city}</div>
                  {vhData.media.photos.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-700">{tVH('photos')}:</span> {vhData.media.photos.length} photo(s)
                    </div>
                  )}
                </>
              )}
              {isElectronics && (
                <>
                  <div><span className="font-semibold text-slate-700">{tEL('subcategoryLabel')}:</span> {elData.subcategory}</div>
                  <div><span className="font-semibold text-slate-700">{tEL('adTitle')}:</span> {elData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tCommon('price')}:</span> {elData.price}</div>
                  <div><span className="font-semibold text-slate-700">{tEL('city')}:</span> {elData.city}</div>
                </>
              )}
              {isFashion && (
                <>
                  <div><span className="font-semibold text-slate-700">subcategory:</span> {faData.subcategory}</div>
                  <div><span className="font-semibold text-slate-700">title:</span> {faData.title}</div>
                  <div><span className="font-semibold text-slate-700">price:</span> {faData.price}</div>
                  <div><span className="font-semibold text-slate-700">city:</span> {faData.city}</div>
                  <div><span className="font-semibold text-slate-700">images:</span> {faData.media.images.length}</div>
                </>
              )}
              {!isVehicles && !isRealEstate && !isElectronics && !isFashion && (
                <>
                  <div><span className="font-semibold text-slate-700">{t('stepDetails')}:</span> {formData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tCommon('price')}:</span> {formData.price} {formData.currency}</div>
                </>
              )}
            </div>
            <div className={`flex items-center justify-end gap-3 mt-6 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                {tCommon('close')}
              </button>
              <button
                onClick={() => { setShowPreview(false); handleSubmit(); }}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition"
              >
                {submitting ? tCommon('loading') : t('submitListing')}
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
