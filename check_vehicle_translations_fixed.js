const fs = require('fs');
const path = require('path');

// Read the English locale file
const localePath = path.join(__dirname, 'src/locales/en/common.json');
const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));

// The structure is { "common": { ... } }
const commonData = localeData.common;

console.log('=== Translation Key Audit for VehicleFilter.tsx (Fixed) ===\n');

// Check for specific keys that we know should exist
const keysToCheck = [
  // t() keys (common namespace)
  { key: 'any', namespace: 'common', expected: true },
  { key: 'min', namespace: 'common', expected: true },
  { key: 'max', namespace: 'common', expected: true },
  { key: 'minKm', namespace: 'common', expected: true },
  { key: 'maxKm', namespace: 'common', expected: true },
  { key: 'anyPlateCity', namespace: 'common', expected: true },
  { key: 'yearRange', namespace: 'common', expected: true },
  { key: 'priceRange', namespace: 'common', expected: true },
  { key: 'mileageRange', namespace: 'common', expected: true },
  { key: 'features', namespace: 'common', expected: true },
  { key: 'keywords', namespace: 'common', expected: true },
  { key: 'anyColor', namespace: 'common', expected: true },
  { key: 'anyWheelDrive', namespace: 'common', expected: true },
  { key: 'yes', namespace: 'common', expected: true },
  { key: 'no', namespace: 'common', expected: true },
  
  // tVH() keys (vehicles namespace)
  { key: 'vehicleType', namespace: 'vehicles', expected: true },
  { key: 'make', namespace: 'vehicles', expected: true },
  { key: 'model', namespace: 'vehicles', expected: true },
  { key: 'engineType', namespace: 'vehicles', expected: true },
  { key: 'gearType', namespace: 'vehicles', expected: true },
  { key: 'wheelDriveType', namespace: 'vehicles', expected: true },
  { key: 'color', namespace: 'vehicles', expected: true },
  { key: 'numberPlateCity', namespace: 'vehicles', expected: true },
  { key: 'postalCode', namespace: 'vehicles', expected: true },
  { key: 'has360Spin', namespace: 'vehicles', expected: true },
  { key: 'selectMakeFirst', namespace: 'vehicles', expected: true },
  { key: 'enterPostalCode', namespace: 'vehicles', expected: true },
  { key: 'adDetails', namespace: 'vehicles', expected: true },
  
  // Engine types
  { key: 'diesel', namespace: 'vehicles', expected: true },
  { key: 'petrol', namespace: 'vehicles', expected: true },
  { key: 'hybrid', namespace: 'vehicles', expected: true },
  { key: 'electric', namespace: 'vehicles', expected: true },
  { key: 'petrolLpg', namespace: 'vehicles', expected: true },
  
  // Gear types
  { key: 'automatic', namespace: 'vehicles', expected: true },
  { key: 'manual', namespace: 'vehicles', expected: true },
  { key: 'semiAutomatic', namespace: 'vehicles', expected: true },
  
  // Wheel drive types
  { key: 'wd_fwd', namespace: 'vehicles', expected: true },
  { key: 'wd_rwd', namespace: 'vehicles', expected: true },
  { key: 'wd_awd', namespace: 'vehicles', expected: true },
  { key: 'wd_4wd', namespace: 'vehicles', expected: true },
  
  // Color types
  { key: 'color_white', namespace: 'vehicles', expected: true },
  { key: 'color_black', namespace: 'vehicles', expected: true },
  { key: 'color_silver', namespace: 'vehicles', expected: true },
  { key: 'color_gray', namespace: 'vehicles', expected: true },
  { key: 'color_red', namespace: 'vehicles', expected: true },
  { key: 'color_blue', namespace: 'vehicles', expected: true },
  { key: 'color_green', namespace: 'vehicles', expected: true },
  { key: 'color_beige', namespace: 'vehicles', expected: true },
  { key: 'color_gold', namespace: 'vehicles', expected: true },
  { key: 'color_brown', namespace: 'vehicles', expected: true },
  { key: 'color_orange', namespace: 'vehicles', expected: true },
  { key: 'color_yellow', namespace: 'vehicles', expected: true },
  { key: 'color_purple', namespace: 'vehicles', expected: true },
  { key: 'color_navy', namespace: 'vehicles', expected: true },
  { key: 'color_maroon', namespace: 'vehicles', expected: true },
  { key: 'color_champagne', namespace: 'vehicles', expected: true },
  { key: 'color_other', namespace: 'vehicles', expected: true },
  
  // Body types
  { key: 'sedan', namespace: 'vehicles', expected: true },
  { key: 'suv', namespace: 'vehicles', expected: true },
  { key: 'van', namespace: 'vehicles', expected: true },
  { key: 'truck', namespace: 'vehicles', expected: true },
  { key: 'pickup', namespace: 'vehicles', expected: true },
  { key: 'hatchback', namespace: 'vehicles', expected: true },
  { key: 'coupe', namespace: 'vehicles', expected: true },
  { key: 'convertible', namespace: 'vehicles', expected: true },
  { key: 'wagon', namespace: 'vehicles', expected: true },
  { key: 'motorcycle', namespace: 'vehicles', expected: true },
];

