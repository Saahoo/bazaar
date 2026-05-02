const fs = require('fs');
const path = require('path');

const localeFiles = [
  'src/locales/en/common.json',
  'src/locales/fa/common.json',
  'src/locales/ps/common.json'
];

// Keys to fix: replace dots with underscores in engineCap keys
const keyReplacements = {
  'engineCap_up_1.3': 'engineCap_up_1_3',
  'engineCap_1.3_1.6': 'engineCap_1_3_1_6',
  'engineCap_1.6_2.0': 'engineCap_1_6_2_0',
  'engineCap_2.0_2.5': 'engineCap_2_0_2_5',
  'engineCap_2.5_3.0': 'engineCap_2_5_3_0',
  'engineCap_3.0_plus': 'engineCap_3_0_plus'
};

localeFiles.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Function to recursively process object
    function processObject(obj) {
      if (typeof obj !== 'object' || obj === null) return;
      
      // Create a new object with replaced keys
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        let newKey = key;
        if (keyReplacements[key]) {
          newKey = keyReplacements[key];
          console.log(`  Replacing key: "${key}" -> "${newKey}"`);
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          newObj[newKey] = processObject(value);
        } else {
          newObj[newKey] = value;
        }
      }
      return newObj;
    }
    
    const fixedData = processObject(data);
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2));
    console.log(`  ✓ Fixed ${filePath}`);
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('\nDone!');