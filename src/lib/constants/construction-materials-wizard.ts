export type ConstructionMaterialsSubcategory =
  | 'cement'
  | 'steel-rebar'
  | 'bricks-blocks'
  | 'timber-wood'
  | 'sand-gravel'
  | 'plumbing'
  | 'electrical-supplies'
  | 'roofing'
  | 'paint-finishing'
  | 'tiles-flooring'
  | 'hardware-tools'
  | 'insulation'
  | 'glass-windows';

export interface ConstructionMaterialsSubcategoryOption {
  value: ConstructionMaterialsSubcategory;
  label: string;
}

export const CONSTRUCTION_MATERIALS_SUBCATEGORY_LABEL_KEYS: Record<ConstructionMaterialsSubcategory, string> = {
  'cement': 'subcategoryCement',
  'steel-rebar': 'subcategorySteelRebar',
  'bricks-blocks': 'subcategoryBricksBlocks',
  'timber-wood': 'subcategoryTimberWood',
  'sand-gravel': 'subcategorySandGravel',
  'plumbing': 'subcategoryPlumbing',
  'electrical-supplies': 'subcategoryElectricalSupplies',
  'roofing': 'subcategoryRoofing',
  'paint-finishing': 'subcategoryPaintFinishing',
  'tiles-flooring': 'subcategoryTilesFlooring',
  'hardware-tools': 'subcategoryHardwareTools',
  'insulation': 'subcategoryInsulation',
  'glass-windows': 'subcategoryGlassWindows',
};

export type ConstructionMaterialsSpecFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'toggle' | 'number' | 'unit';

export interface ConstructionMaterialsSpecField {
  key: string;
  label: string;
  type: ConstructionMaterialsSpecFieldType;
  required?: boolean;
  options?: string[];
  unitOptions?: string[];
  placeholder?: string;
}

export const CONSTRUCTION_MATERIALS_SUBCATEGORIES: ConstructionMaterialsSubcategoryOption[] = [
  { value: 'cement', label: 'Cement' },
  { value: 'steel-rebar', label: 'Steel & Rebar' },
  { value: 'bricks-blocks', label: 'Bricks & Blocks' },
  { value: 'timber-wood', label: 'Timber & Wood' },
  { value: 'sand-gravel', label: 'Sand & Gravel' },
  { value: 'plumbing', label: 'Plumbing Materials' },
  { value: 'electrical-supplies', label: 'Electrical Supplies' },
  { value: 'roofing', label: 'Roofing Materials' },
  { value: 'paint-finishing', label: 'Paint & Finishing' },
  { value: 'tiles-flooring', label: 'Tiles & Flooring' },
  { value: 'hardware-tools', label: 'Hardware & Tools' },
  { value: 'insulation', label: 'Insulation' },
  { value: 'glass-windows', label: 'Glass & Windows' },
];

// Unit options for quantity
export const CM_QUANTITY_UNIT_OPTIONS = ['kg', 'tons', 'bags', 'pieces', 'sqm', 'cubic-meters', 'meters', 'rolls', 'liters', 'boxes'];

// Condition options
export const CM_CONDITION_OPTIONS = ['New', 'Like New', 'Good', 'Fair', 'Refurbished'];

// Price type options
export const CM_PRICE_TYPE_OPTIONS = ['Fixed', 'Negotiable', 'Per Unit', 'Per Kg', 'Per Sqm'];

// Delivery options
export const CM_DELIVERY_OPTIONS = ['Available', 'Not Available', 'Local Only'];

// Cement type options
export const CEMENT_TYPE_OPTIONS = ['Ordinary Portland', 'White Portland', 'Sulfate Resistant', 'Rapid Hardening', 'Low Heat', 'Pozzolanic', 'Other'];

// Cement grade options
export const CEMENT_GRADE_OPTIONS = ['grade32_5', 'grade42_5', 'grade52_5', 'Other'];

// Packaging type options
export const PACKAGING_TYPE_OPTIONS = ['Bag (50kg)', 'Bag (25kg)', 'Bag (40kg)', 'Bulk', 'Custom'];

// Steel type options
export const STEEL_TYPE_OPTIONS = ['Rebar', 'Deformed Bar', 'Round Bar', 'Flat Bar', 'Angle Iron', 'I-Beam', 'Channel', 'Wire Rod', 'Other'];

