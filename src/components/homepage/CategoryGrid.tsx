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
        // Use database ID directly - correction will happen in SearchPage
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
    <section className="rounded-[1.75rem] border border-slate-200 bg-white px-4 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:px-6 md:py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">
          {t('categories')}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {effectiveCategories.map((category, index) => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.02, 0.16), duration: 0.22 }}>
              <Link
              key={category.id}
              href={`/${locale}/search?category=${category.id}`}
              className="group flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.3rem] border border-slate-200 bg-slate-50 p-3 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50 hover:shadow-lg md:p-4"
            >
                <AnimatedCategoryIcon iconName={category.icon} className="h-11 w-11 border-slate-100 bg-white text-primary-600 group-hover:border-primary-100 group-hover:bg-white" />
              <div>
                  <h3 className="line-clamp-2 text-xs font-medium text-slate-900 transition group-hover:text-primary-600 md:text-sm">
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
