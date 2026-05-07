'use client';

import React, { useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { ListingCardSkeleton } from '@/components/common/Skeleton';
import { cn } from '@/lib/utils/cn';

interface PopularInYourAreaProps {
  locale: Locale;
  titleOverride?: string;
}

const POST_COUNT = 6;

export const PopularInYourArea: React.FC<PopularInYourAreaProps> = ({ locale, titleOverride }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { listings, loading } = useListings({ sortBy: 'mostViewed', limit: 60 });

  // Pick top 6 most-viewed listings across all cities
  const displayListings = useMemo(() => listings.slice(0, POST_COUNT), [listings]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="rounded-[1.5rem] border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-md md:p-6">
      <div className={cn('flex items-center justify-between mb-5', isRtl && 'flex-row-reverse')}>
        <div className={cn('flex items-center gap-2.5', isRtl && 'flex-row-reverse')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 shadow-sm">
            <MapPin className="h-4 w-4 text-sky-500" />
          </div>
          <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900">
            {titleOverride || t('popular')}
          </h2>
        </div>
        <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
          {/* Carousel navigation arrows */}
          <button
            onClick={() => scroll(isRtl ? 'right' : 'left')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className={cn('h-4 w-4', isRtl && 'rotate-180')} />
          </button>
          <button
            onClick={() => scroll(isRtl ? 'left' : 'right')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
          </button>
          <Link
            href={`/${locale}/search`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-600 transition-all duration-200 hover:bg-sky-100 hover:shadow-sm md:text-sm"
          >
            {t('seeAll')}
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: POST_COUNT }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-44">
              <ListingCardSkeleton compact />
            </div>
          ))}
        </div>
      ) : displayListings.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">{titleOverride || t('popular')}</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
        >
          {displayListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.25 }}
              className="flex-shrink-0 w-44 snap-start"
            >
              <Link
                href={`/${locale}/listing/${listing.id}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50">
                  {/* Fixed aspect ratio image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {listing.photos?.[0] ? (
                      <Image
                        src={listing.photos[0]}
                        alt={listing.title}
                        fill
                        unoptimized
                        sizes="176px"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                        <MapPin className="h-6 w-6 text-slate-300" />
                      </div>
                    )}
                    {/* City badge */}
                    <span className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                      <MapPin className="h-2.5 w-2.5" />
                      {listing.city}
                    </span>
                    {/* View count */}
                    <span className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                      <Eye className="h-2.5 w-2.5" />
                      {listing.view_count}
                    </span>
                  </div>
                  {/* Card body */}
                  <div className="p-2.5">
                    <p className={cn('line-clamp-1 text-[11px] font-medium text-slate-700', isRtl ? 'text-right' : 'text-left')}>
                      {listing.title}
                    </p>
                    <p className={cn('mt-1 text-[11px] font-bold text-primary-700', isRtl ? 'text-right' : 'text-left')}>
                      {Number(listing.price).toLocaleString()} {listing.currency}
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
