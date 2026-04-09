You are an expert React + TypeScript + Tailwind CSS developer building a multi-step wizard form for a vehicle marketplace app called "Bazaar" (using Supabase backend).

Create a clean, modern, mobile-first **multi-step wizard form** for posting a vehicle ad. The form must use your app's color palette:
- Main color: #c00000 (deep red)
- Secondary color: #ff7c00 (bright orange)
- Use neutral backgrounds, good contrast, and clean UI.

### Form Structure (Wizard Steps):

**Step 1: Basic Information**
- Ad Title (text input, required, max 100 chars)
- Ad Details / Description (textarea, required, min 50 chars)

**Step 2: Vehicle Specifications**
- Vehicle Type (required dropdown / chips):
  - Sedan
  - SUV & Pickups
  - Van & Minivans
  - Hatchback
  - Coupe
  - Convertible
  - Wagon
  - Truck
  - Motorcycle (optional)
  - Other

- Year (required, dropdown or number input from 1980 to current year +1)

- Make (required, dynamic dropdown): Show popular manufacturers (Toyota, Honda, Hyundai, Kia, Ford, Chevrolet, BMW, Mercedes-Benz, Audi, Nissan, Mazda, Suzuki, Volkswagen, etc.). Allow "Other" with text input.

- Model (required, dynamic dropdown): Populate based on selected Make (e.g., if Audi → A4, A6, Q5, etc.). Allow "Other".

- Trim / Option (dynamic dropdown): Based on selected Model + Year if possible. Example: For Audi A4 2022 → 40 TDI, 45 TFSI, 1.4 TFSI, 2.0 TDI, S line, etc. Allow "Other".

- Body Type (dropdown):
  - 4 Doors
  - 5 Doors
  - Hatchback
  - Coupe
  - Convertible
  - Wagon
  - SUV
  - Pickup
  - Other

- Gear Type (dropdown):
  - Automatic
  - Manual
  - Semi-Automatic

- Engine Type (dropdown):
  - Petrol
  - Diesel
  - Hybrid
  - Electric
  - Petrol & LPG / CNG

- Engine Size (text input, e.g., "2.0L", "1.6", "3500cc")

- Engine Power (text input, e.g., "197 hp", "150 bhp")

**Step 3: Condition & Pricing**
- Price (required, number input with currency AFN)
- Mileage (required, number input in km)
- Color (dropdown with common colors + "Other")
- Damage (Yes / No radio)
  - If Yes → Damage Details (textarea: paint, crash, flood, etc.)
- Exchange (Yes / No) – "Willing to exchange with another vehicle"
- Number Plate (Yes / No)
  - If Yes → Number Plate City (dropdown of all 34 provinces/cities of Afghanistan: Kabul, Kandahar, Herat, Mazar-i-Sharif, Jalalabad, etc. – list them all)
- Hand Drive (radio):
  - Left Hand Drive
  - Right Hand Drive

**Step 4: Location**
- Address: 
  - City (dropdown – same Afghanistan provinces/cities list)
  - Street / Area (text input)
- Location Picker: Compulsory interactive map (use Leaflet or Google Maps / any map component). User must be able to pick exact location (pin). Store latitude & longitude.

**Step 5: Media**
- Photos (multiple file upload, at least 1 photo compulsory, max 10, preview grid with remove option)
- Video (optional, single video upload or URL)

**Step 6: Contact Details**
- Phone / Mobile (required)
- WhatsApp (optional, checkbox to use same as phone)
- Email (optional)

### Requirements:
- Use React Hook Form + Zod for validation.
- Multi-step wizard with progress bar, Next/Previous buttons, and "Save Draft" option.
- Make dependent fields dynamic (Vehicle Type → Make → Model → Trim/Option).
- Show loading state while fetching makes/models if using API, but for now use static arrays with examples.
- Responsive design, beautiful UI with red/orange accents.
- Add helpful placeholders and hints where needed.
- At the end, show a "Preview Ad" button and "Submit to Bazaar" button.

Generate the complete component code (or break it into logical files if too long) with proper TypeScript types.

Start coding now.