// Steel grade options
export const STEEL_GRADE_OPTIONS = ['Grade 40', 'Grade 60', 'Grade 75', 'Grade 80', 'Other'];

// Brick type options
export const BRICK_TYPE_OPTIONS = ['Red Clay Brick', 'Concrete Block', 'Fly Ash Brick', 'Hollow Block', 'Solid Block', 'Interlocking Brick', 'Aerated Block', 'Other'];

// Brick size options
export const BRICK_SIZE_OPTIONS = ['standard9x4_5x3in', 'modular8x4x2_25in', 'Large Block', 'Custom', 'Other'];

// Wood type options
export const WOOD_TYPE_OPTIONS = ['Pine', 'Oak', 'Cedar', 'Poplar', 'Walnut', 'Plywood', 'MDF', 'Chipboard', 'Other'];

// Wood treatment options
export const WOOD_TREATMENT_OPTIONS = ['Untreated', 'Pressure Treated', 'Kiln Dried', 'Chemically Treated', 'Seasoned', 'Other'];

// Aggregate type options
export const AGGREGATE_TYPE_OPTIONS = ['River Sand', 'Crushed Stone', 'Gravel', 'M-Sand', 'Coral Sand', 'Ballast', 'Fill Material', 'Other'];

// Grain size options
export const GRAIN_SIZE_OPTIONS = ['Fine', 'Medium', 'Coarse', 'Mixed', 'Other'];

// Plumbing type options
export const PLUMBING_TYPE_OPTIONS = ['PVC Pipe', 'GI Pipe', 'Copper Pipe', 'PEX Pipe', 'Fittings', 'Valves', 'Taps/Faucets', 'Water Tank', 'Other'];

// Plumbing material options
export const PLUMBING_MATERIAL_OPTIONS = ['PVC', 'GI', 'Copper', 'PEX', 'Brass', 'Stainless Steel', 'Cast Iron', 'Other'];

// Electrical type options
export const ELECTRICAL_TYPE_OPTIONS = ['Wire/Cable', 'Switch', 'Socket', 'Circuit Breaker', 'Distribution Board', 'Conduit', 'Light Fixture', 'Transformer', 'Other'];

// Voltage options
export const VOLTAGE_OPTIONS = ['220V', '110V', '240V', '380V', '440V', 'Low Voltage', 'Medium Voltage', 'High Voltage', 'N/A'];

// Electrical certification options
export const ELECTRICAL_CERT_OPTIONS = ['IEC Certified', 'UL Listed', 'CE Marked', 'Local Standard', 'None', 'Other'];

// Roofing type options
export const ROOFING_TYPE_OPTIONS = ['Metal Sheet', 'Clay Tile', 'Concrete Tile', 'Asphalt Shingle', 'Polycarbonate', 'Wood Shake', 'Membrane', 'Other'];

// Roofing material options
export const ROOFING_MATERIAL_OPTIONS = ['Galvanized Steel', 'Aluminum', 'Copper', 'Clay', 'Concrete', 'Asphalt', 'Fiberglass', 'Polycarbonate', 'Other'];

// Paint type options
export const PAINT_TYPE_OPTIONS = ['Emulsion', 'Enamel', 'Oil-Based', 'Acrylic', 'Epoxy', 'Primer', 'Varnish', 'Stain', 'Other'];

// Finish type options
export const FINISH_TYPE_OPTIONS = ['Matte', 'Satin', 'Semi-Gloss', 'Gloss', 'Textured', 'Flat', 'Eggshell', 'Other'];

// Tile type options
export const TILE_TYPE_OPTIONS = ['Ceramic', 'Porcelain', 'Marble', 'Granite', 'Mosaic', 'Vinyl', 'Terrazzo', 'Natural Stone', 'Other'];

// Tile material options
export const TILE_MATERIAL_OPTIONS = ['Ceramic', 'Porcelain', 'Marble', 'Granite', 'Glass', 'Metal', 'Stone', 'Vinyl', 'Other'];

// Hardware type options
export const HARDWARE_TYPE_OPTIONS = ['Nails', 'Screws', 'Bolts', 'Nuts', 'Hinges', 'Locks', 'Handles', 'Brackets', 'Anchors', 'Other'];

// Hardware material options
export const HARDWARE_MATERIAL_OPTIONS = ['Steel', 'Stainless Steel', 'Brass', 'Aluminum', 'Iron', 'Zinc', 'Other'];

