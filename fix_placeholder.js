const fs = require('fs');
const path = require('path');

// Add ceilingHeightPlaceholder to realEstate objects
const locales = ['en', 'fa', 'ps'];
const placeholderTranslations = {
  en: 'e.g. 5 meters',
  fa: 'مثلاً ۵ متر',
  ps: 'لکه ۵ متره'
};

for (const locale of locales) {
  const localePath = path.join(__dirname, `src/locales/${locale}/common.json`);
  if (!fs.existsSync(localePath)) {
    console.warn(`Locale file not found: ${localePath}`);
    continue;
  }
  
  const data = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  
  // Add to postAd.realEstate
  if (data.postAd && data.postAd.realEstate) {
    data.postAd.realEstate.ceilingHeightPlaceholder = placeholderTranslations[locale] || placeholderTranslations.en;
  }
  
  // Add to common.realEstate
  if (data.common && data.common.realEstate) {
    data.common.realEstate.ceilingHeightPlaceholder = placeholderTranslations[locale] || placeholderTranslations.en;
  }
  
  fs.writeFileSync(localePath, JSON.stringify(data, null, 2));
  console.log(`Added ceilingHeightPlaceholder to ${locale} locale`);
}

// Now update the FilterSidebar.tsx to use the translation key
const filterSidebarPath = path.join(__dirname, 'src/components/search/FilterSidebar.tsx');
let filterContent = fs.readFileSync(filterSidebarPath, 'utf8');

// Find the hard-coded placeholder "e.g. 5 meters"
// Line 2146: placeholder="e.g. 5 meters"
const pattern = /placeholder="e\.g\. 5 meters"/g;
if (filterContent.includes('placeholder="e.g. 5 meters"')) {
  // Replace with translation key
  filterContent = filterContent.replace(
    'placeholder="e.g. 5 meters"',
    'placeholder={tRE(\'ceilingHeightPlaceholder\')}'
  );
  fs.writeFileSync(filterSidebarPath, filterContent, 'utf8');
  console.log('Updated FilterSidebar.tsx to use translation key for ceiling height placeholder');
} else {
  console.log('Could not find the hard-coded placeholder in FilterSidebar.tsx');
  // Try to find it with different formatting
  const lines = filterContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('e.g. 5 meters')) {
      console.log(`Found at line ${i + 1}: ${lines[i].trim()}`);
      // Replace line
      lines[i] = lines[i].replace('e.g. 5 meters', "{tRE('ceilingHeightPlaceholder')}");
      fs.writeFileSync(filterSidebarPath, lines.join('\n'), 'utf8');
      console.log('Updated line');
      break;
    }
  }
}