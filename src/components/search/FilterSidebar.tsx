'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { useCities, getManagedCityName } from '@/lib/hooks/useCities';
import { VehicleFilter, VehicleFilterState } from './VehicleFilter';
import { SparePartsFilterEnhanced } from './SparePartsFilterEnhanced';
import { HomeFurnitureFilterEnhanced } from './HomeFurnitureFilterEnhanced';
import { JobsFilterEnhanced } from './JobsFilterEnhanced';
import { ServicesFilterEnhanced } from './ServicesFilterEnhanced';
import { AnimalsFilterEnhanced } from './AnimalsFilterEnhanced';
import { FoodAgricultureFilterEnhanced } from './FoodAgricultureFilterEnhanced';
import { BooksEducationFilterEnhanced } from './BooksEducationFilterEnhanced';
import { BabyKidsFilterEnhanced } from './BabyKidsFilterEnhanced';
import { BusinessIndustryFilterEnhanced } from './BusinessIndustryFilterEnhanced';
import { ShoppingGroceriesFilterEnhanced } from './ShoppingGroceriesFilterEnhanced';
import {
  AnimalsLivestockSubcategory,
} from '@/lib/constants/animals-livestock-wizard';
import {
  FoodAgricultureSubcategory,
} from '@/lib/constants/food-agriculture-wizard';
import {
  BooksEducationSubcategory,
} from '@/lib/constants/books-education-wizard';
import {
  BabyKidsSubcategory,
} from '@/lib/constants/baby-kids-wizard';
import {
  BusinessIndustrySubcategory,
} from '@/lib/constants/business-industry-wizard';
import {
  ShoppingGroceriesSubcategory,
} from '@/lib/constants/shopping-groceries-wizard';

// â”€â”€â”€ Animals & Livestock Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface AnimalsLivestockFilterState {
  subcategory: AnimalsLivestockSubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  breed: string;
  quantity: string;
  age: string;
  ageUnit: string;
  healthStatus: string;
  price: string;
  priceType: string;
  color: string;
  weight: string;
  gender: string;
  milkProduction: string;
  pregnancyStatus: string;
  hornStatus: string;
  eggProduction: string;
  housingType: string;
  vaccinationRecord: string;
  woolType: string;
  meatType: string;
  height: string;
  trainingLevel: string;
  discipline: string;
  petType: string;
  vaccinated: string;
  spayedNeutered: string;
  microchipped: string;
  pedigree: string;
  waterType: string;
  tankSize: string;
  breedingStatus: string;
};

export const EMPTY_ANIMALS_LIVESTOCK_FILTERS: AnimalsLivestockFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  breed: '',
  quantity: '',
  age: '',
  ageUnit: '',
  healthStatus: '',
  price: '',
  priceType: '',
  color: '',
  weight: '',
  gender: '',
  milkProduction: '',
  pregnancyStatus: '',
  hornStatus: '',
  eggProduction: '',
  housingType: '',
  vaccinationRecord: '',
  woolType: '',
  meatType: '',
  height: '',
  trainingLevel: '',
  discipline: '',
  petType: '',
  vaccinated: '',
  spayedNeutered: '',
  microchipped: '',
  pedigree: '',
  waterType: '',
  tankSize: '',
  breedingStatus: '',
};

// â”€â”€â”€ Food & Agriculture Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface FoodAgricultureFilterState {
  subcategory: FoodAgricultureSubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  quantity: string;
  unit: string;
  grade: string;
  freshness: string;
  origin: string;
  certification: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  minOrder: string;
  moistureContent: string;
  grainVariety: string;
  packagingType: string;
  variety: string;
  ripeness: string;
  storageType: string;
  spiceType: string;
  formType: string;
  dairyType: string;
  fatContent: string;
  poultryType: string;
  eggSize: string;
  chemicalType: string;
  npkRatio: string;
  applicationMethod: string;
  equipmentType: string;
  condition: string;
  powerSource: string;
  brand: string;
  seedType: string;
  germinationRate: string;
  maturityPeriod: string;
  feedType: string;
  animalType: string;
  weightPerBag: string;
  organicCertification: string;
  productType: string;
  shelfLife: string;
  beverageType: string;
  roastLevel: string;
  oilType: string;
  volume: string;
  preserveType: string;
  jarSize: string;
  flavor: string;
};

export const EMPTY_FOOD_AGRICULTURE_FILTERS: FoodAgricultureFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  quantity: '',
  unit: '',
  grade: '',
  freshness: '',
  origin: '',
  certification: '',
  price: '',
  priceType: '',
  deliveryAvailable: '',
  minOrder: '',
  moistureContent: '',
  grainVariety: '',
  packagingType: '',
  variety: '',
  ripeness: '',
  storageType: '',
  spiceType: '',
  formType: '',
  dairyType: '',
  fatContent: '',
  poultryType: '',
  eggSize: '',
  chemicalType: '',
  npkRatio: '',
  applicationMethod: '',
  equipmentType: '',
  condition: '',
  powerSource: '',
  brand: '',
  seedType: '',
  germinationRate: '',
  maturityPeriod: '',
  feedType: '',
  animalType: '',
  weightPerBag: '',
  organicCertification: '',
  productType: '',
  shelfLife: '',
  beverageType: '',
  roastLevel: '',
  oilType: '',
  volume: '',
  preserveType: '',
  jarSize: '',
  flavor: '',
};

// â”€â”€â”€ Books & Education Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface BooksEducationFilterState {
  subcategory: BooksEducationSubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  subjectMatter: string;
  educationLevel: string;
  language: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  author: string;
  isbn: string;
  edition: string;
  publicationYear: string;
  publisher: string;
  bookCondition: string;
  bookFormat: string;
  pages: string;
  isTextbook: string;
  ebookFormat: string;
  fileSize: string;
  drmProtected: string;
  instructor: string;
  platform: string;
  courseDuration: string;
  experienceLevel: string;
  certification: string;
  teachingMode: string;
  lessonsCount: string;
  hasLiveSessions: string;
  hasAssignments: string;
  tutorName: string;
  qualification: string;
  experienceYears: string;
  sessionDuration: string;
  availableDays: string;
  groupTutoring: string;
  freeTrial: string;
  supplyType: string;
  brand: string;
  quantity: string;
  itemCondition: string;
  ageRange: string;
  color: string;
};

export const EMPTY_BOOKS_EDUCATION_FILTERS: BooksEducationFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  subjectMatter: '',
  educationLevel: '',
  language: '',
  price: '',
  priceType: '',
  deliveryAvailable: '',
  author: '',
  isbn: '',
  edition: '',
  publicationYear: '',
  publisher: '',
  bookCondition: '',
  bookFormat: '',
  pages: '',
  isTextbook: '',
  ebookFormat: '',
  fileSize: '',
  drmProtected: '',
  instructor: '',
  platform: '',
  courseDuration: '',
  experienceLevel: '',
  certification: '',
  teachingMode: '',
  lessonsCount: '',
  hasLiveSessions: '',
  hasAssignments: '',
  tutorName: '',
  qualification: '',
  experienceYears: '',
  sessionDuration: '',
  availableDays: '',
  groupTutoring: '',
  freeTrial: '',
  supplyType: '',
  brand: '',
  quantity: '',
  itemCondition: '',
  ageRange: '',
  color: '',
};

// â”€â”€â”€ Baby & Kids Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface BabyKidsFilterState {
  subcategory: BabyKidsSubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  condition: string;
  ageRange: string;
  gender: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  clothingType: string;
  size: string;
  material: string;
  season: string;
  brand: string;
  color: string;
  toyType: string;
  toyMaterial: string;
  safetyFeatures: string;
  gearType: string;
  adjustable: string;
  portable: string;
  feedingType: string;
  strollerType: string;
  foldable: string;
  furnitureType: string;
  diaperType: string;
  diaperSize: string;
  footwearType: string;
  footwearSize: string;
  footwearMaterial: string;
  supplyType: string;
  gradeLevel: string;
};

export const EMPTY_BABY_KIDS_FILTERS: BabyKidsFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  condition: '',
  ageRange: '',
  gender: '',
  price: '',
  priceType: '',
  deliveryAvailable: '',
  clothingType: '',
  size: '',
  material: '',
  season: '',
  brand: '',
  color: '',
  toyType: '',
  toyMaterial: '',
  safetyFeatures: '',
  gearType: '',
  adjustable: '',
  portable: '',
  feedingType: '',
  strollerType: '',
  foldable: '',
  furnitureType: '',
  diaperType: '',
  diaperSize: '',
  footwearType: '',
  footwearSize: '',
  footwearMaterial: '',
  supplyType: '',
  gradeLevel: '',
};

;

// â”€â”€â”€ Business & Industry Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface BusinessIndustryFilterState {
  subcategory: BusinessIndustrySubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  condition: string;
  businessType: string;
  industrySector: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  warranty: string;
  certification: string;
  powerSource: string;
  machineryType: string;
  brand: string;
  model: string;
  powerRating: string;
  yearOfManufacture: string;
  operatingHours: string;
  equipmentType: string;
  specifications: string;
  quantity: string;
  unit: string;
  materialType: string;
  grade: string;
  origin: string;
  minOrder: string;
  serviceType: string;
  experienceYears: string;
  teamSize: string;
  serviceArea: string;
  availableHours: string;
  licensed: string;
  freeConsultation: string;
  manufacturingType: string;
  productionCapacity: string;
  leadTime: string;
  customOrders: string;
  wholesaleCategory: string;
  bulkDiscount: string;
  safetyType: string;
  standardCompliance: string;
  toolsType: string;
  material: string;
};

export const EMPTY_BUSINESS_INDUSTRY_FILTERS: BusinessIndustryFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  condition: '',
  businessType: '',
  industrySector: '',
  price: '',
  priceType: '',
  deliveryAvailable: '',
  warranty: '',
  certification: '',
  powerSource: '',
  machineryType: '',
  brand: '',
  model: '',
  powerRating: '',
  yearOfManufacture: '',
  operatingHours: '',
  equipmentType: '',
  specifications: '',
  quantity: '',
  unit: '',
  materialType: '',
  grade: '',
  origin: '',
  minOrder: '',
  serviceType: '',
  experienceYears: '',
  teamSize: '',
  serviceArea: '',
  availableHours: '',
  licensed: '',
  freeConsultation: '',
  manufacturingType: '',
  productionCapacity: '',
  leadTime: '',
  customOrders: '',
  wholesaleCategory: '',
  bulkDiscount: '',
  safetyType: '',
  standardCompliance: '',
  toolsType: '',
  material: '',
};

// â”€â”€â”€ Shopping & Groceries Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ShoppingGroceriesFilterState {
  subcategory: ShoppingGroceriesSubcategory | '';
  keywords: string;
  sellerType: string;
  postedDate: string;
  quantity: string;
  unit: string;
  condition: string;
  brand: string;
  price: string;
  priceType: string;
  deliveryAvailable: string;
  minOrder: string;
  foodType: string;
  packagingType: string;
  shelfLife: string;
  dietaryInfo: string;
  beverageType: string;
  volume: string;
  itemType: string;
  material: string;
  dimensions: string;
  careType: string;
  skinType: string;
  snackType: string;
  flavor: string;
  productType: string;
  ageRange: string;
  safetyCert: string;
  cleaningType: string;
  surfaceType: string;
  bakeryType: string;
  freshness: string;
  allergenInfo: string;
  storageTemp: string;
  dairyType: string;
  fatContent: string;
  storageType: string;
  variety: string;
  ripeness: string;
  origin: string;
  meatType: string;
  cutType: string;
  certification: string;
  spiceType: string;
  formType: string;
}

export const EMPTY_SHOPPING_GROCERIES_FILTERS: ShoppingGroceriesFilterState = {
  subcategory: '',
  keywords: '',
  sellerType: '',
  postedDate: '',
  quantity: '',
  unit: '',
  condition: '',
  brand: '',
  price: '',
  priceType: '',
  deliveryAvailable: '',
  minOrder: '',
  foodType: '',
  packagingType: '',
  shelfLife: '',
  dietaryInfo: '',
  beverageType: '',
  volume: '',
  itemType: '',
  material: '',
  dimensions: '',
  careType: '',
  skinType: '',
  snackType: '',
  flavor: '',
  productType: '',
  ageRange: '',
  safetyCert: '',
  cleaningType: '',
  surfaceType: '',
  bakeryType: '',
  freshness: '',
  allergenInfo: '',
  storageTemp: '',
  dairyType: '',
  fatContent: '',
  storageType: '',
  variety: '',
  ripeness: '',
  origin: '',
  meatType: '',
  cutType: '',
  certification: '',
  spiceType: '',
  formType: '',
};

import {
  ELECTRONICS_SUBCATEGORIES,
  ElectronicsSubcategory,
  ELECTRONICS_BRAND_MODELS,
} from '@/lib/constants/electronics-wizard';
import {
  FashionSubcategory,
  FASHION_BRANDS_BY_SUBCATEGORY,
  FASHION_SUBCATEGORY_LABEL_KEYS,
  FASHION_SUBCATEGORIES,
  getFashionFieldTranslationKey,
  getFashionOptionTranslationKey,
  getFashionSpecsConfig,
  FashionSpecField,
} from '@/lib/constants/fashion-wizard';
import {
  SparePartsSubcategory,
} from '@/lib/constants/spare-parts-wizard';
import {
  HealthBeautySubcategory,
  HEALTH_BEAUTY_SUBCATEGORIES,
  HEALTH_BEAUTY_SUBCATEGORY_LABEL_KEYS,
  getHealthBeautyFieldTranslationKey,
  getHealthBeautyOptionTranslationKey,
} from '@/lib/constants/health-beauty-wizard';
import {
  HomeFurnitureSubcategory,
} from '@/lib/constants/home-furniture-wizard';


