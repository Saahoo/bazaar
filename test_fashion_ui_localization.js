const fs = require('fs');
const path = require('path');

// Load translation files
const enCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const faCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));
const psCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));

// Simulate tFA function
function simulateTFA(locale, key) {
  const translations = locale === 'en' ? enCommon : locale === 'fa' ? faCommon : psCommon;
  const fullKey = `fashion.${key}`;
  
  // Navigate through the object using dot notation
  const parts = fullKey.split('.');
  let current = translations;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null; // Not found
    }
  }
  return typeof current === 'string' ? current : null;
}

// Simulate getFashionFieldLabel
function simulateGetFashionFieldLabel(locale, fieldKey) {
  const translationKey = `fields.${fieldKey}`;
  const translated = simulateTFA(locale, translationKey);
  return translated || fieldKey;
}

// Test field labels
const testFields = [
  'clothingType',
  'gender',
  'size',
  'fitType',
  'color',
  'brand',
  'material',
  'pattern',
  'sleeveLength',
  'neckline',
  'waistType',
  'length',
  'occasion',
  'season',
  'closureType',
  'heelHeight',
  'shoeType',
  'bagType',
  'strapType',
  'watchType',
  'jewelryType',
  'gemstone',
  'metal',
  'sizeType',
  'ageGroup',
  'condition',
  'authenticity',
  'warranty',
  'package',
  'customizable',
  'madeIn',
  'careInstructions',
  'sustainability',
  'collection',
  'limitedEdition',
  'vintage',
  'athleisure',
  'formal',
  'casual',
  'workwear',
  'swimwear',
  'underwear',
  'sleepwear',
  'accessoryType',
  'technology'
];

console.log('=== Testing Fashion Field Labels Localization ===\n');

for (const locale of ['en', 'fa', 'ps']) {
  console.log(`Locale: ${locale}`);
  console.log('='.repeat(40));
  
  let missingCount = 0;
  for (const field of testFields) {
    const label = simulateGetFashionFieldLabel(locale, field);
    const found = label !== field; // If label is different from field key, translation was found
    
    if (!found) {
      console.log(`❌ ${field}: NOT LOCALIZED (shows as "${field}")`);
      missingCount++;
    } else {
      console.log(`✅ ${field}: "${label}"`);
    }
  }
  
  console.log(`\nTotal missing: ${missingCount}/${testFields.length}`);
  console.log('\n');
}

// Also test some option labels
console.log('=== Testing Fashion Option Labels ===\n');
const testOptions = ['nike', 'adidas', 's', 'm', 'l', 'new', 'used', 'casio'];

for (const locale of ['en', 'fa', 'ps']) {
  console.log(`Locale: ${locale}`);
  for (const option of testOptions) {
    const translationKey = `optionLabels.${option}`;
    const translated = simulateTFA(locale, translationKey);
    if (translated) {
      console.log(`✅ ${option}: "${translated}"`);
    } else {
      console.log(`❌ ${option}: NOT FOUND`);
    }
  }
  console.log();
}