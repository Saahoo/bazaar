// src/components/homepage/CategorySidebar.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/client';
import { AnimatedCategoryIcon, getIconNameFromSlug } from '@/lib/utils/category-icons';
import { cn } from '@/lib/utils/cn';

interface CategorySidebarProps {
  locale: Locale;
  titleOverride?: string;
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

const INITIAL_SHOW = 8;

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ locale, titleOverride }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);
  const [expanded, setExpanded] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);

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

  useEffect(() => {
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

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('category_id')
        .eq('status', 'active')
        .is('deleted_at', null);
      if (!data) return;
      const map: Record<number, number> = {};
      for (const row of data) {
        map[row.category_id] = (map[row.category_id] || 0) + 1;
      }
      setCounts(map);
    };
    fetchCounts();
  }, []);

  const dedupedDbCategories = useMemo(() => {
    if (dbCategories.length === 0) return dbCategories;

    const normalize = (value: string | null | undefined): string =>
      (value || '')
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(/[\s\-_/\\]+/g, '')
        .trim();

    const FASHION_NAME_ALIASES = new Set([
      'fashion',
      'fashionclothing',
      'fashionandclothing',
      'فیشناوجامې',
      'مدولباس',
      'فېشناوکالي',
    ]);

    const keyFor = (category: DbCategory): string => {
      const slug = normalize(category.slug);
      const enName = normalize(category.name_en);
      const psName = normalize(category.name_ps);
      const faName = normalize(category.name_fa);

      if (
        slug === 'fashion' ||
        slug === 'fashionclothing' ||
        slug === 'fashionandclothing' ||
        FASHION_NAME_ALIASES.has(enName) ||
        FASHION_NAME_ALIASES.has(psName) ||
        FASHION_NAME_ALIASES.has(faName)
      ) {
        return 'fashion-family';
      }

      if (slug) return `slug-${slug}`;
      if (enName) return `name-en-${enName}`;
      if (psName) return `name-ps-${psName}`;
      if (faName) return `name-fa-${faName}`;
      return `id-${category.id}`;
    };

    const bestByKey = new Map<string, DbCategory>();

    for (const category of dbCategories) {
      const key = keyFor(category);
      const prev = bestByKey.get(key);
      if (!prev) {
        bestByKey.set(key, category);
        continue;
      }

      const prevCount = counts[prev.id] || 0;
      const nextCount = counts[category.id] || 0;

      if (nextCount > prevCount) {
        bestByKey.set(key, category);
        continue;
      }

      if (nextCount === prevCount) {
        const prevSort = prev.sort_order ?? Number.MAX_SAFE_INTEGER;
        const nextSort = category.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (nextSort < prevSort) {
          bestByKey.set(key, category);
        }
      }
    }

    return Array.from(bestByKey.values()).sort((a, b) => {
      const aSort = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bSort = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (aSort !== bSort) return aSort - bSort;
      return a.id - b.id;
    });
  }, [dbCategories, counts]);

  const effectiveCategories = dedupedDbCategories.length > 0
    ? dedupedDbCategories.map((c) => ({
        // Use database ID directly - correction will happen in SearchPage
        id: c.id,
        label: getLocalizedDbCategoryName(c),
        icon: c.icon_name || getIconNameFromSlug(c.slug)
      }))
    : MAIN_CATEGORIES.map((c) => ({ id: c.id, label: getCategoryName(c.id, locale), icon: c.icon }));

  const visible = expanded ? effectiveCategories : effectiveCategories.slice(0, INITIAL_SHOW);
  const hasMore = effectiveCategories.length > INITIAL_SHOW;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className={cn('border-b border-slate-200 px-5 py-4', isRtl ? 'text-right' : 'text-left')}>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          {locale === 'en' ? 'Browse' : locale === 'ps' ? 'وګورئ' : 'مرور'}
        </p>
        <h3 className="text-base font-bold text-slate-900">{titleOverride || t('categories')}</h3>
      </div>

      {/* Category list */}
      <nav className="p-3">
        <ul className="space-y-1.5">
          {visible.map((category) => (
            <li key={category.id}>
              <motion.div whileHover={{ x: isRtl ? -4 : 4 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <Link
                href={`/${locale}/search?category=${category.id}`}
                className={cn('group flex items-center gap-3 rounded-2xl px-3 py-3 text-[13px] text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-primary-700 hover:shadow-sm', isRtl ? 'flex-row-reverse' : '')}
                >
                  <AnimatedCategoryIcon
                    iconName={category.icon}
                    className="h-11 w-11 rounded-xl border-slate-100 bg-slate-50 text-primary-600 group-hover:border-primary-100 group-hover:bg-primary-50"
                    iconClassName="h-4.5 w-4.5"
                  />
                  <span className="flex-1 truncate text-sm font-medium">{category.label}</span>
                  <svg className={`w-3 h-3 text-slate-400 group-hover:text-primary-500 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {counts[category.id] !== undefined && (
                    <span className="min-w-[28px] rounded-full bg-slate-100 px-2 py-1 text-center text-[11px] font-semibold text-slate-500">
                    {counts[category.id]}
                    </span>
                  )}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>

      {/* See More / See Less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-1 px-5 py-3 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors border-t border-slate-100 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{isRtl ? 'کمتر' : 'See Less'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{isRtl ? 'نور وګورئ' : 'See More'}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
