const fs = require('fs');
const path = require('path');

const languages = ['en', 'fa', 'ps'];

languages.forEach(lang => {
  const filePath = path.join(__dirname, `src/locales/${lang}/common.json`);
  console.log(`Processing ${filePath}...`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (!data.common?.fashion) {
    console.log(`  common.fashion not found, skipping`);
    return;
  }
  
  const currentFashion = data.common.fashion;
  
  // Extract keys that belong to fields
  const fieldKeys = [
    'clothingType', 'gender', 'size', 'fitType', 'color', 'material', 'sleeveType',
    'pattern', 'season', 'occasion', 'authenticity', 'warranty', 'tagsAvailable',
    'model', 'shoeType', 'originalBox', 'usageType', 'bagType', 'closureType',
    'strapType', 'waterproof', 'type', 'style', 'displayType', 'strapMaterial',
    'dialShape', 'movement', 'waterResistant', 'stoneType', 'certification',
    'title', 'description', 'subcategory', 'price', 'condition', 'brand',
    'brandOther', 'sellerType', 'images', 'video', 'city', 'phone', 'whatsapp',
    'email', 'map'
  ];
  
  // Extract keys that belong to optionLabels
  const optionLabelKeys = [
    'other', 'new', 'used', 'individual', 'dealer', 'men', 'women', 'kids',
    'unisex', 'tshirt', 'shirt', 'jeans', 'dress', 'jacket', 'hoodie', 'xs',
    's', 'm', 'l', 'xl', 'xxl', 'custom', 'slim', 'regular', 'oversized',
    'black', 'white', 'blue', 'red', 'green', 'grey', 'brown', 'beige',
    'cotton', 'polyester', 'wool', 'denim', 'leather', 'silk', 'linen',
    'short', 'long', 'sleeveless', 'solid', 'printed', 'striped', 'checked',
    'summer', 'winter', 'all_season', 'casual', 'formal', 'party', 'sportswear',
    'original', 'replica', 'nike', 'adidas', 'levis', 'zara', 'hm', 'mango',
    'gucci', 'prada', 'carters', 'casio', 'gap_kids', 'hm_kids', 'next',
    'puma', 'skechers', 'bata', 'samsonite', 'michael_kors', 'coach',
    'local_brand', 'rayban', 'fossil', 'rolex', 'omega', 'apple', 'tiffany',
    'cartier', 'pandora', 'sneakers', 'boots', 'sandals', 'heels', 'sports',
    'synthetic', 'mesh', 'canvas', 'running', 'hiking', 'handbag', 'backpack',
    'travel_bag', 'laptop_bag', 'wallet', 'small', 'medium', 'large', 'zipper',
    'magnetic', 'buckle', 'single', 'double', 'adjustable', 'belt', 'hat',
    'sunglasses', 'scarf', 'analog', 'digital', 'smart', 'round', 'square',
    'rectangle', 'quartz', 'automatic', 'ring', 'necklace', 'bracelet',
    'earrings', 'gold', 'silver', 'diamond', 'platinum', 'artificial',
    'nylon', 'metal', 'rubber', 'fabric', 'plastic', 'none', 'ruby',
    'emerald', 'sapphire', 'air_max', 'classic', 'runner', 'street', 'sport',
    'smart_pro', 'vintage', 'yes', 'no'
  ];
  
  // Subcategory keys (start with 'subcategory')
  const subcategoryKeys = Object.keys(currentFashion).filter(k => k.startsWith('subcategory'));
  
  // Other keys (not fields, optionLabels, or subcategories)
  const otherKeys = Object.keys(currentFashion).filter(k => 
    !fieldKeys.includes(k) && 
    !optionLabelKeys.includes(k) && 
    !k.startsWith('subcategory')
  );
  
  // Create new fashion object with nested structure
  const newFashion = {};
  
  // Add subcategory keys
  subcategoryKeys.forEach(key => {
    newFashion[key] = currentFashion[key];
  });
  
  // Add other keys
  otherKeys.forEach(key => {
    newFashion[key] = currentFashion[key];
  });
  
  // Create fields object
  const fields = {};
  fieldKeys.forEach(key => {
    if (currentFashion[key] !== undefined) {
      fields[key] = currentFashion[key];
    }
  });
  
  // Create optionLabels object
  const optionLabels = {};
  optionLabelKeys.forEach(key => {
    if (currentFashion[key] !== undefined) {
      optionLabels[key] = currentFashion[key];
    }
  });
  
  // Add nested objects if they have content
  if (Object.keys(fields).length > 0) {
    newFashion.fields = fields;
  }
  
  if (Object.keys(optionLabels).length > 0) {
    newFashion.optionLabels = optionLabels;
  }
  
  console.log(`  Restructured: ${Object.keys(currentFashion).length} flat keys ->`);
  console.log(`    ${Object.keys(newFashion).length} top-level keys`);
  console.log(`    ${Object.keys(fields).length} field keys in nested 'fields' object`);
  console.log(`    ${Object.keys(optionLabels).length} option keys in nested 'optionLabels' object`);
  
  // Update the data
  data.common.fashion = newFashion;
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  Updated ${filePath}\n`);
});

console.log('Done! Fashion structure now has nested fields and optionLabels objects.');