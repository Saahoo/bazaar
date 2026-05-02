export type FoodAgricultureSubcategory =
  | 'grains-cereals'
  | 'fruits-vegetables'
  | 'spices-herbs'
  | 'dairy-products'
  | 'poultry-eggs'
  | 'fertilizers-pesticides'
  | 'farm-equipment'
  | 'seeds-saplings'
  | 'animal-feed'
  | 'organic-products'
  | 'tea-coffee'
  | 'oils-ghee'
  | 'honey-preserves';

export interface FoodAgricultureSubcategoryOption {
  value: FoodAgricultureSubcategory;
  label: string;
}

export const FOOD_AGRICULTURE_SUBCATEGORY_LABEL_KEYS: Record<FoodAgricultureSubcategory, string> = {
  'grains-cereals': 'subcategoryGrainsCereals',
  'fruits-vegetables': 'subcategoryFruitsVegetables',
  'spices-herbs': 'subcategorySpicesHerbs',
  'dairy-products': 'subcategoryDairyProducts',
  'poultry-eggs': 'subcategoryPoultryEggs',
  'fertilizers-pesticides': 'subcategoryFertilizersPesticides',
  'farm-equipment': 'subcategoryFarmEquipment',
  'seeds-saplings': 'subcategorySeedsSaplings',
  'animal-feed': 'subcategoryAnimalFeed',
  'organic-products': 'subcategoryOrganicProducts',
  'tea-coffee': 'subcategoryTeaCoffee',
  'oils-ghee': 'subcategoryOilsGhee',
  'honey-preserves': 'subcategoryHoneyPreserves',
};

export type FoodAgricultureSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface FoodAgricultureSpecField {
  key: string;
  label: string;
  type: FoodAgricultureSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
}

export const FOOD_AGRICULTURE_SUBCATEGORIES: FoodAgricultureSubcategoryOption[] = [
  { value: 'grains-cereals', label: 'Grains & Cereals' },
  { value: 'fruits-vegetables', label: 'Fruits & Vegetables' },
  { value: 'spices-herbs', label: 'Spices & Herbs' },
  { value: 'dairy-products', label: 'Dairy Products' },
  { value: 'poultry-eggs', label: 'Poultry & Eggs' },
  { value: 'fertilizers-pesticides', label: 'Fertilizers & Pesticides' },
  { value: 'farm-equipment', label: 'Farm Equipment' },
  { value: 'seeds-saplings', label: 'Seeds & Saplings' },
  { value: 'animal-feed', label: 'Animal Feed' },
  { value: 'organic-products', label: 'Organic Products' },
  { value: 'tea-coffee', label: 'Tea & Coffee' },
  { value: 'oils-ghee', label: 'Oils & Ghee' },
  { value: 'honey-preserves', label: 'Honey & Preserves' },
];

// Unit options for quantity
export const QUANTITY_UNIT_OPTIONS = ['kg', 'tons', 'quintals', 'bags', 'liters', 'pieces', 'boxes', 'crates'];

// Grade options
export const GRADE_OPTIONS = ['Grade A', 'Grade B', 'Grade C', 'Ungraded'];

// Freshness options
export const FRESHNESS_OPTIONS = ['Fresh', 'Dried', 'Frozen', 'Canned', 'Preserved'];

// Certification options
export const CERTIFICATION_OPTIONS = ['Organic Certified', 'ISO Certified', 'HACCP Certified', 'Halal Certified', 'None'];

// Price type options
export const PRICE_TYPE_OPTIONS = ['Fixed', 'Negotiable', 'Per Unit', 'Per Kg'];

// Delivery options
export const DELIVERY_OPTIONS = ['Available', 'Not Available', 'Local Only'];

// Common fields for all food & agriculture subcategories
const FOOD_AGRICULTURE_COMMON_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'quantity', label: 'Quantity', type: 'number', required: true },
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
    type: 'select',
    required: false,
    options: GRADE_OPTIONS,
  },
  {
    key: 'freshness',
    label: 'Freshness/Condition',
    type: 'select',
    required: false,
    options: FRESHNESS_OPTIONS,
  },
  { key: 'origin', label: 'Origin/Source', type: 'text', required: false, placeholder: 'e.g., Local farm, Imported' },
  {
    key: 'certification',
    label: 'Certification',
    type: 'select',
    required: false,
    options: CERTIFICATION_OPTIONS,
  },
  { key: 'price', label: 'Price', type: 'number', required: true },
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
  { key: 'minOrder', label: 'Minimum Order', type: 'text', required: false, placeholder: 'e.g., 10 kg' },
];