import {
  JobSubcategory,
} from '@/lib/constants/jobs-wizard';
import {
  ServicesSubcategory,
  ServiceType,
  PricingType,
} from '@/lib/constants/services-wizard';
import {
  SportsHobbySubcategory,
  SPORTS_HOBBY_SUBCATEGORIES,
  SPORTS_HOBBY_SUBCATEGORY_LABEL_KEYS,
  SPORTS_HOBBY_CONDITIONS,
  AGE_GROUPS,
  MATERIALS,
  CURRENCY_OPTIONS,
  SELLER_TYPE_OPTIONS,
  SKILL_LEVELS,
  getSportsHobbyFieldTranslationKey,
  getSportsHobbyOptionTranslationKey,
} from '@/lib/constants/sports-hobby-wizard';




// â”€â”€â”€ Real Estate Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface RealEstateFilterState {
  purpose: string;
  propertyType: string;
  city: string;
  area: string;
  priceMin: string;
  priceMax: string;
  currency: string;
  bedrooms: string;
  bedroomsMin: string;
  bedroomsMax: string;
  bathrooms: string;
  bathroomsMin: string;
  bathroomsMax: string;
  areaSizeMin: string;
  areaSizeMax: string;
  floorNumber: string;
  yearBuiltMin: string;
  yearBuiltMax: string;
  parkingSpaces: string;
  balcony: string;
  elevator: string;
  furnishing: string;
  condition: string;
  kitchenType: string;
  commercialType: string;
  meetingRooms: string;
  washrooms: string;
  landType: string;
  roadAccess: string;
  cornerPlot: string;
  industrialType: string;
  ceilingHeight: string;
  loadingDocks: string;
}

export const EMPTY_REAL_ESTATE_FILTERS: RealEstateFilterState = {
  purpose: '',
  propertyType: '',
  city: '',
  area: '',
  priceMin: '',
  priceMax: '',
  currency: '',
  bedrooms: '',
  bedroomsMin: '',
  bedroomsMax: '',
  bathrooms: '',
  bathroomsMin: '',
  bathroomsMax: '',
  areaSizeMin: '',
  areaSizeMax: '',
  floorNumber: '',
  yearBuiltMin: '',
  yearBuiltMax: '',
  parkingSpaces: '',
  balcony: '',
  elevator: '',
  furnishing: '',
  condition: '',
  kitchenType: '',
  commercialType: '',
  meetingRooms: '',
  washrooms: '',
  landType: '',
  roadAccess: '',
  cornerPlot: '',
  industrialType: '',
  ceilingHeight: '',
  loadingDocks: '',
};

// â”€â”€â”€ Electronics Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ElectronicsFilterState {
  subcategory: string;
  postedDate: string;
  sellerType: string;
  make: string;
  model: string;
  ram: string[];
  internalStorage: string;
  batteryCapacity: string;
  screenSize: string;
  refreshRate: string;
  cameraRearMp: string;
  cameraFrontMp: string;
  supports5g: string;
  dualSim: string;
  operatingSystem: string;
  color: string;
  condition: string;
  warranty: string;
  accessoriesIncluded: string;
  boxAvailable: string;
  resolution: string;
  smartTv: string;
  panelType: string;
  hdmiPorts: string;
  wallMountIncluded: string;
  processor: string;
  storageType: string;
  storageSize: string;
  gpu: string;
  touchscreen: string;
  batteryLife: string;
  usageType: string;
  keyboardBacklight: string;
  fingerprintSensor: string;
  formFactor: string;
  monitorIncluded: string;
  keyboardMouseIncluded: string;
  applianceType: string;
  energyRating: string;
  refrigeratorCapacityLiters: string;
  refrigeratorType: string;
  defrostType: string;
  refrigeratorInverter: string;
  washingMachineType: string;
  washingMachineCapacityKg: string;
  spinSpeed: string;
  washingMode: string;
  acType: string;
  acCapacity: string;
  acInverter: string;
  coolingArea: string;
  instrumentType: string;
  acousticElectric: string;
  skillLevel: string;
  deviceType: string;
  features: string[];
  keywords: string;
}

export const EMPTY_ELECTRONICS_FILTERS: ElectronicsFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  make: '',
  model: '',
  ram: [],
  internalStorage: '',
  batteryCapacity: '',
  screenSize: '',
  refreshRate: '',
  cameraRearMp: '',
  cameraFrontMp: '',
  supports5g: '',
  dualSim: '',
  operatingSystem: '',
  color: '',
  condition: '',
  warranty: '',
  accessoriesIncluded: '',
  boxAvailable: '',
  resolution: '',
  smartTv: '',
  panelType: '',
  hdmiPorts: '',
  wallMountIncluded: '',
  processor: '',
  storageType: '',
  storageSize: '',
  gpu: '',
  touchscreen: '',
  batteryLife: '',
  usageType: '',
  keyboardBacklight: '',
  fingerprintSensor: '',
  formFactor: '',
  monitorIncluded: '',
  keyboardMouseIncluded: '',
  applianceType: '',
  energyRating: '',
  refrigeratorCapacityLiters: '',
  refrigeratorType: '',
  defrostType: '',
  refrigeratorInverter: '',
  washingMachineType: '',
  washingMachineCapacityKg: '',
  spinSpeed: '',
  washingMode: '',
  acType: '',
  acCapacity: '',
  acInverter: '',
  coolingArea: '',
  instrumentType: '',
  acousticElectric: '',
  skillLevel: '',
  deviceType: '',
  features: [],
  keywords: '',
};

export interface FashionFilterState {
  subcategory: FashionSubcategory | '';
  postedDate: string;
  sellerType: 'Individual' | 'Dealer' | '';
  keywords: string;
  condition: 'New' | 'Used' | '';
  brand: string;
  clothingType: string;
  gender: string;
  size: string[];
  fitType: string;
  color: string[];
  material: string;
  sleeveType: string;
  pattern: string;
  season: string;
  occasion: string;
  authenticity: string;
  warranty: string;
  tagsAvailable: '' | 'yes' | 'no';
  model: string;
  shoeType: string;
  originalBox: '' | 'yes' | 'no';
  usageType: string;
  bagType: string;
  closureType: string;
  strapType: string;
  waterproof: '' | 'yes' | 'no';
  type: string;
  style: string;
  displayType: string;
  strapMaterial: string;
  dialShape: string;
  movement: string;
  waterResistant: '' | 'yes' | 'no';
  stoneType: string;
  certification: '' | 'yes' | 'no';
}

export const EMPTY_FASHION_FILTERS: FashionFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  keywords: '',
  condition: '',
  brand: '',
  clothingType: '',
  gender: '',
  size: [],
  fitType: '',
  color: [],
  material: '',
  sleeveType: '',
  pattern: '',
  season: '',
  occasion: '',
  authenticity: '',
  warranty: '',
  tagsAvailable: '',
  model: '',
  shoeType: '',
  originalBox: '',
  usageType: '',
  bagType: '',
  closureType: '',
  strapType: '',
  waterproof: '',
  type: '',
  style: '',
  displayType: '',
  strapMaterial: '',
  dialShape: '',
  movement: '',
  waterResistant: '',
  stoneType: '',
  certification: '',
};

export interface SparePartsFilterState {
  subcategory: SparePartsSubcategory | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  seller_type: 'Individual' | 'Dealer' | '';
  keyword: string;
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  make: string;
  model: string;
  year_from: string;
  year_to: string;
  engine_type: '' | 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: '' | 'Manual' | 'Automatic';
  device_type: string;
  compatible_brand: string;
  compatible_model: string;
  version_series: string;
  part_name: string;
  part_type: string[];
  part_number: string;
  oem_aftermarket: '' | 'Original' | 'Aftermarket';
  material: string;
  color: string;
  weight_min: string;
  weight_max: string;
  dimension_length: string;
  dimension_width: string;
  dimension_height: string;
  warranty: '' | 'yes' | 'no';
  availability: '' | 'In Stock' | 'Out of Stock';
  placement: '' | 'Front' | 'Rear' | 'Left' | 'Right' | 'Universal';
  mileage: string;
  installation_type: '' | 'Easy' | 'Professional Required';
  included_components: string[];
  certification: string;
  voltage: string;
  power_rating: string;
  connector_type: string;
  compatibility_type: string;
  safety_certification: string;
  machine_type: string;
  load_capacity: string;
  operating_pressure: string;
  temperature_range: string;
  industrial_grade: '' | 'yes' | 'no';
}

export const EMPTY_SPARE_PARTS_FILTERS: SparePartsFilterState = {
  subcategory: '',
  postedDate: '',
  seller_type: '',
  keyword: '',
  condition: '',
  brand: '',
  make: '',
  model: '',
  year_from: '',
  year_to: '',
  engine_type: '',
  transmission: '',
  device_type: '',
  compatible_brand: '',
  compatible_model: '',
  version_series: '',
  part_name: '',
  part_type: [],
  part_number: '',
  oem_aftermarket: '',
  material: '',
  color: '',
  weight_min: '',
  weight_max: '',
  dimension_length: '',
  dimension_width: '',
  dimension_height: '',
  warranty: '',
  availability: '',
  placement: '',
  mileage: '',
  installation_type: '',
  included_components: [],
  certification: '',
  voltage: '',
  power_rating: '',
  connector_type: '',
  compatibility_type: '',
  safety_certification: '',
  machine_type: '',
  load_capacity: '',
  operating_pressure: '',
  temperature_range: '',
  industrial_grade: '',
};

export interface HealthBeautyFilterState {
  subcategory: HealthBeautySubcategory | '';
  keywords: string;
  condition: 'New' | 'Used' | 'Unopened' | '';
  brand: string;
  sellerType: 'Individual' | 'Dealer' | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  // cross-subcategory
  product_type: string;
  gender: string;
  formulation: string;
  // skincare
  skin_type: string;
  concern: string;
  has_spf: '' | 'yes' | 'no';
  organic_natural: '' | 'yes' | 'no';
  dermatologically_tested: '' | 'yes' | 'no';
  // haircare
  hair_type: string;
  sulfate_free: '' | 'yes' | 'no';
  organic: '' | 'yes' | 'no';
  // makeup
  finish: string;
  coverage: string;
  waterproof: '' | 'yes' | 'no';
  // fragrance
  fragrance_family: string;
  concentration: string;
  // health care
  prescription_required: '' | 'yes' | 'no';
  // beauty tools
  power_source: string;
  usage_area: string;
  warranty: '' | 'yes' | 'no';
}

export const EMPTY_HEALTH_BEAUTY_FILTERS: HealthBeautyFilterState = {
  subcategory: '',
  keywords: '',
  condition: '',
  brand: '',
  sellerType: '',
  postedDate: '',
  product_type: '',
  gender: '',
  formulation: '',
  skin_type: '',
  concern: '',
  has_spf: '',
  organic_natural: '',
  dermatologically_tested: '',
  hair_type: '',
  sulfate_free: '',
  organic: '',
  finish: '',
  coverage: '',
  waterproof: '',
  fragrance_family: '',
  concentration: '',
  prescription_required: '',
  power_source: '',
  usage_area: '',
  warranty: '',
};

export interface HomeFurnitureFilterState {
  subcategory: HomeFurnitureSubcategory | '';
  postedDate: '' | 'today' | 'last7' | 'last30';
  sellerType: 'Individual' | 'Dealer' | '';
  keywords: string;
  condition: 'New' | 'Used' | 'Refurbished' | '';
  brand: string;
  furniture_type: string;
  material: string;
  color: string[];
  length: string;
  width: string;
  height: string;
  weight: string;
  seating_capacity: string;
  style: string;
  assembly_required: '' | 'yes' | 'no';
  condition_details: string;
  usage: string;
  warranty: string;
  included_items: string;
  decor_type: string;
  theme: string;
  handmade: '' | 'yes' | 'no';
  set_or_single: string;
  product_type: string;
  capacity: string;
  dishwasher_safe: '' | 'yes' | 'no';
  microwave_safe: '' | 'yes' | 'no';
  set_size: string;
  lighting_type: string;
  power_source: string;
  wattage: string;
  light_color: string;
  smart_lighting: '' | 'yes' | 'no';
  dimmable: '' | 'yes' | 'no';
  installation_type: string;
  storage_type: string;
  compartments: string;
  wall_mounted: '' | 'yes' | 'no';
  lockable: '' | 'yes' | 'no';
  custom_spec_1_key: string;
  custom_spec_1_value: string;
  custom_spec_2_key: string;
  custom_spec_2_value: string;
  custom_spec_3_key: string;
  custom_spec_3_value: string;
}

export const EMPTY_HOME_FURNITURE_FILTERS: HomeFurnitureFilterState = {
  subcategory: '',
  postedDate: '',
  sellerType: '',
  keywords: '',
  condition: '',
  brand: '',
  furniture_type: '',
  material: '',
  color: [],
  length: '',
  width: '',
  height: '',
  weight: '',
  seating_capacity: '',
  style: '',
  assembly_required: '',
  condition_details: '',
  usage: '',
  warranty: '',
  included_items: '',
  decor_type: '',
  theme: '',
  handmade: '',
  set_or_single: '',
  product_type: '',
  capacity: '',
  dishwasher_safe: '',
  microwave_safe: '',
  set_size: '',
  lighting_type: '',
  power_source: '',
  wattage: '',
  light_color: '',
  smart_lighting: '',
  dimmable: '',
  installation_type: '',
  storage_type: '',
  compartments: '',
  wall_mounted: '',
  lockable: '',
  custom_spec_1_key: '',
  custom_spec_1_value: '',
  custom_spec_2_key: '',
  custom_spec_2_value: '',
  custom_spec_3_key: '',
  custom_spec_3_value: '',
};

// â”€â”€â”€ Jobs Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface JobsFilterState {
  subcategory: JobSubcategory | '';
  keywords: string;
  postedDate: '' | 'today' | 'last7' | 'last30';
  sellerType: 'Individual' | 'Dealer' | '';
  employmentType: string;
  experienceLevel: string;
  minSalary: string;
  maxSalary: string;
  currency: string;
  benefits: string[];
  isRemote: '' | 'yes' | 'no';
  country: string;
  city: string;
  applicationMethod: string;
}

