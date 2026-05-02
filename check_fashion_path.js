// Check if postAd.fashion exists in translation files
const fs = require('fs');
const path = require('path');

// Load translation files
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));

console.log('Checking translation structure...\n');

// Check if common.postAd.fashion exists
console.log('enTranslations has "common"?', 'common' in enTranslations);
console.log('enTranslations.common has "postAd"?', enTranslations.common && 'postAd' in enTranslations.common);
console.log('enTranslations.common.postAd has "fashion"?', enTranslations.common && enTranslations.common.postAd && 'fashion' in enTranslations.common.postAd);

if (enTranslations.common && enTranslations.common.postAd && enTranslations.common.postAd.fashion) {
  console.log('\nFashion object exists under postAd!');
  console.log('Keys in fashion:', Object.keys(enTranslations.common.postAd.fashion).slice(0, 20));
  
  // Check specific key
  console.log('\nsubcategoryMenClothing exists?', 'subcategoryMenClothing' in enTranslations.common.postAd.fashion);
  console.log('subcategoryMenClothing value:', enTranslations.common.postAd.fashion.subcategoryMenClothing);
}

// Also check if there's a fashion directly under common (not under postAd)
console.log('\n--- Checking for fashion directly under common ---');
console.log('enTranslations.common has "fashion" (direct)?', enTranslations.common && 'fashion' in enTranslations.common);

// Check the actual structure by looking at a specific path
console.log('\n--- Testing actual navigation ---');
const testPath = 'common.postAd.fashion.subcategoryMenClothing';
const parts = testPath.split('.');
let current = enTranslations;

for (const part of parts) {
  console.log(`  Part: ${part}, exists?`, current && typeof current === 'object' && part in current);
  if (current && typeof current === 'object' && part in current) {
    current = current[part];
  } else {
    current = null;
    break;
  }
}

console.log(`Final value:`, current);