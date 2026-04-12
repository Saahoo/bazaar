export type FashionSubcategory =
  | 'men-clothing'
  | 'women-clothing'
  | 'kids-clothing'
  | 'shoes'
  | 'bags'
  | 'accessories'
  | 'watches'
  | 'jewelry';

export interface FashionSubcategoryOption {
  value: FashionSubcategory;
  label: string;
}

export type FashionSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle';

export interface FashionSpecField {
  key: string;
  label: string;
  type: FashionSpecFieldType;
  required?: boolean;
  options?: string[];
}

export const FASHION_SUBCATEGORIES: FashionSubcategoryOption[] = [
  { value: 'men-clothing', label: 'Men Clothing' },
  { value: 'women-clothing', label: 'Women Clothing' },
  { value: 'kids-clothing', label: 'Kids Clothing' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'watches', label: 'Watches' },
  { value: 'jewelry', label: 'Jewelry' },
];

export const FASHION_BRANDS_BY_SUBCATEGORY: Record<FashionSubcategory, string[]> = {
  'men-clothing': ['Nike', 'Adidas', 'Levis', 'Zara', 'H&M'],
  'women-clothing': ['Zara', 'H&M', 'Mango', 'Gucci', 'Prada'],
  'kids-clothing': ['Carter\'s', 'Gap Kids', 'H&M Kids', 'Next'],
  shoes: ['Nike', 'Adidas', 'Puma', 'Skechers', 'Bata'],
  bags: ['Samsonite', 'Michael Kors', 'Coach', 'Gucci', 'Local Brand'],
  accessories: ['Ray-Ban', 'Nike', 'Adidas', 'Local Brand'],
  watches: ['Casio', 'Fossil', 'Rolex', 'Omega', 'Apple'],
  jewelry: ['Tiffany', 'Cartier', 'Pandora', 'Local Brand'],
};

