Create a **dynamic multi-step Listing Wizard Form** for the **Health & Beauty category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a scalable listing wizard for all health & beauty products
* Support multiple subcategories
* Ensure all fields match future filter search
* Use dynamic fields based on selected subcategory

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

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Title
* Description
* Subcategory (Dropdown)

---

## ✅ Step 2: General Details

* Price (AF/USD/PKR)
* Condition (New / Used / Unopened)
* Brand
* Seller Type (Individual / Dealer)

---

## ✅ Step 3: Product Specifications (Dynamic)

---

# 🧴 Skincare

* Product Type (Cleanser, Moisturizer, Serum, Sunscreen, etc.)
* Skin Type (Dry, Oily, Combination, Sensitive, All)
* Concern (Acne, Anti-aging, Hydration, Brightening, etc.)
* Formulation (Gel, Cream, Liquid, Foam)
* SPF (Yes/No + value)
* Ingredients (text or multi-select)
* Organic / Natural (Yes/No)
* Dermatologically Tested (Yes/No)
* Gender (Unisex / Male / Female)
* Size (ml/g)
* Expiry Date
* Usage Frequency (Daily, Weekly, etc.)

---

# 💇 Haircare

* Product Type (Shampoo, Conditioner, Oil, Serum, etc.)
* Hair Type (Dry, Oily, Normal, Curly, Damaged)
* Concern (Hair fall, Dandruff, Growth, Repair)
* Formulation
* Ingredients
* Sulfate-Free (Yes/No)
* Organic (Yes/No)
* Size
* Expiry Date
* Usage Frequency

---

# 💄 Makeup

* Product Type (Foundation, Lipstick, Mascara, etc.)
* Shade / Color
* Skin Type
* Finish (Matte, Glossy, Natural)
* Coverage (Light, Medium, Full)
* Waterproof (Yes/No)
* Long Lasting (Yes/No)
* Ingredients
* Expiry Date
* Size

---

# 🌸 Fragrances

* Type (Perfume, Body Spray, Deodorant)
* Gender
* Fragrance Family (Floral, Woody, Citrus, Oriental)
* Concentration (EDT, EDP, Parfum)
* Longevity (hours)
* Size (ml)
* Original Packaging (Yes/No)

---

# 🧼 Personal Care

* Product Type (Soap, Body Wash, Toothpaste, etc.)
* Skin Type
* Ingredients
* Organic (Yes/No)
* Size
* Expiry Date

---

# 💊 Health Care Products

* Product Type (Vitamins, Supplements, Medical Items)
* Usage (General health, immunity, etc.)
* Form (Tablet, Capsule, Liquid)
* Ingredients
* Expiry Date
* Prescription Required (Yes/No)
* Dosage Info

---

# ⚙️ Beauty Tools & Devices

* Product Type (Hair Dryer, Trimmer, Facial Device, etc.)
* Power Source (Battery, Electric)
* Usage Area (Face, Hair, Body)
* Features (multi-select)
* Warranty
* Condition

---

# 🔄 Other

* Product Type
* Brand
* Custom Specifications (key-value pairs)

---

## ✅ Step 4: Media Upload

* Images (multiple)
* Video (optional)

---

## ✅ Step 5: Contact and Location

* Contact and Location (Same as in "Fashion & Clothing)

---

## ✅ Step 5: Review & Submit

* Show all entered data
* Allow editing
* Submit button

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Dynamic rendering based on subcategory
* Use reusable components:

  * Input
  * Select
  * MultiSelect
  * Checkbox
  * Toggle (Yes/No)
  * Date Picker (for expiry)
* Add:

  * Step progress bar
  * Next / Back navigation
  * Validation for required fields

---

# 🧠 CRITICAL RULE

All field names MUST match future filters exactly.

Example:

* "skin_type" in form = "skin_type" in filters
* "product_type" = "product_type"
* "expiry_date" = "expiry_date"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data
* Modular component structure

---

# 🎨 UI Design

* Clean modern UI
* Rounded inputs
* Soft shadows
* Proper spacing
* Mobile responsive
* Optional collapsible sections

---

Make the form scalable so new subcategories and specifications can be added easily in the future.
