// src/lib/constants/vehicles.ts

export type VehicleType = 'sedan' | 'suv' | 'van' | 'truck' | 'pickup' | 'hatchback' | 'coupe' | 'motorcycle';

export interface VehicleMake {
  key: string;
  name_en: string;
  name_ps: string;
  name_fa: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  key: string;
  name: string;
  options?: readonly string[];
  trimLevels?: readonly string[];
}

// Vehicle types with translations
export const VEHICLE_TYPES: { key: VehicleType; name_en: string; name_ps: string; name_fa: string }[] = [
  { key: 'sedan', name_en: 'Sedan', name_ps: 'سیډان', name_fa: 'سدان' },
  { key: 'suv', name_en: 'SUV & Pickups', name_ps: 'ایس یو وی او پکپ', name_fa: 'شاسی بلند و پیکاپ' },
  { key: 'van', name_en: 'VAN & Minivans', name_ps: 'وان او مینی وان', name_fa: 'ون و مینی ون' },
  { key: 'truck', name_en: 'Trucks', name_ps: 'ټرکونه', name_fa: 'کامیون' },
  { key: 'pickup', name_en: 'Pickup', name_ps: 'پکپ', name_fa: 'وانت' },
  { key: 'hatchback', name_en: 'Hatchback', name_ps: 'هیچبیک', name_fa: 'هاچ بک' },
  { key: 'coupe', name_en: 'Coupe', name_ps: 'کوپ', name_fa: 'کوپه' },
  { key: 'motorcycle', name_en: 'Motorcycle', name_ps: 'موټرسایکل', name_fa: 'موتورسیکلت' },
];

// Makes per vehicle type
const SEDAN_MAKES: VehicleMake[] = [
  {
    key: 'toyota', name_en: 'Toyota', name_ps: 'ټویوټا', name_fa: 'تویوتا',
    models: [
      { key: 'corolla', name: 'Corolla' },
      { key: 'camry', name: 'Camry' },
      { key: 'yaris', name: 'Yaris' },
      { key: 'avalon', name: 'Avalon' },
      { key: 'premio', name: 'Premio' },
    ],
  },
  {
    key: 'honda', name_en: 'Honda', name_ps: 'هونډا', name_fa: 'هوندا',
    models: [
      { key: 'civic', name: 'Civic' },
      { key: 'accord', name: 'Accord' },
      { key: 'city', name: 'City' },
      { key: 'insight', name: 'Insight' },
    ],
  },
  {
    key: 'audi', name_en: 'Audi', name_ps: 'آوډي', name_fa: 'آئودی',
    models: [
      { key: 'a3', name: 'A3' },
      { key: 'a4', name: 'A4' },
      { key: 'a5', name: 'A5' },
      { key: 'a6', name: 'A6' },
      { key: 'a7', name: 'A7' },
      { key: 'a8', name: 'A8' },
    ],
  },
  {
    key: 'bmw', name_en: 'BMW', name_ps: 'بی ایم ډبلیو', name_fa: 'بی ام و',
    models: [
      { key: '3series', name: '3 Series' },
      { key: '5series', name: '5 Series' },
      { key: '7series', name: '7 Series' },
    ],
  },
  {
    key: 'mercedesBenz', name_en: 'Mercedes-Benz', name_ps: 'مرسدیس بنز', name_fa: 'مرسدس بنز',
    models: [
      { key: 'cClass', name: 'C-Class' },
      { key: 'eClass', name: 'E-Class' },
      { key: 'sClass', name: 'S-Class' },
      { key: 'aClass', name: 'A-Class' },
    ],
  },
  {
    key: 'hyundai', name_en: 'Hyundai', name_ps: 'هیونډای', name_fa: 'هیوندای',
    models: [
      { key: 'elantra', name: 'Elantra' },
      { key: 'sonata', name: 'Sonata' },
      { key: 'accent', name: 'Accent' },
      { key: 'azera', name: 'Azera' },
    ],
  },
  {
    key: 'kia', name_en: 'Kia', name_ps: 'کیا', name_fa: 'کیا',
    models: [
      { key: 'cerato', name: 'Cerato' },
      { key: 'optima', name: 'Optima / K5' },
      { key: 'rio', name: 'Rio' },
    ],
  },
  {
    key: 'nissan', name_en: 'Nissan', name_ps: 'نیسان', name_fa: 'نیسان',
    models: [
      { key: 'altima', name: 'Altima' },
      { key: 'sentra', name: 'Sentra' },
      { key: 'maxima', name: 'Maxima' },
    ],
  },
  {
    key: 'volkswagen', name_en: 'Volkswagen', name_ps: 'فولکس واگن', name_fa: 'فولکس واگن',
    models: [
      { key: 'passat', name: 'Passat' },
      { key: 'jetta', name: 'Jetta' },
      { key: 'arteon', name: 'Arteon' },
    ],
  },
  {
    key: 'suzuki', name_en: 'Suzuki', name_ps: 'سوزوکي', name_fa: 'سوزوکی',
    models: [
      { key: 'ciaz', name: 'Ciaz' },
      { key: 'swift', name: 'Swift' },
      { key: 'alto', name: 'Alto' },
      { key: 'cultus', name: 'Cultus' },
    ],
  },
];

