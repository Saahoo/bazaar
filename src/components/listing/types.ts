// src/components/listing/types.ts
export interface ListingData extends BaseListingCategory {
  metadata?: Record<string, unknown>;
}

export interface SellerData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string;
  city?: string | null;
  bio?: string | null;
  profile_type?: string | null;
  company_name?: string | null;
  age?: number | null;
  sex?: string | null;
  verified: boolean;
  rating: number;
  member_since: string;
}

export interface ListingDetailsProps {
  listing: ListingData;
  seller: SellerData;
  locale: 'en' | 'ps' | 'fa';
}

// ==================== CATEGORY-SPECIFIC INTERFACES ====================

// Base interface for all listing categories
export interface BaseListingCategory {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: string;
  city: string;
  view_count: number;
  favorite_count: number;
  status: string;
  phone_visible?: boolean;
  from_owner: boolean;
  created_at: string;
  photos: string[];
  price_history?: Array<{
    old_price: number;
    new_price: number;
    currency: string;
    change_type: 'increase' | 'decrease';
    reason_code?: string | null;
    changed_at: string;
  }>;
}

// Vehicle listing specific fields
export interface VehicleListing extends BaseListingCategory {
  category_id: 1;
  metadata: {
    vehicleType?: string;
    year?: number;
    make?: string;
    model?: string;
    engineType?: string;
    trimLevel?: string;
    bodyType?: string;
    gearType?: string;
    wheelDriveType?: string;
    engineSize?: string;
    enginePower?: string;
    mileage?: number;
    color?: string;
    handDrive?: string;
    damage?: boolean;
    exchange?: boolean;
    numberPlate?: boolean;
    damageDetails?: string;
    otherOptions?: string[];
  };
}

// Real Estate listing specific fields
export interface RealEstateListing extends BaseListingCategory {
  category_id: 2;
  metadata: {
    propertyType?: string;
    listingType?: string;
    priceType?: string;
    bedrooms?: number;
    bathrooms?: number;
    areaSize?: number;
    areaUnit?: string;
    floorNumber?: number;
    totalFloors?: number;
    yearBuilt?: number;
    condition?: string;
    furnished?: boolean;
    city?: string;
    areaDistrict?: string;
    fullAddress?: string;
    amenities?: string[];
    parkingSpaces?: number;
    negotiable?: boolean;
    availableFrom?: string;
    roadAccess?: string;
    landType?: string;
  };
}

// Electronics listing specific fields
export interface ElectronicsListing extends BaseListingCategory {
  category_id: 3;
  metadata: {
    subcategory?: string;
    brand?: string;
    model?: string;
    condition?: string;
    warranty?: boolean;
    warrantyPeriod?: string;
    accessories?: string[];
    color?: string;
    storage?: string;
    ram?: string;
    screenSize?: string;
    processor?: string;
    batteryHealth?: string;
  };
}

// Fashion & Clothing listing specific fields
export interface FashionListing extends BaseListingCategory {
  category_id: 4;
  metadata: {
    subcategory?: string;
    brand?: string;
    size?: string;
    color?: string;
    material?: string;
    condition?: string;
    gender?: string;
    ageGroup?: string;
    style?: string;
    season?: string;
  };
}

// Spare Parts listing specific fields
export interface SparePartsListing extends BaseListingCategory {
  category_id: 5;
  metadata: {
    subcategory?: string;
    compatibleWith?: string;
    brand?: string;
    model?: string;
    condition?: string;
    partNumber?: string;
    warranty?: boolean;
    compatibilityNotes?: string;
  };
}

// Home & Furniture listing specific fields
export interface HomeFurnitureListing extends BaseListingCategory {
  category_id: 6;
  metadata: {
    subcategory?: string;
    material?: string;
    color?: string;
    dimensions?: string;
    condition?: string;
    style?: string;
    assemblyRequired?: boolean;
    warranty?: boolean;
    age?: string;
  };
}

// Health & Beauty listing specific fields
export interface HealthBeautyListing extends BaseListingCategory {
  category_id: 13;
  metadata: {
    subcategory?: string;
    brand?: string;
    type?: string;
    volume?: string;
    expiryDate?: string;
    condition?: string;
    ingredients?: string;
    skinType?: string;
    hairType?: string;
  };
}

// Jobs listing specific fields
export interface JobsListing extends BaseListingCategory {
  category_id: 8;
  metadata: {
    jobTitle?: string;
    employmentType?: string;
    remotePosition?: boolean;
    experienceLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    salaryNegotiable?: boolean;
    salaryNotDisclosed?: boolean;
    applicationDeadline?: string;
    hiringManagerName?: string;
    applicationMethod?: string;
    applicationEmail?: string;
    applicationUrl?: string;
    responsibilities?: string[];
    requirements?: string[];
    preferredQualifications?: string[];
    benefits?: Record<string, boolean | string>;
  };
}

