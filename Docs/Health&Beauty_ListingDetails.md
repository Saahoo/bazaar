Create a **Health & Beauty Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display beauty and health products with ingredient transparency
* Match fields from Health & Beauty Listing Wizard
* Emphasize safety, authenticity, and composition details
* Optimize for health-conscious and informed shoppers

---

# 📂 Category:

Health & Beauty

## Subcategories:

* Skincare
* Haircare
* Makeup
* Fragrances
* Personal Care
* Health Care Products
* Beauty Tools & Devices
* Other

---

# 🧱 Page Structure

## 🖼️ 1. Product Image Gallery (Top Section)

* Main product image (large, clear)
* Product packaging front and back
* Product label with ingredients/instructions
* Thumbnail slider below (up to 12 images)
* Click to open full-screen gallery
* Ingredient list close-up (if visible)
* Expiry date visible in photos

---

## 📌 2. Title & Price Section

* Product Name/Title
* Product Brand
* Price (formatted with currency)
* Condition badge (New / Like New)
* Location (City)
* Posted Date
* Product ID / Batch Number (if visible)
* Stock Availability Indicator
* Save / Favorite button
* Share button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as pills/badges:

* **For Skincare:** Skin Type, Concern, SPF
* **For Haircare:** Hair Type, Concern, Size
* **For Makeup:** Product Type, Shade, Coverage
* **For Fragrance:** Gender, Fragrance Type, Size
* **For Tools:** Product Type, Power Source, Feature Count
* **Universal:** Brand, Expiry Status, Authenticity

---

## 📝 4. Description Section

* Full product description
* Product benefits and uses
* Best for (skin type, hair type, etc.)
* Usage instructions (if important)
* "Read More / Show Less" toggle

---

## 🧾 5. Product Specifications (Category-Specific)

### 🧴 Skincare Products

* **Product Information**
  * Product Type (Cleanser, Moisturizer, Serum, Mask, Sunscreen, etc.)
  * Brand Name
* **Formulation & Benefits**
  * Skin Type (Oily, Dry, Combination, Sensitive, All)
  * Skin Concern (multiselect) - Acne, Aging, Hyperpigmentation, Sensitivity, etc.
  * Formulation Type (Gel, Cream, Oil, Serum, Emulsion, etc.)
  * SPF (if sunscreen)
  * SPF Value (if applicable)
* **Ingredients**
  * Main Ingredients (Key active ingredients)
  * Full Ingredients List (expandable)
  * Organic / Natural (Yes/No)
  * Dermatologically Tested (Yes/No)
  * Hypoallergenic (Yes/No)
* **Application**
  * Gender (applicable if limited)
  * Package Size (ml/oz)
  * Application Frequency
* **Expiry & Storage**
  * Manufacturing Date
  * Expiry Date
  * Storage Instructions

---

### 💇 Haircare Products

* **Product Information**
  * Product Type (Shampoo, Conditioner, Oil, Mask, Treatment, etc.)
  * Brand Name
* **Hair & Benefits**
  * Hair Type (Normal, Oily, Dry, Curly, Damaged, All)
  * Hair Concerns (multiselect) - Dandruff, Hair Loss, Dullness, Frizz, etc.
  * Formulation Type
  * Key Benefit
* **Ingredients**
  * Main Ingredients
  * Sulfate-Free (Yes/No)
  * Paraben-Free (Yes/No)
  * Organic / Natural (Yes/No)
  * Full Ingredients (expandable)
* **Product Details**
  * Package Size (ml/oz)
  * Usage Frequency
  * For All Hair Lengths (Yes/No)
* **Expiry Information**
  * Manufacturing Date
  * Expiry Date

---

### 💄 Makeup Products

* **Product Information**
  * Product Type (Foundation, Concealer, Lipstick, Eyeshadow, Mascara, etc.)
  * Brand Name
* **Shade & Application**
  * Shade / Color
  * Skin Tone Match (Fair, Medium, Deep, All)
  * Skin Type (if applicable)
  * Finish (Matte, Satin, Glitter, Natural, etc.)
