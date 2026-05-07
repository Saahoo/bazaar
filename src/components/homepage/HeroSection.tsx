// src/components/homepage/HeroSection.tsx
'use client';

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AdSenseSlot } from './AdSenseSlot';
import { HeaderBlockConfig, pickLocalized } from '@/lib/content/homepageSettings';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface HeroSectionProps {
  locale: Locale;
  config: HeaderBlockConfig;
}

interface HeroListing {
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

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, config }) => {
  const isRtl = isRTL(locale);
  const [heroListings, setHeroListings] = useState<HeroListing[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Memoize supabase client to avoid creating a new instance every render
  const supabase = useMemo(() => createClient(), []);

  const stats = useMemo(() => [
    { label: locale === 'en' ? 'Fast search' : locale === 'ps' ? 'چټک لټون' : 'جست‌وجوی سریع', icon: Zap },
    { label: locale === 'en' ? 'Trusted sellers' : locale === 'ps' ? 'باوري پلورونکي' : 'فروشندگان معتبر', icon: Shield },
    { label: locale === 'en' ? 'Mobile-first UX' : locale === 'ps' ? 'د موبایل لپاره برابر' : 'تجربه مناسب موبایل', icon: TrendingUp },
  ], [locale]);

  /* ── Fetch top 5 listings (admin-curated or top by views) ── */
  const fetchHeroListings = useCallback(async () => {
    setHeroLoading(true);
    try {
      const listingIds = config.carousel.listingIds ?? [];

      if (listingIds.length > 0) {
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, price, currency, city, view_count, photos(photo_url, display_order)')
          .in('id', listingIds)
          .eq('status', 'active')
          .is('deleted_at', null);

        if (error) throw error;

        const orderMap = new Map(listingIds.map((id, idx) => [id, idx]));
        const transformed: HeroListing[] = (data || [])
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

        setHeroListings(transformed.slice(0, 5));
      } else {
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, price, currency, city, view_count, photos(photo_url, display_order)')
          .eq('status', 'active')
          .is('deleted_at', null)
          .order('view_count', { ascending: false })
          .limit(5);

        if (error) throw error;

        const transformed: HeroListing[] = (data || []).map((row: Record<string, unknown>) => {
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

        setHeroListings(transformed);
      }
    } catch (err) {
      console.error('HeroSection listing fetch error:', err);
    } finally {
      setHeroLoading(false);
    }
  }, [config.carousel.listingIds, supabase]);

  useEffect(() => {
    fetchHeroListings();
  }, [fetchHeroListings]);

  /* ── Auto-advance carousel ── */
  const intervalMs = config.carousel.interval > 0 ? config.carousel.interval : 5000;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % Math.max(heroListings.length, 1));
  }, [heroListings.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroListings.length) % Math.max(heroListings.length, 1));
  }, [heroListings.length]);

  useEffect(() => {
    if (paused || heroListings.length <= 1) return;
    const timer = setInterval(goNext, intervalMs);
    return () => clearInterval(timer);
  }, [paused, goNext, intervalMs, heroListings.length]);

  /* ── Touch / swipe handlers ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const currentListing = heroListings[current];
  const carouselEnabled = config.carousel.enabled;
  const hasListings = heroListings.length > 0;

  return (
    <section className="relative overflow-hidden">
      <div className="marketplace-shell relative overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl">

        {/* ═══════════════════════════════════════════
            MOBILE LAYOUT
        ═══════════════════════════════════════════ */}
        <div className={cn('relative md:hidden', isRtl && 'text-right')}>
          {/* Mobile auto-advancing carousel */}
          {carouselEnabled && (
            <div
              className="group relative w-full aspect-[16/10] overflow-hidden bg-slate-900"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {heroLoading ? (
                <div className="h-full w-full animate-pulse bg-slate-200" />
              ) : hasListings && currentListing ? (
                <>
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
                        {currentListing.photos?.[0] ? (
                          <Image
                            src={currentListing.photos[0]}
                            alt={currentListing.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority={current === 0}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  {/* Slide info */}
                  <div className={cn('absolute bottom-0 left-0 right-0 p-4 z-10', isRtl && 'text-right')}>
                    <h3 className="text-white text-sm font-bold line-clamp-1 drop-shadow-lg">
                      {currentListing.title}
                    </h3>
                    <div className={cn('mt-1 flex items-center gap-2 text-white/80 text-xs', isRtl && 'flex-row-reverse justify-end')}>
                      <span className="font-bold text-white text-sm drop-shadow">
                        {Number(currentListing.price).toLocaleString()} {currentListing.currency}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {currentListing.city}
                      </span>
                    </div>
                  </div>

                  {/* Mobile dots */}
                  {heroListings.length > 1 && (
                    <div className={cn('absolute bottom-2 flex items-center gap-1 z-20', isRtl ? 'right-4' : 'left-4')}>
                      {heroListings.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                          className={cn(
                            'h-1.5 rounded-full transition-all duration-300',
                            idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                          )}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Slide counter */}
                  <div className={cn(
                    'absolute top-3 z-20 text-[10px] font-bold text-white/70 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5',
                    isRtl ? 'left-3' : 'right-3'
                  )}>
                    {current + 1} / {heroListings.length}
                  </div>
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>
              )}
            </div>
          )}

          {/* Mobile text area - CSS animations instead of framer-motion */}
          <div className={cn('relative z-10 px-4 py-5', isRtl && 'text-right')}>
            <p className="animate-slide-up text-lg font-extralight tracking-tight text-slate-700">
              {pickLocalized(config.title, locale)}
            </p>
            <p className="animate-slide-up-delay-1 mt-1 text-2xl font-black tracking-tight">
              <span className="gradient-text">{pickLocalized(config.subtitle, locale)}</span>
            </p>
            <div className="animate-scale-in-delay-1 mt-3">
              <Link
                href={`/${locale}${config.primaryCtaUrl.startsWith('/') ? config.primaryCtaUrl : `/${config.primaryCtaUrl}`}`}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all active:scale-95',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <Search className="h-4 w-4" />
                {pickLocalized(config.primaryCta, locale)}
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            DESKTOP / TABLET LAYOUT  –  65% carousel + 35% text
        ═══════════════════════════════════════════ */}
        <div className={cn(
          'relative hidden md:grid md:grid-cols-[65fr_35fr] min-h-[420px] lg:min-h-[500px]',
          isRtl && 'md:[direction:rtl]'
        )}>
          {/* ── Carousel section (65%) ── */}
          <div
            className="group relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {heroLoading ? (
              <div className="absolute inset-0 animate-pulse bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : carouselEnabled && hasListings && currentListing ? (
              <>
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
                      {currentListing.photos?.[0] ? (
                        <Image
                          src={currentListing.photos[0]}
                          alt={currentListing.title}
                          fill
                          sizes="65vw"
                          className="object-cover"
                          priority={current === 0}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-700" />
                      )}
                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className={cn(
                        'absolute inset-0 bg-gradient-to-r from-black/20 to-transparent',
                        isRtl && 'bg-gradient-to-l from-black/20 to-transparent'
                      )} />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Slide info overlay - CSS animation */}
                <div className={cn('absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 z-10', isRtl && 'text-right')}>
                  <div key={currentListing.id + '-info'} className="info-fade-in">
                    <h3 className="text-white text-base md:text-lg lg:text-xl font-bold line-clamp-1 drop-shadow-lg">
                      {currentListing.title}
                    </h3>
                    <div className={cn('mt-1.5 flex items-center gap-3 text-white/80 text-xs md:text-sm', isRtl && 'flex-row-reverse justify-end')}>
                      <span className="font-bold text-white text-lg md:text-xl lg:text-2xl drop-shadow">
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

                {/* Navigation arrows */}
                {heroListings.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.preventDefault(); goPrev(); }}
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/40',
                        isRtl ? 'right-4' : 'left-4'
                      )}
                      aria-label="Previous slide"
                    >
                      {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); goNext(); }}
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-white/40',
                        isRtl ? 'left-4' : 'right-4'
                      )}
                      aria-label="Next slide"
                    >
                      {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </>
                )}

                {/* Dots indicator */}
                {heroListings.length > 1 && (
                  <div className={cn('absolute bottom-3 md:bottom-4 flex items-center gap-1.5 z-20', isRtl ? 'right-4 md:right-6' : 'left-4 md:left-6')}>
                    {heroListings.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          idx === current ? 'w-6 bg-white shadow-sm' : 'w-1.5 bg-white/50 hover:bg-white/70'
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Slide counter */}
                <div className={cn(
                  'absolute top-4 z-20 text-[10px] md:text-xs font-bold text-white/70 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1',
                  isRtl ? 'left-4' : 'right-4'
                )}>
                  {current + 1} / {heroListings.length}
                </div>
              </>
            ) : (
              /* Fallback gradient when carousel disabled or no listings */
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,255,255,0.04),transparent_50%)]" />
              </div>
            )}

            {/* ── Curved SVG divider overlay ── */}
            <svg
              className={cn(
                'absolute top-0 bottom-0 z-10 pointer-events-none h-full',
                isRtl ? 'left-0 w-20 md:w-24 lg:w-28' : 'right-0 w-20 md:w-24 lg:w-28'
              )}
              viewBox="0 0 112 400"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="hero-curve-shadow" x="-20%" y="-5%" width="140%" height="110%">
                  <feDropShadow dx={isRtl ? 3 : -3} dy="0" stdDeviation="6" floodColor="rgba(0,0,0,0.08)" />
                </filter>
              </defs>
              {isRtl ? (
                <path
                  d="M112,0 C50,80 50,320 112,400 L112,400 L0,400 L0,0 Z"
                  fill="rgba(255,255,255,0.95)"
                  filter="url(#hero-curve-shadow)"
                />
              ) : (
                <path
                  d="M0,0 C62,80 62,320 0,400 L0,400 L112,400 L112,0 Z"
                  fill="rgba(255,255,255,0.95)"
                  filter="url(#hero-curve-shadow)"
                />
              )}
            </svg>
          </div>

          {/* ── Text section (35%) - CSS animations instead of framer-motion ── */}
          <div className={cn(
            'relative flex flex-col justify-center px-6 py-8 md:px-8 md:py-12 lg:px-10 lg:py-16 bg-white/95 backdrop-blur-md',
            isRtl && 'text-right'
          )}>
            {/* Subtle decorative orbs */}
            <div className="floating-orb floating-orb-1 opacity-20" />
            <div className="floating-orb floating-orb-2 opacity-15" />

            {/* Badge */}
            <div
              className={cn(
                'animate-scale-in inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md self-start',
                isRtl && 'flex-row-reverse self-end'
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-500 animate-pulse" />
              <span>{locale === 'en' ? 'Premium marketplace' : locale === 'ps' ? 'پریمیوم بازار' : 'بازار حرفه‌ای'}</span>
            </div>

            {/* Title */}
            <p className="animate-slide-up-delay-2 mt-5 text-2xl font-extralight tracking-tight text-slate-700 md:text-3xl lg:text-4xl">
              {pickLocalized(config.title, locale)}
            </p>
            <p className="animate-slide-up-delay-3 mt-1 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
              <span className="gradient-text">{pickLocalized(config.subtitle, locale)}</span>
            </p>

            {/* Description */}
            <p className="animate-slide-up-delay-4 mt-4 max-w-md text-sm leading-7 text-slate-500 md:text-base md:leading-8">
              {locale === 'en'
                ? 'Discover listings, sellers, and categories in a faster, cleaner marketplace built to feel smooth on every screen.'
                : locale === 'ps'
                  ? 'په هر سکرین کې په اسانه، چټک او پاکه بڼه اعلانونه، پلورونکي او کټګورۍ ومومئ.'
                  : 'آگهی‌ها، فروشندگان و دسته‌بندی‌ها را در بازاری سریع‌تر و روان‌تر روی هر صفحه پیدا کنید.'}
            </p>

            {/* CTA Buttons */}
            <div className={cn('animate-slide-up-delay-5 mt-6 flex flex-col gap-3 sm:flex-row', isRtl && 'sm:flex-row-reverse')}>
              <Link
                href={`/${locale}${config.primaryCtaUrl.startsWith('/') ? config.primaryCtaUrl : `/${config.primaryCtaUrl}`}`}
                className={cn(
                  'group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/30 active:translate-y-0',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {pickLocalized(config.primaryCta, locale)}
              </Link>
              <Link
                href={`/${locale}${config.secondaryCtaUrl.startsWith('/') ? config.secondaryCtaUrl : `/${config.secondaryCtaUrl}`}`}
                className={cn(
                  'group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0',
                  isRtl && 'flex-row-reverse'
                )}
              >
                {pickLocalized(config.secondaryCta, locale)}
                <ArrowRight className={cn('h-4 w-4 transition-transform duration-300 group-hover:translate-x-1', isRtl && 'rotate-180 group-hover:-translate-x-1')} />
              </Link>
            </div>

            {/* Stats */}
            <div className={cn('animate-slide-up-delay-6 mt-6 grid gap-2 grid-cols-3', isRtl && '[direction:rtl]')}>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/70 bg-white/75 px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 text-primary-500">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{stat.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AdSense */}
        {config.ad.enabled && (
          <div className="relative z-10 border-t border-slate-200/60 bg-white/85 px-4 py-2 backdrop-blur-sm">
            <AdSenseSlot
              client={config.ad.client}
              slot={config.ad.slot}
              format={config.ad.format}
              responsive={config.ad.responsive}
              className="min-h-[60px]"
            />
          </div>
        )}
      </div>
    </section>
  );
};
