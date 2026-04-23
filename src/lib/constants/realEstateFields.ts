// src/lib/constants/realEstateFields.ts
import { Locale } from '@/lib/i18n/config';

export type RealEstateSection = 'overview' | 'specifications' | 'location' | 'amenities' | 'additional';

export type FieldType = 'text' | 'number' | 'boolean' | 'array' | 'object' | 'currency' | 'area' | 'date';

export interface RealEstateField {
  key: string;
  labelKey: string;
  section: RealEstateSection;
  type: FieldType;
  format?: (value: unknown, locale: Locale) => string;
  condition?: (metadata: Record<string, unknown>) => boolean;
}

export const REAL_ESTATE_FIELDS: RealEstateField[] = [
  // Property Overview
  {
    key: 'propertyType',
    labelKey: 'postAd.realEstate.propertyType',
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
      return map[value as string] || String(value);
    },
  },
  {
    key: 'listingType',
    labelKey: 'postAd.realEstate.listingType',
    section: 'overview',
    type: 'text',
    format: (value) => (value === 'sale' ? 'forSale' : value === 'rent' ? 'forRent' : String(value)),
  },
  {
    key: 'price_type',
    labelKey: 'postAd.realEstate.priceType',
    section: 'overview',
    type: 'text',
    format: (value) => {
      if (value === 'total') return 'totalPrice';
      if (value === 'monthly') return 'monthlyRent';
      if (value === 'yearly') return 'yearlyRent';
      return String(value);
    },
  },

  // Property Specifications
  {
    key: 'bedrooms',
    labelKey: 'postAd.realEstate.bedrooms',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.bedrooms as number) > 0,
  },
  {
    key: 'bathrooms',
    labelKey: 'postAd.realEstate.bathrooms',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.bathrooms as number) > 0,
  },
  {
    key: 'area_size',
    labelKey: 'postAd.realEstate.areaSize',
    section: 'specifications',
    type: 'area',
    condition: (metadata) => (metadata.area_size as number) > 0,
    format: (value, locale) => `${(value as number).toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF')} sqm`,
  },
  {
    key: 'living_rooms',
    labelKey: 'postAd.realEstate.livingRooms',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.living_rooms as number) > 0,
  },
  {
    key: 'kitchen_type',
    labelKey: 'postAd.realEstate.kitchenType',
    section: 'specifications',
    type: 'text',
    format: (value) => (value === 'open' ? 'openKitchenType' : value === 'closed' ? 'closedKitchenType' : String(value)),
  },
  {
    key: 'condition',
    labelKey: 'postAd.realEstate.condition',
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
    labelKey: 'postAd.realEstate.furnished',
    section: 'specifications',
    type: 'boolean',
  },
  {
    key: 'floor_number',
    labelKey: 'common.floorNumberLabel',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.floor_number as number) > 0,
  },
  {
    key: 'total_floors',
    labelKey: 'common.totalFloorsLabel',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.total_floors as number) > 0,
  },
  {
    key: 'year_built',
    labelKey: 'common.yearBuiltLabel',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.year_built as number) > 0,
  },
  {
    key: 'parking_spaces',
    labelKey: 'postAd.realEstate.parkingSpacesLabel',
    section: 'specifications',
    type: 'number',
    condition: (metadata) => (metadata.parking_spaces as number) > 0,
  },

  // Location
  {
    key: 'city',
    labelKey: 'postAd.realEstate.city',
    section: 'location',
    type: 'text',
  },
  {
    key: 'area_district',
    labelKey: 'postAd.realEstate.areaDistrict',
    section: 'location',
    type: 'text',
  },
  {
    key: 'full_address',
    labelKey: 'postAd.realEstate.fullAddress',
    section: 'location',
    type: 'text',
  },

  // Amenities
  {
    key: 'amenities',
    labelKey: 'postAd.realEstate.amenities',
    section: 'amenities',
    type: 'object',
  },

  // Additional Information
  {
    key: 'negotiable',
    labelKey: 'postAd.realEstate.negotiable',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'available_from',
    labelKey: 'postAd.realEstate.availableFrom',
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
    labelKey: 'common.roadAccessLabel',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'land_type',
    labelKey: 'common.landTypeLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'corner_plot',
    labelKey: 'common.cornerPlotLabel',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'meeting_rooms',
    labelKey: 'common.meetingRoomsLabel',
    section: 'additional',
    type: 'number',
  },
  {
    key: 'reception_area',
    labelKey: 'common.receptionAreaLabel',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'office_space_included',
    labelKey: 'common.officeSpaceIncludedLabel',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'bills_included',
    labelKey: 'common.billsIncludedLabel',
    section: 'additional',
    type: 'boolean',
  },
  {
    key: 'number_of_occupants',
    labelKey: 'common.occupantsLabel',
    section: 'additional',
    type: 'number',
  },
  {
    key: 'bathroom_type',
    labelKey: 'common.bathroomTypeLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'gender_preference',
    labelKey: 'common.genderPreferenceLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'custom_property_type',
    labelKey: 'common.customPropertyTypeLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'custom_specifications',
    labelKey: 'common.customSpecificationsLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'ceiling_height',
    labelKey: 'common.ceilingHeightLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'loading_docks',
    labelKey: 'common.loadingDocksLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'power_supply',
    labelKey: 'common.powerSupplyLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'security_features',
    labelKey: 'common.securityFeaturesLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'room_type',
    labelKey: 'common.roomTypeLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'commercial_type',
    labelKey: 'postAd.realEstate.commercialType',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'washrooms',
    labelKey: 'common.washroomsLabel',
    section: 'additional',
    type: 'number',
  },
  {
    key: 'suitable_for',
    labelKey: 'common.suitableForLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'plot_dimensions',
    labelKey: 'common.plotDimensionsLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'zoning_type',
    labelKey: 'common.zoningTypeLabel',
    section: 'additional',
    type: 'text',
  },
  {
    key: 'utilities_available',
    labelKey: 'common.utilitiesAvailableLabel',
    section: 'additional',
    type: 'array',
  },
];

export const getFieldsBySection = (section: RealEstateSection): RealEstateField[] => {
  return REAL_ESTATE_FIELDS.filter(field => field.section === section);
};

export const getFieldByKey = (key: string): RealEstateField | undefined => {
  return REAL_ESTATE_FIELDS.find(field => field.key === key);
};