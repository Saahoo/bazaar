// Test script to check Fashion filter localization - debug version
const fs = require('fs');
const path = require('path');

// Read the translation files
const enJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const faJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));
const psJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));

console.log('Checking JSON structure...\n');

// Check if common exists
console.log('enJson has common?', 'common' in enJson);
console.log('enJson.common type:', typeof enJson.common);
console.log('enJson.common keys:', Object.keys(enJson.common || {}));

// Check if fashion exists under common
console.log('\nenJson.common.fashion?', enJson.common?.fashion ? 'YES' : 'NO');
if (enJson.common?.fashion) {
  console.log('enJson.common.fashion keys:', Object.keys(enJson.common.fashion));
  console.log('Sample subcategoryMenClothing:', enJson.common.fashion.subcategoryMenClothing);
}

// Let me check a specific path
console.log('\nDirect access test:');
console.log('enJson.common?.fashion?.subcategoryMenClothing:', enJson.common?.fashion?.subcategoryMenClothing);
console.log('enJson.common?.fashion?.subcategoryWomenClothing:', enJson.common?.fashion?.subcategoryWomenClothing);

// Check the actual file content at line 1426
console.log('\nChecking file content around line 1426...');
const enContent = fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8');
const lines = enContent.split('\n');
for (let i = 1420; i < 1435; i++) {
  if (lines[i] && lines[i].includes('subcategory')) {
    console.log(`Line ${i}: ${lines[i]}`);
  }
}