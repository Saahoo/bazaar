// Mock data for development/testing
// This file provides placeholder data when real data is not available

export interface MockListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category_id: number;
  subcategory: string;
  condition: string;
  location: string;
  images: string[];
  created_at: string;
  user_id: string;
  city?: string;
  view_count?: number;
  favorite_count?: number;
  status?: string;
  from_owner?: boolean;
  photos?: string[];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  display_name?: string;
  bio?: string;
  verified?: boolean;
  rating?: number;
  member_since?: string;
  listing_count?: number;
  city?: string;
  view_count?: number;
  favorite_count?: number;
  status?: string;
  from_owner?: boolean;
  photos?: string[];
}

export function getMockListing(id: string): MockListing {
  return {
    id,
    title: `Sample Listing ${id}`,
    description: `This is a sample listing description for listing ${id}. This is placeholder text for development purposes.`,
    price: 1000,
    currency: 'USD',
    category_id: 1,
    subcategory: 'sample',
    condition: 'New',
    location: 'Sample City',
    city: 'Sample City',
    view_count: 0,
    favorite_count: 0,
    status: 'active',
    from_owner: true,
    photos: ['/placeholder-image.jpg'],
    images: ['/placeholder-image.jpg'],
    created_at: new Date().toISOString(),
    user_id: 'user-123'
  };
}

export function getMockUser(id: string): MockUser {
  return {
    id,
    name: `Sample User ${id}`,
    email: `user${id}@example.com`,
    phone: '+1234567890',
    avatar: '/placeholder-avatar.jpg',
    display_name: `User ${id}`,
    bio: 'Sample bio for development purposes.',
    verified: true,
    rating: 4.5,
    member_since: '2023-01-01'
  };
}

export function getListingTitle(listing: MockListing, _locale?: string): string {
  return listing.title;
}

export function getListingDescription(listing: MockListing, _locale?: string): string {
  return listing.description;
}