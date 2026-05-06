'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Edit2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ServicesMediaData } from './StepServicesMedia';
import { ServicesSubcategory } from '@/lib/constants/services-wizard';

interface StepServicesReviewProps {
  locale: Locale;
  basic: {
    title: string;
    description: string;
    subcategory: ServicesSubcategory | '';
    service_type: string;
  };
  location: {
    city: string;
    area: string;
    service_radius_km: number | '';
    multiple_cities: string[];
    days_available: string[];
    working_hours_from: string;
    working_hours_to: string;
    emergency_service: boolean;
    advance_booking_required: boolean;
  };
  pricing: {
    pricing_type: string;
    price: number | '';
    currency: string;
    negotiable: boolean;
    call_out_fee: boolean;
    call_out_fee_amount: number | '';
  };
  specs: Record<string, unknown>;
  media: ServicesMediaData;
  contact: {
    contact_name: string;
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    social_media_links: string;
  };
  onEdit: (stepIndex: number) => void;
}

/** Map of subcategory slugs to their translation keys */
const SUBCATEGORY_KEY_MAP: Record<string, string> = {
  'home-services': 'homeServices',
  'repair-maintenance': 'repairMaintenance',
  'automotive-services': 'automotiveServices',
  'beauty-wellness': 'beautyWellness',
  'education-tutoring': 'educationTutoring',
  'it-digital-services': 'itDigitalServices',
  'events-entertainment': 'eventsEntertainment',
  'business-services': 'businessServices',
  'health-medical': 'healthMedical',
  'other-services': 'otherServices',
};

/** Map of service type slugs to their translation keys */
const SERVICE_TYPE_KEY_MAP: Record<string, string> = {
  'on-site': 'onSite',
  'at-shop': 'atShop',
  'online-remote': 'onlineRemote',
};

/** Map of pricing type slugs to their translation keys */
const PRICING_TYPE_KEY_MAP: Record<string, string> = {
  'fixed-price': 'fixedPrice',
  'hourly-rate': 'hourlyRate',
  'daily-rate': 'dailyRate',
  'custom-quote': 'customQuote',
};

/** Map of review field keys to their translation key paths under postAd.services */
const FIELD_LABEL_KEY_MAP: Record<string, string> = {
  title: 'title',
  description: 'description',
  subcategory: 'subcategory',
  service_type: 'serviceType',
  city: 'city',
  area: 'area',
  service_radius_km: 'serviceRadiusKm',
  multiple_cities: 'multipleCities',
  days_available: 'daysAvailable',
  working_hours: 'workingHours',
  emergency_service: 'emergencyService',
  advance_booking_required: 'advanceBookingRequired',
  pricing_type: 'pricingType',
  price: 'price',
  currency: 'currency',
  negotiable: 'negotiable',
  call_out_fee: 'callOutFee',
  call_out_fee_amount: 'callOutFeeAmount',
  contact_name: 'contactName',
  phone: 'phone',
  whatsapp: 'whatsapp',
  email: 'email',
  website: 'website',
  social_media_links: 'socialMediaLinks',
  images: 'images',
  video: 'video',
  documents: 'documents',
  map: 'mapLocation',
};

/** Map of spec field keys (snake_case as stored in metadata) to their translation key paths under postAd.services.fields */
const SPEC_FIELD_KEY_MAP: Record<string, string> = {
  service_detail: 'serviceDetail',
  experience_years: 'experienceYears',
  certification: 'certification',
  tools_provided: 'toolsProvided',
  spare_parts_included: 'sparePartsIncluded',
  warranty: 'warranty',
  warranty_duration: 'warrantyDuration',
  service_duration: 'serviceDuration',
  materials_included: 'materialsIncluded',
  specialized_in: 'specializedIn',
  gender_served: 'genderServed',
  certified_professional: 'certifiedProfessional',
  products_used: 'productsUsed',
  session_duration: 'sessionDuration',
  home_service_available: 'homeServiceAvailable',
  subject_course: 'subjectCourse',
  level: 'level',
  mode: 'mode',
  group_or_individual: 'groupOrIndividual',
  duration_per_session: 'durationPerSession',
  skills: 'skills',
  tools_technologies: 'toolsTechnologies',
  delivery_time: 'deliveryTime',
  revisions_included: 'revisionsIncluded',
  portfolio_link: 'portfolioLink',
  event_types: 'eventTypes',
  team_size: 'teamSize',
  equipment_provided: 'equipmentProvided',
  travel_available: 'travelAvailable',
  duration: 'duration',
  industry: 'industry',
  consultation_mode: 'consultationMode',
  specialization: 'specialization',
  license_verified: 'licenseVerified',
  clinic_or_home: 'clinicOrHome',
  emergency_available: 'emergencyAvailable',
  custom_service_type: 'customServiceType',
  description_detail: 'descriptionDetail',
};

