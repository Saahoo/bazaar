// src/components/homepage/MobileCategoryStrip.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { useCategories } from '@/lib/hooks/useCategories';
import { AnimatedCategoryIcon } from '@/lib/utils/category-icons';

interface MobileCategoryStripProps {
  locale: Locale;
}

export const MobileCategoryStrip: React.FC<MobileCategoryStripProps> = ({ locale }) => {
  const { categories } = useCategories(locale);

  return (
    <div className="lg:hidden">
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/search?category=${category.id}`}
            className="group flex flex-shrink-0 snap-start items-center gap-2 rounded-full border border-slate-200/70 bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-sm transition-all duration-200 active:scale-95 active:bg-primary-50 active:border-primary-200"
          >
            <AnimatedCategoryIcon
              iconName={category.icon}
              className="h-7 w-7 border-none bg-transparent text-primary-500 shadow-none transition-colors duration-200 group-active:text-primary-600"
            />
            <span className="whitespace-nowrap text-xs font-semibold text-slate-700 transition-colors duration-200 group-active:text-primary-600">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
