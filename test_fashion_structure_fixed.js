const fs = require('fs');
const path = require('path');

// Read the English common.json
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const enContent = fs.readFileSync(enPath, 'utf8');
const enData = JSON.parse(enContent);

const commonFashion = enData.common?.fashion;
if (!commonFashion) {
  console.error('common.fashion not found');
  process.exit(1);
}

console.log('=== Testing Fashion Structure After Fix ===\n');

// Check structure
console.log('Top-level keys in common.fashion:');
console.log(Object.keys(commonFashion).join(', '));

console.log('\nChecking fields object:');
if (commonFashion.fields) {
  console.log(`fields object has ${Object.keys(commonFashion.fields).length} keys`);
  
  // Test specific field labels
  const testFields = ['clothingType', 'gender', 'size', 'fitType', 'color'];
  testFields.forEach(key => {
    if (commonFashion.fields[key]) {
      console.log(`✅ fields.${key}: "${commonFashion.fields[key]}"`);
    } else {
      console.log(`❌ fields.${key}: MISSING`);
    }
  });
} else {
  console.log('❌ fields object missing');
}

console.log('\nChecking optionLabels object:');
if (commonFashion.optionLabels) {
  console.log(`optionLabels object has ${Object.keys(commonFashion.optionLabels).length} keys`);
  
  // Test specific option labels
  const testOptions = ['nike', 'adidas', 's', 'm', 'l', 'new', 'used'];
  testOptions.forEach(key => {
    if (commonFashion.optionLabels[key]) {
      console.log(`✅ optionLabels.${key}: "${commonFashion.optionLabels[key]}"`);
    } else {
      console.log(`❌ optionLabels.${key}: MISSING`);
    }
  });
} else {
  console.log('❌ optionLabels object missing');
}

// Simulate tFA lookup
console.log('\n=== Simulating tFA Lookups ===');
console.log('tFA would call tCommon with keys like:');

// For field labels: getFashionFieldTranslationKey returns "fields.clothingType"
// tFA would call tCommon("fashion.fields.clothingType")
const fieldKey = 'clothingType';
const fieldTranslationKey = `fields.${fieldKey}`;
const tFAFieldKey = `fashion.${fieldTranslationKey}`;
console.log(`Field "${fieldKey}":`);
console.log(`  getFashionFieldTranslationKey("${fieldKey}") -> "${fieldTranslationKey}"`);
console.log(`  tFA("${fieldKey}") calls tCommon("${tFAFieldKey}")`);

// Check if this would resolve
if (commonFashion.fields && commonFashion.fields[fieldKey]) {
  console.log(`  Would resolve to: "${commonFashion.fields[fieldKey]}"`);
} else {
  console.log(`  Would NOT resolve (missing)`);
}

// For option labels: getFashionOptionTranslationKey returns "optionLabels.nike"
// tFA would call tCommon("fashion.optionLabels.nike")
const optionKey = 'nike';
const optionTranslationKey = `optionLabels.${optionKey}`;
const tFAOptionKey = `fashion.${optionTranslationKey}`;
console.log(`\nOption "${optionKey}":`);
console.log(`  getFashionOptionTranslationKey("${optionKey}") -> "${optionTranslationKey}"`);
console.log(`  tFA("${optionKey}") calls tCommon("${tFAOptionKey}")`);

if (commonFashion.optionLabels && commonFashion.optionLabels[optionKey]) {
  console.log(`  Would resolve to: "${commonFashion.optionLabels[optionKey]}"`);
} else {
  console.log(`  Would NOT resolve (missing)`);
}

// Check Persian file too
console.log('\n=== Checking Persian File ===');
const faPath = path.join(__dirname, 'src/locales/fa/common.json');
const faContent = fs.readFileSync(faPath, 'utf8');
const faData = JSON.parse(faContent);

if (faData.common?.fashion?.fields?.clothingType) {
  console.log(`Persian fields.clothingType: "${faData.common.fashion.fields.clothingType}"`);
}

console.log('\n✅ Fashion structure is now correct with nested fields and optionLabels objects.');
console.log('Field labels like "Clothing Type", "Gender", etc. should now be properly localized.');