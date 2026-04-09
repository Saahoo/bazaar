'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import Link from 'next/link';

interface FeaturedListingsProps {
  locale: Locale;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const tSearch = useTranslations('search');
  const isRtl = isRTL(locale);

  const { listings, loading } = useListings({ sortBy: 'newest', limit: 40 });

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{t('trending')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Results info */}
      <p className={`text-xs text-slate-500 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        {tSearch('results', { count: listings.length })}
      </p>

      {/* Dense showcase grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/${locale}/listing/${listing.id}`}
            className="group block"
          >
            <div className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-primary-300 hover:shadow-sm transition">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                {listing.photos?.[0] ? (
                  <img
                    src={listing.photos[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
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
    </>
  );
};
