Create a **Spare Parts Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display spare parts with technical specifications and compatibility information
* Match fields from Spare Parts Listing Wizard
* Provide clear compatibility and fitment details
* Optimize for technical buyers (mechanics, technicians, DIY enthusiasts)

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

# 🧱 Page Structure

## 🖼️ 1. Image Gallery (Top Section)

* Main product image (part photo)
* Multiple angles (front, back, installed view if applicable)
* Thumbnail slider below (up to 12 images)
* Click to open full-screen gallery
* Close-up detail photos if available
* Installed vs. standalone views

---

## 📌 2. Title & Price Section

* Part Name/Title
* Price (formatted with currency)
* Location (City)
* Posted Date
* Part ID / Reference Number
* Stock availability indicator
* Save / Favorite button
* Share button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as pills/tags:

* **For Vehicle Parts:** Make, Model, Year, Condition
* **For Electronics Parts:** Part Type, Voltage, Compatibility
* **For Machinery Parts:** Machine Type, Load Capacity
* **Universal:** OEM/Aftermarket, Availability, Warranty

---

## 📝 4. Description Section

* Full part description
* Installation notes (if applicable)
* Compatibility information
* Any modifications or special notes
* "Read More / Show Less" toggle

---

## 🧾 5. Product Specifications (Category-Specific Grid)

### 🚗 Vehicle Parts (Car, Motorcycle, Truck)

* **Part Information**
  * Part Name
  * Part Type
  * OEM / Aftermarket (Original Equipment Manufacturer vs. Aftermarket)
  * Part Number / SKU (if available)
* **Vehicle Compatibility**
  * Vehicle Make/Brand
  * Model
  * Year Range (e.g., 2015-2020)
  * Engine Type (if applicable)
* **Specifications**
  * Material / Construction
  * Color (if visible/relevant)
  * Weight
  * Dimensions (Length, Width, Height)
* **Condition & Warranty**
  * Availability Status (In Stock, Limited Stock, Pre-order)
  * Condition (New, Refurbished, Used)
  * Warranty (Yes/No + Duration if available)
* **Installation & Details**
  * Placement/Location on Vehicle
  * Mileage when removed (if used part)
  * Installation Type (Plug-and-Play, Requires Modification, Professional Installation Required)
  * Included Components (Gaskets, Bolts, Connectors, etc.)
  * Certification / Standards (if applicable)

---

### ⚙️ Electronics Parts

* **Part Information**
  * Component Name
  * Component Type
  * Part Number / Model
  * OEM / Aftermarket
* **Electrical Specifications**
  * Voltage (V)
  * Power Rating (W)
  * Current Rating (A)
  * Frequency (if applicable, Hz)
* **Compatibility & Connections**
  * Connector Type (USB, RJ45, 3.5mm, etc.)
  * Compatibility (Device Type, Brand, Model)
  * Interface Type (Serial, Parallel, Digital, Analog, etc.)
* **Dimensions & Weight**
  * Length, Width, Height (mm)
  * Weight (grams)
* **Warranty & Certification**
  * Safety Certification
  * Warranty
  * RoHS / CE Compliant (if applicable)

---

### 🏭 Machinery Parts

* **Part Information**
  * Component Name
  * Component Type
  * Part Number / Code
  * OEM / Aftermarket
* **Machine Compatibility**
  * Machine Type
  * Brand/Manufacturer
  * Model (if applicable)
* **Technical Specifications**
  * Load Capacity (kg/ton)
  * Operating Pressure (PSI/Bar)
  * Temperature Range (°C or °F)
  * Material / Construction
  * Weight
  * Dimensions
* **Industrial Specifications**
  * Industrial Grade (Commercial, Industrial, Heavy-Duty)
  * Certification / Standards
  * Installation Requirements
  * Maintenance Notes
* **Warranty & Condition**
  * New / Refurbished / Used
  * Warranty
  * Inspection/Testing Status

---

### 📦 Generic / Other Parts

* **Part Information**
  * Part Name
  * Part Type
  * Part Number / SKU
  * OEM / Aftermarket
  * Availability Status