const SUV_MAKES: VehicleMake[] = [
  {
    key: 'toyota', name_en: 'Toyota', name_ps: 'ټویوټا', name_fa: 'تویوتا',
    models: [
      { key: 'landCruiser', name: 'Land Cruiser' },
      { key: 'prado', name: 'Prado' },
      { key: 'rav4', name: 'RAV4' },
      { key: 'fortuner', name: 'Fortuner' },
      { key: 'hilux', name: 'Hilux' },
      { key: 'rush', name: 'Rush' },
    ],
  },
  {
    key: 'honda', name_en: 'Honda', name_ps: 'هونډا', name_fa: 'هوندا',
    models: [
      { key: 'crv', name: 'CR-V' },
      { key: 'hrv', name: 'HR-V' },
      { key: 'pilot', name: 'Pilot' },
    ],
  },
  {
    key: 'hyundai', name_en: 'Hyundai', name_ps: 'هیونډای', name_fa: 'هیوندای',
    models: [
      { key: 'tucson', name: 'Tucson' },
      { key: 'santaFe', name: 'Santa Fe' },
      { key: 'creta', name: 'Creta' },
    ],
  },
  {
    key: 'kia', name_en: 'Kia', name_ps: 'کیا', name_fa: 'کیا',
    models: [
      { key: 'sportage', name: 'Sportage' },
      { key: 'sorento', name: 'Sorento' },
      { key: 'seltos', name: 'Seltos' },
    ],
  },
  {
    key: 'nissan', name_en: 'Nissan', name_ps: 'نیسان', name_fa: 'نیسان',
    models: [
      { key: 'patrol', name: 'Patrol' },
      { key: 'xtrail', name: 'X-Trail' },
      { key: 'pathfinder', name: 'Pathfinder' },
    ],
  },
  {
    key: 'mercedesBenz', name_en: 'Mercedes-Benz', name_ps: 'مرسدیس بنز', name_fa: 'مرسدس بنز',
    models: [
      { key: 'gleClass', name: 'GLE' },
      { key: 'glcClass', name: 'GLC' },
      { key: 'gClass', name: 'G-Class' },
    ],
  },
  {
    key: 'bmw', name_en: 'BMW', name_ps: 'بی ایم ډبلیو', name_fa: 'بی ام و',
    models: [
      { key: 'x3', name: 'X3' },
      { key: 'x5', name: 'X5' },
      { key: 'x7', name: 'X7' },
    ],
  },
  {
    key: 'ford', name_en: 'Ford', name_ps: 'فورډ', name_fa: 'فورد',
    models: [
      { key: 'explorer', name: 'Explorer' },
      { key: 'escape', name: 'Escape' },
      { key: 'bronco', name: 'Bronco' },
    ],
  },
  {
    key: 'mitsubishi', name_en: 'Mitsubishi', name_ps: 'میتسوبیشي', name_fa: 'میتسوبیشی',
    models: [
      { key: 'pajero', name: 'Pajero' },
      { key: 'outlander', name: 'Outlander' },
      { key: 'asx', name: 'ASX' },
    ],
  },
  {
    key: 'suzuki', name_en: 'Suzuki', name_ps: 'سوزوکي', name_fa: 'سوزوکی',
    models: [
      { key: 'jimny', name: 'Jimny' },
      { key: 'vitara', name: 'Vitara' },
    ],
  },
];

