const fs = require('fs');
const path = require('path');

// Read the English locale file
const localePath = path.join(__dirname, 'src/locales/en/common.json');
const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));

// Read the VehicleFilter.tsx file
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const vehicleFilterContent = fs.readFileSync(vehicleFilterPath, 'utf8');

// Extract all t() and tVH() calls
const tCalls = [];
const tVHCalls = [];

// Regex patterns to find translation calls
const tPattern = /t\(['"]([^'"]+)['"]\)/g;
const tVHPattern = /tVH\(['"]([^'"]+)['"]\)/g;

let match;
while ((match = tPattern.exec(vehicleFilterContent)) !== null) {
  tCalls.push(match[1]);
}

while ((match = tVHPattern.exec(vehicleFilterContent)) !== null) {
  tVHCalls.push(match[1]);
}

// Also find dynamic tVH calls like tVH(`wd_${type}`)
const dynamicTvhPattern = /tVH\(`([^`]+)`\)/g;
while ((match = dynamicTvhPattern.exec(vehicleFilterContent)) !== null) {
  // This is a template literal, we'll handle it specially
  const template = match[1];
  if (template.includes('${')) {
    // This is a dynamic template like `wd_${type}`
    // We'll check for known patterns
    if (template === 'wd_${type}') {
      // Check for known WHEEL_DRIVE_TYPES
      tVHCalls.push('wd_fwd', 'wd_rwd', 'wd_awd', 'wd_4wd');
    } else if (template === 'color_${color}') {
      // Check for known VEHICLE_COLORS
      const colors = ['white', 'black', 'silver', 'gray', 'red', 'blue', 'green', 'beige', 'gold', 'brown', 'orange', 'yellow', 'purple', 'navy', 'maroon', 'champagne', 'other'];
      colors.forEach(color => tVHCalls.push(`color_${color}`));
    }
  }
}

// Also check for tVH(type) where type is from ENGINE_TYPES, GEAR_TYPES
// These are dynamic but we know the values from constants
const engineTypes = ['diesel', 'petrol', 'hybrid', 'electric', 'petrolLpg'];
const gearTypes = ['automatic', 'manual', 'semiAutomatic'];
const bodyTypes = ['sedan', 'suv', 'van', 'truck', 'pickup', 'hatchback', 'coupe', 'convertible', 'wagon', 'motorcycle'];

// Add engine types
engineTypes.forEach(type => tVHCalls.push(type));
// Add gear types  
gearTypes.forEach(type => tVHCalls.push(type));
// Add body types
bodyTypes.forEach(type => tVHCalls.push(type));

// Remove duplicates
const uniqueTCalls = [...new Set(tCalls)];
const uniqueTvhCalls = [...new Set(tVHCalls)];

console.log('=== Translation Key Audit for VehicleFilter.tsx ===\n');

console.log(`Found ${uniqueTCalls.length} unique t() calls:`);
console.log(uniqueTCalls.sort().join(', '));
console.log();

console.log(`Found ${uniqueTvhCalls.length} unique tVH() calls:`);
console.log(uniqueTvhCalls.sort().join(', '));
console.log();

// Check if keys exist in locale data
function checkKeyExists(key, namespace = 'common') {
  if (namespace === 'common') {
    // Check in common namespace
    return key in localeData.common;
  } else if (namespace === 'vehicles') {
    // Check in vehicles namespace
    return localeData.vehicles && key in localeData.vehicles;
  }
  return false;
}

console.log('=== Checking t() keys in common namespace ===');
const missingTKeys = [];
uniqueTCalls.forEach(key => {
  const exists = checkKeyExists(key, 'common');
  if (!exists) {
    missingTKeys.push(key);
    console.log(`❌ Missing: "${key}"`);
  } else {
    console.log(`✓ Found: "${key}"`);
  }
});

console.log('\n=== Checking tVH() keys in vehicles namespace ===');
const missingTvhKeys = [];
uniqueTvhCalls.forEach(key => {
  const exists = checkKeyExists(key, 'vehicles');
  if (!exists) {
    missingTvhKeys.push(key);
    console.log(`❌ Missing: "${key}"`);
  } else {
    console.log(`✓ Found: "${key}"`);
  }
});

console.log('\n=== Summary ===');
console.log(`Total t() keys: ${uniqueTCalls.length}, Missing: ${missingTKeys.length}`);
console.log(`Total tVH() keys: ${uniqueTvhCalls.length}, Missing: ${missingTvhKeys.length}`);

if (missingTKeys.length > 0) {
  console.log('\nMissing t() keys:');
  missingTKeys.forEach(key => console.log(`  - "${key}"`));
}

if (missingTvhKeys.length > 0) {
  console.log('\nMissing tVH() keys:');
  missingTvhKeys.forEach(key => console.log(`  - "${key}"`));
}

// Also check for the specific keys mentioned in the user's request
const requestedKeys = ['any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity', 'vehicleType', 'make', 'model', 'yearRange', 'priceRange', 'mileageRange', 'plateCity', 'postalCode', 'features', 'has360Spin'];
console.log('\n=== Checking specifically requested keys ===');
requestedKeys.forEach(key => {
  // Determine which namespace to check
  let namespace = 'common';
  let found = false;
  
  if (['vehicleType', 'make', 'model', 'plateCity', 'postalCode', 'has360Spin'].includes(key)) {
    namespace = 'vehicles';
    found = localeData.vehicles && key in localeData.vehicles;
  } else {
    found = key in localeData.common;
  }
  
  if (found) {
    console.log(`✓ "${key}" found in ${namespace} namespace`);
  } else {
    console.log(`❌ "${key}" NOT found in ${namespace} namespace`);
  }
});