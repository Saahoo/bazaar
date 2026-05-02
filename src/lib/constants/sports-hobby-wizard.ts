export type SportsHobbySubcategory =
  | 'sports-equipment'
  | 'fitness-gear'
  | 'outdoor-gear'
  | 'team-sports'
  | 'water-sports'
  | 'winter-sports'
  | 'collectibles'
  | 'hobby-tools'
  | 'musical-instruments'
  | 'art-supplies'
  | 'games-puzzles'
  | 'other-sports-hobby';

export interface SportsHobbySubcategoryOption {
  value: SportsHobbySubcategory;
  label: string;
}

export const SPORTS_HOBBY_SUBCATEGORY_LABEL_KEYS: Record<SportsHobbySubcategory, string> = {
  'sports-equipment': 'subcategorySportsEquipment',
  'fitness-gear': 'subcategoryFitnessGear',
  'outdoor-gear': 'subcategoryOutdoorGear',
  'team-sports': 'subcategoryTeamSports',
  'water-sports': 'subcategoryWaterSports',
  'winter-sports': 'subcategoryWinterSports',
  'collectibles': 'subcategoryCollectibles',
  'hobby-tools': 'subcategoryHobbyTools',
  'musical-instruments': 'subcategoryMusicalInstruments',
  'art-supplies': 'subcategoryArtSupplies',
  'games-puzzles': 'subcategoryGamesPuzzles',
  'other-sports-hobby': 'subcategoryOther',
};

export type SportsHobbySpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'textarea';

export interface SportsHobbySpecField {
  key: string;
  label: string;
  type: SportsHobbySpecFieldType;
  required?: boolean;
  options?: string[];
  dependsOn?: string;
  showWhen?: { field: string; values: string[] };
  placeholder?: string;
  min?: number;
  max?: number;
}

export const SPORTS_HOBBY_SUBCATEGORIES: SportsHobbySubcategoryOption[] = [
  { value: 'sports-equipment', label: 'Sports Equipment' },
  { value: 'fitness-gear', label: 'Fitness Gear' },
  { value: 'outdoor-gear', label: 'Outdoor Gear' },
  { value: 'team-sports', label: 'Team Sports' },
  { value: 'water-sports', label: 'Water Sports' },
  { value: 'winter-sports', label: 'Winter Sports' },
  { value: 'collectibles', label: 'Collectibles' },
  { value: 'hobby-tools', label: 'Hobby Tools' },
  { value: 'musical-instruments', label: 'Musical Instruments' },
  { value: 'art-supplies', label: 'Art Supplies' },
  { value: 'games-puzzles', label: 'Games & Puzzles' },
  { value: 'other-sports-hobby', label: 'Other Sports & Hobby' },
];

// Brand/Manufacturer data for different subcategories
export const SPORTS_HOBBY_BRANDS_BY_SUBCATEGORY: Record<SportsHobbySubcategory, string[]> = {
  'sports-equipment': ['Nike', 'Adidas', 'Wilson', 'Spalding', 'Mikasa', 'Molten', 'Franklin'],
  'fitness-gear': ['Bowflex', 'NordicTrack', 'Peloton', 'Sole', 'ProForm', 'Life Fitness', 'Precor'],
  'outdoor-gear': ['The North Face', 'Columbia', 'Patagonia', 'Arc\'teryx', 'Marmot', 'Kelty', 'Osprey'],
  'team-sports': ['Nike', 'Adidas', 'Under Armour', 'Puma', 'Reebok', 'New Balance', 'Asics'],
  'water-sports': ['Speedo', 'TYR', 'Arena', 'Roxy', 'Billabong', 'Quiksilver', 'O\'Neill'],
  'winter-sports': ['Burton', 'K2', 'Rossignol', 'Salomon', 'Atomic', 'Head', 'Volkl'],
  'collectibles': ['Funko', 'Hasbro', 'Mattel', 'McFarlane', 'Hot Toys', 'Sideshow', 'Kotobukiya'],
  'hobby-tools': ['Dremel', 'Proxxon', 'Tamiya', 'Revell', 'Testors', 'Vallejo', 'Citadel'],
  'musical-instruments': ['Yamaha', 'Fender', 'Gibson', 'Roland', 'Casio', 'Korg', 'Shure'],
  'art-supplies': ['Copic', 'Prismacolor', 'Winsor & Newton', 'Liquitex', 'Golden', 'Faber-Castell', 'Staedtler'],
  'games-puzzles': ['Hasbro', 'Mattel', 'Ravensburger', 'Buffalo Games', 'White Mountain', 'Ceaco', 'Springbok'],
  'other-sports-hobby': [],
};

// Condition options specific to sports & hobby items
export const SPORTS_HOBBY_CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Used',
  'Vintage',
  'Collector Grade',
  'For Parts/Repair'
];

// Skill level options for certain subcategories
export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
];

// Age group options
export const AGE_GROUPS = [
  'Kids (3-12)',
  'Teens (13-19)',
  'Adults (20+)',
  'All Ages'
];

