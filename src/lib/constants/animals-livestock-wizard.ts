export type AnimalsLivestockSubcategory =
  | 'cattle'
  | 'poultry'
  | 'sheep-goats'
  | 'horses'
  | 'pets'
  | 'fish-aquatic'
  | 'other';

export interface AnimalsSubcategoryOption {
  value: AnimalsLivestockSubcategory;
  label: string;
}

export const ANIMALS_SUBCATEGORY_LABEL_KEYS: Record<AnimalsLivestockSubcategory, string> = {
  'cattle': 'subcategoryCattle',
  'poultry': 'subcategoryPoultry',
  'sheep-goats': 'subcategorySheepGoats',
  'horses': 'subcategoryHorses',
  'pets': 'subcategoryPets',
  'fish-aquatic': 'subcategoryFishAquatic',
  'other': 'subcategoryOther',
};

export type AnimalsSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface AnimalsSpecField {
  key: string;
  label: string;
  type: AnimalsSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
}

export const ANIMALS_SUBCATEGORIES: AnimalsSubcategoryOption[] = [
  { value: 'cattle', label: 'Cattle' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'sheep-goats', label: 'Sheep & Goats' },
  { value: 'horses', label: 'Horses' },
  { value: 'pets', label: 'Pets' },
  { value: 'fish-aquatic', label: 'Fish & Aquatic' },
  { value: 'other', label: 'Other' },
];

// Breed suggestions by subcategory
export const ANIMALS_BREEDS_BY_SUBCATEGORY: Record<AnimalsLivestockSubcategory, string[]> = {
  'cattle': ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Brahman', 'Limousin', 'Simmental', 'Local Breed'],
  'poultry': ['Broiler', 'Layer', 'Desi', 'Silkie', 'Australorp', 'Leghorn', 'Rhode Island Red', 'Local Breed'],
  'sheep-goats': ['Merino', 'Dorper', 'Boer', 'Saanen', 'Alpine', 'Nubian', 'Local Breed'],
  'horses': ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Appaloosa', 'Pony', 'Local Breed'],
  'pets': ['Persian Cat', 'German Shepherd', 'Labrador', 'Golden Retriever', 'Siamese Cat', 'Parrot', 'Rabbit', 'Hamster'],
  'fish-aquatic': ['Goldfish', 'Koi', 'Tilapia', 'Catfish', 'Guppy', 'Betta', 'Local Species'],
  'other': ['Other'],
};

// Health/Vaccination status options
export const HEALTH_STATUS_OPTIONS = [
  'Vaccinated',
  'Dewormed',
  'Veterinary Certificate Available',
  'Healthy (No Issues)',
  'Under Treatment',
  'Not Vaccinated',
];

// Age unit options
export const AGE_UNIT_OPTIONS = ['days', 'months', 'years'];

// Price type options
export const PRICE_TYPE_OPTIONS = ['Fixed', 'Negotiable', 'Per Head'];

// Common fields for all animal subcategories
const ANIMALS_COMMON_FIELDS: AnimalsSpecField[] = [
  { key: 'breed', label: 'Animal Breed', type: 'text', required: true, placeholder: 'Enter breed or select from suggestions' },
  { key: 'quantity', label: 'Quantity', type: 'number', required: true },
  { 
    key: 'age', 
    label: 'Age', 
    type: 'unit', 
    required: false,
    unitOptions: AGE_UNIT_OPTIONS 
  },
  { 
    key: 'healthStatus', 
    label: 'Health/Vaccination Status', 
    type: 'select', 
    required: true,
    options: HEALTH_STATUS_OPTIONS 
  },
  { key: 'price', label: 'Price', type: 'number', required: true },
  { 
    key: 'priceType', 
    label: 'Price Type', 
    type: 'select', 
    required: true,
    options: PRICE_TYPE_OPTIONS 
  },
  { key: 'color', label: 'Color/Markings', type: 'text', required: false },
  { key: 'weight', label: 'Weight (approx)', type: 'text', required: false, placeholder: 'e.g., 50 kg' },
  { key: 'gender', label: 'Gender', type: 'select', required: false, options: ['Male', 'Female', 'Mixed'] },
];

