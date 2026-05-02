// src/lib/localization/personalization.ts
// Dynamic content personalization based on detected locale and region

import { Locale } from '@/lib/i18n/config';

export interface PersonalizationRule {
  locale: Locale;
  region?: string;
  priorityFields: string[];
  defaultCurrency: string;
  measurementSystem: 'metric' | 'imperial';
  contactPreference: 'phone' | 'chat' | 'both';
  priceDisplay: 'negotiable' | 'fixed' | 'both';
  dateFormat: 'gregorian' | 'jalali' | 'hijri';
  numberFormat: 'western' | 'eastern';
  legalRequirements: string[];
  culturalPreferences: {
    imagery: string[];
    colors: string[];
    icons: string[];
  };
}

export interface VehiclePersonalizationConfig {
  showEmissions: boolean;
  showCertifications: boolean;
  showSafetyRatings: boolean;
  showImportStatus: boolean;
  preferredFuelTypes: string[];
  regionalAttributes: string[];
}

// Region detection based on locale and IP (simplified)
export const detectRegion = (locale: Locale): string => {
  const regionMap: Record<Locale, string> = {
    en: 'US', // Default to US for English
    ps: 'AF', // Afghanistan for Pashto
    fa: 'IR', // Iran for Dari
  };
  return regionMap[locale];
};

// Personalization rules for each locale
export const PERSONALIZATION_RULES: Record<Locale, PersonalizationRule> = {
  en: {
    locale: 'en',
    region: 'US',
    priorityFields: ['year', 'make', 'model', 'mileage', 'price', 'condition'],
    defaultCurrency: 'USD',
    measurementSystem: 'imperial',
    contactPreference: 'both',
    priceDisplay: 'fixed',
    dateFormat: 'gregorian',
    numberFormat: 'western',
    legalRequirements: ['odometer_disclosure', 'lemon_law', 'safety_recall'],
    culturalPreferences: {
      imagery: ['western_vehicles', 'modern_design'],
      colors: ['blue', 'green', 'neutral'],
      icons: ['standard_western'],
    },
  },
  ps: {
    locale: 'ps',
    region: 'AF',
    priorityFields: ['year', 'make', 'model', 'price', 'condition', 'registration'],
    defaultCurrency: 'AFN',
    measurementSystem: 'metric',
    contactPreference: 'phone',
    priceDisplay: 'negotiable',
    dateFormat: 'gregorian',
    numberFormat: 'western',
    legalRequirements: ['registration_document', 'customs_clearance', 'road_tax'],
    culturalPreferences: {
      imagery: ['local_vehicles', 'traditional_design'],
      colors: ['green', 'white', 'gold'],
      icons: ['cultural_appropriate'],
    },
  },
  fa: {
    locale: 'fa',
    region: 'IR',
    priorityFields: ['year', 'make', 'model', 'mileage', 'price', 'technical_inspection'],
    defaultCurrency: 'IRR',
    measurementSystem: 'metric',
    contactPreference: 'chat',
    priceDisplay: 'negotiable',
    dateFormat: 'jalali',
    numberFormat: 'eastern',
    legalRequirements: ['vehicle_card', 'technical_inspection', 'insurance'],
    culturalPreferences: {
      imagery: ['persian_design', 'local_brands'],
      colors: ['green', 'blue', 'white'],
      icons: ['persian_style'],
    },
  },
};

// Get personalization rule for a locale
export const getPersonalizationRule = (locale: Locale): PersonalizationRule => {
  return PERSONALIZATION_RULES[locale] || PERSONALIZATION_RULES.en;
};

// Vehicle-specific personalization configuration
export const getVehiclePersonalizationConfig = (locale: Locale): VehiclePersonalizationConfig => {
  const region = detectRegion(locale);
  
  const baseConfig: VehiclePersonalizationConfig = {
    showEmissions: false,
    showCertifications: false,
    showSafetyRatings: false,
    showImportStatus: false,
    preferredFuelTypes: ['petrol', 'diesel'],
    regionalAttributes: [],
  };

  // Region-specific enhancements
  switch (region) {
    case 'EU':
    case 'DE':
    case 'FR':
      baseConfig.showEmissions = true;
      baseConfig.showCertifications = true;
      baseConfig.preferredFuelTypes = ['diesel', 'petrol', 'hybrid', 'electric'];
      baseConfig.regionalAttributes = ['euro_standard', 'co2_emissions', 'fuel_consumption'];
      break;
    
    case 'US':
      baseConfig.showSafetyRatings = true;
      baseConfig.showImportStatus = true;
      baseConfig.preferredFuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
      baseConfig.regionalAttributes = ['epa_rating', 'nhtsa_rating', 'iihs_rating'];
      break;
    
    case 'AF':
      baseConfig.showImportStatus = true;
      baseConfig.preferredFuelTypes = ['petrol', 'diesel', 'cng'];
      baseConfig.regionalAttributes = ['import_status', 'registration_city', 'customs_status'];
      break;
    
    case 'IR':
      baseConfig.showCertifications = true;
      baseConfig.preferredFuelTypes = ['petrol', 'cng', 'diesel'];
      baseConfig.regionalAttributes = ['technical_inspection', 'insurance_status', 'vehicle_card'];
      break;
    
    case 'PK':
      baseConfig.showImportStatus = true;
      baseConfig.preferredFuelTypes = ['petrol', 'cng', 'diesel'];
      baseConfig.regionalAttributes = ['registration_book', 'fitness_certificate', 'route_permit'];
      break;
    
    case 'AE':
    case 'SA':
      baseConfig.showCertifications = true;
      baseConfig.preferredFuelTypes = ['petrol', 'diesel'];
      baseConfig.regionalAttributes = ['gcc_specifications', 'ac_performance', 'desert_ready'];
      break;
  }

  return baseConfig;
};

