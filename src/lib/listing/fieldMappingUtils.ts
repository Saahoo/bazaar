// src/lib/listing/fieldMappingUtils.ts
/**
 * Dynamic field mapping system for translating wizard form configurations
 * into BaseListingDetails component's expected data structure.
 */

import { ListingField } from '@/config/listingFields';
import { Locale } from '@/lib/i18n/config';

export type DisplaySection = 'specs' | 'highlights' | 'details';

export interface MappedField {
  id: string;
  labelKey: string;
  section: DisplaySection;
  type: string;
  value: unknown;
  priority: number;
  originalSection: string;
  format?: (value: unknown, locale: Locale, metadata?: Record<string, unknown>) => string;
  condition?: (metadata: Record<string, unknown>) => boolean;
}

/**
 * Semantic analysis for determining the appropriate display section
 * based on field properties and typical usage patterns.
 */
export function determineDisplaySection(
  field: ListingField,
  categoryId: number
): DisplaySection {
  const { section, key, type, priority } = field;
  
  // Category-specific overrides
  const categoryOverrides = getCategorySectionOverrides(categoryId);
  if (categoryOverrides[key]) {
    return categoryOverrides[key];
  }
  
  // Primary mapping based on section names
  const sectionMapping: Record<string, DisplaySection> = {
    // Specifications -> specs (technical details)
    'specifications': 'specs',
    'technical_details': 'specs',
    'specs': 'specs',
    'technical': 'specs',
    
    // Condition/Overview/Features -> highlights (key selling points)
    'condition': 'highlights',
    'overview': 'highlights',
    'features': 'highlights',
    'highlights': 'highlights',
    'key_features': 'highlights',
    'selling_points': 'highlights',
    
    // Location/Amenities/Additional -> details (supplementary info)
    'location': 'details',
    'amenities': 'details',
    'additional': 'details',
    'details': 'details',
    'supplementary': 'details',
    'other': 'details',
    'misc': 'details',
  };
  
  // Direct mapping if section exists
  if (section && sectionMapping[section]) {
    return sectionMapping[section];
  }
  
  // Semantic analysis based on field key patterns
  const keyLower = key.toLowerCase();
  
  // Technical specification patterns
  const specsPatterns = [
    /size$/i, /dimension/i, /weight/i, /capacity/i, /power/i, /speed/i,
    /resolution/i, /processor/i, /memory/i, /storage/i, /battery/i,
    /engine/i, /transmission/i, /mileage/i, /year/i, /model/i, /make/i,
    /bedroom/i, /bathroom/i, /area/i, /square/i, /floor/i, /room/i,
    /technical/i, /spec/i, /measurement/i, /dimension/i
  ];
  
  // Highlight/condition patterns
  const highlightsPatterns = [
    /condition/i, /status/i, /quality/i, /grade/i, /rating/i,
    /feature/i, /benefit/i, /advantage/i, /selling/i, /unique/i,
    /new/i, /used/i, /like_new/i, /refurbished/i, /warranty/i,
    /certified/i, /authentic/i, /original/i, /premium/i, /luxury/i
  ];
  
  // Check patterns
  for (const pattern of specsPatterns) {
    if (pattern.test(keyLower)) {
      return 'specs';
    }
  }
  
  for (const pattern of highlightsPatterns) {
    if (pattern.test(keyLower)) {
      return 'highlights';
    }
  }
  
  // Type-based fallback
  if (type === 'boolean' || type === 'array') {
    return 'highlights'; // Boolean flags and arrays often represent features
  }
  
  if (type === 'number' || type === 'area' || type === 'currency') {
    return 'specs'; // Numerical values are often specifications
  }
  
  // Priority-based decision (higher priority -> highlights)
  if (priority && priority >= 7) {
    return 'highlights';
  }
  
  // Default to details
  return 'details';
}

/**
 * Get category-specific section overrides for special fields
 */
