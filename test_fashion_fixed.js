const fs = require('fs');
const path = require('path');

// Load translation files
const enCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const faCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));
const psCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));

// Simulate tCommon (translations for 'common' namespace)
function simulateTCommon(locale, key) {
  const translations = locale === 'en' ? enCommon.common : locale === 'fa' ? faCommon.common : psCommon.common;
  
  // Navigate through the object using dot notation
  const parts = key.split('.');
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

// Simulate tFA function (as defined in FilterSidebar.tsx)
function simulateTFA(locale, key) {
  const fullKey = `fashion.${key}`;
  const translated = simulateTCommon(locale, fullKey);
  
  // If translation returns the key itself (no translation found), try to extract a fallback
  if (translated === null || translated === fullKey || translated.includes('fashion.')) {
    // Try to extract a reasonable fallback from the key
    const lastPart = key.split('.').pop() || key;
    // Convert camelCase or snake_case to spaced words
    const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  return translated;
}

// Simulate getFashionFieldLabel
function simulateGetFashionFieldLabel(locale, fieldKey) {
  const translationKey = `fields.${fieldKey}`;
  return simulateTFA(locale, translationKey);
}

// Test field labels that should exist
const testFields = [
  'clothingType',
  'gender',
  'size',
  'fitType',
  'color',
  'brand',
  'material',
  'pattern',
  'season',
  'occasion',
  'authenticity',
  'warranty',
  'shoeType',
  'bagType',
  'closureType',
  'strapType',
  'waterproof',
  'type',
  'style',
  'displayType'
];

console.log('=== Testing Fashion Field Labels Localization ===\n');

for (const locale of ['en', 'fa', 'ps']) {
  console.log(`Locale: ${locale}`);
  console.log('='.repeat(40));
  
  let foundCount = 0;
  for (const field of testFields) {
    const label = simulateGetFashionFieldLabel(locale, field);
    const directLookup = simulateTCommon(locale, `fashion.fields.${field}`);
    const found = directLookup !== null;
    
    if (found) {
      console.log(`✅ ${field}: "${label}"`);
      foundCount++;
    } else {
      console.log(`❌ ${field}: NOT FOUND (shows as "${label}")`);
    }
  }
  
  console.log(`\nTotal found: ${foundCount}/${testFields.length}`);
  console.log('\n');
}

// Test option labels
console.log('=== Testing Fashion Option Labels ===\n');
const testOptions = ['nike', 'adidas', 's', 'm', 'l', 'new', 'used', 'casio'];

for (const locale of ['en', 'fa', 'ps']) {
  console.log(`Locale: ${locale}`);
  for (const option of testOptions) {
    const translationKey = `optionLabels.${option}`;
    const translated = simulateTFA(locale, translationKey);
    const directLookup = simulateTCommon(locale, `fashion.optionLabels.${option}`);
    if (directLookup !== null) {
      console.log(`✅ ${option}: "${translated}"`);
    } else {
      console.log(`❌ ${option}: NOT FOUND (shows as "${translated}")`);
    }
  }
  console.log();
}

// Test subcategory labels
console.log('=== Testing Fashion Subcategory Labels ===\n');
const testSubcategories = [
  'subcategoryMenClothing',
  'subcategoryWomenClothing',
  'subcategoryKidsClothing',
  'subcategoryShoes',
  'subcategoryBags',
  'subcategoryAccessories',
  'subcategoryWatches',
  'subcategoryJewelry'
];

for (const locale of ['en', 'fa', 'ps']) {
  console.log(`Locale: ${locale}`);
  for (const sub of testSubcategories) {
    const translated = simulateTFA(locale, sub);
    const directLookup = simulateTCommon(locale, `fashion.${sub}`);
    if (directLookup !== null) {
      console.log(`✅ ${sub}: "${translated}"`);
    } else {
      console.log(`❌ ${sub}: NOT FOUND (shows as "${translated}")`);
    }
  }
  console.log();
}