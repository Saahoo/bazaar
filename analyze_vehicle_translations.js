const fs = require('fs');
const path = require('path');

// Read VehicleFilter.tsx
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const vehicleFilterContent = fs.readFileSync(vehicleFilterPath, 'utf8');

// Extract all translation calls
const translationCalls = [];

// Find t('...') calls
const tRegex = /t\(['"]([^'"]+)['"]\)/g;
let match;
while ((match = tRegex.exec(vehicleFilterContent)) !== null) {
  translationCalls.push({
    type: 't',
    key: match[1],
    fullMatch: match[0],
    line: vehicleFilterContent.substring(0, match.index).split('\n').length
  });
}

// Find tVH('...') calls
const tVHRegex = /tVH\(['"]([^'"]+)['"]\)/g;
while ((match = tVHRegex.exec(vehicleFilterContent)) !== null) {
  translationCalls.push({
    type: 'tVH',
    key: match[1],
    fullMatch: match[0],
    line: vehicleFilterContent.substring(0, match.index).split('\n').length
  });
}

// Read locale files
const locales = ['en', 'fa', 'ps'];
const localeData = {};

for (const locale of locales) {
  const localePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  const localeContent = fs.readFileSync(localePath, 'utf8');
  localeData[locale] = JSON.parse(localeContent);
}

// Helper to check if key exists in locale data
function keyExists(key, type) {
  const fullKey = type === 'tVH' ? `vehicles.${key}` : key;
  const parts = fullKey.split('.');
  
  let current = localeData.en; // Check English as reference
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  return typeof current === 'string';
}

// Analyze each translation call
console.log('=== VehicleFilter Translation Key Analysis ===\n');
console.log(`Found ${translationCalls.length} translation calls in VehicleFilter.tsx\n`);

const missingKeys = [];
const foundKeys = [];

for (const call of translationCalls) {
  const exists = keyExists(call.key, call.type);
  if (exists) {
    foundKeys.push(call);
  } else {
    missingKeys.push(call);
  }
}

// Print results
if (foundKeys.length > 0) {
  console.log('✅ Found translation keys:');
  foundKeys.forEach(call => {
    const fullKey = call.type === 'tVH' ? `vehicles.${call.key}` : call.key;
    console.log(`  Line ${call.line}: ${call.fullMatch} -> "${fullKey}"`);
  });
  console.log('');
}

if (missingKeys.length > 0) {
  console.log('❌ Missing translation keys:');
  missingKeys.forEach(call => {
    const fullKey = call.type === 'tVH' ? `vehicles.${call.key}` : call.key;
    console.log(`  Line ${call.line}: ${call.fullMatch} -> "${fullKey}"`);
  });
  console.log('');
}

// Also check for the specific keys mentioned in the user's request
const requiredKeys = [
  'any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity',
  'vehicleType', 'make', 'model', 'yearRange', 'priceRange',
  'mileageRange', 'plateCity', 'postalCode', 'features', 'has360Spin'
];

console.log('=== Required Keys Validation ===\n');
console.log('Checking keys from user request:');

const missingRequiredKeys = [];
for (const key of requiredKeys) {
  // Determine if it's a t() or tVH() key
  // Based on VehicleFilter.tsx, some are t() and some are tVH()
  let exists = false;
  
  // Check common namespace first
  if (keyExists(key, 't')) {
    exists = true;
  } else if (keyExists(key, 'tVH')) {
    exists = true;
  }
  
  if (exists) {
    console.log(`  ✅ ${key}`);
  } else {
    console.log(`  ❌ ${key}`);
    missingRequiredKeys.push(key);
  }
}

console.log('\n=== Summary ===');
console.log(`Total translation calls: ${translationCalls.length}`);
console.log(`Found keys: ${foundKeys.length}`);
console.log(`Missing keys: ${missingKeys.length}`);
console.log(`Required keys missing: ${missingRequiredKeys.length}`);

if (missingKeys.length > 0 || missingRequiredKeys.length > 0) {
  console.log('\n⚠️  Some translation keys are missing!');
  process.exit(1);
} else {
  console.log('\n✅ All translation keys are present!');
  process.exit(0);
}