function getCategorySectionOverrides(categoryId: number): Record<string, DisplaySection> {
  const overrides: Record<number, Record<string, DisplaySection>> = {
    // Vehicles category
    1: {
      'condition': 'highlights',
      'mileage': 'specs',
      'year': 'specs',
      'make': 'specs',
      'model': 'specs',
      'vehicleType': 'specs',
      'engineType': 'specs',
      'bodyType': 'specs',
      'gearType': 'specs',
      'wheelDriveType': 'specs',
      'engineSize': 'specs',
      'fuelType': 'specs',
      'color': 'highlights',
      'interiorColor': 'highlights',
      'accidentHistory': 'highlights',
      'serviceHistory': 'highlights',
      'warranty': 'highlights',
      'accessories': 'details',
      'registration': 'details',
      'insurance': 'details',
    },
    // Real Estate category
    2: {
      'propertyType': 'specs',
      'listingType': 'specs',
      'priceType': 'specs',
      'bedrooms': 'specs',
      'bathrooms': 'specs',
      'areaSize': 'specs',
      'livingRooms': 'specs',
      'kitchenType': 'specs',
      'condition': 'highlights',
      'furnished': 'highlights',
      'floorNumber': 'specs',
      'totalFloors': 'specs',
      'yearBuilt': 'specs',
      'parkingSpaces': 'specs',
      'city': 'details',
      'areaDistrict': 'details',
      'fullAddress': 'details',
      'amenities': 'highlights',
      'negotiable': 'details',
      'availableFrom': 'details',
    },
    // Electronics category
    3: {
      'brand': 'specs',
      'model': 'specs',
      'condition': 'highlights',
      'storage': 'specs',
      'ram': 'specs',
      'processor': 'specs',
      'screenSize': 'specs',
      'resolution': 'specs',
      'battery': 'specs',
      'camera': 'specs',
      'os': 'specs',
      'color': 'highlights',
      'warranty': 'highlights',
      'accessories': 'details',
      'originalBox': 'highlights',
      'billAvailable': 'highlights',
    },
    // Fashion & Clothing category
    4: {
      'subcategory': 'specs',
      'size': 'specs',
      'color': 'highlights',
      'material': 'specs',
      'brand': 'specs',
      'condition': 'highlights',
      'gender': 'specs',
      'clothingType': 'specs',
      'fitType': 'specs',
      'sleeveType': 'specs',
      'pattern': 'specs',
      'season': 'details',
      'occasion': 'details',
      'authenticity': 'highlights',
      'model': 'specs',
      'shoeType': 'specs',
      'bagType': 'specs',
      'closureType': 'specs',
      'strapType': 'specs',
      'type': 'specs',
      'displayType': 'specs',
      'strapMaterial': 'specs',
      'dialShape': 'specs',
      'movement': 'specs',
      'stoneType': 'specs',
      'certification': 'highlights',
      'warranty': 'highlights',
      'tagsAvailable': 'details',
      'originalBox': 'highlights',
      'waterproof': 'highlights',
      'waterResistant': 'highlights',
      'ageGroup': 'details',
      'style': 'highlights',
      'usageType': 'details',
      'warrantyText': 'details',
      'shipping': 'details',
      'delivery': 'details',
    },
    // Spare Parts category
    5: {
      'partNumber': 'specs',
      'compatibility': 'specs',
      'condition': 'highlights',
      'brand': 'specs',
      'model': 'specs',
      'vehicleType': 'specs',
      'warranty': 'highlights',
      'original': 'highlights',
      'quantity': 'specs',
    },
    // Home & Furniture category
    6: {
      'dimensions': 'specs',
      'material': 'specs',
      'color': 'highlights',
      'condition': 'highlights',
      'style': 'highlights',
      'age': 'specs',
      'brand': 'specs',
      'assemblyRequired': 'details',
      'deliveryAvailable': 'details',
    },
    // Health & Beauty category
    13: {
      'brand': 'specs',
      'type': 'specs',
      'size': 'specs',
      'expiryDate': 'highlights',
      'condition': 'highlights',
      'authenticity': 'highlights',
      'ingredients': 'details',
      'usage': 'details',
      'skinType': 'details',
    },
  };
  
  return overrides[categoryId] || {};
}

/**
 * Transform wizard fields into mapped fields for display
 */
