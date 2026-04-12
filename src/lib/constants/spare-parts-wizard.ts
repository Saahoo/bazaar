export type SparePartsSubcategory =
  | 'car-parts'
  | 'motorcycle-parts'
  | 'truck-heavy-parts'
  | 'electronics-parts'
  | 'machinery-parts'
  | 'other-parts';

export type SparePartsCondition = 'New' | 'Used' | 'Refurbished';
export type SparePartsSellerType = 'Individual' | 'Dealer';

export const SPARE_PARTS_SUBCATEGORIES: Array<{ value: SparePartsSubcategory; label: string }> = [
  { value: 'car-parts', label: 'Car Parts' },
  { value: 'motorcycle-parts', label: 'Motorcycle Parts' },
  { value: 'truck-heavy-parts', label: 'Truck & Heavy Vehicle Parts' },
  { value: 'electronics-parts', label: 'Electronics Parts' },
  { value: 'machinery-parts', label: 'Machinery Parts' },
  { value: 'other-parts', label: 'Other Parts' },
];

export const VEHICLE_SPARE_SUBCATEGORIES: SparePartsSubcategory[] = [
  'car-parts',
  'motorcycle-parts',
  'truck-heavy-parts',
];

export const ELECTRONICS_OR_MACHINERY_SUBCATEGORIES: SparePartsSubcategory[] = [
  'electronics-parts',
  'machinery-parts',
];

export const SPARE_MAKE_MODELS: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'Hilux', 'Prado'],
  BMW: ['3 Series', '5 Series', 'X5', 'X3'],
  Honda: ['Civic', 'Accord', 'CR-V', 'CBR'],
  Mercedes: ['C Class', 'E Class', 'G Class', 'Actros'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Porter'],
};

export interface SpareSpecField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'toggle';
  required?: boolean;
  options?: string[];
}

const COMMON_SPEC_FIELDS: SpareSpecField[] = [
  { key: 'part_name', label: 'Part Name', type: 'text', required: true },
  {
    key: 'part_type',
    label: 'Part Type',
    type: 'select',
    required: true,
    options: ['Engine', 'Brake', 'Suspension', 'Electrical', 'Body', 'Interior', 'Other'],
  },
  { key: 'part_number', label: 'Part Number / SKU', type: 'text' },
  {
    key: 'oem_aftermarket',
    label: 'OEM / Aftermarket',
    type: 'select',
    required: true,
    options: ['Original', 'Aftermarket'],
  },
  { key: 'material', label: 'Material', type: 'text' },
  { key: 'color', label: 'Color', type: 'text' },
  { key: 'weight', label: 'Weight', type: 'text' },
  { key: 'dimension_length', label: 'Dimension Length', type: 'text' },
  { key: 'dimension_width', label: 'Dimension Width', type: 'text' },
  { key: 'dimension_height', label: 'Dimension Height', type: 'text' },
  { key: 'warranty', label: 'Warranty', type: 'toggle' },
  { key: 'warranty_duration', label: 'Warranty Duration', type: 'text' },
  {
    key: 'availability',
    label: 'Availability',
    type: 'select',
    required: true,
    options: ['In Stock', 'Out of Stock'],
  },
];

const VEHICLE_SPEC_FIELDS: SpareSpecField[] = [
  {
    key: 'placement',
    label: 'Placement',
    type: 'select',
    options: ['Front', 'Rear', 'Left', 'Right', 'Universal'],
  },
  { key: 'mileage', label: 'Mileage', type: 'number' },
  {
    key: 'installation_type',
    label: 'Installation Type',
    type: 'select',
    options: ['Easy', 'Professional Required'],
  },
  {
    key: 'included_components',
    label: 'Included Components',
    type: 'multiselect',
    options: ['Bolts', 'Nuts', 'Wiring', 'Manual', 'Bracket', 'Other'],
  },
  { key: 'certification', label: 'Certification', type: 'text' },
];

const ELECTRONICS_SPEC_FIELDS: SpareSpecField[] = [
  { key: 'voltage', label: 'Voltage', type: 'text' },
  { key: 'power_rating', label: 'Power Rating', type: 'text' },
  { key: 'connector_type', label: 'Connector Type', type: 'text' },
  { key: 'compatibility_type', label: 'Compatibility Type', type: 'text' },
  { key: 'safety_certification', label: 'Safety Certification', type: 'text' },
];

const MACHINERY_SPEC_FIELDS: SpareSpecField[] = [
  { key: 'machine_type', label: 'Machine Type', type: 'text' },
  { key: 'load_capacity', label: 'Load Capacity', type: 'text' },
  { key: 'operating_pressure', label: 'Operating Pressure', type: 'text' },
  { key: 'temperature_range', label: 'Temperature Range', type: 'text' },
  { key: 'industrial_grade', label: 'Industrial Grade', type: 'toggle' },
];

export const getSpareSpecFields = (subcategory: SparePartsSubcategory | ''): SpareSpecField[] => {
  const fields = [...COMMON_SPEC_FIELDS];

  if (VEHICLE_SPARE_SUBCATEGORIES.includes(subcategory as SparePartsSubcategory)) {
    fields.push(...VEHICLE_SPEC_FIELDS);
  }

  if (subcategory === 'electronics-parts') {
    fields.push(...ELECTRONICS_SPEC_FIELDS);
  }

  if (subcategory === 'machinery-parts') {
    fields.push(...MACHINERY_SPEC_FIELDS);
  }

  return fields;
};