const VAN_MAKES: VehicleMake[] = [
  {
    key: 'toyota', name_en: 'Toyota', name_ps: 'ټویوټا', name_fa: 'تویوتا',
    models: [
      { key: 'hiace', name: 'HiAce' },
      { key: 'sienna', name: 'Sienna' },
      { key: 'noah', name: 'Noah' },
      { key: 'alphard', name: 'Alphard' },
    ],
  },
  {
    key: 'honda', name_en: 'Honda', name_ps: 'هونډا', name_fa: 'هوندا',
    models: [
      { key: 'odyssey', name: 'Odyssey' },
      { key: 'stepwgn', name: 'Stepwgn' },
    ],
  },
  {
    key: 'hyundai', name_en: 'Hyundai', name_ps: 'هیونډای', name_fa: 'هیوندای',
    models: [
      { key: 'starex', name: 'Starex / H-1' },
      { key: 'staria', name: 'Staria' },
    ],
  },
  {
    key: 'kia', name_en: 'Kia', name_ps: 'کیا', name_fa: 'کیا',
    models: [
      { key: 'carnival', name: 'Carnival' },
    ],
  },
  {
    key: 'mercedesBenz', name_en: 'Mercedes-Benz', name_ps: 'مرسدیس بنز', name_fa: 'مرسدس بنز',
    models: [
      { key: 'vito', name: 'Vito' },
      { key: 'sprinter', name: 'Sprinter' },
      { key: 'vClass', name: 'V-Class' },
    ],
  },
  {
    key: 'ford', name_en: 'Ford', name_ps: 'فورډ', name_fa: 'فورد',
    models: [
      { key: 'transit', name: 'Transit' },
    ],
  },
  {
    key: 'volkswagen', name_en: 'Volkswagen', name_ps: 'فولکس واگن', name_fa: 'فولکس واگن',
    models: [
      { key: 'transporter', name: 'Transporter' },
      { key: 'caravelle', name: 'Caravelle' },
    ],
  },
];

const TRUCK_MAKES: VehicleMake[] = [
  {
    key: 'isuzu', name_en: 'Isuzu', name_ps: 'ایسوزو', name_fa: 'ایسوزو',
    models: [
      { key: 'npr', name: 'NPR' },
      { key: 'ftr', name: 'FTR' },
      { key: 'giga', name: 'Giga' },
    ],
  },
  {
    key: 'mitsubishi', name_en: 'Mitsubishi', name_ps: 'میتسوبیشي', name_fa: 'میتسوبیشی',
    models: [
      { key: 'canter', name: 'Canter' },
      { key: 'fuso', name: 'Fuso' },
    ],
  },
  {
    key: 'hino', name_en: 'Hino', name_ps: 'هینو', name_fa: 'هینو',
    models: [
      { key: 'hino300', name: '300 Series' },
      { key: 'hino500', name: '500 Series' },
      { key: 'hino700', name: '700 Series' },
    ],
  },
  {
    key: 'tata', name_en: 'Tata', name_ps: 'تاتا', name_fa: 'تاتا',
    models: [
      { key: 'lpt', name: 'LPT' },
      { key: 'ultra', name: 'Ultra' },
    ],
  },
  {
    key: 'mercedesBenz', name_en: 'Mercedes-Benz', name_ps: 'مرسدیس بنز', name_fa: 'مرسدس بنز',
    models: [
      { key: 'actros', name: 'Actros' },
      { key: 'atego', name: 'Atego' },
    ],
  },
  {
    key: 'ford', name_en: 'Ford', name_ps: 'فورډ', name_fa: 'فورد',
    models: [
      { key: 'f150', name: 'F-150' },
      { key: 'f250', name: 'F-250' },
      { key: 'ranger', name: 'Ranger' },
    ],
  },
];

