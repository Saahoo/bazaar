export type ShoppingGroceriesSubcategory =
  | 'packaged-foods'
  | 'beverages'
  | 'household-items'
  | 'personal-care'
  | 'snacks-confectionery'
  | 'baby-products'
  | 'cleaning-supplies'
  | 'bakery'
  | 'frozen-foods'
  | 'dairy-eggs'
  | 'fruits-vegetables'
  | 'meat-seafood'
  | 'spices-condiments';

export interface ShoppingGroceriesSubcategoryOption {
  value: ShoppingGroceriesSubcategory;
  label: string;
}

export const SHOPPING_GROCERIES_SUBCATEGORY_LABEL_KEYS: Record<ShoppingGroceriesSubcategory, string> = {
  'packaged-foods': 'subcategoryPackagedFoods',
  'beverages': 'subcategoryBeverages',
  'household-items': 'subcategoryHouseholdItems',
  'personal-care': 'subcategoryPersonalCare',
  'snacks-confectionery': 'subcategorySnacksConfectionery',
  'baby-products': 'subcategoryBabyProducts',
  'cleaning-supplies': 'subcategoryCleaningSupplies',
  'bakery': 'subcategoryBakery',
  'frozen-foods': 'subcategoryFrozenFoods',
  'dairy-eggs': 'subcategoryDairyEggs',
  'fruits-vegetables': 'subcategoryFruitsVegetables',
  'meat-seafood': 'subcategoryMeatSeafood',
  'spices-condiments': 'subcategorySpicesCondiments',
};

export type ShoppingGroceriesSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface ShoppingGroceriesSpecField {
  key: string;
  label: string;
  type: ShoppingGroceriesSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
}

export const SHOPPING_GROCERIES_SUBCATEGORIES: ShoppingGroceriesSubcategoryOption[] = [
  { value: 'packaged-foods', label: 'Packaged Foods' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'household-items', label: 'Household Items' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'snacks-confectionery', label: 'Snacks & Confectionery' },
  { value: 'baby-products', label: 'Baby Products' },
  { value: 'cleaning-supplies', label: 'Cleaning Supplies' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'frozen-foods', label: 'Frozen Foods' },
  { value: 'dairy-eggs', label: 'Dairy & Eggs' },
  { value: 'fruits-vegetables', label: 'Fruits & Vegetables' },
  { value: 'meat-seafood', label: 'Meat & Seafood' },
  { value: 'spices-condiments', label: 'Spices & Condiments' },
];

// Unit options for quantity
export const SG_QUANTITY_UNIT_OPTIONS = ['kg', 'liters', 'pieces', 'packs', 'boxes', 'bags', 'bottles', 'cans', 'dozens', 'grams'];

// Condition options
export const SG_CONDITION_OPTIONS = ['New', 'Sealed', 'Opened', 'Like New', 'Refurbished', 'Expired Soon'];

// Price type options
export const SG_PRICE_TYPE_OPTIONS = ['Fixed', 'Negotiable', 'Per Unit', 'Per Kg'];

// Delivery options
export const SG_DELIVERY_OPTIONS = ['Available', 'Not Available', 'Local Only'];

// Packaging type options
export const SG_PACKAGING_TYPE_OPTIONS = ['Bottle', 'Can', 'Box', 'Bag', 'Pouch', 'Jar', 'Tray', 'Bulk', 'Vacuum Sealed', 'Custom'];

// Dietary info options
export const SG_DIETARY_INFO_OPTIONS = ['Organic', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Sugar-Free', 'Halal', 'Kosher', 'Non-GMO', 'None'];

// Storage type options
export const SG_STORAGE_TYPE_OPTIONS = ['Room Temperature', 'Refrigerated', 'Frozen', 'Cool & Dry', 'Ambient'];

// Freshness options
export const SG_FRESHNESS_OPTIONS = ['Fresh', 'Day-Old', 'Frozen', 'Preserved', 'Dried'];

// Common fields for all shopping & groceries subcategories
const SHOPPING_GROCERIES_COMMON_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'quantity', label: 'Quantity', type: 'number', required: true },
  {
    key: 'unit',
    label: 'Unit',
    type: 'select',
    required: true,
    options: SG_QUANTITY_UNIT_OPTIONS,
  },
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    required: false,
    options: SG_CONDITION_OPTIONS,
  },
  { key: 'brand', label: 'Brand', type: 'text', required: false, placeholder: 'e.g., Nestlé, Unilever, Local Brand' },
  { key: 'price', label: 'Price', type: 'number', required: true },
  {
    key: 'priceType',
    label: 'Price Type',
    type: 'select',
    required: true,
    options: SG_PRICE_TYPE_OPTIONS,
  },
  {
    key: 'deliveryAvailable',
    label: 'Delivery',
    type: 'select',
    required: false,
    options: SG_DELIVERY_OPTIONS,
  },
  { key: 'minOrder', label: 'Minimum Order', type: 'text', required: false, placeholder: 'e.g., 5 packs, 2 boxes' },
];

