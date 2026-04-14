'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { ListingCardSkeleton } from '@/components/common/Skeleton';

interface MostWatchedProps {
  locale: Locale;
  titleOverride?: string;
}

export const MostWatched: React.FC<MostWatchedProps> = ({ locale, titleOverride }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'mostFavorited', limit: 14 });

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4 md:p-5">
      <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">{titleOverride || t('mostWatched')}</h2>
        </div>
        <Link
          href={`/${locale}/search`}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
        >
          {t('seeAll')}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-flow-col auto-cols-[9rem] gap-3 overflow-hidden py-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <ListingCardSkeleton key={index} compact />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">{titleOverride || t('mostWatched')}</p>
      ) : (
        <div
          className={`flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          {listings.map((listing, index) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.15), duration: 0.2 }}>
              <Link
              key={listing.id}
              href={`/${locale}/listing/${listing.id}`}
              className="group flex-shrink-0 w-36 snap-start"
            >
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-rose-300 hover:shadow-md transition">
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {listing.photos?.[0] ? (
                    <Image
                      src={listing.photos[0]}
                      alt={listing.title}
                      fill
                      unoptimized
                      sizes="144px"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Heart className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/55 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    <Heart className="w-2.5 h-2.5 fill-rose-400 stroke-rose-400" />
                    {listing.favorite_count}
                  </span>
                  {listing.negotiable && (
                    <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                      NEG
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className={`text-[11px] text-slate-700 line-clamp-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {listing.title}
                  </p>
                  <p className={`text-[11px] font-semibold text-primary-700 mt-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {Number(listing.price).toLocaleString()} {listing.currency}
                  </p>
                  <p className={`text-[10px] text-slate-400 mt-0.5 truncate ${isRtl ? 'text-right' : 'text-left'}`}>
                    {listing.city}
                  </p>
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
