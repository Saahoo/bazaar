// src/lib/constants/baby-kids-wizard.ts
// Constants for the Kids & Baby Dynamic Listing Wizard

// ─── Subcategory Types ────────────────────────────────────────────────────────
export type BabyKidsSubcategory =
  | 'baby-clothing'
  | 'kids-clothing'
  | 'toys-games'
  | 'baby-gear'
  | 'feeding-nursing'
  | 'strollers-car-seats'
  | 'nursery-furniture'
  | 'diapers-hygiene'
  | 'kids-footwear'
  | 'school-supplies';

export interface BabyKidsSubcategoryOption {
  value: BabyKidsSubcategory;
  labelKey: string;
}

export const BABY_KIDS_SUBCATEGORIES: BabyKidsSubcategoryOption[] = [
  { value: 'baby-clothing', labelKey: 'subcategoryBabyClothing' },
  { value: 'kids-clothing', labelKey: 'subcategoryKidsClothing' },
  { value: 'toys-games', labelKey: 'subcategoryToysGames' },
  { value: 'baby-gear', labelKey: 'subcategoryBabyGear' },
  { value: 'feeding-nursing', labelKey: 'subcategoryFeedingNursing' },
  { value: 'strollers-car-seats', labelKey: 'subcategoryStrollersCarSeats' },
  { value: 'nursery-furniture', labelKey: 'subcategoryNurseryFurniture' },
  { value: 'diapers-hygiene', labelKey: 'subcategoryDiapersHygiene' },
  { value: 'kids-footwear', labelKey: 'subcategoryKidsFootwear' },
  { value: 'school-supplies', labelKey: 'subcategorySchoolSupplies' },
];

export const BABY_KIDS_SUBCATEGORY_LABEL_KEYS: Record<BabyKidsSubcategory, string> = {
  'baby-clothing': 'subcategoryBabyClothing',
  'kids-clothing': 'subcategoryKidsClothing',
  'toys-games': 'subcategoryToysGames',
  'baby-gear': 'subcategoryBabyGear',
  'feeding-nursing': 'subcategoryFeedingNursing',
  'strollers-car-seats': 'subcategoryStrollersCarSeats',
  'nursery-furniture': 'subcategoryNurseryFurniture',
  'diapers-hygiene': 'subcategoryDiapersHygiene',
  'kids-footwear': 'subcategoryKidsFootwear',
  'school-supplies': 'subcategorySchoolSupplies',
};

// ─── Spec Field Types & Interfaces ────────────────────────────────────────────
export type BabyKidsSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface BabyKidsSpecField {
  key: string;
  label: string;
  type: BabyKidsSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
  subcategories?: BabyKidsSubcategory[];
}

// ─── Option Arrays ────────────────────────────────────────────────────────────

export const CONDITION_OPTIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
] as const;

export const AGE_RANGE_OPTIONS = [
  '0-3 months',
  '3-6 months',
  '6-12 months',
  '1-2 years',
  '2-3 years',
  '3-4 years',
  '4-5 years',
  '5-7 years',
  '7-10 years',
  '10-12 years',
  '12+ years',
] as const;

export const GENDER_OPTIONS = [
  'Boy',
  'Girl',
  'Unisex',
] as const;

export const PRICE_TYPE_OPTIONS = [
  'Fixed',
  'Negotiable',
] as const;

export const DELIVERY_OPTIONS = [
  'Available',
  'Not Available',
  'Local Only',
] as const;

// Baby Clothing specific
export const BABY_CLOTHING_TYPE_OPTIONS = [
  'Onesie',
  'Romper',
  'Sleepsuit',
  'Dress',
  'Set',
  'Jacket',
  'Pants',
  'Shirt',
  'Other',
] as const;

export const BABY_CLOTHING_SIZE_OPTIONS = [
  'Newborn',
  '0-3M',
  '3-6M',
  '6-9M',
  '9-12M',
  '12-18M',
  '18-24M',
] as const;

export const MATERIAL_OPTIONS = [
  'Cotton',
  'Polyester',
  'Wool',
  'Silk',
  'Denim',
  'Blend',
  'Other',
] as const;

export const SEASON_OPTIONS = [
  'Summer',
  'Winter',
  'Spring/Fall',
  'All Seasons',
] as const;

// Kids Clothing specific
export const KIDS_CLOTHING_TYPE_OPTIONS = [
  'T-Shirt',
  'Shirt',
  'Dress',
  'Pants',
  'Shorts',
  'Skirt',
  'Jacket',
  'Coat',
  'Set',
  'Uniform',
  'Other',
] as const;

