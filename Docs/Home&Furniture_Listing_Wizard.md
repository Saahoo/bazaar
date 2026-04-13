Create a **dynamic multi-step Listing Wizard Form** for the **Home & Furniture category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a scalable listing wizard for home & furniture items
* Support multiple subcategories
* Ensure all fields match future filter search
* Use dynamic fields based on selected subcategory

---

# 📂 Category:

Home & Furniture

## Subcategories:

* Living Room Furniture
* Bedroom Furniture
* Dining Room Furniture
* Office Furniture
* Outdoor Furniture
* Home Decor
* Kitchen & Dining
* Lighting
* Storage & Organization
* Other

---

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Title
* Description
* Subcategory (Dropdown)

---

## ✅ Step 2: General Details

* Price
* Condition (New / Used / Refurbished)
* Brand
* Seller Type (Individual / Dealer)

---

## ✅ Step 3: Product Specifications (Dynamic)

---

# 🛋️ Living / Bedroom / Dining / Office / Outdoor Furniture

* Furniture Type (Sofa, Bed, Table, Chair, Wardrobe, Desk, etc.)
* Material (Wood, Metal, Glass, Plastic, Fabric, Leather)
* Color (multi-select)
* Dimensions:

  * Length
  * Width
  * Height
* Weight
* Seating Capacity (if applicable)
* Style (Modern, Classic, Minimalist, Rustic)
* Assembly Required (Yes/No)
* Condition Details
* Usage (Home, Office, Outdoor)
* Warranty
* Included Items (e.g., cushions, mattress)

---

# 🏠 Home Decor

* Decor Type (Wall Art, Rugs, Curtains, Mirrors, etc.)
* Material
* Color
* Style
* Theme (Vintage, Bohemian, Luxury, etc.)
* Dimensions
* Handmade (Yes/No)
* Set or Single Item
* Warranty

---

# 🍽️ Kitchen & Dining

* Product Type (Cookware, Utensils, Dinner Set, Appliances, etc.)
* Material
* Capacity (Liters, Pieces)
* Color
* Dishwasher Safe (Yes/No)
* Microwave Safe (Yes/No)
* Set Size
* Warranty

---

# 💡 Lighting

* Type (Ceiling Light, Lamp, LED Strip, Chandelier)
* Power Source (Electric, Battery, Solar)
* Wattage
* Light Color (Warm, Cool, RGB)
* Smart Lighting (Yes/No)
* Dimmable (Yes/No)
* Installation Type
* Warranty

---

# 📦 Storage & Organization

* Storage Type (Cabinet, Shelf, Drawer, Organizer)
* Material
* Color
* Capacity
* Number of Compartments
* Wall Mounted (Yes/No)
* Lockable (Yes/No)
* Dimensions
* Warranty

---

# 🔄 Other

* Product Type
* Brand
* Custom Specifications (key-value input)

---

## ✅ Step 4: Media Upload

* Images (multiple upload)
* Video (optional)

---

## ✅ Step 5: Contact and Location

* Contact and Location (Same as in "Fashion & Clothing")

---

## ✅ Step 6: Review & Submit

* Show all entered data
* Edit per section
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
* Include:

  * Step progress bar
  * Next / Back navigation
  * Validation for required fields


---

# 🧠 CRITICAL RULE

All field names MUST match future filters exactly.

Example:

* "material" in form = "material" in filters
* "color" = "color"
* "dimensions" = "dimensions"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data
* Modular components structure

---

# 🎨 UI Design

* Modern clean UI
* Rounded inputs
* Soft shadows
* Proper spacing
* Mobile responsive
* Optional collapsible sections

---

Make the form scalable so new subcategories and specifications can be added easily in the future.
