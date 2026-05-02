const fs = require('fs');
const path = require('path');

// Load translation file
const enCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));

// Get all field keys from fashion-wizard.ts (based on the code I saw)
const fieldKeys = [
  'clothingType', 'gender', 'size', 'fitType', 'color', 'material', 'sleeveType', 'pattern',
  'season', 'occasion', 'authenticity', 'warranty', 'tagsAvailable', 'model', 'shoeType',
  'originalBox', 'usageType', 'bagType', 'closureType', 'strapType', 'waterproof', 'type',
  'style', 'displayType', 'strapMaterial', 'dialShape', 'movement', 'waterResistant',
  'stoneType', 'certification', 'brand', 'condition', 'authenticity'
];

console.log('=== Checking Fashion Field Translation Coverage ===\n');

const fashionFields = enCommon.common?.fashion?.fields || {};
console.log(`Total fields in translation file: ${Object.keys(fashionFields).length}`);

let missing = [];
let found = [];

for (const key of fieldKeys) {
  if (key in fashionFields) {
    found.push(key);
  } else {
    missing.push(key);
  }
}

console.log(`\nFound ${found.length}/${fieldKeys.length} fields:`);
found.forEach(key => {
  console.log(`  ✅ ${key}: "${fashionFields[key]}"`);
});

console.log(`\nMissing ${missing.length}/${fieldKeys.length} fields:`);
missing.forEach(key => {
  console.log(`  ❌ ${key}`);
});

// Check option labels coverage for common options
console.log('\n=== Checking Option Labels Coverage ===\n');
const optionLabels = enCommon.common?.fashion?.optionLabels || {};

// Common options from fashion-wizard.ts
const commonOptions = [
  'T-shirt', 'Shirt', 'Jeans', 'Dress', 'Jacket', 'Hoodie',
  'Men', 'Women', 'Kids', 'Unisex',
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom',
  'Slim', 'Regular', 'Oversized',
  'Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Brown', 'Beige',
  'Cotton', 'Polyester', 'Wool', 'Denim', 'Leather', 'Silk', 'Linen',
  'Short', 'Long', 'Sleeveless',
  'Solid', 'Printed', 'Striped', 'Checked',
  'Summer', 'Winter', 'All Season',
  'Casual', 'Formal', 'Party', 'Sportswear',
  'Original', 'Replica',
  'New', 'Used',
  'Sneakers', 'Formal', 'Boots', 'Sandals', 'Heels', 'Sports',
  'Handbag', 'Backpack', 'Travel Bag', 'Laptop Bag', 'Wallet',
  'Leather', 'Synthetic', 'Mesh', 'Canvas', 'Nylon',
  'Small', 'Medium', 'Large',
  'Zipper', 'Magnetic', 'Buckle',
  'Single', 'Double', 'Adjustable',
  'Belt', 'Hat', 'Sunglasses', 'Scarf',
  'Analog', 'Digital', 'Smart',
  'Round', 'Square', 'Rectangle',
  'Quartz', 'Automatic',
  'Ring', 'Necklace', 'Bracelet', 'Earrings',
  'Gold', 'Silver', 'Diamond', 'Platinum', 'Artificial'
];

console.log(`Total option labels in translation file: ${Object.keys(optionLabels).length}`);

let missingOptions = [];
let foundOptions = [];

for (const option of commonOptions) {
  // Normalize the option key (same logic as getFashionOptionTranslationKey)
  const normalized = option
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\//g, '_')
    .replace(/[()]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  if (normalized in optionLabels) {
    foundOptions.push(option);
  } else {
    missingOptions.push(option);
  }
}

console.log(`\nFound ${foundOptions.length}/${commonOptions.length} option labels`);
console.log(`Missing ${missingOptions.length}/${commonOptions.length} option labels`);

if (missingOptions.length > 0) {
  console.log('\nMissing option labels:');
  missingOptions.slice(0, 20).forEach(option => {
    console.log(`  ❌ ${option}`);
  });
  if (missingOptions.length > 20) {
    console.log(`  ... and ${missingOptions.length - 20} more`);
  }
}