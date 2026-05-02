// src/components/homepage/MobileCategoryStrip.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/client';
import { AnimatedCategoryIcon } from '@/lib/utils/category-icons';

interface MobileCategoryStripProps {
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

export const MobileCategoryStrip: React.FC<MobileCategoryStripProps> = ({ locale }) => {
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
    <div className="lg:hidden">
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {effectiveCategories.map((category) => (
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
