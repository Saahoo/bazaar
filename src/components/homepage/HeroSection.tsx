// src/components/homepage/HeroSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AdSenseSlot } from './AdSenseSlot';
import { HeaderBlockConfig, pickLocalized } from '@/lib/content/homepageSettings';
import { cn } from '@/lib/utils/cn';

interface HeroSectionProps {
  locale: Locale;
  config: HeaderBlockConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, config }) => {
  const isRtl = isRTL(locale);
  const stats = [
    locale === 'en' ? 'Fast search' : locale === 'ps' ? 'چټک لټون' : 'جست‌وجوی سریع',
    locale === 'en' ? 'Trusted sellers' : locale === 'ps' ? 'باوري پلورونکي' : 'فروشندگان معتبر',
    locale === 'en' ? 'Mobile-first UX' : locale === 'ps' ? 'د موبایل لپاره برابر' : 'تجربه مناسب موبایل',
  ];

  return (
    <section className="marketplace-shell relative overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),transparent_50%)]" />
      <div className={cn('relative z-10 grid gap-8 px-6 py-8 md:px-10 md:py-12 xl:grid-cols-[1.35fr_0.9fr]', isRtl && 'xl:[direction:rtl]')}>
        <div className={cn(isRtl ? 'text-right' : 'text-left')}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={cn('inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm', isRtl && 'flex-row-reverse')}
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-500" />
            <span>{locale === 'en' ? 'Premium marketplace experience' : locale === 'ps' ? 'پریمیوم بازار تجربه' : 'تجربه بازار حرفه‌ای'}</span>
          </motion.div>

          <p className="mt-5 text-3xl font-light tracking-tight text-slate-700 md:text-5xl">
            {pickLocalized(config.title, locale)}
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-primary-700 md:text-6xl">
            {pickLocalized(config.subtitle, locale)}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {locale === 'en'
              ? 'Discover listings, sellers, and categories in a faster, cleaner marketplace built to feel smooth on every screen.'
              : locale === 'ps'
                ? 'په هر سکرین کې په اسانه، چټک او پاکه بڼه اعلانونه، پلورونکي او کټګورۍ ومومئ.'
                : 'آگهی‌ها، فروشندگان و دسته‌بندی‌ها را در بازاری سریع‌تر و روان‌تر روی هر صفحه پیدا کنید.'}
          </p>

          <div className={cn('mt-6 flex flex-col gap-3 sm:flex-row', isRtl && 'sm:flex-row-reverse')}>
            <Link
              href={`/${locale}${config.primaryCtaUrl.startsWith('/') ? config.primaryCtaUrl : `/${config.primaryCtaUrl}`}`}
              className={cn('inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition hover:-translate-y-0.5 hover:bg-primary-700', isRtl && 'flex-row-reverse')}
            >
              <Search className="h-4 w-4" />
              {pickLocalized(config.primaryCta, locale)}
            </Link>
            <Link
              href={`/${locale}${config.secondaryCtaUrl.startsWith('/') ? config.secondaryCtaUrl : `/${config.secondaryCtaUrl}`}`}
              className={cn('inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white', isRtl && 'flex-row-reverse')}
            >
              {pickLocalized(config.secondaryCta, locale)}
              <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
            </Link>
          </div>

          <div className={cn('mt-6 grid gap-3 sm:grid-cols-3', isRtl && 'sm:[direction:rtl]')}>
            {stats.map((stat) => (
              <div key={stat} className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                {stat}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-xl backdrop-blur-sm"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-600">
                {locale === 'en' ? 'Marketplace pulse' : locale === 'ps' ? 'د بازار حالت' : 'نبض بازار'}
              </p>
              <div className="rounded-full bg-primary-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {pickLocalized(config.badge, locale)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Live</p>
                <p className="mt-2 text-2xl font-bold">24/7</p>
              </div>
              <div className="rounded-2xl bg-accent-50 p-4 text-accent-700">
                <p className="text-xs uppercase tracking-[0.18em] text-accent-500">Reach</p>
                <p className="mt-2 text-2xl font-bold">3x</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {locale === 'en' ? 'Ready for mobile buyers' : locale === 'ps' ? 'د موبایل کاروونکو لپاره برابر' : 'آماده برای خریداران موبایل'}
                  </p>
                  <div className="h-3 w-24 overflow-hidden rounded-full bg-slate-200">
                    <motion.div className="h-full rounded-full bg-primary-600" initial={{ width: 0 }} animate={{ width: '76%' }} transition={{ duration: 0.8, delay: 0.2 }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {config.ad.enabled && (
        <div className="relative z-10 border-t border-slate-200/80 bg-white/85 px-4 py-2">
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