// ─── Subcategory-specific fields ────────────────────────────────────────────────

const PACKAGED_FOODS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'foodType', label: 'Food Type', type: 'select', options: ['Canned Goods', 'Dry Goods', 'Instant Meals', 'Cereals', 'Pasta & Noodles', 'Sauces & Condiments', 'Cooking Oil', 'Flour & Sugar', 'Other'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: SG_PACKAGING_TYPE_OPTIONS },
  { key: 'shelfLife', label: 'Shelf Life', type: 'text', placeholder: 'e.g., 6 months, 1 year' },
  { key: 'dietaryInfo', label: 'Dietary Info', type: 'select', options: SG_DIETARY_INFO_OPTIONS },
];

const BEVERAGES_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'beverageType', label: 'Beverage Type', type: 'select', options: ['Juice', 'Soda', 'Water', 'Energy Drink', 'Tea', 'Coffee', 'Dairy Drink', 'Syrup', 'Other'] },
  { key: 'volume', label: 'Volume', type: 'text', placeholder: 'e.g., 330ml, 1 liter, 2 liters' },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: SG_PACKAGING_TYPE_OPTIONS },
  { key: 'dietaryInfo', label: 'Dietary Info', type: 'select', options: SG_DIETARY_INFO_OPTIONS },
];

const HOUSEHOLD_ITEMS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'itemType', label: 'Item Type', type: 'select', options: ['Kitchenware', 'Storage', 'Disposables', 'Stationery', 'Tools & Hardware', 'Decor', 'Other'] },
  { key: 'material', label: 'Material', type: 'select', options: ['Plastic', 'Metal', 'Glass', 'Wood', 'Ceramic', 'Fabric', 'Bamboo', 'Other'] },
  { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 30x20x15 cm' },
];

const PERSONAL_CARE_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'careType', label: 'Care Type', type: 'select', options: ['Shampoo', 'Soap', 'Toothpaste', 'Lotion', 'Deodorant', 'Razor', 'Hair Care', 'Skin Care', 'Other'] },
  { key: 'skinType', label: 'Skin Type', type: 'select', options: ['All Types', 'Oily', 'Dry', 'Sensitive', 'Combination', 'Normal'] },
  { key: 'volume', label: 'Volume/Weight', type: 'text', placeholder: 'e.g., 250ml, 100g' },
];

const SNACKS_CONFECTIONERY_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'snackType', label: 'Snack Type', type: 'select', options: ['Chips', 'Biscuits', 'Chocolate', 'Candy', 'Nuts', 'Dried Fruits', 'Gum', 'Other'] },
  { key: 'flavor', label: 'Flavor', type: 'text', placeholder: 'e.g., Original, BBQ, Chocolate' },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: SG_PACKAGING_TYPE_OPTIONS },
  { key: 'dietaryInfo', label: 'Dietary Info', type: 'select', options: SG_DIETARY_INFO_OPTIONS },
];

const BABY_PRODUCTS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'productType', label: 'Product Type', type: 'select', options: ['Diapers', 'Baby Food', 'Baby Formula', 'Baby Care', 'Baby Wipes', 'Feeding', 'Other'] },
  { key: 'ageRange', label: 'Age Range', type: 'select', options: ['0-3 months', '3-6 months', '6-12 months', '1-2 years', '2-3 years', '3+ years'] },
  { key: 'safetyCert', label: 'Safety Certification', type: 'select', options: ['Pediatrician Approved', 'ISO Certified', 'Halal Certified', 'Organic Certified', 'None'] },
];

const CLEANING_SUPPLIES_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'cleaningType', label: 'Cleaning Type', type: 'select', options: ['Detergent', 'Dish Soap', 'Floor Cleaner', 'Glass Cleaner', 'Disinfectant', 'Bleach', 'Air Freshener', 'Other'] },
  { key: 'surfaceType', label: 'Surface Type', type: 'select', options: ['All Surfaces', 'Kitchen', 'Bathroom', 'Floor', 'Glass', 'Fabric', 'Other'] },
  { key: 'volume', label: 'Volume/Weight', type: 'text', placeholder: 'e.g., 1 liter, 500g' },
];

const BAKERY_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'bakeryType', label: 'Bakery Type', type: 'select', options: ['Bread', 'Cake', 'Pastry', 'Cookies', 'Naan', 'Roti', 'Other'] },
  { key: 'freshness', label: 'Freshness', type: 'select', options: SG_FRESHNESS_OPTIONS },
  { key: 'allergenInfo', label: 'Allergen Info', type: 'select', options: ['Contains Nuts', 'Contains Gluten', 'Contains Dairy', 'Contains Eggs', 'Nut-Free', 'Gluten-Free', 'None'] },
  { key: 'shelfLife', label: 'Shelf Life', type: 'text', placeholder: 'e.g., 2 days, 1 week' },
];

