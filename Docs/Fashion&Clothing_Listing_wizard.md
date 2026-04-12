Create a **dynamic multi-step Listing Wizard Form** for the **Fashion & Clothing category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a **multi-step listing form**
* Ensure all fields match future **search filters**
* Support dynamic fields based on subcategory

---

# 📂 Main Category:

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

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Title
* Description
* Subcategory (Dropdown from above list)

---

## ✅ Step 2: General Details

* Price
* Condition (New / Used)
* Brand
* Location (City)
* Seller Type (Individual / Dealer)

---

## ✅ Step 3: Product Specifications (Dynamic)

---

# 👕 Clothing (Men / Women / Kids)

* Clothing Type (T-shirt, Shirt, Jeans, Dress, Jacket, etc.)
* Gender (Auto or manual if needed)
* Size (XS, S, M, L, XL, XXL, Custom)
* Fit Type (Slim, Regular, Oversized)
* Color (multi-select)
* Material (Cotton, Polyester, Wool, Denim, Leather, etc.)
* Sleeve Type (Short, Long, Sleeveless)
* Pattern (Solid, Printed, Striped, Checked)
* Season (Summer, Winter, All Season)
* Occasion (Casual, Formal, Party, Sportswear)
* Authenticity (Original / Replica)
* Warranty (if applicable)
* Tags Available (Yes/No)

---

# 👟 Shoes

* Brand
* Model
* Shoe Type (Sneakers, Formal, Boots, Sandals, Heels, Sports)
* Gender (Men, Women, Unisex)
* Size (EU/US sizes)
* Color
* Material (Leather, Synthetic, Mesh, etc.)
* Condition (New / Used)
* Original Box (Yes/No)
* Warranty
* Usage Type (Running, Casual, Formal, Hiking)

---

# 👜 Bags

* Brand
* Bag Type (Handbag, Backpack, Travel Bag, Laptop Bag, Wallet)
* Material
* Color
* Size (Small, Medium, Large)
* Closure Type (Zipper, Magnetic, Buckle)
* Strap Type (Single, Double, Adjustable)
* Waterproof (Yes/No)
* Authenticity
* Warranty

---

# ⌚ Watches

* Brand
* Model
* Gender
* Display Type (Analog, Digital, Smart)
* Strap Material
* Dial Shape (Round, Square, Rectangle)
* Movement (Quartz, Automatic)
* Water Resistant (Yes/No)
* Original Box (Yes/No)
* Warranty

---

# 💍 Jewelry

* Type (Ring, Necklace, Bracelet, Earrings)
* Material (Gold, Silver, Diamond, Platinum, Artificial)
* Gender
* Size (Ring size, chain length, etc.)
* Stone Type
* Certification (Yes/No)
* Authenticity
* Warranty

---

# 🎒 Accessories

* Type (Belt, Hat, Sunglasses, Scarf, etc.)
* Brand
* Material
* Color
* Gender
* Style (Casual, Formal)
* Warranty

---

## ✅ Step 4: Media Upload

* Images (multiple upload)
* Video (optional)

---

## ✅ Step 5: Review & Submit

* Display all entered data
* Edit option per section
* Submit button

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Show fields dynamically based on subcategory
* Use reusable components:

  * Input
  * Select
  * MultiSelect
  * Checkbox
  * Toggle (Yes/No)
* Add:

  * Progress bar (step indicator)
  * “Next / Back” navigation
  * “Clear form” option

---

# 🧠 Critical Rule

All field names MUST match future filters exactly.

Example:

* Filter: "size" → Form: "size"
* Filter: "color" → Form: "color"
* Filter: "brand" → Form: "brand"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data
* Modular components structure

---

# 🎨 UI Design

* Modern and clean
* Rounded inputs
* Soft shadows
* Proper spacing
* Mobile responsive
* Collapsible sections (optional)

---

Make the form scalable so new subcategories and filters can be added easily in future.
