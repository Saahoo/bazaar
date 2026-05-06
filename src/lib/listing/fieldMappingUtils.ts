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
      'price_type': 'specs',
      'bedrooms': 'specs',
      'bathrooms': 'specs',
      'living_rooms': 'specs',
      'area_size': 'specs',
      'kitchen_type': 'specs',
      'condition': 'highlights',
      'furnished': 'highlights',
      'floor_number': 'specs',
      'total_floors': 'specs',
      'year_built': 'specs',
      'parking_spaces': 'specs',
      'city': 'details',
      'area_district': 'details',
      'full_address': 'details',
      'amenities': 'highlights',
      'negotiable': 'details',
      'available_from': 'details',
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
      'subcategory': 'highlights',
      'condition': 'highlights',
      'seller_type': 'highlights',
      'brand': 'highlights',
      'warranty': 'highlights',
      'availability': 'highlights',
      'oem_aftermarket': 'specs',
      'part_name': 'specs',
      'part_type': 'specs',
      'part_number': 'specs',
      'make': 'specs',
      'model': 'specs',
      'year_from': 'specs',
      'year_to': 'specs',
      'engine_type': 'specs',
      'transmission': 'specs',
      'device_type': 'specs',
      'compatible_brand': 'specs',
      'compatible_model': 'specs',
      'version_series': 'specs',
      'material': 'specs',
      'color': 'specs',
      'weight': 'specs',
      'dimension_length': 'specs',
      'dimension_width': 'specs',
      'dimension_height': 'specs',
      'placement': 'specs',
      'mileage': 'specs',
      'certification': 'specs',
      'voltage': 'specs',
      'power_rating': 'specs',
      'connector_type': 'specs',
      'compatibility_type': 'specs',
      'safety_certification': 'specs',
      'machine_type': 'specs',
      'load_capacity': 'specs',
      'operating_pressure': 'specs',
      'temperature_range': 'specs',
      'industrial_grade': 'details',
      'installation_type': 'details',
      'included_components': 'details',
      'warranty_duration': 'details',
      'part_compatibility_notes': 'details',
      'technical_compatibility_notes': 'details',
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
    // Jobs category
    8: {
      'jobTitle': 'highlights',
      'employmentType': 'specs',
      'isRemote': 'highlights',
      'workCanBeDoneRemotely': 'highlights',
      'country': 'specs',
      'city': 'specs',
      'experienceLevel': 'specs',
      'currency': 'specs',
      'minSalary': 'specs',
      'maxSalary': 'specs',
      'salaryNegotiable': 'details',
      'salaryNotDisclosed': 'details',
      'applicationDeadline': 'specs',
      'applicationMethod': 'specs',
      'hiringManagerName': 'details',
      'applicationEmail': 'details',
      'applicationUrl': 'details',
      'benefits': 'details',
      'otherBenefits': 'details',
      'responsibilities': 'details',
      'requirements': 'details',
      'preferredQualifications': 'details',
      'contactPhone': 'details',
      'contactEmail': 'details',
    },
    // Services category
    9: {
      'subcategory': 'highlights',
      'service_type': 'highlights',
      'pricing_type': 'highlights',
      'negotiable': 'highlights',
      'call_out_fee': 'highlights',
      'call_out_fee_amount': 'details',
      'service_radius_km': 'specs',
      'multiple_cities': 'specs',
      'days_available': 'specs',
      'working_hours_from': 'specs',
      'working_hours_to': 'specs',
      'emergency_service': 'highlights',
      'advance_booking_required': 'details',
      'area': 'details',
      'experience_years': 'specs',
      'certification': 'specs',
      'tools_provided': 'details',
      'spare_parts_included': 'details',
      'warranty': 'details',
      'warranty_duration': 'details',
      'service_duration': 'specs',
      'materials_included': 'details',
      'specialized_in': 'specs',
      'gender_served': 'specs',
      'certified_professional': 'highlights',
      'products_used': 'details',
      'session_duration': 'specs',
      'home_service_available': 'highlights',
      'subject_course': 'specs',
      'level': 'specs',
      'mode': 'specs',
      'group_or_individual': 'specs',
      'duration_per_session': 'specs',
      'skills': 'details',
      'tools_technologies': 'details',
      'delivery_time': 'specs',
      'revisions_included': 'details',
      'portfolio_link': 'details',
      'event_types': 'specs',
      'team_size': 'specs',
      'equipment_provided': 'details',
      'travel_available': 'highlights',
      'duration': 'specs',
      'industry': 'specs',
      'consultation_mode': 'specs',
      'specialization': 'specs',
      'license_verified': 'highlights',
      'clinic_or_home': 'specs',
      'emergency_available': 'highlights',
      'service_detail': 'highlights',
      'custom_service_type': 'highlights',
      'description_detail': 'details',
    },
    // Animals category
    10: {
      'breed': 'highlights',
      'petType': 'highlights',
      'age': 'specs',
      'gender': 'specs',
      'healthStatus': 'specs',
      'vaccinated': 'highlights',
      'vaccinationRecord': 'highlights',
      'pedigree': 'highlights',
      'priceType': 'highlights',
      'quantity': 'specs',
    },
    // Food & Agriculture category
    11: {
      'quantity': 'specs',
      'unit': 'specs',
      'grade': 'specs',
      'freshness': 'specs',
      'origin': 'specs',
      'certification': 'highlights',
      'organicCertification': 'highlights',
      'deliveryAvailable': 'highlights',
      'brand': 'highlights',
    },
    // Books & Education category
    12: {
      'subjectMatter': 'highlights',
      'educationLevel': 'specs',
      'author': 'specs',
      'bookCondition': 'specs',
      'bookFormat': 'specs',
      'certification': 'highlights',
      'deliveryAvailable': 'highlights',
      'brand': 'highlights',
    },
    // Sports & Hobby category
    14: {
      'brand': 'highlights',
      'condition': 'highlights',
      'sport': 'specs',
      'equipmentType': 'specs',
      'skillLevel': 'specs',
      'ageGroup': 'specs',
      'material': 'specs',
      'size': 'specs',
      'authenticity': 'highlights',
      'limitedEdition': 'highlights',
      'waterproof': 'highlights',
      'foldable': 'highlights',
    },
    // Baby & Kids category
    15: {
      'condition': 'highlights',
      'ageRange': 'highlights',
      'gender': 'specs',
      'brand': 'highlights',
      'safetyCertified': 'highlights',
      'clothingType': 'specs',
      'toyType': 'specs',
      'gearType': 'specs',
      'size': 'specs',
      'material': 'specs',
      'deliveryAvailable': 'highlights',
    },
    // Business & Industry category
    16: {
      'businessType': 'highlights',
      'industrySector': 'highlights',
      'condition': 'highlights',
      'brand': 'highlights',
      'certification': 'highlights',
      'licensed': 'highlights',
      'machineryType': 'specs',
      'equipmentType': 'specs',
      'serviceType': 'specs',
      'manufacturingType': 'specs',
      'deliveryAvailable': 'highlights',
      'warranty': 'details',
    },
    // Shopping & Groceries category
    17: {
      'brand': 'highlights',
      'condition': 'highlights',
      'quantity': 'specs',
      'unit': 'specs',
      'foodType': 'specs',
      'productType': 'specs',
      'certification': 'highlights',
      'dietaryInfo': 'highlights',
      'safetyCert': 'highlights',
      'deliveryAvailable': 'highlights',
      'freshness': 'specs',
    },
    // Construction Materials category
    18: {
      'condition': 'highlights',
      'brand': 'highlights',
      'quantity': 'specs',
      'unit': 'specs',
      'cementType': 'specs',
      'steelType': 'specs',
      'brickType': 'specs',
      'woodType': 'specs',
      'tileType': 'specs',
      'electricalType': 'specs',
      'plumbingType': 'specs',
      'roofingType': 'specs',
      'paintType': 'specs',
      'insulationType': 'specs',
      'glassType': 'specs',
      'hardwareType': 'specs',
      'electricalCert': 'highlights',
      'deliveryAvailable': 'highlights',
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
 * Handles nested metadata objects like location.city, contact.phone, etc.
 */
function getFieldValue(listingData: Record<string, unknown>, fieldId: string): unknown {
  if (!listingData) return '';
  if (listingData[fieldId] !== undefined) return listingData[fieldId];
  
  // Handle metadata access with proper typing
  const metadata = listingData.metadata as Record<string, unknown> | undefined;
  if (metadata && metadata[fieldId] !== undefined) return metadata[fieldId];
  
  // Fallback: check wizardForms (used by Jobs/Animals categories that store data
  // only in metadata.wizardForms via the else block in handleSubmit)
  if (metadata) {
    const wizardForms = metadata.wizardForms as Record<string, unknown> | undefined;
    if (wizardForms && wizardForms[fieldId] !== undefined) return wizardForms[fieldId];
    
    // Fallback: check inside nested objects in metadata (e.g., location.city, contact.phone)
    // This handles Animals & Livestock and Food & Agriculture which store location/contact as nested objects
    for (const [_key, value] of Object.entries(metadata)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nested = value as Record<string, unknown>;
        if (nested[fieldId] !== undefined) return nested[fieldId];
      }
    }
  }
  
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
  _originalFields: ListingField[],
  mappedFields: MappedField[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Note: We intentionally do NOT check that all original fields are mapped,
  // because transformFieldsForDisplay filters out fields with empty values.
  // It is expected that many fields will be unmapped for any given listing.
  
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