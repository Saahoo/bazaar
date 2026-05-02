// ─── Business & Industry Wizard Constants ──────────────────────────────────────
// Subcategories: industrial-machinery, office-equipment, raw-materials, business-services,
//   manufacturing, wholesale, safety-equipment, tools-hardware

export type BusinessIndustrySubcategory =
  | 'industrial-machinery'
  | 'office-equipment'
  | 'raw-materials'
  | 'business-services'
  | 'manufacturing'
  | 'wholesale'
  | 'safety-equipment'
  | 'tools-hardware';

export interface BusinessIndustrySubcategoryOption {
  value: BusinessIndustrySubcategory;
  label: string;
}

export const BUSINESS_INDUSTRY_SUBCATEGORY_LABEL_KEYS: Record<BusinessIndustrySubcategory, string> = {
  'industrial-machinery': 'industrial-machinery',
  'office-equipment': 'office-equipment',
  'raw-materials': 'raw-materials',
  'business-services': 'business-services',
  'manufacturing': 'manufacturing',
  'wholesale': 'wholesale',
  'safety-equipment': 'safety-equipment',
  'tools-hardware': 'tools-hardware',
};

export type BusinessIndustrySpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface BusinessIndustrySpecField {
  key: string;
  label: string;
  type: BusinessIndustrySpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
  /** Only show this field for specific subcategories */
  subcategories?: BusinessIndustrySubcategory[];
}

export const BUSINESS_INDUSTRY_SUBCATEGORIES: BusinessIndustrySubcategoryOption[] = [
  { value: 'industrial-machinery', label: 'Industrial Machinery' },
  { value: 'office-equipment', label: 'Office Equipment' },
  { value: 'raw-materials', label: 'Raw Materials' },
  { value: 'business-services', label: 'Business Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'safety-equipment', label: 'Safety Equipment' },
  { value: 'tools-hardware', label: 'Tools & Hardware' },
];

// ─── Shared option lists ──────────────────────────────────────────────────────

export const CONDITION_OPTIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Refurbished',
  'Used',
  'For Parts',
];

export const BUSINESS_TYPE_OPTIONS = [
  'Manufacturer',
  'Distributor',
  'Wholesaler',
  'Retailer',
  'Service Provider',
  'Importer',
  'Exporter',
  'Individual',
];

export const INDUSTRY_SECTOR_OPTIONS = [
  'Construction',
  'Manufacturing',
  'Mining',
  'Agriculture',
  'Oil & Gas',
  'Textile',
  'Food Processing',
  'Pharmaceutical',
  'Automotive',
  'Electronics',
  'Logistics',
  'Energy',
  'Telecommunications',
  'Other',
];

export const CERTIFICATION_OPTIONS = [
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'CE Certified',
  'UL Listed',
  'GS Mark',
  'Local Standard Certified',
  'None',
];

export const PRICE_TYPE_OPTIONS = [
  'Fixed',
  'Negotiable',
  'Per Unit',
  'Per Kg',
  'Per Ton',
  'Per Day',
  'Per Month',
  'On Request',
];

export const DELIVERY_OPTIONS = [
  'Available',
  'Not Available',
  'Local Only',
  'Nationwide',
  'International',
];

export const WARRANTY_OPTIONS = [
  'No Warranty',
  '3 Months',
  '6 Months',
  '1 Year',
  '2 Years',
  '3 Years',
  '5 Years',
  'Lifetime',
];

export const POWER_SOURCE_OPTIONS = [
  'Electric',
  'Diesel',
  'Petrol',
  'Pneumatic',
  'Hydraulic',
  'Manual',
  'Solar',
  'Hybrid',
];

export const MACHINERY_TYPE_OPTIONS = [
  'CNC Machine',
  'Lathe',
  'Milling Machine',
  'Drill Press',
  'Grinding Machine',
  'Press Brake',
  'Shearing Machine',
  'Welding Machine',
  'Compressor',
  'Generator',
  'Conveyor',
  'Forklift',
  'Crane',
  'Pump',
  'Boiler',
  'Other',
];

