Create a **Fashion & Clothing Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display fashion items with visual appeal and detailed specifications
* Match fields from Fashion & Clothing Listing Wizard
* Integrate size guides and fit information
* Optimize for shopping experience with clear product presentation

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

# 🧱 Page Structure

## 🖼️ 1. Image Gallery (Top Section)

* Main large image (product photo - fashion item front view)
* Alternative angle/back view options
* Thumbnail slider below (up to 12 images)
* Click to open full-screen gallery
* Swipe support for mobile
* "View 360" button (if multiple angles provided)

---

## 📌 2. Title & Price Section

* Item Name/Title
* Price (formatted with currency)
* Condition badge (New / Like New / Good / Fair)
* Location (City)
* Posted Date
* Item ID / Reference Number
* Save / Favorite button
* Share button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as pills/tags:

* **For Clothing:** Size, Color, Gender, Type
* **For Shoes:** Brand, Size, Color, Type
* **For Bags:** Brand, Type, Color, Material
* **For Accessories:** Type, Color, Style
* **For Watches:** Brand, Display Type
* **For Jewelry:** Type, Material, Size

---

## 📝 4. Description Section

* Full product description text
* Material/Fabric details
* "Read More / Show Less" toggle
* Special notes (custom tailoring, damage, modifications, etc.)

---

## 🧾 5. Product Specifications (Category-Specific Grid)

### 👕 Clothing (Men / Women / Kids)

* **Item Details**
  * Clothing Type
  * Gender
  * Size
  * Color
* **Material & Style**
  * Material / Fabric
  * Fit Type (Slim, Regular, Oversized, etc.)
  * Sleeve Type (if applicable)
  * Pattern (Solid, Striped, Floral, etc.)
  * Style (Casual, Formal, Sports, etc.)
* **Additional**
  * Season (Spring/Summer/Fall/Winter)
  * Occasion (Casual, Office, Party, etc.)
  * Authenticity (Original / Replica / Inspired)
  * Tags Available (Yes/No)
  * Warranty (if applicable)

---

### 👟 Shoes

* **Item Information**
  * Brand
  * Model
  * Shoe Type (Sneakers, Heels, Loafers, etc.)
  * Gender
* **Sizing & Fit**
  * Size (with size chart reference)
  * Condition
* **Details**
  * Color
  * Material
  * Original Box (Yes/No)
  * Usage Type (New, Worn Once, Lightly Used, etc.)
  * Warranty (if applicable)

---

### 👜 Bags

* **Bag Information**
  * Brand
  * Bag Type (Tote, Backpack, Shoulder, Crossbody, etc.)
  * Model (if available)
* **Material & Size**
  * Material
  * Color
  * Size (Small, Medium, Large, etc.)
* **Features**
  * Closure Type (Zip, Snap, Drawstring, etc.)
  * Strap Type (Handles, Shoulder Strap, Crossbody, etc.)
  * Waterproof (Yes/No)
  * Authenticity
  * Warranty (if applicable)

---

### ✨ Accessories

* **Item Information**
  * Type (Belt, Scarf, Sunglasses, Hat, Tie, etc.)
  * Brand (if available)
* **Details**
  * Material
  * Color
  * Size (if applicable)
  * Gender (if applicable)
  * Style
  * Warranty (if applicable)

---

### ⌚ Watches

* **Watch Information**
  * Brand
  * Model
* **Display & Design**
  * Gender
  * Display Type (Analog, Digital, Hybrid, Smart Watch)
  * Strap Material (Leather, Metal, Rubber, Fabric, etc.)
  * Dial Shape
  * Movement Type (Quartz, Mechanical, Automatic)
* **Features**
  * Water Resistant (Yes/No)
  * Original Box (Yes/No)
  * Warranty (if applicable)

---

### 💎 Jewelry

* **Item Information**
  * Type (Ring, Necklace, Bracelet, Earrings, Anklet, etc.)
  * Brand (if available)
* **Material & Design**
  * Material (Gold, Silver, Platinum, Costume, etc.)
  * Gender
  * Size (Ring Size, Necklace Length, etc.)
  * Stone Type (Diamond, Pearl, Gemstone, etc.)
  * Color (for stones)
* **Authentication**
  * Certification (Yes/No)
  * Authenticity (Genuine, Plated, etc.)
  * Warranty (if applicable)

---

## 💰 6. Pricing & Condition Section

* **Price Information**
  * Current Price (highlighted)
  * Currency
  * Negotiable Status (Yes/No)
* **Condition Details**
  * Overall Condition (New, Like New, Good, Fair)
  * Wear Description (if used)
  * Any Defects or Damage
  * Warranty Status

---

## 📏 7. Size Guide & Fit Information

* Interactive size chart for the item
* Suggested sizing notes
* Link to "How to Measure" guide
* Common fit issues with this brand (if applicable)
* Returns/Exchange policy note

---

## 👤 8. Seller / Shop Info

* Name
* Profile image / Shop logo
* Seller type (Individual / Shop / Boutique)
* Phone number (click to call)
* Email button
* "View All Listings" button
* Shop specialization (if seller is a shop)
* Response rate / Rating

---

## 📩 9. Contact Section

* Quick contact button
* WhatsApp button (if available)
* Contact Form:
  * Buyer Name
  * Email
  * Message (Ask about fit, sizing, shipping, etc.)
  * Send Inquiry button

---

## 🔁 10. Similar Listings

* Show 4–8 similar fashion items
* Based on:
  * Same subcategory and type
  * Similar price range
  * Same or nearby city
  * Same size (if applicable)
* Display thumbnail, price, size, and color

---

## 📊 11. Reviews & Ratings (Optional)

* Seller rating
* Number of positive reviews
* Quick testimonial snippets
* "See All Reviews" link

---

# 📋 Implementation Notes

## Visual Design

* Use high-quality product imagery
* Show multiple angles/sides if available
* Include close-up details for material/stitching
* Clear color representation (important for fashion)
* Maintain consistent aspect ratio for thumbnails

## Size & Fit Information

* Interactive size selector
* Visual size comparison
* Brand-specific fit notes
* Link to measurements or fitting help

## Color Representation

* Multiple colors shown as pill badges
* Color swatches if available
* Note: "Colors may vary based on display"

## Mobile Optimization

* Stack gallery prominently
* Sticky price and contact button
* Full-width specifications
* Quick-scroll to contact section
* Swipe gallery navigation

## Material & Condition

* Clear material listing (important for care instructions)
* Detailed condition photos if item is used
* Note any flaws or wear

## Authentication & Trust

* Display authenticity status prominently
* Show certification if available
* Highlight warranty or return policy
* Seller verification badge

## SEO & Accessibility

* Semantic HTML for product details
* ARIA labels for interactive elements
* Product schema markup (JSON-LD)
* Alt text for all images
* Color contrast for readability
