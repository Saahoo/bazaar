const fs = require('fs');
const content = JSON.parse(fs.readFileSync('src/locales/en/common.json', 'utf8'));

console.log('Root keys:', Object.keys(content));
console.log('\nChecking common.realEstate...');
if (content.common && content.common.realEstate) {
  const realEstate = content.common.realEstate;
  console.log('realEstate keys count:', Object.keys(realEstate).length);
  console.log('First 5 keys:', Object.keys(realEstate).slice(0, 5));
  
  // Check some specific keys
  console.log('\nChecking specific keys:');
  const keys = ['listingType', 'forSale', 'propertyType', 'apartment'];
  keys.forEach(key => {
    console.log(`  ${key}:`, realEstate[key] ? `"${realEstate[key]}"` : 'MISSING');
  });
} else {
  console.log('common.realEstate not found');
  
  // Maybe realEstate is at root?
  if (content.realEstate) {
    console.log('But root.realEstate exists');
  }
}