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

// Extract translation keys from VehicleFilter.tsx
const translationKeys = new Set();

// Find tSearch calls
const tSearchRegex = /tSearch\('([^']+)'\)/g;
let match;
while ((match = tSearchRegex.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`search.${match[1]}`);
}

// Find tCommon calls (direct)
const tCommonRegex = /tCommon\('([^']+)'\)/g;
while ((match = tCommonRegex.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`common.${match[1]}`);
}

// Find tVH calls (vehicles.*)
const tVHRegex = /tVH\('([^']+)'\)/g;
while ((match = tVHRegex.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`common.vehicles.${match[1]}`);
}

// Also look for tVH calls with template literals or backticks
const tVHBacktickRegex = /tVH\(`([^`]+)`\)/g;
while ((match = tVHBacktickRegex.exec(vehicleFilterContent)) !== null) {
  translationKeys.add(`common.vehicles.${match[1]}`);
}

// Find tVH calls with concatenation like `wd_${type}`
const tVHConcatRegex = /tVH\(`([^`$]+)\$\{[^}]+\}`\)/g;
while ((match = tVHConcatRegex.exec(vehicleFilterContent)) !== null) {
  // This is a pattern like `wd_${type}` - we need to check for possible values
  const prefix = match[1];
  // Add common patterns
  translationKeys.add(`common.vehicles.${prefix}fwd`);
  translationKeys.add(`common.vehicles.${prefix}rwd`);
  translationKeys.add(`common.vehicles.${prefix}awd`);
  translationKeys.add(`common.vehicles.${prefix}4wd`);
}

// Also check for color_${color} pattern
const colorRegex = /tVH\(`color_([^`$]+)\$\{[^}]+\}`\)/;
if (colorRegex.test(vehicleFilterContent)) {
  // Add common color keys
  const colors = ['white', 'black', 'silver', 'gray', 'red', 'blue', 'green', 'beige', 'gold', 'brown', 'orange', 'yellow', 'purple', 'navy', 'maroon', 'champagne', 'other'];
  colors.forEach(color => {
    translationKeys.add(`common.vehicles.color_${color}`);
  });
}

// Helper function to check if a key exists in locale
function keyExists(locale, key) {
  const parts = key.split('.');
  let current = locale;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  return current !== undefined;
}

// Analyze each key
console.log('=== Vehicle Filter Translation Key Analysis ===\n');
console.log(`Total unique translation keys found: ${translationKeys.size}\n`);

const results = [];
let missingCount = 0;

for (const key of Array.from(translationKeys).sort()) {
  const existsEn = keyExists(enLocale, key);
  const existsFa = keyExists(faLocale, key);
  const existsPs = keyExists(psLocale, key);
  
  const allExist = existsEn && existsFa && existsPs;
  
  if (!allExist) {
    missingCount++;
  }
  
  results.push({
    key,
    en: existsEn ? '✓' : '✗',
    fa: existsFa ? '✓' : '✗',
    ps: existsPs ? '✓' : '✗',
    status: allExist ? 'OK' : 'MISSING'
  });
}

// Print table
console.log('Key'.padEnd(40) + 'EN  FA  PS  Status');
console.log('-'.repeat(60));

results.forEach(r => {
  console.log(
    r.key.padEnd(40) +
    r.en.padEnd(4) +
    r.fa.padEnd(4) +
    r.ps.padEnd(4) +
    r.status
  );
});

console.log(`\nSummary: ${missingCount} keys missing in at least one locale`);

// Also check for the specific keys mentioned in the user's request
console.log('\n=== Validated Translation Keys from User Request ===');
const requestedKeys = [
  'any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity', 'vehicleType', 
  'make', 'model', 'yearRange', 'priceRange', 'mileageRange', 'plateCity', 
  'postalCode', 'features', 'has360Spin'
];

console.log('\nChecking requested keys in search namespace:');
requestedKeys.forEach(key => {
  const searchKey = `search.${key}`;
  const existsEn = keyExists(enLocale, searchKey);
  const existsFa = keyExists(faLocale, searchKey);
  const existsPs = keyExists(psLocale, searchKey);
  const allExist = existsEn && existsFa && existsPs;
  
  console.log(
    `${searchKey.padEnd(30)} EN:${existsEn ? '✓' : '✗'} FA:${existsFa ? '✓' : '✗'} PS:${existsPs ? '✓' : '✗'} ${allExist ? 'OK' : 'MISSING'}`
  );
});

// Check for mileageRange vs kmRange
console.log('\nNote: "mileageRange" might be "kmRange" in search namespace');
const kmRangeKey = 'search.kmRange';
console.log(`${kmRangeKey.padEnd(30)} EN:${keyExists(enLocale, kmRangeKey) ? '✓' : '✗'}`);

// Check for plateCity vs anyPlateCity
console.log('\nNote: "plateCity" might be "anyPlateCity" in search namespace');
const anyPlateCityKey = 'search.anyPlateCity';
console.log(`${anyPlateCityKey.padEnd(30)} EN:${keyExists(enLocale, anyPlateCityKey) ? '✓' : '✗'}`);