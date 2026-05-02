const fs = require('fs');
const path = require('path');

console.log('=== FINAL VERIFICATION OF VEHICLE FILTER LOCALIZATION ===\n');

// Load all locale files
const locales = ['en', 'fa', 'ps'];
const localeData = {};

for (const locale of locales) {
  const filePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  localeData[locale] = JSON.parse(content);
}

// All keys used in VehicleFilter.tsx
const allKeys = {
  search: [
    'filter', 'any', 'yearRange', 'min', 'max', 'priceRange',
    'kmRange', 'minKm', 'maxKm', 'anyWheelDrive', 'anyColor',
    'anyPlateCity', 'features', 'keywords'
  ],
  vehicles: [
    'vehicleType', 'make', 'model', 'selectMakeFirst', 'engineType',
    'gearType', 'wheelDriveType', 'color', 'numberPlateCity',
    'postalCode', 'enterPostalCode', 'has360Spin', 'sedan', 'suv',
    'van', 'truck', 'pickup', 'hatchback', 'coupe', 'convertible',
    'wagon', 'motorcycle', 'adDetails'
  ],
  common: ['yes', 'no']
};

let allPassed = true;

// Check search keys
console.log('1. Checking search keys:');
for (const key of allKeys.search) {
  const missing = [];
  for (const locale of locales) {
    if (!localeData[locale]?.search?.[key]) {
      missing.push(locale);
    }
  }
  if (missing.length === 0) {
    console.log(`   ✓ search.${key}`);
  } else {
    console.log(`   ✗ search.${key}: missing in ${missing.join(', ')}`);
    allPassed = false;
  }
}

// Check vehicle keys (under common.vehicles)
console.log('\n2. Checking vehicle keys (common.vehicles):');
for (const key of allKeys.vehicles) {
  const missing = [];
  for (const locale of locales) {
    if (!localeData[locale]?.common?.vehicles?.[key]) {
      missing.push(locale);
    }
  }
  if (missing.length === 0) {
    console.log(`   ✓ common.vehicles.${key}`);
  } else {
    console.log(`   ✗ common.vehicles.${key}: missing in ${missing.join(', ')}`);
    allPassed = false;
  }
}

// Check common keys
console.log('\n3. Checking common keys:');
for (const key of allKeys.common) {
  const missing = [];
  for (const locale of locales) {
    if (!localeData[locale]?.common?.[key]) {
      missing.push(locale);
    }
  }
  if (missing.length === 0) {
    console.log(`   ✓ common.${key}`);
  } else {
    console.log(`   ✗ common.${key}: missing in ${missing.join(', ')}`);
    allPassed = false;
  }
}

// Summary
console.log('\n=== SUMMARY ===');
if (allPassed) {
  console.log('✅ SUCCESS: All translation keys are present in all three locales!');
  console.log('The VehicleFilter component is fully localized.');
} else {
  console.log('❌ FAILURE: Some translation keys are missing.');
  console.log('Please add the missing keys to the locale files.');
}

// Also check that we didn't break anything by verifying a few sample values
console.log('\n=== SAMPLE TRANSLATIONS ===');
const sampleKeys = ['search.filter', 'search.any', 'common.vehicles.vehicleType', 'common.vehicles.make'];
for (const keyPath of sampleKeys) {
  const [namespace, ...rest] = keyPath.split('.');
  const key = rest.pop();
  let obj = localeData.en;
  for (const part of [namespace, ...rest]) {
    obj = obj[part];
  }
  console.log(`${keyPath}: "${obj[key]}"`);
}