const FROZEN_FOODS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'foodType', label: 'Food Type', type: 'select', options: ['Frozen Vegetables', 'Frozen Fruits', 'Frozen Meals', 'Ice Cream', 'Frozen Meat', 'Frozen Seafood', 'Frozen Dough', 'Other'] },
  { key: 'storageTemp', label: 'Storage Temperature', type: 'select', options: ['-18°C or below', '-12°C to -18°C', '-6°C to -12°C', 'Other'] },
  { key: 'shelfLife', label: 'Shelf Life', type: 'text', placeholder: 'e.g., 3 months, 6 months' },
];

const DAIRY_EGGS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'dairyType', label: 'Dairy/Egg Type', type: 'select', options: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Eggs', 'Whey', 'Other'] },
  { key: 'fatContent', label: 'Fat Content', type: 'text', placeholder: 'e.g., 3.5%, Full Fat, Low Fat' },
  { key: 'storageType', label: 'Storage Type', type: 'select', options: SG_STORAGE_TYPE_OPTIONS },
  { key: 'shelfLife', label: 'Shelf Life', type: 'text', placeholder: 'e.g., 7 days, 1 month' },
];

const FRUITS_VEGETABLES_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'variety', label: 'Variety', type: 'text', placeholder: 'e.g., Red Apple, Roma Tomato' },
  { key: 'ripeness', label: 'Ripeness', type: 'select', options: ['Unripe', 'Semi-Ripe', 'Ripe', 'Overripe'] },
  { key: 'storageType', label: 'Storage Type', type: 'select', options: SG_STORAGE_TYPE_OPTIONS },
  { key: 'origin', label: 'Origin/Source', type: 'text', placeholder: 'e.g., Local farm, Imported' },
];

const MEAT_SEAFOOD_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'meatType', label: 'Meat/Seafood Type', type: 'select', options: ['Beef', 'Lamb', 'Chicken', 'Fish', 'Shrimp', 'Crab', 'Mutton', 'Other'] },
  { key: 'cutType', label: 'Cut Type', type: 'select', options: ['Whole', 'Fillets', 'Minced', 'Boneless', 'Steaks', 'Chops', 'Wings', 'Other'] },
  { key: 'storageType', label: 'Storage Type', type: 'select', options: ['Fresh/Chilled', 'Frozen', 'Live', 'Smoked/Cured'] },
  { key: 'certification', label: 'Certification', type: 'select', options: ['Halal Certified', 'Organic', 'Free Range', 'Farm Fresh', 'None'] },
];

const SPICES_CONDIMENTS_FIELDS: ShoppingGroceriesSpecField[] = [
  { key: 'spiceType', label: 'Spice/Condiment Type', type: 'select', options: ['Saffron', 'Cumin', 'Coriander', 'Turmeric', 'Cardamom', 'Black Pepper', 'Salt', 'Vinegar', 'Sauce', 'Other'] },
  { key: 'formType', label: 'Form', type: 'select', options: ['Whole', 'Ground', 'Powder', 'Paste', 'Liquid', 'Dried Leaves', 'Other'] },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: SG_PACKAGING_TYPE_OPTIONS },
];

// ─── Spec config: common fields + subcategory-specific fields ───────────────────

export const SHOPPING_GROCERIES_SPEC_CONFIG: Record<ShoppingGroceriesSubcategory, ShoppingGroceriesSpecField[]> = {
  'packaged-foods': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...PACKAGED_FOODS_FIELDS],
  'beverages': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...BEVERAGES_FIELDS],
  'household-items': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...HOUSEHOLD_ITEMS_FIELDS],
  'personal-care': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...PERSONAL_CARE_FIELDS],
  'snacks-confectionery': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...SNACKS_CONFECTIONERY_FIELDS],
  'baby-products': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...BABY_PRODUCTS_FIELDS],
  'cleaning-supplies': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...CLEANING_SUPPLIES_FIELDS],
  'bakery': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...BAKERY_FIELDS],
  'frozen-foods': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...FROZEN_FOODS_FIELDS],
  'dairy-eggs': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...DAIRY_EGGS_FIELDS],
  'fruits-vegetables': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...FRUITS_VEGETABLES_FIELDS],
  'meat-seafood': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...MEAT_SEAFOOD_FIELDS],
  'spices-condiments': [...SHOPPING_GROCERIES_COMMON_FIELDS, ...SPICES_CONDIMENTS_FIELDS],
};

// Helper function to get spec config for a subcategory
export function getShoppingGroceriesSpecsConfig(subcategory: ShoppingGroceriesSubcategory): ShoppingGroceriesSpecField[] {
  return SHOPPING_GROCERIES_SPEC_CONFIG[subcategory] || SHOPPING_GROCERIES_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getShoppingGroceriesFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getShoppingGroceriesOptionTranslationKey(option: string): string {
  return `optionLabels.${option}`;
}