// Services listing specific fields
export interface ServicesListing extends BaseListingCategory {
  category_id: 9;
  metadata: {
    subcategory?: string;
    serviceType?: string;
    experienceYears?: number;
    certification?: string;
    warranty?: boolean;
    serviceDuration?: string;
    homeServiceAvailable?: boolean;
    certifiedProfessional?: boolean;
    emergencyAvailable?: boolean;
    licenseVerified?: boolean;
    specializedIn?: string;
    sessionDuration?: string;
    subjectCourse?: string;
    level?: string;
    mode?: string;
    groupOrIndividual?: string;
    skills?: string[];
    toolsTechnologies?: string[];
    deliveryTime?: string;
    portfolioLink?: string;
    eventTypes?: string[];
    teamSize?: string;
    industry?: string;
    consultationMode?: string;
    specialization?: string;
    clinicOrHome?: string;
  };
}

// Animals listing specific fields
export interface AnimalsListing extends BaseListingCategory {
  category_id: 10;
  metadata: {
    subcategory?: string;
    breed?: string;
    quantity?: number;
    age?: string;
    healthStatus?: string;
    priceType?: string;
    color?: string;
    weight?: string;
    gender?: string;
    petType?: string;
    vaccinated?: boolean;
    spayedNeutered?: boolean;
    microchipped?: boolean;
    pedigree?: boolean;
    vaccinationRecord?: boolean;
    trainingLevel?: string;
    discipline?: string;
    milkProduction?: string;
    eggProduction?: string;
    housingType?: string;
    waterType?: string;
    tankSize?: string;
    breedingStatus?: string;
  };
}

// Food & Agriculture listing specific fields
export interface FoodAgricultureListing extends BaseListingCategory {
  category_id: 11;
  metadata: {
    subcategory?: string;
    quantity?: number;
    unit?: string;
    grade?: string;
    freshness?: string;
    origin?: string;
    certification?: string;
    deliveryAvailable?: boolean;
    minOrder?: string;
    brand?: string;
    organicCertification?: boolean;
    productType?: string;
    shelfLife?: string;
    variety?: string;
    moistureContent?: string;
    grainVariety?: string;
    packagingType?: string;
    spiceType?: string;
    formType?: string;
    dairyType?: string;
    fatContent?: string;
    seedType?: string;
    feedType?: string;
    animalType?: string;
    chemicalType?: string;
    equipmentType?: string;
    beverageType?: string;
    flavor?: string;
  };
}

// Books & Education listing specific fields
export interface BooksEducationListing extends BaseListingCategory {
  category_id: 12;
  metadata: {
    subcategory?: string;
    subjectMatter?: string;
    educationLevel?: string;
    language?: string;
    deliveryAvailable?: boolean;
    author?: string;
    isbn?: string;
    edition?: string;
    publicationYear?: number;
    publisher?: string;
    bookCondition?: string;
    bookFormat?: string;
    pages?: number;
    isTextbook?: boolean;
    ebookFormat?: string;
    fileSize?: string;
    drmProtected?: boolean;
    instructor?: string;
    platform?: string;
    courseDuration?: string;
    experienceLevel?: string;
    certification?: string;
    teachingMode?: string;
    lessonsCount?: number;
    hasLiveSessions?: boolean;
    hasAssignments?: boolean;
    tutorName?: string;
    qualification?: string;
    experienceYears?: number;
    sessionDuration?: string;
    availableDays?: string[];
    groupTutoring?: boolean;
    freeTrial?: boolean;
    supplyType?: string;
    brand?: string;
    itemCondition?: string;
    ageRange?: string;
  };
}

// Sports & Hobby listing specific fields
export interface SportsHobbyListing extends BaseListingCategory {
  category_id: 14;
  metadata: {
    subcategory?: string;
    condition?: string;
    brand?: string;
    ageGroup?: string;
    material?: string;
    equipmentType?: string;
    size?: string;
    weight?: string;
    gearType?: string;
    maxWeight?: string;
    foldable?: boolean;
    waterproof?: boolean;
    season?: string;
    capacity?: string;
    sport?: string;
    teamSize?: string;
    leagueApproved?: boolean;
    sportType?: string;
    skillLevel?: string;
    collectibleType?: string;
    year?: number;
    authenticity?: boolean;
    limitedEdition?: boolean;
    toolType?: string;
    powerSource?: string;
    safetyFeatures?: string;
    instrumentType?: string;
    accessoriesIncluded?: string;
    supplyType?: string;
    quantity?: number;
    nonToxic?: boolean;
    gameType?: string;
    playerCount?: string;
    completeSet?: boolean;
    ageRecommendation?: string;
  };
}

// Baby & Kids listing specific fields
export interface BabyKidsListing extends BaseListingCategory {
  category_id: 15;
  metadata: {
    subcategory?: string;
    condition?: string;
    ageRange?: string;
    gender?: string;
    deliveryAvailable?: boolean;
    clothingType?: string;
    size?: string;
    material?: string;
    season?: string;
    brand?: string;
    toyType?: string;
    toyMaterial?: string;
    safetyCertified?: boolean;
    gearType?: string;
    features?: string;
    feedingType?: string;
    bpaFree?: boolean;
    strollerType?: string;
    foldable?: boolean;
    weightCapacity?: string;
    furnitureType?: string;
    furnitureMaterial?: string;
    assemblyRequired?: boolean;
    diaperType?: string;
    diaperSize?: string;
    quantity?: number;
    footwearType?: string;
    footwearSize?: string;
    footwearMaterial?: string;
    supplyType?: string;
    gradeLevel?: string;
  };
}

