Create a **Real Estate Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display full property details clearly and professionally
* Match fields from Listing Wizard
* Integrate map, gallery, and contact features
* Optimize for user trust and conversion

---

# 🧱 Page Structure

## 🖼️ 1. Image Gallery (Top Section)

* Main large image
* Thumbnail slider below
* Click to open full-screen gallery
* Optional video support
* Optional floor plan viewer

---

## 📌 2. Title & Price Section

* Property Title
* Price (formatted with currency)
* Price Type (Sale / Monthly Rent / Yearly Rent)
* Location (City + Area)
* Posted Date
* Save / Favorite button
* Share button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as icons:

* Bedrooms
* Bathrooms
* Area Size (sq ft / m²)
* Property Type
* Furnishing
* Parking

---

## 📝 4. Description Section

* Full description text
* “Read More / Show Less” toggle

---

## 🧾 5. Property Details (Structured Grid)

---

### 🏢 General Info

* Property Type
* Listing Type
* Condition
* Year Built
* Floor Number
* Total Floors

---

### 📐 Size & Layout

* Area Size
* Bedrooms
* Bathrooms
* Living Rooms
* Kitchen Type

---

### ❄️ Features

* Balcony
* Elevator
* Heating Type
* Air Conditioning

---

### 🚗 Parking

* Parking Available
* Number of Spaces

---

## 🏡 6. Amenities Section

Display as grid with icons:

* Security
* Gym
* Swimming Pool
* Garden
* Internet
* Cable TV
* Pets Allowed
* Wheelchair Access
* Smart Features

---

## 🗺️ 7. Map Location

* Embed map (Google Maps or Leaflet)
* Show marker at property location
* Show address or approximate location
* “Open in Maps” button

---

## 👤 8. Seller / Agent Info

* Name
* Profile image
* Seller type (Individual / Agent)
* Phone number (click to call)
* Email button
* “View All Listings” button

---

## 📩 9. Contact Form

* Name
* Email
* Message
* Send Inquiry button

---

## 🔁 10. Similar Listings

* Show 4–8 similar properties
* Based on:

  * Location
  * Price range
  * Property type

---

# ⚙️ Functional Requirements

* Use React hooks (useState, useEffect)
* Fetch listing data from API by ID
* Responsive layout
* Lazy load images
* Reusable components:

  * Gallery
  * InfoCard
  * Map
  * ContactForm
  * ListingCard


---

# 🎨 UI Layout

## Desktop:

* Left (70%): Images + Details
* Right (30%): Contact card + seller info (sticky)

## Mobile:

* Stacked layout
* Sticky bottom contact button

---

# ✨ UX Enhancements

* Sticky contact box
* Image zoom
* Smooth scrolling
* Highlight key features
* Breadcrumb navigation

---

# 🎯 Output Required

* Full React Listing Details Page
* Clean Tailwind UI
* API integration example
* Modular components

---

Make the page modern, fast, and user-friendly like top real estate platforms.
