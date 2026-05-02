// Test script to check Fashion filter localization
const fs = require('fs');
const path = require('path');

// Read the translation files
const enJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const faJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));
const psJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));

console.log('Checking Fashion subcategory translations...\n');

// Check subcategory keys
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

console.log('English translations:');
subcategoryKeys.forEach(key => {
  const value = enJson.common?.fashion?.[key];
  console.log(`  ${key}: ${value || 'MISSING'}`);
});

console.log('\nPersian translations:');
subcategoryKeys.forEach(key => {
  const value = faJson.common?.fashion?.[key];
  console.log(`  ${key}: ${value || 'MISSING'}`);
});

console.log('\nPashto translations:');
subcategoryKeys.forEach(key => {
  const value = psJson.common?.fashion?.[key];
  console.log(`  ${key}: ${value || 'MISSING'}`);
});

// Check some option labels
console.log('\n\nChecking option label translations...');
const optionLabels = ['nike', 'adidas', 'zara', 'casio'];

console.log('English optionLabels:');
optionLabels.forEach(option => {
  const value = enJson.common?.fashion?.optionLabels?.[option];
  console.log(`  ${option}: ${value || 'MISSING'}`);
});

console.log('\nPersian optionLabels:');
optionLabels.forEach(option => {
  const value = faJson.common?.fashion?.optionLabels?.[option];
  console.log(`  ${option}: ${value || 'MISSING'}`);
});

console.log('\nPashto optionLabels:');
optionLabels.forEach(option => {
  const value = psJson.common?.fashion?.optionLabels?.[option];
  console.log(`  ${option}: ${value || 'MISSING'}`);
});

// Check the actual key paths
console.log('\n\nFull key paths for testing:');
subcategoryKeys.forEach(key => {
  console.log(`  tCommon('fashion.${key}')`);
});

optionLabels.forEach(option => {
  console.log(`  tCommon('fashion.optionLabels.${option}')`);
});