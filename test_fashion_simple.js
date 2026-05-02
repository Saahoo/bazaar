// Simple test script to check Fashion filter localization
const fs = require('fs');
const path = require('path');

// Load translation files
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const psTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));
const faTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));

// Helper function to get translation
function getTranslation(lang, key) {
  const translations = lang === 'ps' ? psTranslations : lang === 'fa' ? faTranslations : enTranslations;
  
  // Split key by dots
  const parts = key.split('.');
  let current = translations;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return typeof current === 'string' ? current : null;
}

// Simulate tFA function
function tFA(key, lang = 'en') {
  const fullKey = `fashion.${key}`;
  const translated = getTranslation(lang, fullKey);
  
  if (!translated) {
    // Fallback logic similar to the actual tFA function
    const lastPart = key.split('.').pop() || key;
    const words = lastPart.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  
  return translated;
}

// Test cases
const testCases = [
  // Subcategory keys
  { key: 'subcategoryMenClothing', expectedEn: 'Men Clothing' },
  { key: 'subcategoryWomenClothing', expectedEn: 'Women Clothing' },
  { key: 'subcategoryKidsClothing', expectedEn: 'Kids Clothing' },
  { key: 'subcategoryShoes', expectedEn: 'Shoes' },
  { key: 'subcategoryBags', expectedEn: 'Bags' },
  { key: 'subcategoryAccessories', expectedEn: 'Accessories' },
  { key: 'subcategoryWatches', expectedEn: 'Watches' },
  { key: 'subcategoryJewelry', expectedEn: 'Jewelry' },
  
  // Field labels
  { key: 'fields.brand', expectedEn: 'Brand' },
  { key: 'fields.size', expectedEn: 'Size' },
  { key: 'fields.color', expectedEn: 'Color' },
  { key: 'fields.condition', expectedEn: 'Condition' },
  
  // Option labels
  { key: 'optionLabels.nike', expectedEn: 'Nike' },
  { key: 'optionLabels.adidas', expectedEn: 'Adidas' },
  { key: 'optionLabels.casio', expectedEn: 'Casio' },
  { key: 'optionLabels.new', expectedEn: 'New' },
  { key: 'optionLabels.used', expectedEn: 'Used' },
  { key: 'optionLabels.individual', expectedEn: 'Individual' },
  { key: 'optionLabels.dealer', expectedEn: 'Dealer' },
];

console.log('Testing Fashion filter localization...\n');

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = tFA(test.key, 'en');
  const status = result === test.expectedEn ? '✓' : '✗';
  
  if (result === test.expectedEn) {
    passed++;
    console.log(`${status} ${test.key}: "${result}"`);
  } else {
    failed++;
    console.log(`${status} ${test.key}: Expected "${test.expectedEn}", got "${result}"`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);

// Also test Persian and Pashto translations
console.log('\n--- Testing Persian translations ---');
for (const test of testCases.slice(0, 8)) { // Just test subcategories
  const result = tFA(test.key, 'fa');
  console.log(`  ${test.key}: "${result}"`);
}

console.log('\n--- Testing Pashto translations ---');
for (const test of testCases.slice(0, 8)) { // Just test subcategories
  const result = tFA(test.key, 'ps');
  console.log(`  ${test.key}: "${result}"`);
}

// Check if keys exist in translation files
console.log('\n--- Checking key existence in translation files ---');
for (const test of testCases) {
  const enExists = getTranslation('en', `fashion.${test.key}`) !== null;
  const faExists = getTranslation('fa', `fashion.${test.key}`) !== null;
  const psExists = getTranslation('ps', `fashion.${test.key}`) !== null;
  
  console.log(`${test.key}: EN=${enExists ? '✓' : '✗'} FA=${faExists ? '✓' : '✗'} PS=${psExists ? '✓' : '✗'}`);
}