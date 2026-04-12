Create a **dynamic multi-step Listing Wizard Form** for the **Spare Parts category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a scalable listing wizard for all types of spare parts
* Support multiple vehicle/device types
* Ensure all fields match future filter search
* Use dynamic fields based on selected part type

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

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Title
* Description
* Subcategory (Dropdown from above list)

---

## ✅ Step 2: General Details

* Price
* Condition (New / Used / Refurbished)
* Brand / Manufacturer
* Location (City)
* Seller Type (Individual / Dealer)

---

## ✅ Step 3: Vehicle / Device Compatibility (IMPORTANT)

### For Vehicle Parts (Car / Motorcycle / Truck)

* Make (Toyota, BMW, Honda, etc.)
* Model (dependent on Make)
* Year (From – To)
* Engine Type (Petrol / Diesel / Hybrid / Electric)
* Transmission (Manual / Automatic)
* Part Compatibility Notes (text)

---

### For Electronics / Machinery Parts

* Device Type (Phone, Laptop, Machine, etc.)
* Compatible Brand
* Compatible Model
* Version / Series
* Technical Compatibility Notes

---

## ✅ Step 4: Part Specifications (Dynamic)

---

### 🔧 Common Fields (ALL parts)

* Part Name
* Part Type (Engine, Brake, Suspension, Electrical, Body, Interior, etc.)
* Part Number / SKU
* OEM / Aftermarket (Original / Aftermarket)
* Material
* Color
* Weight
* Dimensions (Length, Width, Height)
* Warranty (Yes/No + duration)
* Availability (In Stock / Out of Stock)

---

### 🚗 Car / Vehicle Parts Specific

* Placement:

  * Front / Rear / Left / Right / Universal
* Mileage (if used)
* Installation Type (Easy / Professional Required)
* Included Components
* Certification (if any)

---

### 🔌 Electronics Parts

* Voltage
* Power Rating
* Connector Type
* Compatibility Type
* Safety Certification

---

### ⚙️ Machinery Parts

* Machine Type
* Load Capacity
* Operating Pressure
* Temperature Range
* Industrial Grade (Yes/No)

---

## ✅ Step 5: Media Upload

* Images (multiple upload)
* Video (optional)

---

## ✅ Step 6: Review & Submit

* Show all entered data
* Edit per section
* Submit button

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Dynamic rendering:
  IF subcategory == "Car Parts" → show vehicle fields
* Model dropdown depends on Make
* Use reusable components:

  * Input
  * Select
  * MultiSelect
  * Checkbox
  * Toggle (Yes/No)
* Add:

  * Step progress bar
  * Next / Back navigation
  * Clear form option


# 🧠 CRITICAL RULE

Field names MUST match filter fields exactly.

Example:

* "part_type" in listing = "part_type" in filters
* "make" = "make"
* "model" = "model"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data (Make → Model)
* Modular component structure

---

# 🎨 UI Design

* Modern UI
* Rounded inputs
* Clean spacing
* Soft shadows
* Mobile responsive
* Collapsible sections (optional)

---

Make the system scalable so new part types and specs can be added easily in the future.
