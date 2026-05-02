# Fashion & Clothing Category Localization Implementation

## Overview
This document outlines the localization implementation for the Fashion & Clothing category's `BaseListingDetails` page. The implementation leverages the existing dynamic field mapping system to provide comprehensive localization support across English (en), Pashto (ps), and Farsi (fa) languages.

## Key Components

### 1. BaseListingDetails Component
**Location:** `src/components/listing/BaseListingDetails.tsx`

The Fashion & Clothing category uses the same `BaseListingDetails` component as other categories, with localization provided through:

- **Dynamic Field Mapping:** Uses `transformFieldsForDisplay()` to map fashion-specific fields to display sections
- **Translation Keys:** All field labels use translation keys from `listingFields.ts`
- **RTL Support:** Automatic right-to-left layout for Pashto and Farsi locales
- **Locale-aware Formatting:** Number, currency, and date formatting based on user locale

### 2. Fashion Field Configuration
**Location:** `src/config/listingFields.ts`

The Fashion & Clothing category (ID: 4) has 30+ fields defined with proper translation keys:

```typescript
// Example fashion fields
{
  key: 'subcategory',
  labelKey: 'listing.subcategory',  // Uses generic listing translation
  category: 4,
  section: 'specifications',
  type: 'text',
  priority: 10,
},
{
  key: 'clothingType',
  labelKey: 'postAd.fashion.fields.clothingType',  // Uses fashion-specific translation
  category: 4,
  section: 'specifications',
  type: 'text',
  priority: 4,
},
```

### 3. Translation Files
**Location:** `src/locales/{en,ps,fa}/common.json`

All fashion field labels and option labels are fully translated in all three locales:

#### Field Labels (`postAd.fashion.fields`):
- `clothingType`, `gender`, `size`, `color`, `material`, `sleeveType`, `pattern`, `season`, `occasion`, `authenticity`, `warranty`, `tagsAvailable`, `model`, `shoeType`, `originalBox`, `usageType`, `bagType`, `closureType`, `strapType`, `waterproof`, `type`, `style`, `displayType`, `strapMaterial`, `dialShape`, `movement`, `waterResistant`, `stoneType`, `certification`

#### Generic Field Labels (`listing`):
- `subcategory`, `brand`, `size`, `color`, `material`, `gender`, `model`, `condition`, `warranty`, `originalBox`, `ageGroup`, `shipping`, `delivery`

#### Option Labels (`postAd.fashion.optionLabels`):
- 100+ fashion-specific option labels including clothing types, sizes, colors, materials, brands, etc.
- Complete translations for all fashion subcategories (Men Clothing, Women Clothing, Kids Clothing, Shoes, Bags, Accessories, Watches, Jewelry)

### 4. Field Mapping Configuration
**Location:** `src/lib/listing/fieldMappingUtils.ts`

Fashion fields are mapped to display sections (specs, highlights, details) based on category-specific overrides:

```typescript
// Fashion & Clothing category overrides (category ID: 4)
4: {
  'subcategory': 'specs',
  'size': 'specs',
  'color': 'highlights',
  'material': 'specs',
  'brand': 'specs',
  'condition': 'highlights',
  'gender': 'specs',
  'clothingType': 'specs',
  'fitType': 'specs',
  'sleeveType': 'specs',
  'pattern': 'specs',
  'season': 'details',
  'occasion': 'details',
  'authenticity': 'highlights',
  'model': 'specs',
  'shoeType': 'specs',
  'bagType': 'specs',
  'closureType': 'specs',
  'strapType': 'specs',
  'type': 'specs',
  'displayType': 'specs',
  'strapMaterial': 'specs',
  'dialShape': 'specs',
  'movement': 'specs',
  'stoneType': 'specs',
  'certification': 'highlights',
  'warranty': 'highlights',
  'tagsAvailable': 'details',
  'originalBox': 'highlights',
  'waterproof': 'highlights',
  'waterResistant': 'highlights',
  'ageGroup': 'details',
  'style': 'highlights',
  'usageType': 'details',
  'warrantyText': 'details',
  'shipping': 'details',
  'delivery': 'details',
}
```

## Localization Features

### 1. Multi-language Support
- **English (en):** Left-to-right layout, Western date/number formatting
- **Pashto (ps):** Right-to-left layout, Persian/Arabic script, Gregorian calendar
- **Farsi (fa):** Right-to-left layout, Persian script, Persian calendar

### 2. RTL (Right-to-Left) Support
The `BaseListingDetails` component automatically detects RTL languages and adjusts:
- Text alignment (`text-right` for RTL, `text-left` for LTR)
- Image navigation button positions (swapped left/right)
- Table cell alignment

