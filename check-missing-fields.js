#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read constants file
const constantsPath = path.join(__dirname, 'src/lib/constants/sports-hobby-wizard.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Read translation files
const faPath = path.join(__dirname, 'src/locales/fa/common.json');
const psPath = path.join(__dirname, 'src/locales/ps/common.json');

const fa = JSON.parse(fs.readFileSync(faPath, 'utf8'));
const ps = JSON.parse(fs.readFileSync(psPath, 'utf8'));

// Get sportsHobby sections
const faSportsHobby = fa.postAd?.sportsHobby || {};
const psSportsHobby = ps.postAd?.sportsHobby || {};

const faFields = faSportsHobby.fields || {};
const psFields = psSportsHobby.fields || {};

const faOptionLabels = faSportsHobby.optionLabels || {};
const psOptionLabels = psSportsHobby.optionLabels || {};

// Extract field keys from constants file
// Look for patterns like: { key: 'age_group', label: 'Age Group', ... }
const fieldKeyRegex = /key:\s*['"]([^'"]+)['"]/g;
const fieldKeys = new Set();
let match;
while ((match = fieldKeyRegex.exec(constantsContent)) !== null) {
  fieldKeys.add(match[1]);
}

// Also look for field definitions in arrays
const fieldsArrayRegex = /fields:\s*\[([\s\S]*?)\]/g;
let fieldsMatch;
while ((fieldsMatch = fieldsArrayRegex.exec(constantsContent)) !== null) {
  const fieldsContent = fieldsMatch[1];
  const keyMatches = fieldsContent.matchAll(/key:\s*['"]([^'"]+)['"]/g);
  for (const keyMatch of keyMatches) {
    fieldKeys.add(keyMatch[1]);
  }
}

console.log('=== Field Keys from Constants ===');
const sortedFieldKeys = [...fieldKeys].sort();
sortedFieldKeys.forEach(key => console.log(`  - ${key}`));
console.log(`Total: ${fieldKeys.size}`);

// Check Persian translations
console.log('\n=== Missing in Persian ===');
const missingFaFields = [];
sortedFieldKeys.forEach(key => {
  if (!faFields[key]) {
    missingFaFields.push(key);
    console.log(`  - ${key}`);
  }
});

// Check Pashto translations
console.log('\n=== Missing in Pashto ===');
const missingPsFields = [];
sortedFieldKeys.forEach(key => {
  if (!psFields[key]) {
    missingPsFields.push(key);
    console.log(`  - ${key}`);
  }
});

// Extract option values from constants
const optionValues = new Set();

// Look for arrays like: ['New', 'Like New', ...]
const optionArrayRegex = /export const \w+ = \[([\s\S]*?)\]/g;
let arrayMatch;
while ((arrayMatch = optionArrayRegex.exec(constantsContent)) !== null) {
  const arrayContent = arrayMatch[1];
  // Extract quoted strings
  const quotedMatches = arrayContent.matchAll(/['"]([^'"]+)['"]/g);
  for (const quotedMatch of quotedMatches) {
    optionValues.add(quotedMatch[1]);
  }
  // Also extract unquoted identifiers
  const unquotedMatches = arrayContent.matchAll(/\b([A-Z][A-Za-z\s\/&+-]+)\b/g);
  for (const unquotedMatch of unquotedMatches) {
    const val = unquotedMatch[1].trim();
    if (val && val.length > 1 && !val.includes('export') && !val.includes('const')) {
      optionValues.add(val);
    }
  }
}

console.log('\n=== Option Values from Constants ===');
const sortedOptions = [...optionValues].sort();
sortedOptions.forEach(opt => console.log(`  - ${opt}`));
console.log(`Total: ${optionValues.size}`);

// Check option translations
console.log('\n=== Missing Option Labels in Persian ===');
const missingFaOptions = [];
sortedOptions.forEach(option => {
  // Transform as in component
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

console.log('\n=== Missing Option Labels in Pashto ===');
const missingPsOptions = [];
sortedOptions.forEach(option => {
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

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Persian missing fields: ${missingFaFields.length}`);
console.log(`Persian missing options: ${missingFaOptions.length}`);
console.log(`Pashto missing fields: ${missingPsFields.length}`);
console.log(`Pashto missing options: ${missingPsOptions.length}`);

if (missingFaFields.length === 0 && missingFaOptions.length === 0) {
  console.log('\n✅ Persian translations are complete!');
} else {
  console.log('\n⚠ Persian needs translations for:');
  missingFaFields.forEach(f => console.log(`  - fields.${f}`));
  missingFaOptions.forEach(o => console.log(`  - optionLabels.${o}`));
}

if (missingPsFields.length === 0 && missingPsOptions.length === 0) {
  console.log('\n✅ Pashto translations are complete!');
} else {
  console.log('\n⚠ Pashto needs translations for:');
  missingPsFields.forEach(f => console.log(`  - fields.${f}`));
  missingPsOptions.forEach(o => console.log(`  - optionLabels.${o}`));
}