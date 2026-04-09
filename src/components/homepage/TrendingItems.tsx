'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Flame, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';

interface TrendingItemsProps {
  locale: Locale;
}

export const TrendingItems: React.FC<TrendingItemsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'mostViewed', limit: 14 });

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4 md:p-5">
      <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">{t('trending')}</h2>
        </div>
        <Link
          href={`/${locale}/search`}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
        >
          {t('seeAll')}
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">{t('trending')}</p>
      ) : (
        <div className={`flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isRtl ? 'flex-row-reverse' : ''}`}>
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/${locale}/listing/${listing.id}`}
              className="group flex-shrink-0 w-36 snap-start"
            >
              <div className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-orange-300 hover:shadow-md transition">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  {listing.photos?.[0] ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Flame className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/55 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    <Eye className="w-2.5 h-2.5" />
                    {listing.view_count}
                  </span>
                  {listing.urgent && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                      URGENT
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
          ))}
        </div>
      )}
    </section>
  );
};
