Create a **dynamic multi-step Listing Wizard Form** for the **Services category** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Build a scalable listing wizard for all types of services
* Support multiple service categories
* Ensure all fields match future filter search
* Handle location-based and time-based services

---

# 📂 Category:

Services

## Subcategories:

* Home Services (Cleaning, Plumbing, كهرباء, etc.)
* Repair & Maintenance
* Automotive Services
* Beauty & Wellness Services
* Education & Tutoring
* IT & Digital Services
* Events & Entertainment
* Business Services
* Health & Medical Services
* Other Services

---

# 🧭 Wizard Steps

## ✅ Step 1: Basic Information

* Service Title
* Description
* Subcategory (Dropdown)
* Service Type:

  * On-site (at customer location)
  * At shop/location
  * Online / Remote

---

## ✅ Step 2: Location & Availability

* Service Location:

  * City (Cities Dropdown list)
  * Area
  * Location (Pick Location on map) (Optional)
* Service Coverage:

  * Radius (km)
  * Multiple cities (optional)
* Availability:

  * Days Available (multi-select)
  * Working Hours (From – To)
* Emergency Service (Yes/No)
* Advance Booking Required (Yes/No)

---

## ✅ Step 3: Pricing

* Pricing Type:

  * Fixed Price
  * Hourly Rate
  * Daily Rate
  * Custom Quote
* Price / Rate
* Currency
* Negotiable (Yes/No)
* Call-out Fee (Yes/No + amount)

---

## ✅ Step 4: Service Details (Dynamic)

---

# 🏠 Home Services / Repair / Automotive

* Service Type (Plumbing, Electrical, Car Repair, etc.)
* Experience (Years)
* Certification / License (Yes/No)
* Tools Provided (Yes/No)
* Spare Parts Included (Yes/No)
* Warranty (Yes/No + duration)
* Service Duration (estimated)
* Materials Included (Yes/No)

---

# 💇 Beauty & Wellness

* Service Type (Haircut, Makeup, Facial, etc.)
* Gender Served (Male, Female, Both)
* Experience
* Certified Professional (Yes/No)
* Products Used (optional)
* Session Duration
* Home Service Available (Yes/No)

---

# 🎓 Education & Tutoring

* Subject / Course
* Level (Beginner, Intermediate, Advanced)
* Mode (Online / In-person)
* Group or Individual
* Duration per session
* Experience (Years)
* Certification (Yes/No)

---

# 💻 IT & Digital Services

* Service Type (Web Development, SEO, Design, etc.)
* Skills (multi-select)
* Experience
* Tools/Technologies Used
* Delivery Time
* Revisions Included
* Portfolio Link

---

# 🎉 Events & Entertainment

* Service Type (DJ, Photographer, Organizer)
* Event Type (Wedding, Party, Corporate)
* Team Size
* Equipment Provided (Yes/No)
* Travel Available (Yes/No)
* Duration

---

# 🏢 Business Services

* Service Type (Consulting, Legal, Accounting)
* Industry
* Experience
* Certification / License
* Consultation Mode (Online / In-person)

---

# 🏥 Health & Medical Services

* Service Type (Doctor, Nurse, Therapist)
* Specialization
* Experience
* License Verified (Yes/No)
* Clinic or Home Visit
* Emergency Available

---

# 🔄 Other Services

* Custom Service Type
* Custom Fields (key-value input)

---

## ✅ Step 5: Media Upload

* Images (portfolio)
* Video (optional)
* Documents (certificates, licenses) (Optional)

---

## ✅ Step 6: Contact Details

* Contact Name (Auto fill "Profile name")
* Phone Number
* Whatsapp (Optional)
* Email
* Website (optional)
* Social Media Links (optional)

---

## ✅ Step 7: Review & Submit

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
  * Toggle
  * Time Picker
* Include:

  * Step progress bar
  * Next / Back navigation
  * Validation

---

# 🧠 CRITICAL RULE

All field names MUST match future filters exactly.

Example:

* "experience" in form = "experience" in filters
* "service_type" = "service_type"
* "pricing_type" = "pricing_type"

---

# 🎯 Output Required

* Full React multi-step wizard form
* Dynamic conditional rendering
* Clean Tailwind UI
* Example dummy data
* Modular structure

---

# 🎨 UI Design

* Modern clean UI
* Rounded inputs
* Soft shadows
* Proper spacing
* Mobile responsive

---

Make the system scalable so new service types and filters can be added easily.
