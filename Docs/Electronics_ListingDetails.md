Create an **Electronics Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display full electronics product details clearly with images and specifications
* Match fields from Electronics Listing Wizard
* Integrate gallery and comparison features
* Optimize for user trust with condition and warranty information

---

# 📂 Category:

Electronics

## Subcategories:

* Phones
* Tablets
* TV
* Laptops
* Desktops
* Home Appliances
* Music Instruments
* Other Electronics

---

# 🧱 Page Structure

## 🖼️ 1. Image Gallery (Top Section)

* Main large image (product photo)
* Thumbnail slider below
* Click to open full-screen gallery
* Product image carousel with navigation arrows
* Image counter (X of Y photos)

---

## 📌 2. Title & Price Section

* Product Title
* Price (formatted with currency)
* Condition badge (New / Like New / Good / Fair)
* Location (City)
* Posted Date
* Product ID / Reference Number
* Save / Favorite button
* Share button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as icons + values:

* **For Phones:** RAM, Storage, Battery, Screen Size
* **For Laptops:** Processor, RAM, Storage, GPU
* **For TV:** Screen Size, Resolution, Smart TV
* **For Home Appliances:** Brand, Type, Capacity
* **For Other Electronics:** Brand, Model, Condition

---

## 📝 4. Description Section

* Full product description text
* "Read More / Show Less" toggle

---

## 🧾 5. Product Specifications (Category-Specific Grid)

### 📱 Phones Specifications

* **Make & Model**
  * Make
  * Model
* **Storage & Memory**
  * RAM
  * Storage Capacity
  * Storage Type
* **Display**
  * Screen Size
  * Refresh Rate
  * Screen Type
* **Camera**
  * Rear Camera
  * Front Camera
  * Camera Features
* **Features**
  * OS (Operating System)
  * 5G Support
  * Dual SIM
  * Battery Capacity
  * Warranty Status

---

### 💻 Laptops Specifications

* **Processor & Components**
  * Make
  * Model
  * Processor Type
  * Generation
* **Memory & Storage**
  * RAM
  * Storage Type
  * Storage Capacity
* **Display**
  * Screen Size
  * Resolution
  * Refresh Rate
  * Touchscreen
* **Graphics & Performance**
  * GPU
  * Usage Type
* **Features**
  * OS
  * Battery Life
  * Keyboard Backlight
  * Fingerprint Sensor
  * Warranty

---

### 📺 TV Specifications

* **Model Information**
  * Brand
  * Model
* **Display**
  * Screen Size
  * Resolution
  * Panel Type
  * Refresh Rate
* **Features**
  * Smart TV
  * Built-in OS
  * HDMI Ports
  * Wall Mount Included
  * Warranty

---

### 🍳 Home Appliances Specifications

* **Appliance Type**
  * Type Category
  * Brand
  * Model
* **General**
  * Condition
  * Warranty

* **Type-Specific** (Dynamic Based on Appliance Type)
  * **Refrigerator:** Capacity, Type (Side-by-side, French Door, etc.), Defrost Type, Inverter
  * **Washing Machine:** Type (Front Load / Top Load), Capacity (kg), Spin Speed (RPM)
  * **AC (Air Conditioner):** Type (Window / Split), Capacity (Tons), Inverter, Cooling Area (Sq Ft)

---

### 🎸 Music Instruments Specifications

* **Instrument Information**
  * Instrument Type
  * Brand
  * Model
  * Acoustic / Electric (if applicable)
* **Features**
  * Skill Level
  * Accessories Included
  * Condition
  * Warranty

---

### 📦 Other Electronics Specifications

* **Device Information**
  * Device Type
  * Brand
  * Model
* **Features**
  * General Features
  * Condition
  * Warranty

---

## 💰 6. Pricing & Condition Section

* **Price Information**
  * Current Price (highlighted)
  * Currency
  * Negotiable Status (Yes/No)
* **Condition Details**
  * Overall Condition
  * Condition Description
  * Warranty (if applicable)
  * Warranty Duration

---

## 👤 7. Seller / Shop Info

* Name
* Profile image / Shop logo
* Seller type (Individual / Shop)
* Phone number (click to call)
* Email button
* "View All Listings" button
* Response rate / Rating (if available)

---

## 📩 8. Contact Section

* Quick contact button
* WhatsApp button (if available)
* Contact Form:
  * Buyer Name
  * Email
  * Message
  * Send Inquiry button

---

## 🔁 9. Similar Listings

* Show 4–8 similar electronics products
* Based on:
  * Same subcategory (e.g., all Phones)
  * Similar price range
  * Same or nearby city
* Display thumbnail, price, condition, and location

---

## 📊 10. Seller Statistics (Optional)

* Member since date
* Number of active listings
* Response time average
* Positive feedback rating

---

# 📋 Implementation Notes

## Dynamic Content Rendering

* Render specifications grid based on **subcategory**
* Hide empty fields to keep layout clean
* Use icons and colors for quick visual scanning
* Responsive grid (1 col mobile, 2 col tablet, 3+ col desktop)

## Condition Badge Styling

* **New:** Green badge
* **Like New:** Primary blue badge
* **Good:** Yellow badge
* **Fair:** Gray badge

## Gallery Features

* Keyboard navigation (arrow keys to scroll)
* Mobile-friendly swipe gestures
* Lightbox/fullscreen view for details
* Photo counter

## Mobile Optimization

* Stack image gallery on top
* Single-column layout for specifications
* Sticky contact button on mobile
* Collapsible specification sections

## SEO & Accessibility

* Semantic HTML for product details
* ARIA labels for interactive elements
* Proper heading hierarchy
* Product schema markup (JSON-LD)
* Alt text for all images
