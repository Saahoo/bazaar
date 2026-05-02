// Debug script to check translation structure
const fs = require('fs');
const path = require('path');

// Load translation files
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));

console.log('Checking translation structure...\n');

// Check if fashion exists
console.log('enTranslations has "common" property?', 'common' in enTranslations);
console.log('enTranslations.common has "fashion" property?', enTranslations.common && 'fashion' in enTranslations.common);

if (enTranslations.common && enTranslations.common.fashion) {
  console.log('\nFashion object keys:', Object.keys(enTranslations.common.fashion));
  
  // Check specific keys
  console.log('\nChecking specific keys:');
  console.log('subcategoryMenClothing exists?', 'subcategoryMenClothing' in enTranslations.common.fashion);
  console.log('subcategoryMenClothing value:', enTranslations.common.fashion.subcategoryMenClothing);
  
  console.log('\nChecking fields:');
  console.log('fields exists?', 'fields' in enTranslations.common.fashion);
  if (enTranslations.common.fashion.fields) {
    console.log('fields.brand exists?', 'brand' in enTranslations.common.fashion.fields);
    console.log('fields.brand value:', enTranslations.common.fashion.fields.brand);
  }
  
  console.log('\nChecking optionLabels:');
  console.log('optionLabels exists?', 'optionLabels' in enTranslations.common.fashion);
  if (enTranslations.common.fashion.optionLabels) {
    console.log('optionLabels.nike exists?', 'nike' in enTranslations.common.fashion.optionLabels);
    console.log('optionLabels.nike value:', enTranslations.common.fashion.optionLabels.nike);
  }
}

// Test the actual key path
console.log('\n--- Testing key path navigation ---');
const key = 'fashion.subcategoryMenClothing';
const parts = key.split('.');
let current = enTranslations;
console.log(`Navigating key: ${key}`);

for (const part of parts) {
  console.log(`  Part: ${part}, exists?`, current && typeof current === 'object' && part in current);
  if (current && typeof current === 'object' && part in current) {
    current = current[part];
  } else {
    current = null;
    break;
  }
}

console.log(`Final value:`, current);

// Now test with "common.fashion.subcategoryMenClothing"
console.log('\n--- Testing with "common.fashion.subcategoryMenClothing" ---');
const key2 = 'common.fashion.subcategoryMenClothing';
const parts2 = key2.split('.');
let current2 = enTranslations;
console.log(`Navigating key: ${key2}`);

for (const part of parts2) {
  console.log(`  Part: ${part}, exists?`, current2 && typeof current2 === 'object' && part in current2);
  if (current2 && typeof current2 === 'object' && part in current2) {
    current2 = current2[part];
  } else {
    current2 = null;
    break;
  }
}

console.log(`Final value:`, current2);