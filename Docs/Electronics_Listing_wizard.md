Update my existing **Listing Wizard Form (React + Tailwind)** for the **Electronics category** so that it includes **ALL fields used in the search filters**, ensuring perfect match between listing data and filtering.

---

# 🎯 Goal

* Every filter field MUST exist in the listing form
* Ensure consistent naming between frontend + backend
* Use dynamic steps based on selected subcategory

---

# 🧭 Wizard Structure (Step-by-Step)

## ✅ Step 1: Basic Information

* Title
* Description
* Subcategory (Dropdown):

  * Phones
  * Tablets
  * TV
  * Laptops
  * Desktops
  * Home Appliances
  * Music Instruments
  * Other Electronics

---

## ✅ Step 2: General Details (Common Fields)

* Price
* Condition (New / Used / Refurbished)
* Location ( City)
* Seller Type (Individual / Dealer)

---

## ✅ Step 3: Dynamic Specifications (IMPORTANT)

Show fields based on selected subcategory:

---

### 📱 Phones & Tablets

* Make
* Model (dependent dropdown)
* RAM
* Internal Storage
* Battery Capacity
* Screen Size
* Refresh Rate
* Rear Camera (MP)
* Front Camera (MP)
* 5G Supported (Yes/No)
* Dual SIM (Yes/No)
* Operating System
* Color
* Warranty (Yes/No)
* Accessories Included (Yes/No)
* Box Available (Yes/No)

---

### 📺 TV

* Brand
* Model
* Screen Size
* Resolution
* Smart TV (Yes/No)
* Panel Type
* Refresh Rate
* HDMI Ports
* Operating System
* Wall Mount Included
* Warranty

---

### 💻 Laptops

* Make
* Model
* Processor
* RAM
* Storage Type
* Storage Size
* GPU
* Screen Size
* Resolution
* Touchscreen
* Battery Life
* Operating System
* Usage Type
* Keyboard Backlight
* Fingerprint Sensor
* Warranty

---

### 🖥️ Desktops

* Make
* Model
* Processor
* RAM
* Storage Type
* Storage Size
* GPU
* Form Factor
* Operating System
* Monitor Included
* Keyboard/Mouse Included
* Usage Type
* Warranty

---

### 🏠 Home Appliances

## First select:

* Appliance Type

Then show:

#### Refrigerator

* Capacity
* Type
* Defrost Type
* Inverter Technology

#### Washing Machine

* Type
* Capacity
* Spin Speed
* Automatic/Semi

#### Air Conditioner

* Type
* Capacity
* Inverter
* Cooling Area

---

### 🎸 Music Instruments

* Instrument Type
* Brand
* Model
* Acoustic/Electric
* Skill Level
* Accessories Included
* Warranty

---

### 🔌 Other Electronics

* Device Type
* Brand
* Model
* Features (multi-select)
* Warranty

---

## ✅ Step 4: Media Upload

* Images (multiple upload)
* Video (optional)

---

## ✅ Step 5: Review & Submit

* Show all entered data
* Edit option per section
* Submit button

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Use dynamic rendering:
  IF subcategory === "Phones" → show phone fields
* Model dropdown depends on Make
* Validate required fields
* Maintain consistent field names with filters
* Use reusable components:

  * Input
  * Select
  * Checkbox
  * MultiSelect
  * Toggle (Yes/No)

---

# 🧱 Technical Requirements

* Keep form modular (separate components per step)
* Store all form data in a single state object
* Example structure:

```js
formData = {
  title: "",
  category: "electronics",
  subcategory: "phones",
  price: "",
  condition: "",
  specs: {
    brand: "",
    model: "",
    ram: "",
    storage: "",
    battery: "",
    ...
  }
}
```

---

# 🧠 Important Rule (CRITICAL)

Field names in listing form MUST MATCH search filters EXACTLY.

Example:

* Filter: "ram" → Listing field: "ram"
* Filter: "screen_size" → Listing field: "screen_size"

This ensures backend filtering works perfectly.

---

# 🎯 Output Required

* Updated React Wizard Form code
* Dynamic conditional rendering
* Clean UI with Tailwind
* Example dummy data (Make → Model)

---

Make the UI modern:

* Step indicator (progress bar)
* Smooth transitions
* Clean spacing
* Mobile responsive
