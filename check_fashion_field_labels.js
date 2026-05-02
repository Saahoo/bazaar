const fs = require('fs');
const path = require('path');

// Read the English common.json
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const enContent = fs.readFileSync(enPath, 'utf8');
const enData = JSON.parse(enContent);

const commonFashion = enData.common?.fashion;
if (!commonFashion) {
  console.error('common.fashion not found');
  process.exit(1);
}

// Field keys from FASHION_SPEC_CONFIG that need translation
const fieldKeys = [
  'clothingType',
  'gender',
  'size',
  'fitType',
  'color',
  'material',
  'sleeveType',
  'pattern',
  'season',
  'occasion',
  'authenticity',
  'warranty',
  'tagsAvailable',
  'model',
  'shoeType',
  'originalBox',
  'usageType',
  'bagType',
  'closureType',
  'strapType',
  'waterproof',
  'type',
  'style',
  'displayType',
  'strapMaterial',
  'dialShape',
  'movement',
  'waterResistant',
  'stoneType',
  'certification'
];

console.log('Checking field label translations in common.fashion:\n');

let missingCount = 0;
fieldKeys.forEach(key => {
  // The translation key would be the key itself (not fields.key) because we flattened fields object
  if (commonFashion[key]) {
    console.log(`✅ ${key}: "${commonFashion[key]}"`);
  } else {
    console.log(`❌ ${key}: MISSING`);
    missingCount++;
  }
});

console.log(`\nTotal missing: ${missingCount} out of ${fieldKeys.length}`);

// Also check if these exist under fields.* format
console.log('\nChecking fields.* format:');
const fieldsObject = enData.postAd?.fashion?.fields;
if (fieldsObject) {
  fieldKeys.forEach(key => {
    if (fieldsObject[key]) {
      console.log(`  fields.${key}: "${fieldsObject[key]}"`);
    }
  });
}

// Check what getFashionFieldTranslationKey returns
console.log('\nSimulating getFashionFieldTranslationKey:');
fieldKeys.slice(0, 5).forEach(key => {
  const translationKey = `fields.${key}`;
  console.log(`  ${key} -> ${translationKey}`);
  
  // Check if this exists in common.fashion (it won't because we flattened)
  if (commonFashion[translationKey]) {
    console.log(`    Found as "${commonFashion[translationKey]}"`);
  } else {
    console.log(`    Not found in common.fashion`);
  }
});

console.log('\n=== ISSUE ANALYSIS ===');
console.log('The problem is that getFashionFieldLabel uses getFashionFieldTranslationKey which returns "fields.clothingType".');
console.log('But in common.fashion, we flattened the fields object, so the key is just "clothingType", not "fields.clothingType".');
console.log('We need to either:');
console.log('1. Change getFashionFieldTranslationKey to return just the field key (not prefixed with "fields.")');
console.log('2. Or keep the nested structure in common.fashion (fields: { clothingType: "Clothing Type", ... })');
console.log('Option 2 is better for consistency with postAd.fashion structure.');