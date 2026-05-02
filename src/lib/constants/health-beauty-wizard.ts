export type HealthBeautySubcategory =
  | 'skincare'
  | 'haircare'
  | 'makeup'
  | 'fragrances'
  | 'personal-care'
  | 'health-care-products'
  | 'beauty-tools-devices'
  | 'other';

export interface HealthBeautySubcategoryOption {
  value: HealthBeautySubcategory;
  label: string;
}

export type HealthBeautySpecFieldType = 'text' | 'number' | 'select' | 'multiselect' | 'toggle' | 'date';

export interface HealthBeautySpecField {
  key: string;
  label: string;
  type: HealthBeautySpecFieldType;
  required?: boolean;
  options?: string[];
}

export const HEALTH_BEAUTY_SUBCATEGORIES: HealthBeautySubcategoryOption[] = [
  { value: 'skincare', label: 'Skincare' },
  { value: 'haircare', label: 'Haircare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'fragrances', label: 'Fragrances' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'health-care-products', label: 'Health Care Products' },
  { value: 'beauty-tools-devices', label: 'Beauty Tools & Devices' },
  { value: 'other', label: 'Other' },
];

export const HEALTH_BEAUTY_SUBCATEGORY_LABEL_KEYS: Record<HealthBeautySubcategory, string> = {
  'skincare': 'subcategorySkincare',
  'haircare': 'subcategoryHaircare',
  'makeup': 'subcategoryMakeup',
  'fragrances': 'subcategoryFragrances',
  'personal-care': 'subcategoryPersonalCare',
  'health-care-products': 'subcategoryHealthCareProducts',
  'beauty-tools-devices': 'subcategoryBeautyToolsDevices',
  'other': 'subcategoryOther',
};

const SKINCARE_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Face Mask', 'Exfoliator', 'Other'] },
  { key: 'skin_type', label: 'Skin Type', type: 'select', required: true, options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'All'] },
  { key: 'concern', label: 'Concern', type: 'multiselect', options: ['Acne', 'Anti-aging', 'Hydration', 'Brightening', 'Pigmentation', 'Pores', 'Redness'] },
  { key: 'formulation', label: 'Formulation', type: 'select', options: ['Gel', 'Cream', 'Liquid', 'Foam', 'Lotion', 'Balm'] },
  { key: 'has_spf', label: 'SPF', type: 'toggle' },
  { key: 'spf_value', label: 'SPF Value', type: 'number' },
  { key: 'ingredients', label: 'Ingredients', type: 'text' },
  { key: 'organic_natural', label: 'Organic / Natural', type: 'toggle' },
  { key: 'dermatologically_tested', label: 'Dermatologically Tested', type: 'toggle' },
  { key: 'gender', label: 'Gender', type: 'select', options: ['Unisex', 'Male', 'Female'] },
  { key: 'size', label: 'Size', type: 'text' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'usage_frequency', label: 'Usage Frequency', type: 'select', options: ['Daily', 'Weekly', 'Twice Daily', 'As Needed'] },
];

const HAIRCARE_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Shampoo', 'Conditioner', 'Hair Oil', 'Serum', 'Mask', 'Leave-in', 'Other'] },
  { key: 'hair_type', label: 'Hair Type', type: 'select', options: ['Dry', 'Oily', 'Normal', 'Curly', 'Damaged'] },
  { key: 'concern', label: 'Concern', type: 'multiselect', options: ['Hair Fall', 'Dandruff', 'Growth', 'Repair', 'Frizz Control'] },
  { key: 'formulation', label: 'Formulation', type: 'select', options: ['Liquid', 'Cream', 'Oil', 'Gel', 'Foam'] },
  { key: 'ingredients', label: 'Ingredients', type: 'text' },
  { key: 'sulfate_free', label: 'Sulfate-Free', type: 'toggle' },
  { key: 'organic', label: 'Organic', type: 'toggle' },
  { key: 'size', label: 'Size', type: 'text' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'usage_frequency', label: 'Usage Frequency', type: 'select', options: ['Daily', 'Weekly', 'Twice Weekly', 'As Needed'] },
];

