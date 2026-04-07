// src/components/dashboard/MyFavoritesTab.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Locale } from '@/lib/i18n/config';
import { MOCK_LISTINGS } from '@/lib/constants/mock-data';
import { ListingCard } from '@/components/search/ListingCard';

interface MyFavoritesTabProps {
  locale: Locale;
}

export const MyFavoritesTab: React.FC<MyFavoritesTabProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  // Mock favorites: first 4 active listings
  const favoriteListings = MOCK_LISTINGS.filter((l) => l.status === 'active').slice(0, 4);

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