// ─── Subcategory-specific fields ────────────────────────────────────────────────

const GRAINS_CEREALS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'moistureContent', label: 'Moisture Content (%)', type: 'text', placeholder: 'e.g., 12%' },
  { key: 'grainVariety', label: 'Grain Variety', type: 'select', options: ['Wheat', 'Rice', 'Barley', 'Corn', 'Oats', 'Sorghum', 'Millet', 'Other'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: ['Bulk', 'Bags (50kg)', 'Bags (25kg)', 'Bags (10kg)', 'Custom'] },
];

const FRUITS_VEGETABLES_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'variety', label: 'Variety', type: 'text', placeholder: 'e.g., Red Delicious, Roma Tomato' },
  { key: 'ripeness', label: 'Ripeness', type: 'select', options: ['Unripe', 'Semi-Ripe', 'Ripe', 'Overripe'] },
  { key: 'storageType', label: 'Storage Type', type: 'select', options: ['Room Temperature', 'Refrigerated', 'Cold Storage', 'Ambient'] },
];

const SPICES_HERBS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'spiceType', label: 'Spice/Herb Type', type: 'select', options: ['Saffron', 'Cumin', 'Coriander', 'Turmeric', 'Cardamom', 'Black Pepper', 'Mint', 'Dill', 'Other'] },
  { key: 'formType', label: 'Form', type: 'select', options: ['Whole', 'Ground', 'Powder', 'Dried Leaves', 'Fresh', 'Paste'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: ['Bulk', 'Retail Pack', 'Vacuum Sealed', 'Custom'] },
];

const DAIRY_PRODUCTS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'dairyType', label: 'Dairy Type', type: 'select', options: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Whey', 'Other'] },
  { key: 'fatContent', label: 'Fat Content', type: 'text', placeholder: 'e.g., 3.5%' },
  { key: 'storageType', label: 'Storage Type', type: 'select', options: ['Refrigerated', 'Frozen', 'Room Temperature', 'UHT Treated'] },
];

const POULTRY_EGGS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'poultryType', label: 'Poultry/Egg Type', type: 'select', options: ['Chicken', 'Duck', 'Quail', 'Turkey', 'Goose', 'Other'] },
  { key: 'eggSize', label: 'Egg Size', type: 'select', options: ['Small', 'Medium', 'Large', 'Extra Large'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: ['Tray (12)', 'Tray (30)', 'Bulk', 'Custom'] },
];

const FERTILIZERS_PESTICIDES_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'chemicalType', label: 'Chemical Type', type: 'select', options: ['Nitrogen-Based', 'Phosphorus-Based', 'Potassium-Based', 'Herbicide', 'Insecticide', 'Fungicide', 'Organic'] },
  { key: 'npkRatio', label: 'NPK Ratio', type: 'text', placeholder: 'e.g., 10-10-10' },
  { key: 'applicationMethod', label: 'Application Method', type: 'select', options: ['Soil Application', 'Foliar Spray', 'Fertigation', 'Seed Treatment', 'Broadcast'] },
];

const FARM_EQUIPMENT_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'equipmentType', label: 'Equipment Type', type: 'select', options: ['Tractor', 'Harvester', 'Plow', 'Seeder', 'Irrigation System', 'Thresher', 'Mill', 'Sprayer', 'Other'] },
  { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'] },
  { key: 'powerSource', label: 'Power Source', type: 'select', options: ['Diesel', 'Electric', 'Petrol', 'Manual', 'Animal-Drawn', 'Hybrid'] },
  { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Massey Ferguson, John Deere' },
];

const SEEDS_SAPLINGS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'seedType', label: 'Seed/Sapling Type', type: 'select', options: ['Vegetable Seeds', 'Fruit Seeds', 'Grain Seeds', 'Flower Seeds', 'Fruit Sapling', 'Tree Sapling', 'Other'] },
  { key: 'germinationRate', label: 'Germination Rate (%)', type: 'text', placeholder: 'e.g., 90%' },
  { key: 'maturityPeriod', label: 'Maturity Period', type: 'text', placeholder: 'e.g., 90 days, 2 years' },
];

