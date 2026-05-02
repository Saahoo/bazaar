const fs = require('fs');
const path = require('path');

// Keys needed in common.vehicles based on VehicleFilter.tsx usage
const neededKeys = [
  'vehicleType', 'make', 'model', 'selectMakeFirst', 'engineType',
  'gearType', 'wheelDriveType', 'color', 'numberPlateCity',
  'postalCode', 'enterPostalCode', 'has360Spin', 'sedan', 'suv',
  'van', 'truck', 'pickup', 'hatchback', 'coupe', 'convertible',
  'wagon', 'motorcycle', 'adDetails'
];

// Process each locale
const locales = ['en', 'fa', 'ps'];

for (const locale of locales) {
  console.log(`\n=== Processing ${locale} locale ===`);
  const filePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  // Check if common.vehicles already exists
  if (data.common && data.common.vehicles) {
    console.log(`common.vehicles already exists in ${locale}`);
    // Check which keys are missing
    const existingKeys = Object.keys(data.common.vehicles);
    const missingKeys = neededKeys.filter(key => !existingKeys.includes(key));
    if (missingKeys.length > 0) {
      console.log(`Missing keys: ${missingKeys.join(', ')}`);
    } else {
      console.log('All needed keys already present');
    }
    continue;
  }
  
  // Get values from postAd.vehicles
  let sourceValues = {};
  if (data.postAd && data.postAd.vehicles) {
    for (const key of neededKeys) {
      if (data.postAd.vehicles[key]) {
        sourceValues[key] = data.postAd.vehicles[key];
      } else {
        console.warn(`Warning: Key "${key}" not found in postAd.vehicles for ${locale}`);
        // Provide a default based on the key name
        sourceValues[key] = key;
      }
    }
  } else {
    console.error(`Error: postAd.vehicles not found in ${locale} locale`);
    continue;
  }
  
  // Create common.vehicles object
  const vehiclesObj = {};
  for (const key of neededKeys) {
    vehiclesObj[key] = sourceValues[key];
  }
  
  // Add common.vehicles to the data
  if (!data.common) {
    data.common = {};
  }
  data.common.vehicles = vehiclesObj;
  
  // Write back to file with proper formatting
  const updatedContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`Added common.vehicles with ${Object.keys(vehiclesObj).length} keys to ${locale} locale`);
}

console.log('\n=== Done ===');