const MOTORCYCLE_MAKES: VehicleMake[] = [
  {
    key: 'honda', name_en: 'Honda', name_ps: 'هونډا', name_fa: 'هوندا',
    models: [
      { key: 'cg125', name: 'CG 125' },
      { key: 'cb150', name: 'CB 150' },
      { key: 'cbr', name: 'CBR Series' },
      { key: 'xr', name: 'XR Series' },
      { key: 'crf', name: 'CRF Series' },
    ],
  },
  {
    key: 'yamaha', name_en: 'Yamaha', name_ps: 'یاماها', name_fa: 'یاماها',
    models: [
      { key: 'ybr125', name: 'YBR 125' },
      { key: 'r15', name: 'R15' },
      { key: 'mt15', name: 'MT-15' },
      { key: 'fz', name: 'FZ Series' },
    ],
  },
  {
    key: 'suzuki', name_en: 'Suzuki', name_ps: 'سوزوکي', name_fa: 'سوزوکی',
    models: [
      { key: 'gs150', name: 'GS 150' },
      { key: 'gsx', name: 'GSX Series' },
      { key: 'gixxer', name: 'Gixxer' },
    ],
  },
  {
    key: 'kawasaki', name_en: 'Kawasaki', name_ps: 'کاوازاکي', name_fa: 'کاوازاکی',
    models: [
      { key: 'ninja', name: 'Ninja Series' },
      { key: 'z', name: 'Z Series' },
    ],
  },
  {
    key: 'bajaj', name_en: 'Bajaj', name_ps: 'باجاج', name_fa: 'باجاج',
    models: [
      { key: 'pulsar', name: 'Pulsar' },
      { key: 'discover', name: 'Discover' },
      { key: 'platina', name: 'Platina' },
    ],
  },
];

const PICKUP_MAKES: VehicleMake[] = [
  {
    key: 'toyota', name_en: 'Toyota', name_ps: 'ټویوټا', name_fa: 'تویوتا',
    models: [
      { key: 'hilux', name: 'Hilux' },
      { key: 'tacoma', name: 'Tacoma' },
      { key: 'tundra', name: 'Tundra' },
    ],
  },
  {
    key: 'ford', name_en: 'Ford', name_ps: 'فورډ', name_fa: 'فورد',
    models: [
      { key: 'ranger', name: 'Ranger' },
      { key: 'f150', name: 'F-150' },
    ],
  },
  {
    key: 'mitsubishi', name_en: 'Mitsubishi', name_ps: 'میتسوبیشي', name_fa: 'میتسوبیشی',
    models: [
      { key: 'l200', name: 'L200 Triton' },
    ],
  },
  {
    key: 'nissan', name_en: 'Nissan', name_ps: 'نیسان', name_fa: 'نیسان',
    models: [
      { key: 'navara', name: 'Navara' },
      { key: 'frontier', name: 'Frontier' },
    ],
  },
  {
    key: 'isuzu', name_en: 'Isuzu', name_ps: 'ایسوزو', name_fa: 'ایسوزو',
    models: [
      { key: 'dmax', name: 'D-Max' },
    ],
  },
];

const HATCHBACK_MAKES: VehicleMake[] = [
  {
    key: 'toyota', name_en: 'Toyota', name_ps: 'ټویوټا', name_fa: 'تویوتا',
    models: [
      { key: 'yaris', name: 'Yaris' },
      { key: 'vitz', name: 'Vitz' },
      { key: 'aqua', name: 'Aqua' },
    ],
  },
  {
    key: 'honda', name_en: 'Honda', name_ps: 'هونډا', name_fa: 'هوندا',
    models: [
      { key: 'fit', name: 'Fit / Jazz' },
      { key: 'civicHatch', name: 'Civic Hatchback' },
    ],
  },
  {
    key: 'suzuki', name_en: 'Suzuki', name_ps: 'سوزوکي', name_fa: 'سوزوکی',
    models: [
      { key: 'swift', name: 'Swift' },
      { key: 'alto', name: 'Alto' },
      { key: 'cultus', name: 'Cultus' },
      { key: 'wagonR', name: 'Wagon R' },
    ],
  },
  {
    key: 'volkswagen', name_en: 'Volkswagen', name_ps: 'فولکس واگن', name_fa: 'فولکس واگن',
    models: [
      { key: 'golf', name: 'Golf' },
      { key: 'polo', name: 'Polo' },
    ],
  },
  {
    key: 'hyundai', name_en: 'Hyundai', name_ps: 'هیونډای', name_fa: 'هیوندای',
    models: [
      { key: 'i20', name: 'i20' },
      { key: 'i30', name: 'i30' },
    ],
  },
];

