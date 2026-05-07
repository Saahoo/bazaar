// src/components/homepage/FeaturedListings.tsx
'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import Link from 'next/link';
import { ListingCardSkeleton } from '@/components/common/Skeleton';
import { cn } from '@/lib/utils/cn';

interface FeaturedListingsProps {
  locale: Locale;
}

// Reduced from 36 to 24 — still fills the grid but loads faster
const POST_COUNT = 24;

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tSearch = useTranslations('search');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'newest', limit: POST_COUNT });

  const displayListings = useMemo(() => listings.slice(0, POST_COUNT), [listings]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <ListingCardSkeleton key={index} compact />
        ))}
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
      <p className={cn('text-xs text-slate-500 mb-4', isRtl ? 'text-right' : 'text-left')}>
        {tSearch('results', { count: listings.length })}
      </p>

      {/* Strict 6×4 showcase grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {displayListings.map((listing, index) => (
          <Link
            key={listing.id}
            href={`/${locale}/listing/${listing.id}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 will-change-transform hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/70">
              {/* Fixed aspect ratio image — reserves space to prevent CLS */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {listing.photos?.[0] ? (
                  <Image
                    src={listing.photos[0]}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                    priority={index < 6}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100" />
                )}
              </div>
              {/* Card body */}
              <div className="p-2.5">
                <p className={cn('line-clamp-1 text-[11px] font-medium text-slate-700', isRtl ? 'text-right' : 'text-left')}>
                  {listing.title}
                </p>
                <p className={cn('mt-1 text-[11px] font-bold text-primary-700', isRtl ? 'text-right' : 'text-left')}>
                  {Number(listing.price).toLocaleString()} {listing.currency}
                </p>
                <p className={cn('mt-0.5 truncate text-[10px] text-slate-400', isRtl ? 'text-right' : 'text-left')}>
                  {listing.city}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
