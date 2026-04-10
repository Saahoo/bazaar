export type ElectronicsSubcategory =
  | 'phones'
  | 'tablets'
  | 'tv'
  | 'laptops'
  | 'desktops'
  | 'home-appliances'
  | 'music-instruments'
  | 'other-electronics';

export interface ElectronicsSubcategoryOption {
  value: ElectronicsSubcategory;
  label: string;
}

export interface ElectronicsSpecField {
  id: string;
  label: string;
  type: 'select' | 'text';
  required: boolean;
  options?: string[];
  dependsOn?: string;
  optionsMap?: Record<string, string[]>;
}

export const ELECTRONICS_SUBCATEGORIES: ElectronicsSubcategoryOption[] = [
  { value: 'phones', label: 'Phones' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'tv', label: 'TV' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'desktops', label: 'Desktops' },
  { value: 'home-appliances', label: 'Home Appliances' },
  { value: 'music-instruments', label: 'Music Instruments' },
  { value: 'other-electronics', label: 'Other Electronics' },
];

// Sample dataset for dependent dropdowns (Make -> Model)
export const ELECTRONICS_BRAND_MODELS: Record<ElectronicsSubcategory, Record<string, string[]>> = {
  phones: {
    Apple: ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone SE (2020)', 'iPhone Mini', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
    Samsung: ['Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy A51', 'Galaxy A54'],
    Xiaomi: ['Redmi Note 11', 'Redmi Note 12', 'Mi 11', 'Mi 12'],
    Huawei: ['P30', 'P40', 'Mate 30', 'Mate 40'],
    Oppo: ['A57', 'A78', 'Reno 8', 'Reno 10'],
  },
  tablets: {
    Apple: ['iPad 9th Gen', 'iPad 10th Gen', 'iPad Air', 'iPad Pro 11'],
    Samsung: ['Galaxy Tab A8', 'Galaxy Tab S7', 'Galaxy Tab S9'],
    Lenovo: ['Tab M10', 'Tab P11'],
    Huawei: ['MatePad 11', 'MatePad Pro'],
    Xiaomi: ['Pad 5', 'Pad 6'],
  },
  tv: {
    Samsung: ['Q60C', 'Q70C', 'Q80C', 'CU7000', 'The Frame'],
    LG: ['UQ7500', 'UR8000', 'QNED80', 'C3 OLED', 'G3 OLED'],
    Sony: ['X75K', 'X80L', 'X90L', 'A80L OLED', 'Bravia 7'],
    TCL: ['P635', 'C645', 'C745', 'P745', 'C835'],
    Hisense: ['A6K', 'A7K', 'U6K', 'U7K', 'U8K'],
    Panasonic: ['MX700', 'LX650', 'MZ980 OLED'],
  },
  laptops: {
    Dell: ['Inspiron 15', 'XPS 13', 'Latitude 5420'],
    HP: ['Pavilion 15', 'EliteBook 840', 'Victus 16'],
    Lenovo: ['ThinkPad T14', 'IdeaPad 3', 'Legion 5'],
    Apple: ['MacBook Air M1', 'MacBook Air M2', 'MacBook Pro 14'],
    Asus: ['VivoBook 15', 'ROG Strix G15', 'ZenBook 14'],
  },
  desktops: {
    Dell: ['OptiPlex 7090', 'Vostro 3910', 'Alienware Aurora'],
    HP: ['ProDesk 400', 'Pavilion Desktop', 'OMEN 40L'],
    Lenovo: ['ThinkCentre M70', 'IdeaCentre 5'],
    Asus: ['ROG GT15', 'ExpertCenter D7'],
    Acer: ['Aspire TC', 'Nitro 50'],
  },
  'home-appliances': {
    Samsung: ['RT28', 'WW70', 'AR12'],
    LG: ['GC-B257', 'F4V5', 'S4-W18KL3AA'],
    Haier: ['HRF-368', 'HWM120', 'HSU-18'],
    Dawlance: ['9178LF', 'DWT 255', 'Powercon 30'],
  },
  'music-instruments': {
    Yamaha: ['F310', 'P45', 'PSR-E373'],
    Casio: ['CT-S200', 'PX-S1100'],
    Roland: ['FP-10', 'GO:PIANO'],
    Fender: ['CD-60', 'Player Stratocaster'],
    Gibson: ['Les Paul Studio', 'SG Standard'],
  },
  'other-electronics': {},
};

const OTHER_OPTION = 'Other';

const appendOtherOption = (options: string[]): string[] => {
  if (options.includes(OTHER_OPTION)) return options;
  return [...options, OTHER_OPTION];
};