// Insulation type options
export const INSULATION_TYPE_OPTIONS = ['Fiberglass', 'Mineral Wool', 'Polystyrene (EPS)', 'Extruded Polystyrene (XPS)', 'Polyurethane', 'Cellulose', 'Reflective', 'Other'];

// Glass type options
export const GLASS_TYPE_OPTIONS = ['Float Glass', 'Tempered', 'Laminated', 'Tinted', 'Frosted', 'Insulated/Double Glazed', 'Wired Glass', 'Patterned', 'Other'];

// Frame type options
export const FRAME_TYPE_OPTIONS = ['Aluminum', 'uPVC', 'Wood', 'Steel', 'Composite', 'No Frame', 'Other'];

// Common fields for all construction & materials subcategories
const CONSTRUCTION_MATERIALS_COMMON_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'quantity', label: 'Quantity', type: 'number', required: true },
  {
    key: 'unit',
    label: 'Unit',
    type: 'select',
    required: true,
    options: CM_QUANTITY_UNIT_OPTIONS,
  },
  {
    key: 'condition',
    label: 'Condition',
    type: 'select',
    required: false,
    options: CM_CONDITION_OPTIONS,
  },
  { key: 'price', label: 'Price', type: 'number', required: true },
  {
    key: 'priceType',
    label: 'Price Type',
    type: 'select',
    required: true,
    options: CM_PRICE_TYPE_OPTIONS,
  },
  {
    key: 'deliveryAvailable',
    label: 'Delivery',
    type: 'select',
    required: false,
    options: CM_DELIVERY_OPTIONS,
  },
  { key: 'minOrder', label: 'Minimum Order', type: 'text', required: false, placeholder: 'e.g., 10 bags' },
];

// ─── Subcategory-specific fields ────────────────────────────────────────────────

const CEMENT_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'cementType', label: 'Cement Type', type: 'select', options: CEMENT_TYPE_OPTIONS },
  { key: 'cementGrade', label: 'Cement Grade', type: 'select', options: CEMENT_GRADE_OPTIONS },
  { key: 'packagingType', label: 'Packaging Type', type: 'select', options: PACKAGING_TYPE_OPTIONS },
];

const STEEL_REBAR_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'steelType', label: 'Steel Type', type: 'select', options: STEEL_TYPE_OPTIONS },
  { key: 'diameter', label: 'Diameter (mm)', type: 'text', placeholder: 'e.g., 10mm, 16mm' },
  { key: 'length', label: 'Length (m)', type: 'text', placeholder: 'e.g., 6m, 12m' },
  { key: 'steelGrade', label: 'Steel Grade', type: 'select', options: STEEL_GRADE_OPTIONS },
];

const BRICKS_BLOCKS_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'brickType', label: 'Brick/Block Type', type: 'select', options: BRICK_TYPE_OPTIONS },
  { key: 'brickSize', label: 'Size', type: 'select', options: BRICK_SIZE_OPTIONS },
  { key: 'compressiveStrength', label: 'Compressive Strength', type: 'text', placeholder: 'e.g., 5 MPa, 10 MPa' },
];

const TIMBER_WOOD_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'woodType', label: 'Wood Type', type: 'select', options: WOOD_TYPE_OPTIONS },
  { key: 'treatment', label: 'Treatment', type: 'select', options: WOOD_TREATMENT_OPTIONS },
  { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 2×4×8 ft' },
];

const SAND_GRAVEL_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'aggregateType', label: 'Aggregate Type', type: 'select', options: AGGREGATE_TYPE_OPTIONS },
  { key: 'grainSize', label: 'Grain Size', type: 'select', options: GRAIN_SIZE_OPTIONS },
  { key: 'source', label: 'Source/Origin', type: 'text', placeholder: 'e.g., River, Quarry' },
];

const PLUMBING_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'plumbingType', label: 'Plumbing Type', type: 'select', options: PLUMBING_TYPE_OPTIONS },
  { key: 'plumbingMaterial', label: 'Material', type: 'select', options: PLUMBING_MATERIAL_OPTIONS },
  { key: 'diameter', label: 'Diameter/Size', type: 'text', placeholder: 'e.g., 1/2 in, 3/4 in' },
];

const ELECTRICAL_SUPPLIES_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'electricalType', label: 'Electrical Type', type: 'select', options: ELECTRICAL_TYPE_OPTIONS },
  { key: 'voltage', label: 'Voltage Rating', type: 'select', options: VOLTAGE_OPTIONS },
  { key: 'electricalCert', label: 'Certification', type: 'select', options: ELECTRICAL_CERT_OPTIONS },
];

