// src/components/homepage/HeroSection.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';

interface HeroSectionProps {
  locale: Locale;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  return (
    <section className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 rounded-lg overflow-hidden relative">
      <div className="px-6 md:px-10 py-8 md:py-12">
        {/* Search Bar */}
        <div className="max-w-lg mb-5">
          <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <input
              type="text"
              placeholder={tCommon('search')}
              className={`flex-1 px-4 py-2.5 rounded-lg border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 text-sm ${
                isRtl ? 'text-right' : 'text-left'
              }`}
            />
            <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 whitespace-nowrap shadow-sm text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline">{tCommon('search')}</span>
            </button>
          </div>
        </div>

        {/* Hero Text */}
        <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-sm md:text-base text-primary-100">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Trust Signals - compact row */}
        <div className={`flex flex-wrap gap-4 mt-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">{t('trustSignals.users')}</span>
          </div>

          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">{t('trustSignals.transactions')}</span>
          </div>

          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs text-white font-medium">{t('trustSignals.owner')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