// Format vehicle attributes based on personalization
export const formatVehicleAttribute = (
  attribute: string,
  value: unknown,
  locale: Locale
): string => {
  const rule = getPersonalizationRule(locale);
  
  // Handle measurement conversions
  if (attribute === 'mileage' || attribute === 'fuel_consumption') {
    if (rule.measurementSystem === 'imperial' && typeof value === 'number') {
      // Convert km to miles
      const miles = value as number * 0.621371;
      return `${miles.toFixed(1)} mi`;
    }
  }
  
  // Handle currency formatting
  if (attribute === 'price') {
    if (typeof value === 'number') {
      return new Intl.NumberFormat(
        locale === 'en' ? 'en-US' : 
        locale === 'fa' ? 'fa-IR' : 'ps-AF',
        {
          style: 'currency',
          currency: rule.defaultCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      ).format(value as number);
    }
  }
  
  return String(value);
};

// Get culturally appropriate imagery
export const getCulturalImagery = (locale: Locale, vehicleType: string): string[] => {
  const rule = getPersonalizationRule(locale);
  const baseImages = [`/vehicles/${vehicleType}/default.jpg`];
  
  // Add culturally specific images
  if (rule.culturalPreferences.imagery.includes('local_vehicles')) {
    baseImages.push(`/vehicles/${vehicleType}/local-${locale}.jpg`);
  }
  
  if (rule.culturalPreferences.imagery.includes('traditional_design')) {
    baseImages.push(`/vehicles/${vehicleType}/traditional-${locale}.jpg`);
  }
  
  return baseImages;
};

// Determine which fields to highlight based on locale
export const getPriorityFields = (locale: Locale, allFields: string[]): string[] => {
  const rule = getPersonalizationRule(locale);
  const prioritySet = new Set(rule.priorityFields);
  
  // Filter and sort fields based on priority
  return allFields.filter(field => prioritySet.has(field))
    .concat(allFields.filter(field => !prioritySet.has(field)));
};

// Get locale-specific legal requirements text
export const getLegalRequirements = (locale: Locale): Array<{id: string, text: string}> => {
  const rule = getPersonalizationRule(locale);
  
  const legalTexts: Record<string, Record<Locale, string>> = {
    odometer_disclosure: {
      en: 'Odometer reading verified. Mileage may vary with use.',
      ps: 'د اډومیټر لوستل تایید شوي. د کارولو سره میلې ممکن توپیر ولري.',
      fa: 'خواندن کیلومتر شمار تأیید شده است. مسافت پیموده شده ممکن است با استفاده تغییر کند.',
    },
    registration_document: {
      en: 'Vehicle registration document required for transfer.',
      ps: 'د موټر د ثبت سند د لیږد لپاره اړین دی.',
      fa: 'سند ثبت خودرو برای انتقال الزامی است.',
    },
    vehicle_card: {
      en: 'Valid vehicle card (کارت ماشین) required.',
      ps: 'د معتبر موټر کارت (کارت ماشین) اړین دی.',
      fa: 'کارت ماشین معتبر الزامی است.',
    },
  };
  
  return rule.legalRequirements.map(req => ({
    id: req,
    text: legalTexts[req]?.[locale] || legalTexts[req]?.en || '',
  }));
};

// Check if a feature should be shown based on locale
export const shouldShowFeature = (feature: string, locale: Locale): boolean => {
  const config = getVehiclePersonalizationConfig(locale);
  
  const featureMap: Record<string, boolean> = {
    emissions: config.showEmissions,
    certifications: config.showCertifications,
    safety_ratings: config.showSafetyRatings,
    import_status: config.showImportStatus,
  };
  
  return featureMap[feature] || false;
};

// Get contact method preference
export const getContactPreference = (locale: Locale): 'phone' | 'chat' | 'both' => {
  return getPersonalizationRule(locale).contactPreference;
};

// Get price display preference
export const getPriceDisplayPreference = (locale: Locale): 'negotiable' | 'fixed' | 'both' => {
  return getPersonalizationRule(locale).priceDisplay;
};