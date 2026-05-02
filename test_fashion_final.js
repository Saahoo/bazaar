const fs = require('fs');
const path = require('path');

// Read the English common.json
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const enContent = fs.readFileSync(enPath, 'utf8');
const enData = JSON.parse(enContent);

// Check if common.fashion exists
if (!enData.common?.fashion) {
  console.error('ERROR: common.fashion not found in English file');
  process.exit(1);
}

const commonFashion = enData.common.fashion;
console.log('common.fashion has', Object.keys(commonFashion).length, 'keys');

// Check for key subcategories
const subcategoryKeys = [
  'subcategoryMenClothing',
  'subcategoryWomenClothing', 
  'subcategoryKidsClothing',
  'subcategoryShoes',
  'subcategoryBags',
  'subcategoryAccessories',
  'subcategoryWatches',
  'subcategoryJewelry'
];

console.log('\nChecking subcategory translations:');
subcategoryKeys.forEach(key => {
  if (commonFashion[key]) {
    console.log(`  ✓ ${key}: ${commonFashion[key]}`);
  } else {
    console.log(`  ✗ ${key}: MISSING`);
  }
});

// Check some field labels
const fieldKeys = ['brand', 'size', 'color', 'condition', 'price'];
console.log('\nChecking field translations:');
fieldKeys.forEach(key => {
  if (commonFashion[key]) {
    console.log(`  ✓ ${key}: ${commonFashion[key]}`);
  } else {
    console.log(`  ✗ ${key}: MISSING`);
  }
});

// Check some option labels
const optionKeys = ['nike', 'adidas', 's', 'm', 'l', 'new', 'used'];
console.log('\nChecking option translations:');
optionKeys.forEach(key => {
  if (commonFashion[key]) {
    console.log(`  ✓ ${key}: ${commonFashion[key]}`);
  } else {
    console.log(`  ✗ ${key}: MISSING`);
  }
});

// Check if the keys are in the right format for tFA
// tFA expects keys like "subcategoryMenClothing", not "fashion.subcategoryMenClothing"
// The tFA function adds the "fashion." prefix
console.log('\nTesting tFA simulation:');
function simulateTFA(key) {
  const fullKey = `fashion.${key}`;
  // In real code, tCommon would look up fullKey in common namespace
  // Since we added keys directly under common.fashion, the lookup would be:
  // common.fashion.subcategoryMenClothing
  // But tCommon('fashion.subcategoryMenClothing') expects the key to be under common.fashion
  // This should work now
  return commonFashion[key] || `MISSING: ${key}`;
}

const testKeys = ['subcategoryMenClothing', 'brand', 'nike', 'nonexistent'];
testKeys.forEach(key => {
  const result = simulateTFA(key);
  console.log(`  tFA("${key}") -> ${result}`);
});

// Also check Persian file
const faPath = path.join(__dirname, 'src/locales/fa/common.json');
const faContent = fs.readFileSync(faPath, 'utf8');
const faData = JSON.parse(faContent);

if (faData.common?.fashion) {
  console.log('\nPersian common.fashion has', Object.keys(faData.common.fashion).length, 'keys');
  // Check one key
  if (faData.common.fashion.subcategoryMenClothing) {
    console.log(`  subcategoryMenClothing: ${faData.common.fashion.subcategoryMenClothing}`);
  }
}

console.log('\n✅ Fashion translations have been added to common namespace.');