const COUPE_MAKES: VehicleMake[] = [
  {
    key: 'bmw', name_en: 'BMW', name_ps: 'بی ایم ډبلیو', name_fa: 'بی ام و',
    models: [
      { key: '4series', name: '4 Series' },
      { key: '8series', name: '8 Series' },
      { key: 'm4', name: 'M4' },
    ],
  },
  {
    key: 'mercedesBenz', name_en: 'Mercedes-Benz', name_ps: 'مرسدیس بنز', name_fa: 'مرسدس بنز',
    models: [
      { key: 'cCoupe', name: 'C-Class Coupe' },
      { key: 'eCoupe', name: 'E-Class Coupe' },
      { key: 'amgGt', name: 'AMG GT' },
    ],
  },
  {
    key: 'audi', name_en: 'Audi', name_ps: 'آوډي', name_fa: 'آئودی',
    models: [
      { key: 'a5Coupe', name: 'A5 Coupe' },
      { key: 'tt', name: 'TT' },
      { key: 'r8', name: 'R8' },
    ],
  },
  {
    key: 'ford', name_en: 'Ford', name_ps: 'فورډ', name_fa: 'فورد',
    models: [
      { key: 'mustang', name: 'Mustang' },
    ],
  },
];

// Map vehicle type to makes
export const MAKES_BY_TYPE: Record<VehicleType, VehicleMake[]> = {
  sedan: SEDAN_MAKES,
  suv: SUV_MAKES,
  van: VAN_MAKES,
  truck: TRUCK_MAKES,
  pickup: PICKUP_MAKES,
  hatchback: HATCHBACK_MAKES,
  coupe: COUPE_MAKES,
  motorcycle: MOTORCYCLE_MAKES,
};

// Engine types
export const ENGINE_TYPES = ['diesel', 'petrol', 'hybrid', 'electric', 'petrolLpg'] as const;
export type EngineType = typeof ENGINE_TYPES[number];

// Body types
export const BODY_TYPES = ['fourDoor', 'fiveDoor', 'hatchback', 'coupe', 'convertible', 'wagon'] as const;
export type BodyType = typeof BODY_TYPES[number];

// Gear types
export const GEAR_TYPES = ['automatic', 'manual', 'semiAutomatic'] as const;
export type GearType = typeof GEAR_TYPES[number];

// Engine sizes
export const ENGINE_SIZES = [
  '0.6', '0.8', '1.0', '1.2', '1.3', '1.4', '1.5', '1.6', '1.8',
  '2.0', '2.2', '2.4', '2.5', '2.7', '3.0', '3.2', '3.5', '4.0',
  '4.5', '5.0', '5.5', '6.0', '6.2',
];

// Colors
export const VEHICLE_COLORS = [
  'white', 'black', 'silver', 'gray', 'red', 'blue', 'green',
  'beige', 'gold', 'brown', 'orange', 'yellow', 'purple', 'navy',
  'maroon', 'champagne', 'other',
] as const;
export type VehicleColor = typeof VEHICLE_COLORS[number];

// Hand drive
export const HAND_DRIVES = ['left', 'right'] as const;
export type HandDrive = typeof HAND_DRIVES[number];

// Damage types for multi-select
export const DAMAGE_TYPES = [
  'paint', 'scratch', 'dent', 'crash', 'flood', 'rust', 'mechanical', 'other',
] as const;
export type DamageType = typeof DAMAGE_TYPES[number];

// Other options for multi-select
export const VEHICLE_OPTIONS = [
  'abs', 'airbags', 'leatherSeats', 'touchScreen', 'sunroof',
  'rearCamera', 'heatedSeats', 'cruiseControl', 'keylessEntry',
  'bluetooth', 'navigation', 'parkingSensors', 'fogLights',
  'alloyWheels', 'tintedWindows', 'roofRack',
] as const;
export type VehicleOption = typeof VEHICLE_OPTIONS[number];

// Afghanistan cities for number plate
export const AFGHANISTAN_CITIES = [
  'Kabul', 'Kandahar', 'Herat', 'Mazar-e-Sharif', 'Jalalabad', 'Kunduz',
  'Ghazni', 'Lashkargah', 'Khost', 'Gardez', 'Taloqan', 'Puli Khumri',
  'Sheberghan', 'Charikar', 'Sar-e Pol', 'Aybak', 'Mehtarlam', 'Faizabad',
  'Zaranj', 'Farah', 'Bamyan', 'Nili', 'Chaghcharan', 'Mahmud Raqi',
  'Asadabad', 'Panjshir', 'Parwan', 'Maidan Shar', 'Tarin Kowt',
  'Qalat', 'Pol-e Alam', 'Parun',
] as const;

// Helper: get makes for a vehicle type
export function getMakesForType(type: VehicleType): VehicleMake[] {
  return MAKES_BY_TYPE[type] || [];
}

// Helper: get models for a make within a type
export function getModelsForMake(type: VehicleType, makeKey: string): VehicleModel[] {
  const makes = getMakesForType(type);
  const make = makes.find((m) => m.key === makeKey);
  return make?.models || [];
}

