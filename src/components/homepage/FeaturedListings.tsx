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

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tSearch = useTranslations('search');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'newest', limit: 40 });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
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
      <p className={`text-xs text-slate-500 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        {tSearch('results', { count: listings.length })}
      </p>

      {/* Dense showcase grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {listings.map((listing, index) => (
          <motion.div key={listing.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.24 }}>
            <Link
            key={listing.id}
            href={`/${locale}/listing/${listing.id}`}
            className="group block"
          >
              <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-slate-200/70">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {listing.photos?.[0] ? (
                  <Image
                    src={listing.photos[0]}
                    alt={listing.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 16vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                    <div className="h-full w-full bg-slate-100" />
                )}
                </div>
                <div className="p-3">
                  <p className={cn('line-clamp-1 text-[11px] text-slate-700', isRtl ? 'text-right' : 'text-left')}>
                  {listing.title}
                </p>
                  <p className={cn('mt-1 text-[11px] font-semibold text-primary-700', isRtl ? 'text-right' : 'text-left')}>
                  {Number(listing.price).toLocaleString()} {listing.currency}
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