* **Specifications**
  * Material
  * Color
  * Weight
  * Dimensions (L × W × H)
* **Compatibility**
  * Compatible With (equipment, machinery, vehicles, systems)
  * Installation Notes
* **Warranty**
  * Warranty Status (Yes/No)
  * Warranty Duration

---

## 💰 6. Pricing & Availability Section

* **Price Information**
  * Current Price (highlighted)
  * Currency
  * Negotiable Status (Yes/No)
* **Availability**
  * Stock Status (In Stock, Limited Stock, Pre-order)
  * Quantity Available
  * Lead Time (if pre-order)
* **Shipping**
  * Shipping available (Yes/No)
  * Estimated Delivery Time

---

## 📋 7. Technical Documentation

* **Specification Sheet** (if available)
  * Download PDF datasheet
  * Link to manufacturer documentation
* **Compatibility Chart** (if applicable)
  * List of compatible vehicles/machines
  * Version/year compatibility matrix
* **Installation Guide**
  * Step-by-step instructions
  * Required tools
  * Video tutorial link (if available)

---

## 👤 8. Seller / Supplier Info

* Name / Business Name
* Profile image / Company logo
* Seller type (Individual, Mechanic, Parts Dealer, Supplier)
* Phone number (click to call)
* Email button
* "View All Listings" button
* Specialization (e.g., "Toyota Parts Specialist")
* Response rate / Rating
* Years in business / Experience

---

## 📩 9. Contact Section

* Quick contact button
* WhatsApp button (if available)
* Contact Form:
  * Buyer Name
  * Email
  * Message (Ask about compatibility, installation, warranty, etc.)
  * Send Inquiry button
* Bulk order inquiry option

---

## ✅ 10. Verification & Trust Badges

* **Seller Verification**
  * Verified supplier badge
  * Business registration number
  * Return policy clearly stated
* **Part Authentication**
  * Genuine / OEM badge (if applicable)
  * Certification badges
  * Industry standards compliance

---

## 🔁 11. Related / Similar Listings

* Show 4–8 similar parts
* Based on:
  * Same vehicle/machine type
  * Same part category
  * Same compatibility
  * Similar price range
* Display thumbnail, price, availability, and compatibility

---

## 📊 12. Buyer Reviews (Optional)

* **Part Performance Reviews**
  * Fitment rating
  * Quality rating
  * Durability comments
  * Seller reliability
* **Installation Reviews**
  * Difficulty level feedback
  * Installation time estimates from buyers
  * Common issues reported

---

# 📋 Implementation Notes

## Technical Accuracy

* Precise part specifications mandatory
* Clear compatibility information essential
* OEM vs. Aftermarket distinction critical
* Part numbers must be accurate (critical for searching)

## Compatibility Information

* Multiple compatibility matrix display
* Year ranges (not just single year)
* Clear notes on fitment requirements
* Modification requirements if needed

## Specification Display

* Engineering tolerances if critical
* Material grades clearly stated
* Standards compliance (ISO, SAE, etc.)
* Safety certifications prominent

## Images & Visuals

* High-quality product photography
* Multiple angles including scale reference
* Installed view (if available and helpful)
* Detail shots of connectors, markings, etc.
* Part number/model number clearly visible in photos

## Buyer Protection

* Clear return policy for parts
* Fitment guarantee information
* Testing/inspection notes
* Genuine vs. compatible parts clearly distinguished

## Mobile Optimization

* Gallery prominence for visual confirmation
* Sticky contact button
* Quick access to specifications
* Compatibility information easily accessible
* One-tap call to seller

## SEO & Accessibility

* Semantic HTML for technical specs
* ARIA labels for interactive elements
* Proper heading hierarchy
* Part schema markup (JSON-LD)
* Alt text for all images including part numbers
* Machine-readable specifications (structured data)

## B2B Features

* Bulk order option
* Quantity discounts display
* Wholesale pricing inquiry
* Technical documentation downloads
* CAD/technical drawings (if available)
