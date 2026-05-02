const fs = require('fs');
const content = JSON.parse(fs.readFileSync('src/locales/en/common.json', 'utf8'));

// Get the realEstate object from common.json
const realEstate = content.realEstate || {};

// Keys used in FilterSidebar.tsx for Real Estate (without prefix)
const usedKeys = [
  'listingType', 'forSale', 'forRent', 
  'propertyType', 'apartment', 'house', 'villa', 'commercial', 'office', 
  'shop_retail', 'land_plot', 'industrial', 'warehouse', 'factory', 
  'garage', 'farm_house', 'room_shared', 'other',
  'city', 'areaDistrict', 'enterAreaDistrict', 
  'price', 'currency', 'afd', 'pkr', 'usd',
  'bedrooms', 'bathrooms', 'areaSize', 
  'floorNumber', 'enterFloorNumber', 
  'yearBuilt', 'parkingSpaces', 'enterParkingSpaces',
  'balcony', 'yesBalcony', 'noBalcony', 
  'elevator', 'yesElevator', 'noElevator',
  'furnishing', 'furnished', 'semiFurnished', 'unfurnished',
  'condition', 'newCondition', 'usedCondition', 'renovatedCondition',
  'kitchenType', 'openKitchenType', 'closedKitchenType',
  'commercialType', 'officeCommercialType', 'shopCommercialType', 'showroomCommercialType',
  'meetingRoomsLabel', 'washroomsLabel',
  'landTypeLabel', 'residentialLandType', 'commercialLandType', 'agriculturalLandType',
  'roadAccessLabel', 'cornerPlotLabel',
  'propertyTypeLabel', 'warehouseIndustrialType', 'factoryIndustrialType',
  'ceilingHeightLabel', 'loadingDocksLabel'
];

console.log('=== Checking Real Estate Translation Keys ===\n');
console.log(`Total keys used in filter: ${usedKeys.length}`);
console.log(`Total keys in realEstate object: ${Object.keys(realEstate).length}`);
console.log('');

const missing = [];
const existing = [];

usedKeys.forEach(key => {
  if (realEstate[key] !== undefined) {
    existing.push({key, value: realEstate[key]});
  } else {
    missing.push(key);
  }
});

console.log(`Existing keys (${existing.length}):`);
existing.forEach(({key, value}) => console.log(`  ✓ ${key}: "${value}"`));
console.log('');
console.log(`Missing keys (${missing.length}):`);
missing.forEach(key => console.log(`  ✗ ${key}`));

// Also check for hard-coded strings that need translation
console.log('\n=== Hard-coded strings that need localization ===');
console.log('1. "e.g. 5 meters" placeholder in ceilingHeight input (should be a translation key)');
console.log('2. Loading docks input has no placeholder (could add one)');

// Check if any property type values match the constants
const RE_PROPERTY_TYPES = [
  'apartment', 'house', 'villa', 'commercial', 'office', 'shop_retail', 
  'land_plot', 'industrial', 'warehouse', 'factory', 'garage', 'farm_house', 
  'room_shared', 'other'
];

console.log('\n=== Property type keys check ===');
RE_PROPERTY_TYPES.forEach(type => {
  if (realEstate[type] === undefined) {
    console.log(`  ✗ "${type}" missing`);
  } else {
    console.log(`  ✓ "${type}": "${realEstate[type]}"`);
  }
});