export const OFFICE_EQUIPMENT_TYPE_OPTIONS = [
  'Printer',
  'Scanner',
  'Photocopier',
  'Projector',
  'Shredder',
  'Laminator',
  'Binding Machine',
  'Cash Register',
  'POS Terminal',
  'UPS/Inverter',
  'Whiteboard',
  'Other',
];

export const RAW_MATERIAL_TYPE_OPTIONS = [
  'Metals',
  'Plastics',
  'Chemicals',
  'Textiles',
  'Wood',
  'Glass',
  'Rubber',
  'Ceramics',
  'Stone',
  'Paper',
  'Leather',
  'Other',
];

export const SERVICE_TYPE_OPTIONS = [
  'Consulting',
  'Accounting & Audit',
  'Legal Services',
  'IT Solutions',
  'Marketing & Advertising',
  'Logistics & Shipping',
  'Maintenance & Repair',
  'Cleaning Services',
  'Security Services',
  'Printing & Packaging',
  'Import/Export Assistance',
  'Other',
];

export const MANUFACTURING_TYPE_OPTIONS = [
  'Food & Beverage',
  'Textile & Garment',
  'Pharmaceutical',
  'Chemical',
  'Metal Fabrication',
  'Woodworking',
  'Plastic Molding',
  'Paper & Packaging',
  'Construction Materials',
  'Electronics Assembly',
  'Automotive Parts',
  'Handicraft',
  'Other',
];

export const WHOLESALE_CATEGORY_OPTIONS = [
  'Electronics',
  'Clothing & Textiles',
  'Food & Beverages',
  'Construction Materials',
  'Automotive Parts',
  'Household Goods',
  'Stationery',
  'Health & Beauty',
  'Agricultural Products',
  'Industrial Supplies',
  'Other',
];

export const SAFETY_EQUIPMENT_TYPE_OPTIONS = [
  'Hard Hats',
  'Safety Goggles',
  'Gloves',
  'Safety Shoes',
  'Respirators',
  'Fire Extinguisher',
  'First Aid Kit',
  'Safety Harness',
  'Ear Protection',
  'High-Vis Vests',
  'Gas Detector',
  'Other',
];

export const TOOLS_TYPE_OPTIONS = [
  'Hand Tools',
  'Power Tools',
  'Measuring Tools',
  'Cutting Tools',
  'Fastening Tools',
  'Plumbing Tools',
  'Electrical Tools',
  'Welding Tools',
  'Painting Tools',
  'Garden Tools',
  'Automotive Tools',
  'Other',
];

export const QUANTITY_UNIT_OPTIONS = [
  'pieces',
  'kg',
  'tons',
  'liters',
  'meters',
  'square-meters',
  'cubic-meters',
  'boxes',
  'pallets',
  'sets',
  'rolls',
  'bags',
];

// ─── Common fields for ALL subcategories ───────────────────────────────────────

const BUSINESS_INDUSTRY_COMMON_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    required: true,
    options: CONDITION_OPTIONS,
  },
  {
    key: 'businessType',
    label: 'Seller Type',
    type: 'select',
    required: true,
    options: BUSINESS_TYPE_OPTIONS,
  },
  {
    key: 'industrySector',
    label: 'Industry Sector',
    type: 'select',
    required: false,
    options: INDUSTRY_SECTOR_OPTIONS,
  },
  {
    key: 'price',
    label: 'Price',
    type: 'number',
    required: true,
  },
  {
    key: 'priceType',
    label: 'Price Type',
    type: 'select',
    required: true,
    options: PRICE_TYPE_OPTIONS,
  },
  {
    key: 'deliveryAvailable',
    label: 'Delivery',
    type: 'select',
    required: false,
    options: DELIVERY_OPTIONS,
  },
  {
    key: 'warranty',
    label: 'Warranty',
    type: 'select',
    required: false,
    options: WARRANTY_OPTIONS,
  },
];

// ─── Subcategory-specific fields ──────────────────────────────────────────────

