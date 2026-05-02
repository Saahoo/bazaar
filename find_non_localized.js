const fs = require('fs');
const path = require('path');

// Read the VehicleFilter.tsx file
const vehicleFilterPath = path.join(__dirname, 'src/components/search/VehicleFilter.tsx');
const content = fs.readFileSync(vehicleFilterPath, 'utf8');

// Find all string literals (excluding imports and empty strings)
const stringLiterals = [];
const regex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
let match;

while ((match = regex.exec(content)) !== null) {
  const str = match[0];
  // Skip empty strings, single/double quotes that are likely not UI text
  if (str.length > 2 && !str.includes('use client') && !str.includes('import') && 
      !str.includes('export') && !str.includes('React') && !str.includes('next-intl') &&
      !str.includes('@/') && !str.includes('className') && !str.includes('id=') &&
      !str.includes('type=') && !str.includes('value=') && !str.includes('onChange=') &&
      !str.includes('selected') && !str.includes('options') && !str.includes('key=')) {
    
    // Get line number
    const lines = content.substring(0, match.index).split('\n');
    const lineNum = lines.length;
    const lineText = lines[lines.length - 1] + content.substring(match.index, match.index + 50);
    
    stringLiterals.push({
      text: str,
      line: lineNum,
      context: lineText.substring(0, 100) + '...'
    });
  }
}

console.log('=== Non-localized strings in VehicleFilter.tsx ===\n');
console.log(`Found ${stringLiterals.length} potential non-localized strings:\n`);

stringLiterals.forEach((item, i) => {
  console.log(`${i+1}. Line ${item.line}: ${item.text}`);
  console.log(`   Context: ${item.context}`);
  console.log();
});

// Also check for hardcoded default parameter in Sel component
console.log('=== Specific issues found ===\n');

// Check for default parameter 'Filter' in Sel component
const selComponentMatch = content.match(/label = '([^']+)'/);
if (selComponentMatch) {
  console.log(`1. Hardcoded default parameter in Sel component: '${selComponentMatch[1]}'`);
  console.log('   Should be localized using tSearch(\'filter\') or similar\n');
}

// Check if vehicle type names are using translation keys or hardcoded
const vehicleTypeMatch = content.match(/type\[`name_\$\{locale\}`/);
if (vehicleTypeMatch) {
  console.log('2. Vehicle type names using dynamic property access');
  console.log('   This uses name_en, name_fa, name_ps properties from constants');
  console.log('   Check if these constants have proper translation keys\n');
}

// Check for any other potential issues
const lines = content.split('\n');
lines.forEach((line, index) => {
  const lineNum = index + 1;
  // Look for hardcoded text in JSX that might not be using translation functions
  if (line.includes('>') && line.includes('<') && 
      (line.includes('"') || line.includes("'")) &&
      !line.includes('tSearch') && !line.includes('tCommon') && !line.includes('tVH') &&
      !line.includes('className') && !line.includes('id=') && !line.includes('value=') &&
      !line.includes('onChange') && !line.includes('type=') && !line.includes('placeholder=') &&
      line.trim().length > 10) {
    
    // Check if it's a string literal that might be UI text
    const hasString = /["']([^"']{3,})["']/.test(line);
    if (hasString) {
      console.log(`Potential non-localized UI text at line ${lineNum}:`);
      console.log(`   ${line.trim()}`);
      console.log();
    }
  }
});