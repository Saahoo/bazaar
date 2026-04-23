'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { StepRealEstateBasicInfo } from './real-estate/StepRealEstateBasicInfo';
import { StepRealEstateLocation, RealEstateLocationData } from './real-estate/StepRealEstateLocation';
import { StepRealEstatePricing } from './real-estate/StepRealEstatePricing';
import { StepRealEstateSpecs, RealEstateSpecsData, StepRealEstateSpecsHandle } from './real-estate/StepRealEstateSpecs';
import { StepRealEstateAmenities, RealEstateAmenitiesData } from './real-estate/StepRealEstateAmenities';
import { StepMedia, MediaData } from './real-estate/StepMedia';
import { StepRealEstateContactReview, RealEstateContactData } from './real-estate/StepRealEstateContactReview';
import type { RealEstatePropertyType, ListingType, RealEstatePriceType, RealEstateFurnishing } from './real-estate/types';
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
import { StepElectronicsContact } from './electronics/StepElectronicsContact';
import { StepElectronicsReview } from './electronics/StepElectronicsReview';
import { StepFashionBasicInfo } from './fashion/StepFashionBasicInfo';
import { StepFashionGeneralDetails } from './fashion/StepFashionGeneralDetails';
import { StepFashionSpecs } from './fashion/StepFashionSpecs';
import { StepFashionMedia, FashionMediaData } from './fashion/StepFashionMedia';
import { StepFashionContact } from './fashion/StepFashionContact';
import { StepFashionReview } from './fashion/StepFashionReview';
import { StepSpareBasicInfo } from './spare-parts/StepSpareBasicInfo';
import { StepSpareGeneralDetails } from './spare-parts/StepSpareGeneralDetails';
import { StepSpareCompatibility } from './spare-parts/StepSpareCompatibility';
import { StepSpareSpecifications } from './spare-parts/StepSpareSpecifications';
import { StepSpareMedia, SpareMediaData } from './spare-parts/StepSpareMedia';
import { StepSpareContact } from './spare-parts/StepSpareContact';
import { StepSpareReview } from './spare-parts/StepSpareReview';
import { StepHealthBasicInfo } from './health-beauty/StepHealthBasicInfo';
import { StepHealthGeneralDetails } from './health-beauty/StepHealthGeneralDetails';
import { StepHealthSpecs } from './health-beauty/StepHealthSpecs';
import { StepHealthMedia, HealthMediaData } from './health-beauty/StepHealthMedia';
import { StepHealthContact } from './health-beauty/StepHealthContact';
import { StepHealthReview } from './health-beauty/StepHealthReview';
import { StepHomeFurnitureBasicInfo } from './home-furniture/StepHomeFurnitureBasicInfo';
import { StepHomeFurnitureGeneralDetails } from './home-furniture/StepHomeFurnitureGeneralDetails';
import { StepHomeFurnitureSpecs } from './home-furniture/StepHomeFurnitureSpecs';
import { StepHomeFurnitureMedia, HomeFurnitureMediaData } from './home-furniture/StepHomeFurnitureMedia';
import { StepHomeFurnitureContact } from './home-furniture/StepHomeFurnitureContact';
import { StepHomeFurnitureReview } from './home-furniture/StepHomeFurnitureReview';
import { StepServicesBasicInfo } from './services/StepServicesBasicInfo';
import { StepServicesLocation } from './services/StepServicesLocation';
import { StepServicesPricing } from './services/StepServicesPricing';
import { StepServicesDetails } from './services/StepServicesDetails';
import { StepServicesMedia, ServicesMediaData } from './services/StepServicesMedia';
import { StepServicesContact } from './services/StepServicesContact';
import { StepServicesReview } from './services/StepServicesReview';
import { StepJobBasicInfo } from './jobs/StepJobBasicInfo';
import { StepJobDescription } from './jobs/StepJobDescription';
import { StepJobCompensation } from './jobs/StepJobCompensation';
import { StepJobContact } from './jobs/StepJobContact';
import { StepJobReview } from './jobs/StepJobReview';
import { DynamicWizardFields, WizardFormConfig, isWizardRequiredFieldsValid } from './DynamicWizardFields';
import { ElectronicsSubcategory, getElectronicsSpecsConfig, hasConditionInSpecs } from '@/lib/constants/electronics-wizard';
import { FashionSubcategory, FASHION_BRANDS_BY_SUBCATEGORY, FASHION_SUBCATEGORY_LABEL_KEYS, getFashionSpecsConfig } from '@/lib/constants/fashion-wizard';
import { getHealthBeautySpecsConfig, HealthBeautySubcategory } from '@/lib/constants/health-beauty-wizard';
import { HomeFurnitureSubcategory, getHomeFurnitureSpecsConfig } from '@/lib/constants/home-furniture-wizard';
import { SparePartsSubcategory, VEHICLE_SPARE_SUBCATEGORIES, ELECTRONICS_OR_MACHINERY_SUBCATEGORIES } from '@/lib/constants/spare-parts-wizard';
import { ServicesSubcategory, getServicesSpecsConfig, ServiceType, PricingType } from '@/lib/constants/services-wizard';
import { EmploymentType, ExperienceLevel, Currency, ApplicationMethod } from '@/lib/constants/jobs-wizard';
import type { VehicleType as VehicleTypeEnum } from '@/lib/constants/vehicles';
import { cn } from '@/lib/utils/cn';

// Category slugs (more reliable than hardcoded IDs across environments)
const REAL_ESTATE_SLUG = 'real-estate';
const VEHICLES_SLUG = 'vehicles';
const ELECTRONICS_SLUG = 'electronics';
const FASHION_SLUGS = ['fashion-clothing', 'fashion'];
const SPARE_PARTS_SLUG = 'spare-parts';
const HEALTH_BEAUTY_SLUGS = ['health-beauty', 'health-and-beauty', 'health-beauty-products'];
const HEALTH_BEAUTY_CATEGORY_ID = 13;
const HOME_FURNITURE_SLUGS = ['home-furniture', 'home-and-furniture', 'furniture'];
const SERVICES_SLUGS = ['services'];
const JOBS_SLUGS = ['jobs', 'job'];

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
  propertyType: RealEstatePropertyType | '';
  listingType: ListingType;
  propertyDetails: RealEstateSpecsData & {
    title: string;
    description: string;
    price: number | '';
    currency: string;
    price_type: string;
    negotiable: boolean;
    available_from: string;
    furnishing: string;
  };
  address: RealEstateLocationData;
  amenities: RealEstateAmenitiesData;
  media: MediaData;
  contact: RealEstateContactData;
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

export interface SparePartsFormData {
  subcategory: SparePartsSubcategory | '';
  title: string;
  description: string;
  price: number | '';
  currency: 'AFN' | 'USD' | 'PKR' | '';
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  city: string;
  seller_type: 'Individual' | 'Dealer' | '';
  make: string;
  model: string;
  year_from: string;
  year_to: string;
  engine_type: string;
  transmission: string;
  part_compatibility_notes: string;
  device_type: string;
  compatible_brand: string;
  compatible_model: string;
  version_series: string;
  technical_compatibility_notes: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
  specs: Record<string, unknown>;
  media: SpareMediaData;
}

export interface HealthBeautyFormData {
  subcategory: HealthBeautySubcategory | '';
  title: string;
  description: string;
  price: number | '';
  currency: 'AFN' | 'USD' | 'PKR' | '';
  condition: 'New' | 'Used' | 'Unopened' | '';
  brand: string;
  seller_type: 'Individual' | 'Dealer' | '';
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
  specs: Record<string, unknown>;
  media: HealthMediaData;
}

export interface HomeFurnitureFormData {
  subcategory: HomeFurnitureSubcategory | '';
  title: string;
  description: string;
  price: number | '';
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  sellerType: 'Individual' | 'Dealer' | '';
  city: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  termsAccepted: boolean;
  specs: Record<string, unknown>;
  media: HomeFurnitureMediaData;
}

