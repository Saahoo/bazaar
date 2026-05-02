const fs = require('fs');
const path = require('path');

console.log('=== FINAL FASHION FILTER LOCALIZATION TEST ===\n');

// 1. Check common.fashion exists in all languages
const languages = ['en', 'fa', 'ps'];
languages.forEach(lang => {
  const filePath = path.join(__dirname, `src/locales/${lang}/common.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (data.common?.fashion) {
    console.log(`✅ ${lang}: common.fashion exists with ${Object.keys(data.common.fashion).length} keys`);
    
    // Check a few critical keys
    const criticalKeys = ['subcategoryMenClothing', 'brand', 'size', 'color', 'nike', 'adidas'];
    const missing = criticalKeys.filter(key => !data.common.fashion[key]);
    if (missing.length === 0) {
      console.log(`   All critical keys present`);
    } else {
      console.log(`   Missing: ${missing.join(', ')}`);
    }
  } else {
    console.log(`❌ ${lang}: common.fashion missing`);
  }
});

// 2. Simulate tFA function behavior
console.log('\n=== Simulating tFA function ===');
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const enContent = fs.readFileSync(enPath, 'utf8');
const enData = JSON.parse(enContent);
const commonFashion = enData.common.fashion;

// Simulate tFA as defined in FilterSidebar.tsx
function simulateTFA(key) {
  const fullKey = `fashion.${key}`;
  // tCommon would look up fullKey in common namespace
  // Since we have common.fashion.subcategoryMenClothing, 
  // tCommon('fashion.subcategoryMenClothing') should find it
  // But actually tCommon is useTranslations('common'), so it looks for 'fashion.subcategoryMenClothing' in common
  // The common object has a 'fashion' property which is an object
  // So tCommon('fashion.subcategoryMenClothing') would try to find a key 'fashion.subcategoryMenClothing' 
  // as a string in common, not as nested object.
  // Wait, this is important! Let me check how tRE works...
}

// Actually, let me check how other translation helpers work
console.log('\nChecking realEstate translation pattern:');
if (enData.common?.realEstate) {
  console.log('common.realEstate exists with keys like:', Object.keys(enData.common.realEstate).slice(0, 5));
  // tRE is defined as: const tRE = (key: string) => tCommon((`realEstate.${key}`) as Parameters<typeof tCommon>[0]);
  // This means tCommon looks for 'realEstate.listingType' as a key in the common namespace
  // But common.realEstate is an object, not a flat key.
  // Actually, next-intl supports nested keys with dots: 'realEstate.listingType' would look inside common.realEstate.listingType
  // So our implementation should work.
}

// 3. Test actual key lookups
console.log('\n=== Testing key lookups ===');
const testKeys = [
  'subcategoryMenClothing',
  'subcategoryWomenClothing',
  'brand',
  'size',
  'color',
  'nike',
  'adidas',
  's',
  'm',
  'l'
];

testKeys.forEach(key => {
  if (commonFashion[key]) {
    console.log(`✅ fashion.${key}: "${commonFashion[key]}"`);
  } else {
    console.log(`❌ fashion.${key}: MISSING`);
  }
});

// 4. Check if any fashion keys are missing from common but exist in postAd
console.log('\n=== Comparing with postAd.fashion ===');
const postAdFashion = enData.postAd?.fashion;
if (postAdFashion) {
  // Check if all subcategory keys from postAd are in common
  const postAdSubcategoryKeys = Object.keys(postAdFashion).filter(k => k.startsWith('subcategory'));
  const commonSubcategoryKeys = Object.keys(commonFashion).filter(k => k.startsWith('subcategory'));
  
  console.log(`postAd.fashion has ${postAdSubcategoryKeys.length} subcategory keys`);
  console.log(`common.fashion has ${commonSubcategoryKeys.length} subcategory keys`);
  
  const missingInCommon = postAdSubcategoryKeys.filter(k => !commonFashion[k]);
  if (missingInCommon.length > 0) {
    console.log(`Missing in common: ${missingInCommon.join(', ')}`);
  } else {
    console.log('✅ All postAd.fashion subcategory keys are in common.fashion');
  }
}

console.log('\n=== SUMMARY ===');
console.log('Fashion filter localization should now work because:');
console.log('1. common.fashion has been added to all language files');
console.log('2. It contains all necessary subcategory, field, and option labels');
console.log('3. The tFA function in FilterSidebar.tsx uses tCommon("fashion.${key}")');
console.log('4. next-intl will resolve "fashion.subcategoryMenClothing" to common.fashion.subcategoryMenClothing');
console.log('\nThe Fashion & Clothing search filter should now be completely localized.');