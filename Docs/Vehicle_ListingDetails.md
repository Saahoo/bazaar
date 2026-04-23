Create a **Vehicle Listing Details Page** using **React (Hooks) + Tailwind CSS**.

---

# 🎯 Goal

* Display vehicle details with comprehensive specifications and condition information
* Match fields from Vehicle Listing Wizard
* Integrate map location and vehicle history
* Optimize for vehicle shopping with detailed specifications and trust signals

---

# 📂 Category:

Vehicles

## Vehicle Types:

* Sedan
* SUV & Pickups
* Van & Minivans
* Hatchback
* Coupe
* Convertible
* Wagon
* Truck
* Motorcycle
* Other

---

# 🧱 Page Structure

## 🖼️ 1. Image Gallery (Top Section)

* Main large vehicle image (exterior front view)
* Multiple angles:
  * Front view
  * Rear view
  * Side view
  * Interior (dashboard, seating)
  * Detail shots (wheels, condition issues)
  * Close-ups of any damage
* Thumbnail slider below (up to 12 images)
* Click to open full-screen gallery
* 360° view option (if available)
* Video walk-around option (if uploaded)

---

## 📌 2. Title & Price Section

* Vehicle Title (e.g., "2022 Toyota Corolla Automatic Sedan")
* Price (formatted with currency - AFN)
* Mileage (km)
* Location (City)
* Posted Date
* Listing ID / Reference Number
* Inspection/Certification Badge (if applicable)
* Save / Favorite button
* Share button
* Contact Seller button

---

## 🏷️ 3. Key Highlights (Quick Info Bar)

Show as icons + values:

* Year
* Make / Model
* Mileage (km)
* Transmission Type (Automatic / Manual)
* Fuel Type
* Vehicle Type (Body Style)
* Condition Status (Damage indicator)

---

## 📝 4. Vehicle Description Section

* Full vehicle description
* History summary (ownership, service, etc.)
* Special features or modifications
* "Read More / Show Less" toggle

---

## 🧾 5. Vehicle Specifications (Detailed Grid)

### 🚗 General Information

* **Make & Model**
  * Make (Toyota, Honda, BMW, etc.)
  * Model (Corolla, Civic, 3 Series, etc.)
  * Trim / Option Level
* **Year & Registration**
  * Year (2022)
  * Registration Year
  * Vehicle ID / VIN (if available)

---

### 🔧 Engine & Performance

* **Engine Specifications**
  * Engine Type (Petrol / Diesel / Hybrid / Electric / Petrol & LPG/CNG)
  * Engine Size (2.0L, 1.6, 3500cc, etc.)
  * Engine Power (hp/bhp)
  * Transmission (Automatic / Manual / Semi-Automatic)
  * Fuel Efficiency (km/l if known)
* **Performance**
  * 0-100 km/h Time (if known)
  * Top Speed (if known)

---

### 🚕 Body & Exterior

* **Body Style**
  * Vehicle Type (Sedan, SUV, Hatchback, Coupe, Convertible, Wagon, Truck, Motorcycle, etc.)
  * Body Type (4 Doors / 5 Doors / 2 Doors / etc.)
  * Color
  * Exterior Condition (Excellent / Good / Fair / Poor)
* **Exterior Features**
  * Sunroof / Panoramic Roof (Yes/No)
  * Alloy Wheels (Yes/No)
  * Spoiler (Yes/No)
  * Running Boards / Side Steps (Yes/No)

---

### 🪑 Interior & Comfort

* **Seating**
  * Number of Seats
  * Upholstery (Leather / Fabric / Synthetic)
  * Heated Seats (Yes/No)
  * Power Seats (Yes/No)
* **Interior Features**
  * Dashboard Type (Digital / Analog / Hybrid)
  * Steering Wheel Type (Leather / Standard)
  * Power Windows (Yes/No)
  * Power Steering (Yes/No)
  * Air Conditioning (Manual / Automatic)
  * Cruise Control (Yes/No)
* **Interior Condition**
  * Overall Interior Condition (Excellent / Good / Fair / Poor)
  * Mileage-Adjusted Wear Level

---

### 🎵 Technology & Entertainment

* **Audio System**
  * Radio / CD / DVD / Bluetooth
  * Speaker Count / System
* **Navigation & Safety**
  * GPS / Navigation System (Yes/No)
  * Backup Camera (Yes/No)
  * Parking Sensors (Yes/No)
  * Collision Warning System (Yes/No)
  * Airbags Count
  * ABS (Yes/No)
  * Stability Control (Yes/No)

---

### 🛣️ Drive & Handling

* **Drive Configuration**
  * Hand Drive (Left / Right)
  * Wheel Drive (Front / Rear / All-Wheel Drive / AWD)
  * Traction Control (Yes/No)
* **Suspension**
  * Suspension Type (if known)
  * Ground Clearance (if relevant for SUV/Truck)

---

### ⚙️ Maintenance & Condition

* **Mileage & Usage**
  * Total Mileage (km)
  * Average Mileage Per Year (calculated)
  * Service History (Complete / Partial / None)
  * Last Service Date (if available)
* **Damage & Repairs**
  * Has Damage (Yes / No)
  * Damage Details (if damage exists)
    * Paint damage
    * Crash damage
    * Flood damage
    * Mechanical damage
    * Other
  * Major Repairs (Yes / No)
  * Repair Details (if applicable)