export const KIDS_CLOTHING_SIZE_OPTIONS = [
  '2T',
  '3T',
  '4T',
  '5',
  '6',
  '7',
  '8',
  '10',
  '12',
  '14',
  '16',
] as const;

// Toys & Games specific
export const TOY_TYPE_OPTIONS = [
  'Action Figures',
  'Dolls',
  'Building Blocks',
  'Board Games',
  'Educational Toys',
  'Outdoor Toys',
  'Puzzles',
  'Remote Control',
  'Musical Toys',
  'Arts & Crafts',
  'Other',
] as const;

export const TOY_MATERIAL_OPTIONS = [
  'Plastic',
  'Wood',
  'Fabric',
  'Metal',
  'Electronic',
  'Other',
] as const;

// Baby Gear specific
export const GEAR_TYPE_OPTIONS = [
  'Baby Carrier',
  'Baby Walker',
  'High Chair',
  'Baby Swing',
  'Playpen',
  'Baby Monitor',
  'Diaper Bag',
  'Other',
] as const;

// Feeding & Nursing specific
export const FEEDING_TYPE_OPTIONS = [
  'Bottle',
  'Breast Pump',
  'Pacifier',
  'Bib',
  'Sippy Cup',
  'Baby Food Maker',
  'Sterilizer',
  'Nursing Pillow',
  'Other',
] as const;

// Strollers & Car Seats specific
export const STROLLER_TYPE_OPTIONS = [
  'Standard Stroller',
  'Lightweight Stroller',
  'Jogging Stroller',
  'Double Stroller',
  'Travel System',
  'Car Seat',
  'Booster Seat',
  'Other',
] as const;

// Nursery Furniture specific
export const FURNITURE_TYPE_OPTIONS = [
  'Crib',
  'Bassinet',
  'Changing Table',
  'Dresser',
  'Wardrobe',
  'Bookshelf',
  'Nightstand',
  'Glider/Rocker',
  'Other',
] as const;

export const FURNITURE_MATERIAL_OPTIONS = [
  'Wood',
  'Metal',
  'Plastic',
  'Fabric',
  'Other',
] as const;

// Diapers & Hygiene specific
export const DIAPER_TYPE_OPTIONS = [
  'Disposable Diapers',
  'Cloth Diapers',
  'Wipes',
  'Baby Lotion',
  'Baby Shampoo',
  'Baby Oil',
  'Baby Powder',
  'Other',
] as const;

export const DIAPER_SIZE_OPTIONS = [
  'Newborn',
  'Size 1',
  'Size 2',
  'Size 3',
  'Size 4',
  'Size 5',
  'Size 6',
] as const;

// Kids Footwear specific
export const FOOTWEAR_TYPE_OPTIONS = [
  'Sneakers',
  'Sandals',
  'Boots',
  'Slippers',
  'Formal Shoes',
  'Other',
] as const;

export const FOOTWEAR_SIZE_OPTIONS = [
  'EU 18',
  'EU 19',
  'EU 20',
  'EU 21',
  'EU 22',
  'EU 23',
  'EU 24',
  'EU 25',
  'EU 26',
  'EU 27',
  'EU 28',
  'EU 29',
  'EU 30',
  'EU 31',
  'EU 32',
  'EU 33',
  'EU 34',
  'EU 35',
  'EU 36',
  'EU 37',
  'EU 38',
] as const;

export const FOOTWEAR_MATERIAL_OPTIONS = [
  'Leather',
  'Synthetic',
  'Canvas',
  'Rubber',
  'Other',
] as const;

// School Supplies specific
export const SUPPLY_TYPE_OPTIONS = [
  'Backpack',
  'Lunch Box',
  'Stationery Set',
  'Books',
  'Pencil Case',
  'Water Bottle',
  'Other',
] as const;

export const GRADE_LEVEL_OPTIONS = [
  'Preschool',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'University',
] as const;