const withOtherOptionMap = (optionsMap: Record<string, string[]>): Record<string, string[]> => {
  return Object.fromEntries(
    Object.entries(optionsMap).map(([key, values]) => [key, appendOtherOption(values)])
  );
};

const COMMON_CONDITION_OPTIONS = appendOtherOption(['New', 'Like New', 'Used', 'Refurbished']);

export const ELECTRONICS_SPEC_CONFIG: Record<ElectronicsSubcategory, ElectronicsSpecField[]> = {
  phones: [
    {
      id: 'make',
      label: 'Make',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.phones)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'make',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.phones),
    },
    { id: 'storage', label: 'Storage', type: 'select', required: false, options: appendOtherOption(['64GB', '128GB', '256GB', '512GB']) },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['4GB', '6GB', '8GB', '12GB']) },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
    { id: 'color', label: 'Color', type: 'text', required: false },
  ],
  tablets: [
    {
      id: 'brand',
      label: 'Brand',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.tablets)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.tablets),
    },
    { id: 'storage', label: 'Storage', type: 'select', required: false, options: appendOtherOption(['64GB', '128GB', '256GB', '512GB']) },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['4GB', '6GB', '8GB', '12GB']) },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
    { id: 'color', label: 'Color', type: 'text', required: false },
  ],
  tv: [
    {
      id: 'brand',
      label: 'Brand',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.tv)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.tv),
    },
    {
      id: 'screenSize',
      label: 'Screen Size (inches)',
      type: 'select',
      required: true,
      options: appendOtherOption(['24', '32', '40', '43', '50', '55', '65', '75', '85']),
    },
    {
      id: 'resolution',
      label: 'Resolution',
      type: 'select',
      required: false,
      options: appendOtherOption(['HD', 'Full HD', '4K UHD', '8K UHD']),
    },
    {
      id: 'smartTv',
      label: 'Smart TV',
      type: 'select',
      required: false,
      options: appendOtherOption(['Yes', 'No']),
    },
    {
      id: 'hdmiPorts',
      label: 'HDMI Ports',
      type: 'select',
      required: false,
      options: appendOtherOption(['1', '2', '3', '4', '5']),
    },
    {
      id: 'wallMountIncluded',
      label: 'Wall Mount Included',
      type: 'select',
      required: false,
      options: appendOtherOption(['Yes', 'No']),
    },
    { id: 'displayType', label: 'Display Type', type: 'select', required: false, options: appendOtherOption(['LED', 'QLED', 'OLED', 'Mini LED', 'Smart TV']) },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  laptops: [
    {
      id: 'brand',
      label: 'Brand',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.laptops)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.laptops),
    },
    { id: 'processor', label: 'Processor', type: 'text', required: true },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['4GB', '8GB', '16GB', '32GB']) },
    { id: 'storage', label: 'Storage', type: 'text', required: false },
    { id: 'gpu', label: 'GPU', type: 'text', required: false },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  desktops: [
    {
      id: 'brand',
      label: 'Brand',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.desktops)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.desktops),
    },
    { id: 'processor', label: 'Processor', type: 'text', required: true },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['8GB', '16GB', '32GB', '64GB']) },
    { id: 'storage', label: 'Storage', type: 'text', required: false },
    { id: 'gpu', label: 'GPU', type: 'text', required: false },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'home-appliances': [
    { id: 'type', label: 'Type', type: 'select', required: true, options: appendOtherOption(['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Dishwasher']) },
    { id: 'brand', label: 'Brand', type: 'select', required: true, options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS['home-appliances'])) },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: false,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS['home-appliances']),
    },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'music-instruments': [
    { id: 'type', label: 'Type', type: 'select', required: true, options: appendOtherOption(['Guitar', 'Piano', 'Keyboard', 'Drums', 'Violin']) },
    { id: 'brand', label: 'Brand', type: 'select', required: false, options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS['music-instruments'])) },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: false,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS['music-instruments']),
    },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'other-electronics': [
    { id: 'brand', label: 'Brand', type: 'text', required: false },
    { id: 'model', label: 'Model', type: 'text', required: false },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
};

export const getElectronicsSpecsConfig = (subcategory: ElectronicsSubcategory | ''): ElectronicsSpecField[] => {
  if (!subcategory) return [];
  return ELECTRONICS_SPEC_CONFIG[subcategory] || [];
};

export const hasConditionInSpecs = (subcategory: ElectronicsSubcategory | ''): boolean => {
  return getElectronicsSpecsConfig(subcategory).some((field) => field.id === 'condition');
};
