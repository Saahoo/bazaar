'use client';

export type RealEstatePropertyType =
  | 'apartment'
  | 'house_villa'
  | 'commercial'
  | 'office'
  | 'shop_retail'
  | 'land_plot'
  | 'industrial'
  | 'room_shared'
  | 'other';

export type ListingType = 'sale' | 'rent' | '';

export type RealEstatePriceType = 'total' | 'monthly' | 'yearly' | '';

export type RealEstateFurnishing = 'furnished' | 'semiFurnished' | 'unfurnished' | '';

export type RealEstateKitchenType = 'open' | 'closed' | '';

export type RealEstateCondition = 'new' | 'used' | 'renovated' | '';

export type RoomBathroomType = 'private' | 'shared' | '';

export type UtilitiesAvailable = 'water' | 'electricity' | 'gas';
