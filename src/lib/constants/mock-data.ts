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
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
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
    avatar: '/placeholder-avatar.jpg'
  };
}

export function getListingTitle(listing: MockListing): string {
  return listing.title;
}

export function getListingDescription(listing: MockListing): string {
  return listing.description;
}