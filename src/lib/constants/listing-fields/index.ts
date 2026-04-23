// src/lib/constants/listing-fields/index.ts
import { Locale } from '@/lib/i18n/config';

// Category IDs
export const VEHICLES_CATEGORY = 1;
export const REAL_ESTATE_CATEGORY = 2;
export const ELECTRONICS_CATEGORY = 3;
export const FASHION_CATEGORY = 4;
export const SPARE_PARTS_CATEGORY = 5;
export const HEALTH_BEAUTY_CATEGORY = 13;

// Field types
export type FieldType = 'text' | 'number' | 'boolean' | 'array' | 'object' | 'currency' | 'area' | 'date';

// Field definition interface
export interface FieldDefinition {
  key: string;
  labelKey: string; // Translation key for the label
  type: FieldType;
  category: number;
  displayInSpecs?: boolean; // Show in specs table
  displayInDetails?: boolean; // Show in all details
  displayInHighlights?: boolean; // Show in key highlights
  format?: (value: unknown, locale: Locale, metadata?: Record<string, unknown>) => string | React.ReactNode;
  condition?: (metadata: Record<string, unknown>) => boolean; // When to show this field
  priority?: number; // Display priority (higher = more important)
}

// Centralized field definitions for all categories
export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // === VEHICLES ===
  {
    key: 'vehicleType',
    labelKey: 'postAd.vehicles.vehicleType',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 10,
  },
  {
    key: 'year',
    labelKey: 'postAd.vehicles.year',
    type: 'number',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 9,
  },
  {
    key: 'make',
    labelKey: 'postAd.vehicles.make',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 8,
  },
  {
    key: 'model',
    labelKey: 'postAd.vehicles.model',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 7,
  },
  {
    key: 'engineType',
    labelKey: 'postAd.vehicles.engineType',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 6,
  },
  {
    key: 'trimLevel',
    labelKey: 'postAd.vehicles.trimLevel',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 5,
  },
  {
    key: 'bodyType',
    labelKey: 'postAd.vehicles.bodyType',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 4,
  },
  {
    key: 'gearType',
    labelKey: 'postAd.vehicles.gearType',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 3,
  },
  {
    key: 'wheelDriveType',
    labelKey: 'postAd.vehicles.wheelDriveType',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    priority: 2,
  },
  {
    key: 'engineSize',
    labelKey: 'postAd.vehicles.engineSize',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, _metadata) => `${value}L`,
    priority: 1,
  },
  {
    key: 'enginePower',
    labelKey: 'postAd.vehicles.enginePower',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'mileage',
    labelKey: 'postAd.vehicles.mileage',
    type: 'number',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    format: (value, locale, _metadata) => `${Number(value).toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF')} km`,
  },
  {
    key: 'color',
    labelKey: 'postAd.vehicles.color',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'handDrive',
    labelKey: 'postAd.vehicles.handDrive',
    type: 'text',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'hasDamage',
    labelKey: 'postAd.vehicles.damage',
    type: 'boolean',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'exchange',
    labelKey: 'postAd.vehicles.exchange',
    type: 'boolean',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'hasNumberPlate',
    labelKey: 'postAd.vehicles.numberPlate',
    type: 'boolean',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, metadata) => {
      const city = metadata?.numberPlateCity;
      return value ? (city ? `Yes — ${city}` : 'Yes') : 'No';
    },
  },
  {
    key: 'damageDetails',
    labelKey: 'postAd.vehicles.damageDetails',
    type: 'array',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'otherOptions',
    labelKey: 'postAd.vehicles.otherOptions',
    type: 'array',
    category: VEHICLES_CATEGORY,
    displayInSpecs: true,
  },

  // === REAL ESTATE ===
  {
    key: 'propertyType',
    labelKey: 'postAd.realEstate.propertyType',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
    priority: 10,
    format: (value, _locale, _metadata) => {
      const translationMap: Record<string, string> = {
        'apartment': 'apartment',
        'house_villa': 'house',
        'house': 'house',
        'commercial': 'commercial',
        'office': 'office',
        'shop_retail': 'shop',
        'shop': 'shop',
        'land_plot': 'land',
        'land': 'land',
        'industrial': 'water hole',
        'room_shared': 'other',
        'other': 'other',
      };
      return translationMap[value as string] || String(value);
    },
  },
  {
    key: 'listingType',
    labelKey: 'postAd.realEstate.listingType',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    priority: 9,
    format: (value, _locale, _metadata) => {
      if (value === 'sale') return 'For Sale';
      if (value === 'rent') return 'For Rent';
      return String(value);
    },
  },
  {
    key: 'bedrooms',
    labelKey: 'postAd.realEstate.bedrooms',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
    priority: 8,
    condition: (metadata) => (metadata.bedrooms as number) > 0,
  },
  {
    key: 'bathrooms',
    labelKey: 'postAd.realEstate.bathrooms',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
    priority: 7,
    condition: (metadata) => (metadata.bathrooms as number) > 0,
  },
  {
    key: 'area_size',
    labelKey: 'postAd.realEstate.areaSize',
    type: 'area',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
    priority: 6,
    condition: (metadata) => (metadata.area_size as number) > 0,
    format: (value, _locale, _metadata) => `${value} sqm`,
  },
  {
    key: 'living_rooms',
    labelKey: 'postAd.realEstate.livingRooms',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    priority: 5,
    condition: (metadata) => (metadata.living_rooms as number) > 0,
  },
  {
    key: 'kitchen_type',
    labelKey: 'postAd.realEstate.kitchenType',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, _metadata) => {
      if (value === 'open') return 'postAd.realEstate.openKitchenType';
      if (value === 'closed') return 'postAd.realEstate.closedKitchenType';
      return String(value);
    },
  },
  {
    key: 'floor_number',
    labelKey: 'common.floorNumberLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    priority: 4,
    condition: (metadata) => (metadata.floor_number as number) > 0,
  },
  {
    key: 'total_floors',
    labelKey: 'common.totalFloorsLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    priority: 3,
    condition: (metadata) => (metadata.total_floors as number) > 0,
  },
  {
    key: 'year_built',
    labelKey: 'common.yearBuiltLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    priority: 2,
    condition: (metadata) => (metadata.year_built as number) > 0,
  },
  {
    key: 'parking_spaces',
    labelKey: 'postAd.realEstate.parkingSpacesLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
    priority: 1,
    condition: (metadata) => (metadata.parking_spaces as number) > 0,
  },
  {
    key: 'balcony',
    labelKey: 'postAd.realEstate.balconyLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'elevator',
    labelKey: 'postAd.realEstate.elevatorLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'heating_type',
    labelKey: 'common.heatingTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'cooling',
    labelKey: 'common.coolingLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'condition',
    labelKey: 'postAd.realEstate.condition',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, _metadata) => {
      if (value === 'new') return 'common.newCondition';
      if (value === 'good') return 'common.good';
      if (value === 'fair') return 'common.fair';
      return String(value);
    },
  },
  {
    key: 'furnished',
    labelKey: 'common.furnishedLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    displayInHighlights: true,
  },
  {
    key: 'city',
    labelKey: 'postAd.realEstate.city',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'area_district',
    labelKey: 'postAd.realEstate.areaDistrict',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'full_address',
    labelKey: 'postAd.realEstate.fullAddress',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'price_type',
    labelKey: 'postAd.realEstate.priceType',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, _metadata) => {
      if (value === 'total') return 'postAd.realEstate.totalPrice';
      if (value === 'monthly') return 'postAd.realEstate.monthlyRent';
      if (value === 'yearly') return 'postAd.realEstate.yearlyRent';
      return String(value);
    },
  },
  {
    key: 'available_from',
    labelKey: 'postAd.realEstate.availableFrom',
    type: 'date',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'furnishing',
    labelKey: 'postAd.realEstate.furnishing',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
    format: (value, _locale, _metadata) => {
      if (value === 'furnished') return 'postAd.realEstate.furnished';
      if (value === 'semiFurnished') return 'postAd.realEstate.semiFurnished';
      if (value === 'unfurnished') return 'postAd.realEstate.unfurnished';
      return String(value);
    },
  },
  {
    key: 'negotiable',
    labelKey: 'postAd.realEstate.negotiable',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'road_access',
    labelKey: 'common.roadAccessLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'land_type',
    labelKey: 'common.landTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'corner_plot',
    labelKey: 'common.cornerPlotLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'meeting_rooms',
    labelKey: 'common.meetingRoomsLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'reception_area',
    labelKey: 'common.receptionAreaLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'office_space_included',
    labelKey: 'common.officeSpaceIncludedLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'number_of_occupants',
    labelKey: 'common.occupantsLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'bathroom_type',
    labelKey: 'common.bathroomTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'bills_included',
    labelKey: 'common.billsIncludedLabel',
    type: 'boolean',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'gender_preference',
    labelKey: 'common.genderPreferenceLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'custom_property_type',
    labelKey: 'common.customPropertyTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'custom_specifications',
    labelKey: 'common.customSpecificationsLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'ceiling_height',
    labelKey: 'common.ceilingHeightLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'loading_docks',
    labelKey: 'common.loadingDocksLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'power_supply',
    labelKey: 'common.powerSupplyLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'security_features',
    labelKey: 'common.securityFeaturesLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'room_type',
    labelKey: 'common.roomTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'commercial_type',
    labelKey: 'postAd.realEstate.commercialType',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'washrooms',
    labelKey: 'common.washroomsLabel',
    type: 'number',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'suitable_for',
    labelKey: 'common.suitableForLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'plot_dimensions',
    labelKey: 'common.plotDimensionsLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'zoning_type',
    labelKey: 'common.zoningTypeLabel',
    type: 'text',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'utilities_available',
    labelKey: 'common.utilitiesAvailableLabel',
    type: 'array',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
  {
    key: 'amenities',
    labelKey: 'postAd.realEstate.stepAmenities',
    type: 'object',
    category: REAL_ESTATE_CATEGORY,
    displayInSpecs: true,
  },
];

// Helper functions
export const getFieldsForCategory = (categoryId: number): FieldDefinition[] => {
  return FIELD_DEFINITIONS.filter(field => field.category === categoryId);
};

export const getFieldDefinition = (categoryId: number, key: string): FieldDefinition | undefined => {
  return FIELD_DEFINITIONS.find(field => field.category === categoryId && field.key === key);
};

export const getSpecsFields = (categoryId: number): FieldDefinition[] => {
  return getFieldsForCategory(categoryId).filter(field => field.displayInSpecs);
};

export const getHighlightsFields = (categoryId: number): FieldDefinition[] => {
  return getFieldsForCategory(categoryId).filter(field => field.displayInHighlights);
};

export const getDetailsFields = (categoryId: number): FieldDefinition[] => {
  return getFieldsForCategory(categoryId).filter(field => field.displayInDetails);
};