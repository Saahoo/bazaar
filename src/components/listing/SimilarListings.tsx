// src/components/listing/SimilarListings.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { ListingCard } from '@/components/search/ListingCard';

interface SimilarListingsProps {
  categoryId: number;
  currentListingId: string;
  locale: Locale;
}

export const SimilarListings: React.FC<SimilarListingsProps> = ({ categoryId, currentListingId, locale }) => {
  const t = useTranslations('listing');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ category: categoryId, limit: 5 });

  const similarListings = listings
    .filter((listing) => listing.id !== currentListingId)
    .slice(0, 4);

  if (loading || similarListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2
        className={`text-xl font-bold text-slate-900 mb-5 ${isRtl ? 'text-right' : 'text-left'}`}
      >
        {t('similar')}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>
    </section>
  );
};
