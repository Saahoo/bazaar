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

// Union type for all listing categories
export type ListingCategory =
  | VehicleListing
  | RealEstateListing
  | ElectronicsListing
  | FashionListing
  | SparePartsListing
  | HomeFurnitureListing
  | HealthBeautyListing;

// Helper type to extract metadata type by category ID
export type ListingMetadata<T extends ListingCategory> = T['metadata'];

// Generic BaseListingDetails props
export interface BaseListingDetailsProps<T extends ListingCategory> {
  listingData: T;
  sellerData: SellerData;
  loading: boolean;
  locale: 'en' | 'ps' | 'fa';
}