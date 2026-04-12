'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';

interface PopularInYourAreaProps {
  locale: Locale;
  titleOverride?: string;
}

export const PopularInYourArea: React.FC<PopularInYourAreaProps> = ({ locale, titleOverride }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);

  // Fetch a decent set of listings then group by city to simulate "popular per area"
  const { listings, loading } = useListings({ sortBy: 'mostViewed', limit: 60 });

  // Pick up to 2 top-viewed listings per city (max 5 cities = 10 cards)
  const cityListings = useMemo(() => {
    const cityMap = new Map<string, typeof listings>();
    for (const listing of listings) {
      const city = listing.city || 'Other';
      if (!cityMap.has(city)) cityMap.set(city, []);
      const bucket = cityMap.get(city)!;
      if (bucket.length < 2) bucket.push(listing);
    }
    // Flatten: sort cities by total views of their top picks, then emit items in city order
    const sorted = Array.from(cityMap.entries())
      .sort(([, a], [, b]) => {
        const aViews = a.reduce((acc, l) => acc + l.view_count, 0);
        const bViews = b.reduce((acc, l) => acc + l.view_count, 0);
        return bViews - aViews;
      })
      .slice(0, 7); // top 7 cities
    return sorted;
  }, [listings]);

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-4 md:p-5">
      <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-sky-500" />
          </div>
          <h2 className="text-base md:text-lg font-semibold text-slate-900">{titleOverride || t('popular')}</h2>
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
      ) : cityListings.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">{titleOverride || t('popular')}</p>
      ) : (
        <div className="space-y-4">
          {cityListings.map(([city, items]) => (
            <div key={city}>
              {/* City row header */}
              <div className={`flex items-center justify-between mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wide ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {city}
                </span>
                <Link
                  href={`/${locale}/search?city=${encodeURIComponent(city)}`}
                  className="text-[10px] text-primary-500 hover:text-primary-700"
                >
                  {t('seeAll')}
                </Link>
              </div>

              {/* Listings row */}
              <div
                className={`flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                {items.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/${locale}/listing/${listing.id}`}
                    className="group flex-shrink-0 w-40 snap-start"
                  >
                    <div className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-sky-300 hover:shadow-md transition">
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                        {listing.photos?.[0] ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <MapPin className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className={`text-[11px] text-slate-700 line-clamp-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {listing.title}
                        </p>
                        <p className={`text-[11px] font-semibold text-primary-700 mt-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                          {Number(listing.price).toLocaleString()} {listing.currency}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