// ─── Common Fields (shared across all subcategories) ──────────────────────────
const COMMON_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    required: true,
    options: [...CONDITION_OPTIONS],
  },
  {
    key: 'ageRange',
    label: 'Age Range',
    type: 'select',
    required: true,
    options: [...AGE_RANGE_OPTIONS],
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    options: [...GENDER_OPTIONS],
  },
  {
    key: 'price',
    label: 'Price',
    type: 'number',
    required: true,
    placeholder: '0',
  },
  {
    key: 'priceType',
    label: 'Price Type',
    type: 'select',
    options: [...PRICE_TYPE_OPTIONS],
  },
  {
    key: 'deliveryAvailable',
    label: 'Delivery',
    type: 'select',
    options: [...DELIVERY_OPTIONS],
  },
];

// ─── Subcategory-Specific Fields ──────────────────────────────────────────────

const BABY_CLOTHING_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'clothingType',
    label: 'Clothing Type',
    type: 'select',
    required: true,
    options: [...BABY_CLOTHING_TYPE_OPTIONS],
    subcategories: ['baby-clothing'],
  },
  {
    key: 'size',
    label: 'Size',
    type: 'select',
    required: true,
    options: [...BABY_CLOTHING_SIZE_OPTIONS],
    subcategories: ['baby-clothing'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    options: [...MATERIAL_OPTIONS],
    subcategories: ['baby-clothing'],
  },
  {
    key: 'season',
    label: 'Season',
    type: 'select',
    options: [...SEASON_OPTIONS],
    subcategories: ['baby-clothing'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Carter\'s, H&M',
    subcategories: ['baby-clothing'],
  },
];

const KIDS_CLOTHING_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'clothingType',
    label: 'Clothing Type',
    type: 'select',
    required: true,
    options: [...KIDS_CLOTHING_TYPE_OPTIONS],
    subcategories: ['kids-clothing'],
  },
  {
    key: 'size',
    label: 'Size',
    type: 'select',
    required: true,
    options: [...KIDS_CLOTHING_SIZE_OPTIONS],
    subcategories: ['kids-clothing'],
  },
  {
    key: 'material',
    label: 'Material',
    type: 'select',
    options: [...MATERIAL_OPTIONS],
    subcategories: ['kids-clothing'],
  },
  {
    key: 'season',
    label: 'Season',
    type: 'select',
    options: [...SEASON_OPTIONS],
    subcategories: ['kids-clothing'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Zara Kids, Gap Kids',
    subcategories: ['kids-clothing'],
  },
];

const TOYS_GAMES_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'toyType',
    label: 'Toy Type',
    type: 'select',
    required: true,
    options: [...TOY_TYPE_OPTIONS],
    subcategories: ['toys-games'],
  },
  {
    key: 'toyMaterial',
    label: 'Material',
    type: 'select',
    options: [...TOY_MATERIAL_OPTIONS],
    subcategories: ['toys-games'],
  },
  {
    key: 'safetyCertified',
    label: 'Safety Certified',
    type: 'toggle',
    subcategories: ['toys-games'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. LEGO, Fisher-Price',
    subcategories: ['toys-games'],
  },
];

const BABY_GEAR_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'gearType',
    label: 'Gear Type',
    type: 'select',
    required: true,
    options: [...GEAR_TYPE_OPTIONS],
    subcategories: ['baby-gear'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. BabyBjörn, Chicco',
    subcategories: ['baby-gear'],
  },
  {
    key: 'features',
    label: 'Features',
    type: 'text',
    placeholder: 'e.g. Adjustable, Foldable',
    subcategories: ['baby-gear'],
  },
];

const FEEDING_NURSING_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'feedingType',
    label: 'Feeding Type',
    type: 'select',
    required: true,
    options: [...FEEDING_TYPE_OPTIONS],
    subcategories: ['feeding-nursing'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Philips Avent, Medela',
    subcategories: ['feeding-nursing'],
  },
  {
    key: 'bpaFree',
    label: 'BPA Free',
    type: 'toggle',
    subcategories: ['feeding-nursing'],
  },
];

const STROLLERS_CAR_SEATS_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'strollerType',
    label: 'Type',
    type: 'select',
    required: true,
    options: [...STROLLER_TYPE_OPTIONS],
    subcategories: ['strollers-car-seats'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Bugaboo, Graco',
    subcategories: ['strollers-car-seats'],
  },
  {
    key: 'foldable',
    label: 'Foldable',
    type: 'toggle',
    subcategories: ['strollers-car-seats'],
  },
  {
    key: 'weightCapacity',
    label: 'Weight Capacity (kg)',
    type: 'text',
    placeholder: 'e.g. 25',
    subcategories: ['strollers-car-seats'],
  },
];

