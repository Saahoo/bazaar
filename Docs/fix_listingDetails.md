**Task: Fix ListingDetail Page (Real Estate) – Structure, UI, Localization, and Data Consistency**

The ListingDetail page for the Real Estate category has multiple critical issues in layout, data rendering, and localization. The page must be refactored and cleaned up.

---

## 🚨 Issues Identified (From UI Screenshot)

### 1. Duplicate Sections (Major UX Problem)

* Two separate sections exist:

  * **"Ad Details"**
  * **"Details"**
* Both contain overlapping or related data
* This creates confusion and poor UX

---

### 2. Inconsistent Field Structure

* Fields are displayed in:

  * Different formats
  * Different grouping logic
* Some are simple (e.g. Bathrooms: 3)
* Others are nested (e.g. Amenities > Gym)
* No consistent hierarchy

---

### 3. Broken Labels / Raw Keys / Mixed Format

* Labels like:

  * `Address > City`
  * `Amenities > Swimming Pool`
  * `Contact > Phone`
* These are:

  * Hardcoded
  * Not localized
  * Not user-friendly

---

### 4. Mixed Languages in Same Section

* English + Dari/Pashto shown together
* Example:

  * "Details" + "اپارتمان"
* Indicates broken i18n implementation

---

### 5. Poor Layout & Alignment

* Two-column layout is messy:

  * Labels and values not aligned properly
  * Some rows overflow or break layout
* Long labels (e.g. Amenities) break UI consistency

---

### 6. Data Not Matching Clean UI Format

* Raw structured data shown directly:

  * `Amenities > Gym: No`
  * Instead of grouped display (Amenities section)

---

### 7. Redundant / Low-Value Fields

* Some fields should be grouped or simplified:

  * Amenities (too many individual rows)
  * Contact info split awkwardly

---

## ✅ Required Fixes

### 1. Merge Sections into ONE Clean Section

* Remove:

  * "Ad Details"
* Keep only ONE section:
  👉 **"Property Details" (localized)**

---

### 2. Redesign Layout (Clean + Structured)

#### Suggested Structure:

**Section: Property Details**

* Price
* Property Type
* Bedrooms
* Bathrooms
* Area
* Condition
* Furnishing

**Section: Location**

* City
* District

**Section: Features / Amenities**

* Gym
* Garden
* Internet
* Security
* Swimming Pool
* etc.

**Section: Additional Info**

* Listing Type
* Price Type
* Negotiable
* Available From
* Floor Number

**Section: Description**

* Full description text (full width)

---

### 3. Proper Label Formatting

* Remove symbols like:

  * `>` from labels
* Replace with clean labels:

  * `Address > City` → `City`
  * `Amenities > Gym` → `Gym`

---

### 4. Fix Localization (EN / FA / PS)

* ALL labels must use translation keys:

  ```js
  t('listing.city')
  ```
* Ensure:

  * No English fallback in FA/PS mode
  * No raw keys displayed

---

### 5. Group Nested Data Properly

* Instead of:

  * Showing each Amenity as separate flat row
* Convert into:

  * Grouped UI (icons, checklist, or tags)

Example:

```
Amenities:
✔ Gym
✖ Garden
✔ Internet
```

---

### 6. Improve UI Design

* Use:

  * Card-based sections
  * Consistent spacing
  * Equal label/value alignment
* Avoid long horizontal rows
* Use responsive grid (2 columns → 1 column on mobile)

---

### 7. Fix Data Mapping

* Ensure all fields:

  * Come directly from Listing Wizard schema
  * No extra or missing fields
* Use centralized config:
  `/config/realEstateFields.js`

---

### 8. Clean Value Formatting

* Format values properly:

  * Price → with commas (1,000,000)
  * Boolean → localized (Yes/No → بلی / خیر)
  * Dates → localized format

---

### 9. Remove Redundant Fields

* Remove duplicate or unnecessary fields:

  * Avoid repeating same data in multiple places

---

### 🎯 Final Expected Result:

* ONE clean, well-structured details section
* Fully localized (EN / FA / PS)
* No duplicate sections
* No raw keys or broken labels
* Modern, clean, marketplace-style UI
* Logical grouping of data (not flat messy list)

---

## ⚠️ Important Rule:

👉 ListingDetail page MUST mirror Listing Wizard structure
👉 No hardcoded fields allowed
👉 Everything must be schema-driven
