// src/config/listingFields.ts
import { Locale } from '@/lib/i18n/config';
import { getFashionOptionTranslationKey } from '@/lib/constants/fashion-wizard';

export type FieldType = 'text' | 'number' | 'boolean' | 'array' | 'object' | 'currency' | 'area' | 'date';

export interface ListingField {
  key: string;
  labelKey: string;
  category: number;
  section: string;
  type: FieldType;
  format?: (value: unknown, locale: Locale, metadata?: Record<string, unknown>) => string;
  condition?: (metadata: Record<string, unknown>) => boolean;
  priority?: number;
}

// Category IDs
const VEHICLES_CATEGORY = 1;
const REAL_ESTATE_CATEGORY = 2;
const SPARE_PARTS_CATEGORY = 5;
const HOME_FURNITURE_CATEGORY = 6;
const JOBS_CATEGORY = 8;
const SERVICES_CATEGORY = 9;
const ANIMALS_CATEGORY = 10;
const FOOD_AGRICULTURE_CATEGORY = 11;
const BOOKS_EDUCATION_CATEGORY = 12;
const HEALTH_BEAUTY_CATEGORY = 13;
const SPORTS_HOBBY_CATEGORY = 14;
const BABY_KIDS_CATEGORY = 15;
const BUSINESS_INDUSTRY_CATEGORY = 16;
const SHOPPING_GROCERIES_CATEGORY = 17;
const CONSTRUCTION_MATERIALS_CATEGORY = 18;

// Fashion option normalization helper - returns full dot-path translation key
const formatFashionOption = (value: string): string => {
  return `postAd.fashion.${getFashionOptionTranslationKey(value)}`;
};

// Fashion subcategory mapping to translation keys
const FASHION_SUBCATEGORY_KEYS: Record<string, string> = {
  'men-clothing': 'common.fashion.subcategoryMenClothing',
  'women-clothing': 'common.fashion.subcategoryWomenClothing',
  'kids-clothing': 'common.fashion.subcategoryKidsClothing',
  'shoes': 'common.fashion.subcategoryShoes',
  'bags': 'common.fashion.subcategoryBags',
  'accessories': 'common.fashion.subcategoryAccessories',
  'watches': 'common.fashion.subcategoryWatches',
  'jewelry': 'common.fashion.subcategoryJewelry',
};

