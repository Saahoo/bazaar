#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read constants file
const constantsPath = path.join(__dirname, 'src/lib/constants/sports-hobby-wizard.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Read translation files
const enPath = path.join(__dirname, 'src/locales/en/common.json');
const faPath = path.join(__dirname, 'src/locales/fa/common.json');
const psPath = path.join(__dirname, 'src/locales/ps/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fa = JSON.parse(fs.readFileSync(faPath, 'utf8'));
const ps = JSON.parse(fs.readFileSync(psPath, 'utf8'));

// Helper to get nested value
function getValue(obj, path) {
  return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}

// Extract field keys from constants
const fieldKeys = new Set();
const optionValues = new Set();

// Extract from SPORTS_HOBBY_CONDITIONS
const conditionMatch = constantsContent.match(/export const SPORTS_HOBBY_CONDITIONS = \[([\s\S]*?)\]/);
if (conditionMatch) {
  const conditionLines = conditionMatch[1].split('\n');
  conditionLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Za-z][A-Za-z\/]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract from SKILL_LEVELS
const skillMatch = constantsContent.match(/export const SKILL_LEVELS = \[([\s\S]*?)\]/);
if (skillMatch) {
  const skillLines = skillMatch[1].split('\n');
  skillLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Za-z]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract from AGE_GROUPS
const ageMatch = constantsContent.match(/export const AGE_GROUPS = \[([\s\S]*?)\]/);
if (ageMatch) {
  const ageLines = ageMatch[1].split('\n');
  ageLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Za-z_0-9]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract from MATERIALS
const materialMatch = constantsContent.match(/export const MATERIALS = \[([\s\S]*?)\]/);
if (materialMatch) {
  const materialLines = materialMatch[1].split('\n');
  materialLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Za-z_]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract from CURRENCY_OPTIONS
const currencyMatch = constantsContent.match(/export const CURRENCY_OPTIONS = \[([\s\S]*?)\]/);
if (currencyMatch) {
  const currencyLines = currencyMatch[1].split('\n');
  currencyLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Z]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract from SELLER_TYPE_OPTIONS
const sellerMatch = constantsContent.match(/export const SELLER_TYPE_OPTIONS = \[([\s\S]*?)\]/);
if (sellerMatch) {
  const sellerLines = sellerMatch[1].split('\n');
  sellerLines.forEach(line => {
    const match = line.match(/'([^']+)'|"([^"]+)"|([A-Za-z]+)/);
    if (match) {
      const value = match[1] || match[2] || match[3];
      if (value && value.trim()) {
        optionValues.add(value.trim());
      }
    }
  });
}

// Extract field keys from getSportsHobbySpecsConfig function
const configMatch = constantsContent.match(/export const getSportsHobbySpecsConfig = \([\s\S]*?return \{([\s\S]*?)\};/);
if (configMatch) {
  const configContent = configMatch[1];
  // Look for key: patterns
  const keyRegex = /key:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = keyRegex.exec(configContent)) !== null) {
    fieldKeys.add(match[1]);
  }
}

// Also extract from subcategory-specific configs
const subcategoryRegex = /'([a-z-]+)':\s*\{[\s\S]*?fields:\s*\[([\s\S]*?)\]/g;
let subMatch;
while ((subMatch = subcategoryRegex.exec(constantsContent)) !== null) {
  const fieldsContent = subMatch[2];
  const fieldKeyRegex = /key:\s*['"]([^'"]+)['"]/g;
  let fieldMatch;
  while ((fieldMatch = fieldKeyRegex.exec(fieldsContent)) !== null) {
    fieldKeys.add(fieldMatch[1]);
  }
}

// Extract option values from options arrays in field definitions
const optionsRegex = /options:\s*\[([\s\S]*?)\]/g;
let optionsMatch;
while ((optionsMatch = optionsRegex.exec(constantsContent)) !== null) {
  const optionsContent = optionsMatch[1];
  const optionValueRegex = /['"]([^'"]+)['"]/g;
  let optionMatch;
  while ((optionMatch = optionValueRegex.exec(optionsContent)) !== null) {
    optionValues.add(optionMatch[1]);
  }
}

console.log('=== Field Keys Found ===');
console.log([...fieldKeys].sort().join(', '));
console.log(`Total: ${fieldKeys.size}`);

console.log('\n=== Option Values Found ===');
console.log([...optionValues].sort().join(', '));
console.log(`Total: ${optionValues.size}`);

// Check translations
console.log('\n=== Checking Persian Translations ===');
const faSportsHobby = getValue(fa, 'postAd.sportsHobby') || {};
const faFields = faSportsHobby.fields || {};
const faOptionLabels = faSportsHobby.optionLabels || {};

console.log('\nMissing Field Keys in Persian:');
const missingFaFields = [];
[...fieldKeys].sort().forEach(key => {
  if (!faFields[key]) {
    missingFaFields.push(key);
    console.log(`  - ${key}`);
  }
});

console.log('\nMissing Option Labels in Persian:');
const missingFaOptions = [];
[...optionValues].sort().forEach(option => {
  // Transform option key for lookup (lowercase, replace special chars)
  const optionKey = option.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
    
  if (!faOptionLabels[option] && !faOptionLabels[optionKey]) {
    missingFaOptions.push(option);
    console.log(`  - ${option} (key: ${optionKey})`);
  }
});

console.log('\n=== Checking Pashto Translations ===');
const psSportsHobby = getValue(ps, 'postAd.sportsHobby') || {};
const psFields = psSportsHobby.fields || {};
const psOptionLabels = psSportsHobby.optionLabels || {};

console.log('\nMissing Field Keys in Pashto:');
const missingPsFields = [];
[...fieldKeys].sort().forEach(key => {
  if (!psFields[key]) {
    missingPsFields.push(key);
    console.log(`  - ${key}`);
  }
});

console.log('\nMissing Option Labels in Pashto:');
const missingPsOptions = [];
[...optionValues].sort().forEach(option => {
  const optionKey = option.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
    
  if (!psOptionLabels[option] && !psOptionLabels[optionKey]) {
    missingPsOptions.push(option);
    console.log(`  - ${option} (key: ${optionKey})`);
  }
});

// Generate translation suggestions
console.log('\n=== Translation Suggestions ===');
console.log('\nFor Persian missing fields:');
missingFaFields.forEach(key => {
  // Suggest translation based on key
  let suggestion = '';
  if (key.includes('age')) suggestion = 'گروه سنی';
  else if (key.includes('material')) suggestion = 'جنس';
  else if (key.includes('type')) suggestion = 'نوع';
  else if (key.includes('size')) suggestion = 'اندازه';
  else if (key.includes('weight')) suggestion = 'وزن';
  else if (key.includes('color')) suggestion = 'رنگ';
  else if (key.includes('brand')) suggestion = 'برند';
  else suggestion = key;
  console.log(`  "${key}": "${suggestion}",`);
});

console.log('\nFor Pashto missing fields:');
missingPsFields.forEach(key => {
  let suggestion = '';
  if (key.includes('age')) suggestion = 'د عمر ګروپ';
  else if (key.includes('material')) suggestion = 'ماده';
  else if (key.includes('type')) suggestion = 'ډول';
  else if (key.includes('size')) suggestion = 'اندازه';
  else if (key.includes('weight')) suggestion = 'وزن';
  else if (key.includes('color')) suggestion = 'رنګ';
  else if (key.includes('brand')) suggestion = 'برانډ';
  else suggestion = key;
  console.log(`  "${key}": "${suggestion}",`);
});