const MAKEUP_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Foundation', 'Lipstick', 'Mascara', 'Concealer', 'Blush', 'Eyeliner', 'Powder', 'Other'] },
  { key: 'shade_color', label: 'Shade / Color', type: 'text' },
  { key: 'skin_type', label: 'Skin Type', type: 'select', options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'All'] },
  { key: 'finish', label: 'Finish', type: 'select', options: ['Matte', 'Glossy', 'Natural', 'Dewy'] },
  { key: 'coverage', label: 'Coverage', type: 'select', options: ['Light', 'Medium', 'Full'] },
  { key: 'waterproof', label: 'Waterproof', type: 'toggle' },
  { key: 'long_lasting', label: 'Long Lasting', type: 'toggle' },
  { key: 'ingredients', label: 'Ingredients', type: 'text' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'size', label: 'Size', type: 'text' },
];

const FRAGRANCE_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Type', type: 'select', required: true, options: ['Perfume', 'Body Spray', 'Deodorant'] },
  { key: 'gender', label: 'Gender', type: 'select', options: ['Unisex', 'Male', 'Female'] },
  { key: 'fragrance_family', label: 'Fragrance Family', type: 'select', options: ['Floral', 'Woody', 'Citrus', 'Oriental', 'Fresh'] },
  { key: 'concentration', label: 'Concentration', type: 'select', options: ['EDT', 'EDP', 'Parfum'] },
  { key: 'longevity_hours', label: 'Longevity (hours)', type: 'number' },
  { key: 'size', label: 'Size (ml)', type: 'text' },
  { key: 'original_packaging', label: 'Original Packaging', type: 'toggle' },
];

const PERSONAL_CARE_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Soap', 'Body Wash', 'Toothpaste', 'Shaving', 'Sanitary', 'Other'] },
  { key: 'skin_type', label: 'Skin Type', type: 'select', options: ['Dry', 'Oily', 'Combination', 'Sensitive', 'All'] },
  { key: 'ingredients', label: 'Ingredients', type: 'text' },
  { key: 'organic', label: 'Organic', type: 'toggle' },
  { key: 'size', label: 'Size', type: 'text' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
];

const HEALTH_CARE_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Vitamins', 'Supplements', 'Medical Items', 'Other'] },
  { key: 'usage', label: 'Usage', type: 'text' },
  { key: 'form', label: 'Form', type: 'select', options: ['Tablet', 'Capsule', 'Liquid', 'Powder'] },
  { key: 'ingredients', label: 'Ingredients', type: 'text' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'prescription_required', label: 'Prescription Required', type: 'toggle' },
  { key: 'dosage_info', label: 'Dosage Info', type: 'text' },
];

const BEAUTY_TOOLS_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'select', required: true, options: ['Hair Dryer', 'Trimmer', 'Facial Device', 'Massager', 'Other'] },
  { key: 'power_source', label: 'Power Source', type: 'select', options: ['Battery', 'Electric'] },
  { key: 'usage_area', label: 'Usage Area', type: 'select', options: ['Face', 'Hair', 'Body'] },
  { key: 'features', label: 'Features', type: 'multiselect', options: ['Temperature Control', 'Wireless', 'Portable', 'Waterproof', 'Fast Charging', 'Attachments Included'] },
  { key: 'warranty', label: 'Warranty', type: 'text' },
  { key: 'tool_condition', label: 'Condition', type: 'select', options: ['New', 'Used', 'Unopened'] },
];

const OTHER_FIELDS: HealthBeautySpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'text', required: true },
  { key: 'brand', label: 'Brand', type: 'text' },
];

export const HEALTH_BEAUTY_SPEC_CONFIG: Record<HealthBeautySubcategory, HealthBeautySpecField[]> = {
  skincare: SKINCARE_FIELDS,
  haircare: HAIRCARE_FIELDS,
  makeup: MAKEUP_FIELDS,
  fragrances: FRAGRANCE_FIELDS,
  'personal-care': PERSONAL_CARE_FIELDS,
  'health-care-products': HEALTH_CARE_FIELDS,
  'beauty-tools-devices': BEAUTY_TOOLS_FIELDS,
  other: OTHER_FIELDS,
};

export const getHealthBeautySpecsConfig = (subcategory: HealthBeautySubcategory | ''): HealthBeautySpecField[] => {
  if (!subcategory) return [];
  return HEALTH_BEAUTY_SPEC_CONFIG[subcategory] || [];
};

export const getHealthBeautyFieldTranslationKey = (fieldKey: string): string => `fields.${fieldKey}`;

export const getHealthBeautyOptionTranslationKey = (option: string): string => {
  const normalized = option
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\//g, '_')
    .replace(/[()]/g, '')
    .replace(/-/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  return `optionLabels.${normalized}`;
};