// All listing fields across categories
export const LISTING_FIELDS: ListingField[] = [
  // === VEHICLES ===
  {
    key: 'vehicleType',
    labelKey: 'postAd.vehicles.vehicleType',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 10,
  },
  {
    key: 'year',
    labelKey: 'postAd.vehicles.year',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'number',
    priority: 9,
  },
  {
    key: 'make',
    labelKey: 'postAd.vehicles.make',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 8,
  },
  {
    key: 'model',
    labelKey: 'postAd.vehicles.model',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 7,
  },
  {
    key: 'engineType',
    labelKey: 'postAd.vehicles.engineType',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 6,
  },
  {
    key: 'trimLevel',
    labelKey: 'postAd.vehicles.trimLevel',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 5,
  },
  {
    key: 'bodyType',
    labelKey: 'postAd.vehicles.bodyType',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'gearType',
    labelKey: 'postAd.vehicles.gearType',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'wheelDriveType',
    labelKey: 'postAd.vehicles.wheelDriveType',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    priority: 2,
  },
  {
    key: 'engineSize',
    labelKey: 'postAd.vehicles.engineSize',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
    format: (value) => `${value}L`,
    priority: 1,
  },
  {
    key: 'enginePower',
    labelKey: 'postAd.vehicles.enginePower',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
  },
  {
    key: 'mileage',
    labelKey: 'postAd.vehicles.mileage',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'number',
    format: (value, locale) => `${Number(value).toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF')} km`,
  },
  {
    key: 'color',
    labelKey: 'postAd.vehicles.color',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
  },
  {
    key: 'handDrive',
    labelKey: 'postAd.vehicles.handDrive',
    category: VEHICLES_CATEGORY,
    section: 'specifications',
    type: 'text',
  },
  {
    key: 'hasDamage',
    labelKey: 'postAd.vehicles.damage',
    category: VEHICLES_CATEGORY,
    section: 'condition',
    type: 'boolean',
  },
  {
    key: 'exchange',
    labelKey: 'postAd.vehicles.exchange',
    category: VEHICLES_CATEGORY,
    section: 'condition',
    type: 'boolean',
  },
  {
    key: 'hasNumberPlate',
    labelKey: 'postAd.vehicles.numberPlate',
    category: VEHICLES_CATEGORY,
    section: 'condition',
    type: 'boolean',
    format: (value, _locale, metadata) => {
      const city = metadata?.numberPlateCity;
      return value ? (city ? `Yes — ${city}` : 'Yes') : 'No';
    },
  },
  {
    key: 'damageDetails',
    labelKey: 'postAd.vehicles.damageDetails',
    category: VEHICLES_CATEGORY,
    section: 'condition',
    type: 'array',
  },
  {
    key: 'otherOptions',
    labelKey: 'postAd.vehicles.otherOptions',
    category: VEHICLES_CATEGORY,
    section: 'condition',
    type: 'array',
  },

  // === REAL ESTATE ===
  {
    key: 'propertyType',
    labelKey: 'listing.propertyType',
    category: REAL_ESTATE_CATEGORY,
    section: 'overview',
    type: 'text',
    format: (value) => `common.realEstate.${value}`,
  },
  {
    key: 'listingType',
    labelKey: 'listing.listingType',
    category: REAL_ESTATE_CATEGORY,
    section: 'overview',
    type: 'text',
    format: (value) => {
      if (value === 'sale') return 'common.realEstate.forSale';
      if (value === 'rent') return 'common.realEstate.forRent';
      return String(value);
    },
  },
  {
    key: 'price_type',
    labelKey: 'listing.priceType',
    category: REAL_ESTATE_CATEGORY,
    section: 'overview',
    type: 'text',
    format: (value) => {
      if (value === 'total') return 'listing.totalPrice';
      if (value === 'monthly') return 'listing.monthlyRent';
      if (value === 'yearly') return 'listing.yearlyRent';
      return String(value);
    },
  },
  {
    key: 'bedrooms',
    labelKey: 'listing.bedrooms',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.bedrooms),
  },
  {
    key: 'bathrooms',
    labelKey: 'listing.bathrooms',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.bathrooms),
  },
  {
    key: 'living_rooms',
    labelKey: 'listing.livingRooms',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.living_rooms),
  },
  {
    key: 'area_size',
    labelKey: 'listing.areaSize',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'area',
    condition: (metadata) => Boolean(metadata.area_size),
    format: (value, locale) => `${Number(value).toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF')} sqm`,
  },
  {
    key: 'kitchen_type',
    labelKey: 'listing.kitchenType',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'text',
    condition: (metadata) => Boolean(metadata.kitchen_type),
    format: (value) => {
      if (value === 'open') return 'common.realEstate.openKitchenType';
      if (value === 'closed') return 'common.realEstate.closedKitchenType';
      return String(value);
    },
  },
  {
    key: 'floor_number',
    labelKey: 'listing.floorNumber',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.floor_number),
  },
  {
    key: 'total_floors',
    labelKey: 'listing.totalFloors',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.total_floors),
  },
  {
    key: 'year_built',
    labelKey: 'listing.yearBuilt',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'number',
    condition: (metadata) => Boolean(metadata.year_built),
  },
  {
    key: 'condition',
    labelKey: 'listing.condition',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'text',
    format: (value) => {
      if (value === 'new') return 'common.realEstate.newCondition';
      if (value === 'used') return 'common.realEstate.usedCondition';
      if (value === 'renovated') return 'common.realEstate.renovatedCondition';
      return String(value);
    },
  },
  {
    key: 'furnished',
    labelKey: 'listing.furnished',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'boolean',
  },
  {
    key: 'city',
    labelKey: 'listing.city',
    category: REAL_ESTATE_CATEGORY,
    section: 'location',
    type: 'text',
  },
  {
    key: 'area_district',
    labelKey: 'listing.areaDistrict',
    category: REAL_ESTATE_CATEGORY,
    section: 'location',
    type: 'text',
  },
  {
    key: 'full_address',
    labelKey: 'listing.fullAddress',
    category: REAL_ESTATE_CATEGORY,
    section: 'location',
    type: 'text',
  },
  {
    key: 'amenities',
    labelKey: 'listing.amenities',
    category: REAL_ESTATE_CATEGORY,
    section: 'amenities',
    type: 'object',
    format: (value) => {
      if (!value || typeof value !== 'object') return '';
      const keyMap: Record<string, string> = {
        security: 'postAd.realEstate.security',
        gym: 'postAd.realEstate.gym',
        swimming_pool: 'postAd.realEstate.swimmingPool',
        garden: 'postAd.realEstate.garden',
        internet: 'postAd.realEstate.internet',
        cable_tv: 'postAd.realEstate.cableTV',
        pets_allowed: 'postAd.realEstate.petsAllowed',
        wheelchair_access: 'postAd.realEstate.wheelchairAccess',
        smart_home_features: 'postAd.realEstate.smartHomeFeatures',
      };
      const obj = value as Record<string, unknown>;
      return Object.entries(obj)
        .filter(([, v]) => v === true)
        .map(([k]) => keyMap[k] || k)
        .join('|||');
    },
  },
  {
    key: 'parking_spaces',
    labelKey: 'listing.parkingSpaces',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'number',
    condition: (metadata) => Boolean(metadata.parking_spaces),
  },
  {
    key: 'negotiable',
    labelKey: 'listing.negotiable',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'available_from',
    labelKey: 'listing.availableFrom',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'date',
    format: (value, locale) => {
      try {
        const date = new Date(String(value));
        return date.toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return String(value);
      }
    },
  },
  {
    key: 'roadAccess',
    labelKey: 'listing.roadAccess',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'landType',
    labelKey: 'listing.landType',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'text',
  },

  // === ELECTRONICS (Category ID: 3) ===
  {
    key: 'subcategory',
    labelKey: 'listing.subcategory',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 10,
  },
  {
    key: 'brand',
    labelKey: 'listing.brand',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 9,
  },
  {
    key: 'model',
    labelKey: 'listing.model',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 8,
  },
  {
    key: 'condition',
    labelKey: 'listing.condition',
    category: 3,
    section: 'condition',
    type: 'text',
    priority: 7,
    format: (value) => {
      if (value === 'new') return 'common.newCondition';
      if (value === 'like_new') return 'common.likeNew';
      if (value === 'used') return 'common.used';
      if (value === 'refurbished') return 'common.refurbished';
      return String(value);
    },
  },
  {
    key: 'warranty',
    labelKey: 'listing.warranty',
    category: 3,
    section: 'condition',
    type: 'boolean',
    priority: 6,
  },
  {
    key: 'warrantyPeriod',
    labelKey: 'listing.warrantyPeriod',
    category: 3,
    section: 'condition',
    type: 'text',
    priority: 5,
  },
  {
    key: 'ram',
    labelKey: 'listing.ram',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'storage',
    labelKey: 'listing.storage',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'screenSize',
    labelKey: 'listing.screenSize',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'processor',
    labelKey: 'listing.processor',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'batteryHealth',
    labelKey: 'listing.batteryHealth',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'color',
    labelKey: 'listing.color',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'os',
    labelKey: 'listing.os',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'resolution',
    labelKey: 'listing.resolution',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'camera',
    labelKey: 'listing.camera',
    category: 3,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'accessories',
    labelKey: 'listing.accessories',
    category: 3,
    section: 'details',
    type: 'array',
    priority: 2,
  },
  {
    key: 'originalBox',
    labelKey: 'listing.originalBox',
    category: 3,
    section: 'details',
    type: 'boolean',
    priority: 2,
  },
  {
    key: 'billAvailable',
    labelKey: 'listing.billAvailable',
    category: 3,
    section: 'details',
    type: 'boolean',
    priority: 2,
  },
  {
    key: 'shipping',
    labelKey: 'listing.shipping',
    category: 3,
    section: 'details',
    type: 'text',
    priority: 1,
  },
  {
    key: 'delivery',
    labelKey: 'listing.delivery',
    category: 3,
    section: 'details',
    type: 'text',
    priority: 1,
  },

  // === FASHION & CLOTHING (Category ID: 4) ===
  // Specifications
  {
    key: 'subcategory',
    labelKey: 'listing.subcategory',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 10,
    format: (value) => {
      const key = FASHION_SUBCATEGORY_KEYS[String(value)];
      return key || String(value);
    },
  },
  {
    key: 'brand',
    labelKey: 'listing.brand',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 9,
  },
  {
    key: 'size',
    labelKey: 'listing.size',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 8,
    format: (value) => {
      const str = String(value);
      const knownSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom', 'Small', 'Medium', 'Large'];
      if (knownSizes.includes(str)) {
        return formatFashionOption(str);
      }
      return str;
    },
  },
  {
    key: 'color',
    labelKey: 'listing.color',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 7,
    format: (value) => {
      if (Array.isArray(value)) {
        return value.map((v: unknown) => formatFashionOption(String(v))).join('|||');
      }
      const str = String(value);
      if (str.includes(',')) {
        return str.split(',').map((v) => formatFashionOption(v.trim())).join('|||');
      }
      return formatFashionOption(str);
    },
  },
  {
    key: 'material',
    labelKey: 'listing.material',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 6,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'gender',
    labelKey: 'listing.gender',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 5,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'clothingType',
    labelKey: 'postAd.fashion.fields.clothingType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'fitType',
    labelKey: 'postAd.fashion.fields.fitType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'sleeveType',
    labelKey: 'postAd.fashion.fields.sleeveType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'pattern',
    labelKey: 'postAd.fashion.fields.pattern',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'season',
    labelKey: 'postAd.fashion.fields.season',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'occasion',
    labelKey: 'postAd.fashion.fields.occasion',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'authenticity',
    labelKey: 'postAd.fashion.fields.authenticity',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'model',
    labelKey: 'listing.model',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'shoeType',
    labelKey: 'postAd.fashion.fields.shoeType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'bagType',
    labelKey: 'postAd.fashion.fields.bagType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'closureType',
    labelKey: 'postAd.fashion.fields.closureType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'strapType',
    labelKey: 'postAd.fashion.fields.strapType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'type',
    labelKey: 'postAd.fashion.fields.type',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'displayType',
    labelKey: 'postAd.fashion.fields.displayType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'strapMaterial',
    labelKey: 'postAd.fashion.fields.strapMaterial',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'dialShape',
    labelKey: 'postAd.fashion.fields.dialShape',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'movement',
    labelKey: 'postAd.fashion.fields.movement',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'stoneType',
    labelKey: 'postAd.fashion.fields.stoneType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'certification',
    labelKey: 'postAd.fashion.fields.certification',
    category: 4,
    section: 'specifications',
    type: 'boolean',
    priority: 3,
  },
  // Condition
  {
    key: 'condition',
    labelKey: 'listing.condition',
    category: 4,
    section: 'condition',
    type: 'text',
    priority: 5,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'warranty',
    labelKey: 'listing.warranty',
    category: 4,
    section: 'condition',
    type: 'boolean',
    priority: 4,
  },
  {
    key: 'tagsAvailable',
    labelKey: 'postAd.fashion.fields.tagsAvailable',
    category: 4,
    section: 'condition',
    type: 'boolean',
    priority: 3,
  },
  {
    key: 'originalBox',
    labelKey: 'listing.originalBox',
    category: 4,
    section: 'condition',
    type: 'boolean',
    priority: 3,
  },
  {
    key: 'waterproof',
    labelKey: 'postAd.fashion.fields.waterproof',
    category: 4,
    section: 'condition',
    type: 'boolean',
    priority: 3,
  },
  {
    key: 'waterResistant',
    labelKey: 'postAd.fashion.fields.waterResistant',
    category: 4,
    section: 'condition',
    type: 'boolean',
    priority: 3,
  },
  // Details
  {
    key: 'ageGroup',
    labelKey: 'listing.ageGroup',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'style',
    labelKey: 'postAd.fashion.fields.style',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'usageType',
    labelKey: 'postAd.fashion.fields.usageType',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
    format: (value) => formatFashionOption(String(value)),
  },
  {
    key: 'warrantyText',
    labelKey: 'postAd.fashion.fields.warranty',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
  },
  {
    key: 'shipping',
    labelKey: 'listing.shipping',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 1,
  },
  {
    key: 'delivery',
    labelKey: 'listing.delivery',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 1,
  },

  // ========================================
  // SPARE PARTS (Category 5)
  // ========================================
  // Helper for spare parts option normalization
  // Keys in metadata are snake_case matching the wizard field names
  { key: 'subcategory', labelKey: 'postAd.spareParts.fields.subcategory', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'text', priority: 10,
    format: (value) => {
      if (!value) return '';
      return `postAd.spareParts.subcategories.${value}`;
    },
  },
  { key: 'condition', labelKey: 'postAd.spareParts.fields.condition', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'text', priority: 9,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'seller_type', labelKey: 'postAd.spareParts.fields.seller_type', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'text', priority: 5,
    format: (value) => {
      if (!value) return '';
      if (value === 'Individual') return 'postAd.spareParts.sellerTypeIndividual';
      if (value === 'Dealer') return 'postAd.spareParts.sellerTypeDealer';
      return String(value);
    },
  },
  { key: 'brand', labelKey: 'postAd.spareParts.fields.brand', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'text', priority: 7 },
  { key: 'make', labelKey: 'postAd.spareParts.fields.make', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 8 },
  { key: 'model', labelKey: 'postAd.spareParts.fields.model', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'year_from', labelKey: 'postAd.spareParts.fields.year_from', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'number', priority: 5 },
  { key: 'year_to', labelKey: 'postAd.spareParts.fields.year_to', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'number', priority: 5 },
  { key: 'engine_type', labelKey: 'postAd.spareParts.fields.engine_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 6,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'transmission', labelKey: 'postAd.spareParts.fields.transmission', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'device_type', labelKey: 'postAd.spareParts.fields.device_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 6,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'compatible_brand', labelKey: 'postAd.spareParts.fields.compatible_brand', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'compatible_model', labelKey: 'postAd.spareParts.fields.compatible_model', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'version_series', labelKey: 'postAd.spareParts.fields.version_series', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'part_compatibility_notes', labelKey: 'postAd.spareParts.fields.part_compatibility_notes', category: SPARE_PARTS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'technical_compatibility_notes', labelKey: 'postAd.spareParts.fields.technical_compatibility_notes', category: SPARE_PARTS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'part_name', labelKey: 'postAd.spareParts.specFields.part_name', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 10 },
  { key: 'part_type', labelKey: 'postAd.spareParts.specFields.part_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 9,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'part_number', labelKey: 'postAd.spareParts.specFields.part_number', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'oem_aftermarket', labelKey: 'postAd.spareParts.specFields.oem_aftermarket', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 8,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'material', labelKey: 'postAd.spareParts.specFields.material', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'color', labelKey: 'postAd.spareParts.specFields.color', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'weight', labelKey: 'postAd.spareParts.specFields.weight', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'dimension_length', labelKey: 'postAd.spareParts.specFields.dimension_length', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'dimension_width', labelKey: 'postAd.spareParts.specFields.dimension_width', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'dimension_height', labelKey: 'postAd.spareParts.specFields.dimension_height', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'warranty', labelKey: 'postAd.spareParts.specFields.warranty', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'boolean', priority: 6 },
  { key: 'warranty_duration', labelKey: 'postAd.spareParts.specFields.warranty_duration', category: SPARE_PARTS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'availability', labelKey: 'postAd.spareParts.specFields.availability', category: SPARE_PARTS_CATEGORY, section: 'highlights', type: 'text', priority: 6,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'placement', labelKey: 'postAd.spareParts.specFields.placement', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'mileage', labelKey: 'postAd.spareParts.specFields.mileage', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'installation_type', labelKey: 'postAd.spareParts.specFields.installation_type', category: SPARE_PARTS_CATEGORY, section: 'details', type: 'text', priority: 4,
    format: (value) => {
      if (!value) return '';
      const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      return `postAd.spareParts.optionLabels.${normalized}`;
    },
  },
  { key: 'included_components', labelKey: 'postAd.spareParts.specFields.included_components', category: SPARE_PARTS_CATEGORY, section: 'details', type: 'array', priority: 4,
    format: (value) => {
      if (!value) return '';
      const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      if (Array.isArray(value)) {
        return value.map((v) => `postAd.spareParts.optionLabels.${normalize(String(v))}`).join('|||');
      }
      return `postAd.spareParts.optionLabels.${normalize(String(value))}`;
    },
  },
  { key: 'certification', labelKey: 'postAd.spareParts.specFields.certification', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'voltage', labelKey: 'postAd.spareParts.specFields.voltage', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'power_rating', labelKey: 'postAd.spareParts.specFields.power_rating', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'connector_type', labelKey: 'postAd.spareParts.specFields.connector_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'compatibility_type', labelKey: 'postAd.spareParts.specFields.compatibility_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'safety_certification', labelKey: 'postAd.spareParts.specFields.safety_certification', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'machine_type', labelKey: 'postAd.spareParts.specFields.machine_type', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'load_capacity', labelKey: 'postAd.spareParts.specFields.load_capacity', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'operating_pressure', labelKey: 'postAd.spareParts.specFields.operating_pressure', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'temperature_range', labelKey: 'postAd.spareParts.specFields.temperature_range', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'industrial_grade', labelKey: 'postAd.spareParts.specFields.industrial_grade', category: SPARE_PARTS_CATEGORY, section: 'specifications', type: 'boolean', priority: 4 },

  // ========================================
  // HOME & FURNITURE (Category 6)
  // ========================================
  { key: 'sellerType', labelKey: 'postAd.homeFurniture.fields.sellerType', category: HOME_FURNITURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'furnitureType', labelKey: 'postAd.homeFurniture.fields.furniture_type', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 8 },
  { key: 'material', labelKey: 'postAd.homeFurniture.fields.material', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'color', labelKey: 'postAd.homeFurniture.fields.color', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'length', labelKey: 'postAd.homeFurniture.fields.length', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'width', labelKey: 'postAd.homeFurniture.fields.width', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'height', labelKey: 'postAd.homeFurniture.fields.height', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'weight', labelKey: 'postAd.homeFurniture.fields.weight', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'seatingCapacity', labelKey: 'postAd.homeFurniture.fields.seating_capacity', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'style', labelKey: 'postAd.homeFurniture.fields.style', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'assemblyRequired', labelKey: 'postAd.homeFurniture.fields.assembly_required', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'conditionDetails', labelKey: 'postAd.homeFurniture.fields.condition_details', category: HOME_FURNITURE_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'usage', labelKey: 'postAd.homeFurniture.fields.usage', category: HOME_FURNITURE_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'warranty', labelKey: 'postAd.homeFurniture.fields.warranty', category: HOME_FURNITURE_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'includedItems', labelKey: 'postAd.homeFurniture.fields.included_items', category: HOME_FURNITURE_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'decorType', labelKey: 'postAd.homeFurniture.fields.decor_type', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'theme', labelKey: 'postAd.homeFurniture.fields.theme', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'handmade', labelKey: 'postAd.homeFurniture.fields.handmade', category: HOME_FURNITURE_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'setOrSingle', labelKey: 'postAd.homeFurniture.fields.set_or_single', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'productType', labelKey: 'postAd.homeFurniture.fields.product_type', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'capacity', labelKey: 'postAd.homeFurniture.fields.capacity', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'dishwasherSafe', labelKey: 'postAd.homeFurniture.fields.dishwasher_safe', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'microwaveSafe', labelKey: 'postAd.homeFurniture.fields.microwave_safe', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'setSize', labelKey: 'postAd.homeFurniture.fields.set_size', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'lightingType', labelKey: 'postAd.homeFurniture.fields.lighting_type', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'powerSource', labelKey: 'postAd.homeFurniture.fields.power_source', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'wattage', labelKey: 'postAd.homeFurniture.fields.wattage', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'lightColor', labelKey: 'postAd.homeFurniture.fields.light_color', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'smartLighting', labelKey: 'postAd.homeFurniture.fields.smart_lighting', category: HOME_FURNITURE_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'dimmable', labelKey: 'postAd.homeFurniture.fields.dimmable', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'installationType', labelKey: 'postAd.homeFurniture.fields.installation_type', category: HOME_FURNITURE_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'storageType', labelKey: 'postAd.homeFurniture.fields.storage_type', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'compartments', labelKey: 'postAd.homeFurniture.fields.compartments', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'wallMounted', labelKey: 'postAd.homeFurniture.fields.wall_mounted', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'lockable', labelKey: 'postAd.homeFurniture.fields.lockable', category: HOME_FURNITURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },

  // ========================================
  // JOBS (Category 8)
  // ========================================
  { key: 'jobTitle', labelKey: 'postAd.jobs.jobTitle', category: JOBS_CATEGORY, section: 'highlights', type: 'text', priority: 10 },
  { key: 'employmentType', labelKey: 'postAd.jobs.employmentType', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 8 },
  { key: 'isRemote', labelKey: 'postAd.jobs.remotePosition', category: JOBS_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'workCanBeDoneRemotely', labelKey: 'postAd.jobs.workCanBeDoneRemotely', category: JOBS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'country', labelKey: 'postAd.jobs.country', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'city', labelKey: 'postAd.jobs.city', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'experienceLevel', labelKey: 'postAd.jobs.experienceLevel', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'currency', labelKey: 'postAd.jobs.currency', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'minSalary', labelKey: 'postAd.jobs.minSalary', category: JOBS_CATEGORY, section: 'specifications', type: 'currency', priority: 6 },
  { key: 'maxSalary', labelKey: 'postAd.jobs.maxSalary', category: JOBS_CATEGORY, section: 'specifications', type: 'currency', priority: 6 },
  { key: 'salaryNegotiable', labelKey: 'postAd.jobs.salaryNegotiable', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'salaryNotDisclosed', labelKey: 'postAd.jobs.salaryNotDisclosed', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'applicationDeadline', labelKey: 'postAd.jobs.applicationDeadline', category: JOBS_CATEGORY, section: 'specifications', type: 'date', priority: 5 },
  { key: 'hiringManagerName', labelKey: 'postAd.jobs.hiringManagerName', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'applicationMethod', labelKey: 'postAd.jobs.applicationMethod', category: JOBS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'applicationEmail', labelKey: 'postAd.jobs.applicationEmail', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'applicationUrl', labelKey: 'postAd.jobs.applicationUrl', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'responsibilities', labelKey: 'postAd.jobs.responsibilities', category: JOBS_CATEGORY, section: 'details', type: 'array', priority: 4 },
  { key: 'requirements', labelKey: 'postAd.jobs.requirements', category: JOBS_CATEGORY, section: 'details', type: 'array', priority: 4 },
  { key: 'preferredQualifications', labelKey: 'postAd.jobs.preferredQualifications', category: JOBS_CATEGORY, section: 'details', type: 'array', priority: 3 },
  { key: 'otherBenefits', labelKey: 'postAd.jobs.otherBenefits', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'contactPhone', labelKey: 'postAd.jobs.contactPhone', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'contactEmail', labelKey: 'postAd.jobs.contactEmail', category: JOBS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  {
    key: 'benefits',
    labelKey: 'postAd.jobs.benefitsSection',
    category: JOBS_CATEGORY,
    section: 'details',
    type: 'object',
    priority: 4,
    format: (value) => {
      if (!value || typeof value !== 'object') return '';
      const keyMap: Record<string, string> = {
        healthInsurance: 'postAd.jobs.benefits.healthInsurance',
        paidTimeOff: 'postAd.jobs.benefits.paidTimeOff',
        retirementPlan: 'postAd.jobs.benefits.retirementPlan',
        flexibleSchedule: 'postAd.jobs.benefits.flexibleSchedule',
        remoteWork: 'postAd.jobs.benefits.remoteWork',
        bonuses: 'postAd.jobs.benefits.bonuses',
        trainingDevelopment: 'postAd.jobs.benefits.trainingDevelopment',
        mealAllowance: 'postAd.jobs.benefits.mealAllowance',
        transportationAllowance: 'postAd.jobs.benefits.transportationAllowance',
      };
      const obj = value as Record<string, unknown>;
      return Object.entries(obj)
        .filter(([, v]) => v === true)
        .map(([k]) => keyMap[k] || k)
        .join('|||');
    },
  },

  // ========================================
  // SERVICES (Category 9)
  // ========================================
  { key: 'subcategory', labelKey: 'postAd.services.subcategory', category: SERVICES_CATEGORY, section: 'highlights', type: 'text', priority: 9,
    format: (value) => {
      const map: Record<string, string> = {
        'home-services': 'postAd.services.subcategories.homeServices',
        'repair-maintenance': 'postAd.services.subcategories.repairMaintenance',
        'automotive-services': 'postAd.services.subcategories.automotiveServices',
        'beauty-wellness': 'postAd.services.subcategories.beautyWellness',
        'education-tutoring': 'postAd.services.subcategories.educationTutoring',
        'it-digital-services': 'postAd.services.subcategories.itDigitalServices',
        'events-entertainment': 'postAd.services.subcategories.eventsEntertainment',
        'business-services': 'postAd.services.subcategories.businessServices',
        'health-medical': 'postAd.services.subcategories.healthMedical',
        'other-services': 'postAd.services.subcategories.otherServices',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'service_type', labelKey: 'postAd.services.fields.serviceType', category: SERVICES_CATEGORY, section: 'highlights', type: 'text', priority: 8,
    format: (value) => {
      const map: Record<string, string> = {
        'on-site': 'postAd.services.serviceTypeOptions.onSite',
        'at-shop': 'postAd.services.serviceTypeOptions.atShop',
        'online-remote': 'postAd.services.serviceTypeOptions.onlineRemote',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'pricing_type', labelKey: 'postAd.services.fields.pricingType', category: SERVICES_CATEGORY, section: 'highlights', type: 'text', priority: 7,
    format: (value) => {
      const map: Record<string, string> = {
        'fixed-price': 'postAd.services.pricingTypeOptions.fixedPrice',
        'hourly-rate': 'postAd.services.pricingTypeOptions.hourlyRate',
        'daily-rate': 'postAd.services.pricingTypeOptions.dailyRate',
        'custom-quote': 'postAd.services.pricingTypeOptions.customQuote',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'negotiable', labelKey: 'postAd.services.fields.negotiable', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 6 },
  { key: 'call_out_fee', labelKey: 'postAd.services.fields.callOutFee', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 5 },
  { key: 'call_out_fee_amount', labelKey: 'postAd.services.fields.callOutFeeAmount', category: SERVICES_CATEGORY, section: 'details', type: 'number', priority: 3 },
  { key: 'service_radius_km', labelKey: 'postAd.services.fields.serviceRadiusKm', category: SERVICES_CATEGORY, section: 'specs', type: 'number', priority: 6 },
  { key: 'multiple_cities', labelKey: 'postAd.services.fields.multipleCities', category: SERVICES_CATEGORY, section: 'specs', type: 'array', priority: 5 },
  { key: 'days_available', labelKey: 'postAd.services.fields.daysAvailable', category: SERVICES_CATEGORY, section: 'specs', type: 'array', priority: 5,
    format: (value) => {
      if (!Array.isArray(value)) return String(value);
      const dayMap: Record<string, string> = {
        'monday': 'postAd.services.days.monday',
        'tuesday': 'postAd.services.days.tuesday',
        'wednesday': 'postAd.services.days.wednesday',
        'thursday': 'postAd.services.days.thursday',
        'friday': 'postAd.services.days.friday',
        'saturday': 'postAd.services.days.saturday',
        'sunday': 'postAd.services.days.sunday',
      };
      return value.map((d: string) => dayMap[d] || d).join('|||');
    },
  },
  { key: 'working_hours_from', labelKey: 'postAd.services.fields.workingHoursFrom', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4 },
  { key: 'working_hours_to', labelKey: 'postAd.services.fields.workingHoursTo', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4 },
  { key: 'emergency_service', labelKey: 'postAd.services.fields.emergencyService', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 5 },
  { key: 'advance_booking_required', labelKey: 'postAd.services.fields.advanceBookingRequired', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 3 },
  { key: 'area', labelKey: 'postAd.services.fields.area', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'experience_years', labelKey: 'postAd.services.fields.experienceYears', category: SERVICES_CATEGORY, section: 'specs', type: 'number', priority: 6 },
  { key: 'certification', labelKey: 'postAd.services.fields.certification', category: SERVICES_CATEGORY, section: 'specs', type: 'boolean', priority: 5 },
  { key: 'tools_provided', labelKey: 'postAd.services.fields.toolsProvided', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 3 },
  { key: 'spare_parts_included', labelKey: 'postAd.services.fields.sparePartsIncluded', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 3 },
  { key: 'warranty', labelKey: 'postAd.services.fields.warranty', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 4 },
  { key: 'warranty_duration', labelKey: 'postAd.services.fields.warrantyDuration', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'service_duration', labelKey: 'postAd.services.fields.serviceDuration', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 5 },
  { key: 'materials_included', labelKey: 'postAd.services.fields.materialsIncluded', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 3 },
  { key: 'specialized_in', labelKey: 'postAd.services.fields.specializedIn', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 5 },
  { key: 'gender_served', labelKey: 'postAd.services.fields.genderServed', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4,
    format: (value) => {
      const map: Record<string, string> = {
        'Male': 'postAd.services.options.male',
        'Female': 'postAd.services.options.female',
        'Both': 'postAd.services.options.both',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'certified_professional', labelKey: 'postAd.services.fields.certifiedProfessional', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 5 },
  { key: 'products_used', labelKey: 'postAd.services.fields.productsUsed', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'session_duration', labelKey: 'postAd.services.fields.sessionDuration', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4 },
  { key: 'home_service_available', labelKey: 'postAd.services.fields.homeServiceAvailable', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 5 },
  { key: 'subject_course', labelKey: 'postAd.services.fields.subjectCourse', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 6 },
  { key: 'level', labelKey: 'postAd.services.fields.level', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 5,
    format: (value) => {
      const map: Record<string, string> = {
        'Beginner': 'postAd.services.options.beginner',
        'Intermediate': 'postAd.services.options.intermediate',
        'Advanced': 'postAd.services.options.advanced',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'mode', labelKey: 'postAd.services.fields.mode', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4,
    format: (value) => {
      const map: Record<string, string> = {
        'Online': 'postAd.services.options.online',
        'In-person': 'postAd.services.options.inPerson',
        'Both': 'postAd.services.options.both',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'group_or_individual', labelKey: 'postAd.services.fields.groupOrIndividual', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4,
    format: (value) => {
      const map: Record<string, string> = {
        'Group': 'postAd.services.options.group',
        'Individual': 'postAd.services.options.individual',
        'Both': 'postAd.services.options.both',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'duration_per_session', labelKey: 'postAd.services.fields.durationPerSession', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 3 },
  { key: 'skills', labelKey: 'postAd.services.fields.skills', category: SERVICES_CATEGORY, section: 'details', type: 'array', priority: 4,
    format: (value) => {
      if (!Array.isArray(value)) return String(value);
      const skillMap: Record<string, string> = {
        'Business Strategy': 'postAd.services.options.businessStrategy',
        'Marketing': 'postAd.services.options.marketing',
        'Content Writing': 'postAd.services.options.contentWriting',
        'Graphics Design': 'postAd.services.options.graphicsDesign',
      };
      return value.map((s: string) => skillMap[s] || s).join('|||');
    },
  },
  { key: 'tools_technologies', labelKey: 'postAd.services.fields.toolsTechnologies', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'delivery_time', labelKey: 'postAd.services.fields.deliveryTime', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4 },
  { key: 'revisions_included', labelKey: 'postAd.services.fields.revisionsIncluded', category: SERVICES_CATEGORY, section: 'details', type: 'number', priority: 3 },
  { key: 'portfolio_link', labelKey: 'postAd.services.fields.portfolioLink', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'event_types', labelKey: 'postAd.services.fields.eventTypes', category: SERVICES_CATEGORY, section: 'specs', type: 'array', priority: 4,
    format: (value) => {
      if (!Array.isArray(value)) return String(value);
      const eventMap: Record<string, string> = {
        'Wedding': 'postAd.services.options.wedding',
        'Party': 'postAd.services.options.party',
        'Corporate': 'postAd.services.options.corporate',
        'Birthday': 'postAd.services.options.birthday',
      };
      return value.map((e: string) => eventMap[e] || e).join('|||');
    },
  },
  { key: 'team_size', labelKey: 'postAd.services.fields.teamSize', category: SERVICES_CATEGORY, section: 'specs', type: 'number', priority: 4 },
  { key: 'equipment_provided', labelKey: 'postAd.services.fields.equipmentProvided', category: SERVICES_CATEGORY, section: 'details', type: 'boolean', priority: 3 },
  { key: 'travel_available', labelKey: 'postAd.services.fields.travelAvailable', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 4 },
  { key: 'duration', labelKey: 'postAd.services.fields.duration', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4 },
  { key: 'industry', labelKey: 'postAd.services.fields.industry', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 5 },
  { key: 'consultation_mode', labelKey: 'postAd.services.fields.consultationMode', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4,
    format: (value) => {
      const map: Record<string, string> = {
        'Online': 'postAd.services.options.online',
        'In-person': 'postAd.services.options.inPerson',
        'Both': 'postAd.services.options.both',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'specialization', labelKey: 'postAd.services.fields.specialization', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 5 },
  { key: 'license_verified', labelKey: 'postAd.services.fields.licenseVerified', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 5 },
  { key: 'clinic_or_home', labelKey: 'postAd.services.fields.clinicOrHome', category: SERVICES_CATEGORY, section: 'specs', type: 'text', priority: 4,
    format: (value) => {
      const map: Record<string, string> = {
        'Clinic': 'postAd.services.options.clinic',
        'Home Visit': 'postAd.services.options.homeVisit',
        'Both': 'postAd.services.options.both',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'emergency_available', labelKey: 'postAd.services.fields.emergencyAvailable', category: SERVICES_CATEGORY, section: 'highlights', type: 'boolean', priority: 4 },
  { key: 'service_detail', labelKey: 'postAd.services.fields.serviceDetail', category: SERVICES_CATEGORY, section: 'highlights', type: 'text', priority: 7,
    format: (value) => {
      const map: Record<string, string> = {
        'Plumbing': 'postAd.services.options.plumbing',
        'Electrical': 'postAd.services.options.electrical',
        'Carpentry': 'postAd.services.options.carpentry',
        'General Repairs': 'postAd.services.options.generalRepairs',
        'Painting': 'postAd.services.options.painting',
        'Electronics': 'postAd.services.options.electronics',
        'Appliances': 'postAd.services.options.appliances',
        'HVAC': 'postAd.services.options.hvac',
        'General': 'postAd.services.options.general',
        'Maintenance': 'postAd.services.options.maintenance',
        'Repair': 'postAd.services.options.repair',
        'Detailing': 'postAd.services.options.detailing',
        'Inspection': 'postAd.services.options.inspection',
        'Custom Work': 'postAd.services.options.customWork',
        'Haircut': 'postAd.services.options.haircut',
        'Makeup': 'postAd.services.options.makeup',
        'Facial': 'postAd.services.options.facial',
        'Massage': 'postAd.services.options.massage',
        'Waxing': 'postAd.services.options.waxing',
        'Nail Care': 'postAd.services.options.nailCare',
        'Web Development': 'postAd.services.options.webDevelopment',
        'Mobile Development': 'postAd.services.options.mobileDevelopment',
        'SEO': 'postAd.services.options.seo',
        'Design': 'postAd.services.options.design',
        'Consulting': 'postAd.services.options.consulting',
        'DJ': 'postAd.services.options.dj',
        'Photographer': 'postAd.services.options.photographer',
        'Event Organizer': 'postAd.services.options.eventOrganizer',
        'Videographer': 'postAd.services.options.videographer',
        'Legal': 'postAd.services.options.legal',
        'Accounting': 'postAd.services.options.accounting',
        'HR Services': 'postAd.services.options.hrServices',
        'Doctor': 'postAd.services.options.doctor',
        'Nurse': 'postAd.services.options.nurse',
        'Therapist': 'postAd.services.options.therapist',
        'Dentist': 'postAd.services.options.dentist',
        'Other': 'common.other',
      };
      return map[value as string] || (value as string);
    },
  },
  { key: 'custom_service_type', labelKey: 'postAd.services.fields.customServiceType', category: SERVICES_CATEGORY, section: 'highlights', type: 'text', priority: 7 },
  { key: 'description_detail', labelKey: 'postAd.services.fields.descriptionDetail', category: SERVICES_CATEGORY, section: 'details', type: 'text', priority: 3 },

  // ========================================
  // ANIMALS (Category 10)
  // ========================================
  { key: 'breed', labelKey: 'postAd.animals.fields.breed', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 10 },
  { key: 'quantity', labelKey: 'postAd.animals.fields.quantity', category: ANIMALS_CATEGORY, section: 'specifications', type: 'number', priority: 6 },
  { key: 'age', labelKey: 'postAd.animals.fields.age', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'healthStatus', labelKey: 'postAd.animals.fields.healthStatus', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 8 },
  { key: 'priceType', labelKey: 'postAd.animals.fields.priceType', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'color', labelKey: 'postAd.animals.fields.color', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'weight', labelKey: 'postAd.animals.fields.weight', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'gender', labelKey: 'postAd.animals.fields.gender', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'milkProduction', labelKey: 'postAd.animals.fields.milkProduction', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'pregnancyStatus', labelKey: 'postAd.animals.fields.pregnancyStatus', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'hornStatus', labelKey: 'postAd.animals.fields.hornStatus', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'eggProduction', labelKey: 'postAd.animals.fields.eggProduction', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'housingType', labelKey: 'postAd.animals.fields.housingType', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'vaccinationRecord', labelKey: 'postAd.animals.fields.vaccinationRecord', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'woolType', labelKey: 'postAd.animals.fields.woolType', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'meatType', labelKey: 'postAd.animals.fields.meatType', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'height', labelKey: 'postAd.animals.fields.height', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'trainingLevel', labelKey: 'postAd.animals.fields.trainingLevel', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'discipline', labelKey: 'postAd.animals.fields.discipline', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'petType', labelKey: 'postAd.animals.fields.petType', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 8 },
  { key: 'vaccinated', labelKey: 'postAd.animals.fields.vaccinated', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'spayedNeutered', labelKey: 'postAd.animals.fields.spayedNeutered', category: ANIMALS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'microchipped', labelKey: 'postAd.animals.fields.microchipped', category: ANIMALS_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'pedigree', labelKey: 'postAd.animals.fields.pedigree', category: ANIMALS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'waterType', labelKey: 'postAd.animals.fields.waterType', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'tankSize', labelKey: 'postAd.animals.fields.tankSize', category: ANIMALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'breedingStatus', labelKey: 'postAd.animals.fields.breedingStatus', category: ANIMALS_CATEGORY, section: 'details', type: 'text', priority: 3 },

  // ========================================
  // FOOD & AGRICULTURE (Category 11)
  // ========================================
  { key: 'quantity', labelKey: 'postAd.foodAgriculture.fields.quantity', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'number', priority: 6 },
  { key: 'unit', labelKey: 'postAd.foodAgriculture.fields.unit', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'grade', labelKey: 'postAd.foodAgriculture.fields.grade', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'freshness', labelKey: 'postAd.foodAgriculture.fields.freshness', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'origin', labelKey: 'postAd.foodAgriculture.fields.origin', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'certification', labelKey: 'postAd.foodAgriculture.fields.certification', category: FOOD_AGRICULTURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'priceType', labelKey: 'postAd.foodAgriculture.fields.priceType', category: FOOD_AGRICULTURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.foodAgriculture.fields.deliveryAvailable', category: FOOD_AGRICULTURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'minOrder', labelKey: 'postAd.foodAgriculture.fields.minOrder', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'moistureContent', labelKey: 'postAd.foodAgriculture.fields.moistureContent', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'grainVariety', labelKey: 'postAd.foodAgriculture.fields.grainVariety', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'packagingType', labelKey: 'postAd.foodAgriculture.fields.packagingType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'variety', labelKey: 'postAd.foodAgriculture.fields.variety', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'ripeness', labelKey: 'postAd.foodAgriculture.fields.ripeness', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'storageType', labelKey: 'postAd.foodAgriculture.fields.storageType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'spiceType', labelKey: 'postAd.foodAgriculture.fields.spiceType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'formType', labelKey: 'postAd.foodAgriculture.fields.formType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'dairyType', labelKey: 'postAd.foodAgriculture.fields.dairyType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'fatContent', labelKey: 'postAd.foodAgriculture.fields.fatContent', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'poultryType', labelKey: 'postAd.foodAgriculture.fields.poultryType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'eggSize', labelKey: 'postAd.foodAgriculture.fields.eggSize', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'chemicalType', labelKey: 'postAd.foodAgriculture.fields.chemicalType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'npkRatio', labelKey: 'postAd.foodAgriculture.fields.npkRatio', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'applicationMethod', labelKey: 'postAd.foodAgriculture.fields.applicationMethod', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'equipmentType', labelKey: 'postAd.foodAgriculture.fields.equipmentType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'powerSource', labelKey: 'postAd.foodAgriculture.fields.powerSource', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'brand', labelKey: 'postAd.foodAgriculture.fields.brand', category: FOOD_AGRICULTURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'seedType', labelKey: 'postAd.foodAgriculture.fields.seedType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'germinationRate', labelKey: 'postAd.foodAgriculture.fields.germinationRate', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'maturityPeriod', labelKey: 'postAd.foodAgriculture.fields.maturityPeriod', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'feedType', labelKey: 'postAd.foodAgriculture.fields.feedType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'animalType', labelKey: 'postAd.foodAgriculture.fields.animalType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'weightPerBag', labelKey: 'postAd.foodAgriculture.fields.weightPerBag', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'organicCertification', labelKey: 'postAd.foodAgriculture.fields.organicCertification', category: FOOD_AGRICULTURE_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'productType', labelKey: 'postAd.foodAgriculture.fields.productType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'shelfLife', labelKey: 'postAd.foodAgriculture.fields.shelfLife', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'beverageType', labelKey: 'postAd.foodAgriculture.fields.beverageType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'roastLevel', labelKey: 'postAd.foodAgriculture.fields.roastLevel', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'oilType', labelKey: 'postAd.foodAgriculture.fields.oilType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'volume', labelKey: 'postAd.foodAgriculture.fields.volume', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'preserveType', labelKey: 'postAd.foodAgriculture.fields.preserveType', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'jarSize', labelKey: 'postAd.foodAgriculture.fields.jarSize', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'flavor', labelKey: 'postAd.foodAgriculture.fields.flavor', category: FOOD_AGRICULTURE_CATEGORY, section: 'specifications', type: 'text', priority: 3 },

  // ========================================
  // BOOKS & EDUCATION (Category 12)
  // ========================================
  { key: 'subjectMatter', labelKey: 'postAd.booksEducation.fields.subjectMatter', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 8 },
  { key: 'educationLevel', labelKey: 'postAd.booksEducation.fields.educationLevel', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'language', labelKey: 'postAd.booksEducation.fields.language', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'priceType', labelKey: 'postAd.booksEducation.fields.priceType', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.booksEducation.fields.deliveryAvailable', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'author', labelKey: 'postAd.booksEducation.fields.author', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 8 },
  { key: 'isbn', labelKey: 'postAd.booksEducation.fields.isbn', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'edition', labelKey: 'postAd.booksEducation.fields.edition', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'publicationYear', labelKey: 'postAd.booksEducation.fields.publicationYear', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'publisher', labelKey: 'postAd.booksEducation.fields.publisher', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'bookCondition', labelKey: 'postAd.booksEducation.fields.bookCondition', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'bookFormat', labelKey: 'postAd.booksEducation.fields.bookFormat', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'pages', labelKey: 'postAd.booksEducation.fields.pages', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'number', priority: 3 },
  { key: 'isTextbook', labelKey: 'postAd.booksEducation.fields.isTextbook', category: BOOKS_EDUCATION_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'ebookFormat', labelKey: 'postAd.booksEducation.fields.ebookFormat', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'fileSize', labelKey: 'postAd.booksEducation.fields.fileSize', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'drmProtected', labelKey: 'postAd.booksEducation.fields.drmProtected', category: BOOKS_EDUCATION_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'instructor', labelKey: 'postAd.booksEducation.fields.instructor', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'platform', labelKey: 'postAd.booksEducation.fields.platform', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'courseDuration', labelKey: 'postAd.booksEducation.fields.courseDuration', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'experienceLevel', labelKey: 'postAd.booksEducation.fields.experienceLevel', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'certification', labelKey: 'postAd.booksEducation.fields.certification', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'teachingMode', labelKey: 'postAd.booksEducation.fields.teachingMode', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'lessonsCount', labelKey: 'postAd.booksEducation.fields.lessonsCount', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'number', priority: 3 },
  { key: 'hasLiveSessions', labelKey: 'postAd.booksEducation.fields.hasLiveSessions', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'hasAssignments', labelKey: 'postAd.booksEducation.fields.hasAssignments', category: BOOKS_EDUCATION_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'tutorName', labelKey: 'postAd.booksEducation.fields.tutorName', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'qualification', labelKey: 'postAd.booksEducation.fields.qualification', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'experienceYears', labelKey: 'postAd.booksEducation.fields.experienceYears', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'sessionDuration', labelKey: 'postAd.booksEducation.fields.sessionDuration', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'availableDays', labelKey: 'postAd.booksEducation.fields.availableDays', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'array', priority: 3 },
  { key: 'groupTutoring', labelKey: 'postAd.booksEducation.fields.groupTutoring', category: BOOKS_EDUCATION_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'freeTrial', labelKey: 'postAd.booksEducation.fields.freeTrial', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'supplyType', labelKey: 'postAd.booksEducation.fields.supplyType', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'brand', labelKey: 'postAd.booksEducation.fields.brand', category: BOOKS_EDUCATION_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'itemCondition', labelKey: 'postAd.booksEducation.fields.itemCondition', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'ageRange', labelKey: 'postAd.booksEducation.fields.ageRange', category: BOOKS_EDUCATION_CATEGORY, section: 'specifications', type: 'text', priority: 4 },

  // ========================================
  // HEALTH & BEAUTY (Category 13)
  // ========================================
  { key: 'sellerType', labelKey: 'postAd.healthBeauty.fields.seller_type', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'productType', labelKey: 'postAd.healthBeauty.fields.product_type', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'skinType', labelKey: 'postAd.healthBeauty.fields.skin_type', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'hairType', labelKey: 'postAd.healthBeauty.fields.hair_type', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'concern', labelKey: 'postAd.healthBeauty.fields.concern', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'formulation', labelKey: 'postAd.healthBeauty.fields.formulation', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'hasSpf', labelKey: 'postAd.healthBeauty.fields.has_spf', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'spfValue', labelKey: 'postAd.healthBeauty.fields.spf_value', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'ingredients', labelKey: 'postAd.healthBeauty.fields.ingredients', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'organicNatural', labelKey: 'postAd.healthBeauty.fields.organic_natural', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'dermatologicallyTested', labelKey: 'postAd.healthBeauty.fields.dermatologically_tested', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'gender', labelKey: 'postAd.healthBeauty.fields.gender', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'size', labelKey: 'postAd.healthBeauty.fields.size', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'expiryDate', labelKey: 'postAd.healthBeauty.fields.expiry_date', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'date', priority: 4 },
  { key: 'usageFrequency', labelKey: 'postAd.healthBeauty.fields.usage_frequency', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'sulfateFree', labelKey: 'postAd.healthBeauty.fields.sulfate_free', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'shadeColor', labelKey: 'postAd.healthBeauty.fields.shade_color', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'finish', labelKey: 'postAd.healthBeauty.fields.finish', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'coverage', labelKey: 'postAd.healthBeauty.fields.coverage', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'waterproof', labelKey: 'postAd.healthBeauty.fields.waterproof', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'longLasting', labelKey: 'postAd.healthBeauty.fields.long_lasting', category: HEALTH_BEAUTY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'fragranceFamily', labelKey: 'postAd.healthBeauty.fields.fragrance_family', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'concentration', labelKey: 'postAd.healthBeauty.fields.concentration', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'longevityHours', labelKey: 'postAd.healthBeauty.fields.longevity_hours', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'originalPackaging', labelKey: 'postAd.healthBeauty.fields.original_packaging', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'prescriptionRequired', labelKey: 'postAd.healthBeauty.fields.prescription_required', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'dosageInfo', labelKey: 'postAd.healthBeauty.fields.dosage_info', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'powerSource', labelKey: 'postAd.healthBeauty.fields.power_source', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'usageArea', labelKey: 'postAd.healthBeauty.fields.usage_area', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'toolCondition', labelKey: 'postAd.healthBeauty.fields.tool_condition', category: HEALTH_BEAUTY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'customSpecifications', labelKey: 'postAd.healthBeauty.fields.custom_specifications', category: HEALTH_BEAUTY_CATEGORY, section: 'details', type: 'text', priority: 3 },

  // ========================================
  // SPORTS & HOBBY (Category 14)
  // ========================================
  { key: 'sellerType', labelKey: 'postAd.sportsHobby.fields.sellerType', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'ageGroup', labelKey: 'postAd.sportsHobby.fields.age_group', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'material', labelKey: 'postAd.sportsHobby.fields.material', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'equipmentType', labelKey: 'postAd.sportsHobby.fields.equipment_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'size', labelKey: 'postAd.sportsHobby.fields.size', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'weight', labelKey: 'postAd.sportsHobby.fields.weight', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'gearType', labelKey: 'postAd.sportsHobby.fields.gear_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'maxWeight', labelKey: 'postAd.sportsHobby.fields.max_weight', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'foldable', labelKey: 'postAd.sportsHobby.fields.foldable', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'waterproof', labelKey: 'postAd.sportsHobby.fields.waterproof', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'season', labelKey: 'postAd.sportsHobby.fields.season', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'capacity', labelKey: 'postAd.sportsHobby.fields.capacity', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'sport', labelKey: 'postAd.sportsHobby.fields.sport', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'teamSize', labelKey: 'postAd.sportsHobby.fields.team_size', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'leagueApproved', labelKey: 'postAd.sportsHobby.fields.league_approved', category: SPORTS_HOBBY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'sportType', labelKey: 'postAd.sportsHobby.fields.sport_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'floatation', labelKey: 'postAd.sportsHobby.fields.floatation', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'skillLevel', labelKey: 'postAd.sportsHobby.fields.skill_level', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'bindingsIncluded', labelKey: 'postAd.sportsHobby.fields.bindings_included', category: SPORTS_HOBBY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'collectibleType', labelKey: 'postAd.sportsHobby.fields.collectible_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'year', labelKey: 'postAd.sportsHobby.fields.year', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'authenticity', labelKey: 'postAd.sportsHobby.fields.authenticity', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'limitedEdition', labelKey: 'postAd.sportsHobby.fields.limited_edition', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'toolType', labelKey: 'postAd.sportsHobby.fields.tool_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'powerSource', labelKey: 'postAd.sportsHobby.fields.power_source', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'safetyFeatures', labelKey: 'postAd.sportsHobby.fields.safety_features', category: SPORTS_HOBBY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'instrumentType', labelKey: 'postAd.sportsHobby.fields.instrument_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'accessoriesIncluded', labelKey: 'postAd.sportsHobby.fields.accessories_included', category: SPORTS_HOBBY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'supplyType', labelKey: 'postAd.sportsHobby.fields.supply_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'quantity', labelKey: 'postAd.sportsHobby.fields.quantity', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'nonToxic', labelKey: 'postAd.sportsHobby.fields.non_toxic', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'gameType', labelKey: 'postAd.sportsHobby.fields.game_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'playerCount', labelKey: 'postAd.sportsHobby.fields.player_count', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'completeSet', labelKey: 'postAd.sportsHobby.fields.complete_set', category: SPORTS_HOBBY_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'ageRecommendation', labelKey: 'postAd.sportsHobby.fields.age_recommendation', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'customType', labelKey: 'postAd.sportsHobby.fields.custom_type', category: SPORTS_HOBBY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },

  // ========================================
  // BABY & KIDS (Category 15)
  // ========================================
  { key: 'ageRange', labelKey: 'postAd.babyKids.fields.ageRange', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 7 },
  { key: 'gender', labelKey: 'postAd.babyKids.fields.gender', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'priceType', labelKey: 'postAd.babyKids.fields.priceType', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.babyKids.fields.deliveryAvailable', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'clothingType', labelKey: 'postAd.babyKids.fields.clothingType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'size', labelKey: 'postAd.babyKids.fields.size', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'material', labelKey: 'postAd.babyKids.fields.material', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'season', labelKey: 'postAd.babyKids.fields.season', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'brand', labelKey: 'postAd.babyKids.fields.brand', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'toyType', labelKey: 'postAd.babyKids.fields.toyType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'toyMaterial', labelKey: 'postAd.babyKids.fields.toyMaterial', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'safetyCertified', labelKey: 'postAd.babyKids.fields.safetyCertified', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'gearType', labelKey: 'postAd.babyKids.fields.gearType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'features', labelKey: 'postAd.babyKids.fields.features', category: BABY_KIDS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'feedingType', labelKey: 'postAd.babyKids.fields.feedingType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'bpaFree', labelKey: 'postAd.babyKids.fields.bpaFree', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'strollerType', labelKey: 'postAd.babyKids.fields.strollerType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'foldable', labelKey: 'postAd.babyKids.fields.foldable', category: BABY_KIDS_CATEGORY, section: 'highlights', type: 'text', priority: 3 },
  { key: 'weightCapacity', labelKey: 'postAd.babyKids.fields.weightCapacity', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'furnitureType', labelKey: 'postAd.babyKids.fields.furnitureType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'furnitureMaterial', labelKey: 'postAd.babyKids.fields.furnitureMaterial', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'assemblyRequired', labelKey: 'postAd.babyKids.fields.assemblyRequired', category: BABY_KIDS_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'diaperType', labelKey: 'postAd.babyKids.fields.diaperType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'diaperSize', labelKey: 'postAd.babyKids.fields.diaperSize', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'quantity', labelKey: 'postAd.babyKids.fields.quantity', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'footwearType', labelKey: 'postAd.babyKids.fields.footwearType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'footwearSize', labelKey: 'postAd.babyKids.fields.footwearSize', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'footwearMaterial', labelKey: 'postAd.babyKids.fields.footwearMaterial', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'supplyType', labelKey: 'postAd.babyKids.fields.supplyType', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'gradeLevel', labelKey: 'postAd.babyKids.fields.gradeLevel', category: BABY_KIDS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },

  // ========================================
  // BUSINESS & INDUSTRY (Category 16)
  // ========================================
  { key: 'businessType', labelKey: 'postAd.businessIndustry.fields.businessType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 8 },
  { key: 'industrySector', labelKey: 'postAd.businessIndustry.fields.industrySector', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 7 },
  { key: 'priceType', labelKey: 'postAd.businessIndustry.fields.priceType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.businessIndustry.fields.deliveryAvailable', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'warranty', labelKey: 'postAd.businessIndustry.fields.warranty', category: BUSINESS_INDUSTRY_CATEGORY, section: 'details', type: 'text', priority: 4 },
  { key: 'machineryType', labelKey: 'postAd.businessIndustry.fields.machineryType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'brand', labelKey: 'postAd.businessIndustry.fields.brand', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'model', labelKey: 'postAd.businessIndustry.fields.model', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'powerSource', labelKey: 'postAd.businessIndustry.fields.powerSource', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'powerRating', labelKey: 'postAd.businessIndustry.fields.powerRating', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'yearOfManufacture', labelKey: 'postAd.businessIndustry.fields.yearOfManufacture', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'number', priority: 5 },
  { key: 'operatingHours', labelKey: 'postAd.businessIndustry.fields.operatingHours', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'certification', labelKey: 'postAd.businessIndustry.fields.certification', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'equipmentType', labelKey: 'postAd.businessIndustry.fields.equipmentType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'specifications', labelKey: 'postAd.businessIndustry.fields.specifications', category: BUSINESS_INDUSTRY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'quantity', labelKey: 'postAd.businessIndustry.fields.quantity', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'number', priority: 4 },
  { key: 'materialType', labelKey: 'postAd.businessIndustry.fields.materialType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'unit', labelKey: 'postAd.businessIndustry.fields.unit', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'grade', labelKey: 'postAd.businessIndustry.fields.grade', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'origin', labelKey: 'postAd.businessIndustry.fields.origin', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'minOrder', labelKey: 'postAd.businessIndustry.fields.minOrder', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'serviceType', labelKey: 'postAd.businessIndustry.fields.serviceType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'experienceYears', labelKey: 'postAd.businessIndustry.fields.experienceYears', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'number', priority: 5 },
  { key: 'teamSize', labelKey: 'postAd.businessIndustry.fields.teamSize', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'serviceArea', labelKey: 'postAd.businessIndustry.fields.serviceArea', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'availableHours', labelKey: 'postAd.businessIndustry.fields.availableHours', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'licensed', labelKey: 'postAd.businessIndustry.fields.licensed', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'freeConsultation', labelKey: 'postAd.businessIndustry.fields.freeConsultation', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'manufacturingType', labelKey: 'postAd.businessIndustry.fields.manufacturingType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'productionCapacity', labelKey: 'postAd.businessIndustry.fields.productionCapacity', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'leadTime', labelKey: 'postAd.businessIndustry.fields.leadTime', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'customOrders', labelKey: 'postAd.businessIndustry.fields.customOrders', category: BUSINESS_INDUSTRY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'wholesaleCategory', labelKey: 'postAd.businessIndustry.fields.wholesaleCategory', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'bulkDiscount', labelKey: 'postAd.businessIndustry.fields.bulkDiscount', category: BUSINESS_INDUSTRY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'safetyType', labelKey: 'postAd.businessIndustry.fields.safetyType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'standardCompliance', labelKey: 'postAd.businessIndustry.fields.standardCompliance', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'toolsType', labelKey: 'postAd.businessIndustry.fields.toolsType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'material', labelKey: 'postAd.businessIndustry.fields.material', category: BUSINESS_INDUSTRY_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'businessDetails', labelKey: 'postAd.businessIndustry.fields.businessDetails', category: BUSINESS_INDUSTRY_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'sellerType', labelKey: 'postAd.businessIndustry.fields.sellerType', category: BUSINESS_INDUSTRY_CATEGORY, section: 'highlights', type: 'text', priority: 5 },

  // ========================================
  // SHOPPING & GROCERIES (Category 17)
  // ========================================
  { key: 'quantity', labelKey: 'postAd.shoppingGroceries.fields.quantity', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'number', priority: 6 },
  { key: 'unit', labelKey: 'postAd.shoppingGroceries.fields.unit', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'brand', labelKey: 'postAd.shoppingGroceries.fields.brand', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'priceType', labelKey: 'postAd.shoppingGroceries.fields.priceType', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.shoppingGroceries.fields.deliveryAvailable', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'minOrder', labelKey: 'postAd.shoppingGroceries.fields.minOrder', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'foodType', labelKey: 'postAd.shoppingGroceries.fields.foodType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'packagingType', labelKey: 'postAd.shoppingGroceries.fields.packagingType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'shelfLife', labelKey: 'postAd.shoppingGroceries.fields.shelfLife', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'dietaryInfo', labelKey: 'postAd.shoppingGroceries.fields.dietaryInfo', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'beverageType', labelKey: 'postAd.shoppingGroceries.fields.beverageType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'volume', labelKey: 'postAd.shoppingGroceries.fields.volume', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'itemType', labelKey: 'postAd.shoppingGroceries.fields.itemType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'material', labelKey: 'postAd.shoppingGroceries.fields.material', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'dimensions', labelKey: 'postAd.shoppingGroceries.fields.dimensions', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'careType', labelKey: 'postAd.shoppingGroceries.fields.careType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'skinType', labelKey: 'postAd.shoppingGroceries.fields.skinType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'snackType', labelKey: 'postAd.shoppingGroceries.fields.snackType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'flavor', labelKey: 'postAd.shoppingGroceries.fields.flavor', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'productType', labelKey: 'postAd.shoppingGroceries.fields.productType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'ageRange', labelKey: 'postAd.shoppingGroceries.fields.ageRange', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'safetyCert', labelKey: 'postAd.shoppingGroceries.fields.safetyCert', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'cleaningType', labelKey: 'postAd.shoppingGroceries.fields.cleaningType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'surfaceType', labelKey: 'postAd.shoppingGroceries.fields.surfaceType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'bakeryType', labelKey: 'postAd.shoppingGroceries.fields.bakeryType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'freshness', labelKey: 'postAd.shoppingGroceries.fields.freshness', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'allergenInfo', labelKey: 'postAd.shoppingGroceries.fields.allergenInfo', category: SHOPPING_GROCERIES_CATEGORY, section: 'details', type: 'text', priority: 3 },
  { key: 'storageTemp', labelKey: 'postAd.shoppingGroceries.fields.storageTemp', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'dairyType', labelKey: 'postAd.shoppingGroceries.fields.dairyType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'fatContent', labelKey: 'postAd.shoppingGroceries.fields.fatContent', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'storageType', labelKey: 'postAd.shoppingGroceries.fields.storageType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'variety', labelKey: 'postAd.shoppingGroceries.fields.variety', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'ripeness', labelKey: 'postAd.shoppingGroceries.fields.ripeness', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'origin', labelKey: 'postAd.shoppingGroceries.fields.origin', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'meatType', labelKey: 'postAd.shoppingGroceries.fields.meatType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'cutType', labelKey: 'postAd.shoppingGroceries.fields.cutType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'certification', labelKey: 'postAd.shoppingGroceries.fields.certification', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'spiceType', labelKey: 'postAd.shoppingGroceries.fields.spiceType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'formType', labelKey: 'postAd.shoppingGroceries.fields.formType', category: SHOPPING_GROCERIES_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'sellerType', labelKey: 'postAd.shoppingGroceries.fields.sellerType', category: SHOPPING_GROCERIES_CATEGORY, section: 'highlights', type: 'text', priority: 5 },

  // ========================================
  // CONSTRUCTION MATERIALS (Category 18)
  // ========================================
  { key: 'quantity', labelKey: 'postAd.constructionMaterials.fields.quantity', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'number', priority: 6 },
  { key: 'unit', labelKey: 'postAd.constructionMaterials.fields.unit', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'priceType', labelKey: 'postAd.constructionMaterials.fields.priceType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'deliveryAvailable', labelKey: 'postAd.constructionMaterials.fields.deliveryAvailable', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'highlights', type: 'text', priority: 5 },
  { key: 'minOrder', labelKey: 'postAd.constructionMaterials.fields.minOrder', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'cementType', labelKey: 'postAd.constructionMaterials.fields.cementType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'cementGrade', labelKey: 'postAd.constructionMaterials.fields.cementGrade', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'packagingType', labelKey: 'postAd.constructionMaterials.fields.packagingType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'steelType', labelKey: 'postAd.constructionMaterials.fields.steelType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'diameter', labelKey: 'postAd.constructionMaterials.fields.diameter', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'length', labelKey: 'postAd.constructionMaterials.fields.length', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'steelGrade', labelKey: 'postAd.constructionMaterials.fields.steelGrade', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'brickType', labelKey: 'postAd.constructionMaterials.fields.brickType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'brickSize', labelKey: 'postAd.constructionMaterials.fields.brickSize', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'compressiveStrength', labelKey: 'postAd.constructionMaterials.fields.compressiveStrength', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'woodType', labelKey: 'postAd.constructionMaterials.fields.woodType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 7 },
  { key: 'treatment', labelKey: 'postAd.constructionMaterials.fields.treatment', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'dimensions', labelKey: 'postAd.constructionMaterials.fields.dimensions', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'aggregateType', labelKey: 'postAd.constructionMaterials.fields.aggregateType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'grainSize', labelKey: 'postAd.constructionMaterials.fields.grainSize', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'source', labelKey: 'postAd.constructionMaterials.fields.source', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'plumbingType', labelKey: 'postAd.constructionMaterials.fields.plumbingType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'plumbingMaterial', labelKey: 'postAd.constructionMaterials.fields.plumbingMaterial', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'electricalType', labelKey: 'postAd.constructionMaterials.fields.electricalType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'voltage', labelKey: 'postAd.constructionMaterials.fields.voltage', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'electricalCert', labelKey: 'postAd.constructionMaterials.fields.electricalCert', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'highlights', type: 'text', priority: 4 },
  { key: 'roofingType', labelKey: 'postAd.constructionMaterials.fields.roofingType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'roofingMaterial', labelKey: 'postAd.constructionMaterials.fields.roofingMaterial', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'thickness', labelKey: 'postAd.constructionMaterials.fields.thickness', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'paintType', labelKey: 'postAd.constructionMaterials.fields.paintType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'finishType', labelKey: 'postAd.constructionMaterials.fields.finishType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'coverage', labelKey: 'postAd.constructionMaterials.fields.coverage', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'tileType', labelKey: 'postAd.constructionMaterials.fields.tileType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'tileMaterial', labelKey: 'postAd.constructionMaterials.fields.tileMaterial', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'tileSize', labelKey: 'postAd.constructionMaterials.fields.tileSize', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'hardwareType', labelKey: 'postAd.constructionMaterials.fields.hardwareType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'hardwareMaterial', labelKey: 'postAd.constructionMaterials.fields.hardwareMaterial', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
  { key: 'brand', labelKey: 'postAd.constructionMaterials.fields.brand', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'highlights', type: 'text', priority: 6 },
  { key: 'insulationType', labelKey: 'postAd.constructionMaterials.fields.insulationType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'rValue', labelKey: 'postAd.constructionMaterials.fields.rValue', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'insulationThickness', labelKey: 'postAd.constructionMaterials.fields.insulationThickness', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 3 },
  { key: 'glassType', labelKey: 'postAd.constructionMaterials.fields.glassType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 6 },
  { key: 'glassThickness', labelKey: 'postAd.constructionMaterials.fields.glassThickness', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 4 },
  { key: 'frameType', labelKey: 'postAd.constructionMaterials.fields.frameType', category: CONSTRUCTION_MATERIALS_CATEGORY, section: 'specifications', type: 'text', priority: 5 },
];

export const getFieldsForCategory = (categoryId: number): ListingField[] => {
  return LISTING_FIELDS.filter(field => field.category === categoryId);
};

export const getSectionsForCategory = (categoryId: number): string[] => {
  const fields = getFieldsForCategory(categoryId);
  return [...new Set(fields.map(field => field.section))];
};

export const getFieldsForSection = (categoryId: number, section: string): ListingField[] => {
  return getFieldsForCategory(categoryId).filter(field => field.section === section);
};