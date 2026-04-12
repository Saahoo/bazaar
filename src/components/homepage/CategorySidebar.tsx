// src/components/homepage/CategorySidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';
import { createClient } from '@/lib/supabase/client';

interface CategorySidebarProps {
  locale: Locale;
  titleOverride?: string;
}

const INITIAL_SHOW = 8;

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ locale, titleOverride }) => {
  const t = useTranslations('homepage');
  const isRtl = isRTL(locale);
  const [expanded, setExpanded] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});

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

  const visible = expanded ? MAIN_CATEGORIES : MAIN_CATEGORIES.slice(0, INITIAL_SHOW);
  const hasMore = MAIN_CATEGORIES.length > INITIAL_SHOW;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b border-slate-200 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-sm font-bold text-slate-800">{titleOverride || t('categories')}</h3>
      </div>

      {/* Category list */}
      <nav>
        <ul>
          {visible.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${locale}/search?category=${category.id}`}
                className={`flex items-center gap-2 px-4 py-2 text-[13px] text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors group ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <svg className={`w-3 h-3 text-slate-400 group-hover:text-primary-500 flex-shrink-0 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="flex-1 truncate">{getCategoryName(category.id, locale)}</span>
                {counts[category.id] !== undefined && (
                  <span className="text-xs text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 min-w-[24px] text-center">
                    {counts[category.id]}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* See More / See Less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-1 px-4 py-2.5 text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors border-t border-slate-100 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}
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