* **Coverage & Formula**
  * Coverage Level (Light, Medium, Full)
  * Waterproof (Yes/No)
  * Long Lasting (Yes/No)
  * Smudge-Proof (Yes/No)
* **Ingredients**
  * Key Ingredients
  * Full Ingredients List (expandable)
  * Cruelty-Free (Yes/No)
  * Vegan (Yes/No)
* **Product Details**
  * Package Size (ml/oz/grams)
  * Applicator Type (if relevant)
* **Expiry & Authenticity**
  * Manufacturing Date
  * Expiry Date
  * Authenticity (Genuine / Dupe)

---

### 🌹 Fragrances

* **Product Information**
  * Product Type (Perfume, Eau de Parfum, Eau de Toilette, Body Spray, etc.)
  * Brand Name
  * Model / Name
* **Fragrance Profile**
  * Gender (Men, Women, Unisex)
  * Fragrance Family (Floral, Oriental, Fresh, Woody, Citrus, etc.)
  * Top / Middle / Base Notes
  * Season (Spring, Summer, Fall, Winter, All-Year)
* **Concentration & Performance**
  * Fragrance Concentration (EDT, EDP, Parfum, etc.)
  * Longevity (hours duration)
  * Sillage / Projection (Close, Moderate, Strong)
* **Product Details**
  * Size (ml)
  * Original Packaging (Yes/No)
  * Batch Code Visible
* **Authenticity & Expiry**
  * Authentication Status
  * Manufacturing Date
  * Expiry Date (perfumes have very long shelf life)

---

### 🧼 Personal Care Products

* **Product Information**
  * Product Type (Soap, Body Wash, Deodorant, Lotion, etc.)
  * Brand Name
* **Suitability**
  * Skin Type (if applicable)
  * Key Ingredients
  * Organic / Natural (Yes/No)
  * Hypoallergenic (Yes/No)
* **Specifications**
  * Size (ml/grams/oz)
  * Scent (if applicable)
  * Format (Liquid, Bar, Spray, Cream, etc.)
* **Expiry Information**
  * Manufacturing Date
  * Expiry Date

---

### 💊 Health Care Products

* **Product Information**
  * Product Type (Vitamins, Supplements, Medicine, etc.)
  * Brand Name
* **Medical Information**
  * Usage (Purpose/Benefit)
  * Form (Tablet, Capsule, Liquid, Powder, Syrup, etc.)
  * Key Ingredients / Active Components
  * Dosage Information (if applicable)
  * Prescription Required (Yes/No)
* **Certifications & Compliance**
  * Government Approved (Yes/No)
  * Manufacturing Standard
  * Certifications
* **Product Details**
  * Package Size (number of units / ml)
  * Serving Size
* **Expiry & Storage**
  * Manufacturing Date
  * Expiry Date
  * Storage Instructions (Temperature, Light, etc.)

---

### 🛠️ Beauty Tools & Devices

* **Product Information**
  * Product Type (Hair Dryer, Curler, Face Massager, Epilator, etc.)
  * Brand Name
  * Model (if applicable)
* **Technical Specifications**
  * Power Source (Electric, Battery, Rechargeable)
  * Wattage / Power Rating (if electric)
  * Voltage
  * Cord Length (if applicable)
* **Features**
  * Usage Area / Application (Face, Body, Hair, etc.)
  * Features (multiselect) - Heat Settings, Speed Levels, Attachments, Cordless, etc.
  * Number of Settings / Speed Levels
* **Condition & Warranty**
  * Condition (New, Like New, Good)
  * Warranty Available (Yes/No)
  * Warranty Duration
  * All Accessories Included (Yes/No)
* **Quality & Performance**
  * Material (Plastic, Ceramic, Steel, etc.)
  * Safety Certifications

---

### 📦 Other Beauty & Health Products

* **Product Information**
  * Product Type (custom/user-specified)
  * Brand Name
* **Details**
  * Key Information (User can fill custom details)
  * Description
  * Size / Quantity
  * Expiry Date (if applicable)

---

## 💰 6. Pricing & Condition Section