const NURSERY_FURNITURE_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'furnitureType',
    label: 'Furniture Type',
    type: 'select',
    required: true,
    options: [...FURNITURE_TYPE_OPTIONS],
    subcategories: ['nursery-furniture'],
  },
  {
    key: 'furnitureMaterial',
    label: 'Material',
    type: 'select',
    options: [...FURNITURE_MATERIAL_OPTIONS],
    subcategories: ['nursery-furniture'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. IKEA, Delta Children',
    subcategories: ['nursery-furniture'],
  },
  {
    key: 'assemblyRequired',
    label: 'Assembly Required',
    type: 'toggle',
    subcategories: ['nursery-furniture'],
  },
];

const DIAPERS_HYGIENE_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'diaperType',
    label: 'Type',
    type: 'select',
    required: true,
    options: [...DIAPER_TYPE_OPTIONS],
    subcategories: ['diapers-hygiene'],
  },
  {
    key: 'diaperSize',
    label: 'Size',
    type: 'select',
    options: [...DIAPER_SIZE_OPTIONS],
    subcategories: ['diapers-hygiene'],
  },
  {
    key: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: 'e.g. 50',
    subcategories: ['diapers-hygiene'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Pampers, Huggies',
    subcategories: ['diapers-hygiene'],
  },
];

const KIDS_FOOTWEAR_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'footwearType',
    label: 'Footwear Type',
    type: 'select',
    required: true,
    options: [...FOOTWEAR_TYPE_OPTIONS],
    subcategories: ['kids-footwear'],
  },
  {
    key: 'footwearSize',
    label: 'Size',
    type: 'select',
    required: true,
    options: [...FOOTWEAR_SIZE_OPTIONS],
    subcategories: ['kids-footwear'],
  },
  {
    key: 'footwearMaterial',
    label: 'Material',
    type: 'select',
    options: [...FOOTWEAR_MATERIAL_OPTIONS],
    subcategories: ['kids-footwear'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. Nike Kids, Adidas Kids',
    subcategories: ['kids-footwear'],
  },
];

const SCHOOL_SUPPLIES_FIELDS: BabyKidsSpecField[] = [
  {
    key: 'supplyType',
    label: 'Supply Type',
    type: 'select',
    required: true,
    options: [...SUPPLY_TYPE_OPTIONS],
    subcategories: ['school-supplies'],
  },
  {
    key: 'gradeLevel',
    label: 'Grade Level',
    type: 'select',
    options: [...GRADE_LEVEL_OPTIONS],
    subcategories: ['school-supplies'],
  },
  {
    key: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'e.g. JanSport, Crayola',
    subcategories: ['school-supplies'],
  },
];

// ─── Spec Config Record ───────────────────────────────────────────────────────
const SUBCATEGORY_SPEC_FIELDS: Record<BabyKidsSubcategory, BabyKidsSpecField[]> = {
  'baby-clothing': BABY_CLOTHING_FIELDS,
  'kids-clothing': KIDS_CLOTHING_FIELDS,
  'toys-games': TOYS_GAMES_FIELDS,
  'baby-gear': BABY_GEAR_FIELDS,
  'feeding-nursing': FEEDING_NURSING_FIELDS,
  'strollers-car-seats': STROLLERS_CAR_SEATS_FIELDS,
  'nursery-furniture': NURSERY_FURNITURE_FIELDS,
  'diapers-hygiene': DIAPERS_HYGIENE_FIELDS,
  'kids-footwear': KIDS_FOOTWEAR_FIELDS,
  'school-supplies': SCHOOL_SUPPLIES_FIELDS,
};

export const BABY_KIDS_SPEC_CONFIG: Record<BabyKidsSubcategory, BabyKidsSpecField[]> = Object.fromEntries(
  Object.entries(SUBCATEGORY_SPEC_FIELDS).map(([sub, fields]) => [
    sub,
    [...COMMON_FIELDS, ...fields],
  ])
) as Record<BabyKidsSubcategory, BabyKidsSpecField[]>;

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getBabyKidsSpecsConfig(subcategory: BabyKidsSubcategory | ''): BabyKidsSpecField[] {
  if (!subcategory) return COMMON_FIELDS;
  return BABY_KIDS_SPEC_CONFIG[subcategory] || COMMON_FIELDS;
}

export function getBabyKidsFieldTranslationKey(key: string): string {
  return `fields.${key}`;
}

export function getBabyKidsOptionTranslationKey(key: string): string {
  return `optionLabels.${key}`;
}
