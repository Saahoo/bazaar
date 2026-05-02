const fs = require('fs');
const path = require('path');

// Read the VehicleFilter.tsx file
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const vehicleFilterContent = fs.readFileSync(vehicleFilterPath, 'utf8');

// Extract all translation keys used in the component
const searchKeys = new Set();
const vehicleKeys = new Set();
const commonKeys = new Set();

// Patterns for translation function calls
const tSearchPattern = /tSearch\(['"]([^'"]+)['"]\)/g;
const tVHPattern = /tVH\(['"]([^'"]+)['"]\)/g;
const tCommonPattern = /tCommon\(['"]([^'"]+)['"]\)/g;

let match;
while ((match = tSearchPattern.exec(vehicleFilterContent)) !== null) {
  searchKeys.add(match[1]);
}

while ((match = tVHPattern.exec(vehicleFilterContent)) !== null) {
  vehicleKeys.add(match[1]);
}

while ((match = tCommonPattern.exec(vehicleFilterContent)) !== null) {
  commonKeys.add(match[1]);
}

console.log('Search keys used in VehicleFilter.tsx:');
console.log(Array.from(searchKeys).sort());
console.log('\nVehicle keys used in VehicleFilter.tsx:');
console.log(Array.from(vehicleKeys).sort());
console.log('\nCommon keys used in VehicleFilter.tsx:');
console.log(Array.from(commonKeys).sort());

// Load locale files
const locales = ['en', 'fa', 'ps'];
const localeData = {};

for (const locale of locales) {
  const localePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  const content = fs.readFileSync(localePath, 'utf8');
  localeData[locale] = JSON.parse(content);
}

// Helper function to check if a key exists in a nested object
function keyExists(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  return current !== undefined;
}

// Check search keys
console.log('\n=== Checking Search Keys ===');
const missingKeys = {};

for (const key of searchKeys) {
  const keyPath = `search.${key}`;
  const missing = [];
  for (const locale of locales) {
    if (!keyExists(localeData[locale], keyPath)) {
      missing.push(locale);
    }
  }
  if (missing.length > 0) {
    missingKeys[keyPath] = missing;
    console.log(`❌ ${keyPath}: missing in ${missing.join(', ')}`);
  } else {
    console.log(`✓ ${keyPath}: present in all locales`);
  }
}

// Check vehicle keys (these are under common.vehicles.*)
console.log('\n=== Checking Vehicle Keys ===');
for (const key of vehicleKeys) {
  const keyPath = `common.vehicles.${key}`;
  const missing = [];
  for (const locale of locales) {
    if (!keyExists(localeData[locale], keyPath)) {
      missing.push(locale);
    }
  }
  if (missing.length > 0) {
    missingKeys[keyPath] = missing;
    console.log(`❌ ${keyPath}: missing in ${missing.join(', ')}`);
  } else {
    console.log(`✓ ${keyPath}: present in all locales`);
  }
}

// Check common keys
console.log('\n=== Checking Common Keys ===');
for (const key of commonKeys) {
  const keyPath = `common.${key}`;
  const missing = [];
  for (const locale of locales) {
    if (!keyExists(localeData[locale], keyPath)) {
      missing.push(locale);
    }
  }
  if (missing.length > 0) {
    missingKeys[keyPath] = missing;
    console.log(`❌ ${keyPath}: missing in ${missing.join(', ')}`);
  } else {
    console.log(`✓ ${keyPath}: present in all locales`);
  }
}

// Summary
console.log('\n=== SUMMARY ===');
if (Object.keys(missingKeys).length === 0) {
  console.log('✅ All translation keys are present in all three locales!');
} else {
  console.log(`❌ Found ${Object.keys(missingKeys).length} missing keys:`);
  for (const [key, missingLocales] of Object.entries(missingKeys)) {
    console.log(`  - ${key}: missing in ${missingLocales.join(', ')}`);
  }
}