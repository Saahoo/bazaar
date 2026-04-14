'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { AnimatedCategoryIcon } from '@/lib/utils/category-icons';
import { cn } from '@/lib/utils/cn';

interface StepCategoryProps {
  locale: Locale;
  selectedCategory: number | null;
  onSelect: (categoryId: number, categorySlug?: string, categoryName?: string) => void;
}

interface DbCategory {
  id: number;
  name_en: string;
  name_ps: string;
  name_fa: string;
  slug: string;
  icon_name: string | null;
  parent_id: number | null;
  sort_order: number | null;
}

const EXCLUDED_TOP_LEVEL_CATEGORY_SLUGS = new Set(['mobile-phones', 'phones']);

export const StepCategory: React.FC<StepCategoryProps> = ({
  locale,
  selectedCategory,
  onSelect,
}) => {
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const supabase = createClient();
  const [categories, setCategories] = React.useState<DbCategory[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const getLocalizedName = (category: DbCategory): string => {
      const ps = (category.name_ps || '').trim();
      const fa = (category.name_fa || '').trim();
      const en = (category.name_en || '').trim();

      if (locale === 'ps') return ps || en || fa;
      if (locale === 'fa') return fa || en || ps;
      return en || ps || fa;
    };

    const getCategoryKey = (category: DbCategory): string => {
      const slug = (category.slug || '').toLowerCase().trim();
      if (slug === 'fashion' || slug === 'fashion-clothing') return 'fashion-family';
      return slug || `id-${category.id}`;
    };

    const pickBetterCategory = (a: DbCategory, b: DbCategory): DbCategory => {
      const score = (category: DbCategory): number => {
        const hasLocalizedName = getLocalizedName(category).length > 0 ? 2 : 0;
        const hasIcon = category.icon_name ? 1 : 0;
        const hasSlug = category.slug ? 1 : 0;
        return hasLocalizedName + hasIcon + hasSlug;
      };

      const scoreA = score(a);
      const scoreB = score(b);
      if (scoreA !== scoreB) return scoreA > scoreB ? a : b;

      const sortA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const sortB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (sortA !== sortB) return sortA < sortB ? a : b;

      return a.id < b.id ? a : b;
    };

    const loadCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name_en, name_ps, name_fa, slug, icon_name, parent_id, sort_order')
        .is('parent_id', null)
        .order('sort_order', { ascending: true });

      if (!mounted) return;
      const filtered = ((data as DbCategory[]) || [])
        .filter((category) => !EXCLUDED_TOP_LEVEL_CATEGORY_SLUGS.has((category.slug || '').toLowerCase()));

      const byKey = new Map<string, DbCategory>();
      for (const category of filtered) {
        const key = getCategoryKey(category);
        const existing = byKey.get(key);
        if (!existing) {
          byKey.set(key, category);
          continue;
        }
        byKey.set(key, pickBetterCategory(existing, category));
      }

      const normalized = Array.from(byKey.values()).sort((a, b) => {
        const aSort = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const bSort = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (aSort !== bSort) return aSort - bSort;
        return a.id - b.id;
      });

      setCategories(normalized);
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [supabase, locale]);

  const getLocalizedCategoryName = (category: DbCategory): string => {
    const ps = (category.name_ps || '').trim();
    const fa = (category.name_fa || '').trim();
    const en = (category.name_en || '').trim();

    switch (locale) {
      case 'ps':
        return ps || en || fa;
      case 'fa':
        return fa || en || ps;
      case 'en':
      default:
        return en || ps || fa;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {tForm('selectCategory')}
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <motion.button
              key={category.id}
              type="button"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(
                category.id,
                category.slug,
                getLocalizedCategoryName(category)
              )}
              className={cn(
                'group flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.35rem] border-2 p-4 text-center transition duration-300',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100'
                  : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:bg-primary-50 hover:shadow-md',
              )}
            >
              <AnimatedCategoryIcon
                iconName={category.icon_name || 'home'}
                active={isSelected}
                className={cn('h-12 w-12 rounded-2xl', !isSelected && 'border-slate-100 bg-white text-primary-600')}
              />
              <h4
                className={cn(
                  'line-clamp-2 text-sm font-medium transition',
                  isSelected ? 'text-primary-700' : 'text-slate-900 group-hover:text-primary-600',
                )}
              >
                {getLocalizedCategoryName(category)}
              </h4>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