// Helper: get make name by locale
export function getMakeName(make: VehicleMake, locale: 'en' | 'ps' | 'fa'): string {
  switch (locale) {
    case 'ps': return make.name_ps;
    case 'fa': return make.name_fa;
    default: return make.name_en;
  }
}

// Generate year range (current year down to 1970)
export function getYearRange(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 1; y >= 1970; y--) {
    years.push(y);
  }
  return years;
}

// Trim/Option levels
export const TRIM_LEVELS = [
  'base', 'standard', 'comfort', 'gl', 'xl', 'limited', 'premium',
  'sport', 'titanium', 'platinum', 'executive',
] as const;
export type TrimLevel = typeof TRIM_LEVELS[number];

const TRIMS_BY_VEHICLE_TYPE: Record<VehicleType, TrimLevel[]> = {
  sedan: ['base', 'standard', 'comfort', 'gl', 'xl', 'limited', 'premium', 'sport', 'executive'],
  suv: ['standard', 'comfort', 'limited', 'premium', 'sport', 'titanium', 'platinum', 'executive'],
  van: ['base', 'standard', 'comfort', 'gl', 'xl', 'limited'],
  truck: ['base', 'standard', 'gl', 'xl', 'limited', 'premium', 'titanium'],
  pickup: ['base', 'standard', 'gl', 'xl', 'limited', 'sport', 'titanium', 'platinum'],
  hatchback: ['base', 'standard', 'comfort', 'gl', 'xl', 'sport'],
  coupe: ['standard', 'comfort', 'limited', 'premium', 'sport', 'executive'],
  motorcycle: ['base', 'standard', 'sport', 'premium'],
};

const PREMIUM_TRIMS: TrimLevel[] = ['limited', 'premium', 'sport', 'titanium', 'platinum', 'executive'];
const BUDGET_TRIMS: TrimLevel[] = ['base', 'standard', 'comfort', 'gl', 'xl'];

const MODEL_TRIM_OVERRIDES: Record<string, TrimLevel[]> = {
  landCruiser: ['limited', 'premium', 'sport', 'titanium', 'platinum', 'executive'],
  prado: ['limited', 'premium', 'sport', 'titanium', 'executive'],
  hilux: ['base', 'standard', 'gl', 'xl', 'limited', 'sport'],
  corolla: ['base', 'standard', 'comfort', 'gl', 'xl', 'limited'],
  camry: ['standard', 'comfort', 'limited', 'premium', 'sport', 'executive'],
  civic: ['base', 'standard', 'sport', 'premium'],
  accord: ['standard', 'comfort', 'limited', 'premium', 'sport'],
  cClass: ['standard', 'premium', 'sport', 'executive'],
  eClass: ['comfort', 'premium', 'sport', 'executive', 'platinum'],
  sClass: ['limited', 'premium', 'sport', 'titanium', 'platinum', 'executive'],
  x5: ['limited', 'premium', 'sport', 'titanium', 'platinum'],
  x7: ['premium', 'sport', 'titanium', 'platinum', 'executive'],
  f150: ['base', 'standard', 'xl', 'limited', 'sport', 'titanium', 'platinum'],
  ranger: ['base', 'standard', 'gl', 'xl', 'limited', 'sport'],
  gs150: ['base', 'standard', 'sport'],
  ninja: ['standard', 'sport', 'premium'],
  cbr: ['standard', 'sport', 'premium'],
};

// ── Options available by vehicle type ──────────────────────────
// Base options that almost every car type can have
const BASE_CAR_OPTIONS: VehicleOption[] = [
  'abs', 'airbags', 'bluetooth', 'fogLights', 'alloyWheels', 'tintedWindows',
];

// Options typically found on premium / higher-trim cars
const PREMIUM_OPTIONS: VehicleOption[] = [
  ...BASE_CAR_OPTIONS,
  'leatherSeats', 'touchScreen', 'sunroof', 'rearCamera', 'heatedSeats',
  'cruiseControl', 'keylessEntry', 'navigation', 'parkingSensors', 'roofRack',
];

