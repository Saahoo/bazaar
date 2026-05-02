const fs = require('fs');
const path = require('path');

// Load translation files
const enCommon = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));

console.log('Checking common.fashion structure...');
console.log('common.fashion exists?', 'common' in enCommon && 'fashion' in enCommon.common);
console.log('common.fashion.fields exists?', 'common' in enCommon && 'fashion' in enCommon.common && 'fields' in enCommon.common.fashion);
console.log('common.fashion.optionLabels exists?', 'common' in enCommon && 'fashion' in enCommon.common && 'optionLabels' in enCommon.common.fashion);

// Check specific keys
console.log('\nChecking fields.clothingType:');
console.log('Path: common.fashion.fields.clothingType');
const clothingType = enCommon.common?.fashion?.fields?.clothingType;
console.log('Value:', clothingType);

console.log('\nChecking optionLabels.nike:');
console.log('Path: common.fashion.optionLabels.nike');
const nike = enCommon.common?.fashion?.optionLabels?.nike;
console.log('Value:', nike);

console.log('\nChecking optionLabels.s:');
console.log('Path: common.fashion.optionLabels.s');
const s = enCommon.common?.fashion?.optionLabels?.s;
console.log('Value:', s);

console.log('\nChecking optionLabels.new:');
console.log('Path: common.fashion.optionLabels.new');
const newLabel = enCommon.common?.fashion?.optionLabels?.new;
console.log('Value:', newLabel);

// List all fields keys
console.log('\nAll fields keys:');
const fields = enCommon.common?.fashion?.fields;
if (fields) {
  Object.keys(fields).forEach(key => {
    console.log(`  ${key}: "${fields[key]}"`);
  });
}

// List first 20 optionLabels keys
console.log('\nFirst 20 optionLabels keys:');
const optionLabels = enCommon.common?.fashion?.optionLabels;
if (optionLabels) {
  const keys = Object.keys(optionLabels);
  keys.slice(0, 20).forEach(key => {
    console.log(`  ${key}: "${optionLabels[key]}"`);
  });
  console.log(`  ... and ${keys.length - 20} more`);
}

// Test the lookup function from earlier
console.log('\n=== Testing lookup function ===');
function simulateTFA(key) {
  const fullKey = `fashion.${key}`;
  const parts = fullKey.split('.');
  let current = enCommon;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
}

console.log('simulateTFA("fields.clothingType"):', simulateTFA('fields.clothingType'));
console.log('simulateTFA("optionLabels.nike"):', simulateTFA('optionLabels.nike'));
console.log('simulateTFA("optionLabels.s"):', simulateTFA('optionLabels.s'));

// Check if nike exists in optionLabels
console.log('\nChecking if "nike" is in optionLabels:');
if (optionLabels) {
  console.log('Has "nike"?', 'nike' in optionLabels);
  console.log('Has "adidas"?', 'adidas' in optionLabels);
  console.log('Has "casio"?', 'casio' in optionLabels);
}