// src/lib/hooks/useCategories.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import type { Locale } from '@/lib/i18n/config';

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

export interface ResolvedCategory {
  id: number;
  label: string;
  icon: string;
}

/**
 * Shared hook that fetches categories from Supabase once and caches the result.
 * Falls back to MAIN_CATEGORIES if the DB fetch fails or returns empty.
 * Deduplicates the fetch across CategoryGrid and MobileCategoryStrip.
 */
export function useCategories(locale: Locale): {
  categories: ResolvedCategory[];
  loading: boolean;
} {
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('id, name_en, name_ps, name_fa, slug, icon_name, parent_id, sort_order')
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (!cancelled && data) {
          setDbCategories(
            ((data as DbCategory[]) || []).filter(
              (c) => c.slug !== 'mobile-phones' && c.slug !== 'phones'
            )
          );
        }
      } catch {
        // Silently fall back to static categories
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo<ResolvedCategory[]>(() => {
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

    // Deduplicate fashion categories similar to CategorySidebar
    const deduplicateCategories = (categories: DbCategory[]): DbCategory[] => {
      if (categories.length === 0) return categories;

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

      for (const category of categories) {
        const key = keyFor(category);
        const prev = bestByKey.get(key);
        if (!prev) {
          bestByKey.set(key, category);
          continue;
        }

        // Without listing counts, use sort_order then id as tie-breaker
        const prevSort = prev.sort_order ?? Number.MAX_SAFE_INTEGER;
        const nextSort = category.sort_order ?? Number.MAX_SAFE_INTEGER;
        
        if (nextSort < prevSort) {
          bestByKey.set(key, category);
        } else if (nextSort === prevSort && category.id < prev.id) {
          bestByKey.set(key, category);
        }
      }

      return Array.from(bestByKey.values()).sort((a, b) => {
        const aSort = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const bSort = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        if (aSort !== bSort) return aSort - bSort;
        return a.id - b.id;
      });
    };

    const categoriesToUse = dbCategories.length > 0 ? dbCategories : MAIN_CATEGORIES.map(c => ({
      id: c.id,
      name_en: c.name_en,
      name_ps: c.name_ps,
      name_fa: c.name_fa,
      slug: c.name_en.toLowerCase().replace(/[&]/g, 'and').replace(/\s+/g, '-'),
      icon_name: c.icon,
      parent_id: null,
      sort_order: c.id,
    } as DbCategory));

    const deduplicated = deduplicateCategories(categoriesToUse);

    return deduplicated.map((c) => ({
      id: c.id,
      label: dbCategories.length > 0 ? getLocalizedDbCategoryName(c) : getCategoryName(c.id, locale),
      icon: c.icon_name || 'home',
    }));
  }, [dbCategories, locale]);

  return { categories, loading };
}