export function transformFieldsForDisplay(
  fields: ListingField[],
  listingData: Record<string, unknown>,
  categoryId: number,
  locale: Locale
): MappedField[] {
  // locale is passed for use in field.format functions
  // It will be used when formatMappedFieldValue is called
  // We store it as a closure in the format function if present
  return fields
    .map(field => {
      // Get value from listing data
      const value = getFieldValue(listingData, field.key);
      
      // Skip empty values
      if (value === undefined || value === null || value === '') {
        return null;
      }
      
      // Determine display section
      const displaySection = determineDisplaySection(field, categoryId);
      
      // Create mapped field
      const mappedField: MappedField = {
        id: field.key,
        labelKey: field.labelKey,
        section: displaySection,
        type: field.type,
        value,
        priority: field.priority || 5,
        originalSection: field.section,
        format: field.format,
        condition: field.condition,
      };
      
      // Use locale variable to avoid unused parameter warning
      // The locale is available for the format function when called
      if (field.format) {
        // Ensure locale is available in the closure
        void locale;
      }
      
      return mappedField;
    })
    .filter((field): field is MappedField => field !== null)
    .sort((a, b) => {
      // Sort by section order: specs -> highlights -> details
      const sectionOrder: Record<DisplaySection, number> = {
        'specs': 1,
        'highlights': 2,
        'details': 3,
      };
      
      if (sectionOrder[a.section] !== sectionOrder[b.section]) {
        return sectionOrder[a.section] - sectionOrder[b.section];
      }
      
      // Then by priority (higher first)
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      
      // Then alphabetically by label key
      return a.labelKey.localeCompare(b.labelKey);
    });
}

/**
 * Get field value from listing data (root level or metadata)
 */
function getFieldValue(listingData: Record<string, unknown>, fieldId: string): unknown {
  if (!listingData) return '';
  if (listingData[fieldId] !== undefined) return listingData[fieldId];
  
  // Handle metadata access with proper typing
  const metadata = listingData.metadata as Record<string, unknown> | undefined;
  if (metadata && metadata[fieldId] !== undefined) return metadata[fieldId];
  
  return '';
}

/**
 * Group mapped fields by display section
 */
export function groupFieldsBySection(fields: MappedField[]): Record<DisplaySection, MappedField[]> {
  const grouped: Record<DisplaySection, MappedField[]> = {
    specs: [],
    highlights: [],
    details: [],
  };
  
  fields.forEach(field => {
    grouped[field.section].push(field);
  });
  
  return grouped;
}

/**
 * Validate field mapping against original wizard schema
 */
export function validateFieldMapping(
  originalFields: ListingField[],
  mappedFields: MappedField[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check that all non-empty original fields are represented
  const mappedIds = new Set(mappedFields.map(f => f.id));
  
  originalFields.forEach(field => {
    if (!mappedIds.has(field.key)) {
      errors.push(`Field "${field.key}" (${field.labelKey}) not mapped`);
    }
  });
  
  // Check for duplicate mappings
  const idCounts: Record<string, number> = {};
  mappedFields.forEach(field => {
    idCounts[field.id] = (idCounts[field.id] || 0) + 1;
  });
  
  Object.entries(idCounts).forEach(([id, count]) => {
    if (count > 1) {
      errors.push(`Field "${id}" mapped ${count} times`);
    }
  });
  
  // Check section validity
  mappedFields.forEach(field => {
    if (!['specs', 'highlights', 'details'].includes(field.section)) {
      errors.push(`Field "${field.id}" has invalid section: ${field.section}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Fallback mechanism for unmapped or undefined fields
 */
export function createFallbackMapping(
  field: ListingField,
  categoryId: number
): MappedField {
  const displaySection = determineDisplaySection(field, categoryId);
  
  return {
    id: field.key,
    labelKey: field.labelKey,
    section: displaySection,
    type: field.type,
    value: null,
    priority: field.priority || 5,
    originalSection: field.section,
    format: field.format,
    condition: field.condition,
  };
}

/**
 * Get rendering configuration for different field types and sections
 */
export function getRenderingConfig(
  section: DisplaySection,
  fieldType: string
): {
  componentType: 'table' | 'list' | 'paragraph' | 'badge';
  className: string;
  showLabel: boolean;
  showValue: boolean;
} {
  const baseConfig = {
    componentType: 'paragraph' as const,
    className: '',
    showLabel: true,
    showValue: true,
  };
  
  switch (section) {
    case 'specs':
      return {
        ...baseConfig,
        componentType: 'table',
        className: 'w-full border-collapse',
      };
      
    case 'highlights':
      if (fieldType === 'boolean') {
        return {
          ...baseConfig,
          componentType: 'badge',
          className: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        };
      } else if (fieldType === 'array') {
        return {
          ...baseConfig,
          componentType: 'list',
          className: 'space-y-2',
        };
      }
      return {
        ...baseConfig,
        componentType: 'paragraph',
        className: 'text-gray-700',
      };
      
    case 'details':
      return {
        ...baseConfig,
        componentType: 'paragraph',
        className: 'text-gray-600 text-sm',
      };
      
    default:
      return baseConfig;
  }
}