export const EMPTY_JOBS_FILTERS: JobsFilterState = {
  subcategory: '',
  keywords: '',
  postedDate: '',
  sellerType: '',
  employmentType: '',
  experienceLevel: '',
  minSalary: '',
  maxSalary: '',
  currency: '',
  benefits: [],
  isRemote: '',
  country: '',
  city: '',
  applicationMethod: '',
};

// â”€â”€â”€ Services Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ServicesFilterState {
  subcategory: ServicesSubcategory | '';
  keywords: string;
  postedDate: '' | 'today' | 'last7' | 'last30';
  serviceType: ServiceType | '';
  pricingType: PricingType | '';
  priceMin: string;
  priceMax: string;
  currency: string;
  city: string;
  emergencyAvailable: '' | 'yes' | 'no';
  // Subcategory-specific spec fields
  service_type: string;
  experience_years: string;
  certification: '' | 'yes' | 'no';
  warranty: '' | 'yes' | 'no';
  warranty_duration: string;
  tools_provided: '' | 'yes' | 'no';
  spare_parts_included: '' | 'yes' | 'no';
  service_duration: string;
  materials_included: '' | 'yes' | 'no';
  specialized_in: string;
  gender_served: string;
  certified_professional: '' | 'yes' | 'no';
  products_used: string;
  session_duration: string;
  home_service_available: '' | 'yes' | 'no';
  subject_course: string;
  level: string;
  mode: string;
  group_or_individual: string;
  duration_per_session: string;
  skills: string[];
  tools_technologies: string;
  delivery_time: string;
  revisions_included: string;
  portfolio_link: string;
  event_types: string[];
  team_size: string;
  equipment_provided: '' | 'yes' | 'no';
  travel_available: '' | 'yes' | 'no';
  duration: string;
  industry: string;
  consultation_mode: string;
  specialization: string;
  license_verified: '' | 'yes' | 'no';
  clinic_or_home: string;
  custom_service_type: string;
  description_detail: string;
}

export const EMPTY_SERVICES_FILTERS: ServicesFilterState = {
  subcategory: '',
  keywords: '',
  postedDate: '',
  serviceType: '',
  pricingType: '',
  priceMin: '',
  priceMax: '',
  currency: '',
  city: '',
  emergencyAvailable: '',
  service_type: '',
  experience_years: '',
  certification: '',
  warranty: '',
  warranty_duration: '',
  tools_provided: '',
  spare_parts_included: '',
  service_duration: '',
  materials_included: '',
  specialized_in: '',
  gender_served: '',
  certified_professional: '',
  products_used: '',
  session_duration: '',
  home_service_available: '',
  subject_course: '',
  level: '',
  mode: '',
  group_or_individual: '',
  duration_per_session: '',
  skills: [],
  tools_technologies: '',
  delivery_time: '',
  revisions_included: '',
  portfolio_link: '',
  event_types: [],
  team_size: '',
  equipment_provided: '',
  travel_available: '',
  duration: '',
  industry: '',
  consultation_mode: '',
  specialization: '',
  license_verified: '',
  clinic_or_home: '',
  custom_service_type: '',
  description_detail: '',
};

// â”€â”€â”€ Sports & Hobby Filter State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface SportsHobbyFilterState {
  subcategory: string;
  keywords: string;
  condition: string;
  postedDate: string;
  sellerType: string;
  brand: string;
  currency: string;
  age_group: string;
  material: string;
  priceMin: string;
  priceMax: string;
  // Sports Equipment specific
  equipment_type: string;
  size: string;
  weight: string;
  // Fitness Gear specific
  gear_type: string;
  max_weight: string;
  electronic: string;
  foldable: string;
  // Outdoor Gear specific
  waterproof: string;
  season: string;
  capacity: string;
  // Team Sports specific
  sport: string;
  team_size: string;
  league_approved: string;
  // Water Sports specific
  sport_type: string;
  floatation: string;
  // Winter Sports specific
  skill_level: string;
  bindings_included: string;
  // Collectibles specific
  collectible_type: string;
  year: string;
  authenticity: string;
  limited_edition: string;
  // Hobby Tools specific
  tool_type: string;
  power_source: string;
  safety_features: string;
  // Musical Instruments specific
  instrument_type: string;
  accessories_included: string;
  // Art Supplies specific
  supply_type: string;
  quantity: string;
  non_toxic: string;
  // Games & Puzzles specific
  game_type: string;
  player_count: string;
  complete_set: string;
  age_recommendation: string;
  // Other Sports & Hobby
  custom_type: string;
  description: string;
}

export const EMPTY_SPORTS_HOBBY_FILTERS: SportsHobbyFilterState = {
  subcategory: '',
  keywords: '',
  condition: '',
  postedDate: '',
  sellerType: '',
  brand: '',
  currency: '',
  age_group: '',
  material: '',
  priceMin: '',
  priceMax: '',
  equipment_type: '',
  size: '',
  weight: '',
  gear_type: '',
  max_weight: '',
  electronic: '',
  foldable: '',
  waterproof: '',
  season: '',
  capacity: '',
  sport: '',
  team_size: '',
  league_approved: '',
  sport_type: '',
  floatation: '',
  skill_level: '',
  bindings_included: '',
  collectible_type: '',
  year: '',
  authenticity: '',
  limited_edition: '',
  tool_type: '',
  power_source: '',
  safety_features: '',
  instrument_type: '',
  accessories_included: '',
  supply_type: '',
  quantity: '',
  non_toxic: '',
  game_type: '',
  player_count: '',
  complete_set: '',
  age_recommendation: '',
  custom_type: '',
  description: '',
};

const RAM_OPTIONS = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB+'];
const STORAGE_OPTIONS = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
const REFRESH_RATE_OPTIONS = ['60Hz', '90Hz', '120Hz+'];
const OS_MOBILE_OPTIONS = ['Android', 'iOS'];
const TV_RESOLUTION_OPTIONS = ['HD', 'Full HD', '4K', '8K'];
const TV_PANEL_OPTIONS = ['LED', 'OLED', 'QLED'];
const TV_OS_OPTIONS = ['Android TV', 'Tizen', 'WebOS'];
const LAPTOP_PROCESSOR_OPTIONS = ['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9'];
const STORAGE_TYPE_OPTIONS = ['HDD', 'SSD', 'NVMe'];
const GPU_OPTIONS = ['Integrated', 'NVIDIA', 'AMD'];
const LAPTOP_RESOLUTION_OPTIONS = ['HD', 'FHD', '2K', '4K'];
const USAGE_TYPE_OPTIONS = ['Gaming', 'Business', 'Student', 'Design'];
const DESKTOP_FORM_FACTOR_OPTIONS = ['Tower', 'Mini PC', 'All-in-One'];
const APPLIANCE_TYPE_OPTIONS = ['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Other'];
const ENERGY_RATING_OPTIONS = ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'];
const REFRIGERATOR_TYPE_OPTIONS = ['Single Door', 'Double Door', 'Side-by-Side'];
const DEFROST_TYPE_OPTIONS = ['Direct Cool', 'Frost Free'];
const WASHING_MACHINE_TYPE_OPTIONS = ['Front Load', 'Top Load'];
const WASHING_MODE_OPTIONS = ['Automatic', 'Semi'];
const AC_TYPE_OPTIONS = ['Split', 'Window'];
const INSTRUMENT_TYPE_OPTIONS = ['Guitar', 'Piano', 'Drums', 'Violin', 'Keyboard', 'Other'];
const SKILL_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Professional'];
const OTHER_FEATURE_OPTIONS = ['Bluetooth', 'Wi-Fi', 'NFC', 'Fast Charging', 'Water Resistant'];
// FASHION_COLOR_OPTIONS and FASHION_SIZE_OPTIONS reserved for future fashion filter enhancements



// â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FilterSidebarProps {
    animalsLivestockFilters: AnimalsLivestockFilterState;
    onAnimalsLivestockFiltersChange: (filters: AnimalsLivestockFilterState) => void;
    onAnimalsLivestockClear?: () => void;
    onAnimalsLivestockSearch?: () => void;
  vehicleFilters: VehicleFilterState;
  onVehicleFiltersChange: (filters: VehicleFilterState) => void;
  locale: Locale;
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  priceMin: string;
  onPriceMinChange: (value: string) => void;
  priceMax: string;
  onPriceMaxChange: (value: string) => void;
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  realEstateFilters: RealEstateFilterState;
  onRealEstateFiltersChange: (filters: RealEstateFilterState) => void;
  electronicsFilters: ElectronicsFilterState;
  onElectronicsFiltersChange: (filters: ElectronicsFilterState) => void;
  fashionFilters: FashionFilterState;
  onFashionFiltersChange: (filters: FashionFilterState) => void;
  sparePartsFilters: SparePartsFilterState;
  onSparePartsFiltersChange: (filters: SparePartsFilterState) => void;
  onElectronicsClear?: () => void;
  onElectronicsSearch?: () => void;
  onFashionClear?: () => void;
  onFashionSearch?: () => void;
  onSparePartsClear?: () => void;
  onSparePartsSearch?: () => void;
  healthBeautyFilters: HealthBeautyFilterState;
  onHealthBeautyFiltersChange: (filters: HealthBeautyFilterState) => void;
  onHealthBeautyClear?: () => void;
  onHealthBeautySearch?: () => void;
  homeFurnitureFilters: HomeFurnitureFilterState;
  onHomeFurnitureFiltersChange: (filters: HomeFurnitureFilterState) => void;
  onHomeFurnitureClear?: () => void;
  onHomeFurnitureSearch?: () => void;
  jobsFilters: JobsFilterState;
  onJobsFiltersChange: (filters: JobsFilterState) => void;
  onJobsClear?: () => void;
  onJobsSearch?: () => void;
  servicesFilters: ServicesFilterState;
  onServicesFiltersChange: (filters: ServicesFilterState) => void;
  onServicesClear?: () => void;
  onServicesSearch?: () => void;
  sportsHobbyFilters: SportsHobbyFilterState;
  onSportsHobbyFiltersChange: (filters: SportsHobbyFilterState) => void;
  onSportsHobbyClear?: () => void;
  onSportsHobbySearch?: () => void;
  foodAgricultureFilters: FoodAgricultureFilterState;
  onFoodAgricultureFiltersChange: (filters: FoodAgricultureFilterState) => void;
  onFoodAgricultureClear?: () => void;
  onFoodAgricultureSearch?: () => void;
  booksEducationFilters: BooksEducationFilterState;
  onBooksEducationFiltersChange: (filters: BooksEducationFilterState) => void;
  onBooksEducationClear?: () => void;
  onBooksEducationSearch?: () => void;
  babyKidsFilters: BabyKidsFilterState;
  onBabyKidsFiltersChange: (filters: BabyKidsFilterState) => void;
  onBabyKidsClear?: () => void;
  onBabyKidsSearch?: () => void;
  businessIndustryFilters: BusinessIndustryFilterState;
  onBusinessIndustryFiltersChange: (filters: BusinessIndustryFilterState) => void;
  onBusinessIndustryClear?: () => void;
  onBusinessIndustrySearch?: () => void;
  shoppingGroceriesFilters: ShoppingGroceriesFilterState;
  onShoppingGroceriesFiltersChange: (filters: ShoppingGroceriesFilterState) => void;
  onShoppingGroceriesClear?: () => void;
  onShoppingGroceriesSearch?: () => void;
}

const CONDITIONS = [
  { value: 'new',      translationKey: 'newCondition' },
  { value: 'like_new', translationKey: 'likeNew' },
  { value: 'good',     translationKey: 'good' },
  { value: 'fair',     translationKey: 'fair' },
] as const;

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Section: React.FC<{ label: string; isRtl: boolean; children: React.ReactNode }> = ({ label, isRtl, children }) => (
  <div>
    <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
      {label}
    </p>
    {children}
  </div>
);


