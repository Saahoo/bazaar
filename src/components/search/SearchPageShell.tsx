'use client';

import React, { Suspense, lazy } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { ListingCardSkeleton, PanelSkeleton } from '@/components/common/Skeleton';

const LazySearchPage = lazy(async () => {
  const mod = await import('./SearchPage');
  return { default: mod.SearchPage };
});

interface SearchPageShellProps {
  locale: Locale;
  initialCategory?: string;
  initialQuery?: string;
}

export function SearchPageShell(props: SearchPageShellProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50">
          <div className="container mx-auto px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="hidden lg:block">
                <PanelSkeleton />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListingCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <LazySearchPage {...props} />
    </Suspense>
  );
}