const ROOFING_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'roofingType', label: 'Roofing Type', type: 'select', options: ROOFING_TYPE_OPTIONS },
  { key: 'roofingMaterial', label: 'Material', type: 'select', options: ROOFING_MATERIAL_OPTIONS },
  { key: 'thickness', label: 'Thickness/Gauge', type: 'text', placeholder: 'e.g., 0.5mm, 26 gauge' },
];

const PAINT_FINISHING_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'paintType', label: 'Paint Type', type: 'select', options: PAINT_TYPE_OPTIONS },
  { key: 'finishType', label: 'Finish', type: 'select', options: FINISH_TYPE_OPTIONS },
  { key: 'coverage', label: 'Coverage Area', type: 'text', placeholder: 'e.g., 12 sqm/L' },
];

const TILES_FLOORING_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'tileType', label: 'Tile Type', type: 'select', options: TILE_TYPE_OPTIONS },
  { key: 'tileMaterial', label: 'Material', type: 'select', options: TILE_MATERIAL_OPTIONS },
  { key: 'tileSize', label: 'Tile Size', type: 'text', placeholder: 'e.g., 60×60 cm, 30×30 cm' },
];

const HARDWARE_TOOLS_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'hardwareType', label: 'Hardware Type', type: 'select', options: HARDWARE_TYPE_OPTIONS },
  { key: 'hardwareMaterial', label: 'Material', type: 'select', options: HARDWARE_MATERIAL_OPTIONS },
  { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Hilti, Bosch' },
];

const INSULATION_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'insulationType', label: 'Insulation Type', type: 'select', options: INSULATION_TYPE_OPTIONS },
  { key: 'rValue', label: 'R-Value', type: 'text', placeholder: 'e.g., R-13, R-19' },
  { key: 'insulationThickness', label: 'Thickness', type: 'text', placeholder: 'e.g., 50mm, 100mm' },
];

const GLASS_WINDOWS_FIELDS: ConstructionMaterialsSpecField[] = [
  { key: 'glassType', label: 'Glass Type', type: 'select', options: GLASS_TYPE_OPTIONS },
  { key: 'glassThickness', label: 'Thickness', type: 'text', placeholder: 'e.g., 5mm, 8mm' },
  { key: 'frameType', label: 'Frame Type', type: 'select', options: FRAME_TYPE_OPTIONS },
];

// ─── Spec config: common fields + subcategory-specific fields ───────────────────

export const CONSTRUCTION_MATERIALS_SPEC_CONFIG: Record<ConstructionMaterialsSubcategory, ConstructionMaterialsSpecField[]> = {
  'cement': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...CEMENT_FIELDS],
  'steel-rebar': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...STEEL_REBAR_FIELDS],
  'bricks-blocks': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...BRICKS_BLOCKS_FIELDS],
  'timber-wood': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...TIMBER_WOOD_FIELDS],
  'sand-gravel': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...SAND_GRAVEL_FIELDS],
  'plumbing': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...PLUMBING_FIELDS],
  'electrical-supplies': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...ELECTRICAL_SUPPLIES_FIELDS],
  'roofing': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...ROOFING_FIELDS],
  'paint-finishing': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...PAINT_FINISHING_FIELDS],
  'tiles-flooring': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...TILES_FLOORING_FIELDS],
  'hardware-tools': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...HARDWARE_TOOLS_FIELDS],
  'insulation': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...INSULATION_FIELDS],
  'glass-windows': [...CONSTRUCTION_MATERIALS_COMMON_FIELDS, ...GLASS_WINDOWS_FIELDS],
};

// Helper function to get spec config for a subcategory
export function getConstructionMaterialsSpecsConfig(subcategory: ConstructionMaterialsSubcategory): ConstructionMaterialsSpecField[] {
  return CONSTRUCTION_MATERIALS_SPEC_CONFIG[subcategory] || CONSTRUCTION_MATERIALS_COMMON_FIELDS;
}

// Helper function to get translation key for a field
export function getConstructionMaterialsFieldTranslationKey(fieldKey: string): string {
  return `fields.${fieldKey}`;
}

// Helper function to get translation key for an option
export function getConstructionMaterialsOptionTranslationKey(option: string): string {
  return `optionLabels.${option}`;
}
