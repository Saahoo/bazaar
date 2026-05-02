// src/config/listingFields.ts
import { Locale } from '@/lib/i18n/config';

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
    format: (value) => {
      const map: Record<string, string> = {
        apartment: 'apartment',
        house_villa: 'house',
        commercial: 'commercial',
        office: 'office',
        shop_retail: 'shop',
        land_plot: 'land',
        industrial: 'warehouse',
        room_shared: 'garage',
        other: 'other',
      };
      return map[String(value)] || String(value);
    },
  },
  {
    key: 'listingType',
    labelKey: 'listing.listingType',
    category: REAL_ESTATE_CATEGORY,
    section: 'overview',
    type: 'text',
    format: (value) => (value === 'sale' ? 'forSale' : value === 'rent' ? 'forRent' : String(value)),
  },
  {
    key: 'price_type',
    labelKey: 'listing.priceType',
    category: REAL_ESTATE_CATEGORY,
    section: 'overview',
    type: 'text',
    format: (value) => {
      if (value === 'total') return 'totalPrice';
      if (value === 'monthly') return 'monthlyRent';
      if (value === 'yearly') return 'yearlyRent';
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
    key: 'area_size',
    labelKey: 'listing.areaSize',
    category: REAL_ESTATE_CATEGORY,
    section: 'specifications',
    type: 'area',
    condition: (metadata) => Boolean(metadata.area_size),
    format: (value, locale) => `${Number(value).toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF')} sqm`,
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
      if (value === 'new') return 'newCondition';
      if (value === 'good') return 'good';
      if (value === 'fair') return 'fair';
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
    key: 'road_access',
    labelKey: 'listing.roadAccess',
    category: REAL_ESTATE_CATEGORY,
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'land_type',
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
      if (value === 'new') return 'newCondition';
      if (value === 'like_new') return 'likeNew';
      if (value === 'used') return 'used';
      if (value === 'refurbished') return 'refurbished';
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
  },
  {
    key: 'color',
    labelKey: 'listing.color',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 7,
  },
  {
    key: 'material',
    labelKey: 'listing.material',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 6,
  },
  {
    key: 'gender',
    labelKey: 'listing.gender',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 5,
  },
  {
    key: 'clothingType',
    labelKey: 'postAd.fashion.fields.clothingType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'fitType',
    labelKey: 'postAd.fashion.fields.fitType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'sleeveType',
    labelKey: 'postAd.fashion.fields.sleeveType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'pattern',
    labelKey: 'postAd.fashion.fields.pattern',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'season',
    labelKey: 'postAd.fashion.fields.season',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'occasion',
    labelKey: 'postAd.fashion.fields.occasion',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 4,
  },
  {
    key: 'authenticity',
    labelKey: 'postAd.fashion.fields.authenticity',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
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
  },
  {
    key: 'bagType',
    labelKey: 'postAd.fashion.fields.bagType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'closureType',
    labelKey: 'postAd.fashion.fields.closureType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'strapType',
    labelKey: 'postAd.fashion.fields.strapType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'type',
    labelKey: 'postAd.fashion.fields.type',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'displayType',
    labelKey: 'postAd.fashion.fields.displayType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'strapMaterial',
    labelKey: 'postAd.fashion.fields.strapMaterial',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'dialShape',
    labelKey: 'postAd.fashion.fields.dialShape',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'movement',
    labelKey: 'postAd.fashion.fields.movement',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
  },
  {
    key: 'stoneType',
    labelKey: 'postAd.fashion.fields.stoneType',
    category: 4,
    section: 'specifications',
    type: 'text',
    priority: 3,
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
  },
  {
    key: 'style',
    labelKey: 'postAd.fashion.fields.style',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
  },
  {
    key: 'usageType',
    labelKey: 'postAd.fashion.fields.usageType',
    category: 4,
    section: 'details',
    type: 'text',
    priority: 2,
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

  // Add fields for other categories as needed
  // FASHION, etc. can be added here
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