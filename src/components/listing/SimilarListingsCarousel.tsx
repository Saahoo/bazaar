// src/components/listing/SimilarListingsCarousel.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { formatCurrency } from '@/lib/constants/currencies';
import { getCityName } from '@/lib/constants/cities';

interface SimilarListingsCarouselProps {
  categoryId: number;
  currentListingId: string;
  locale: Locale;
}

export const SimilarListingsCarousel: React.FC<SimilarListingsCarouselProps> = ({
  categoryId,
  currentListingId,
  locale,
}) => {
  const t = useTranslations('listing');
  const isRtl = isRTL(locale);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { listings, loading } = useListings({ category: categoryId, limit: 8 });

  const similarListings = listings
    .filter((listing) => listing.id !== currentListingId)
    .slice(0, 6);

  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScroll);
      }
    };
  }, [similarListings]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      const newScrollLeft = carouselRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className={`text-xl font-bold text-slate-900 mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('similar')}
        </h2>
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 animate-pulse">
              <div className="bg-slate-200 rounded-lg h-48 mb-3" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (similarListings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold text-slate-900 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('similar')}
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isRtl ? 'rotate-180' : ''}`}
            aria-label={t('previous')}
            title={t('previous')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isRtl ? 'rotate-180' : ''}`}
            aria-label={t('next')}
            title={t('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {similarListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/${locale}/listing/${listing.id}`}
              className="flex-shrink-0 w-64 bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-slate-100">
                {listing.photos?.[0] ? (
                  <Image
                    src={listing.photos[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-slate-200 rounded" />
                      <p className="text-sm">{t('noImage')}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-slate-900 line-clamp-1 mb-1">
                  {listing.title}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-blue-700">
                    {formatCurrency(listing.price, listing.currency)}
                  </span>
                  {listing.negotiable && (
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {t('negotiable')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-slate-600">
                  <span className="truncate">
                    {getCityName(listing.city, locale)}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(listing.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-IR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Hide scrollbar for WebKit browsers */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};