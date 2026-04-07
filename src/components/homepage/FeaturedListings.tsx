'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { ListingCard } from '@/components/search/ListingCard';

interface FeaturedListingsProps {
  locale: Locale;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tSearch = useTranslations('search');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'newest', limit: 12 });

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{t('trending')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Results info */}
      <p className={`text-xs text-slate-500 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        {tSearch('results', { count: listings.length })}
      </p>

      {/* Listing grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>
    </>
  );
};
