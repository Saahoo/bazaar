#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read translation files
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const psPath = path.join(__dirname, 'src/locales/ps/common.json');
const faPath = path.join(__dirname, 'src/locales/fa/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ps = JSON.parse(fs.readFileSync(psPath, 'utf8'));
const fa = JSON.parse(fs.readFileSync(faPath, 'utf8'));

// Key paths to check in sportsHobby section
const keysToCheck = [
  'postAd.sportsHobby.photosRequired',
  'postAd.sportsHobby.videoHint',
  'postAd.sportsHobby.location',
  'postAd.sportsHobby.cityRequiredHint',
  'postAd.sportsHobby.exactLocation',
  'postAd.sportsHobby.mapHint',
  'postAd.sportsHobby.locationSelected',
  'postAd.sportsHobby.reviewConfirmation',
  'postAd.sportsHobby.noVideo',
  'postAd.sportsHobby.videoProvided',
  'postAd.sportsHobby.notProvided',
  'postAd.sportsHobby.yes',
  'postAd.sportsHobby.no',
  'postAd.sportsHobby.fields.price',
  'postAd.sportsHobby.fields.currency',
  'postAd.sportsHobby.fields.condition',
  'postAd.sportsHobby.fields.brand',
  'postAd.sportsHobby.fields.sellerType',
  'postAd.sportsHobby.optionLabels.New',
  'postAd.sportsHobby.optionLabels.Used',
  'postAd.sportsHobby.optionLabels.Refurbished',
  'postAd.sportsHobby.optionLabels.Individual',
  'postAd.sportsHobby.optionLabels.Dealer',
  'postAd.sportsHobby.optionLabels.Yes',
  'postAd.sportsHobby.optionLabels.No'
];

function getValue(obj, path) {
  return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}

console.log('=== Sports & Hobby Localization Verification ===\n');

let allPassed = true;

keysToCheck.forEach(key => {
  const enVal = getValue(en, key);
  const psVal = getValue(ps, key);
  const faVal = getValue(fa, key);
  
  const enExists = enVal !== undefined;
  const psExists = psVal !== undefined;
  const faExists = faVal !== undefined;
  
  const status = enExists && psExists && faExists ? '✓' : '✗';
  
  if (!enExists || !psExists || !faExists) {
    allPassed = false;
  }
  
  console.log(`${status} ${key}`);
  if (!enExists) console.log(`  Missing in English`);
  if (!psExists) console.log(`  Missing in Pashto`);
  if (!faExists) console.log(`  Missing in Farsi`);
});

// Check for CURRENCY_OPTIONS and SELLER_TYPE_OPTIONS translations
console.log('\n=== Checking Option Translations ===');

const currencyOptions = ['AFN', 'USD', 'PKR'];
const sellerTypeOptions = ['Individual', 'Dealer'];

console.log('\nCurrency options should be translated in optionLabels:');
currencyOptions.forEach(option => {
  const key = `postAd.sportsHobby.optionLabels.${option}`;
  const enVal = getValue(en, key);
  const psVal = getValue(ps, key);
  const faVal = getValue(fa, key);
  
  // These might not exist, which is OK - they'll fall back to the option value
  const status = enVal || psVal || faVal ? '✓' : '⚠';
  console.log(`${status} ${option}: EN="${enVal || 'N/A'}", PS="${psVal || 'N/A'}", FA="${faVal || 'N/A'}"`);
});

console.log('\nSeller type options:');
sellerTypeOptions.forEach(option => {
  const key = `postAd.sportsHobby.optionLabels.${option}`;
  const enVal = getValue(en, key);
  const psVal = getValue(ps, key);
  const faVal = getValue(fa, key);
  
  const status = enVal && psVal && faVal ? '✓' : '⚠';
  console.log(`${status} ${option}: EN="${enVal}", PS="${psVal}", FA="${faVal}"`);
});

// Check step labels
console.log('\n=== Checking Step Labels ===');
const stepKeys = [
  'postAd.sportsHobby.stepBasic',
  'postAd.sportsHobby.stepSpecs',
  'postAd.sportsHobby.stepMedia',
  'postAd.sportsHobby.stepContact',
  'postAd.sportsHobby.stepReview'
];

stepKeys.forEach(key => {
  const enVal = getValue(en, key);
  const psVal = getValue(ps, key);
  const faVal = getValue(fa, key);
  
  const status = enVal && psVal && faVal ? '✓' : '✗';
  console.log(`${status} ${key}: ${enVal ? 'Exists' : 'Missing'}`);
});

console.log('\n=== Summary ===');
if (allPassed) {
  console.log('✅ All critical translation keys exist in all three languages!');
} else {
  console.log('❌ Some translation keys are missing. Check above for details.');
}

process.exit(allPassed ? 0 : 1);