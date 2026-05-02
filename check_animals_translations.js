const fs = require('fs');
const path = require('path');

// Read translation files
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/en/common.json'), 'utf8'));
const ps = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/ps/common.json'), 'utf8'));
const fa = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/fa/common.json'), 'utf8'));

// Get animals option labels from English file
const enOptions = en.postAd?.animals?.optionLabels || {};
const psOptions = ps.postAd?.animals?.optionLabels || {};
const faOptions = fa.postAd?.animals?.optionLabels || {};

console.log('=== Checking Animals & Livestock Translation Keys ===\n');

// Check all option keys from English file
const allOptionKeys = Object.keys(enOptions);
console.log(`Total option keys in English: ${allOptionKeys.length}`);

// Check for missing keys in Pashto and Farsi
const missingInPashto = [];
const missingInFarsi = [];

allOptionKeys.forEach(key => {
  if (!psOptions.hasOwnProperty(key)) {
    missingInPashto.push(key);
  }
  if (!faOptions.hasOwnProperty(key)) {
    missingInFarsi.push(key);
  }
});

console.log(`\nMissing in Pashto (${missingInPashto.length}):`);
if (missingInPashto.length > 0) {
  missingInPashto.forEach(key => console.log(`  - "${key}": "${enOptions[key]}"`));
} else {
  console.log('  None - all keys present!');
}

console.log(`\nMissing in Farsi (${missingInFarsi.length}):`);
if (missingInFarsi.length > 0) {
  missingInFarsi.forEach(key => console.log(`  - "${key}": "${enOptions[key]}"`));
} else {
  console.log('  None - all keys present!');
}

// Check specific dropdown options mentioned by user
const specificOptions = [
  'Vaccinated', 'Dewormed', 'Veterinary Certificate Available', 'Healthy (No Issues)', 'Under Treatment', 'Not Vaccinated',
  'Fixed', 'Negotiable', 'Per Head',
  'days', 'months', 'years',
  'Male', 'Female', 'Mixed',
  'Not Pregnant', 'Pregnant', 'Recently Calved',
  'Horned', 'Polled', 'Dehorned'
];

console.log('\n=== Checking Specific Dropdown Options ===');
specificOptions.forEach(option => {
  const enVal = enOptions[option];
  const psVal = psOptions[option];
  const faVal = faOptions[option];
  
  console.log(`\n"${option}":`);
  console.log(`  English: ${enVal || 'MISSING'}`);
  console.log(`  Pashto: ${psVal || 'MISSING'}`);
  console.log(`  Farsi: ${faVal || 'MISSING'}`);
});

// Check breed options
const breedOptions = [
  'Holstein', 'Jersey', 'Angus', 'Hereford', 'Brahman', 'Limousin', 'Simmental', 'Local Breed',
  'Broiler', 'Layer', 'Desi', 'Silkie', 'Australorp', 'Leghorn', 'Rhode Island Red',
  'Merino', 'Dorper', 'Boer', 'Saanen', 'Alpine', 'Nubian',
  'Arabian', 'Thoroughbred', 'Quarter Horse', 'Appaloosa', 'Pony',
  'Persian Cat', 'German Shepherd', 'Labrador', 'Golden Retriever', 'Siamese Cat', 'Parrot', 'Rabbit', 'Hamster',
  'Goldfish', 'Koi', 'Tilapia', 'Catfish', 'Guppy', 'Betta', 'Local Species',
  'Other'
];

console.log('\n=== Checking Breed Options ===');
const missingBreedsInPashto = breedOptions.filter(b => !psOptions[b]);
const missingBreedsInFarsi = breedOptions.filter(b => !faOptions[b]);

console.log(`Missing breed translations in Pashto: ${missingBreedsInPashto.length}`);
if (missingBreedsInPashto.length > 0) {
  missingBreedsInPashto.forEach(b => console.log(`  - ${b}`));
}

console.log(`\nMissing breed translations in Farsi: ${missingBreedsInFarsi.length}`);
if (missingBreedsInFarsi.length > 0) {
  missingBreedsInFarsi.forEach(b => console.log(`  - ${b}`));
}