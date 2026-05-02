const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = path.join(__dirname, 'src/locales/en/common.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Get postAd.realEstate keys
const postAdRealEstate = data.postAd?.realEstate || {};

// Filter keys needed for the filter (based on analysis)
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
  'newCondition',
  'usedCondition',
  'renovatedCondition',
  'openKitchenType',
  'closedKitchenType',
  'officeCommercialType',
  'shopCommercialType',
  'showroomCommercialType',
  'residentialLandType',
  'commercialLandType',
  'agriculturalLandType',
  'warehouseIndustrialType',
  'factoryIndustrialType',
];

// Build common.realEstate object
const commonRealEstate = {};
for (const key of filterKeys) {
  if (postAdRealEstate[key] !== undefined) {
    commonRealEstate[key] = postAdRealEstate[key];
  } else {
    // Key not found in postAd.realEstate, use a placeholder
    console.warn(`Warning: Key "${key}" not found in postAd.realEstate, using placeholder`);
    commonRealEstate[key] = key; // placeholder
  }
}

// Add missing 'used' key (not used in filter but might be needed)
if (!commonRealEstate.used && postAdRealEstate.usedCondition) {
  commonRealEstate.used = postAdRealEstate.usedCondition;
}

// Add missing 'new' and 'renovated' for consistency
if (!commonRealEstate.new && postAdRealEstate.newCondition) {
  commonRealEstate.new = postAdRealEstate.newCondition;
}
if (!commonRealEstate.renovated && postAdRealEstate.renovatedCondition) {
  commonRealEstate.renovated = postAdRealEstate.renovatedCondition;
}

// Add missing 'open' and 'closed' (kitchen types)
if (!commonRealEstate.open && postAdRealEstate.open) {
  commonRealEstate.open = postAdRealEstate.open;
}
if (!commonRealEstate.closed && postAdRealEstate.closed) {
  commonRealEstate.closed = postAdRealEstate.closed;
}

// Add missing 'residential', 'commercial', 'agricultural' (land types)
if (!commonRealEstate.residential && postAdRealEstate.residential) {
  commonRealEstate.residential = postAdRealEstate.residential;
}
if (!commonRealEstate.commercial && postAdRealEstate.commercial) {
  commonRealEstate.commercial = postAdRealEstate.commercial;
}
if (!commonRealEstate.agricultural && postAdRealEstate.agricultural) {
  commonRealEstate.agricultural = postAdRealEstate.agricultural;
}

// Add missing 'warehouse' and 'factory'
if (!commonRealEstate.warehouse && postAdRealEstate.warehouse) {
  commonRealEstate.warehouse = postAdRealEstate.warehouse;
}
if (!commonRealEstate.factory && postAdRealEstate.factory) {
  commonRealEstate.factory = postAdRealEstate.factory;
}

// Add missing 'yes' and 'no' (these are in common root, not realEstate)
// But filter uses tCommon('yes')/tCommon('no'), not tRE('yes')/tRE('no')
// So we don't need to add them here

console.log(`Created common.realEstate with ${Object.keys(commonRealEstate).length} keys`);

// Add to data
if (!data.common) {
  data.common = {};
}
data.common.realEstate = commonRealEstate;

// Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

console.log('Successfully added common.realEstate to src/locales/en/common.json');

// Also need to add the same keys to fa and ps locales
const locales = ['fa', 'ps'];
for (const locale of locales) {
  const localePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  if (fs.existsSync(localePath)) {
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    if (!localeData.common) {
      localeData.common = {};
    }
    
    // For other locales, we need to check if they have translations
    // For now, copy the English keys as placeholders (they should be translated)
    const localeRealEstate = {};
    for (const key of Object.keys(commonRealEstate)) {
      // Try to get translation from postAd.realEstate in the locale
      const localePostAdRealEstate = localeData.postAd?.realEstate || {};
      if (localePostAdRealEstate[key] !== undefined) {
        localeRealEstate[key] = localePostAdRealEstate[key];
      } else {
        // Use English as fallback (with a comment)
        localeRealEstate[key] = commonRealEstate[key] + ' (TODO: translate)';
      }
    }
    
    localeData.common.realEstate = localeRealEstate;
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2));
    console.log(`Added common.realEstate to ${locale} locale (${Object.keys(localeRealEstate).length} keys)`);
  } else {
    console.warn(`Locale file not found: ${localePath}`);
  }
}