export interface ServicesFormData {
  subcategory: ServicesSubcategory | '';
  service_type: ServiceType | '';
  title: string;
  description: string;
  city: string;
  area: string;
  service_radius_km: number | '';
  multiple_cities: string[];
  days_available: string[];
  working_hours_from: string;
  working_hours_to: string;
  emergency_service: boolean;
  advance_booking_required: boolean;
  pricing_type: PricingType | '';
  price: number | '';
  currency: string;
  negotiable: boolean;
  call_out_fee: boolean;
  call_out_fee_amount: number | '';
  contact_name: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  social_media_links: string;
  termsAccepted: boolean;
  specs: Record<string, unknown>;
  media: ServicesMediaData;
}

export interface JobsFormData {
  // Step 1: Basic Details
  jobTitle: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary' | '';
  isRemote: boolean;
  country: string;
  city: string;
  workCanBeDoneRemotely: boolean;
  
  // Step 2: Description & Requirements
  jobDescription: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  experienceLevel: 'entry-level' | 'mid-level' | 'senior' | 'executive' | '';
  
  // Step 3: Compensation & Logistics
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
  
  // Common/Contact fields
  contactPhone: string;
  contactEmail: string;
  termsAccepted: boolean;
  photos: { photos: string[] };
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
  listingType: '',
  propertyDetails: {
    title: '',
    description: '',
    price: '',
    currency: 'AFN',
    price_type: '',
    negotiable: false,
    available_from: '',
    furnishing: '',
    bedrooms: 0,
    bathrooms: 0,
    area_size: 0,
    floor_number: 0,
    total_floors: 0,
    year_built: 0,
    parking_spaces: 0,
    balcony: false,
    elevator: false,
    heating_type: '',
    cooling: false,
    kitchen_type: '',
    living_rooms: 0,
    condition: '',
    commercial_type: '',
    furnished: false,
    meeting_rooms: 0,
    washrooms: 0,
    reception_area: false,
    suitable_for: '',
    land_type: '',
    plot_dimensions: '',
    road_access: false,
    corner_plot: false,
    zoning_type: '',
    utilities_available: [],
    industrial_type: '',
    ceiling_height: '',
    loading_docks: '',
    power_supply: '',
    office_space_included: false,
    security_features: '',
    room_type: '',
    number_of_occupants: 0,
    bathroom_type: '',
    bills_included: false,
    gender_preference: '',
    custom_property_type: '',
    custom_specifications: '',
  },
  address: { city: '', area_district: '', full_address: '', lat: null, lng: null },
  amenities: {
    security: false,
    gym: false,
    swimming_pool: false,
    garden: false,
    internet: false,
    cable_tv: false,
    pets_allowed: false,
    wheelchair_access: false,
    smart_home_features: false,
  },
  media: { photos: [], videoUrl: '', floorPlanUrl: '' },
  contact: { contactName: '', phone: '', whatsapp: '', email: '', termsAccepted: false },
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

const INITIAL_SP_DATA: SparePartsFormData = {
  subcategory: '',
  title: '',
  description: '',
  price: '',
  currency: 'AFN',
  condition: '',
  brand: '',
  city: '',
  seller_type: '',
  make: '',
  model: '',
  year_from: '',
  year_to: '',
  engine_type: '',
  transmission: '',
  part_compatibility_notes: '',
  device_type: '',
  compatible_brand: '',
  compatible_model: '',
  version_series: '',
  technical_compatibility_notes: '',
  lat: null,
  lng: null,
  phone: '',
  whatsapp: '',
  email: '',
  termsAccepted: false,
  specs: {},
  media: {
    images: [],
    has_video: false,
    video: '',
  },
};

const INITIAL_HB_DATA: HealthBeautyFormData = {
  subcategory: '',
  title: '',
  description: '',
  price: '',
  currency: 'AFN',
  condition: '',
  brand: '',
  seller_type: '',
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
    has_video: false,
    video: '',
  },
};