const MultiCheck: React.FC<{
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  isRtl: boolean;
}> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map(({ value, label }) => {
      const active = selected.includes(value);
      return (
        <button
          key={value}
          type="button"
          onClick={() => onToggle(value)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
            active
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'bg-white border-slate-300 text-slate-600 hover:border-primary-400'
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const RE_PURPOSE_OPTIONS = ['forSale', 'forRent'] as const;
const RE_PROPERTY_TYPES = [
  'apartment',
  'house_villa',
  'commercial',
  'office',
  'shop_retail',
  'land_plot',
  'industrial',
  'room_shared',
  'other'
] as const;
const RE_COMMERCIAL_TYPES = ['office', 'shop', 'showroom'] as const;
const RE_LAND_TYPES = ['residential', 'commercial', 'agricultural'] as const;
const RE_INDUSTRIAL_TYPES = ['warehouse', 'factory'] as const;
const RE_CONDITIONS = ['new', 'used', 'renovated'] as const;
const RE_KITCHEN_TYPES = ['open', 'closed'] as const;
const RE_FURNISHING_TYPES = ['furnished', 'semiFurnished', 'unfurnished'] as const;

interface DbCategory {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string | null;
  parent_id: number | null;
  sort_order: number | null;
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  animalsLivestockFilters,
  onAnimalsLivestockFiltersChange,
  onAnimalsLivestockClear,
  onAnimalsLivestockSearch,
  locale,
  selectedCategory,
  onCategoryChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  selectedConditions,
  onConditionsChange,
  selectedCity,
  onCityChange,
  realEstateFilters,
  onRealEstateFiltersChange,
  electronicsFilters,
  onElectronicsFiltersChange,
  fashionFilters,
  onFashionFiltersChange,
  sparePartsFilters,
  onSparePartsFiltersChange,
  onElectronicsClear,
  onElectronicsSearch,
  onFashionClear,
  onFashionSearch,
  onSparePartsClear,
  onSparePartsSearch,
  healthBeautyFilters,
  onHealthBeautyFiltersChange,
  onHealthBeautyClear,
  onHealthBeautySearch,
  homeFurnitureFilters,
  onHomeFurnitureFiltersChange,
  onHomeFurnitureClear,
  onHomeFurnitureSearch,
  jobsFilters,
  onJobsFiltersChange,
  onJobsClear,
  onJobsSearch,
  servicesFilters,
  onServicesFiltersChange,
  onServicesClear,
  onServicesSearch,
  sportsHobbyFilters,
  onSportsHobbyFiltersChange,
  onSportsHobbyClear,
  onSportsHobbySearch,
  foodAgricultureFilters,
  onFoodAgricultureFiltersChange,
  onFoodAgricultureClear,
  onFoodAgricultureSearch,
  booksEducationFilters,
  onBooksEducationFiltersChange,
  onBooksEducationClear,
  onBooksEducationSearch,
  babyKidsFilters,
  onBabyKidsFiltersChange,
  onBabyKidsClear,
  onBabyKidsSearch,
  businessIndustryFilters,
  onBusinessIndustryFiltersChange,
  onBusinessIndustryClear,
  onBusinessIndustrySearch,
  shoppingGroceriesFilters,
  onShoppingGroceriesFiltersChange,
  onShoppingGroceriesClear,
  onShoppingGroceriesSearch,
  vehicleFilters,
  onVehicleFiltersChange,
}) => {

  // Hooks and helpers must be inside the function body
  const { cities } = useCities();

  // dbCategories state
  const [dbCategories, setDbCategories] = React.useState<DbCategory[]>([]);
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('id, name_en, name_ps, name_fa, slug, parent_id, sort_order')
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (!data) return;
        setDbCategories(
          ((data as DbCategory[]) || []).filter(
            (c) => c.slug !== 'mobile-phones' && c.slug !== 'phones'
          )
        );
      } catch (error) {
        console.error('Failed to load categories for filter sidebar:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fallback for getLocalizedDbCategoryName
  const getLocalizedDbCategoryName = (category: DbCategory): string => {
    switch (locale) {
      case 'ps':
        return category.name_ps;
      case 'fa':
        return category.name_fa;
      case 'en':
      default:
        return category.name_en;
    }
  };

  // The rest of the function body continues...

  const t = useTranslations('search');

  const tCommon = useTranslations('common');
  const tPostAd = useTranslations('postAd');
  const isRtl = isRTL(locale);

  // Translation helpers for vehicles and real estate (must be before any JSX that uses them)
  // Translation helpers and dedupedDbCategories fallback (must be after t and dbCategories are defined)
  // Note: sportsHobby, healthBeauty, spareParts keys live under postAd namespace, not common
  const tSH = (key: string) => {
    const fullKey = `sportsHobby.${key}` as Parameters<typeof tPostAd>[0];
    const translated = tPostAd(fullKey);
    if (translated === fullKey || translated.includes('sportsHobby.')) {
      const lastPart = key.split('.').pop() || key;
      const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
    return translated;
  }; tSH.has = (key: string) => {
    const fullKey = `sportsHobby.${key}` as Parameters<typeof tPostAd>[0];
    return tPostAd.has(fullKey);
  };
  const tHB = (key: string) => {
    const fullKey = `healthBeauty.${key}` as Parameters<typeof tPostAd>[0];
    const translated = tPostAd(fullKey);
    // If translation returns the key itself (no translation found), try to extract a fallback
    if (translated === fullKey || translated.includes('healthBeauty.')) {
      const lastPart = key.split('.').pop() || key;
      const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
    return translated;
  }; tHB.has = (_key: string) => true;
  const tFA = (key: string) => {
    const fullKey = `fashion.${key}` as Parameters<typeof tCommon>[0];
    const translated = tCommon(fullKey);
    // If translation returns the key itself (no translation found), try to extract a fallback
    if (translated === fullKey || translated.includes('fashion.')) {
      // Try to extract a reasonable fallback from the key
      const lastPart = key.split('.').pop() || key;
      // Convert camelCase or snake_case to spaced words
      const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
    return translated;
  }; tFA.has = (_key: string) => true;
  const tSP = (key: string) => {
    const fullKey = `spareParts.${key}` as Parameters<typeof tPostAd>[0];
    const translated = tPostAd(fullKey);
    if (translated === fullKey || translated.includes('spareParts.')) {
      const lastPart = key.split('.').pop() || key;
      const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
    return translated;
  }; tSP.has = (_key: string) => true;
  const tRE = (key: string) => tCommon((`realEstate.${key}`) as Parameters<typeof tCommon>[0]); tRE.has = (_key: string) => true;
  const tJO = (key: string) => {
    const fullKey = `jobs.${key}` as Parameters<typeof tPostAd>[0];
    const translated = tPostAd(fullKey);
    if (translated === fullKey || translated.includes('jobs.')) {
      const lastPart = key.split('.').pop() || key;
      const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      return words.charAt(0).toUpperCase() + words.slice(1);
    }
    return translated;
  }; tJO.has = (_key: string) => true;
  const tEL = (key: string) => tCommon((`electronics.${key}`) as Parameters<typeof tCommon>[0]); tEL.has = (_key: string) => true;
  
  // Sel component with localized default label
  const Sel: React.FC<{
    id?: string; label?: string; value: string; onChange: (v: string) => void; isRtl: boolean; children: React.ReactNode;
  }> = ({ id, label = t('filter'), value, onChange, isRtl, children }) => {
    const fallbackId = React.useId();
    const selectId = id || fallbackId;
    const labelId = `${selectId}-label`;

    return (
      <>
        <label id={labelId} htmlFor={selectId} className="sr-only">{label}</label>
        <select
          id={selectId}
          aria-labelledby={labelId}
          aria-label={label}
          title={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {children}
        </select>
      </>
    );
  };

  // dedupedDbCategories fallback
  const dedupedDbCategories = typeof dbCategories !== 'undefined' ? dbCategories : [];

  // Correct selected category ID if it's wrong
  const correctedSelectedCategory = React.useMemo(() => {
    if (selectedCategory === null) return null;
    
    // Database has been fixed - IDs now match constants
    // No mapping needed anymore
    return selectedCategory;
  }, [selectedCategory]);

  const selectedDbCategory = dedupedDbCategories.find((c) => c.id === selectedCategory);
  const selectedCategorySlug = (selectedDbCategory?.slug || '').toLowerCase();

  const isVehicles = correctedSelectedCategory === 1;
  const isRealEstate = correctedSelectedCategory === 2;
  const isElectronics = correctedSelectedCategory === 3;
  const isFashion = correctedSelectedCategory === 4;
  const isSpareParts = correctedSelectedCategory === 5;
  const isAnimalsLivestock = correctedSelectedCategory === 10 || selectedCategorySlug === 'animals-livestock';
  const isJobs = correctedSelectedCategory === 8;
  const isServices = correctedSelectedCategory === 9 || selectedCategorySlug === 'services';
  // Health & Beauty detection: check IDs first, then slugs, but exclude Jobs category
  const isHealthBeauty =
    selectedCategorySlug === 'health-beauty' ||
    selectedCategorySlug === 'health-and-beauty' ||
    correctedSelectedCategory === 13;

  const isHomeFurniture =
    selectedCategorySlug === 'home-furniture' ||
    selectedCategorySlug === 'home-and-furniture' ||
    correctedSelectedCategory === 6;
    
  const isSportsHobby =
    selectedCategorySlug === 'sports-hobby' ||
    selectedCategorySlug === 'sports-and-hobby' ||
    correctedSelectedCategory === 14;

  const isFoodAgriculture =
    selectedCategorySlug === 'food-agriculture' ||
    selectedCategorySlug === 'food-and-agriculture' ||
    correctedSelectedCategory === 11;

  const isBooksEducation =
    selectedCategorySlug === 'books-education' ||
    selectedCategorySlug === 'books-and-education' ||
    correctedSelectedCategory === 12;

  const isBabyKids =
    selectedCategorySlug === 'kids-baby' ||
    selectedCategorySlug === 'baby-kids' ||
    correctedSelectedCategory === 15;

  const isBusinessIndustry =
    selectedCategorySlug === 'business-industry' ||
    correctedSelectedCategory === 16;

  const isShoppingGroceries =
    selectedCategorySlug === 'shopping-groceries' ||
    correctedSelectedCategory === 17;

  const [fashionGeneralOpen, setFashionGeneralOpen] = React.useState(true);
  const [fashionSpecificOpen, setFashionSpecificOpen] = React.useState(true);
  const [hbGeneralOpen, setHbGeneralOpen] = React.useState(true);
  const [hbSpecificOpen, setHbSpecificOpen] = React.useState(true);
  const [sportsHobbyGeneralOpen, setSportsHobbyGeneralOpen] = React.useState(true);
  const [sportsHobbySpecificOpen, setSportsHobbySpecificOpen] = React.useState(true);

  const setREF = (patch: Partial<RealEstateFilterState>) =>
    onRealEstateFiltersChange({ ...realEstateFilters, ...patch });

  const setEF = (patch: Partial<ElectronicsFilterState>) =>
    onElectronicsFiltersChange({ ...electronicsFilters, ...patch });

  const setFF = (patch: Partial<FashionFilterState>) =>
    onFashionFiltersChange({ ...fashionFilters, ...patch });

  const setHB = (patch: Partial<HealthBeautyFilterState>) =>
    onHealthBeautyFiltersChange({ ...healthBeautyFilters, ...patch });

  const setSH = (patch: Partial<SportsHobbyFilterState>) =>
    onSportsHobbyFiltersChange({ ...sportsHobbyFilters, ...patch });

  const getSHFieldLabel = (field: string) => {
    const translationKey = getSportsHobbyFieldTranslationKey(field);
    return tSH(translationKey);
  };

  const getSHOptionLabel = (option: string) => {
    const translationKey = getSportsHobbyOptionTranslationKey(option);
    return tSH(translationKey);
  };

  const getHBFieldLabel = (field: string) => {
    const translationKey = getHealthBeautyFieldTranslationKey(field);
    return tHB(translationKey);
  };

  const getHBOptionLabel = (option: string) => {
    const translationKey = getHealthBeautyOptionTranslationKey(option);
    return tHB(translationKey);
  };

  const toggleFashionMulti = (field: 'size' | 'color', value: string) => {
    const current = fashionFilters[field];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setFF({ [field]: next });
  };


  // fashionBrands reserved for future fashion filter enhancements

  const getFashionFieldLabel = (field: string) => {
    const translationKey = getFashionFieldTranslationKey(field);
    return tFA(translationKey as Parameters<typeof tFA>[0]);
  };

  const getFashionOptionLabel = (option: string) => {
    const translationKey = getFashionOptionTranslationKey(option);
    try {
      const translated = tFA(translationKey as Parameters<typeof tFA>[0]);
      // If translation returns the key itself (contains dots), fall back to original option
      if (translated.includes('.') && translated.includes('optionLabels')) {
        return option;
      }
      return translated;
    } catch {
      return option;
    }
  };

  const handleConditionToggle = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter((c) => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 1; y >= 1980; y--) years.push(y);


  const renderFashionField = (field: FashionSpecField) => {
    const key = field.key as keyof FashionFilterState;
    const label = getFashionFieldLabel(field.key);

    if (field.type === 'multiselect') {
      const selected = fashionFilters[key] as string[];
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <MultiCheck
            options={(field.options || []).map((option) => ({ value: option, label: getFashionOptionLabel(option) }))}
            selected={selected || []}
            onToggle={(v) => toggleFashionMulti(key as 'size' | 'color', v)}
            isRtl={isRtl}
          />
        </Section>
      );
    }

    if (field.type === 'toggle') {
      const value = String(fashionFilters[key] || '');
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <Sel
            value={value}
            onChange={(v) => setFF({ [key]: v } as Partial<FashionFilterState>)}
            isRtl={isRtl}
          >
            <option value="">{tCommon('all')}</option>
            <option value="yes">{tCommon('yes')}</option>
            <option value="no">{tCommon('no')}</option>
          </Sel>
        </Section>
      );
    }

    if (field.type === 'select') {
      const value = String(fashionFilters[key] || '');
      return (
        <Section key={field.key} label={label} isRtl={isRtl}>
          <Sel
            value={value}
            onChange={(v) => setFF({ [key]: v } as Partial<FashionFilterState>)}
            isRtl={isRtl}
          >
            <option value="">{tCommon('all')}</option>
            {(field.options || []).map((option) => (
              <option key={option} value={option}>{getFashionOptionLabel(option)}</option>
            ))}
          </Sel>
        </Section>
      );
    }

    const value = String(fashionFilters[key] || '');
    return (
      <Section key={field.key} label={label} isRtl={isRtl}>
        <input
          type="text"
          value={value}
          onChange={(e) => setFF({ [key]: e.target.value } as Partial<FashionFilterState>)}
          placeholder={label}
          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
        />
      </Section>
    );
  };

  const fashionSpecFields = fashionFilters.subcategory
    ? getFashionSpecsConfig(fashionFilters.subcategory)
    : [];

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-xl space-y-5">

      {/* Category */}
      <Section label={t('filter')} isRtl={isRtl}>
        <Sel id="category-filter" value={selectedCategory?.toString() ?? ''} onChange={(v) => onCategoryChange(v === '' ? null : Number(v))} isRtl={isRtl}>
          <option value="">{tCommon('all')}</option>
          {dbCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{getLocalizedDbCategoryName(cat)}</option>
          ))}
        </Sel>
      </Section>

      {/* City */}
      <Section label={t('location')} isRtl={isRtl}>
        <Sel id="city-filter" value={selectedCity} onChange={onCityChange} isRtl={isRtl}>
          <option value="">{tCommon('all')}</option>
          {cities.map((city) => (
            <option key={city.name_en} value={city.name_en}>{getManagedCityName(city, locale)}</option>
          ))}
        </Sel>
      </Section>

      {/* Price Range (only for generic/non-category-specific searches) */}
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && !isSpareParts && !isAnimalsLivestock && !isHealthBeauty && !isHomeFurniture && !isJobs && !isServices && !isSportsHobby && !isFoodAgriculture && !isBooksEducation && !isBabyKids && !isBusinessIndustry && !isShoppingGroceries && (
        <Section label={t('priceRange')} isRtl={isRtl}>
          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <input type="number" placeholder={t('minPrice')} value={priceMin} onChange={(e) => onPriceMinChange(e.target.value)} min="0"
              className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
            <input type="number" placeholder={t('maxPrice')} value={priceMax} onChange={(e) => onPriceMaxChange(e.target.value)} min="0"
              className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
          </div>
        </Section>
      )}

      {/* Condition (non-vehicle/non-real-estate/non-electronics) */}
      {!isVehicles && !isRealEstate && !isElectronics && !isFashion && !isSpareParts && !isAnimalsLivestock && !isHealthBeauty && !isHomeFurniture && !isJobs && !isServices && !isSportsHobby && !isFoodAgriculture && !isBooksEducation && !isBabyKids && !isBusinessIndustry && !isShoppingGroceries && (
        <Section label={t('condition')} isRtl={isRtl}>
          <div className="space-y-2">
            {CONDITIONS.map(({ value, translationKey }) => (
              <label key={value} className={`flex items-center gap-2 cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`}>
                <input type="checkbox" checked={selectedConditions.includes(value)} onChange={() => handleConditionToggle(value)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700">{tCommon(translationKey)}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          VEHICLE-ONLY FILTERS
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isVehicles && (
        <VehicleFilter
          locale={locale}
          vehicleFilters={vehicleFilters}
          onVehicleFiltersChange={onVehicleFiltersChange}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          REAL ESTATE-ONLY FILTERS
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isRealEstate && (
        <>
          {/* Purpose */}
          <Section label={tRE('listingType')} isRtl={isRtl}>
            <Sel value={realEstateFilters.purpose} onChange={(v) => setREF({ purpose: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
            </Sel>
          </Section>

          {/* Property Type */}
          <Section label={tRE('propertyType')} isRtl={isRtl}>
            <Sel value={realEstateFilters.propertyType} onChange={(v) => setREF({ propertyType: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_PROPERTY_TYPES.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
            </Sel>
          </Section>

          {/* City */}
          <Section label={tRE('city')} isRtl={isRtl}>
            <Sel value={realEstateFilters.city} onChange={(v) => setREF({ city: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {cities.map((city) => (
                <option key={city.name_en} value={city.name_en}>{getManagedCityName(city, locale)}</option>
              ))}
            </Sel>
          </Section>

          {/* Area/District */}
          <Section label={tRE('areaDistrict')} isRtl={isRtl}>
            <input
              type="text"
              value={realEstateFilters.area}
              onChange={(e) => setREF({ area: e.target.value })}
              placeholder={tRE('enterAreaDistrict')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </Section>

          {/* Price Range */}
          <Section label={tRE('price')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                placeholder={t('min')}
                value={realEstateFilters.priceMin}
                onChange={(e) => setREF({ priceMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                placeholder={t('max')}
                value={realEstateFilters.priceMax}
                onChange={(e) => setREF({ priceMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          {/* Currency */}
          <Section label={tRE('currency')} isRtl={isRtl}>
            <Sel value={realEstateFilters.currency} onChange={(v) => setREF({ currency: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="AFN">{tRE('afd')}</option>
              <option value="PKR">{tRE('pkr')}</option>
              <option value="USD">{tRE('usd')}</option>
            </Sel>
          </Section>

          {/* Bedrooms */}
          <Section label={tRE('bedrooms')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                placeholder={t('min')}
                value={realEstateFilters.bedroomsMin}
                onChange={(e) => setREF({ bedroomsMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                placeholder={t('max')}
                value={realEstateFilters.bedroomsMax}
                onChange={(e) => setREF({ bedroomsMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          {/* Bathrooms */}
          <Section label={tRE('bathrooms')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                placeholder={t('min')}
                value={realEstateFilters.bathroomsMin}
                onChange={(e) => setREF({ bathroomsMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                placeholder={t('max')}
                value={realEstateFilters.bathroomsMax}
                onChange={(e) => setREF({ bathroomsMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          {/* Area Size */}
          <Section label={tRE('areaSize')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={t('minSqm')}
                value={realEstateFilters.areaSizeMin}
                onChange={(e) => setREF({ areaSizeMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={t('maxSqm')}
                value={realEstateFilters.areaSizeMax}
                onChange={(e) => setREF({ areaSizeMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          {/* Floor Number */}
          <Section label={tRE('floorNumber')} isRtl={isRtl}>
            <input
              type="number"
              min="0"
              value={realEstateFilters.floorNumber}
              onChange={(e) => setREF({ floorNumber: e.target.value })}
              placeholder={tRE('enterFloorNumber')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </Section>

          {/* Year Built */}
          <Section label={tRE('yearBuilt')} isRtl={isRtl}>
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="number"
                min="1800"
                max="2100"
                placeholder={t('min')}
                value={realEstateFilters.yearBuiltMin}
                onChange={(e) => setREF({ yearBuiltMin: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <input
                type="number"
                min="1800"
                max="2100"
                placeholder={t('max')}
                value={realEstateFilters.yearBuiltMax}
                onChange={(e) => setREF({ yearBuiltMax: e.target.value })}
                className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>
          </Section>

          {/* Parking Spaces */}
          <Section label={tRE('parkingSpaces')} isRtl={isRtl}>
            <input
              type="number"
              min="0"
              value={realEstateFilters.parkingSpaces}
              onChange={(e) => setREF({ parkingSpaces: e.target.value })}
              placeholder={tRE('enterParkingSpaces')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </Section>

          {/* Balcony */}
          <Section label={tRE('balcony')} isRtl={isRtl}>
            <Sel value={realEstateFilters.balcony} onChange={(v) => setREF({ balcony: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="yes">{tRE('yesBalcony')}</option>
              <option value="no">{tRE('noBalcony')}</option>
            </Sel>
          </Section>

          {/* Elevator */}
          <Section label={tRE('elevator')} isRtl={isRtl}>
            <Sel value={realEstateFilters.elevator} onChange={(v) => setREF({ elevator: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="yes">{tRE('yesElevator')}</option>
              <option value="no">{tRE('noElevator')}</option>
            </Sel>
          </Section>

          {/* Furnishing */}
          <Section label={tRE('furnishing')} isRtl={isRtl}>
            <Sel value={realEstateFilters.furnishing} onChange={(v) => setREF({ furnishing: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_FURNISHING_TYPES.map((option) => (
                <option key={option} value={option}>{tRE(option as Parameters<typeof tRE>[0])}</option>
              ))}
            </Sel>
          </Section>

          {/* Condition */}
          <Section label={tRE('condition')} isRtl={isRtl}>
            <Sel value={realEstateFilters.condition} onChange={(v) => setREF({ condition: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_CONDITIONS.map((option) => (
                <option key={option} value={option}>{tRE(option === 'new' ? 'newCondition' : option === 'used' ? 'usedCondition' : 'renovatedCondition')}</option>
              ))}
            </Sel>
          </Section>

          {/* Kitchen Type */}
          <Section label={tRE('kitchenType')} isRtl={isRtl}>
            <Sel value={realEstateFilters.kitchenType} onChange={(v) => setREF({ kitchenType: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {RE_KITCHEN_TYPES.map((option) => (
                <option key={option} value={option}>{tRE(option === 'open' ? 'openKitchenType' : 'closedKitchenType')}</option>
              ))}
            </Sel>
          </Section>

          {/* Commercial Type (when commercial/office/shop selected) */}
          {(realEstateFilters.propertyType === 'commercial' || realEstateFilters.propertyType === 'office' || realEstateFilters.propertyType === 'shop_retail') && (
            <Section label={tRE('commercialType')} isRtl={isRtl}>
              <Sel value={realEstateFilters.commercialType} onChange={(v) => setREF({ commercialType: v })} isRtl={isRtl}>
                <option value="">{tCommon('all')}</option>
                {RE_COMMERCIAL_TYPES.map((option) => (
                  <option key={option} value={option}>{tRE(option === 'office' ? 'officeCommercialType' : option === 'shop' ? 'shopCommercialType' : 'showroomCommercialType')}</option>
                ))}
              </Sel>
            </Section>
          )}

          {/* Meeting Rooms (for commercial) */}
          {(realEstateFilters.propertyType === 'commercial' || realEstateFilters.propertyType === 'office') && (
            <Section label={tRE('meetingRoomsLabel')} isRtl={isRtl}>
              <input
                type="number"
                min="0"
                value={realEstateFilters.meetingRooms}
                onChange={(e) => setREF({ meetingRooms: e.target.value })}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </Section>
          )}

          {/* Washrooms (for commercial) */}
          {(realEstateFilters.propertyType === 'commercial' || realEstateFilters.propertyType === 'office' || realEstateFilters.propertyType === 'shop_retail') && (
            <Section label={tRE('washroomsLabel')} isRtl={isRtl}>
              <input
                type="number"
                min="0"
                value={realEstateFilters.washrooms}
                onChange={(e) => setREF({ washrooms: e.target.value })}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </Section>
          )}

          {/* Land Type (when land selected) */}
          {realEstateFilters.propertyType === 'land_plot' && (
            <Section label={tRE('landTypeLabel')} isRtl={isRtl}>
              <Sel value={realEstateFilters.landType} onChange={(v) => setREF({ landType: v })} isRtl={isRtl}>
                <option value="">{tCommon('all')}</option>
                {RE_LAND_TYPES.map((option) => (
                  <option key={option} value={option}>{tRE(option === 'residential' ? 'residentialLandType' : option === 'commercial' ? 'commercialLandType' : 'agriculturalLandType')}</option>
                ))}
              </Sel>
            </Section>
          )}

          {/* Road Access (for land) */}
          {realEstateFilters.propertyType === 'land_plot' && (
            <Section label={tRE('roadAccessLabel')} isRtl={isRtl}>
              <Sel value={realEstateFilters.roadAccess} onChange={(v) => setREF({ roadAccess: v })} isRtl={isRtl}>
                <option value="">{tCommon('all')}</option>
                <option value="yes">{tCommon('yes')}</option>
                <option value="no">{tCommon('no')}</option>
              </Sel>
            </Section>
          )}

          {/* Corner Plot (for land) */}
          {realEstateFilters.propertyType === 'land_plot' && (
            <Section label={tRE('cornerPlotLabel')} isRtl={isRtl}>
              <Sel value={realEstateFilters.cornerPlot} onChange={(v) => setREF({ cornerPlot: v })} isRtl={isRtl}>
                <option value="">{tCommon('all')}</option>
                <option value="yes">{tCommon('yes')}</option>
                <option value="no">{tCommon('no')}</option>
              </Sel>
            </Section>
          )}

          {/* Industrial Type (when industrial selected) */}
          {realEstateFilters.propertyType === 'industrial' && (
            <Section label={tRE('propertyTypeLabel')} isRtl={isRtl}>
              <Sel value={realEstateFilters.industrialType} onChange={(v) => setREF({ industrialType: v })} isRtl={isRtl}>
                <option value="">{tCommon('all')}</option>
                {RE_INDUSTRIAL_TYPES.map((option) => (
                  <option key={option} value={option}>{tRE(option === 'warehouse' ? 'warehouseIndustrialType' : 'factoryIndustrialType')}</option>
                ))}
              </Sel>
            </Section>
          )}

          {/* Ceiling Height (for industrial) */}
          {realEstateFilters.propertyType === 'industrial' && (
            <Section label={tRE('ceilingHeightLabel')} isRtl={isRtl}>
              <input
                type="text"
                value={realEstateFilters.ceilingHeight}
                onChange={(e) => setREF({ ceilingHeight: e.target.value })}
                placeholder={tRE('ceilingHeightPlaceholder')}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </Section>
          )}

          {/* Loading Docks (for industrial) */}
          {realEstateFilters.propertyType === 'industrial' && (
            <Section label={tRE('loadingDocksLabel')} isRtl={isRtl}>
              <input
                type="text"
                value={realEstateFilters.loadingDocks}
                onChange={(e) => setREF({ loadingDocks: e.target.value })}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </Section>
          )}
        </>
      )}


      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ELECTRONICS-ONLY FILTERS
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isElectronics && (
        <>
          <Section label={t('subcategory')} isRtl={isRtl}>
            <Sel id="electronics-subcategory-filter" value={electronicsFilters.subcategory} onChange={(v) => setEF({ ...EMPTY_ELECTRONICS_FILTERS, subcategory: v as ElectronicsSubcategory | '' })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {ELECTRONICS_SUBCATEGORIES.map((sub) => {
                // Convert subcategory value to translation key
                // e.g., 'phones' -> 'subcategoryPhones', 'home-appliances' -> 'subcategoryHomeAppliances'
                // Special case: 'other-electronics' -> 'subcategoryOther' (not 'subcategoryOtherElectronics')
                const toCamelCase = (str: string) => {
                  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                };
                let baseKey = toCamelCase(sub.value);
                // Handle special case
                if (sub.value === 'other-electronics') {
                  baseKey = 'other';
                }
                const translationKey = `subcategory${baseKey.charAt(0).toUpperCase() + baseKey.slice(1)}` as const;
                return (
                  <option key={sub.value} value={sub.value}>
                    {tEL(translationKey)}
                  </option>
                );
              })}
            </Sel>
          </Section>

          <Section label={t('keywords')} isRtl={isRtl}>
            <input
              type="text"
              value={electronicsFilters.keywords}
              onChange={(e) => setEF({ keywords: e.target.value })}
              placeholder={t('keywords')}
              className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </Section>

          <Section label={t('condition')} isRtl={isRtl}>
            <Sel id="electronics-condition-filter" value={electronicsFilters.condition} onChange={(v) => setEF({ condition: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="new">{tCommon('newCondition')}</option>
              <option value="used">{tCommon('used')}</option>
              <option value="refurbished">{tCommon('refurbished')}</option>
            </Sel>
          </Section>

          <Section label={t('postedDate')} isRtl={isRtl}>
            <Sel value={electronicsFilters.postedDate} onChange={(v) => setEF({ postedDate: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="today">{t('today')}</option>
              <option value="last7">{t('last7Days')}</option>
              <option value="last30">{t('last30Days')}</option>
            </Sel>
          </Section>

          <Section label={t('sellerType')} isRtl={isRtl}>
            <Sel value={electronicsFilters.sellerType} onChange={(v) => setEF({ sellerType: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              <option value="individual">{t('individual')}</option>
              <option value="dealer">{t('dealer')}</option>
            </Sel>
          </Section>

          <Section label={t('make')} isRtl={isRtl}>
            <Sel id="electronics-make-filter" value={electronicsFilters.make} onChange={(v) => setEF({ make: v, model: '' })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {Object.keys(ELECTRONICS_BRAND_MODELS[electronicsFilters.subcategory as keyof typeof ELECTRONICS_BRAND_MODELS] || {}).sort().map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Sel>
          </Section>

          <Section label={t('model')} isRtl={isRtl}>
            <Sel id="electronics-model-filter" value={electronicsFilters.model} onChange={(v) => setEF({ model: v })} isRtl={isRtl}>
              <option value="">{tCommon('all')}</option>
              {(ELECTRONICS_BRAND_MODELS[electronicsFilters.subcategory as keyof typeof ELECTRONICS_BRAND_MODELS]?.[electronicsFilters.make] || []).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </Sel>
          </Section>

          {(electronicsFilters.subcategory === 'phones' || electronicsFilters.subcategory === 'tablets') && (
            <>
              <Section label={t('ram')} isRtl={isRtl}>
                <MultiCheck
                  options={RAM_OPTIONS.map((v) => ({ value: v, label: v }))}
                  selected={electronicsFilters.ram}
                  onToggle={(v) => {
                    const next = electronicsFilters.ram.includes(v)
                      ? electronicsFilters.ram.filter((x) => x !== v)
                      : [...electronicsFilters.ram, v];
                    setEF({ ram: next });
                  }}
                  isRtl={isRtl}
                />
              </Section>
              <Section label={t('internalStorage')} isRtl={isRtl}>
                <Sel value={electronicsFilters.internalStorage} onChange={(v) => setEF({ internalStorage: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('batteryCapacity')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.batteryCapacity} onChange={(e) => setEF({ batteryCapacity: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('screenSize')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('refreshRate')} isRtl={isRtl}>
                <Sel value={electronicsFilters.refreshRate} onChange={(v) => setEF({ refreshRate: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {REFRESH_RATE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('cameraRear')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.cameraRearMp} onChange={(e) => setEF({ cameraRearMp: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('cameraFront')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.cameraFrontMp} onChange={(e) => setEF({ cameraFrontMp: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('fiveG')} isRtl={isRtl}>
                <Sel value={electronicsFilters.supports5g} onChange={(v) => setEF({ supports5g: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('dualSim')} isRtl={isRtl}>
                <Sel value={electronicsFilters.dualSim} onChange={(v) => setEF({ dualSim: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('operatingSystem')} isRtl={isRtl}>
                <Sel value={electronicsFilters.operatingSystem} onChange={(v) => setEF({ operatingSystem: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {OS_MOBILE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('color')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.color} onChange={(e) => setEF({ color: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('accessoriesIncluded')} isRtl={isRtl}>
                <Sel value={electronicsFilters.accessoriesIncluded} onChange={(v) => setEF({ accessoriesIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('boxAvailable')} isRtl={isRtl}>
                <Sel value={electronicsFilters.boxAvailable} onChange={(v) => setEF({ boxAvailable: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'tv' && (
            <>
              <Section label={t('screenSize')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('resolution')} isRtl={isRtl}>
                <Sel value={electronicsFilters.resolution} onChange={(v) => setEF({ resolution: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_RESOLUTION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('smartTv')} isRtl={isRtl}>
                <Sel value={electronicsFilters.smartTv} onChange={(v) => setEF({ smartTv: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('panelType')} isRtl={isRtl}>
                <Sel value={electronicsFilters.panelType} onChange={(v) => setEF({ panelType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_PANEL_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('refreshRate')} isRtl={isRtl}>
                <Sel value={electronicsFilters.refreshRate} onChange={(v) => setEF({ refreshRate: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {REFRESH_RATE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('hdmiPorts')} isRtl={isRtl}>
                <input type="text" value={electronicsFilters.hdmiPorts} onChange={(e) => setEF({ hdmiPorts: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label={t('operatingSystem')} isRtl={isRtl}>
                <Sel value={electronicsFilters.operatingSystem} onChange={(v) => setEF({ operatingSystem: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {TV_OS_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('wallMountIncluded')} isRtl={isRtl}>
                <Sel value={electronicsFilters.wallMountIncluded} onChange={(v) => setEF({ wallMountIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {(electronicsFilters.subcategory === 'laptops' || electronicsFilters.subcategory === 'desktops') && (
            <>
              <Section label={t('processor')} isRtl={isRtl}>
                <Sel value={electronicsFilters.processor} onChange={(v) => setEF({ processor: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {LAPTOP_PROCESSOR_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('ram')} isRtl={isRtl}>
                <Sel value={electronicsFilters.internalStorage} onChange={(v) => setEF({ internalStorage: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {['4GB', '8GB', '16GB', '32GB', '64GB'].map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('storageType')} isRtl={isRtl}>
                <Sel value={electronicsFilters.storageType} onChange={(v) => setEF({ storageType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('storageSize')} isRtl={isRtl}>
                <Sel value={electronicsFilters.storageSize} onChange={(v) => setEF({ storageSize: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {STORAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('gpu')} isRtl={isRtl}>
                <Sel value={electronicsFilters.gpu} onChange={(v) => setEF({ gpu: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {GPU_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>

              {electronicsFilters.subcategory === 'laptops' && (
                <>
                  <Section label={t('screenSize')} isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.screenSize} onChange={(e) => setEF({ screenSize: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label={t('resolution')} isRtl={isRtl}>
                    <Sel value={electronicsFilters.resolution} onChange={(v) => setEF({ resolution: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {LAPTOP_RESOLUTION_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label={t('touchscreen')} isRtl={isRtl}>
                    <Sel value={electronicsFilters.touchscreen} onChange={(v) => setEF({ touchscreen: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label={t('batteryLife')} isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.batteryLife} onChange={(e) => setEF({ batteryLife: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label={t('operatingSystem')} isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.operatingSystem} onChange={(e) => setEF({ operatingSystem: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Usage Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.usageType} onChange={(v) => setEF({ usageType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {USAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Keyboard Backlight" isRtl={isRtl}>
                    <Sel value={electronicsFilters.keyboardBacklight} onChange={(v) => setEF({ keyboardBacklight: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Fingerprint Sensor" isRtl={isRtl}>
                    <Sel value={electronicsFilters.fingerprintSensor} onChange={(v) => setEF({ fingerprintSensor: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                </>
              )}

              {electronicsFilters.subcategory === 'desktops' && (
                <>
                  <Section label="Form Factor" isRtl={isRtl}>
                    <Sel value={electronicsFilters.formFactor} onChange={(v) => setEF({ formFactor: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {DESKTOP_FORM_FACTOR_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Operating System" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.operatingSystem} onChange={(e) => setEF({ operatingSystem: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Monitor Included" isRtl={isRtl}>
                    <Sel value={electronicsFilters.monitorIncluded} onChange={(v) => setEF({ monitorIncluded: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Keyboard/Mouse Included" isRtl={isRtl}>
                    <Sel value={electronicsFilters.keyboardMouseIncluded} onChange={(v) => setEF({ keyboardMouseIncluded: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Usage Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.usageType} onChange={(v) => setEF({ usageType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {USAGE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                </>
              )}

              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'home-appliances' && (
            <>
              <Section label="Appliance Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.applianceType} onChange={(v) => setEF({ applianceType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {APPLIANCE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Energy Rating" isRtl={isRtl}>
                <Sel value={electronicsFilters.energyRating} onChange={(v) => setEF({ energyRating: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {ENERGY_RATING_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>

              {electronicsFilters.applianceType === 'Refrigerator' && (
                <>
                  <Section label="Capacity (Liters)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.refrigeratorCapacityLiters} onChange={(e) => setEF({ refrigeratorCapacityLiters: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.refrigeratorType} onChange={(v) => setEF({ refrigeratorType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {REFRIGERATOR_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Defrost Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.defrostType} onChange={(v) => setEF({ defrostType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {DEFROST_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Inverter Technology" isRtl={isRtl}>
                    <Sel value={electronicsFilters.refrigeratorInverter} onChange={(v) => setEF({ refrigeratorInverter: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                </>
              )}

              {electronicsFilters.applianceType === 'Washing Machine' && (
                <>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.washingMachineType} onChange={(v) => setEF({ washingMachineType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {WASHING_MACHINE_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Capacity (kg)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.washingMachineCapacityKg} onChange={(e) => setEF({ washingMachineCapacityKg: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Spin Speed" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.spinSpeed} onChange={(e) => setEF({ spinSpeed: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Automatic/Semi" isRtl={isRtl}>
                    <Sel value={electronicsFilters.washingMode} onChange={(v) => setEF({ washingMode: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {WASHING_MODE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                </>
              )}

              {(electronicsFilters.applianceType === 'Air Conditioner' || electronicsFilters.applianceType === 'AC') && (
                <>
                  <Section label="Type" isRtl={isRtl}>
                    <Sel value={electronicsFilters.acType} onChange={(v) => setEF({ acType: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      {AC_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </Sel>
                  </Section>
                  <Section label="Capacity (BTU/Ton)" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.acCapacity} onChange={(e) => setEF({ acCapacity: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                  <Section label="Inverter" isRtl={isRtl}>
                    <Sel value={electronicsFilters.acInverter} onChange={(v) => setEF({ acInverter: v })} isRtl={isRtl}>
                      <option value="">{tCommon('all')}</option>
                      <option value="yes">{tCommon('yes')}</option>
                      <option value="no">{tCommon('no')}</option>
                    </Sel>
                  </Section>
                  <Section label="Cooling Area" isRtl={isRtl}>
                    <input type="text" value={electronicsFilters.coolingArea} onChange={(e) => setEF({ coolingArea: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                      className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
                  </Section>
                </>
              )}
            </>
          )}

          {electronicsFilters.subcategory === 'music-instruments' && (
            <>
              <Section label="Instrument Type" isRtl={isRtl}>
                <Sel value={electronicsFilters.instrumentType} onChange={(v) => setEF({ instrumentType: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {INSTRUMENT_TYPE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label="Acoustic / Electric" isRtl={isRtl}>
                <Sel value={electronicsFilters.acousticElectric} onChange={(v) => setEF({ acousticElectric: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="acoustic">Acoustic</option>
                  <option value="electric">Electric</option>
                </Sel>
              </Section>
              <Section label="Accessories Included" isRtl={isRtl}>
                <Sel value={electronicsFilters.accessoriesIncluded} onChange={(v) => setEF({ accessoriesIncluded: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
              <Section label="Skill Level" isRtl={isRtl}>
                <Sel value={electronicsFilters.skillLevel} onChange={(v) => setEF({ skillLevel: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  {SKILL_LEVEL_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </Sel>
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          {electronicsFilters.subcategory === 'other-electronics' && (
            <>
              <Section label="Device Type" isRtl={isRtl}>
                <input type="text" value={electronicsFilters.deviceType} onChange={(e) => setEF({ deviceType: e.target.value })} placeholder={t('enterValue')} title="Filter value"
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`} />
              </Section>
              <Section label="Features" isRtl={isRtl}>
                <MultiCheck
                  options={OTHER_FEATURE_OPTIONS.map((v) => ({ value: v, label: v }))}
                  selected={electronicsFilters.features}
                  onToggle={(v) => {
                    const next = electronicsFilters.features.includes(v)
                      ? electronicsFilters.features.filter((x) => x !== v)
                      : [...electronicsFilters.features, v];
                    setEF({ features: next });
                  }}
                  isRtl={isRtl}
                />
              </Section>
              <Section label={t('warranty')} isRtl={isRtl}>
                <Sel value={electronicsFilters.warranty} onChange={(v) => setEF({ warranty: v })} isRtl={isRtl}>
                  <option value="">{tCommon('all')}</option>
                  <option value="yes">{tCommon('yes')}</option>
                  <option value="no">{tCommon('no')}</option>
                </Sel>
              </Section>
            </>
          )}

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setEF(EMPTY_ELECTRONICS_FILTERS);
                onElectronicsClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => onElectronicsSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ANIMALS & LIVESTOCK FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isAnimalsLivestock && (
        <AnimalsFilterEnhanced
          locale={locale}
          filters={animalsLivestockFilters}
          onFiltersChange={onAnimalsLivestockFiltersChange}
          onClear={onAnimalsLivestockClear}
          onSearch={onAnimalsLivestockSearch}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FOOD & AGRICULTURE FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isFoodAgriculture && (
        <FoodAgricultureFilterEnhanced
          locale={locale}
          filters={foodAgricultureFilters}
          onFiltersChange={onFoodAgricultureFiltersChange}
          onClear={onFoodAgricultureClear}
          onSearch={onFoodAgricultureSearch}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          BOOKS & EDUCATION FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isBooksEducation && (
        <BooksEducationFilterEnhanced
          locale={locale}
          filters={booksEducationFilters}
          onFiltersChange={onBooksEducationFiltersChange}
          onClear={onBooksEducationClear}
          onSearch={onBooksEducationSearch}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          BABY & KIDS FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isBabyKids && (
        <BabyKidsFilterEnhanced
          locale={locale}
          filters={babyKidsFilters}
          onFiltersChange={onBabyKidsFiltersChange}
          onClear={onBabyKidsClear}
          onSearch={onBabyKidsSearch}
        />
      )}

      {isBusinessIndustry && (
        <BusinessIndustryFilterEnhanced
          locale={locale}
          filters={businessIndustryFilters}
          onFiltersChange={onBusinessIndustryFiltersChange}
          onClear={onBusinessIndustryClear}
          onSearch={onBusinessIndustrySearch}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SHOPPING & GROCERIES FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isShoppingGroceries && (
        <ShoppingGroceriesFilterEnhanced
          locale={locale}
          filters={shoppingGroceriesFilters}
          onFiltersChange={onShoppingGroceriesFiltersChange}
          onClear={onShoppingGroceriesClear}
          onSearch={onShoppingGroceriesSearch}
        />
      )}

      {/* END of Fashion filter block -- close fragment before starting Services */}

      {/* Ensure previous fragments/blocks are closed before this block */}

      {isFashion && (
        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setFashionGeneralOpen((v) => !v)}
              aria-expanded={fashionGeneralOpen ? "true" : "false"}
              className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {fashionGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    id="fashion-subcategory-filter"
                    value={fashionFilters.subcategory}
                    onChange={(v) => setFF({ ...EMPTY_FASHION_FILTERS, subcategory: v as FashionSubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {FASHION_SUBCATEGORIES.map((sub) => {
                      const translationKey = FASHION_SUBCATEGORY_LABEL_KEYS[sub.value];
                      return (
                        <option key={sub.value} value={sub.value}>
                          {tFA(translationKey)}
                        </option>
                      );
                    })}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={fashionFilters.keywords}
                    onChange={(e) => setFF({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel
                    id="fashion-condition-filter"
                    value={fashionFilters.condition}
                    onChange={(v) => setFF({ condition: v as FashionFilterState['condition'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="new">{tCommon('newCondition')}</option>
                    <option value="used">{tCommon('used')}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel
                    value={fashionFilters.postedDate}
                    onChange={(v) => setFF({ postedDate: v })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel
                    value={fashionFilters.sellerType}
                    onChange={(v) => setFF({ sellerType: v as FashionFilterState['sellerType'] })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{t('individual')}</option>
                    <option value="Dealer">{t('dealer')}</option>
                  </Sel>
                </Section>

                {fashionFilters.subcategory && (
                  <Section label={getFashionFieldLabel('brand')} isRtl={isRtl}>
                    <Sel
                      value={fashionFilters.brand}
                      onChange={(v) => setFF({ brand: v })}
                      isRtl={isRtl}
                    >
                      <option value="">{tCommon('all')}</option>
                      {FASHION_BRANDS_BY_SUBCATEGORY[fashionFilters.subcategory]?.map((brand) => (
                        <option key={brand} value={brand}>{getFashionOptionLabel(brand)}</option>
                      ))}
                    </Sel>
                  </Section>
                )}
              </div>
            )}
          </div>

          {fashionFilters.subcategory && fashionSpecFields.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setFashionSpecificOpen((v) => !v)}
                aria-expanded={fashionSpecificOpen ? "true" : "false"}
                className={`w-full px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {t('subcategoryFilters')}
              </button>
              {fashionSpecificOpen && (
                <div className="space-y-4 px-3 pb-3">
                  {fashionSpecFields.map((field) => renderFashionField(field))}
                </div>
              )}
            </div>
          )}

          <Section label={t('priceSlider')} isRtl={isRtl}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{t('minPrice')}: {priceMin ? Number(priceMin).toLocaleString() : 0}</span>
                <span className="text-sm text-slate-600">{t('maxPrice')}: {priceMax ? Number(priceMax).toLocaleString() : 200000}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="100"
                  value={priceMin ? Number(priceMin) : 0}
                  onChange={(e) => onPriceMinChange(e.target.value)}
                  aria-label={t('minPrice')}
                  title={t('minPrice')}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="100"
                  value={priceMax ? Number(priceMax) : 200000}
                  onChange={(e) => onPriceMaxChange(e.target.value)}
                  aria-label={t('maxPrice')}
                  title={t('maxPrice')}
                  className="w-full"
                />
              </div>
              <div className="text-xs text-slate-500 text-center">
                {t('dragSlidersToAdjust')}
              </div>
            </div>
          </Section>


          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setFF(EMPTY_FASHION_FILTERS);
                onFashionClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onFashionSearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}

      {isServices && (
        <ServicesFilterEnhanced
          locale={locale}
          filters={servicesFilters}
          onFiltersChange={onServicesFiltersChange}
          onClear={onServicesClear}
          onSearch={onServicesSearch}
        />
      )}

      {isJobs && (
        <JobsFilterEnhanced
          locale={locale}
          filters={jobsFilters}
          onFiltersChange={onJobsFiltersChange}
          onClear={onJobsClear}
          onSearch={onJobsSearch}
        />
      )}

      {isSpareParts && (
        <SparePartsFilterEnhanced
          locale={locale}
          filters={sparePartsFilters}
          onFiltersChange={onSparePartsFiltersChange}
          onClear={onSparePartsClear}
          onSearch={onSparePartsSearch}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={onPriceMinChange}
          onPriceMaxChange={onPriceMaxChange}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HOME & FURNITURE FILTERS (Enhanced)
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isHomeFurniture && (
        <HomeFurnitureFilterEnhanced
          locale={locale}
          filters={homeFurnitureFilters}
          onFiltersChange={onHomeFurnitureFiltersChange}
          onClear={onHomeFurnitureClear}
          onSearch={onHomeFurnitureSearch}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={onPriceMinChange}
          onPriceMaxChange={onPriceMaxChange}
        />
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HEALTH & BEAUTY FILTERS
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {isHealthBeauty && (
        <>
          {/* General Filters */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50">
            <button
              type="button"
              onClick={() => setHbGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-emerald-800 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {hbGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={healthBeautyFilters.subcategory}
                    onChange={(v) => setHB({ ...EMPTY_HEALTH_BEAUTY_FILTERS, subcategory: v as HealthBeautySubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {HEALTH_BEAUTY_SUBCATEGORIES.map((sub) => {
                      const translationKey = HEALTH_BEAUTY_SUBCATEGORY_LABEL_KEYS[sub.value];
                      return (
                        <option key={sub.value} value={sub.value}>
                          {tHB(translationKey as Parameters<typeof tHB>[0])}
                        </option>
                      );
                    })}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={healthBeautyFilters.keywords}
                    onChange={(e) => setHB({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.condition} onChange={(v) => setHB({ condition: v as HealthBeautyFilterState['condition'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="New">{getHBOptionLabel('New')}</option>
                    <option value="Used">{getHBOptionLabel('Used')}</option>
                    <option value="Unopened">{getHBOptionLabel('Unopened')}</option>
                  </Sel>
                </Section>

                <Section label={getHBFieldLabel('brand')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={healthBeautyFilters.brand}
                    onChange={(e) => setHB({ brand: e.target.value })}
                    placeholder={getHBFieldLabel('brand')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.sellerType} onChange={(v) => setHB({ sellerType: v as HealthBeautyFilterState['sellerType'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="Individual">{t('individual')}</option>
                    <option value="Dealer">{t('dealer')}</option>
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel value={healthBeautyFilters.postedDate} onChange={(v) => setHB({ postedDate: v as HealthBeautyFilterState['postedDate'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>
              </div>
            )}
          </div>

          {/* Subcategory-specific Filters */}
          {healthBeautyFilters.subcategory && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50">
              <button
                type="button"
                onClick={() => setHbSpecificOpen((v) => !v)}
                className={`w-full px-3 py-2 text-sm font-semibold text-emerald-800 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {t('subcategoryFilters')}
              </button>
              {hbSpecificOpen && (
                <div className="space-y-4 px-3 pb-3">

                  {/* Skincare */}
                  {healthBeautyFilters.subcategory === 'skincare' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Face Mask', 'Exfoliator', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concern')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concern} onChange={(v) => setHB({ concern: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Acne', 'Anti-aging', 'Hydration', 'Brightening', 'Pigmentation', 'Pores', 'Redness'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('formulation')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.formulation} onChange={(v) => setHB({ formulation: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Gel', 'Cream', 'Liquid', 'Foam', 'Lotion', 'Balm'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('gender')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.gender} onChange={(v) => setHB({ gender: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Unisex', 'Male', 'Female'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('has_spf')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.has_spf} onChange={(v) => setHB({ has_spf: v as HealthBeautyFilterState['has_spf'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic_natural')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic_natural} onChange={(v) => setHB({ organic_natural: v as HealthBeautyFilterState['organic_natural'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('dermatologically_tested')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.dermatologically_tested} onChange={(v) => setHB({ dermatologically_tested: v as HealthBeautyFilterState['dermatologically_tested'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Haircare */}
                  {healthBeautyFilters.subcategory === 'haircare' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Shampoo', 'Conditioner', 'Hair Oil', 'Serum', 'Mask', 'Leave-in', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('hair_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.hair_type} onChange={(v) => setHB({ hair_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Normal', 'Curly', 'Damaged'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concern')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concern} onChange={(v) => setHB({ concern: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Hair Fall', 'Dandruff', 'Growth', 'Repair', 'Frizz Control'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('formulation')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.formulation} onChange={(v) => setHB({ formulation: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Liquid', 'Cream', 'Oil', 'Gel', 'Foam'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('sulfate_free')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.sulfate_free} onChange={(v) => setHB({ sulfate_free: v as HealthBeautyFilterState['sulfate_free'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic} onChange={(v) => setHB({ organic: v as HealthBeautyFilterState['organic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Makeup */}
                  {healthBeautyFilters.subcategory === 'makeup' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Foundation', 'Lipstick', 'Mascara', 'Concealer', 'Blush', 'Eyeliner', 'Powder', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('finish')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.finish} onChange={(v) => setHB({ finish: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Matte', 'Glossy', 'Natural', 'Dewy'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('coverage')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.coverage} onChange={(v) => setHB({ coverage: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Light', 'Medium', 'Full'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('waterproof')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.waterproof} onChange={(v) => setHB({ waterproof: v as HealthBeautyFilterState['waterproof'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Fragrances */}
                  {healthBeautyFilters.subcategory === 'fragrances' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Perfume', 'Body Spray', 'Deodorant'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('gender')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.gender} onChange={(v) => setHB({ gender: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Unisex', 'Male', 'Female'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('fragrance_family')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.fragrance_family} onChange={(v) => setHB({ fragrance_family: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('concentration')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.concentration} onChange={(v) => setHB({ concentration: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['EDT', 'EDP', 'Parfum'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Personal Care */}
                  {healthBeautyFilters.subcategory === 'personal-care' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Soap', 'Body Wash', 'Toothpaste', 'Shaving', 'Sanitary', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('skin_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.skin_type} onChange={(v) => setHB({ skin_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Dry', 'Oily', 'Combination', 'Sensitive', 'All'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('organic')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.organic} onChange={(v) => setHB({ organic: v as HealthBeautyFilterState['organic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Health Care Products */}
                  {healthBeautyFilters.subcategory === 'health-care-products' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Vitamins', 'Supplements', 'Medical Items', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('prescription_required')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.prescription_required} onChange={(v) => setHB({ prescription_required: v as HealthBeautyFilterState['prescription_required'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Beauty Tools & Devices */}
                  {healthBeautyFilters.subcategory === 'beauty-tools-devices' && (
                    <>
                      <Section label={getHBFieldLabel('product_type')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.product_type} onChange={(v) => setHB({ product_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Hair Dryer', 'Trimmer', 'Facial Device', 'Massager', 'Other'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('power_source')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.power_source} onChange={(v) => setHB({ power_source: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Battery', 'Electric'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('usage_area')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.usage_area} onChange={(v) => setHB({ usage_area: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Face', 'Hair', 'Body'].map((o) => (
                            <option key={o} value={o}>{getHBOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getHBFieldLabel('warranty')} isRtl={isRtl}>
                        <Sel value={healthBeautyFilters.warranty} onChange={(v) => setHB({ warranty: v as HealthBeautyFilterState['warranty'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                </div>
              )}
            </div>
          )}

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setHB(EMPTY_HEALTH_BEAUTY_FILTERS);
                onHealthBeautyClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onHealthBeautySearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}

      {isSportsHobby && (
        <>
          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
              SPORTS & HOBBY FILTERS
             â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {/* General Filters */}
          <div className="rounded-lg border border-amber-200 bg-amber-50">
            <button
              type="button"
              onClick={() => setSportsHobbyGeneralOpen((v) => !v)}
              className={`w-full px-3 py-2 text-sm font-semibold text-amber-800 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('generalFilters')}
            </button>
            {sportsHobbyGeneralOpen && (
              <div className="space-y-4 px-3 pb-3">
                <Section label={t('subcategory')} isRtl={isRtl}>
                  <Sel
                    value={sportsHobbyFilters.subcategory}
                    onChange={(v) => setSH({ ...EMPTY_SPORTS_HOBBY_FILTERS, subcategory: v as SportsHobbySubcategory | '' })}
                    isRtl={isRtl}
                  >
                    <option value="">{tCommon('all')}</option>
                    {SPORTS_HOBBY_SUBCATEGORIES.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {tSH(SPORTS_HOBBY_SUBCATEGORY_LABEL_KEYS[sub.value as SportsHobbySubcategory] as Parameters<typeof tSH>[0])}
                      </option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('keywords')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sportsHobbyFilters.keywords}
                    onChange={(e) => setSH({ keywords: e.target.value })}
                    placeholder={t('keywords')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={t('condition')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.condition} onChange={(v) => setSH({ condition: v as SportsHobbyFilterState['condition'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {SPORTS_HOBBY_CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>{getSHOptionLabel(cond)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('sellerType')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.sellerType} onChange={(v) => setSH({ sellerType: v as SportsHobbyFilterState['sellerType'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {SELLER_TYPE_OPTIONS.map((st) => (
                      <option key={st} value={st}>{getSHOptionLabel(st)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('postedDate')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.postedDate} onChange={(v) => setSH({ postedDate: v as SportsHobbyFilterState['postedDate'] })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    <option value="today">{t('today')}</option>
                    <option value="last7">{t('last7Days')}</option>
                    <option value="last30">{t('last30Days')}</option>
                  </Sel>
                </Section>

                <Section label={getSHFieldLabel('brand')} isRtl={isRtl}>
                  <input
                    type="text"
                    value={sportsHobbyFilters.brand}
                    onChange={(e) => setSH({ brand: e.target.value })}
                    placeholder={getSHFieldLabel('brand')}
                    className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                </Section>

                <Section label={getSHFieldLabel('age_group')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.age_group} onChange={(v) => setSH({ age_group: v })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {AGE_GROUPS.map((age) => (
                      <option key={age} value={age}>{getSHOptionLabel(age)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={getSHFieldLabel('material')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.material} onChange={(v) => setSH({ material: v })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {MATERIALS.map((mat) => (
                      <option key={mat} value={mat}>{getSHOptionLabel(mat)}</option>
                    ))}
                  </Sel>
                </Section>

                <Section label={t('price')} isRtl={isRtl}>
                  <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="number"
                      placeholder={t('minPrice')}
                      value={sportsHobbyFilters.priceMin || ''}
                      onChange={(e) => setSH({ priceMin: e.target.value })}
                      min="0"
                      className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                    <input
                      type="number"
                      placeholder={t('maxPrice')}
                      value={sportsHobbyFilters.priceMax || ''}
                      onChange={(e) => setSH({ priceMax: e.target.value })}
                      min="0"
                      className={`w-1/2 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                    />
                  </div>
                </Section>

                <Section label={getSHFieldLabel('currency')} isRtl={isRtl}>
                  <Sel value={sportsHobbyFilters.currency} onChange={(v) => setSH({ currency: v })} isRtl={isRtl}>
                    <option value="">{tCommon('all')}</option>
                    {CURRENCY_OPTIONS.map((cur) => (
                      <option key={cur} value={cur}>{getSHOptionLabel(cur)}</option>
                    ))}
                  </Sel>
                </Section>
              </div>
            )}
          </div>

          {/* Subcategory-specific filters */}
          {sportsHobbyFilters.subcategory && (
            <div className="rounded-lg border border-amber-200 bg-amber-50">
              <button
                type="button"
                onClick={() => setSportsHobbySpecificOpen((v) => !v)}
                className={`w-full px-3 py-2 text-sm font-semibold text-amber-800 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                {t('subcategoryFilters')}
              </button>
              {sportsHobbySpecificOpen && (
                <div className="space-y-4 px-3 pb-3">

                  {/* Sports Equipment */}
                  {sportsHobbyFilters.subcategory === 'sports-equipment' && (
                    <>
                      <Section label={getSHFieldLabel('equipment_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.equipment_type} onChange={(v) => setSH({ equipment_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Ball Sports', 'Racket Sports', 'Goal Posts', 'Nets', 'Training Equipment', 'Protective Gear', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('size')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.size}
                          onChange={(e) => setSH({ size: e.target.value })}
                          placeholder="e.g., Medium, Size 5, 27 inches"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('weight')} isRtl={isRtl}>
                        <input
                          type="number"
                          value={sportsHobbyFilters.weight || ''}
                          onChange={(e) => setSH({ weight: e.target.value })}
                          min="0"
                          placeholder="0"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                    </>
                  )}

                  {/* Fitness Gear */}
                  {sportsHobbyFilters.subcategory === 'fitness-gear' && (
                    <>
                      <Section label={getSHFieldLabel('gear_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.gear_type} onChange={(v) => setSH({ gear_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Treadmill', 'Exercise Bike', 'Elliptical', 'Rowing Machine', 'Weight Bench', 'Dumbbells', 'Resistance Bands', 'Yoga Mat', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('max_weight')} isRtl={isRtl}>
                        <input
                          type="number"
                          value={sportsHobbyFilters.max_weight || ''}
                          onChange={(e) => setSH({ max_weight: e.target.value })}
                          min="0"
                          placeholder="0"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('electronic')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.electronic} onChange={(v) => setSH({ electronic: v as SportsHobbyFilterState['electronic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('foldable')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.foldable} onChange={(v) => setSH({ foldable: v as SportsHobbyFilterState['foldable'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Outdoor Gear */}
                  {sportsHobbyFilters.subcategory === 'outdoor-gear' && (
                    <>
                      <Section label={getSHFieldLabel('gear_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.gear_type} onChange={(v) => setSH({ gear_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Tent', 'Sleeping Bag', 'Backpack', 'Camping Stove', 'Hiking Poles', 'Climbing Gear', 'Fishing Gear', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('waterproof')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.waterproof} onChange={(v) => setSH({ waterproof: v as SportsHobbyFilterState['waterproof'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('season')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.season} onChange={(v) => setSH({ season: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['All Season', 'Summer', 'Winter', 'Spring/Fall'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('capacity')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.capacity}
                          onChange={(e) => setSH({ capacity: e.target.value })}
                          placeholder="e.g., 2-person, 65L"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                    </>
                  )}

                  {/* Team Sports */}
                  {sportsHobbyFilters.subcategory === 'team-sports' && (
                    <>
                      <Section label={getSHFieldLabel('sport')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.sport} onChange={(v) => setSH({ sport: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Soccer', 'Basketball', 'Volleyball', 'Cricket', 'Baseball', 'Hockey', 'Rugby', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('team_size')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.team_size} onChange={(v) => setSH({ team_size: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Individual', '2-player', 'Small Team (3-5)', 'Full Team (6+)'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('league_approved')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.league_approved} onChange={(v) => setSH({ league_approved: v as SportsHobbyFilterState['league_approved'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Water Sports */}
                  {sportsHobbyFilters.subcategory === 'water-sports' && (
                    <>
                      <Section label={getSHFieldLabel('sport_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.sport_type} onChange={(v) => setSH({ sport_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Swimming', 'Surfing', 'Diving', 'Kayaking', 'Canoeing', 'Paddleboarding', 'Waterskiing', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('floatation')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.floatation} onChange={(v) => setSH({ floatation: v as SportsHobbyFilterState['floatation'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('size')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.size}
                          onChange={(e) => setSH({ size: e.target.value })}
                          placeholder="e.g., 6ft board, Medium wetsuit"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                    </>
                  )}

                  {/* Winter Sports */}
                  {sportsHobbyFilters.subcategory === 'winter-sports' && (
                    <>
                      <Section label={getSHFieldLabel('sport_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.sport_type} onChange={(v) => setSH({ sport_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Skiing', 'Snowboarding', 'Ice Skating', 'Sledding', 'Hockey', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('skill_level')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.skill_level} onChange={(v) => setSH({ skill_level: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {SKILL_LEVELS.map((sl) => (
                            <option key={sl} value={sl}>{getSHOptionLabel(sl)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('size')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.size}
                          onChange={(e) => setSH({ size: e.target.value })}
                          placeholder="e.g., 160cm skis, Size 10 boots"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('bindings_included')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.bindings_included} onChange={(v) => setSH({ bindings_included: v as SportsHobbyFilterState['bindings_included'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Collectibles */}
                  {sportsHobbyFilters.subcategory === 'collectibles' && (
                    <>
                      <Section label={getSHFieldLabel('collectible_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.collectible_type} onChange={(v) => setSH({ collectible_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Action Figures', 'Model Kits', 'Trading Cards', 'Coins/Stamps', 'Memorabilia', 'Comics', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('year')} isRtl={isRtl}>
                        <input
                          type="number"
                          value={sportsHobbyFilters.year || ''}
                          onChange={(e) => setSH({ year: e.target.value })}
                          min="1900"
                          placeholder="1900"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('authenticity')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.authenticity} onChange={(v) => setSH({ authenticity: v as SportsHobbyFilterState['authenticity'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('limited_edition')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.limited_edition} onChange={(v) => setSH({ limited_edition: v as SportsHobbyFilterState['limited_edition'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Hobby Tools */}
                  {sportsHobbyFilters.subcategory === 'hobby-tools' && (
                    <>
                      <Section label={getSHFieldLabel('tool_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.tool_type} onChange={(v) => setSH({ tool_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Cutting Tools', 'Sanding Tools', 'Painting Tools', 'Measuring Tools', 'Power Tools', 'Hand Tools', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('power_source')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.power_source} onChange={(v) => setSH({ power_source: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Battery', 'Electric', 'Manual', 'Gas'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('safety_features')} isRtl={isRtl}>
                        <MultiCheck
                          options={['Safety Guard', 'Auto-shutoff', 'Overload Protection', 'Non-slip Grip'].map((o) => ({
                            value: o,
                            label: getSHOptionLabel(o),
                          }))}
                          selected={sportsHobbyFilters.safety_features ? sportsHobbyFilters.safety_features.split(',') : []}
                          onToggle={(v) => {
                            const current = sportsHobbyFilters.safety_features ? sportsHobbyFilters.safety_features.split(',').filter(Boolean) : [];
                            const next = current.includes(v)
                              ? current.filter((item) => item !== v)
                              : [...current, v];
                            setSH({ safety_features: next.join(',') });
                          }}
                          isRtl={isRtl}
                        />
                      </Section>
                    </>
                  )}

                  {/* Musical Instruments */}
                  {sportsHobbyFilters.subcategory === 'musical-instruments' && (
                    <>
                      <Section label={getSHFieldLabel('instrument_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.instrument_type} onChange={(v) => setSH({ instrument_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['String', 'Wind', 'Percussion', 'Keyboard', 'Electronic', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('skill_level')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.skill_level} onChange={(v) => setSH({ skill_level: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {SKILL_LEVELS.map((sl) => (
                            <option key={sl} value={sl}>{getSHOptionLabel(sl)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('accessories_included')} isRtl={isRtl}>
                        <MultiCheck
                          options={['Case', 'Stand', 'Tuner', 'Metronome', 'Cleaning Kit', 'Extra Strings/Reeds'].map((o) => ({
                            value: o,
                            label: getSHOptionLabel(o),
                          }))}
                          selected={sportsHobbyFilters.accessories_included ? sportsHobbyFilters.accessories_included.split(',') : []}
                          onToggle={(v) => {
                            const current = sportsHobbyFilters.accessories_included ? sportsHobbyFilters.accessories_included.split(',').filter(Boolean) : [];
                            const next = current.includes(v)
                              ? current.filter((item) => item !== v)
                              : [...current, v];
                            setSH({ accessories_included: next.join(',') });
                          }}
                          isRtl={isRtl}
                        />
                      </Section>
                    </>
                  )}

                  {/* Art Supplies */}
                  {sportsHobbyFilters.subcategory === 'art-supplies' && (
                    <>
                      <Section label={getSHFieldLabel('supply_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.supply_type} onChange={(v) => setSH({ supply_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Paints', 'Brushes', 'Canvas/Paper', 'Drawing Tools', 'Sculpting Materials', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('quantity')} isRtl={isRtl}>
                        <input
                          type="number"
                          value={sportsHobbyFilters.quantity || ''}
                          onChange={(e) => setSH({ quantity: e.target.value })}
                          min="1"
                          placeholder="1"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('non_toxic')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.non_toxic} onChange={(v) => setSH({ non_toxic: v as SportsHobbyFilterState['non_toxic'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Games & Puzzles */}
                  {sportsHobbyFilters.subcategory === 'games-puzzles' && (
                    <>
                      <Section label={getSHFieldLabel('game_type')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.game_type} onChange={(v) => setSH({ game_type: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['Board Games', 'Card Games', 'Puzzles', 'Video Games', 'Outdoor Games', 'Other'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('player_count')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.player_count}
                          onChange={(e) => setSH({ player_count: e.target.value })}
                          placeholder="e.g., 2-4 players"
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('complete_set')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.complete_set} onChange={(v) => setSH({ complete_set: v as SportsHobbyFilterState['complete_set'] })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          <option value="yes">{tCommon('yes')}</option>
                          <option value="no">{tCommon('no')}</option>
                        </Sel>
                      </Section>
                      <Section label={getSHFieldLabel('age_recommendation')} isRtl={isRtl}>
                        <Sel value={sportsHobbyFilters.age_recommendation} onChange={(v) => setSH({ age_recommendation: v })} isRtl={isRtl}>
                          <option value="">{tCommon('all')}</option>
                          {['3+', '6+', '12+', '18+', 'All Ages'].map((o) => (
                            <option key={o} value={o}>{getSHOptionLabel(o)}</option>
                          ))}
                        </Sel>
                      </Section>
                    </>
                  )}

                  {/* Other Sports & Hobby */}
                  {sportsHobbyFilters.subcategory === 'other-sports-hobby' && (
                    <>
                      <Section label={getSHFieldLabel('custom_type')} isRtl={isRtl}>
                        <input
                          type="text"
                          value={sportsHobbyFilters.custom_type}
                          onChange={(e) => setSH({ custom_type: e.target.value })}
                          placeholder={getSHFieldLabel('custom_type')}
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                      <Section label={getSHFieldLabel('description')} isRtl={isRtl}>
                        <textarea
                          value={sportsHobbyFilters.description}
                          onChange={(e) => setSH({ description: e.target.value })}
                          placeholder={getSHFieldLabel('description')}
                          rows={3}
                          className={`w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </Section>
                    </>
                  )}

                </div>
              )}
            </div>
          )}

          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => {
                setSH(EMPTY_SPORTS_HOBBY_FILTERS);
                onSportsHobbyClear?.();
              }}
              className="w-1/2 px-3 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t('clearFilters')}
            </button>
            <button
              type="button"
              onClick={() => onSportsHobbySearch?.()}
              className="w-1/2 px-3 py-2 rounded-md border border-primary-600 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              {t('applyFilters')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
