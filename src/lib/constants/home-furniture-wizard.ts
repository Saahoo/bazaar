export type HomeFurnitureSubcategory =
  | 'living-room'
  | 'bedroom'
  | 'dining-room'
  | 'office-furniture'
  | 'outdoor-furniture'
  | 'home-decor'
  | 'kitchen-dining'
  | 'lighting'
  | 'storage-organization'
  | 'other';

export interface HomeFurnitureSubcategoryOption {
  value: HomeFurnitureSubcategory;
  label: string;
}

export type HomeFurnitureSpecFieldType = 'text' | 'number' | 'select' | 'multiselect' | 'toggle';

export interface HomeFurnitureSpecField {
  key: string;
  label: string;
  type: HomeFurnitureSpecFieldType;
  required?: boolean;
  options?: string[];
}

export const HOME_FURNITURE_SUBCATEGORIES: HomeFurnitureSubcategoryOption[] = [
  { value: 'living-room', label: 'Living Room Furniture' },
  { value: 'bedroom', label: 'Bedroom Furniture' },
  { value: 'dining-room', label: 'Dining Room Furniture' },
  { value: 'office-furniture', label: 'Office Furniture' },
  { value: 'outdoor-furniture', label: 'Outdoor Furniture' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'kitchen-dining', label: 'Kitchen & Dining' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'storage-organization', label: 'Storage & Organization' },
  { value: 'other', label: 'Other' },
];

export const HOME_FURNITURE_SUBCATEGORY_LABEL_KEYS: Record<HomeFurnitureSubcategory, string> = {
  'living-room': 'subcategories.living_room',
  bedroom: 'subcategories.bedroom',
  'dining-room': 'subcategories.dining_room',
  'office-furniture': 'subcategories.office_furniture',
  'outdoor-furniture': 'subcategories.outdoor_furniture',
  'home-decor': 'subcategories.home_decor',
  'kitchen-dining': 'subcategories.kitchen_dining',
  lighting: 'subcategories.lighting',
  'storage-organization': 'subcategories.storage_organization',
  other: 'subcategories.other',
};

// Furniture subcategories (Living Room, Bedroom, Dining Room, Office, Outdoor)
const FURNITURE_COMMON_FIELDS: HomeFurnitureSpecField[] = [
  {
    key: 'furniture_type',
    label: 'Furniture Type',
    type: 'select',
    required: true,
    options: ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Desk', 'Bookcase', 'Cabinet', 'Dresser', 'Bench', 'Other'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    required: true,
    options: ['Wood', 'Metal', 'Glass', 'Plastic', 'Fabric', 'Leather', 'Rattan', 'Mixed', 'Other'],
  },
  {
    key: 'color',
    label: 'Color',
    type: 'multiselect',
    required: true,
    options: ['White', 'Black', 'Brown', 'Grey', 'Beige', 'Natural Wood', 'Blue', 'Green', 'Red', 'Other'],
  },
  { key: 'length', label: 'Length (cm)', type: 'number' },
  { key: 'width', label: 'Width (cm)', type: 'number' },
  { key: 'height', label: 'Height (cm)', type: 'number' },
  { key: 'weight', label: 'Weight (kg)', type: 'number' },
  { key: 'seating_capacity', label: 'Seating Capacity', type: 'number' },
  {
    key: 'style',
    label: 'Style',
    type: 'select',
    options: ['Modern', 'Classic', 'Minimalist', 'Rustic', 'Industrial', 'Scandinavian', 'Other'],
  },
  { key: 'assembly_required', label: 'Assembly Required', type: 'toggle' },
  { key: 'condition_details', label: 'Condition Details', type: 'text' },
  {
    key: 'usage',
    label: 'Usage',
    type: 'select',
    options: ['Home', 'Office', 'Outdoor'],
  },
  { key: 'warranty', label: 'Warranty', type: 'text' },
  { key: 'included_items', label: 'Included Items', type: 'text' },
];