const INDUSTRIAL_MACHINERY_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'machineryType',
    label: 'Machinery Type',
    type: 'select',
    required: true,
    options: MACHINERY_TYPE_OPTIONS,
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    required: false,
    placeholder: 'e.g., Siemens, Caterpillar, Bosch',
  },
  {
    key: 'model',
    label: 'Model',
    type: 'text',
    required: false,
    placeholder: 'e.g., CNC-500X, FG-200',
  },
  {
    key: 'powerSource',
    label: 'Power Source',
    type: 'select',
    required: false,
    options: POWER_SOURCE_OPTIONS,
  },
  {
    key: 'powerRating',
    label: 'Power Rating',
    type: 'text',
    required: false,
    placeholder: 'e.g., 15 kW, 50 HP',
  },
  {
    key: 'yearOfManufacture',
    label: 'Year of Manufacture',
    type: 'number',
    required: false,
    placeholder: 'e.g., 2022',
  },
  {
    key: 'operatingHours',
    label: 'Operating Hours',
    type: 'text',
    required: false,
    placeholder: 'e.g., 5000 hrs',
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

const OFFICE_EQUIPMENT_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'equipmentType',
    label: 'Equipment Type',
    type: 'select',
    required: true,
    options: OFFICE_EQUIPMENT_TYPE_OPTIONS,
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    required: false,
    placeholder: 'e.g., HP, Canon, Epson',
  },
  {
    key: 'model',
    label: 'Model',
    type: 'text',
    required: false,
    placeholder: 'e.g., LaserJet Pro, MF445dw',
  },
  {
    key: 'specifications',
    label: 'Specifications',
    type: 'text',
    required: false,
    placeholder: 'e.g., A3, Duplex, Wi-Fi, 30ppm',
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: false,
    placeholder: 'e.g., 5',
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

const RAW_MATERIALS_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'materialType',
    label: 'Material Type',
    type: 'select',
    required: true,
    options: RAW_MATERIAL_TYPE_OPTIONS,
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: true,
  },
  {
    key: 'unit',
    label: 'Unit',
    type: 'select',
    required: true,
    options: QUANTITY_UNIT_OPTIONS,
  },
  {
    key: 'grade',
    label: 'Grade/Quality',
    type: 'text',
    required: false,
    placeholder: 'e.g., Grade A, Industrial Grade',
  },
  {
    key: 'origin',
    label: 'Origin/Source',
    type: 'text',
    required: false,
    placeholder: 'e.g., Local, Imported from China',
  },
  {
    key: 'minOrder',
    label: 'Minimum Order',
    type: 'text',
    required: false,
    placeholder: 'e.g., 100 kg',
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

const BUSINESS_SERVICES_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'serviceType',
    label: 'Service Type',
    type: 'select',
    required: true,
    options: SERVICE_TYPE_OPTIONS,
  },
  {
    key: 'experienceYears',
    label: 'Years of Experience',
    type: 'number',
    required: false,
    placeholder: 'e.g., 10',
  },
  {
    key: 'teamSize',
    label: 'Team Size',
    type: 'text',
    required: false,
    placeholder: 'e.g., 5-10 people',
  },
  {
    key: 'serviceArea',
    label: 'Service Area',
    type: 'text',
    required: false,
    placeholder: 'e.g., Kabul, Nationwide',
  },
  {
    key: 'availableHours',
    label: 'Available Hours',
    type: 'text',
    required: false,
    placeholder: 'e.g., 9 AM - 5 PM, Mon-Sat',
  },
  {
    key: 'licensed',
    label: 'Licensed Business',
    type: 'toggle',
    required: false,
  },
  {
    key: 'freeConsultation',
    label: 'Free Consultation',
    type: 'toggle',
    required: false,
  },
];

