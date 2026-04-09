// src/components/homepage/HeroSection.tsx
'use client';

import React from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';

interface HeroSectionProps {
  locale: Locale;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  const isRtl = isRTL(locale);

  return (
    <section className="relative rounded-lg overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-200">
      <div className={`px-6 md:px-10 py-8 md:py-12 flex items-center justify-between gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
          <p className="text-slate-700 text-2xl md:text-4xl font-light tracking-tight">
            {locale === 'en' ? 'ADVANTAGEOUS MARKETPLACE DEALS' : locale === 'ps' ? 'ګټور د بازار اعلانونه' : 'پیشنهادهای ویژه بازار'}
          </p>
          <p className="text-primary-700 text-3xl md:text-5xl font-extrabold mt-2">
            {locale === 'en' ? 'ON BAZAAR!' : locale === 'ps' ? 'په بازار کې!' : 'در بازار!'}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-24 h-44 rounded-2xl bg-white border border-slate-300 shadow-sm" />
          <div className="w-28 h-36 rounded-xl bg-white border border-slate-300 shadow-sm" />
          <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold text-center p-2">
            {locale === 'en' ? 'TOP DEALS' : locale === 'ps' ? 'غوره اعلانونه' : 'بهترین پیشنهاد'}
          </div>
        </div>
      </div>
    </section>
  );
};
