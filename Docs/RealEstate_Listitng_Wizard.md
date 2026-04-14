Create a **dynamic multi-step Listing Wizard Form** for the **Real Estate category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a scalable listing wizard for real estate properties
* Support multiple property types and listing types
* Ensure all fields match future filter search
* Use dynamic fields based on property type

---

# 📂 Category:

Real Estate

## Subcategories (Property Types):

* Apartment
* House / Villa
* Commercial Property
* Office
* Shop / Retail
* Land / Plot
* Industrial Property
* Room / Shared Space
* Other

---

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Title
* Description
* Property Type (Dropdown from above list)
* Listing Type:

  * Sale
  * Rent

---

## ✅ Step 2: Location Details

* City
* Area / District
* Full Address (optional)
* Map Location (Google Maps pin / coordinates)(Optional)

---

## ✅ Step 3: Pricing & Availability

* Price
* Currency
* Price Type:

  * Total Price (for sale)
  * Monthly Rent
  * Yearly Rent
* Negotiable (Yes/No)
* Available From (Date)
* Furnishing:

  * Furnished
  * Semi-Furnished
  * Unfurnished

---

## ✅ Step 4: Property Specifications (Dynamic)

---

# 🏢 Apartment / House / Villa

* Bedrooms
* Bathrooms
* Area Size (sq ft / m²)
* Floor Number
* Total Floors
* Year Built
* Parking (Yes/No + spaces)
* Balcony (Yes/No)
* Elevator (Yes/No)
* Heating Type
* Cooling (AC) (Yes/No)
* Kitchen Type (Open / Closed)
* Living Rooms
* Condition (New / Used / Renovated)

---

# 🏬 Commercial / Office / Shop

* Property Type (Office, Shop, Showroom)
* Area Size
* Floor Number
* Total Floors
* Parking
* Furnished (Yes/No)
* Meeting Rooms
* Washrooms
* Reception Area (Yes/No)
* Suitable For (Business Type)
* Condition

---

# 🌍 Land / Plot

* Land Type (Residential, Commercial, Agricultural)
* Area Size
* Plot Dimensions
* Road Access (Yes/No)
* Corner Plot (Yes/No)
* Zoning Type
* Utilities Available:

  * Water
  * Electricity
  * Gas

---

# 🏭 Industrial Property

* Property Type (Warehouse, Factory)
* Area Size
* Ceiling Height
* Loading Docks
* Power Supply
* Office Space Included (Yes/No)
* Security Features

---

# 🛏️ Room / Shared Space

* Room Type (Private / Shared)
* Number of Occupants
* Bathroom Type (Private / Shared)
* Furnished (Yes/No)
* Bills Included (Yes/No)
* Gender Preference

---

# 🔄 Other

* Custom Property Type
* Custom Specifications (key-value pairs)

---

## ✅ Step 5: Amenities & Features

* Security (Yes/No)
* Gym
* Swimming Pool
* Garden
* Internet
* Cable TV
* Pets Allowed
* Wheelchair Access
* Smart Home Features

---

## ✅ Step 6: Media Upload

* Images (multiple)
* Video (optional)
* Floor Plan (optional)

---

## ✅ Step 7: Contact & Review

* Contact: (Profile Name)
* Phone Number:
* Whatsapp: (Optional)
* Email (optional)
* Show all entered data
* Edit per section
* Submit button

---

# ⚙️ Functional Requirements

* Use React hooks (useState)
* Dynamic rendering based on property type
* Use reusable components:

  * Input
  * Select
  * Checkbox
  * Toggle
  * Date Picker
* Include:

  * Step progress bar
  * Next / Back navigation
  * Form validation

---

# 🧠 CRITICAL RULE

All field names MUST match future filters exactly.

Example:

* "bedrooms" in form = "bedrooms" in filters
* "area_size" = "area_size"
* "price" = "price"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data
* Modular component structure

---

# 🎨 UI Design

* Modern clean UI
* Rounded inputs
* Soft shadows
* Proper spacing
* Mobile responsive
* Optional collapsible sections

---

Make the system scalable for adding new property types and features in the future.