const INITIAL_HF_DATA: HomeFurnitureFormData = {
  subcategory: '',
  title: '',
  description: '',
  price: '',
  condition: '',
  brand: '',
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

const INITIAL_SERVICES_DATA: ServicesFormData = {
  subcategory: '',
  service_type: '',
  title: '',
  description: '',
  city: '',
  area: '',
  service_radius_km: '',
  multiple_cities: [],
  days_available: [],
  working_hours_from: '',
  working_hours_to: '',
  emergency_service: false,
  advance_booking_required: false,
  pricing_type: '',
  price: '',
  currency: 'AFN',
  negotiable: false,
  call_out_fee: false,
  call_out_fee_amount: '',
  contact_name: '',
  lat: null,
  lng: null,
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  social_media_links: '',
  termsAccepted: false,
  specs: {},
  media: {
    images: [],
    has_video: false,
    video: '',
    has_documents: false,
    documents: '',
  },
};

const INITIAL_JOBS_DATA: JobsFormData = {
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
  termsAccepted: false,
  photos: { photos: [] },
};

// Default steps for non-specialized categories
const DEFAULT_STEPS = ['stepCategory', 'stepDetails', 'stepPhotos', 'stepContact'] as const;
// Real estate steps
const RE_STEPS = [
  'stepCategory',
  'reStepBasic',
  'reStepLocation',
  'reStepPricing',
  'reStepSpecs',
  'reStepAmenities',
  'reStepMedia',
  'reStepContact',
] as const;
// Vehicle steps
const VH_STEPS = ['stepCategory', 'vhStepType', 'vhStepSpecs', 'vhStepCondition', 'vhStepAddress', 'vhStepMedia', 'vhStepContact'] as const;
// Electronics steps
const EL_STEPS = ['stepCategory', 'elStepBasic', 'elStepSpecs', 'elStepMedia', 'elStepDetails', 'elStepContact', 'elStepReview'] as const;
// Fashion & Clothing steps
const FA_STEPS = ['stepCategory', 'faStepBasic', 'faStepGeneral', 'faStepSpecs', 'faStepMedia', 'faStepContact', 'faStepReview'] as const;
// Spare parts steps
const SP_STEPS = ['stepCategory', 'spStepBasic', 'spStepGeneral', 'spStepCompatibility', 'spStepSpecs', 'spStepMedia', 'spStepContact', 'spStepReview'] as const;
// Health & Beauty steps
const HB_STEPS = ['stepCategory', 'hbStepBasic', 'hbStepGeneral', 'hbStepSpecs', 'hbStepMedia', 'hbStepContact', 'hbStepReview'] as const;
// Home & Furniture steps
const HF_STEPS = ['stepCategory', 'hfStepBasic', 'hfStepGeneral', 'hfStepSpecs', 'hfStepMedia', 'hfStepContact', 'hfStepReview'] as const;
// Services steps
const SERVICES_STEPS = ['stepCategory', 'srvStepBasic', 'srvStepLocation', 'srvStepPricing', 'srvStepDetails', 'srvStepMedia', 'srvStepContact', 'srvStepReview'] as const;
// Jobs steps
const JOBS_STEPS = ['stepCategory', 'jobStepBasic', 'jobStepDescription', 'jobStepCompensation', 'jobStepContact', 'jobStepReview'] as const;

const isFashionSlug = (categorySlug: string | null): boolean => {
  if (!categorySlug) return false;
  return FASHION_SLUGS.includes(categorySlug);
};

const getStepsForCategorySlug = (categorySlug: string | null): readonly string[] => {
  if (categorySlug === REAL_ESTATE_SLUG) return RE_STEPS;
  if (categorySlug === VEHICLES_SLUG) return VH_STEPS;
  if (categorySlug === ELECTRONICS_SLUG) return EL_STEPS;
  if (isFashionSlug(categorySlug)) return FA_STEPS;
  if (categorySlug === SPARE_PARTS_SLUG) return SP_STEPS;
  if (categorySlug && HEALTH_BEAUTY_SLUGS.includes(categorySlug)) return HB_STEPS;
  if (categorySlug && HOME_FURNITURE_SLUGS.includes(categorySlug)) return HF_STEPS;
  if (categorySlug && SERVICES_SLUGS.includes(categorySlug)) return SERVICES_STEPS;
  if (categorySlug && JOBS_SLUGS.includes(categorySlug)) return JOBS_STEPS;
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
  | typeof FA_STEPS[number]
  | typeof SP_STEPS[number]
  | typeof HB_STEPS[number]
  | typeof HF_STEPS[number]
  | typeof SERVICES_STEPS[number]
  | typeof JOBS_STEPS[number];

interface PostAdWizardProps {
  locale: Locale;
}

export const PostAdWizard: React.FC<PostAdWizardProps> = ({ locale }) => {
  const t = useTranslations('postAd');
  const tREWizard = useTranslations('realEstateWizard');
  const tVH = useTranslations('postAd.vehicles');
  const tEL = useTranslations('postAd.electronics');
  const tFA = useTranslations('postAd.fashion');
  const tSP = useTranslations('postAd.spareParts');
  const tHB = useTranslations('postAd.healthBeauty');
  const tHF = useTranslations('postAd.homeFurniture');
  const tSRV = useTranslations('postAd.services');
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
  const [spData, setSpData] = useState<SparePartsFormData>(INITIAL_SP_DATA);
  const [hbData, setHbData] = useState<HealthBeautyFormData>(INITIAL_HB_DATA);
  const [hfData, setHfData] = useState<HomeFurnitureFormData>(INITIAL_HF_DATA);
  const [srvData, setSrvData] = useState<ServicesFormData>(INITIAL_SERVICES_DATA);
  const [jobsData, setJobsData] = useState<JobsFormData>(INITIAL_JOBS_DATA);
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
  const reSpecsRef = useRef<StepRealEstateSpecsHandle>(null);

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

  const updateSPData = useCallback((updates: Partial<SparePartsFormData>) => {
    setSpData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateHBData = useCallback((updates: Partial<HealthBeautyFormData>) => {
    setHbData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateHFData = useCallback((updates: Partial<HomeFurnitureFormData>) => {
    setHfData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSRVData = useCallback((updates: Partial<ServicesFormData>) => {
    setSrvData((prev) => ({ ...prev, ...updates }));
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
        setSpData(INITIAL_SP_DATA);
        setHbData(INITIAL_HB_DATA);
        setHfData(INITIAL_HF_DATA);
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
  }, [formData.categoryId, supabase, locale]);

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
      const draftSpData = (draftData.spData || {}) as Partial<SparePartsFormData>;
      const draftHbData = (draftData.hbData || {}) as Partial<HealthBeautyFormData>;
      const draftHfData = (draftData.hfData || {}) as Partial<HomeFurnitureFormData>;
      const draftSrvData = (draftData.srvData || {}) as Partial<ServicesFormData>;
      const draftJobsData = (draftData.jobsData || {}) as Partial<JobsFormData>;
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
        listingType: draftReData.listingType ?? INITIAL_RE_DATA.listingType,
        propertyDetails: {
          ...INITIAL_RE_DATA.propertyDetails,
          ...((draftReData.propertyDetails as Partial<RealEstateSpecsData> | undefined) || {}),
        },
        address: {
          ...INITIAL_RE_DATA.address,
          ...((draftReData.address as Partial<RealEstateLocationData> | undefined) || {}),
        },
        amenities: {
          ...INITIAL_RE_DATA.amenities,
          ...((draftReData.amenities as Partial<RealEstateAmenitiesData> | undefined) || {}),
        },
        media: {
          ...INITIAL_RE_DATA.media,
          ...((draftReData.media as Partial<MediaData> | undefined) || {}),
        },
        contact: {
          ...INITIAL_RE_DATA.contact,
          ...((draftReData.contact as Partial<RealEstateContactData> | undefined) || {}),
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
      setSpData({
        ...INITIAL_SP_DATA,
        ...draftSpData,
        subcategory: draftSpData.subcategory ?? INITIAL_SP_DATA.subcategory,
        specs: {
          ...INITIAL_SP_DATA.specs,
          ...((draftSpData.specs as Record<string, unknown> | undefined) || {}),
        },
        media: {
          ...INITIAL_SP_DATA.media,
          ...((draftSpData.media as Partial<SpareMediaData> | undefined) || {}),
        },
      });
      setHbData({
        ...INITIAL_HB_DATA,
        ...draftHbData,
        subcategory: draftHbData.subcategory ?? INITIAL_HB_DATA.subcategory,
        specs: {
          ...INITIAL_HB_DATA.specs,
          ...((draftHbData.specs as Record<string, unknown> | undefined) || {}),
        },
        media: {
          ...INITIAL_HB_DATA.media,
          ...((draftHbData.media as Partial<HealthMediaData> | undefined) || {}),
        },
      });
      setHfData({
        ...INITIAL_HF_DATA,
        ...draftHfData,
        subcategory: draftHfData.subcategory ?? INITIAL_HF_DATA.subcategory,
        specs: {
          ...INITIAL_HF_DATA.specs,
          ...((draftHfData.specs as Record<string, unknown> | undefined) || {}),
        },
        media: {
          ...INITIAL_HF_DATA.media,
          ...((draftHfData.media as Partial<HomeFurnitureMediaData> | undefined) || {}),
        },
      });
      setSrvData({
        ...INITIAL_SERVICES_DATA,
        ...draftSrvData,
        subcategory: draftSrvData.subcategory ?? INITIAL_SERVICES_DATA.subcategory,
        specs: {
          ...INITIAL_SERVICES_DATA.specs,
          ...((draftSrvData.specs as Record<string, unknown> | undefined) || {}),
        },
        media: {
          ...INITIAL_SERVICES_DATA.media,
          ...((draftSrvData.media as Partial<ServicesMediaData> | undefined) || {}),
        },
      });
      setJobsData({
        ...INITIAL_JOBS_DATA,
        ...draftJobsData,
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
  const isSpareParts = selectedCategorySlug === SPARE_PARTS_SLUG;
  const isHealthBeauty = (selectedCategorySlug ? HEALTH_BEAUTY_SLUGS.includes(selectedCategorySlug) : false) || formData.categoryId === HEALTH_BEAUTY_CATEGORY_ID;
  const isHomeFurniture = selectedCategorySlug ? HOME_FURNITURE_SLUGS.includes(selectedCategorySlug) : false;
  const isServices = selectedCategorySlug ? SERVICES_SLUGS.includes(selectedCategorySlug) : false;
  const isJobs = selectedCategorySlug ? JOBS_SLUGS.includes(selectedCategorySlug) : false;
  const steps: readonly string[] = isJobs ? JOBS_STEPS : isServices ? SERVICES_STEPS : isHomeFurniture ? HF_STEPS : isHealthBeauty ? HB_STEPS : getStepsForCategorySlug(selectedCategorySlug);

  const getStepLabel = (step: string): string => {
    switch (step) {
      case 'stepCategory': return isRealEstate ? tREWizard('stepper.step1') : t('stepCategory');
      case 'stepDetails': return t('stepDetails');
      case 'stepPhotos': return t('stepPhotos');
      case 'stepContact': return t('stepContact');
      case 'reStepBasic': return tREWizard('stepper.step2');
      case 'reStepLocation': return tREWizard('stepper.step3');
      case 'reStepPricing': return tREWizard('stepper.step4');
      case 'reStepSpecs': return tREWizard('stepper.step5');
      case 'reStepAmenities': return tREWizard('stepper.step6');
      case 'reStepMedia': return tREWizard('stepper.step7');
      case 'reStepContact': return tREWizard('stepper.step8');
      case 'vhStepType': return tVH('stepType');
      case 'vhStepSpecs': return tVH('stepSpecs');
      case 'vhStepCondition': return tVH('stepCondition');
      case 'vhStepAddress': return tVH('stepAddress');
      case 'vhStepMedia': return tVH('stepMedia');
      case 'vhStepContact': return tVH('stepContact');
      case 'elStepBasic': return tEL('stepBasic');
      case 'elStepSpecs': return tEL('stepSpecs');
      case 'elStepMedia': return tEL('stepMedia');
      case 'elStepDetails': return tEL('stepDetails');
      case 'elStepContact': return tEL('stepContact');
      case 'elStepReview': return tEL('stepReview');
      case 'faStepBasic': return tFA('stepBasic');
      case 'faStepGeneral': return tFA('stepGeneral');
      case 'faStepSpecs': return tFA('stepSpecs');
      case 'faStepMedia': return tFA('stepMedia');
      case 'faStepContact': return tFA('stepContact');
      case 'faStepReview': return tFA('stepReview');
      case 'spStepBasic': return tSP('stepBasic');
      case 'spStepGeneral': return tSP('stepGeneral');
      case 'spStepCompatibility': return tSP('stepCompatibility');
      case 'spStepSpecs': return tSP('stepSpecs');
      case 'spStepMedia': return tSP('stepMedia');
      case 'spStepContact': return tSP('stepContact');
      case 'spStepReview': return tSP('stepReview');
      case 'hbStepBasic': return tHB('stepBasic');
      case 'hbStepGeneral': return tHB('stepGeneral');
      case 'hbStepSpecs': return tHB('stepSpecs');
      case 'hbStepMedia': return tHB('stepMedia');
      case 'hbStepContact': return tHB('stepContact');
      case 'hbStepReview': return tHB('stepReview');
      case 'hfStepBasic': return tHF('stepBasic');
      case 'hfStepGeneral': return tHF('stepGeneral');
      case 'hfStepSpecs': return tHF('stepSpecs');
      case 'hfStepMedia': return tHF('stepMedia');
      case 'hfStepContact': return tHF('stepContact');
      case 'hfStepReview': return tHF('stepReview');
      case 'srvStepBasic': return tSRV('stepBasic');
      case 'srvStepLocation': return tSRV('stepLocation');
      case 'srvStepPricing': return tSRV('stepPricing');
      case 'srvStepDetails': return tSRV('stepDetails');
      case 'srvStepMedia': return tSRV('stepMedia');
      case 'srvStepContact': return tSRV('stepContact');
      case 'srvStepReview': return tSRV('stepReview');
      default: return '';
    }
  };

  const currentStepKey = steps[currentStep] as StepKey;

  const fallbackDynamicSteps = new Set<StepKey>(['stepDetails', 'reStepSpecs', 'vhStepSpecs']);
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
      case 'reStepBasic':
        return (
          reData.propertyType !== '' &&
          reData.listingType !== '' &&
          reData.propertyDetails.title.trim().length >= 3 &&
          reData.propertyDetails.description.trim().length >= 10
        );
      case 'reStepLocation':
        return reData.address.city !== '';
      case 'reStepPricing':
        return (
          reData.propertyDetails.price !== '' &&
          reData.propertyDetails.currency !== '' &&
          reData.propertyDetails.price_type !== '' &&
          reData.propertyDetails.available_from !== ''
        );
      case 'reStepSpecs':
        return requiredDynamicValid;
      case 'reStepAmenities':
        return true;
      case 'reStepMedia':
        return reData.media.photos.length >= 1;
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
        return elData.city !== '' && elData.sellerType !== '';
      case 'elStepContact':
        return elData.phone.trim() !== '' && elData.termsAccepted;
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
      // Spare parts steps
      case 'spStepBasic':
        return spData.title.trim().length >= 3 && spData.description.trim().length >= 10 && spData.subcategory !== '';
      case 'spStepGeneral':
        return spData.price !== '' && spData.currency !== '' && spData.condition !== '' && spData.brand.trim() !== '' && spData.seller_type !== '';
      case 'spStepCompatibility': {
        if (VEHICLE_SPARE_SUBCATEGORIES.includes(spData.subcategory as SparePartsSubcategory)) {
          return (
            spData.make.trim() !== ''
            && spData.model.trim() !== ''
            && spData.year_from.trim() !== ''
            && spData.year_to.trim() !== ''
            && spData.engine_type.trim() !== ''
            && spData.transmission.trim() !== ''
          );
        }

        if (ELECTRONICS_OR_MACHINERY_SUBCATEGORIES.includes(spData.subcategory as SparePartsSubcategory)) {
          return (
            spData.device_type.trim() !== ''
            && spData.compatible_brand.trim() !== ''
            && spData.compatible_model.trim() !== ''
          );
        }

        return true;
      }
      case 'spStepSpecs':
        return typeof spData.specs.part_name === 'string'
          && (spData.specs.part_name as string).trim().length > 0
          && typeof spData.specs.part_type === 'string'
          && (spData.specs.part_type as string).trim().length > 0
          && typeof spData.specs.oem_aftermarket === 'string'
          && (spData.specs.oem_aftermarket as string).trim().length > 0
          && typeof spData.specs.availability === 'string'
          && (spData.specs.availability as string).trim().length > 0;
      case 'spStepMedia':
        return spData.media.images.length >= 1;
      case 'spStepContact':
        return spData.city.trim() !== '' && spData.phone.trim() !== '' && spData.termsAccepted;
      case 'spStepReview':
        return true;
      // Health & Beauty steps
      case 'hbStepBasic':
        return hbData.title.trim().length >= 3 && hbData.description.trim().length >= 10 && hbData.subcategory !== '';
      case 'hbStepGeneral':
        return hbData.price !== '' && hbData.currency !== '' && hbData.condition !== '' && hbData.brand.trim() !== '' && hbData.seller_type !== '';
      case 'hbStepSpecs': {
        const fields = getHealthBeautySpecsConfig(hbData.subcategory);
        return fields.every((field) => {
          const value = hbData.specs[field.key];
          if (field.key === 'spf_value' && hbData.specs.has_spf !== true) return true;
          if (!field.required) return true;
          if (field.type === 'multiselect') return Array.isArray(value) && value.length > 0;
          if (field.type === 'toggle') return typeof value === 'boolean';
          return typeof value === 'string' && value.trim().length > 0;
        });
      }
      case 'hbStepMedia':
        return hbData.media.images.length >= 1;
      case 'hbStepContact':
        return hbData.city.trim() !== '' && hbData.phone.trim() !== '' && hbData.termsAccepted;
      case 'hbStepReview':
        return true;
      // Home & Furniture steps
      case 'hfStepBasic':
        return hfData.title.trim().length >= 3 && hfData.description.trim().length >= 10 && hfData.subcategory !== '';
      case 'hfStepGeneral':
        return hfData.price !== '' && hfData.condition !== '' && hfData.sellerType !== '';
      case 'hfStepSpecs': {
        const fields = getHomeFurnitureSpecsConfig(hfData.subcategory);
        return fields.every((field) => {
          if (!field.required) return true;
          const value = hfData.specs[field.key];
          if (field.type === 'multiselect') return Array.isArray(value) && value.length > 0;
          if (field.type === 'toggle') return typeof value === 'boolean';
          return typeof value === 'string' && value.trim().length > 0;
        });
      }
      case 'hfStepMedia':
        return hfData.media.images.length >= 1;
      case 'hfStepContact':
        return hfData.city.trim() !== '' && hfData.phone.trim() !== '' && hfData.termsAccepted;
      case 'hfStepReview':
        return true;
      // Services steps
      case 'srvStepBasic':
        return srvData.title.trim().length >= 3 && srvData.description.trim().length >= 10 && srvData.subcategory !== '' && srvData.service_type !== '';
      case 'srvStepLocation':
        return srvData.city !== '';
      case 'srvStepPricing':
        return srvData.pricing_type !== '' && srvData.price !== '' && srvData.currency !== '';
      case 'srvStepDetails': {
        const fields = getServicesSpecsConfig(srvData.subcategory as ServicesSubcategory);
        return fields.every((field) => {
          if (!field.required) return true;
          const value = srvData.specs[field.key];
          if (field.type === 'multiselect') return Array.isArray(value) && value.length > 0;
          if (field.type === 'toggle') return typeof value === 'boolean';
          return typeof value === 'string' && value.trim().length > 0;
        });
      }
      case 'srvStepMedia':
        return srvData.media.images.length >= 1;
      case 'srvStepContact':
        return srvData.city.trim() !== '' && srvData.phone.trim() !== '' && srvData.termsAccepted;
      case 'srvStepReview':
        return true;
      // Jobs steps
      case 'jobStepBasic':
        return jobsData.jobTitle.trim().length >= 3 && jobsData.employmentType !== '';
      case 'jobStepDescription':
        return jobsData.jobDescription.trim().length >= 20 && jobsData.experienceLevel !== '';
      case 'jobStepCompensation':
        // Either salary range is provided OR salaryNotDisclosed is true
        const hasSalaryRange = jobsData.minSalary !== '' && jobsData.maxSalary !== '';
        const salaryValid = jobsData.salaryNotDisclosed || (hasSalaryRange && Number(jobsData.minSalary) <= Number(jobsData.maxSalary));
        const applicationValid = jobsData.applicationMethod !== '' &&
          (jobsData.applicationMethod === 'email' ? jobsData.applicationEmail.trim() !== '' : jobsData.applicationUrl.trim() !== '');
        return salaryValid && applicationValid;
      case 'jobStepContact':
        return jobsData.contactPhone.trim() !== '' && jobsData.contactEmail.trim() !== '' && jobsData.termsAccepted;
      case 'jobStepReview':
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
    if (currentStepKey === 'reStepSpecs' && reSpecsRef.current) {
      const valid = await reSpecsRef.current.validate();
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
          listingType: reData.listingType,
          ...reData.propertyDetails,
          amenities: reData.amenities,
          address: reData.address,
          contact: reData.contact,
          wizard_forms: wizardValues,
        };
        title = reData.propertyDetails.title || title;
        description = reData.propertyDetails.description || description;
        price = Number(reData.propertyDetails.price) || price;
        currency = reData.propertyDetails.currency || currency;
        city = reData.address.city || city;
        _phone = reData.contact.phone || _phone;
        condition = reData.propertyDetails.condition || condition;
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
      } else if (isSpareParts) {
        metadata = {
          subcategory: spData.subcategory,
          condition: spData.condition,
          brand: spData.brand,
          city: spData.city,
          seller_type: spData.seller_type,
          make: spData.make,
          model: spData.model,
          year_from: spData.year_from,
          year_to: spData.year_to,
          engine_type: spData.engine_type,
          transmission: spData.transmission,
          part_compatibility_notes: spData.part_compatibility_notes,
          device_type: spData.device_type,
          compatible_brand: spData.compatible_brand,
          compatible_model: spData.compatible_model,
          version_series: spData.version_series,
          technical_compatibility_notes: spData.technical_compatibility_notes,
          lat: spData.lat,
          lng: spData.lng,
          phone: spData.phone,
          whatsapp: spData.whatsapp,
          email: spData.email,
          ...spData.specs,
          media: {
            video: spData.media.video,
          },
          wizard_forms: wizardValues,
        };
        title = spData.title || title;
        description = spData.description || description;
        price = Number(spData.price) || price;
        currency = spData.currency || currency;
        city = spData.city || city;
        _phone = spData.phone || _phone;
        condition = (spData.condition || condition || 'good') as string;
        photosList = spData.media.images;
      } else if (isHealthBeauty) {
        metadata = {
          subcategory: hbData.subcategory,
          condition: hbData.condition,
          brand: hbData.brand,
          seller_type: hbData.seller_type,
          ...hbData.specs,
          location: {
            city: hbData.city,
            lat: hbData.lat,
            lng: hbData.lng,
          },
          contact: {
            phone: hbData.phone,
            whatsapp: hbData.whatsapp,
            email: hbData.email,
          },
          media: {
            video: hbData.media.video,
          },
          wizard_forms: wizardValues,
        };
        title = hbData.title || title;
        description = hbData.description || description;
        price = Number(hbData.price) || price;
        currency = hbData.currency || currency;
        city = hbData.city || city;
        _phone = hbData.phone || _phone;
        condition = (hbData.condition || condition || 'good') as string;
        photosList = hbData.media.images;
      } else if (isHomeFurniture) {
        metadata = {
          subcategory: hfData.subcategory,
          condition: hfData.condition,
          brand: hfData.brand,
          sellerType: hfData.sellerType,
          ...hfData.specs,
          location: {
            city: hfData.city,
            lat: hfData.lat,
            lng: hfData.lng,
          },
          contact: {
            phone: hfData.phone,
            whatsapp: hfData.whatsapp,
            email: hfData.email,
          },
          media: {
            video: hfData.media.video,
          },
          wizard_forms: wizardValues,
        };
        title = hfData.title || title;
        description = hfData.description || description;
        price = Number(hfData.price) || price;
        city = hfData.city || city;
        _phone = hfData.phone || _phone;
        condition = (hfData.condition || condition || 'good') as string;
        photosList = hfData.media.images;
      } else if (isServices) {
        metadata = {
          subcategory: srvData.subcategory,
          service_type: srvData.service_type,
          pricing_type: srvData.pricing_type,
          currency: srvData.currency,
          negotiable: srvData.negotiable,
          call_out_fee: srvData.call_out_fee,
          call_out_fee_amount: srvData.call_out_fee_amount,
          city: srvData.city,
          area: srvData.area,
          service_radius_km: srvData.service_radius_km,
          multiple_cities: srvData.multiple_cities,
          days_available: srvData.days_available,
          working_hours_from: srvData.working_hours_from,
          working_hours_to: srvData.working_hours_to,
          emergency_service: srvData.emergency_service,
          advance_booking_required: srvData.advance_booking_required,
          ...srvData.specs,
          location: {
            city: srvData.city,
            lat: srvData.lat,
            lng: srvData.lng,
          },
          contact: {
            contact_name: srvData.contact_name,
            phone: srvData.phone,
            whatsapp: srvData.whatsapp,
            email: srvData.email,
            website: srvData.website,
            social_media_links: srvData.social_media_links,
          },
          media: {
            video: srvData.media.video,
            documents: srvData.media.documents,
          },
          wizard_forms: wizardValues,
        };
        title = srvData.title || title;
        description = srvData.description || description;
        price = Number(srvData.price) || price;
        currency = srvData.currency || currency;
        city = srvData.city || city;
        _phone = srvData.phone || _phone;
        photosList = srvData.media.images;
      } else {
        metadata = {
          ...metadata,
          wizard_forms: wizardValues,
        };
      }

      // Insert listing via server API (normalizes and validates metadata)
      const resp = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          photos: photosList,
        }),
      });

      // Log response details for debugging
      console.log('API Response status:', resp.status, resp.statusText);
      
      const responseText = await resp.text();
      console.log('API Response text:', responseText);
      
      interface ApiResponse {
        id?: string;
        error?: string;
        details?: string;
        [key: string]: unknown;
      }
      
      let json: ApiResponse = {};
      try {
        json = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse API response as JSON:', e);
        console.error('Raw response:', responseText);
      }
      
      if (!resp.ok || json.error) {
        console.error('Listing insert failed (server):', {
          status: resp.status,
          statusText: resp.statusText,
          json,
          responseText
        });
        throw new Error(json.error || 'Failed to insert listing');
      }

      const listing = { id: json.id };

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
    setSpData(INITIAL_SP_DATA);
    setHbData(INITIAL_HB_DATA);
    setHfData(INITIAL_HF_DATA);
    setSrvData(INITIAL_SERVICES_DATA);
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

  const handleClearSparePartsForm = () => {
    setSpData(INITIAL_SP_DATA);
    setCurrentStep(1);
    setSubmitError(null);
  };

  const handleClearHealthBeautyForm = () => {
    setHbData(INITIAL_HB_DATA);
    setCurrentStep(1);
    setSubmitError(null);
  };

  const handleClearHomeFurnitureForm = () => {
    setHfData(INITIAL_HF_DATA);
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
      else if (isSpareParts) draftData = { ...draftData, spData };
      else if (isHealthBeauty) draftData = { ...draftData, hbData };
      else if (isHomeFurniture) draftData = { ...draftData, hfData };
      else if (isServices) draftData = { ...draftData, srvData };
      else if (isJobs) draftData = { ...draftData, jobsData };

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
      case 'reStepBasic':
        return (
          <StepRealEstateBasicInfo
            locale={locale}
            propertyType={reData.propertyType}
            listingType={reData.listingType}
            title={reData.propertyDetails.title}
            description={reData.propertyDetails.description}
            onChange={(data) => {
              if (data.propertyType || data.listingType) {
                updateREData(data as Partial<RealEstateFormData>);
              } else {
                setReData((prev) => ({
                  ...prev,
                  propertyDetails: { ...prev.propertyDetails, ...data },
                }));
              }
            }}
          />
        );
      case 'reStepLocation':
        return (
          <StepRealEstateLocation
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
      case 'reStepPricing':
        return (
          <StepRealEstatePricing
            locale={locale}
            listingType={reData.listingType as ListingType}
            data={{
              price: reData.propertyDetails.price,
              currency: reData.propertyDetails.currency,
              price_type: reData.propertyDetails.price_type as RealEstatePriceType,
              negotiable: reData.propertyDetails.negotiable,
              available_from: reData.propertyDetails.available_from,
              furnishing: reData.propertyDetails.furnishing as RealEstateFurnishing,
            }}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                propertyDetails: { ...prev.propertyDetails, ...data },
              }))
            }
          />
        );
      case 'reStepSpecs':
        return (
          <StepRealEstateSpecs
            ref={reSpecsRef}
            locale={locale}
            propertyType={reData.propertyType || 'other'}
            data={reData.propertyDetails}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                propertyDetails: { ...prev.propertyDetails, ...data },
              }))
            }
          />
        );
      case 'reStepAmenities':
        return (
          <StepRealEstateAmenities
            locale={locale}
            data={reData.amenities}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                amenities: { ...prev.amenities, ...data },
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
          <StepRealEstateContactReview
            locale={locale}
            contact={reData.contact}
            location={reData.address}
            pricing={{
              price: reData.propertyDetails.price,
              currency: reData.propertyDetails.currency,
              price_type: reData.propertyDetails.price_type as RealEstatePriceType,
              negotiable: reData.propertyDetails.negotiable,
              available_from: reData.propertyDetails.available_from,
              furnishing: reData.propertyDetails.furnishing as RealEstateFurnishing,
            }}
            specs={reData.propertyDetails}
            amenities={reData.amenities}
            onChange={(data) =>
              setReData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...data },
              }))
            }
            onJumpToStep={(stepIndex) => setCurrentStep(stepIndex)}
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
            }}
            onChange={(detailsUpdate) => {
              updateELData(detailsUpdate as Partial<ElectronicsFormData>);
            }}
          />
        );
      case 'elStepContact':
        return (
          <StepElectronicsContact
            locale={locale}
            data={{
              phone: elData.phone,
              whatsapp: elData.whatsapp,
              email: elData.email,
              termsAccepted: elData.termsAccepted,
            }}
            onChange={(contactUpdate) => {
              updateELData(contactUpdate as Partial<ElectronicsFormData>);
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
      // Spare parts steps
      case 'spStepBasic':
        return (
          <StepSpareBasicInfo
            locale={locale}
            data={{
              title: spData.title,
              description: spData.description,
              subcategory: spData.subcategory,
            }}
            onChange={(updates) => {
              if (updates.subcategory !== undefined && updates.subcategory !== spData.subcategory) {
                updateSPData({
                  ...updates,
                  make: '',
                  model: '',
                  year_from: '',
                  year_to: '',
                  engine_type: '',
                  transmission: '',
                  part_compatibility_notes: '',
                  device_type: '',
                  compatible_brand: '',
                  compatible_model: '',
                  version_series: '',
                  technical_compatibility_notes: '',
                  city: '',
                  lat: null,
                  lng: null,
                  phone: '',
                  whatsapp: '',
                  email: '',
                  termsAccepted: false,
                  specs: {},
                });
                return;
              }
              updateSPData(updates);
            }}
          />
        );
      case 'spStepGeneral':
        return (
          <StepSpareGeneralDetails
            locale={locale}
            data={{
              price: spData.price,
              currency: spData.currency,
              condition: spData.condition,
              brand: spData.brand,
              seller_type: spData.seller_type,
            }}
            onChange={(updates) => updateSPData(updates)}
          />
        );
      case 'spStepCompatibility':
        return (
          <StepSpareCompatibility
            locale={locale}
            subcategory={spData.subcategory}
            data={{
              make: spData.make,
              model: spData.model,
              year_from: spData.year_from,
              year_to: spData.year_to,
              engine_type: spData.engine_type,
              transmission: spData.transmission,
              part_compatibility_notes: spData.part_compatibility_notes,
              device_type: spData.device_type,
              compatible_brand: spData.compatible_brand,
              compatible_model: spData.compatible_model,
              version_series: spData.version_series,
              technical_compatibility_notes: spData.technical_compatibility_notes,
            }}
            onChange={(updates) => updateSPData(updates)}
          />
        );
      case 'spStepSpecs':
        return (
          <StepSpareSpecifications
            locale={locale}
            subcategory={spData.subcategory}
            specs={spData.specs}
            onChange={(specs) => updateSPData({ specs })}
          />
        );
      case 'spStepMedia':
        return (
          <StepSpareMedia
            locale={locale}
            data={spData.media}
            onChange={(updates) => updateSPData({ media: { ...spData.media, ...updates } })}
          />
        );
      case 'spStepContact':
        return (
          <StepSpareContact
            locale={locale}
            data={{
              city: spData.city,
              lat: spData.lat,
              lng: spData.lng,
              phone: spData.phone,
              whatsapp: spData.whatsapp,
              email: spData.email,
              termsAccepted: spData.termsAccepted,
            }}
            onChange={(updates) => updateSPData(updates)}
          />
        );
      case 'spStepReview':
        return (
          <StepSpareReview
            locale={locale}
            basic={{
              title: spData.title,
              description: spData.description,
              subcategory: spData.subcategory,
            }}
            general={{
              price: spData.price,
              currency: spData.currency,
              condition: spData.condition,
              brand: spData.brand,
              seller_type: spData.seller_type,
            }}
            contact={{
              city: spData.city,
              lat: spData.lat,
              lng: spData.lng,
              phone: spData.phone,
              whatsapp: spData.whatsapp,
              email: spData.email,
            }}
            compatibility={{
              make: spData.make,
              model: spData.model,
              year_from: spData.year_from,
              year_to: spData.year_to,
              engine_type: spData.engine_type,
              transmission: spData.transmission,
              part_compatibility_notes: spData.part_compatibility_notes,
              device_type: spData.device_type,
              compatible_brand: spData.compatible_brand,
              compatible_model: spData.compatible_model,
              version_series: spData.version_series,
              technical_compatibility_notes: spData.technical_compatibility_notes,
            }}
            specs={spData.specs}
            media={spData.media}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      // Health & Beauty steps
      case 'hbStepBasic':
        return (
          <StepHealthBasicInfo
            locale={locale}
            data={{
              title: hbData.title,
              description: hbData.description,
              subcategory: hbData.subcategory,
            }}
            onChange={(updates) => {
              if (updates.subcategory !== undefined && updates.subcategory !== hbData.subcategory) {
                updateHBData({
                  ...updates,
                  specs: {},
                });
                return;
              }
              updateHBData(updates);
            }}
          />
        );
      case 'hbStepGeneral':
        return (
          <StepHealthGeneralDetails
            locale={locale}
            data={{
              price: hbData.price,
              currency: hbData.currency,
              condition: hbData.condition,
              brand: hbData.brand,
              seller_type: hbData.seller_type,
            }}
            onChange={(updates) => updateHBData(updates)}
          />
        );
      case 'hbStepSpecs':
        return (
          <StepHealthSpecs
            locale={locale}
            subcategory={hbData.subcategory}
            specs={hbData.specs}
            onChange={(specs) => updateHBData({ specs })}
          />
        );
      case 'hbStepMedia':
        return (
          <StepHealthMedia
            locale={locale}
            data={hbData.media}
            onChange={(updates) => updateHBData({ media: { ...hbData.media, ...updates } })}
          />
        );
      case 'hbStepContact':
        return (
          <StepHealthContact
            locale={locale}
            data={{
              city: hbData.city,
              lat: hbData.lat,
              lng: hbData.lng,
              phone: hbData.phone,
              whatsapp: hbData.whatsapp,
              email: hbData.email,
              termsAccepted: hbData.termsAccepted,
            }}
            onChange={(updates) => updateHBData(updates)}
          />
        );
      case 'hbStepReview':
        return (
          <StepHealthReview
            locale={locale}
            basic={{
              title: hbData.title,
              description: hbData.description,
              subcategory: hbData.subcategory,
            }}
            general={{
              price: hbData.price,
              currency: hbData.currency,
              condition: hbData.condition,
              brand: hbData.brand,
              seller_type: hbData.seller_type,
            }}
            specs={hbData.specs}
            media={hbData.media}
            contact={{
              city: hbData.city,
              lat: hbData.lat,
              lng: hbData.lng,
              phone: hbData.phone,
              whatsapp: hbData.whatsapp,
              email: hbData.email,
            }}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      // Home & Furniture steps
      case 'hfStepBasic':
        return (
          <StepHomeFurnitureBasicInfo
            locale={locale}
            data={{
              title: hfData.title,
              description: hfData.description,
              subcategory: hfData.subcategory,
            }}
            onChange={(updates) => {
              if (updates.subcategory !== undefined && updates.subcategory !== hfData.subcategory) {
                updateHFData({ ...updates, specs: {} });
                return;
              }
              updateHFData(updates);
            }}
          />
        );
      case 'hfStepGeneral':
        return (
          <StepHomeFurnitureGeneralDetails
            locale={locale}
            data={{
              price: hfData.price,
              condition: hfData.condition,
              brand: hfData.brand,
              sellerType: hfData.sellerType,
            }}
            onChange={(updates) => updateHFData(updates)}
          />
        );
      case 'hfStepSpecs':
        return (
          <StepHomeFurnitureSpecs
            locale={locale}
            subcategory={hfData.subcategory}
            specs={hfData.specs}
            onChange={(specs) => updateHFData({ specs })}
          />
        );
      case 'hfStepMedia':
        return (
          <StepHomeFurnitureMedia
            locale={locale}
            data={hfData.media}
            onChange={(updates) => updateHFData({ media: { ...hfData.media, ...updates } })}
          />
        );
      case 'hfStepContact':
        return (
          <StepHomeFurnitureContact
            locale={locale}
            data={{
              city: hfData.city,
              lat: hfData.lat,
              lng: hfData.lng,
              phone: hfData.phone,
              whatsapp: hfData.whatsapp,
              email: hfData.email,
              termsAccepted: hfData.termsAccepted,
            }}
            onChange={(updates) => updateHFData(updates)}
          />
        );
      case 'hfStepReview':
        return (
          <StepHomeFurnitureReview
            locale={locale}
            title={hfData.title}
            description={hfData.description}
            subcategory={hfData.subcategory}
            price={hfData.price}
            condition={hfData.condition}
            brand={hfData.brand}
            sellerType={hfData.sellerType}
            city={hfData.city}
            lat={hfData.lat}
            lng={hfData.lng}
            phone={hfData.phone}
            whatsapp={hfData.whatsapp}
            email={hfData.email}
            specs={hfData.specs}
            media={hfData.media}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      // Services steps
      case 'srvStepBasic':
        return (
          <StepServicesBasicInfo
            locale={locale}
            data={{
              title: srvData.title,
              description: srvData.description,
              subcategory: srvData.subcategory,
              service_type: srvData.service_type,
            }}
            onChange={(updates) => {
              if (updates.subcategory !== undefined && updates.subcategory !== srvData.subcategory) {
                updateSRVData({
                  ...updates,
                  specs: {},
                });
                return;
              }
              updateSRVData(updates);
            }}
          />
        );
      case 'srvStepLocation':
        return (
          <StepServicesLocation
            locale={locale}
            data={{
              city: srvData.city,
              area: srvData.area,
              service_radius_km: srvData.service_radius_km,
              multiple_cities: srvData.multiple_cities,
              days_available: srvData.days_available,
              working_hours_from: srvData.working_hours_from,
              working_hours_to: srvData.working_hours_to,
              emergency_service: srvData.emergency_service,
              advance_booking_required: srvData.advance_booking_required,
            }}
            onChange={(updates) => updateSRVData(updates)}
          />
        );
      case 'srvStepPricing':
        return (
          <StepServicesPricing
            locale={locale}
            data={{
              pricing_type: srvData.pricing_type,
              price: srvData.price,
              currency: srvData.currency,
              negotiable: srvData.negotiable,
              call_out_fee: srvData.call_out_fee,
              call_out_fee_amount: srvData.call_out_fee_amount,
            }}
            onChange={(updates) => updateSRVData(updates)}
          />
        );
      case 'srvStepDetails':
        return (
          <StepServicesDetails
            locale={locale}
            subcategory={srvData.subcategory}
            specs={srvData.specs}
            onChange={(specs) => updateSRVData({ specs })}
          />
        );
      case 'srvStepMedia':
        return (
          <StepServicesMedia
            locale={locale}
            data={srvData.media}
            onChange={(updates) => updateSRVData({ media: { ...srvData.media, ...updates } })}
          />
        );
      case 'srvStepContact':
        return (
          <StepServicesContact
            locale={locale}
            data={{
              contact_name: srvData.contact_name,
              city: srvData.city,
              lat: srvData.lat,
              lng: srvData.lng,
              phone: srvData.phone,
              whatsapp: srvData.whatsapp,
              email: srvData.email,
              website: srvData.website,
              social_media_links: srvData.social_media_links,
              termsAccepted: srvData.termsAccepted,
            }}
            onChange={(updates) => updateSRVData(updates)}
          />
        );
      case 'srvStepReview':
        return (
          <StepServicesReview
            locale={locale}
            basic={{
              title: srvData.title,
              description: srvData.description,
              subcategory: srvData.subcategory,
              service_type: srvData.service_type,
            }}
            location={{
              city: srvData.city,
              area: srvData.area,
              service_radius_km: srvData.service_radius_km,
              multiple_cities: srvData.multiple_cities,
              days_available: srvData.days_available,
              working_hours_from: srvData.working_hours_from,
              working_hours_to: srvData.working_hours_to,
              emergency_service: srvData.emergency_service,
              advance_booking_required: srvData.advance_booking_required,
            }}
            pricing={{
              pricing_type: srvData.pricing_type,
              price: srvData.price,
              currency: srvData.currency,
              negotiable: srvData.negotiable,
              call_out_fee: srvData.call_out_fee,
              call_out_fee_amount: srvData.call_out_fee_amount,
            }}
            specs={srvData.specs}
            media={srvData.media}
            contact={{
              contact_name: srvData.contact_name,
              city: srvData.city,
              lat: srvData.lat,
              lng: srvData.lng,
              phone: srvData.phone,
              whatsapp: srvData.whatsapp,
              email: srvData.email,
              website: srvData.website,
              social_media_links: srvData.social_media_links,
            }}
            onEdit={(stepIndex) => setCurrentStep(stepIndex)}
          />
        );
      case 'jobStepBasic':
        return (
          <StepJobBasicInfo
            locale={locale}
            data={{
              jobTitle: jobsData.jobTitle,
              employmentType: jobsData.employmentType,
              isRemote: jobsData.isRemote,
              country: jobsData.country,
              city: jobsData.city,
              workCanBeDoneRemotely: jobsData.workCanBeDoneRemotely,
            }}
            onChange={(updates) => setJobsData((prev) => ({ ...prev, ...updates }))}
          />
        );
      case 'jobStepDescription':
        return (
          <StepJobDescription
            locale={locale}
            data={{
              jobDescription: jobsData.jobDescription,
              responsibilities: jobsData.responsibilities,
              requirements: jobsData.requirements,
              preferredQualifications: jobsData.preferredQualifications,
              experienceLevel: jobsData.experienceLevel,
            }}
            onChange={(updates) => setJobsData((prev) => ({ ...prev, ...updates }))}
          />
        );
      case 'jobStepCompensation':
        return (
          <StepJobCompensation
            locale={locale}
            data={{
              currency: jobsData.currency,
              minSalary: jobsData.minSalary,
              maxSalary: jobsData.maxSalary,
              salaryNegotiable: jobsData.salaryNegotiable,
              salaryNotDisclosed: jobsData.salaryNotDisclosed,
              benefits: jobsData.benefits,
              otherBenefits: jobsData.otherBenefits,
              applicationDeadline: jobsData.applicationDeadline,
              applicationMethod: jobsData.applicationMethod,
              applicationEmail: jobsData.applicationEmail,
              applicationUrl: jobsData.applicationUrl,
              hiringManagerName: jobsData.hiringManagerName,
            }}
            onChange={(updates) => setJobsData((prev) => ({ ...prev, ...updates }))}
          />
        );
      case 'jobStepContact':
        return (
          <StepJobContact
            locale={locale}
            data={{
              contactPhone: jobsData.contactPhone,
              contactEmail: jobsData.contactEmail,
              termsAccepted: jobsData.termsAccepted,
            }}
            onChange={(updates) => setJobsData((prev) => ({ ...prev, ...updates }))}
          />
        );
      case 'jobStepReview':
        return (
          <StepJobReview
            locale={locale}
            data={{
              jobTitle: jobsData.jobTitle,
              employmentType: jobsData.employmentType,
              isRemote: jobsData.isRemote,
              country: jobsData.country,
              city: jobsData.city,
              workCanBeDoneRemotely: jobsData.workCanBeDoneRemotely,
              jobDescription: jobsData.jobDescription,
              responsibilities: jobsData.responsibilities,
              requirements: jobsData.requirements,
              preferredQualifications: jobsData.preferredQualifications,
              experienceLevel: jobsData.experienceLevel,
              currency: jobsData.currency,
              minSalary: jobsData.minSalary,
              maxSalary: jobsData.maxSalary,
              salaryNegotiable: jobsData.salaryNegotiable,
              salaryNotDisclosed: jobsData.salaryNotDisclosed,
              benefits: jobsData.benefits,
              otherBenefits: jobsData.otherBenefits,
              applicationDeadline: jobsData.applicationDeadline,
              applicationMethod: jobsData.applicationMethod,
              applicationEmail: jobsData.applicationEmail,
              applicationUrl: jobsData.applicationUrl,
              hiringManagerName: jobsData.hiringManagerName,
              contactPhone: jobsData.contactPhone,
              contactEmail: jobsData.contactEmail,
              termsAccepted: jobsData.termsAccepted,
            }}
            onEditSection={(section) => {
              // Map section to step index
              let stepIndex = 0;
              if (section === 'basic') stepIndex = steps.indexOf('jobStepBasic');
              else if (section === 'description') stepIndex = steps.indexOf('jobStepDescription');
              else if (section === 'compensation') stepIndex = steps.indexOf('jobStepCompensation');
              else if (section === 'contact') stepIndex = steps.indexOf('jobStepContact');
              setCurrentStep(stepIndex);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-0">
      {/* Progress Bar */}
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className={`flex items-center gap-2 overflow-x-auto pb-1 ${rtl ? 'flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex min-w-[4.5rem] flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: index === currentStep ? 1.06 : 1 }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </motion.div>
                <span
                  className={`text-center text-[11px] font-medium ${
                    index === currentStep ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  {getStepLabel(step)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-1 hidden h-0.5 flex-1 sm:block ${
                    index < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center justify-between">
            <span>{submitError}</span>
            <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStepKey}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
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
      <div className={cn('fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/92 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm md:static md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none', rtl && 'text-right')}>
        <div className={`mx-auto flex max-w-3xl items-center justify-between gap-2 flex-wrap ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex min-w-[8.5rem] items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium transition ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } ${rtl ? 'flex-row-reverse' : ''}`}
        >
          {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {tCommon('previous')}
        </button>

        <div className={`flex flex-1 items-center justify-end gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
          {/* Save Draft */}
          {formData.categoryId !== null && (
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft}
              className={`hidden items-center gap-2 rounded-2xl border-2 px-4 py-3 font-medium transition md:inline-flex ${
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

          {isSpareParts && (
            <button
              onClick={handleClearSparePartsForm}
              className={`px-4 py-2.5 rounded-lg font-medium transition border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 ${rtl ? 'text-right' : 'text-left'}`}
            >
              Clear form
            </button>
          )}

          {isHealthBeauty && (
            <button
              onClick={handleClearHealthBeautyForm}
              className={`px-4 py-2.5 rounded-lg font-medium transition border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 ${rtl ? 'text-right' : 'text-left'}`}
            >
              Clear form
            </button>
          )}

          {isHomeFurniture && (
            <button
              onClick={handleClearHomeFurnitureForm}
              className={`px-4 py-2.5 rounded-lg font-medium transition border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 ${rtl ? 'text-right' : 'text-left'}`}
            >
              {tHF('clearForm')}
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium transition md:flex-none ${
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
                className={`hidden items-center gap-2 rounded-2xl border-2 px-5 py-3 font-medium transition md:inline-flex ${
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
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3 font-medium transition md:flex-none ${
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
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
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
                  <div><span className="font-semibold text-slate-700">{tFA('subcategoryLabel')}:</span> {faData.subcategory ? tFA(FASHION_SUBCATEGORY_LABEL_KEYS[faData.subcategory as FashionSubcategory] as Parameters<typeof tFA>[0]) : ''}</div>
                  <div><span className="font-semibold text-slate-700">{tFA('adTitle')}:</span> {faData.title}</div>
                  <div><span className="font-semibold text-slate-700">{tFA('price')}:</span> {faData.price}</div>
                  <div><span className="font-semibold text-slate-700">{tFA('city')}:</span> {faData.city}</div>
                  <div><span className="font-semibold text-slate-700">{tFA('images')}:</span> {faData.media.images.length}</div>
                </>
              )}
              {isSpareParts && (
                <>
                  <div><span className="font-semibold text-slate-700">{tSP('subcategory')}:</span> {spData.subcategory || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tSP('title')}:</span> {spData.title || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tSP('price')}:</span> {spData.price === '' ? '-' : `${spData.price} ${spData.currency || ''}`}</div>
                  <div><span className="font-semibold text-slate-700">{tSP('city')}:</span> {spData.city || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tSP('phone')}:</span> {spData.phone || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tSP('images')}:</span> {spData.media.images.length}</div>
                </>
              )}
              {isHealthBeauty && (
                <>
                  <div><span className="font-semibold text-slate-700">{tHB('subcategory')}:</span> {hbData.subcategory || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tHB('title')}:</span> {hbData.title || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tHB('price')}:</span> {hbData.price === '' ? '-' : `${hbData.price} ${hbData.currency || ''}`}</div>
                  <div><span className="font-semibold text-slate-700">{tHB('city')}:</span> {hbData.city || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tHB('phone')}:</span> {hbData.phone || '-'}</div>
                  <div><span className="font-semibold text-slate-700">{tHB('images')}:</span> {hbData.media.images.length}</div>
                </>
              )}
              {!isVehicles && !isRealEstate && !isElectronics && !isFashion && !isSpareParts && !isHealthBeauty && (
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
