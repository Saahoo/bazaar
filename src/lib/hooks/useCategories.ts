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

    return dbCategories.length > 0
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
  }, [dbCategories, locale]);

  return { categories, loading };
}