const HOME_DECOR_FIELDS: HomeFurnitureSpecField[] = [
  {
    key: 'decor_type',
    label: 'Decor Type',
    type: 'select',
    required: true,
    options: ['Wall Art', 'Rug', 'Curtain', 'Mirror', 'Vase', 'Pillow', 'Candle', 'Clock', 'Plant Pot', 'Other'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    options: ['Cotton', 'Polyester', 'Wood', 'Metal', 'Glass', 'Ceramic', 'Fabric', 'Bamboo', 'Other'],
  },
  {
    key: 'color',
    label: 'Color',
    type: 'multiselect',
    options: ['White', 'Black', 'Brown', 'Grey', 'Beige', 'Blue', 'Green', 'Red', 'Gold', 'Other'],
  },
  {
    key: 'style',
    label: 'Style',
    type: 'select',
    options: ['Modern', 'Classic', 'Minimalist', 'Rustic', 'Bohemian', 'Vintage', 'Luxury', 'Other'],
  },
  {
    key: 'theme',
    label: 'Theme',
    type: 'select',
    options: ['Vintage', 'Bohemian', 'Luxury', 'Nature', 'Abstract', 'Traditional', 'Other'],
  },
  { key: 'length', label: 'Length / Width (cm)', type: 'number' },
  { key: 'height', label: 'Height (cm)', type: 'number' },
  { key: 'handmade', label: 'Handmade', type: 'toggle' },
  {
    key: 'set_or_single',
    label: 'Set or Single Item',
    type: 'select',
    options: ['Single', 'Set'],
  },
  { key: 'warranty', label: 'Warranty', type: 'text' },
];

const KITCHEN_DINING_FIELDS: HomeFurnitureSpecField[] = [
  {
    key: 'product_type',
    label: 'Product Type',
    type: 'select',
    required: true,
    options: ['Cookware', 'Utensils', 'Dinner Set', 'Appliance', 'Storage Container', 'Cutlery', 'Glassware', 'Other'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    options: ['Stainless Steel', 'Non-stick', 'Ceramic', 'Glass', 'Plastic', 'Silicone', 'Cast Iron', 'Other'],
  },
  { key: 'capacity', label: 'Capacity (Liters / Pieces)', type: 'text' },
  {
    key: 'color',
    label: 'Color',
    type: 'multiselect',
    options: ['White', 'Black', 'Silver', 'Red', 'Blue', 'Green', 'Other'],
  },
  { key: 'dishwasher_safe', label: 'Dishwasher Safe', type: 'toggle' },
  { key: 'microwave_safe', label: 'Microwave Safe', type: 'toggle' },
  { key: 'set_size', label: 'Set Size (pieces)', type: 'number' },
  { key: 'warranty', label: 'Warranty', type: 'text' },
];

const LIGHTING_FIELDS: HomeFurnitureSpecField[] = [
  {
    key: 'lighting_type',
    label: 'Type',
    type: 'select',
    required: true,
    options: ['Ceiling Light', 'Floor Lamp', 'Table Lamp', 'Wall Light', 'LED Strip', 'Chandelier', 'Spotlight', 'Other'],
  },
  {
    key: 'power_source',
    label: 'Power Source',
    type: 'select',
    required: true,
    options: ['Electric', 'Battery', 'Solar', 'USB'],
  },
  { key: 'wattage', label: 'Wattage (W)', type: 'number' },
  {
    key: 'light_color',
    label: 'Light Color',
    type: 'select',
    options: ['Warm White', 'Cool White', 'Daylight', 'RGB', 'Tunable'],
  },
  { key: 'smart_lighting', label: 'Smart Lighting', type: 'toggle' },
  { key: 'dimmable', label: 'Dimmable', type: 'toggle' },
  {
    key: 'installation_type',
    label: 'Installation Type',
    type: 'select',
    options: ['Ceiling Mount', 'Wall Mount', 'Floor Standing', 'Plug-in', 'Hardwired', 'Other'],
  },
  { key: 'warranty', label: 'Warranty', type: 'text' },
];

const STORAGE_ORGANIZATION_FIELDS: HomeFurnitureSpecField[] = [
  {
    key: 'storage_type',
    label: 'Storage Type',
    type: 'select',
    required: true,
    options: ['Cabinet', 'Shelf', 'Drawer Unit', 'Organizer', 'Rack', 'Trunk', 'Box', 'Hanger', 'Other'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    options: ['Wood', 'Metal', 'Plastic', 'Fabric', 'Rattan', 'Mixed', 'Other'],
  },
  {
    key: 'color',
    label: 'Color',
    type: 'multiselect',
    options: ['White', 'Black', 'Brown', 'Grey', 'Beige', 'Natural Wood', 'Other'],
  },
  { key: 'capacity', label: 'Capacity', type: 'text' },
  { key: 'compartments', label: 'Number of Compartments', type: 'number' },
  { key: 'wall_mounted', label: 'Wall Mounted', type: 'toggle' },
  { key: 'lockable', label: 'Lockable', type: 'toggle' },
  { key: 'length', label: 'Length (cm)', type: 'number' },
  { key: 'width', label: 'Width (cm)', type: 'number' },
  { key: 'height', label: 'Height (cm)', type: 'number' },
  { key: 'warranty', label: 'Warranty', type: 'text' },
];

const OTHER_FIELDS: HomeFurnitureSpecField[] = [
  { key: 'product_type', label: 'Product Type', type: 'text', required: true },
  { key: 'brand', label: 'Brand', type: 'text' },
  { key: 'custom_spec_1_key', label: 'Specification 1 Name', type: 'text' },
  { key: 'custom_spec_1_value', label: 'Specification 1 Value', type: 'text' },
  { key: 'custom_spec_2_key', label: 'Specification 2 Name', type: 'text' },
  { key: 'custom_spec_2_value', label: 'Specification 2 Value', type: 'text' },
  { key: 'custom_spec_3_key', label: 'Specification 3 Name', type: 'text' },
  { key: 'custom_spec_3_value', label: 'Specification 3 Value', type: 'text' },
];

export const HOME_FURNITURE_SPEC_CONFIG: Record<HomeFurnitureSubcategory, HomeFurnitureSpecField[]> = {
  'living-room': FURNITURE_COMMON_FIELDS,
  bedroom: FURNITURE_COMMON_FIELDS,
  'dining-room': FURNITURE_COMMON_FIELDS,
  'office-furniture': FURNITURE_COMMON_FIELDS,
  'outdoor-furniture': FURNITURE_COMMON_FIELDS,
  'home-decor': HOME_DECOR_FIELDS,
  'kitchen-dining': KITCHEN_DINING_FIELDS,
  lighting: LIGHTING_FIELDS,
  'storage-organization': STORAGE_ORGANIZATION_FIELDS,
  other: OTHER_FIELDS,
};

export const getHomeFurnitureSpecsConfig = (subcategory: HomeFurnitureSubcategory | ''): HomeFurnitureSpecField[] => {
  if (!subcategory) return [];
  return HOME_FURNITURE_SPEC_CONFIG[subcategory] || [];
};

export const getHomeFurnitureFieldTranslationKey = (fieldKey: string): string => `fields.${fieldKey}`;

export const getHomeFurnitureOptionTranslationKey = (option: string): string => {
  const normalized = option
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, '_')
    .replace(/\+/g, 'plus')
    .replace(/[()]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  return `optionLabels.${normalized}`;
};

export const isFurnitureSubcategory = (subcategory: HomeFurnitureSubcategory | ''): boolean => {
  return (
    subcategory === 'living-room' ||
    subcategory === 'bedroom' ||
    subcategory === 'dining-room' ||
    subcategory === 'office-furniture' ||
    subcategory === 'outdoor-furniture'
  );
};