// Business & Industry listing specific fields
export interface BusinessIndustryListing extends BaseListingCategory {
  category_id: 16;
  metadata: {
    subcategory?: string;
    condition?: string;
    businessType?: string;
    industrySector?: string;
    priceType?: string;
    deliveryAvailable?: boolean;
    warranty?: boolean;
    machineryType?: string;
    brand?: string;
    model?: string;
    powerSource?: string;
    powerRating?: string;
    yearOfManufacture?: number;
    operatingHours?: number;
    certification?: string;
    equipmentType?: string;
    specifications?: string;
    quantity?: number;
    materialType?: string;
    unit?: string;
    grade?: string;
    origin?: string;
    minOrder?: string;
    serviceType?: string;
    experienceYears?: number;
    teamSize?: string;
    serviceArea?: string;
    availableHours?: string;
    licensed?: boolean;
    freeConsultation?: boolean;
    manufacturingType?: string;
    productionCapacity?: string;
    leadTime?: string;
    customOrders?: boolean;
    wholesaleCategory?: string;
    bulkDiscount?: boolean;
    safetyType?: string;
    standardCompliance?: string;
    toolsType?: string;
    material?: string;
    businessDetails?: string;
    sellerType?: string;
  };
}

// Shopping & Groceries listing specific fields
export interface ShoppingGroceriesListing extends BaseListingCategory {
  category_id: 17;
  metadata: {
    subcategory?: string;
    condition?: string;
    brand?: string;
    priceType?: string;
    deliveryAvailable?: boolean;
    minOrder?: string;
    quantity?: number;
    unit?: string;
    foodType?: string;
    packagingType?: string;
    shelfLife?: string;
    dietaryInfo?: string;
    beverageType?: string;
    volume?: string;
    itemType?: string;
    material?: string;
    dimensions?: string;
    careType?: string;
    skinType?: string;
    snackType?: string;
    flavor?: string;
    productType?: string;
    ageRange?: string;
    safetyCert?: string;
    cleaningType?: string;
    surfaceType?: string;
    bakeryType?: string;
    freshness?: string;
    allergenInfo?: string;
    storageTemp?: string;
    dairyType?: string;
    fatContent?: string;
    storageType?: string;
    variety?: string;
    ripeness?: string;
    origin?: string;
    meatType?: string;
    cutType?: string;
    certification?: string;
    spiceType?: string;
    formType?: string;
    sellerType?: string;
  };
}

// Construction Materials listing specific fields
export interface ConstructionMaterialsListing extends BaseListingCategory {
  category_id: 18;
  metadata: {
    subcategory?: string;
    condition?: string;
    priceType?: string;
    deliveryAvailable?: boolean;
    minOrder?: string;
    quantity?: number;
    unit?: string;
    cementType?: string;
    cementGrade?: string;
    packagingType?: string;
    steelType?: string;
    diameter?: string;
    length?: string;
    steelGrade?: string;
    brickType?: string;
    brickSize?: string;
    compressiveStrength?: string;
    woodType?: string;
    treatment?: string;
    dimensions?: string;
    aggregateType?: string;
    grainSize?: string;
    source?: string;
    plumbingType?: string;
    plumbingMaterial?: string;
    electricalType?: string;
    voltage?: string;
    electricalCert?: string;
    roofingType?: string;
    roofingMaterial?: string;
    thickness?: string;
    paintType?: string;
    finishType?: string;
    coverage?: string;
    tileType?: string;
    tileMaterial?: string;
    tileSize?: string;
    hardwareType?: string;
    hardwareMaterial?: string;
    brand?: string;
    insulationType?: string;
    rValue?: string;
    insulationThickness?: string;
    glassType?: string;
    glassThickness?: string;
    frameType?: string;
  };
}

// Union type for all listing categories
export type ListingCategory =
  | VehicleListing
  | RealEstateListing
  | ElectronicsListing
  | FashionListing
  | SparePartsListing
  | HomeFurnitureListing
  | JobsListing
  | ServicesListing
  | AnimalsListing
  | FoodAgricultureListing
  | BooksEducationListing
  | HealthBeautyListing
  | SportsHobbyListing
  | BabyKidsListing
  | BusinessIndustryListing
  | ShoppingGroceriesListing
  | ConstructionMaterialsListing;

// Helper type to extract metadata type by category ID
export type ListingMetadata<T extends ListingCategory> = T['metadata'];

// Generic BaseListingDetails props
export interface BaseListingDetailsProps<T extends ListingCategory> {
  listingData: T;
  sellerData: SellerData;
  loading: boolean;
  locale: 'en' | 'ps' | 'fa';
}