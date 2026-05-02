const fs = require('fs');
const path = require('path');

// Read the VehicleFilter.tsx file
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const vehicleFilterContent = fs.readFileSync(vehicleFilterPath, 'utf8');

// Read locale files
const enLocalePath = path.join(__dirname, 'src/locales/en/common.json');
const faLocalePath = path.join(__dirname, 'src/locales/fa/common.json');
const psLocalePath = path.join(__dirname, 'src/locales/ps/common.json');

const enLocale = JSON.parse(fs.readFileSync(enLocalePath, 'utf8'));
const faLocale = JSON.parse(fs.readFileSync(faLocalePath, 'utf8'));
const psLocale = JSON.parse(fs.readFileSync(psLocalePath, 'utf8'));

// Helper to check if a key exists in locale data
function checkKey(localeData, keyPath) {
  const parts = keyPath.split('.');
  let current = localeData;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  return current !== undefined;
}

// Extract all translation keys from VehicleFilter.tsx
const translationKeys = new Set();

// Pattern for tSearch('key') - searches in 'search' namespace (root level)
const tSearchPattern = /tSearch\('([^']+)'\)/g;
let match;
while ((match = tSearchPattern.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`search.${match[1]}`);
}

// Pattern for tVH('key') - tVH calls tCommon('vehicles.key')
const tVHPattern = /tVH\('([^']+)'\)/g;
while ((match = tVHPattern.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`common.vehicles.${match[1]}`);
}

// Pattern for tCommon('key') - directly calls common namespace
const tCommonPattern = /tCommon\('([^']+)'\)/g;
while ((match = tCommonPattern.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`common.${match[1]}`);
}

// Also check for tVH with template literals like `wd_${type}`
const tVHTemplatePattern = /tVH\(`([^`]+)`\)/g;
while ((match = tVHTemplatePattern.exec(vehicleFilterContent)) !== null) {
  // This is a template literal, we need to check the pattern
  const template = match[1];
  if (template.includes('${type}')) {
    // This is a dynamic key like `wd_${type}`, we need to check all possible values
    // For now, add it as a pattern
    translationKeys.add(`common.vehicles.wd_* (template)`);
  } else if (template.includes('${color}')) {
    translationKeys.add(`common.vehicles.color_* (template)`);
  } else {
    translationKeys.add(`common.vehicles.${template}`);
  }
}

// Check for tVH(type) where type is a variable - we need to check all ENGINE_TYPES, GEAR_TYPES, etc.
// We'll manually add these based on our analysis
const engineTypes = ['diesel', 'petrol', 'hybrid', 'electric', 'petrolLpg'];
const gearTypes = ['automatic', 'manual', 'semiAutomatic'];
const wheelDriveTypes = ['fwd', 'rwd', 'awd', '4wd'];
const vehicleColors = ['white', 'black', 'silver', 'gray', 'red', 'blue', 'green', 'beige', 'gold', 'brown', 'orange', 'yellow', 'purple', 'navy', 'maroon', 'champagne', 'other'];
const bodyTypes = ['sedan', 'suv', 'van', 'truck', 'pickup', 'hatchback', 'coupe', 'convertible', 'wagon', 'motorcycle'];

// Add engine type keys
engineTypes.forEach(type => translationKeys.add(`common.vehicles.${type}`));
// Add gear type keys
gearTypes.forEach(type => translationKeys.add(`common.vehicles.${type}`));
// Add wheel drive keys
wheelDriveTypes.forEach(type => translationKeys.add(`common.vehicles.wd_${type}`));
// Add color keys
vehicleColors.forEach(color => translationKeys.add(`common.vehicles.color_${color}`));
// Add body type keys
bodyTypes.forEach(type => translationKeys.add(`common.vehicles.${type}`));

console.log('=== VEHICLE FILTER TRANSLATION AUDIT ===\n');
console.log(`Found ${translationKeys.size} unique translation keys in VehicleFilter.tsx\n`);

// Check each key in all three locales
const results = [];
const missingKeys = {
  en: [],
  fa: [],
  ps: []
};

for (const key of Array.from(translationKeys).sort()) {
  const existsEn = checkKey(enLocale, key);
  const existsFa = checkKey(faLocale, key);
  const existsPs = checkKey(psLocale, key);
  
  results.push({
    key,
    en: existsEn ? '✓' : '✗',
    fa: existsFa ? '✓' : '✗',
    ps: existsPs ? '✓' : '✗'
  });
  
  if (!existsEn) missingKeys.en.push(key);
  if (!existsFa) missingKeys.fa.push(key);
  if (!existsPs) missingKeys.ps.push(key);
}

// Print results table
console.log('Translation Key Status:');
console.log('Key'.padEnd(40) + 'EN'.padEnd(5) + 'FA'.padEnd(5) + 'PS');
console.log('-'.repeat(60));

results.forEach(r => {
  console.log(r.key.padEnd(40) + r.en.padEnd(5) + r.fa.padEnd(5) + r.ps);
});

console.log('\n=== MISSING KEYS SUMMARY ===\n');

console.log(`English missing: ${missingKeys.en.length} keys`);
if (missingKeys.en.length > 0) {
  console.log(missingKeys.en.map(k => `  - ${k}`).join('\n'));
}

console.log(`\nPersian missing: ${missingKeys.fa.length} keys`);
if (missingKeys.fa.length > 0) {
  console.log(missingKeys.fa.map(k => `  - ${k}`).join('\n'));
}

console.log(`\nPashto missing: ${missingKeys.ps.length} keys`);
if (missingKeys.ps.length > 0) {
  console.log(missingKeys.ps.map(k => `  - ${k}`).join('\n'));
}

// Check for keys mentioned in user request
console.log('\n=== VALIDATION KEYS FROM USER REQUEST ===\n');
const requestedKeys = [
  'any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity', 'vehicleType', 
  'make', 'model', 'yearRange', 'priceRange', 'mileageRange', 'plateCity', 
  'postalCode', 'features', 'has360Spin'
];

console.log('Checking keys mentioned in user request:');
requestedKeys.forEach(key => {
  // These could be in search or vehicles namespace
  const searchKey = `search.${key}`;
  const vehicleKey = `vehicles.${key}`;
  const existsSearch = checkKey(enLocale, searchKey);
  const existsVehicle = checkKey(enLocale, vehicleKey);
  
  if (existsSearch || existsVehicle) {
    const namespace = existsSearch ? 'search' : 'vehicles';
    console.log(`  ✓ ${key} (found in ${namespace})`);
  } else {
    console.log(`  ✗ ${key} (missing)`);
  }
});

console.log('\n=== AUDIT COMPLETE ===');