// Default options per vehicle type (without considering make)
const OPTIONS_BY_VEHICLE_TYPE: Record<VehicleType, VehicleOption[]> = {
  sedan: [...BASE_CAR_OPTIONS, 'leatherSeats', 'touchScreen', 'rearCamera', 'cruiseControl',
    'keylessEntry', 'navigation', 'parkingSensors', 'sunroof', 'heatedSeats'],
  suv: [...PREMIUM_OPTIONS],
  van: [...BASE_CAR_OPTIONS, 'rearCamera', 'parkingSensors', 'touchScreen', 'cruiseControl', 'roofRack'],
  truck: ['abs', 'airbags', 'bluetooth', 'fogLights', 'tintedWindows', 'rearCamera', 'parkingSensors'],
  pickup: [...BASE_CAR_OPTIONS, 'rearCamera', 'parkingSensors', 'touchScreen', 'cruiseControl', 'roofRack'],
  hatchback: [...BASE_CAR_OPTIONS, 'touchScreen', 'rearCamera', 'keylessEntry', 'parkingSensors'],
  coupe: [...PREMIUM_OPTIONS],
  motorcycle: ['abs'],
};

// Premium makes that unlock all options for their vehicle type
const PREMIUM_MAKES = new Set([
  'bmw', 'mercedesBenz', 'audi', 'ford',
]);

// Budget makes where only basic options are available
const BUDGET_MAKES = new Set([
  'suzuki', 'bajaj', 'tata',
]);

// Budget option subset (for budget makes)
const BUDGET_OPTIONS: VehicleOption[] = [
  'abs', 'airbags', 'bluetooth', 'fogLights', 'tintedWindows', 'alloyWheels',
];

/**
 * Get the list of vehicle options available for a given combination.
 * - vehicleType determines the base option set
 * - make refines: premium makes get all options, budget makes get fewer
 * - model can override if it has its own `options` array
 */
export function getOptionsForVehicle(
  vehicleType: VehicleType,
  makeKey?: string,
  modelKey?: string,
): VehicleOption[] {
  // If we can find the specific model and it has options defined, use those
  if (makeKey && modelKey) {
    const makes = getMakesForType(vehicleType);
    const make = makes.find((m) => m.key === makeKey);
    const model = make?.models.find((m) => m.key === modelKey);
    if (model?.options && model.options.length > 0) {
      return model.options as VehicleOption[];
    }
  }

  // Get base options for vehicle type
  const typeOptions = OPTIONS_BY_VEHICLE_TYPE[vehicleType] || BASE_CAR_OPTIONS;

  // Refine by make tier
  if (makeKey) {
    if (PREMIUM_MAKES.has(makeKey)) {
      // Premium makes: union of type options + premium options (deduplicated)
      const combined = new Set([...typeOptions, ...PREMIUM_OPTIONS]);
      return VEHICLE_OPTIONS.filter((opt) => combined.has(opt));
    }
    if (BUDGET_MAKES.has(makeKey)) {
      // Budget makes: intersection of type options and budget options
      const budgetSet = new Set(BUDGET_OPTIONS);
      return typeOptions.filter((opt) => budgetSet.has(opt));
    }
  }

  // Keep order consistent with VEHICLE_OPTIONS
  const typeSet = new Set(typeOptions);
  return VEHICLE_OPTIONS.filter((opt) => typeSet.has(opt));
}

export function getTrimLevelsForVehicle(
  vehicleType: VehicleType,
  makeKey?: string,
  modelKey?: string,
): TrimLevel[] {
  if (makeKey && modelKey) {
    const makes = getMakesForType(vehicleType);
    const make = makes.find((m) => m.key === makeKey);
    const model = make?.models.find((m) => m.key === modelKey);
    if (model?.trimLevels && model.trimLevels.length > 0) {
      return model.trimLevels as TrimLevel[];
    }
    const modelOverride = MODEL_TRIM_OVERRIDES[modelKey];
    if (modelOverride && modelOverride.length > 0) {
      return modelOverride;
    }
  }

  const typeTrims = TRIMS_BY_VEHICLE_TYPE[vehicleType] || [...TRIM_LEVELS];

  if (makeKey) {
    if (PREMIUM_MAKES.has(makeKey)) {
      const combined = new Set<TrimLevel>([...typeTrims, ...PREMIUM_TRIMS]);
      return TRIM_LEVELS.filter((trim) => combined.has(trim));
    }
    if (BUDGET_MAKES.has(makeKey)) {
      const budgetSet = new Set<TrimLevel>(BUDGET_TRIMS);
      return typeTrims.filter((trim) => budgetSet.has(trim));
    }
  }

  return typeTrims;
}