### 3. Locale-aware Formatting
- **Numbers:** Formatted with locale-specific thousands separators
- **Dates:** Formatted according to locale calendar (Gregorian for en/ps, Persian for fa)
- **Currency:** Formatted with locale-specific currency symbols and formatting

### 4. Translation Key Resolution
The component uses `useTranslations()` hook with the following resolution order:
1. Field-specific translation keys (e.g., `postAd.fashion.fields.clothingType`)
2. Generic listing translation keys (e.g., `listing.subcategory`)
3. Fallback to the key itself if translation not found

## Implementation Details

### Field Display Logic
1. **Field Retrieval:** `getFieldsForCategory(4)` retrieves all fashion fields
2. **Transformation:** `transformFieldsForDisplay()` maps fields with values to display sections
3. **Grouping:** `groupFieldsBySection()` organizes fields into specs, highlights, details
4. **Rendering:** BaseListingDetails renders each section with proper RTL support

### Translation Coverage
All fashion-related translations are complete across all three locales:
- **Field Labels:** 100% coverage for all fashion fields
- **Option Labels:** 100+ fashion-specific options fully translated
- **Generic Labels:** Common fields like condition, warranty, etc. available in all locales

### Translation Status
All translation keys are now complete across all three locales. The previously missing generic `listing.` keys have been added:

**Added 12 missing translation keys:**
- `listing.subcategory` ✓ Added (English: "Subcategory", Pashto: "فرعي کټګوري", Farsi: "زیردسته")
- `listing.brand` ✓ Added (English: "Brand", Pashto: "برانډ", Farsi: "برند")
- `listing.size` ✓ Added (English: "Size", Pashto: "اندازه", Farsi: "سایز")
- `listing.color` ✓ Added (English: "Color", Pashto: "رنګ", Farsi: "رنگ")
- `listing.material` ✓ Added (English: "Material", Pashto: "مواد", Farsi: "جنس")
- `listing.gender` ✓ Added (English: "Gender", Pashto: "جنس", Farsi: "جنسیت")
- `listing.model` ✓ Added (English: "Model", Pashto: "ماډل", Farsi: "مدل")
- `listing.warranty` ✓ Added (English: "Warranty", Pashto: "ضمانت", Farsi: "گارانتی")
- `listing.originalBox` ✓ Added (English: "Original Box", Pashto: "اصلي بکس", Farsi: "جعبه اصلی")
- `listing.ageGroup` ✓ Added (English: "Age Group", Pashto: "د عمر ګروپ", Farsi: "گروه سنی")
- `listing.shipping` ✓ Added (English: "Shipping", Pashto: "لېږد", Farsi: "حمل و نقل")
- `listing.delivery` ✓ Added (English: "Delivery", Pashto: "تحویل", Farsi: "تحویل")

All fashion field labels now have 100% translation coverage across English, Pashto, and Farsi locales.

## Testing & Validation

### Translation Verification
- ✓ All fashion field labels verified in en, ps, fa locales
- ✓ All fashion option labels verified in en, ps, fa locales
- ✓ BaseListingDetails uses proper translation keys
- ✓ RTL support tested for fashion display

### RTL Support Verification
- ✓ Text alignment adjusts automatically for RTL languages
- ✓ Image navigation buttons swap positions correctly
- ✓ Table cells use proper text alignment
- ✓ PhotoLightbox component handles RTL arrow key navigation

### Display Validation
- ✓ Fashion fields properly mapped to display sections
- ✓ Field values formatted according to locale
- ✓ Option labels translated correctly
- ✓ All fashion subcategories supported

## Usage Example

```typescript
// Using BaseListingDetails with fashion data
<BaseListingDetails<FashionListing>
  listingData={fashionListing}
  sellerData={seller}
  loading={false}
  locale="fa" // or "en", "ps"
/>
```

## Future Improvements

1. **Fashion-specific formatting:** Consider adding custom format functions for fashion-specific fields
2. **Enhanced RTL styling:** Additional CSS improvements for fashion-specific layouts
3. **Cultural adaptations:** Region-specific fashion imagery and styling preferences

## Files Modified

1. **`src/config/listingFields.ts`** - Added 30+ fashion fields with proper translation keys
2. **`src/lib/listing/fieldMappingUtils.ts`** - Added fashion section overrides for field mapping
3. **Translation files** - All fashion translations verified as complete:
   - `src/locales/en/common.json`
   - `src/locales/ps/common.json`
   - `src/locales/fa/common.json`

## Conclusion
The Fashion & Clothing category localization is fully implemented and integrated with the existing `BaseListingDetails` component. All field labels, option labels, and UI elements are properly translated across all three supported languages with full RTL support for Pashto and Farsi.