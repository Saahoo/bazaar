Create a **dynamic Filter Search Form** for the **Spare Parts category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Filter fields MUST match the Listing Wizard exactly
* Enable precise compatibility-based search
* Use dynamic filters based on subcategory

---

# 📂 Category:

Spare Parts

## Subcategories:

* Car Parts
* Motorcycle Parts
* Truck & Heavy Vehicle Parts
* Electronics Parts
* Machinery Parts
* Other Parts

---

# 🔹 General Filters (Always Visible)

* Keyword Search (title, description, part name)
* Price Range (min + max or slider)
* Condition (New / Used / Refurbished)
* Brand / Manufacturer
* Location (City)
* Seller Type (Individual / Dealer)
* Posted Date (Today, Last 7 days, Last 30 days)
* Sort By:

  * Price Low → High
  * Price High → Low
  * Newest

---

# 🚗 Vehicle Compatibility Filters

(Show for Car / Motorcycle / Truck Parts)

* Make (dropdown)
* Model (dependent on Make)
* Year Range:

  * From Year
  * To Year
* Engine Type (Petrol / Diesel / Hybrid / Electric)
* Transmission (Manual / Automatic)

---

# 🔌 Electronics / Machinery Compatibility

* Device Type
* Compatible Brand
* Compatible Model
* Version / Series

---

# 🔧 Part Specifications (All Parts)

* Part Name
* Part Type (Engine, Brake, Electrical, Body, Interior, etc.)
* Part Number / SKU
* OEM / Aftermarket (Original / Aftermarket)
* Material
* Color
* Weight Range
* Dimensions (Length / Width / Height)
* Warranty (Yes/No)
* Availability (In Stock / Out of Stock)

---

# 🚗 Vehicle Parts Specific Filters

* Placement:

  * Front
  * Rear
  * Left
  * Right
  * Universal
* Mileage (for used parts)
* Installation Type (Easy / Professional Required)
* Included Components
* Certification

---

# 🔌 Electronics Parts Filters

* Voltage
* Power Rating
* Connector Type
* Compatibility Type
* Safety Certification

---

# ⚙️ Machinery Parts Filters

* Machine Type
* Load Capacity
* Operating Pressure
* Temperature Range
* Industrial Grade (Yes/No)

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Dynamic rendering:
  IF subcategory == "Car Parts" → show vehicle filters
* Model dropdown depends on Make
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

```pseudo id="f2xkq7"
IF subcategory == "Car Parts" OR "Motorcycle Parts" OR "Truck Parts":
    show vehicle compatibility filters

IF subcategory == "Electronics Parts" OR "Machinery Parts":
    show device compatibility filters


# 🧠 CRITICAL RULE

Filter field names MUST match listing form fields exactly.

Example:

* Listing: "part_type" → Filter: "part_type"
* Listing: "make" → Filter: "make"
* Listing: "model" → Filter: "model"

---

# 🎯 Output Required

* Full React Filter Search Component
* Dynamic conditional rendering
* Clean Tailwind UI
* Controlled inputs
* Example dummy data

---

# 🎨 UI Design

* Sidebar filter layout (desktop)
* Collapsible filter sections
* Modern UI (rounded inputs, spacing, shadows)
* Mobile responsive

---

Make sure the filter system is scalable and optimized for fast searching.
