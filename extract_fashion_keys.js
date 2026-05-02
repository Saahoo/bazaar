const fs = require('fs');
const path = require('path');

// Read the common.json file
const commonPath = path.join(__dirname, 'src/locales/en/common.json');
const commonContent = fs.readFileSync(commonPath, 'utf8');
const common = JSON.parse(commonContent);

// Extract fashion keys from postAd.fashion
const postAdFashion = common.postAd?.fashion;
if (!postAdFashion) {
  console.error('postAd.fashion not found in common.json');
  process.exit(1);
}

// Get all subcategory keys (keys starting with "subcategory")
const subcategoryKeys = Object.keys(postAdFashion).filter(key => key.startsWith('subcategory'));
console.log('Subcategory keys:', subcategoryKeys.length);
subcategoryKeys.forEach(key => console.log(`  ${key}: ${postAdFashion[key]}`));

// Get fields object
const fields = postAdFashion.fields || {};
console.log('\nField keys:', Object.keys(fields).length);
Object.keys(fields).forEach(key => console.log(`  ${key}: ${fields[key]}`));

// Get optionLabels object
const optionLabels = postAdFashion.optionLabels || {};
console.log('\nOption label keys:', Object.keys(optionLabels).length);
// Show first 20 option labels
Object.keys(optionLabels).slice(0, 20).forEach(key => console.log(`  ${key}: ${optionLabels[key]}`));

// Check if common.fashion exists
if (common.common?.fashion) {
  console.log('\ncommon.fashion already exists with', Object.keys(common.common.fashion).length, 'keys');
} else {
  console.log('\ncommon.fashion does not exist');
}

// Create the fashion object for common namespace
const fashionForCommon = {
  // Subcategory labels
  ...Object.fromEntries(subcategoryKeys.map(key => [key, postAdFashion[key]])),
  
  // Field labels (flatten fields object)
  ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value])),
  
  // Option labels (flatten optionLabels object)
  ...Object.fromEntries(Object.entries(optionLabels).map(([key, value]) => [key, value]))
};

console.log('\nTotal keys for common.fashion:', Object.keys(fashionForCommon).length);

// Write to a file for inspection
const outputPath = path.join(__dirname, 'fashion_common_keys.json');
fs.writeFileSync(outputPath, JSON.stringify(fashionForCommon, null, 2));
console.log(`\nWritten to ${outputPath}`);

// Also create a minimal version with just subcategory labels (like electronics)
const minimalFashion = {
  subcategoryMenClothing: postAdFashion.subcategoryMenClothing,
  subcategoryWomenClothing: postAdFashion.subcategoryWomenClothing,
  subcategoryKidsClothing: postAdFashion.subcategoryKidsClothing,
  subcategoryShoes: postAdFashion.subcategoryShoes,
  subcategoryBags: postAdFashion.subcategoryBags,
  subcategoryAccessories: postAdFashion.subcategoryAccessories,
  subcategoryWatches: postAdFashion.subcategoryWatches,
  subcategoryJewelry: postAdFashion.subcategoryJewelry,
};

console.log('\nMinimal fashion (subcategories only):', Object.keys(minimalFashion).length);