const ANIMAL_FEED_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'feedType', label: 'Feed Type', type: 'select', options: ['Pellets', 'Mash', 'Crumbles', 'Blocks', 'Hay', 'Silage', 'Concentrate', 'Other'] },
  { key: 'animalType', label: 'Target Animal', type: 'select', options: ['Cattle', 'Poultry', 'Sheep/Goats', 'Horses', 'Fish', 'Pets', 'General'] },
  { key: 'weightPerBag', label: 'Weight Per Bag', type: 'text', placeholder: 'e.g., 25 kg, 50 kg' },
];

const ORGANIC_PRODUCTS_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'organicCertification', label: 'Organic Certification', type: 'select', options: ['USDA Organic', 'EU Organic', 'Local Organic Certified', 'Self-Declared Organic', 'None'] },
  { key: 'productType', label: 'Product Type', type: 'select', options: ['Fruits', 'Vegetables', 'Grains', 'Dairy', 'Honey', 'Herbs', 'Fertilizer', 'Other'] },
  { key: 'shelfLife', label: 'Shelf Life', type: 'text', placeholder: 'e.g., 6 months, 1 year' },
];

const TEA_COFFEE_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'beverageType', label: 'Beverage Type', type: 'select', options: ['Green Tea', 'Black Tea', 'Herbal Tea', 'Arabica Coffee', 'Robusta Coffee', 'Blended Coffee', 'Other'] },
  { key: 'roastLevel', label: 'Roast Level', type: 'select', options: ['Raw/Green', 'Light Roast', 'Medium Roast', 'Dark Roast', 'N/A'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: ['Loose Leaf', 'Tea Bags', 'Ground/Powder', 'Whole Bean', 'Vacuum Sealed', 'Custom'] },
];

const OILS_GHEE_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'oilType', label: 'Oil/Ghee Type', type: 'select', options: ['Olive Oil', 'Sunflower Oil', 'Sesame Oil', 'Coconut Oil', 'Vegetable Ghee', 'Animal Ghee', 'Mustard Oil', 'Other'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: ['Bottle', 'Can', 'Jar', 'Bulk', 'Pouch', 'Custom'] },
  { key: 'volume', label: 'Volume/Weight', type: 'text', placeholder: 'e.g., 1 liter, 5 kg' },
];

const HONEY_PRESERVES_FIELDS: FoodAgricultureSpecField[] = [
  { key: 'preserveType', label: 'Preserve Type', type: 'select', options: ['Honey', 'Jam', 'Pickles', 'Chutney', 'Syrup', 'Other'] },
  { key: 'jarSize', label: 'Jar/Container Size', type: 'text', placeholder: 'e.g., 250g, 500g, 1kg' },
  { key: 'flavor', label: 'Flavor/Variety', type: 'text', placeholder: 'e.g., Wildflower Honey, Mixed Fruit Jam' },
];

// ─── Spec config: common fields + subcategory-specific fields ───────────────────

export const FOOD_AGRICULTURE_SPEC_CONFIG: Record<FoodAgricultureSubcategory, FoodAgricultureSpecField[]> = {
  'grains-cereals': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...GRAINS_CEREALS_FIELDS],
  'fruits-vegetables': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...FRUITS_VEGETABLES_FIELDS],
  'spices-herbs': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...SPICES_HERBS_FIELDS],
  'dairy-products': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...DAIRY_PRODUCTS_FIELDS],
  'poultry-eggs': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...POULTRY_EGGS_FIELDS],
  'fertilizers-pesticides': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...FERTILIZERS_PESTICIDES_FIELDS],
  'farm-equipment': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...FARM_EQUIPMENT_FIELDS],
  'seeds-saplings': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...SEEDS_SAPLINGS_FIELDS],
  'animal-feed': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...ANIMAL_FEED_FIELDS],
  'organic-products': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...ORGANIC_PRODUCTS_FIELDS],
  'tea-coffee': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...TEA_COFFEE_FIELDS],
  'oils-ghee': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...OILS_GHEE_FIELDS],
  'honey-preserves': [...FOOD_AGRICULTURE_COMMON_FIELDS, ...HONEY_PRESERVES_FIELDS],
};

// Helper function to get spec config for a subcategory
export function getFoodAgricultureSpecsConfig(subcategory: FoodAgricultureSubcategory): FoodAgricultureSpecField[] {
  return FOOD_AGRICULTURE_SPEC_CONFIG[subcategory] || FOOD_AGRICULTURE_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getFoodAgricultureFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getFoodAgricultureOptionTranslationKey(option: string): string {
  return `optionLabels.${option}`;
}
