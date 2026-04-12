Create a **dynamic Electronics Filter Search Form** using **React (Hooks) + Tailwind CSS**.

## 🎯 Main Category:

Electronics 

## 📂 Subcategories:

* Phones
* Tablets
* TV
* Laptops
* Desktops
* Home Appliances
* Music Instruments
* Other Electronics

---

## 🔹 General Filters (Always Visible)

* Keyword Search (text input)
* Location (Country + City)
* Price Range (min + max or slider)
* Condition (New, Used, Refurbished)
* Posted Date (Today, Last 7 days, Last 30 days)
* Seller Type (Individual, Dealer)
* Sort By (Price Low→High, Price High→Low, Newest)

---

# 📱 Phones & Tablets Filters

(Apply when Phones OR Tablets selected)

* Make (Brand dropdown)
* Model (dependent on Make)
* RAM (multi-select: 2GB–16GB+)
* Internal Storage (16GB–1TB)
* Battery Capacity
* Screen Size
* Refresh Rate (60Hz, 90Hz, 120Hz+)
* Camera (Rear MP, Front MP)
* 5G Supported (Yes/No)
* Dual SIM (Yes/No)
* Operating System (Android, iOS)
* Color
* Warranty
* Accessories Included
* Box Available

---

# 📺 TV Filters

* Brand
* Model
* Screen Size (32"–85"+)
* Resolution (HD, Full HD, 4K, 8K)
* Smart TV (Yes/No)
* Panel Type (LED, OLED, QLED)
* Refresh Rate
* HDMI Ports
* Operating System (Android TV, Tizen, WebOS)
* Wall Mount Included
* Warranty

---

# 💻 Laptops Filters

* Make
* Model
* Processor (Intel i3–i9, Ryzen 3–9)
* RAM (4GB–64GB)
* Storage Type (HDD, SSD, NVMe)
* Storage Size
* GPU (Integrated, NVIDIA, AMD)
* Screen Size (13"–17")
* Resolution (HD, FHD, 2K, 4K)
* Touchscreen
* Battery Life
* Operating System
* Usage Type (Gaming, Business, Student, Design)
* Keyboard Backlight
* Fingerprint Sensor
* Warranty

---

# 🖥️ Desktops Filters

* Make
* Model
* Processor
* RAM
* Storage Type & Size
* GPU
* Form Factor (Tower, Mini PC, All-in-One)
* Operating System
* Monitor Included (Yes/No)
* Keyboard/Mouse Included
* Usage Type
* Warranty

---

# 🏠 Home Appliances Filters

## Common:

* Appliance Type (Refrigerator, Washing Machine, AC, Microwave, etc.)
* Brand
* Model
* Energy Rating

## Conditional:

### Refrigerator

* Capacity (Liters)
* Type (Single/Double/Side-by-Side)
* Defrost Type
* Inverter Technology

### Washing Machine

* Type (Front/Top Load)
* Capacity (kg)
* Spin Speed
* Automatic/Semi

### Air Conditioner

* Type (Split/Window)
* Capacity (BTU/Ton)
* Inverter
* Cooling Area

---

# 🎸 Music Instruments Filters

* Instrument Type (Guitar, Piano, Drums, etc.)
* Brand
* Model
* Condition
* Acoustic / Electric
* Accessories Included
* Skill Level (Beginner, Intermediate, Professional)
* Warranty

---

# 🔌 Other Electronics Filters

* Device Type (Custom dropdown)
* Brand
* Model
* Condition
* Features (multi-select)
* Warranty

---

# ⚙️ Functional Requirements

* Use React state to track selected subcategory
* Dynamically show/hide filters based on subcategory
* Model dropdown depends on selected Make
* Use reusable components:

  * Input
  * Select
  * Checkbox
  * Range Slider
* Add:

  * “Clear Filters” button
  * “Search” button
* Responsive UI (mobile + desktop)

---

# 🧱 Technical Requirements

* Functional components only
* Tailwind CSS styling
* Controlled inputs
* Separate components folder
* Use dummy JSON for:

  * Brands
  * Models mapping

---

# 🧠 Bonus Features (Optional but recommended)

* Multi-select dropdowns
* Collapsible filter sections
* Save search filters
* Show number of results dynamically
* URL query params for filters

---

# 🎯 Output Required

* Full React component code
* Clean UI layout
* State management
* Example JSON data (Make → Model)

---

Design the UI modern:

* Rounded inputs
* Clean spacing
* Soft shadows
* User-friendly layout