export const StepServicesReview: React.FC<StepServicesReviewProps> = ({
  locale,
  basic,
  location,
  pricing,
  specs,
  media,
  contact,
  onEdit,
}) => {
  const t = useTranslations('postAd.services');
  const rtl = isRTL(locale);

  const getFieldLabel = (key: string): string => {
    // Check direct field label map first
    const directKey = FIELD_LABEL_KEY_MAP[key];
    if (directKey) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(directKey as any);
      } catch {
        // fall through
      }
    }
    // Check spec field key map
    const specKey = SPEC_FIELD_KEY_MAP[key];
    if (specKey) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(`fields.${specKey}` as any);
      } catch {
        // fall through
      }
    }
    // Try as direct key under services
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any);
    } catch {
      // Final fallback: convert snake_case to Title Case
      return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getSubcategoryLabel = (slug: string): string => {
    const key = SUBCATEGORY_KEY_MAP[slug];
    if (key) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(`subcategories.${key}` as any);
      } catch {
        // fall through
      }
    }
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getServiceTypeLabel = (slug: string): string => {
    const key = SERVICE_TYPE_KEY_MAP[slug];
    if (key) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(`serviceTypeOptions.${key}` as any);
      } catch {
        // fall through
      }
    }
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getPricingTypeLabel = (slug: string): string => {
    const key = PRICING_TYPE_KEY_MAP[slug];
    if (key) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t(`pricingTypeOptions.${key}` as any);
      } catch {
        // fall through
      }
    }
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const stringify = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') return value ? t('yes') : t('no');
    return String(value);
  };

  const subcategoryLabel = basic.subcategory ? getSubcategoryLabel(basic.subcategory) : '-';
  const serviceTypeLabel = basic.service_type ? getServiceTypeLabel(basic.service_type) : '-';

  const specRows = Object.entries(specs).filter(([_key, value]) => {
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  const sections = [
    {
      title: t('stepBasic'),
      stepIndex: 1,
      rows: [
        ['title', basic.title],
        ['description', basic.description],
        ['subcategory', subcategoryLabel],
        ['service_type', serviceTypeLabel],
      ],
    },
    {
      title: t('stepLocation'),
      stepIndex: 2,
      rows: [
        ['city', location.city],
        ['area', location.area],
        ['service_radius_km', location.service_radius_km === '' ? '-' : `${location.service_radius_km} km`],
        ['multiple_cities', stringify(location.multiple_cities)],
        ['days_available', stringify(location.days_available)],
        ['working_hours', location.working_hours_from && location.working_hours_to ? `${location.working_hours_from} - ${location.working_hours_to}` : '-'],
        ['emergency_service', stringify(location.emergency_service)],
        ['advance_booking_required', stringify(location.advance_booking_required)],
      ],
    },
    {
      title: t('stepPricing'),
      stepIndex: 3,
      rows: [
        ['pricing_type', getPricingTypeLabel(pricing.pricing_type)],
        ['price', pricing.price === '' ? '-' : `${pricing.price}`],
        ['currency', pricing.currency],
        ['negotiable', stringify(pricing.negotiable)],
        ['call_out_fee', stringify(pricing.call_out_fee)],
        pricing.call_out_fee && pricing.call_out_fee_amount !== '' ? ['call_out_fee_amount', `${pricing.call_out_fee_amount}`] : null,
      ].filter(Boolean) as [string, string][],
    },
    {
      title: t('stepDetails'),
      stepIndex: 4,
      rows: specRows.map(([key, value]) => [key, stringify(value)]),
    },
    {
      title: t('stepMedia'),
      stepIndex: 5,
      rows: [
        ['images', String(media.images.length)],
        media.has_video ? ['video', media.video] : null,
        media.has_documents ? ['documents', media.documents] : null,
      ].filter(Boolean) as [string, string][],
    },
    {
      title: t('stepContact'),
      stepIndex: 6,
      rows: [
        ['contact_name', contact.contact_name],
        ['city', contact.city],
        ['phone', contact.phone],
        contact.whatsapp ? ['whatsapp', contact.whatsapp] : null,
        contact.email ? ['email', contact.email] : null,
        contact.website ? ['website', contact.website] : null,
        contact.social_media_links ? ['social_media_links', contact.social_media_links] : null,
        contact.lat !== null && contact.lng !== null ? ['map', `${contact.lat.toFixed(5)}, ${contact.lng.toFixed(5)}`] : null,
      ].filter(Boolean) as [string, string][],
    },
  ];

  return (
    <div className="space-y-5">
      <h3 className={`text-lg font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>{t('stepReview')}</h3>

      {sections.map((section) => (
        <div key={section.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className={`mb-3 flex items-center justify-between ${rtl ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-slate-800">{section.title}</p>
            <button
              type="button"
              onClick={() => onEdit(section.stepIndex)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              <Edit2 className="h-3.5 w-3.5" />
              {t('edit')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.rows.map(([key, value]) => (
              <div key={`${section.title}-${key}`} className={`text-sm ${rtl ? 'text-right' : 'text-left'}`}>
                <span className="font-medium text-slate-600">{getFieldLabel(key)}:</span>{' '}
                <span className="text-slate-900">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