// Material options
export const MATERIALS = [
  'Plastic',
  'Metal',
  'Wood',
  'Composite',
  'Carbon Fiber',
  'Fiberglass',
  'Leather',
  'Fabric',
  'Rubber',
  'Foam'
];

// Currency options
export const CURRENCY_OPTIONS = ['AFN', 'USD', 'PKR'];

// Seller type options
export const SELLER_TYPE_OPTIONS = ['Individual', 'Dealer'];

// Get specifications configuration for a given subcategory
export const getSportsHobbySpecsConfig = (subcategory: SportsHobbySubcategory | ''): SportsHobbySpecField[] => {
  if (!subcategory) return [];
  const baseFields: SportsHobbySpecField[] = [
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      min: 0,
      max: 1000000,
      placeholder: '0.00',
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'select',
      required: true,
      options: CURRENCY_OPTIONS,
    },
    {
      key: 'brand',
      label: 'Brand/Manufacturer',
      type: 'select',
      required: true,
      options: SPORTS_HOBBY_BRANDS_BY_SUBCATEGORY[subcategory] || ['Other'],
    },
    {
      key: 'condition',
      label: 'Condition',
      type: 'select',
      required: true,
      options: SPORTS_HOBBY_CONDITIONS,
    },
    {
      key: 'seller_type',
      label: 'Seller Type',
      type: 'select',
      required: true,
      options: SELLER_TYPE_OPTIONS,
    },
    {
      key: 'age_group',
      label: 'Age Group',
      type: 'select',
      required: false,
      options: AGE_GROUPS,
    },
    {
      key: 'material',
      label: 'Primary Material',
      type: 'select',
      required: false,
      options: MATERIALS,
    },
  ];

  const subcategorySpecificFields: Record<SportsHobbySubcategory, SportsHobbySpecField[]> = {
    'sports-equipment': [
      {
        key: 'equipment_type',
        label: 'Equipment Type',
        type: 'select',
        required: true,
        options: ['Ball Sports', 'Racket Sports', 'Goal Posts', 'Nets', 'Training Equipment', 'Protective Gear', 'Other'],
      },
      {
        key: 'size',
        label: 'Size',
        type: 'text',
        required: false,
        placeholder: 'e.g., Medium, Size 5, 27 inches',
      },
      {
        key: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        required: false,
        min: 0,
        max: 100,
      },
    ],
    'fitness-gear': [
      {
        key: 'gear_type',
        label: 'Gear Type',
        type: 'select',
        required: true,
        options: ['Treadmill', 'Exercise Bike', 'Elliptical', 'Rowing Machine', 'Weight Bench', 'Dumbbells', 'Resistance Bands', 'Yoga Mat', 'Other'],
      },
      {
        key: 'max_weight',
        label: 'Max Weight Capacity (kg)',
        type: 'number',
        required: false,
        min: 0,
        max: 500,
      },
      {
        key: 'electronic',
        label: 'Electronic Features',
        type: 'checkbox',
        required: false,
      },
      {
        key: 'foldable',
        label: 'Foldable/Portable',
        type: 'checkbox',
        required: false,
      },
    ],
    'outdoor-gear': [
      {
        key: 'gear_type',
        label: 'Gear Type',
        type: 'select',
        required: true,
        options: ['Tent', 'Sleeping Bag', 'Backpack', 'Camping Stove', 'Hiking Poles', 'Climbing Gear', 'Fishing Gear', 'Other'],
      },
      {
        key: 'waterproof',
        label: 'Waterproof',
        type: 'checkbox',
        required: false,
      },
      {
        key: 'season',
        label: 'Season',
        type: 'select',
        required: false,
        options: ['All Season', 'Summer', 'Winter', 'Spring/Fall'],
      },
      {
        key: 'capacity',
        label: 'Capacity (persons/liters)',
        type: 'text',
        required: false,
        placeholder: 'e.g., 2-person, 65L',
      },
    ],
    'team-sports': [
      {
        key: 'sport',
        label: 'Sport',
        type: 'select',
        required: true,
        options: ['Soccer', 'Basketball', 'Volleyball', 'Cricket', 'Baseball', 'Hockey', 'Rugby', 'Other'],
      },
      {
        key: 'team_size',
        label: 'Team Size',
        type: 'select',
        required: false,
        options: ['Individual', '2-player', 'Small Team (3-5)', 'Full Team (6+)'],
      },
      {
        key: 'league_approved',
        label: 'League Approved',
        type: 'checkbox',
        required: false,
      },
    ],
    'water-sports': [
      {
        key: 'sport_type',
        label: 'Water Sport Type',
        type: 'select',
        required: true,
        options: ['Swimming', 'Surfing', 'Diving', 'Kayaking', 'Canoeing', 'Paddleboarding', 'Waterskiing', 'Other'],
      },
      {
        key: 'floatation',
        label: 'Floatation Device Included',
        type: 'checkbox',
        required: false,
      },
      {
        key: 'size',
        label: 'Size/Dimensions',
        type: 'text',
        required: false,
        placeholder: 'e.g., 6ft board, Medium wetsuit',
      },
    ],
    'winter-sports': [
      {
        key: 'sport_type',
        label: 'Winter Sport Type',
        type: 'select',
        required: true,
        options: ['Skiing', 'Snowboarding', 'Ice Skating', 'Sledding', 'Hockey', 'Other'],
      },
      {
        key: 'skill_level',
        label: 'Skill Level',
        type: 'select',
        required: false,
        options: SKILL_LEVELS,
      },
      {
        key: 'size',
        label: 'Size',
        type: 'text',
        required: true,
        placeholder: 'e.g., 160cm skis, Size 10 boots',
      },
      {
        key: 'bindings_included',
        label: 'Bindings Included',
        type: 'checkbox',
        required: false,
      },
    ],
    'collectibles': [
      {
        key: 'collectible_type',
        label: 'Collectible Type',
        type: 'select',
        required: true,
        options: ['Action Figures', 'Model Kits', 'Trading Cards', 'Coins/Stamps', 'Memorabilia', 'Comics', 'Other'],
      },
      {
        key: 'year',
        label: 'Year of Production',
        type: 'number',
        required: false,
        min: 1900,
        max: new Date().getFullYear(),
      },
      {
        key: 'authenticity',
        label: 'Certificate of Authenticity',
        type: 'checkbox',
        required: false,
      },
      {
        key: 'limited_edition',
        label: 'Limited Edition',
        type: 'checkbox',
        required: false,
      },
    ],
    'hobby-tools': [
      {
        key: 'tool_type',
        label: 'Tool Type',
        type: 'select',
        required: true,
        options: ['Cutting Tools', 'Sanding Tools', 'Painting Tools', 'Measuring Tools', 'Power Tools', 'Hand Tools', 'Other'],
      },
      {
        key: 'power_source',
        label: 'Power Source',
        type: 'select',
        required: false,
        options: ['Battery', 'Electric', 'Manual', 'Gas'],
      },
      {
        key: 'safety_features',
        label: 'Safety Features',
        type: 'multiselect',
        required: false,
        options: ['Safety Guard', 'Auto-shutoff', 'Overload Protection', 'Non-slip Grip'],
      },
    ],
    'musical-instruments': [
      {
        key: 'instrument_type',
        label: 'Instrument Type',
        type: 'select',
        required: true,
        options: ['String', 'Wind', 'Percussion', 'Keyboard', 'Electronic', 'Other'],
      },
      {
        key: 'skill_level',
        label: 'Skill Level',
        type: 'select',
        required: false,
        options: SKILL_LEVELS,
      },
      {
        key: 'accessories_included',
        label: 'Accessories Included',
        type: 'multiselect',
        required: false,
        options: ['Case', 'Stand', 'Tuner', 'Metronome', 'Cleaning Kit', 'Extra Strings/Reeds'],
      },
    ],
    'art-supplies': [
      {
        key: 'supply_type',
        label: 'Supply Type',
        type: 'select',
        required: true,
        options: ['Paints', 'Brushes', 'Canvas/Paper', 'Drawing Tools', 'Sculpting Materials', 'Other'],
      },
      {
        key: 'quantity',
        label: 'Quantity',
        type: 'number',
        required: false,
        min: 1,
        max: 1000,
      },
      {
        key: 'non_toxic',
        label: 'Non-toxic/Safe for Children',
        type: 'checkbox',
        required: false,
      },
    ],
    'games-puzzles': [
      {
        key: 'game_type',
        label: 'Game Type',
        type: 'select',
        required: true,
        options: ['Board Games', 'Card Games', 'Puzzles', 'Video Games', 'Outdoor Games', 'Other'],
      },
      {
        key: 'player_count',
        label: 'Player Count',
        type: 'text',
        required: false,
        placeholder: 'e.g., 2-4 players',
      },
      {
        key: 'complete_set',
        label: 'Complete Set (All Pieces Included)',
        type: 'checkbox',
        required: true,
      },
      {
        key: 'age_recommendation',
        label: 'Age Recommendation',
        type: 'select',
        required: false,
        options: ['3+', '6+', '12+', '18+', 'All Ages'],
      },
    ],
    'other-sports-hobby': [
      {
        key: 'custom_type',
        label: 'Item Type',
        type: 'text',
        required: true,
        placeholder: 'Describe your item type',
      },
      {
        key: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        required: true,
        placeholder: 'Provide detailed description of the item',
      },
    ],
  };

  return [...baseFields, ...(subcategorySpecificFields[subcategory] || [])];
};

// Check if a subcategory has condition in specs (for validation)
export const hasConditionInSpecs = (subcategory: SportsHobbySubcategory | ''): boolean => {
  if (!subcategory) return false;
  return true; // All sports & hobby subcategories have condition field
};

// Helper function to get translation key for a field
export function getSportsHobbyFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getSportsHobbyOptionTranslationKey(option: string): string {
  const normalized = option.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/'/g, '')
    .replace(/-/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  return `optionLabels.${normalized}`;
}