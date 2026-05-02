// src/components/homepage/HeroSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AdSenseSlot } from './AdSenseSlot';
import { HeaderBlockConfig, pickLocalized } from '@/lib/content/homepageSettings';
import { cn } from '@/lib/utils/cn';

interface HeroSectionProps {
  locale: Locale;
  config: HeaderBlockConfig;
}

// statIcons removed - icons are now inline in stats array

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, config }) => {
  const isRtl = isRTL(locale);
  const stats = [
    { label: locale === 'en' ? 'Fast search' : locale === 'ps' ? 'چټک لټون' : 'جست‌وجوی سریع', icon: Zap },
    { label: locale === 'en' ? 'Trusted sellers' : locale === 'ps' ? 'باوري پلورونکي' : 'فروشندگان معتبر', icon: Shield },
    { label: locale === 'en' ? 'Mobile-first UX' : locale === 'ps' ? 'د موبایل لپاره برابر' : 'تجربه مناسب موبایل', icon: TrendingUp },
  ];

  return (
    <section className="marketplace-shell relative overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl">
      {/* Animated background orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(192,0,0,0.06),transparent_60%)]" />

      {/* Mobile compact layout */}
      <div className={cn('relative z-10 px-4 py-5 md:hidden', isRtl && 'text-right')}>
        <div className="flex items-center justify-between gap-3">
          <div className={cn('min-w-0 flex-1', isRtl && 'text-right')}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg font-extralight tracking-tight text-slate-700"
            >
              {pickLocalized(config.title, locale)}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl font-black tracking-tight"
            >
              <span className="gradient-text">{pickLocalized(config.subtitle, locale)}</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        </div>
      </div>

      {/* Desktop/tablet layout */}
      <div className={cn('relative z-10 hidden gap-8 px-5 py-8 md:grid md:px-10 md:py-14 xl:grid-cols-[1.35fr_0.9fr]', isRtl && 'xl:[direction:rtl]')}>
        <div className={cn(isRtl ? 'text-right' : 'text-left')}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn('inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md', isRtl && 'flex-row-reverse')}
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-500 animate-pulse" />
            <span>{locale === 'en' ? 'Premium marketplace experience' : locale === 'ps' ? 'پریمیوم بازار تجربه' : 'تجربه بازار حرفه‌ای'}</span>
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-3xl font-extralight tracking-tight text-slate-700 md:text-5xl lg:text-6xl"
          >
            {pickLocalized(config.title, locale)}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl"
          >
            <span className="gradient-text">{pickLocalized(config.subtitle, locale)}</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 md:text-base md:leading-8"
          >
            {locale === 'en'
              ? 'Discover listings, sellers, and categories in a faster, cleaner marketplace built to feel smooth on every screen.'
              : locale === 'ps'
                ? 'په هر سکرین کې په اسانه، چټک او پاکه بڼه اعلانونه، پلورونکي او کټګورۍ ومومئ.'
                : 'آگهی‌ها، فروشندگان و دسته‌بندی‌ها را در بازاری سریع‌تر و روان‌تر روی هر صفحه پیدا کنید.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn('mt-7 flex flex-col gap-3 sm:flex-row', isRtl && 'sm:flex-row-reverse')}
          >
            <Link
              href={`/${locale}${config.primaryCtaUrl.startsWith('/') ? config.primaryCtaUrl : `/${config.primaryCtaUrl}`}`}
              className={cn(
                'group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-500/30 active:translate-y-0',
                isRtl && 'flex-row-reverse'
              )}
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {pickLocalized(config.primaryCta, locale)}
            </Link>
            <Link
              href={`/${locale}${config.secondaryCtaUrl.startsWith('/') ? config.secondaryCtaUrl : `/${config.secondaryCtaUrl}`}`}
              className={cn(
                'group inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0',
                isRtl && 'flex-row-reverse'
              )}
            >
              {pickLocalized(config.secondaryCta, locale)}
              <ArrowRight className={cn('h-4 w-4 transition-transform duration-300 group-hover:translate-x-1', isRtl && 'rotate-180 group-hover:-translate-x-1')} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('mt-8 grid gap-3 sm:grid-cols-3', isRtl && 'sm:[direction:rtl]')}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group rounded-2xl border border-white/70 bg-white/75 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:border-primary-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 text-primary-500 transition-colors group-hover:from-primary-100 group-hover:to-accent-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right panel */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-md"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-slate-700">
                {locale === 'en' ? 'Marketplace pulse' : locale === 'ps' ? 'د بازار حالت' : 'نبض بازار'}
              </p>
              <div className="rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
                {pickLocalized(config.badge, locale)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Live</p>
                <p className="mt-2 text-2xl font-black">24/7</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 p-4 text-accent-700 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-accent-500">Reach</p>
                <p className="mt-2 text-2xl font-black">3x</p>
              </motion.div>
              <div className="col-span-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">
                    {locale === 'en' ? 'Ready for mobile buyers' : locale === 'ps' ? 'د موبایل کاروونکو لپاره برابر' : 'آماده برای خریداران موبایل'}
                  </p>
                  <div className="h-3 w-24 overflow-hidden rounded-full bg-slate-200/80">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-500"
                      initial={{ width: 0 }}
                      animate={{ width: '76%' }}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
    </section>
  );
};
