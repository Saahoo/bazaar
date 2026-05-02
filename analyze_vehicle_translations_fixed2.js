const fs = require('fs');
const path = require('path');

// Read VehicleFilter.tsx
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const vehicleFilterContent = fs.readFileSync(vehicleFilterPath, 'utf8');

// Read locale files
const locales = ['en', 'fa', 'ps'];
const localeData = {};

for (const locale of locales) {
  const localePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  const localeContent = fs.readFileSync(localePath, 'utf8');
  localeData[locale] = JSON.parse(localeContent);
}

// Extract all translation calls with context
const translationCalls = [];

// Helper to extract translation calls with more context
const lines = vehicleFilterContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNumber = i + 1;
  
  // Find t('...') calls
  const tMatches = line.matchAll(/t\(['"]([^'"]+)['"]\)/g);
  for (const match of tMatches) {
    translationCalls.push({
      type: 't',
      key: match[1],
      fullMatch: match[0],
      line: lineNumber,
      context: line.trim()
    });
  }
  
  // Find tVH('...') calls
  const tVHMatches = line.matchAll(/tVH\(['"]([^'"]+)['"]\)/g);
  for (const match of tVHMatches) {
    translationCalls.push({
      type: 'tVH',
      key: match[1],
      fullMatch: match[0],
      line: lineNumber,
      context: line.trim()
    });
  }
}

// Helper to check if key exists in locale data with different possible paths
function keyExists(key, type) {
  const possiblePaths = [];
  
  if (type === 'tVH') {
    // tVH('key') -> vehicles.key
    possiblePaths.push(`vehicles.${key}`);
    // Also check search namespace
    possiblePaths.push(`search.${key}`);
  } else {
    // t('key') -> could be search.key or common.key
    possiblePaths.push(`search.${key}`);
    possiblePaths.push(key); // direct key
  }
  
  for (const path of possiblePaths) {
    const parts = path.split('.');
    let current = localeData.en;
    let found = true;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }
    
    if (found && typeof current === 'string') {
      return { exists: true, path };
    }
  }
  
  return { exists: false, path: null };
}

// Analyze each translation call
console.log('=== VehicleFilter Translation Key Analysis ===\n');
console.log(`Found ${translationCalls.length} translation calls in VehicleFilter.tsx\n`);

const missingKeys = [];
const foundKeys = [];

for (const call of translationCalls) {
  const result = keyExists(call.key, call.type);
  if (result.exists) {
    foundKeys.push({ ...call, foundPath: result.path });
  } else {
    missingKeys.push(call);
  }
}

// Print results
if (foundKeys.length > 0) {
  console.log('✅ Found translation keys:');
  foundKeys.forEach(call => {
    console.log(`  Line ${call.line}: ${call.fullMatch} -> "${call.foundPath}"`);
  });
  console.log('');
}

if (missingKeys.length > 0) {
  console.log('❌ Missing translation keys:');
  missingKeys.forEach(call => {
    const fullKey = call.type === 'tVH' ? `vehicles.${call.key}` : call.key;
    console.log(`  Line ${call.line}: ${call.fullMatch} -> "${fullKey}"`);
    console.log(`      Context: ${call.context}`);
  });
  console.log('');
}

// Check required keys from user request
const requiredKeys = [
  'any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity',
  'vehicleType', 'make', 'model', 'yearRange', 'priceRange',
  'mileageRange', 'plateCity', 'postalCode', 'features', 'has360Spin'
];

console.log('=== Required Keys Validation ===\n');
console.log('Checking keys from user request (checking all possible locations):');

const missingRequiredKeys = [];
for (const key of requiredKeys) {
  // Check all possible paths
  const possiblePaths = [
    `search.${key}`,
    `vehicles.${key}`,
    key
  ];
  
  let found = false;
  let foundPath = '';
  
  for (const path of possiblePaths) {
    const parts = path.split('.');
    let current = localeData.en;
    let pathExists = true;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        pathExists = false;
        break;
      }
    }
    
    if (pathExists && typeof current === 'string') {
      found = true;
      foundPath = path;
      break;
    }
  }
  
  if (found) {
    console.log(`  ✅ ${key} -> "${foundPath}"`);
  } else {
    console.log(`  ❌ ${key} (not found at search.${key}, vehicles.${key}, or root)`);
    missingRequiredKeys.push(key);
  }
}

console.log('\n=== Summary ===');
console.log(`Total translation calls: ${translationCalls.length}`);
console.log(`Found keys: ${foundKeys.length}`);
console.log(`Missing keys: ${missingKeys.length}`);
console.log(`Required keys missing: ${missingRequiredKeys.length}`);

// Also check for keys that might need to be added to locale files
if (missingKeys.length > 0) {
  console.log('\n⚠️  Some translation keys used in VehicleFilter.tsx are missing from locale files!');
  console.log('\nSuggested fixes:');
  console.log('1. For t() calls, use t("search.key") instead of t("key")');
  console.log('2. Or add missing keys to locale files');
  
  // Group missing keys by type
  const tMissing = missingKeys.filter(c => c.type === 't').map(c => c.key);
  const tVHMissing = missingKeys.filter(c => c.type === 'tVH').map(c => c.key);
  
  if (tMissing.length > 0) {
    console.log('\nMissing t() keys (search namespace):');
    tMissing.forEach(key => console.log(`  "search.${key}": "TODO",`));
  }
  
  if (tVHMissing.length > 0) {
    console.log('\nMissing tVH() keys (vehicles namespace):');
    tVHMissing.forEach(key => console.log(`  "vehicles.${key}": "TODO",`));
  }
}

if (missingKeys.length === 0 && missingRequiredKeys.length === 0) {
  console.log('\n✅ All translation keys are present!');
  process.exit(0);
} else {
  process.exit(1);
}