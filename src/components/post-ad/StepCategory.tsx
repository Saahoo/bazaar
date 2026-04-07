'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isRTL, Locale } from '@/lib/i18n/config';
import { MAIN_CATEGORIES, getCategoryName } from '@/lib/constants/categories';

interface StepCategoryProps {
  locale: Locale;
  selectedCategory: number | null;
  onSelect: (categoryId: number) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-4 7 4M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4m-4 0v-4a1 1 0 011-1h2a1 1 0 011 1v4"
      />
    </svg>
  ),
  car: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 6l2 4h4l1 3H4l1-3h4l2-4h2z"
      />
    </svg>
  ),
  smartphone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 20h8a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  shirt: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 2l3 3h6l3-3m-12 3v14a1 1 0 001 1h8a1 1 0 001-1V5M9 5a3 3 0 006 0"
      />
    </svg>
  ),
  puzzle: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    </svg>
  ),
};

export const StepCategory: React.FC<StepCategoryProps> = ({
  locale,
  selectedCategory,
  onSelect,
}) => {
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);

  return (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
        {tForm('selectCategory')}
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {MAIN_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`group p-3 md:p-4 rounded-lg border-2 transition duration-200 flex flex-col items-center text-center gap-2 cursor-pointer h-full justify-center hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 bg-slate-50 hover:bg-primary-50 hover:border-primary-300'
              }`}
            >
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition ${
                  isSelected
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-white text-primary-600 group-hover:bg-primary-100 group-hover:text-primary-700'
                }`}
              >
                {ICON_MAP[category.icon] || ICON_MAP['home']}
              </div>
              <h4
                className={`font-medium text-xs md:text-sm transition line-clamp-2 ${
                  isSelected
                    ? 'text-primary-600'
                    : 'text-slate-900 group-hover:text-primary-600'
                }`}
              >
                {getCategoryName(category.id, locale)}
              </h4>
            </button>
          );
        })}
      </div>
    </div>
  );
};