* **Price Information**
  * Current Price (highlighted)
  * Currency
  * Original Price (if discounted)
  * Negotiable Status (Yes/No)
* **Condition Details**
  * Product Condition (New / Like New / Lightly Used)
  * Seal Status (Sealed / Opened, Not Used)
  * Authenticity Status (Genuine / Imported / Tested)

---

## ✅ 7. Authenticity & Safety Information

* **Verification Badges**
  * Genuine Product Badge (if verified)
  * Authentic Purchase Proof
  * Original Packaging Indicator
* **Safety & Compliance**
  * Dermatologically Tested (if applicable)
  * Hypoallergenic (if applicable)
  * Cruelty-Free Certification
  * Vegan Certification
  * FDA Approved / Government Approved
  * Safety Testing Certifications
* **Expiry Warning**
  * Alert if expiry date is near
  * Green "Fresh" indicator if recently dated

---

## 📋 8. Ingredients & Benefits

* **Ingredient Information**
  * Full Ingredients List (expandable/collapsible)
  * Link to ingredient information / allergen warnings
  * Highlighted Key Active Ingredients
* **Benefits & Uses**
  * Primary Benefits
  * How to Use (application instructions)
  * Best For (skin type, concern, etc.)
  * Complementary Products (if applicable)

---

## 👤 9. Seller / Brand Info

* Name / Brand Name
* Profile image / Brand logo
* Seller type (Individual, Brand Authorized Dealer, Distributor)
* Phone number (click to call)
* Email button
* "View All Listings" button
* Specialization (e.g., "Skincare Specialist", "Luxury Beauty")
* Response rate / Rating
* Member since date

---

## 📩 10. Contact Section

* Quick contact button
* WhatsApp button (if available)
* Contact Form:
  * Buyer Name
  * Email
  * Message (Ask about authenticity, ingredients, expiry, etc.)
  * Send Inquiry button
* Special inquiry option for authenticity verification

---

## 🔁 11. Similar Products

* Show 4–8 similar beauty/health products
* Based on:
  * Same subcategory
  * Same brand (if applicable)
  * Same skin type / concern (if applicable)
  * Similar price range
* Display thumbnail, brand, price, and key feature

---

## ⭐ 12. User Reviews (Optional)

* **Product Reviews**
  * Customer Rating (stars)
  * Review Date
  * Review Text (experience, results, etc.)
  * Reviewer Avatar
  * "Helpful" indicator
  * Verified Purchase Badge
* **Common Feedback**
  * Most mentioned benefits
  * Common skin reactions
  * Effectiveness summary

---

# 📋 Implementation Notes

## Authenticity Emphasis

* Genuine vs. Dupe badges prominent
* Original packaging verification
* Batch code verification information
* Seller verification badges
* Purchase history proof indicators

## Safety & Health Information

* Expiry date always visible and prominent
* Allergy/sensitivity warnings clear
* Ingredient information comprehensive
* Safety certifications displayed
* Dermatologist recommendations (if applicable)

## Ingredient Transparency

* Full ingredient list easily accessible
* Links to ingredient information
* Highlighted main active ingredients
* Potential allergen warnings
* Natural vs. synthetic indication

## Visual Presentation

* Clear product packaging photos
* Ingredient label close-ups
* Before/after results (if applicable)
* User photos with product (optional)
* Brand authenticity marks visible

## Condition & Expiry

* Manufacturing and expiry dates prominent
* Freshness indicator (Days since mfg)
* Sealed vs. opened clear indicator
* Storage condition information

## Mobile Optimization

* Sticky contact button
* Quick ingredient access
* Expiry date highlight
* One-tap call to seller
* Simple form for authenticity inquiries

## Trust Building

* Verification badges prominent
* Detailed seller information
* Customer reviews and ratings
* Authenticity guarantees
* Return policy for counterfeit products
* Professional brand representation

## SEO & Accessibility

* Semantic HTML structure
* ARIA labels for interactive elements
* Proper heading hierarchy
* Product schema markup (JSON-LD)
* Alt text for all images including ingredients
* Readable font sizes for ingredient lists
- Color contrast for warnings and alerts
