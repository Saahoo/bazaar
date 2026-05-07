// src/components/homepage/HeroCarousel.tsx
'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { HeroCarouselConfig } from '@/lib/content/homepageSettings';
import { cn } from '@/lib/utils/cn';

interface HeroCarouselProps {
  locale: Locale;
  config: HeroCarouselConfig;
}

interface CarouselListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  view_count: number;
  photos: string[];
}

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ locale, config }) => {
  const isRtl = isRTL(locale);
  const [listings, setListings] = useState<CarouselListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  // Memoize supabase client to avoid creating a new instance every render
  const supabase = useMemo(() => createClient(), []);

  // Fetch listings: admin-curated IDs or top 5 by view_count
  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      setLoading(true);
      try {
        if (config.listingIds.length > 0) {
          // Admin override: fetch specific listings by ID
          const { data, error } = await supabase
            .from('listings')
            .select('id, title, price, currency, city, view_count, photos(photo_url, display_order)')
            .in('id', config.listingIds)
            .eq('status', 'active')
            .is('deleted_at', null);

          if (error) throw error;

          // Preserve admin ordering
          const orderMap = new Map(config.listingIds.map((id, idx) => [id, idx]));
          const transformed: CarouselListing[] = (data || [])
            .map((row: Record<string, unknown>) => {
              const photos = row.photos as { photo_url: string; display_order: number }[] | null;
              return {
                id: row.id as string,
                title: row.title as string,
                price: row.price as number,
                currency: row.currency as string,
                city: row.city as string,
                view_count: row.view_count as number,
                photos: (photos || [])
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((p) => p.photo_url),
              };
            })
            .sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));

          if (!cancelled) setListings(transformed.slice(0, 5));
        } else {
          // Auto: top 5 most visited
          const { data, error } = await supabase
            .from('listings')
            .select('id, title, price, currency, city, view_count, photos(photo_url, display_order)')
            .eq('status', 'active')
            .is('deleted_at', null)
            .order('view_count', { ascending: false })
            .limit(5);

          if (error) throw error;

          const transformed: CarouselListing[] = (data || []).map((row: Record<string, unknown>) => {
            const photos = row.photos as { photo_url: string; display_order: number }[] | null;
            return {
              id: row.id as string,
              title: row.title as string,
              price: row.price as number,
              currency: row.currency as string,
              city: row.city as string,
              view_count: row.view_count as number,
              photos: (photos || [])
                .sort((a, b) => a.display_order - b.display_order)
                .map((p) => p.photo_url),
            };
          });

          if (!cancelled) setListings(transformed);
        }
      } catch (err) {
        console.error('HeroCarousel fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();
    return () => { cancelled = true; };
  }, [config.listingIds, supabase]);

  // Auto-slide
  const intervalMs = config.interval > 0 ? config.interval : 5000;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % Math.max(listings.length, 1));
  }, [listings.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + listings.length) % Math.max(listings.length, 1));
  }, [listings.length]);

  useEffect(() => {
    if (paused || listings.length <= 1) return;
    const timer = setInterval(goNext, intervalMs);
    return () => clearInterval(timer);
  }, [paused, goNext, intervalMs, listings.length]);

  const currentListing = listings[current];

  // Loading skeleton
  if (loading) {
    return (
      <div className="relative w-full aspect-[16/7] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="h-5 w-3/4 rounded bg-slate-300/60" />
          <div className="h-4 w-1/2 rounded bg-slate-300/40" />
        </div>
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <div
      className="group relative w-full aspect-[16/7] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentListing.id}
          custom={direction}
          variants={SLIDE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Link href={`/${locale}/listing/${currentListing.id}`} className="block h-full w-full">
            {/* Background image */}
            {currentListing.photos?.[0] ? (
              <Image
                src={currentListing.photos[0]}
                alt={currentListing.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                priority={current === 0}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-700" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Content - CSS animation instead of motion.div */}
            <div className={cn('absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8', isRtl && 'text-right')}>
              <div key={currentListing.id + '-info'} className="info-fade-in">
                <h3 className="text-white text-sm md:text-lg lg:text-xl font-bold line-clamp-1 drop-shadow-lg">
                  {currentListing.title}
                </h3>
                <div className={cn('mt-1.5 flex items-center gap-3 text-white/80 text-xs md:text-sm', isRtl && 'flex-row-reverse justify-end')}>
                  <span className="font-bold text-white text-base md:text-xl lg:text-2xl drop-shadow">
                    {Number(currentListing.price).toLocaleString()} {currentListing.currency}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentListing.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {currentListing.view_count}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {listings.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); goPrev(); }}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/40',
              isRtl ? 'right-3 md:right-4' : 'left-3 md:left-4'
            )}
            aria-label="Previous slide"
          >
            {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); goNext(); }}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 z-20 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/40',
              isRtl ? 'left-3 md:left-4' : 'right-3 md:right-4'
            )}
            aria-label="Next slide"
          >
            {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </>
      )}

      {/* Dots indicator */}
      {listings.length > 1 && (
        <div className={cn('absolute bottom-3 md:bottom-4 flex items-center gap-1.5 z-20', isRtl ? 'right-4 md:right-6' : 'left-4 md:left-6')}>
          {listings.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                idx === current
                  ? 'w-6 bg-white shadow-sm'
                  : 'w-1.5 bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className={cn(
        'absolute top-3 md:top-4 z-20 text-[10px] md:text-xs font-bold text-white/70 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1',
        isRtl ? 'left-3 md:left-4' : 'right-3 md:right-4'
      )}>
        {current + 1} / {listings.length}
      </div>
    </div>
  );
};
