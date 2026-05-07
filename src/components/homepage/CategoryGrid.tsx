// src/components/homepage/CategoryGrid.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { useCategories } from '@/lib/hooks/useCategories';
import { AnimatedCategoryIcon } from '@/lib/utils/category-icons';

interface CategoryGridProps {
  locale: Locale;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const { categories } = useCategories(locale);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 px-4 py-7 shadow-lg backdrop-blur-md md:px-6 md:py-9">
      {/* Subtle decorative gradient */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary-100/40 to-accent-100/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-accent-100/30 to-primary-100/30 blur-3xl" />

      <div className="container relative mx-auto px-2">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {t('categories')}
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 md:gap-4 stagger-children">
          {categories.map((category) => (
            <div key={category.id}>
              <Link
                href={`/${locale}/search?category=${category.id}`}
                className="group flex h-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-3 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200/60 hover:bg-gradient-to-b hover:from-primary-50/80 hover:to-white hover:shadow-lg hover:shadow-primary-100/30 active:translate-y-0 active:shadow-sm md:p-4 md:gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-200/0 to-accent-200/0 transition-all duration-300 group-hover:from-primary-200/20 group-hover:to-accent-200/20 group-hover:scale-110" />
                  <AnimatedCategoryIcon
                    iconName={category.icon}
                    className="relative h-10 w-10 border-slate-100 bg-white text-primary-500 shadow-sm transition-all duration-300 group-hover:border-primary-100 group-hover:bg-white group-hover:text-primary-600 group-hover:shadow-md md:h-11 md:w-11"
                  />
                </div>
                <div>
                  <h3 className="line-clamp-2 text-[11px] font-semibold text-slate-700 transition-colors duration-300 group-hover:text-primary-600 md:text-xs md:font-bold">
                    {category.label}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
