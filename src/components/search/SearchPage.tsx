// src/components/search/SearchPage.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import { FilterSidebar } from './FilterSidebar';
import { ListingCard } from './ListingCard';
import { SortDropdown } from './SortDropdown';

interface SearchPageProps {
  locale: Locale;
  initialCategory?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ locale, initialCategory }) => {
  const t = useTranslations('search');
  const isRtl = isRTL(locale);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory ? Number(initialCategory) : null
  );
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build filters for the hook
  const filters = useMemo(() => ({
    category: selectedCategory,
    city: selectedCity || undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
    sortBy: sortBy as 'newest' | 'oldest' | 'priceLow' | 'priceHigh',
  }), [selectedCategory, selectedCity, priceMin, priceMax, selectedConditions, sortBy]);

  // Fetch real-time listings from Supabase
  const { listings, loading, error } = useListings(filters);

  return (
    <main className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            {mobileFiltersOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" />
            )}
            {t('filter')}
          </button>
        </div>

        <div className={`flex gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Sidebar - desktop always visible, mobile collapsible */}
          <aside
            className={`w-full lg:w-72 flex-shrink-0 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <FilterSidebar
              locale={locale}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceMin={priceMin}
              onPriceMinChange={setPriceMin}
              priceMax={priceMax}
              onPriceMaxChange={setPriceMax}
              selectedConditions={selectedConditions}
              onConditionsChange={setSelectedConditions}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div
              className={`flex items-center justify-between mb-4 flex-wrap gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <p className={`text-sm text-slate-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                {loading ? '...' : t('results', { count: listings.length })}
              </p>
              <SortDropdown locale={locale} value={sortBy} onChange={setSortBy} />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Loading...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <p className="text-slate-500 text-base">{t('noResults')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