// Subcategory-specific fields
const CATTLE_SPECIFIC_FIELDS: AnimalsSpecField[] = [
  { key: 'milkProduction', label: 'Milk Production (per day)', type: 'text', placeholder: 'e.g., 20 liters' },
  { key: 'pregnancyStatus', label: 'Pregnancy Status', type: 'select', options: ['Not Pregnant', 'Pregnant', 'Recently Calved'] },
  { key: 'hornStatus', label: 'Horn Status', type: 'select', options: ['Horned', 'Polled', 'Dehorned'] },
];

const POULTRY_SPECIFIC_FIELDS: AnimalsSpecField[] = [
  { key: 'eggProduction', label: 'Egg Production (per week)', type: 'text', placeholder: 'e.g., 5 eggs' },
  { key: 'housingType', label: 'Housing Type', type: 'select', options: ['Free Range', 'Cage', 'Backyard'] },
  { key: 'vaccinationRecord', label: 'Vaccination Record Available', type: 'toggle' },
];

const SHEEP_GOATS_FIELDS: AnimalsSpecField[] = [
  { key: 'woolType', label: 'Wool Type (Sheep)', type: 'text', placeholder: 'e.g., Fine, Medium' },
  { key: 'milkProduction', label: 'Milk Production (per day)', type: 'text', placeholder: 'e.g., 2 liters' },
  { key: 'meatType', label: 'Meat Type', type: 'select', options: ['Mutton', 'Goat Meat', 'Both'] },
];

const HORSES_FIELDS: AnimalsSpecField[] = [
  { key: 'height', label: 'Height (hands)', type: 'text' },
  { key: 'trainingLevel', label: 'Training Level', type: 'select', options: ['Untrained', 'Basic', 'Advanced', 'Competition'] },
  { key: 'discipline', label: 'Discipline', type: 'select', options: ['Riding', 'Racing', 'Draft', 'Show'] },
];

const PETS_FIELDS: AnimalsSpecField[] = [
  { key: 'petType', label: 'Pet Type', type: 'select', options: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Rodent', 'Reptile', 'Other'] },
  { key: 'vaccinated', label: 'Vaccinated', type: 'toggle' },
  { key: 'spayedNeutered', label: 'Spayed/Neutered', type: 'toggle' },
  { key: 'microchipped', label: 'Microchipped', type: 'toggle' },
  { key: 'pedigree', label: 'Pedigree Available', type: 'toggle' },
];

const FISH_AQUATIC_FIELDS: AnimalsSpecField[] = [
  { key: 'waterType', label: 'Water Type', type: 'select', options: ['Freshwater', 'Saltwater', 'Brackish'] },
  { key: 'tankSize', label: 'Tank Size Recommended', type: 'text', placeholder: 'e.g., 50 gallons' },
  { key: 'breedingStatus', label: 'Breeding Status', type: 'select', options: ['Juvenile', 'Adult', 'Breeding Pair'] },
];

export const ANIMALS_SPEC_CONFIG: Record<AnimalsLivestockSubcategory, AnimalsSpecField[]> = {
  'cattle': [...ANIMALS_COMMON_FIELDS, ...CATTLE_SPECIFIC_FIELDS],
  'poultry': [...ANIMALS_COMMON_FIELDS, ...POULTRY_SPECIFIC_FIELDS],
  'sheep-goats': [...ANIMALS_COMMON_FIELDS, ...SHEEP_GOATS_FIELDS],
  'horses': [...ANIMALS_COMMON_FIELDS, ...HORSES_FIELDS],
  'pets': [...ANIMALS_COMMON_FIELDS, ...PETS_FIELDS],
  'fish-aquatic': [...ANIMALS_COMMON_FIELDS, ...FISH_AQUATIC_FIELDS],
  'other': ANIMALS_COMMON_FIELDS,
};

// Helper function to get breed suggestions for a subcategory
export function getBreedSuggestions(subcategory: AnimalsLivestockSubcategory): string[] {
  return ANIMALS_BREEDS_BY_SUBCATEGORY[subcategory] || [];
}

// Helper function to get spec config for a subcategory
export function getAnimalsSpecsConfig(subcategory: AnimalsLivestockSubcategory): AnimalsSpecField[] {
  return ANIMALS_SPEC_CONFIG[subcategory] || ANIMALS_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getAnimalsFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getAnimalsOptionTranslationKey(option: string): string {
  // The translation keys in JSON files match the option values exactly
  // (with spaces and original case), so we don't need to normalize
  return `optionLabels.${option}`;
}