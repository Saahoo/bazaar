'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import Link from 'next/link';
import { ListingCardSkeleton } from '@/components/common/Skeleton';
import { cn } from '@/lib/utils/cn';

interface FeaturedListingsProps {
  locale: Locale;
}

const POST_COUNT = 36;

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tSearch = useTranslations('search');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'newest', limit: POST_COUNT });

  const displayListings = listings.slice(0, POST_COUNT);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {Array.from({ length: POST_COUNT }).map((_, index) => (
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

      {/* Strict 6×6 showcase grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {displayListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.36), duration: 0.25 }}
          >
            <Link
              href={`/${locale}/listing/${listing.id}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/70">
                {/* Fixed aspect ratio image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {listing.photos?.[0] ? (
                    <Image
                      src={listing.photos[0]}
                      alt={listing.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
          </motion.div>
        ))}
      </div>
    </>
  );
};