const CLOTHING_COMMON_FIELDS: FashionSpecField[] = [
  { key: 'clothingType', label: 'Clothing Type', type: 'select', required: true, options: ['T-shirt', 'Shirt', 'Jeans', 'Dress', 'Jacket', 'Hoodie'] },
  { key: 'gender', label: 'Gender', type: 'select', required: true, options: ['Men', 'Women', 'Kids', 'Unisex'] },
  { key: 'size', label: 'Size', type: 'select', required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'] },
  { key: 'fitType', label: 'Fit Type', type: 'select', options: ['Slim', 'Regular', 'Oversized'] },
  { key: 'color', label: 'Color', type: 'multiselect', required: true, options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Brown'] },
  { key: 'material', label: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Wool', 'Denim', 'Leather', 'Silk', 'Linen'] },
  { key: 'sleeveType', label: 'Sleeve Type', type: 'select', options: ['Short', 'Long', 'Sleeveless'] },
  { key: 'pattern', label: 'Pattern', type: 'select', options: ['Solid', 'Printed', 'Striped', 'Checked'] },
  { key: 'season', label: 'Season', type: 'select', options: ['Summer', 'Winter', 'All Season'] },
  { key: 'occasion', label: 'Occasion', type: 'select', options: ['Casual', 'Formal', 'Party', 'Sportswear'] },
  { key: 'authenticity', label: 'Authenticity', type: 'select', options: ['Original', 'Replica'] },
  { key: 'warranty', label: 'Warranty', type: 'text' },
  { key: 'tagsAvailable', label: 'Tags Available', type: 'toggle' },
];

export const FASHION_SPEC_CONFIG: Record<FashionSubcategory, FashionSpecField[]> = {
  'men-clothing': CLOTHING_COMMON_FIELDS,
  'women-clothing': CLOTHING_COMMON_FIELDS,
  'kids-clothing': CLOTHING_COMMON_FIELDS,
  shoes: [
    { key: 'brand', label: 'Brand', type: 'select', required: true, options: FASHION_BRANDS_BY_SUBCATEGORY.shoes },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'shoeType', label: 'Shoe Type', type: 'select', required: true, options: ['Sneakers', 'Formal', 'Boots', 'Sandals', 'Heels', 'Sports'] },
    { key: 'gender', label: 'Gender', type: 'select', required: true, options: ['Men', 'Women', 'Unisex'] },
    { key: 'size', label: 'Size', type: 'text', required: true },
    { key: 'color', label: 'Color', type: 'multiselect', options: ['Black', 'White', 'Blue', 'Red', 'Brown', 'Grey'] },
    { key: 'material', label: 'Material', type: 'select', options: ['Leather', 'Synthetic', 'Mesh', 'Canvas'] },
    { key: 'condition', label: 'Condition', type: 'select', required: true, options: ['New', 'Used'] },
    { key: 'originalBox', label: 'Original Box', type: 'toggle' },
    { key: 'warranty', label: 'Warranty', type: 'text' },
    { key: 'usageType', label: 'Usage Type', type: 'select', options: ['Running', 'Casual', 'Formal', 'Hiking'] },
  ],
  bags: [
    { key: 'brand', label: 'Brand', type: 'select', required: true, options: FASHION_BRANDS_BY_SUBCATEGORY.bags },
    { key: 'bagType', label: 'Bag Type', type: 'select', required: true, options: ['Handbag', 'Backpack', 'Travel Bag', 'Laptop Bag', 'Wallet'] },
    { key: 'material', label: 'Material', type: 'select', options: ['Leather', 'Synthetic', 'Canvas', 'Nylon'] },
    { key: 'color', label: 'Color', type: 'multiselect', options: ['Black', 'White', 'Blue', 'Red', 'Brown', 'Beige'] },
    { key: 'size', label: 'Size', type: 'select', options: ['Small', 'Medium', 'Large'] },
    { key: 'closureType', label: 'Closure Type', type: 'select', options: ['Zipper', 'Magnetic', 'Buckle'] },
    { key: 'strapType', label: 'Strap Type', type: 'select', options: ['Single', 'Double', 'Adjustable'] },
    { key: 'waterproof', label: 'Waterproof', type: 'toggle' },
    { key: 'authenticity', label: 'Authenticity', type: 'select', options: ['Original', 'Replica'] },
    { key: 'warranty', label: 'Warranty', type: 'text' },
  ],
  accessories: [
    { key: 'type', label: 'Type', type: 'select', required: true, options: ['Belt', 'Hat', 'Sunglasses', 'Scarf'] },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'color', label: 'Color', type: 'multiselect', options: ['Black', 'White', 'Blue', 'Red', 'Brown', 'Grey'] },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
    { key: 'style', label: 'Style', type: 'select', options: ['Casual', 'Formal'] },
    { key: 'warranty', label: 'Warranty', type: 'text' },
  ],
  watches: [
    { key: 'brand', label: 'Brand', type: 'select', required: true, options: FASHION_BRANDS_BY_SUBCATEGORY.watches },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
    { key: 'displayType', label: 'Display Type', type: 'select', options: ['Analog', 'Digital', 'Smart'] },
    { key: 'strapMaterial', label: 'Strap Material', type: 'text' },
    { key: 'dialShape', label: 'Dial Shape', type: 'select', options: ['Round', 'Square', 'Rectangle'] },
    { key: 'movement', label: 'Movement', type: 'select', options: ['Quartz', 'Automatic'] },
    { key: 'waterResistant', label: 'Water Resistant', type: 'toggle' },
    { key: 'originalBox', label: 'Original Box', type: 'toggle' },
    { key: 'warranty', label: 'Warranty', type: 'text' },
  ],
  jewelry: [
    { key: 'type', label: 'Type', type: 'select', required: true, options: ['Ring', 'Necklace', 'Bracelet', 'Earrings'] },
    { key: 'material', label: 'Material', type: 'select', options: ['Gold', 'Silver', 'Diamond', 'Platinum', 'Artificial'] },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
    { key: 'size', label: 'Size', type: 'text' },
    { key: 'stoneType', label: 'Stone Type', type: 'text' },
    { key: 'certification', label: 'Certification', type: 'toggle' },
    { key: 'authenticity', label: 'Authenticity', type: 'select', options: ['Original', 'Replica'] },
    { key: 'warranty', label: 'Warranty', type: 'text' },
  ],
};

const AUTO_GENDER_BY_SUBCATEGORY: Partial<Record<FashionSubcategory, string>> = {
  'men-clothing': 'Men',
  'women-clothing': 'Women',
  'kids-clothing': 'Kids',
};

export const getFashionSpecsConfig = (subcategory: FashionSubcategory | ''): FashionSpecField[] => {
  if (!subcategory) return [];
  return FASHION_SPEC_CONFIG[subcategory] || [];
};

export const getDefaultGenderForFashionSubcategory = (subcategory: FashionSubcategory | ''): string => {
  if (!subcategory) return '';
  return AUTO_GENDER_BY_SUBCATEGORY[subcategory] || '';
};

export const isFashionClothingSubcategory = (subcategory: FashionSubcategory | ''): boolean => {
  return subcategory === 'men-clothing' || subcategory === 'women-clothing' || subcategory === 'kids-clothing';
};
