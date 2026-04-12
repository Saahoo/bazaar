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
  /** Conditionally show this field only when the referenced field has one of the given values */
  showWhen?: { field: string; values: string[] };
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
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB']) },
    { id: 'storage', label: 'Internal Storage', type: 'select', required: false, options: appendOtherOption(['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB']) },
    { id: 'battery', label: 'Battery Capacity', type: 'select', required: false, options: appendOtherOption(['2000mAh', '3000mAh', '3500mAh', '4000mAh', '4500mAh', '5000mAh', '6000mAh+']) },
    { id: 'screenSize', label: 'Screen Size', type: 'select', required: false, options: appendOtherOption(['4.7"', '5.5"', '5.8"', '6.0"', '6.1"', '6.4"', '6.5"', '6.7"', '6.9"']) },
    { id: 'refreshRate', label: 'Refresh Rate', type: 'select', required: false, options: appendOtherOption(['60Hz', '90Hz', '120Hz', '144Hz', '165Hz']) },
    { id: 'rearCamera', label: 'Rear Camera (MP)', type: 'select', required: false, options: appendOtherOption(['8MP', '12MP', '16MP', '48MP', '50MP', '64MP', '108MP', '200MP']) },
    { id: 'frontCamera', label: 'Front Camera (MP)', type: 'select', required: false, options: appendOtherOption(['5MP', '8MP', '12MP', '16MP', '20MP', '32MP']) },
    { id: 'fiveG', label: '5G Supported', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'dualSim', label: 'Dual SIM', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'os', label: 'Operating System', type: 'select', required: false, options: appendOtherOption(['Android', 'iOS', 'HarmonyOS']) },
    { id: 'color', label: 'Color', type: 'text', required: false },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'accessoriesIncluded', label: 'Accessories Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'boxAvailable', label: 'Box Available', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
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
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['3GB', '4GB', '6GB', '8GB', '12GB', '16GB']) },
    { id: 'storage', label: 'Internal Storage', type: 'select', required: false, options: appendOtherOption(['32GB', '64GB', '128GB', '256GB', '512GB', '1TB']) },
    { id: 'battery', label: 'Battery Capacity', type: 'select', required: false, options: appendOtherOption(['4000mAh', '5000mAh', '6000mAh', '7000mAh', '8000mAh', '10000mAh+']) },
    { id: 'screenSize', label: 'Screen Size', type: 'select', required: false, options: appendOtherOption(['7"', '8"', '8.7"', '10.1"', '10.4"', '10.9"', '11"', '12.4"', '13"']) },
    { id: 'refreshRate', label: 'Refresh Rate', type: 'select', required: false, options: appendOtherOption(['60Hz', '90Hz', '120Hz', '144Hz']) },
    { id: 'rearCamera', label: 'Rear Camera (MP)', type: 'select', required: false, options: appendOtherOption(['5MP', '8MP', '12MP', '13MP', '16MP', '50MP']) },
    { id: 'frontCamera', label: 'Front Camera (MP)', type: 'select', required: false, options: appendOtherOption(['5MP', '8MP', '12MP', '16MP']) },
    { id: 'os', label: 'Operating System', type: 'select', required: false, options: appendOtherOption(['Android', 'iPadOS', 'Windows', 'HarmonyOS']) },
    { id: 'color', label: 'Color', type: 'text', required: false },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'accessoriesIncluded', label: 'Accessories Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'boxAvailable', label: 'Box Available', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
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
      options: appendOtherOption(['24"', '32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"']),
    },
    { id: 'resolution', label: 'Resolution', type: 'select', required: false, options: appendOtherOption(['HD', 'Full HD', '4K UHD', '8K UHD']) },
    { id: 'smartTv', label: 'Smart TV', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'panelType', label: 'Panel Type', type: 'select', required: false, options: appendOtherOption(['LED', 'QLED', 'OLED', 'Mini LED', 'AMOLED', 'NanoCell']) },
    { id: 'refreshRate', label: 'Refresh Rate', type: 'select', required: false, options: appendOtherOption(['50Hz', '60Hz', '100Hz', '120Hz', '144Hz']) },
    { id: 'hdmiPorts', label: 'HDMI Ports', type: 'select', required: false, options: appendOtherOption(['1', '2', '3', '4', '5']) },
    { id: 'os', label: 'Operating System', type: 'text', required: false },
    { id: 'wallMountIncluded', label: 'Wall Mount Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  laptops: [
    {
      id: 'make',
      label: 'Make',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.laptops)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'make',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.laptops),
    },
    {
      id: 'processor',
      label: 'Processor',
      type: 'select',
      required: true,
      options: appendOtherOption(['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3', 'Apple M4']),
    },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['4GB', '8GB', '16GB', '32GB', '64GB']) },
    { id: 'storageType', label: 'Storage Type', type: 'select', required: false, options: appendOtherOption(['SSD', 'HDD', 'SSD+HDD', 'eMMC']) },
    { id: 'storageSize', label: 'Storage Size', type: 'select', required: false, options: appendOtherOption(['128GB', '256GB', '512GB', '1TB', '2TB', '4TB']) },
    { id: 'gpu', label: 'GPU', type: 'select', required: false, options: appendOtherOption(['Integrated', 'NVIDIA GeForce RTX 3050', 'NVIDIA GeForce RTX 3060', 'NVIDIA GeForce RTX 4050', 'NVIDIA GeForce RTX 4060', 'AMD Radeon RX', 'Apple GPU']) },
    { id: 'screenSize', label: 'Screen Size', type: 'select', required: false, options: appendOtherOption(['11"', '13"', '13.3"', '14"', '15.6"', '16"', '17"', '17.3"']) },
    { id: 'resolution', label: 'Resolution', type: 'select', required: false, options: appendOtherOption(['HD', 'Full HD', '2K', '4K', 'Retina']) },
    { id: 'touchscreen', label: 'Touchscreen', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'batteryLife', label: 'Battery Life', type: 'select', required: false, options: appendOtherOption(['Up to 4h', 'Up to 6h', 'Up to 8h', 'Up to 10h', 'Up to 12h', '15h+']) },
    { id: 'os', label: 'Operating System', type: 'select', required: false, options: appendOtherOption(['Windows 10', 'Windows 11', 'macOS', 'Linux', 'Chrome OS']) },
    { id: 'usageType', label: 'Usage Type', type: 'select', required: false, options: appendOtherOption(['Office/Business', 'Gaming', 'Design/Creative', 'Programming', 'General Use']) },
    { id: 'keyboardBacklight', label: 'Keyboard Backlight', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'fingerprintSensor', label: 'Fingerprint Sensor', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  desktops: [
    {
      id: 'make',
      label: 'Make',
      type: 'select',
      required: true,
      options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS.desktops)),
    },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: true,
      dependsOn: 'make',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS.desktops),
    },
    {
      id: 'processor',
      label: 'Processor',
      type: 'select',
      required: true,
      options: appendOtherOption(['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Intel Xeon']),
    },
    { id: 'ram', label: 'RAM', type: 'select', required: false, options: appendOtherOption(['8GB', '16GB', '32GB', '64GB', '128GB']) },
    { id: 'storageType', label: 'Storage Type', type: 'select', required: false, options: appendOtherOption(['SSD', 'HDD', 'SSD+HDD']) },
    { id: 'storageSize', label: 'Storage Size', type: 'select', required: false, options: appendOtherOption(['256GB', '512GB', '1TB', '2TB', '4TB', '8TB']) },
    { id: 'gpu', label: 'GPU', type: 'select', required: false, options: appendOtherOption(['Integrated', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon RX', 'Dedicated (Other)']) },
    { id: 'formFactor', label: 'Form Factor', type: 'select', required: false, options: appendOtherOption(['Tower', 'Mini Tower', 'Mini PC', 'All-in-One']) },
    { id: 'os', label: 'Operating System', type: 'select', required: false, options: appendOtherOption(['Windows 10', 'Windows 11', 'macOS', 'Linux']) },
    { id: 'monitorIncluded', label: 'Monitor Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'keyboardMouseIncluded', label: 'Keyboard & Mouse Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'usageType', label: 'Usage Type', type: 'select', required: false, options: appendOtherOption(['Office/Business', 'Gaming', 'Design/Creative', 'Programming', 'General Use']) },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'home-appliances': [
    {
      id: 'applianceType',
      label: 'Appliance Type',
      type: 'select',
      required: true,
      options: appendOtherOption(['Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Dishwasher']),
    },
    { id: 'brand', label: 'Brand', type: 'select', required: true, options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS['home-appliances'])) },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: false,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS['home-appliances']),
    },
    // Refrigerator-specific fields
    { id: 'fridgeCapacity', label: 'Capacity', type: 'select', required: false, options: appendOtherOption(['100-200L', '200-300L', '300-400L', '400-500L', '500L+']), showWhen: { field: 'applianceType', values: ['Refrigerator'] } },
    { id: 'fridgeType', label: 'Fridge Type', type: 'select', required: false, options: appendOtherOption(['Single Door', 'Double Door', 'French Door', 'Side by Side', 'Mini']), showWhen: { field: 'applianceType', values: ['Refrigerator'] } },
    { id: 'defrostType', label: 'Defrost Type', type: 'select', required: false, options: appendOtherOption(['Manual', 'Auto', 'Frost-Free']), showWhen: { field: 'applianceType', values: ['Refrigerator'] } },
    { id: 'inverterTech', label: 'Inverter Technology', type: 'select', required: false, options: ['Yes', 'No'], showWhen: { field: 'applianceType', values: ['Refrigerator'] } },
    // Washing Machine-specific fields
    { id: 'washingType', label: 'Washing Machine Type', type: 'select', required: false, options: appendOtherOption(['Front Load', 'Top Load', 'Semi-Automatic']), showWhen: { field: 'applianceType', values: ['Washing Machine'] } },
    { id: 'washerCapacity', label: 'Capacity (kg)', type: 'select', required: false, options: appendOtherOption(['5kg', '6kg', '7kg', '8kg', '9kg', '10kg', '11kg+']), showWhen: { field: 'applianceType', values: ['Washing Machine'] } },
    { id: 'spinSpeed', label: 'Spin Speed (RPM)', type: 'select', required: false, options: appendOtherOption(['600', '800', '1000', '1200', '1400', '1600']), showWhen: { field: 'applianceType', values: ['Washing Machine'] } },
    // Air Conditioner-specific fields
    { id: 'acType', label: 'AC Type', type: 'select', required: false, options: appendOtherOption(['Split', 'Window', 'Portable', 'Cassette', 'Ducted']), showWhen: { field: 'applianceType', values: ['Air Conditioner'] } },
    { id: 'acCapacity', label: 'Cooling Capacity', type: 'select', required: false, options: appendOtherOption(['9000 BTU (0.75T)', '12000 BTU (1T)', '18000 BTU (1.5T)', '24000 BTU (2T)', '30000 BTU (2.5T)', '36000 BTU (3T)']), showWhen: { field: 'applianceType', values: ['Air Conditioner'] } },
    { id: 'acInverter', label: 'Inverter', type: 'select', required: false, options: ['Yes', 'No'], showWhen: { field: 'applianceType', values: ['Air Conditioner'] } },
    { id: 'coolingArea', label: 'Cooling Area (sqm)', type: 'text', required: false, showWhen: { field: 'applianceType', values: ['Air Conditioner'] } },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'music-instruments': [
    { id: 'instrumentType', label: 'Instrument Type', type: 'select', required: true, options: appendOtherOption(['Guitar', 'Piano', 'Keyboard', 'Drums', 'Violin', 'Bass Guitar', 'Ukulele', 'Trumpet', 'Flute']) },
    { id: 'brand', label: 'Brand', type: 'select', required: false, options: appendOtherOption(Object.keys(ELECTRONICS_BRAND_MODELS['music-instruments'])) },
    {
      id: 'model',
      label: 'Model',
      type: 'select',
      required: false,
      dependsOn: 'brand',
      optionsMap: withOtherOptionMap(ELECTRONICS_BRAND_MODELS['music-instruments']),
    },
    { id: 'acousticElectric', label: 'Acoustic / Electric', type: 'select', required: false, options: appendOtherOption(['Acoustic', 'Electric', 'Semi-Acoustic', 'Digital']) },
    { id: 'skillLevel', label: 'Skill Level', type: 'select', required: false, options: ['Beginner', 'Intermediate', 'Professional'] },
    { id: 'accessoriesIncluded', label: 'Accessories Included', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
    { id: 'condition', label: 'Condition', type: 'select', required: true, options: COMMON_CONDITION_OPTIONS },
  ],
  'other-electronics': [
    { id: 'deviceType', label: 'Device Type', type: 'text', required: false },
    { id: 'brand', label: 'Brand', type: 'text', required: false },
    { id: 'model', label: 'Model', type: 'text', required: false },
    { id: 'features', label: 'Key Features', type: 'text', required: false },
    { id: 'warranty', label: 'Warranty', type: 'select', required: false, options: ['Yes', 'No'] },
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