console.log('Checking keys in common and vehicles namespaces...\n');

const missingKeys = [];
const foundKeys = [];

keysToCheck.forEach(({ key, namespace, expected }) => {
  let exists = false;
  let value = '';
  
  if (namespace === 'common') {
    exists = commonData && key in commonData;
    if (exists) value = commonData[key];
  } else if (namespace === 'vehicles') {
    exists = commonData && commonData.vehicles && key in commonData.vehicles;
    if (exists) value = commonData.vehicles[key];
  }
  
  if (exists) {
    foundKeys.push({ key, namespace, value });
    console.log(`✓ "${key}" found in ${namespace} namespace: "${value}"`);
  } else {
    missingKeys.push({ key, namespace });
    console.log(`❌ "${key}" NOT found in ${namespace} namespace`);
  }
});

console.log('\n=== Summary ===');
console.log(`Total keys checked: ${keysToCheck.length}`);
console.log(`Found: ${foundKeys.length}`);
console.log(`Missing: ${missingKeys.length}`);

if (missingKeys.length > 0) {
  console.log('\nMissing keys:');
  missingKeys.forEach(({ key, namespace }) => {
    console.log(`  - "${key}" (${namespace} namespace)`);
  });
}

// Also check the specifically requested keys from the user
console.log('\n=== Specifically requested keys from user ===');
const requestedKeys = [
  'any', 'min', 'max', 'minKm', 'maxKm', 'anyPlateCity', 
  'vehicleType', 'make', 'model', 'yearRange', 'priceRange', 
  'mileageRange', 'plateCity', 'postalCode', 'features', 'has360Spin'
];

requestedKeys.forEach(key => {
  let namespace = 'common';
  if (['vehicleType', 'make', 'model', 'plateCity', 'postalCode', 'has360Spin'].includes(key)) {
    namespace = 'vehicles';
  }
  
  let exists = false;
  if (namespace === 'common') {
    exists = commonData && key in commonData;
  } else {
    exists = commonData && commonData.vehicles && key in commonData.vehicles;
  }
  
  if (exists) {
    console.log(`✓ "${key}" found in ${namespace} namespace`);
  } else {
    console.log(`❌ "${key}" NOT found in ${namespace} namespace`);
  }
});

// Check if "plateCity" exists (might be "numberPlateCity" instead)
console.log('\n=== Note about "plateCity" key ===');
if (commonData && commonData.vehicles && 'numberPlateCity' in commonData.vehicles) {
  console.log('Note: "plateCity" might be referenced as "numberPlateCity" in the vehicles namespace');
  console.log(`Found "numberPlateCity": "${commonData.vehicles.numberPlateCity}"`);
}