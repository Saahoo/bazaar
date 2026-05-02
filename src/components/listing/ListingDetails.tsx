'use client';

import React from 'react';
import { ListingDetailsProps, ListingData, SellerData, ListingCategory } from './types';
import { BaseListingDetails } from './BaseListingDetails';

/**
 * ListingDetails component - Wrapper around BaseListingDetails for the listing details page
 * This component transforms the data from the page and passes it to BaseListingDetails
 * BaseListingDetails includes comprehensive localization support for all categories including vehicles
 */
export const ListingDetails: React.FC<ListingDetailsProps> = ({ listing, seller, locale }) => {
  // Transform the data to match ListingData interface
  const listingData: ListingData = {
    id: listing.id,
    user_id: listing.user_id,
    category_id: listing.category_id,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    currency: listing.currency,
    condition: listing.condition,
    city: listing.city,
    view_count: listing.view_count,
    favorite_count: listing.favorite_count,
    status: listing.status,
    phone_visible: listing.phone_visible,
    from_owner: listing.from_owner,
    created_at: listing.created_at,
    photos: listing.photos || [],
    metadata: listing.metadata || {},
    price_history: listing.price_history || [],
  };

  const sellerData: SellerData = {
    id: seller.id,
    display_name: seller.display_name,
    avatar_url: seller.avatar_url,
    phone: seller.phone,
    city: seller.city,
    bio: seller.bio,
    profile_type: seller.profile_type,
    company_name: seller.company_name,
    age: seller.age,
    sex: seller.sex,
    verified: seller.verified,
    rating: seller.rating,
    member_since: seller.member_since,
  };

  // Use BaseListingDetails for all categories (including vehicles)
  // VehicleLocalizedDetails has TypeScript/runtime issues, but BaseListingDetails
  // already includes all the localization enhancements needed
  return (
    <BaseListingDetails<ListingCategory>
      listingData={listingData as ListingCategory}
      sellerData={sellerData}
      locale={locale}
      loading={false}
    />
  );
};