// src/components/homepage/HeroSection.tsx
'use client';

import React from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AdSenseSlot } from './AdSenseSlot';
import { HeaderBlockConfig, pickLocalized } from '@/lib/content/homepageSettings';

interface HeroSectionProps {
  locale: Locale;
  config: HeaderBlockConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, config }) => {
  const isRtl = isRTL(locale);
  const animationClass =
    config.animation.style === 'pulse-circles'
      ? 'after:content-[\'\'] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.2),transparent_35%)] after:animate-pulse'
      : config.animation.style === 'gradient-orbs'
        ? 'before:content-[\'\'] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_15%,rgba(99,102,241,0.22),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(2,132,199,0.22),transparent_35%)]'
        : '';

  return (
    <section className={`relative rounded-lg overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-200 ${animationClass}`}>
      <div className={`relative z-10 px-6 md:px-10 py-8 md:py-12 flex items-center justify-between gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
          <p className="text-slate-700 text-2xl md:text-4xl font-light tracking-tight">
            {pickLocalized(config.title, locale)}
          </p>
          <p className="text-primary-700 text-3xl md:text-5xl font-extrabold mt-2">
            {pickLocalized(config.subtitle, locale)}
          </p>
          <div className={`mt-4 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <a
              href={`/${locale}${config.primaryCtaUrl.startsWith('/') ? config.primaryCtaUrl : `/${config.primaryCtaUrl}`}`}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
            >
              {pickLocalized(config.primaryCta, locale)}
            </a>
            <a
              href={`/${locale}${config.secondaryCtaUrl.startsWith('/') ? config.secondaryCtaUrl : `/${config.secondaryCtaUrl}`}`}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {pickLocalized(config.secondaryCta, locale)}
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {config.animation.style !== 'none' && (
            <>
              <div className={`w-24 h-44 rounded-2xl bg-white border border-slate-300 shadow-sm ${config.animation.style === 'floating-cards' ? 'animate-pulse' : ''}`} />
              <div className={`w-28 h-36 rounded-xl bg-white border border-slate-300 shadow-sm ${config.animation.style === 'floating-cards' ? 'animate-pulse' : ''}`} />
            </>
          )}
          <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold text-center p-2">
            {pickLocalized(config.badge, locale)}
          </div>
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
