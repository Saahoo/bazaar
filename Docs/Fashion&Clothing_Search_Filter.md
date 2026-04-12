Create a **dynamic Filter Search Form** for the **Fashion & Clothing category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* The filter form MUST match the Listing Wizard fields exactly
* Enable accurate backend filtering
* Show dynamic filters based on subcategory

---

# 📂 Category:

Fashion & Clothing

## Subcategories:

* Men Clothing
* Women Clothing
* Kids Clothing
* Shoes
* Bags
* Accessories
* Watches
* Jewelry

---

# 🔹 General Filters (Always Visible)

* Keyword Search (title, description)
* Price Range (min + max or slider)
* Condition (New / Used)
* Brand
* Location (City)
* Seller Type (Individual / Dealer)
* Posted Date (Today, Last 7 days, Last 30 days)
* Sort By:

  * Price Low → High
  * Price High → Low
  * Newest

---

# 👕 Clothing Filters (Men / Women / Kids)

* Clothing Type
* Gender
* Size (multi-select)
* Fit Type
* Color (multi-select)
* Material
* Sleeve Type
* Pattern
* Season
* Occasion
* Authenticity
* Warranty
* Tags Available (Yes/No)

---

# 👟 Shoes Filters

* Brand
* Model
* Shoe Type
* Gender
* Size (multi-select)
* Color
* Material
* Condition
* Original Box (Yes/No)
* Warranty
* Usage Type

---

# 👜 Bags Filters

* Brand
* Bag Type
* Material
* Color (multi-select)
* Size
* Closure Type
* Strap Type
* Waterproof (Yes/No)
* Authenticity
* Warranty

---

# ⌚ Watches Filters

* Brand
* Model
* Gender
* Display Type
* Strap Material
* Dial Shape
* Movement
* Water Resistant (Yes/No)
* Original Box (Yes/No)
* Warranty

---

# 💍 Jewelry Filters

* Type
* Material
* Gender
* Size
* Stone Type
* Certification (Yes/No)
* Authenticity
* Warranty

---

# 🎒 Accessories Filters

* Type
* Brand
* Material
* Color (multi-select)
* Gender
* Style
* Warranty

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Show filters dynamically based on selected subcategory
* Use reusable components:

  * Input
  * Select
  * MultiSelect
  * Checkbox
  * Range Slider
* Add:

  * “Clear Filters” button
  * “Apply Filters” button

---

# 🧠 Dynamic Logic

```pseudo
IF subcategory == "Men Clothing" OR "Women Clothing" OR "Kids Clothing":
    show clothing filters

IF subcategory == "Shoes":
    show shoes filters

IF subcategory == "Bags":
    show bags filters

IF subcategory == "Watches":
    show watches filters

IF subcategory == "Jewelry":
    show jewelry filters

IF subcategory == "Accessories":
    show accessories filters



# 🧠 CRITICAL RULE

Filter field names MUST exactly match listing form fields.

Example:

* Listing: "size" → Filter: "size"
* Listing: "color" → Filter: "color"
* Listing: "brand" → Filter: "brand"

---

# 🎯 Output Required

* Full React Filter Form Component
* Dynamic rendering based on subcategory
* Clean Tailwind UI
* Controlled inputs
* Example dummy data

---

# 🎨 UI Design

* Collapsible filter sections
* Modern UI (rounded inputs, shadows)
* Sticky sidebar (optional)
* Mobile responsive

---

Make sure the filter system is scalable and easy to extend for future categories.
