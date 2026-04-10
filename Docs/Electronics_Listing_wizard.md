Build a dynamic, multi-step (wizard-style) listing form for a marketplace web app.

Tech Stack:
- React (Next.js) with TypeScript
- Tailwind CSS (modern UI)
- React Hook Form + Zod validation
- State management: Zustand or Context API
- Multi-language support: English, Pashto, Dari (i18n ready)
- Fully mobile responsive

-------------------------------------

CORE IDEA:

The form must support MULTIPLE CATEGORIES (excluding Vehicles & Real Estate), with dynamic fields based on selected category and subcategory.

Main Category Example:
- Electronics

Subcategories:
- Phones
- Tablets
- Laptops
- Desktops
- Home Appliances
- Music Instruments
- Other Electronics

-------------------------------------

FORM STRUCTURE (MULTI-STEP WIZARD)

Step 1: Category Selection
- Category (dropdown)
- Subcategory (dropdown, depends on category)

-------------------------------------

Step 2: Basic Info
- Ad Title (text, required)
- Ad Details (textarea, required)

-------------------------------------

Step 3: Product Specifications (DYNAMIC)

IMPORTANT:
Fields must change dynamically based on selected subcategory.

Example: If Subcategory = "Phones"

- Make (dropdown, required)
  Example: Apple, Samsung, Xiaomi, Huawei, Oppo, etc.

- Model (dropdown, required)
  Depends on Make
  Example:
    Apple → iPhone 11, 12, 13, 14, 15
    Samsung → S21, S22, A51, etc.

- Storage (dropdown)
  Example: 64GB, 128GB, 256GB, 512GB

- RAM (dropdown)
  Example: 4GB, 6GB, 8GB, 12GB

- Condition (dropdown)
  New, Like New, Used, Refurbished

- Color (dropdown)

-------------------------------------

If Subcategory = "Laptops":

- Brand (dropdown)
- Model (dropdown)
- Processor (text or dropdown)
- RAM
- Storage
- GPU (optional)
- Condition

-------------------------------------

If Subcategory = "Home Appliances":

- Type (e.g., Refrigerator, Washing Machine, AC)
- Brand
- Model
- Condition

-------------------------------------

If Subcategory = "Music Instruments":

- Type (Guitar, Piano, etc.)
- Brand
- Condition

-------------------------------------

REQUIREMENT:
- Use a flexible schema-driven system so new categories/subcategories can be added easily
- Use config JSON to define fields per subcategory

-------------------------------------

Step 4: Price & Condition
- Price (required)
- Negotiable (Yes/No toggle)
- Condition (if not already included)

-------------------------------------

Step 5: Location
- City
- Area
- Street
- Map Picker ()
  - User must pin location (Google Maps or Mapbox)
  - Save latitude & longitude

-------------------------------------

Step 6: Media Upload

IMPORTANT (MOBILE-FIRST UX):
Provide TWO upload options:

1. Camera (capture photo directly)
2. Gallery (choose from device)

- Photos (required, minimum 1)
- Video (optional)

-------------------------------------

Step 7: Contact Details
- Phone / Mobile (required)
- WhatsApp (optional)
- Email (optional)

-------------------------------------

FUNCTIONAL REQUIREMENTS:

- Dynamic dependent dropdowns:
  Subcategory → Make → Model

- Conditional rendering:
  Fields change based on subcategory

- Validation:
  Required fields enforced
  Inline error messages

- UX:
  Stepper with progress bar
  Back / Next buttons
  Smooth transitions

- Mobile UX:
  Large buttons
  Sticky "Next" button
  Optimized image upload (camera/gallery support)

-------------------------------------

DATA STRUCTURE (FLEXIBLE)

Provide schema like:

{
  "category": "Electronics",
  "subcategory": "Phones",
  "title": "string",
  "details": "string",
  "specs": {
    "make": "string",
    "model": "string",
    "storage": "string",
    "ram": "string",
    "condition": "string",
    "color": "string"
  },
  "price": "number",
  "negotiable": "boolean",
  "location": {
    "city": "string",
    "area": "string",
    "street": "string",
    "lat": "number",
    "lng": "number"
  },
  "media": {
    "photos": ["url"],
    "video": "url"
  },
  "contact": {
    "phone": "string",
    "whatsapp": "string",
    "email": "string"
  }
}

-------------------------------------

OUTPUT EXPECTED:

1. Full React multi-step form
2. Dynamic field rendering system (config-based)
3. Reusable components:
   - Dropdown
   - Input
   - Stepper
   - Upload (Camera + Gallery support)
4. Validation schema (Zod)
5. Sample dataset for:
   - Electronics brands & models
6. Clean, modular, scalable code

-------------------------------------

FOCUS ON:
- Reusability (important)
- Clean architecture
- Mobile-first UX
- Easy future expansion for new categories