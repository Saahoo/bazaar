// src/components/homepage/CategoryGrid.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Locale } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/client';
import { AnimatedCategoryIcon } from '@/lib/utils/category-icons';

interface CategoryGridProps {
  locale: Locale;
}

interface DbCategory {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string | null;
  icon_name: string | null;
  parent_id: number | null;
  sort_order: number | null;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ locale }) => {
  const t = useTranslations('homepage');
  const [dbCategories, setDbCategories] = React.useState<DbCategory[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('id, name_en, name_ps, name_fa, slug, icon_name, parent_id, sort_order')
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (!data) return;
      setDbCategories(
        ((data as DbCategory[]) || []).filter((c) => c.slug !== 'mobile-phones' && c.slug !== 'phones')
      );
    };

    fetchCategories();
  }, []);

  const getLocalizedDbCategoryName = (category: DbCategory): string => {
    switch (locale) {
      case 'ps':
        return category.name_ps;
      case 'fa':
        return category.name_fa;
      case 'en':
      default:
        return category.name_en;
    }
  };

  const effectiveCategories = dbCategories.length > 0
    ? dbCategories.map((c) => ({
        id: c.id,
        label: getLocalizedDbCategoryName(c),
        icon: c.icon_name || 'home',
      }))
    : MAIN_CATEGORIES.map((c) => ({
      id: c.id,
      label: getCategoryName(c.id, locale),
      icon: c.icon,
    }));

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 px-4 py-7 shadow-lg backdrop-blur-md md:px-6 md:py-9">
      {/* Subtle decorative gradient */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary-100/40 to-accent-100/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-accent-100/30 to-primary-100/30 blur-3xl" />

      <div className="container relative mx-auto px-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {t('categories')}
          </h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
        </motion.div>

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 md:gap-4">
          {effectiveCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: Math.min(index * 0.04, 0.3),
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
