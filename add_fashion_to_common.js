const fs = require('fs');
const path = require('path');

const languages = ['en', 'fa', 'ps'];

languages.forEach(lang => {
  const filePath = path.join(__dirname, `src/locales/${lang}/common.json`);
  console.log(`Processing ${filePath}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  // Check if postAd.fashion exists
  if (!data.postAd?.fashion) {
    console.error(`  postAd.fashion not found in ${lang}`);
    return;
  }
  
  // Check if common.fashion already exists
  if (data.common?.fashion) {
    console.log(`  common.fashion already exists in ${lang}, skipping`);
    return;
  }
  
  // Extract needed keys from postAd.fashion
  const postAdFashion = data.postAd.fashion;
  
  // Create fashion object for common
  // We'll include subcategory labels, field labels, and option labels
  const fashionForCommon = {};
  
  // Add subcategory labels (keys starting with "subcategory")
  Object.keys(postAdFashion).forEach(key => {
    if (key.startsWith('subcategory')) {
      fashionForCommon[key] = postAdFashion[key];
    }
  });
  
  // Add field labels (from fields object)
  if (postAdFashion.fields) {
    Object.keys(postAdFashion.fields).forEach(key => {
      fashionForCommon[key] = postAdFashion.fields[key];
    });
  }
  
  // Add option labels (from optionLabels object)
  if (postAdFashion.optionLabels) {
    Object.keys(postAdFashion.optionLabels).forEach(key => {
      fashionForCommon[key] = postAdFashion.optionLabels[key];
    });
  }
  
  console.log(`  Adding ${Object.keys(fashionForCommon).length} keys to common.fashion`);
  
  // Add fashion to common object
  if (!data.common) {
    data.common = {};
  }
  
  // Insert fashion after electronics in common object
  // We need to preserve order, so we'll rebuild the common object
  const commonKeys = Object.keys(data.common);
  const newCommon = {};
  
  let inserted = false;
  for (const key of commonKeys) {
    newCommon[key] = data.common[key];
    if (key === 'electronics') {
      // Insert fashion after electronics
      newCommon['fashion'] = fashionForCommon;
      inserted = true;
    }
  }
  
  // If electronics not found, just append at the end
  if (!inserted) {
    newCommon['fashion'] = fashionForCommon;
  }
  
  data.common = newCommon;
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  Updated ${filePath}`);
});

console.log('\nDone!');