const MANUFACTURING_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'manufacturingType',
    label: 'Manufacturing Type',
    type: 'select',
    required: true,
    options: MANUFACTURING_TYPE_OPTIONS,
  },
  {
    key: 'productionCapacity',
    label: 'Production Capacity',
    type: 'text',
    required: false,
    placeholder: 'e.g., 1000 units/day',
  },
  {
    key: 'minOrder',
    label: 'Minimum Order',
    type: 'text',
    required: false,
    placeholder: 'e.g., 500 pieces',
  },
  {
    key: 'leadTime',
    label: 'Lead Time',
    type: 'text',
    required: false,
    placeholder: 'e.g., 2-3 weeks',
  },
  {
    key: 'customOrders',
    label: 'Custom Orders Accepted',
    type: 'toggle',
    required: false,
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

const WHOLESALE_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'wholesaleCategory',
    label: 'Wholesale Category',
    type: 'select',
    required: true,
    options: WHOLESALE_CATEGORY_OPTIONS,
  },
  {
    key: 'quantity',
    label: 'Quantity Available',
    type: 'number',
    required: true,
  },
  {
    key: 'unit',
    label: 'Unit',
    type: 'select',
    required: false,
    options: QUANTITY_UNIT_OPTIONS,
  },
  {
    key: 'minOrder',
    label: 'Minimum Order',
    type: 'text',
    required: false,
    placeholder: 'e.g., 50 pieces',
  },
  {
    key: 'bulkDiscount',
    label: 'Bulk Discount Available',
    type: 'toggle',
    required: false,
  },
  {
    key: 'origin',
    label: 'Origin/Source',
    type: 'text',
    required: false,
    placeholder: 'e.g., Local, Imported from UAE',
  },
];

const SAFETY_EQUIPMENT_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'safetyType',
    label: 'Safety Equipment Type',
    type: 'select',
    required: true,
    options: SAFETY_EQUIPMENT_TYPE_OPTIONS,
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    required: false,
    placeholder: 'e.g., 3M, Honeywell, Dräger',
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: false,
    placeholder: 'e.g., 50',
  },
  {
    key: 'standardCompliance',
    label: 'Standard Compliance',
    type: 'text',
    required: false,
    placeholder: 'e.g., OSHA, EN 397, ANSI Z89.1',
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

const TOOLS_HARDWARE_FIELDS: BusinessIndustrySpecField[] = [
  {
    key: 'toolsType',
    label: 'Tools Type',
    type: 'select',
    required: true,
    options: TOOLS_TYPE_OPTIONS,
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    required: false,
    placeholder: 'e.g., Stanley, DeWalt, Makita',
  },
  {
    key: 'material',
    label: 'Material',
    type: 'text',
    required: false,
    placeholder: 'e.g., Chrome Vanadium, Stainless Steel',
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    required: false,
    placeholder: 'e.g., 1 set, 10 pieces',
  },
  {
    key: 'powerSource',
    label: 'Power Source',
    type: 'select',
    required: false,
    options: POWER_SOURCE_OPTIONS,
  },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
];

// ─── Spec config: common fields + subcategory-specific fields ──────────────────

export const BUSINESS_INDUSTRY_SPEC_CONFIG: Record<BusinessIndustrySubcategory, BusinessIndustrySpecField[]> = {
  'industrial-machinery': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...INDUSTRIAL_MACHINERY_FIELDS],
  'office-equipment': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...OFFICE_EQUIPMENT_FIELDS],
  'raw-materials': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...RAW_MATERIALS_FIELDS],
  'business-services': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...BUSINESS_SERVICES_FIELDS],
  'manufacturing': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...MANUFACTURING_FIELDS],
  'wholesale': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...WHOLESALE_FIELDS],
  'safety-equipment': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...SAFETY_EQUIPMENT_FIELDS],
  'tools-hardware': [...BUSINESS_INDUSTRY_COMMON_FIELDS, ...TOOLS_HARDWARE_FIELDS],
};

// Helper function to get spec config for a subcategory
export function getBusinessIndustrySpecsConfig(subcategory: BusinessIndustrySubcategory): BusinessIndustrySpecField[] {
  return BUSINESS_INDUSTRY_SPEC_CONFIG[subcategory] || BUSINESS_INDUSTRY_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getBusinessIndustryFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getBusinessIndustryOptionTranslationKey(option: string): string {
  return `optionLabels.${option}`;
}
