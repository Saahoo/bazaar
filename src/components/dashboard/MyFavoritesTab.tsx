// src/components/dashboard/MyFavoritesTab.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Locale } from '@/lib/i18n/config';
import { MOCK_LISTINGS } from '@/lib/constants/mock-data';
import { ListingCard } from '@/components/search/ListingCard';
import type { Listing } from '@/lib/hooks/useListings';

interface MyFavoritesTabProps {
  locale: Locale;
}

export const MyFavoritesTab: React.FC<MyFavoritesTabProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  // Mock favorites: first 4 active listings
  const mockListings = MOCK_LISTINGS.filter((l) => l.status === 'active').slice(0, 4);

  // Adapt mock data to Listing shape expected by ListingCard
  const favoriteListings: Listing[] = mockListings.map((m) => ({
    id: m.id,
    user_id: m.user_id,
    category_id: m.category_id,
    title: m.title.en,
    description: m.description.en,
    price: m.price,
    currency: m.currency,
    condition: m.condition,
    phone_visible: true,
    from_owner: false,
    urgent: false,
    negotiable: false,
    city: m.city,
    address: null,
    latitude: null,
    longitude: null,
    view_count: m.view_count,
    favorite_count: m.favorite_count,
    status: m.status,
    metadata: {},
    created_at: m.created_at,
    expires_at: m.created_at,
    updated_at: m.created_at,
    photos: m.photos,
  }));

  if (favoriteListings.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>{t('myFavorites')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} locale={locale} />
      ))}
    </div>
  );
};
