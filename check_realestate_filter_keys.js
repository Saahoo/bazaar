const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = path.join(__dirname, 'src/locales/en/common.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Get postAd.realEstate keys
const postAdRealEstate = data.postAd?.realEstate || {};
const commonRealEstate = data.common?.realEstate || {};

// Keys used in the filter (from analysis)
const filterKeys = [
  // Section labels
  'listingType',
  'propertyType',
  'city',
  'areaDistrict',
  'enterAreaDistrict',
  'price',
  'currency',
  'afd',
  'pkr',
  'usd',
  'bedrooms',
  'bathrooms',
  'areaSize',
  'floorNumber',
  'enterFloorNumber',
  'yearBuilt',
  'parkingSpaces',
  'enterParkingSpaces',
  'balcony',
  'yesBalcony',
  'noBalcony',
  'elevator',
  'yesElevator',
  'noElevator',
  'furnishing',
  'condition',
  'kitchenType',
  'commercialType',
  'meetingRoomsLabel',
  'washroomsLabel',
  'landTypeLabel',
  'roadAccessLabel',
  'cornerPlotLabel',
  'propertyTypeLabel',
  'ceilingHeightLabel',
  'loadingDocksLabel',
  
  // Option values
  'forSale',
  'forRent',
  'apartment',
  'house_villa',
  'commercial',
  'office',
  'shop_retail',
  'land_plot',
  'industrial',
  'room_shared',
  'other',
  'furnished',
  'semiFurnished',
  'unfurnished',
  'new',
  'used',
  'renovated',
  'newCondition',
  'usedCondition',
  'renovatedCondition',
  'open',
  'closed',
  'openKitchenType',
  'closedKitchenType',
  'officeCommercialType',
  'shopCommercialType',
  'showroomCommercialType',
  'residential',
  'commercial',
  'agricultural',
  'residentialLandType',
  'commercialLandType',
  'agriculturalLandType',
  'warehouse',
  'factory',
  'warehouseIndustrialType',
  'factoryIndustrialType',
  'yes',
  'no'
];

console.log('Checking Real Estate translation keys for filter...\n');

console.log('=== Keys in postAd.realEstate ===');
const missingInPostAd = [];
const existingInPostAd = [];

for (const key of filterKeys) {
  if (postAdRealEstate[key] !== undefined) {
    existingInPostAd.push(key);
  } else {
    missingInPostAd.push(key);
  }
}

console.log(`Existing: ${existingInPostAd.length} keys`);
console.log(`Missing: ${missingInPostAd.length} keys`);

if (missingInPostAd.length > 0) {
  console.log('\nMissing keys in postAd.realEstate:');
  missingInPostAd.forEach(key => console.log(`  - ${key}`));
}

console.log('\n=== Keys in common.realEstate ===');
if (Object.keys(commonRealEstate).length === 0) {
  console.log('common.realEstate does not exist');
} else {
  console.log(`Exists with ${Object.keys(commonRealEstate).length} keys`);
  // Check which filter keys are in common.realEstate
  const missingInCommon = [];
  const existingInCommon = [];
  for (const key of filterKeys) {
    if (commonRealEstate[key] !== undefined) {
      existingInCommon.push(key);
    } else {
      missingInCommon.push(key);
    }
  }
  console.log(`Existing in common.realEstate: ${existingInCommon.length} keys`);
  console.log(`Missing in common.realEstate: ${missingInCommon.length} keys`);
}

// Check for hard-coded placeholder
console.log('\n=== Hard-coded strings in filter ===');
console.log('Found: "e.g. 5 meters" in ceilingHeight input (line 2146)');

// Generate suggested additions
console.log('\n=== Suggested additions to common.realEstate ===');
console.log('Since filter uses common.realEstate but it doesn\'t exist, we need to create it.');
console.log('We should copy necessary keys from postAd.realEstate to common.realEstate.');

// Show which keys need to be added to common.realEstate
const keysToAdd = {};
for (const key of filterKeys) {
  if (postAdRealEstate[key] !== undefined) {
    keysToAdd[key] = postAdRealEstate[key];
  }
}

console.log(`\nTotal keys to copy to common.realEstate: ${Object.keys(keysToAdd).length}`);
console.log('Sample of keys that would be copied:');
Object.keys(keysToAdd).slice(0, 10).forEach(key => {
  console.log(`  "${key}": "${keysToAdd[key]}"`);
});

// Also note missing keys that need to be created
const missingKeysToCreate = missingInPostAd.filter(key => {
  // Some keys might be in common namespace (like 'yes', 'no')
  return data.common?.[key] === undefined;
});

if (missingKeysToCreate.length > 0) {
  console.log('\nKeys missing entirely (need to be created in postAd.realEstate or common):');
  missingKeysToCreate.forEach(key => console.log(`  - ${key}`));
}