* **Overall Condition**
  * Condition Assessment (Excellent / Good / Fair / Poor)
  * Condition Notes

---

### 🔖 Warranty & Documentation

* **Warranty**
  * Manufacturer Warranty (Yes/No)
  * Warranty Duration (if remaining)
  * Extended Warranty (Yes/No)
* **Documentation**
  * Registration (Valid / Expired / Not Available)
  * Insurance (Yes / No)
  * Service Records (Yes/No)
  * Original Documents (Yes/No)

---

## 💰 6. Pricing & Transaction Information

* **Price Information**
  * Listed Price (highlighted)
  * Currency (AFN / USD / etc.)
  * Negotiable Status (Yes / No)
* **Payment Options**
  * Cash Payment Accepted
  * Financing Options (if available)
  * Exchange Accepted (Yes/No)
  * If Exchange: Trade-in Details
* **Additional Costs**
  * Transfer & Registration Fees
  * Insurance Estimate (if available)
  * Inspection Certificate Cost (if available)

---

## 🗺️ 7. Location & Pickup Information

* **Vehicle Location**
  * City (Province)
  * Street / Area Description
  * Map with vehicle location marker
  * "Get Directions" button
  * Google Maps link
* **Pickup / Delivery**
  * Available for Immediate Pickup (Yes/No)
  * Delivery Available (Yes/No if local/regional)
  * Pickup Arrangements
  * Delivery Cost (if applicable)

---

## 👤 8. Seller / Dealer Info

* Name / Dealership Name
* Profile image / Dealer logo
* Seller type (Individual / Authorized Dealer / Used Car Dealer)
* Phone number (click to call)
* WhatsApp (if available)
* Email button
* "View All Listings" button
* Dealership / Personal Bio
* Response rate / Rating
* Member since date
* Number of vehicles listed

---

## 📩 9. Contact & Inspection Section

* **Quick Contact Options**
  * Call Button
  * WhatsApp Button
  * Email Button
  * Message Form
* **Inspection & Test Drive**
  * "Schedule Test Drive" button
  * "Request Inspection" button
  * Inspection Options (In-person / Third-party)
* **Contact Form**
  * Buyer Name
  * Email
  * Phone
  * Message (Inquiry about condition, history, test drive, etc.)
  * Send Inquiry Button

---

## 🏅 10. Vehicle History & Certification (Optional)

* **History Report**
  * Ownership Count
  * Previous Owners (Private / Commercial)
  * Accident History
  * Theft Records
  * Lien Status
* **Certification Badges**
  * Certified Pre-Owned (if applicable)
  * Inspection Certified
  * Clean Title
  * No Major Accidents
  * Odometer Certification

---

## ⭐ 11. Reviews & Ratings

* **Seller Rating**
  * Overall Rating (stars)
  * Number of Reviews
  * Response Rate
* **Vehicle Reviews** (if multiple vehicles of same model listed)
  * Condition Rating
  * Reliability Feedback
  * Price Fairness
  * Recent Reviews

---

## 🔁 12. Similar Listings

* Show 4–8 similar vehicles
* Based on:
  * Same make and model
  * Similar year (±2-3 years)
  * Similar price range
  * Same or nearby city
* Display thumbnail, year, mileage, price, and location

---

## 📊 13. Market Information (Optional)

* **Price Comparison**
  * Average price for same make/model/year
  * Price position (Below / At / Above average)
  * Market value estimate
* **Market Trends**
  * Demand level (High / Medium / Low)
  * Average days on market

---

# 📋 Implementation Notes

## Visual Presentation

* High-quality vehicle photography essential
* 360° views or walk-around video highly valuable
* Clear interior and exterior condition photos
* Close-ups of any damage or wear
* Odometer reading clearly visible in photos
* Registration and documents in photos (if applicable)

## Condition Assessment

* Transparent condition grading system
* Detailed damage descriptions with photos
* Mileage-appropriate wear indicators
* Service history documentation
* Certification badges for verified condition

## Trust Building

* Seller verification badges
* Detailed seller information and history
* Multiple ways to contact seller
* Test drive scheduling option
* Third-party inspection option
* Market comparison data

## Specification Accuracy

* Complete and accurate specifications
* Correct year, make, model, trim
* Accurate mileage (critical for pricing)
* Honest condition assessment
* Clear damage history

## Mobile Optimization

* Gallery prominence for vehicle photos
* Sticky contact buttons
* One-tap calling for test drive
* Quick access to location map
* Streamlined specification viewing
* Mobile-friendly inspection/test drive booking

## Financial Transparency

* Clear pricing with no hidden costs
* Financing information (if available)
* Transfer and registration fees explained
* Insurance estimates
* Exchange/trade-in details

## Documentation

* Clear display of required documents
* Registration status visible
* Insurance verification
* Service records (if available)
* Ownership history (number of previous owners)

## Safety Features Highlight

* Airbags count and type
* Safety rating badges
* Anti-lock brakes
* Stability control
* Backup camera and sensors

## Accessibility & SEO

* Semantic HTML for vehicle details
* ARIA labels for interactive elements
* Proper heading hierarchy
* Vehicle schema markup (JSON-LD)
* Alt text for all images including condition shots
* Readable font sizes for specifications
* Color contrast for important information

## Legal Compliance

* Clear statement of vehicle condition
* Disclaimer for accuracy of information
* Inspection report links (if available)
* Title status clearly stated
* Any known recalls (if applicable)
