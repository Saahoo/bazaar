// src/components/homepage/ListingCardCompact.tsx
// Lightweight, memoized listing card for homepage carousels & grids
// Replaces heavy framer-motion animations with CSS transitions for 60fps scrolling

'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface ListingCardCompactProps {
  id: string;
  title: string;
  price: number;
  currency: string;
  city?: string;
  viewCount?: number;
  favoriteCount?: number;
  photoUrl?: string;
  urgent?: boolean;
  negotiable?: boolean;
  locale: Locale;
  /** Badge position icon - rendered as overlay */
  badge?: React.ReactNode;
  /** Accent color for hover border */
  accentColor?: string;
  /** Whether this is the first card in a carousel (for priority loading) */
  priority?: boolean;
}

const ListingCardCompactInner: React.FC<ListingCardCompactProps> = ({
  id,
  title,
  price,
  currency,
  city,
  viewCount: _viewCount,
  favoriteCount: _favoriteCount,
  photoUrl,
  urgent,
  negotiable,
  locale,
  badge,
  accentColor = 'primary',
  priority = false,
}) => {
  const isRtl = isRTL(locale);

  return (
    <Link
      href={`/${locale}/listing/${id}`}
      className="group block"
    >
      <div
        className={cn(
          'overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white shadow-sm',
          'transition-all duration-300 will-change-transform',
          'hover:-translate-y-1 hover:shadow-xl',
          accentColor === 'orange' && 'hover:border-orange-200 hover:shadow-orange-100/50',
          accentColor === 'rose' && 'hover:border-rose-200 hover:shadow-rose-100/50',
          accentColor === 'sky' && 'hover:border-sky-200 hover:shadow-sky-100/50',
          accentColor === 'primary' && 'hover:border-primary-200 hover:shadow-slate-200/70',
        )}
      >
        {/* Fixed aspect ratio image - reserves space to prevent CLS */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, 176px"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}

          {/* Badge overlay (view count, favorite count, city, etc.) */}
          {badge && (
            <span className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
              {badge}
            </span>
          )}

          {/* Urgent badge */}
          {urgent && (
            <span className="absolute top-1.5 right-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
              URGENT
            </span>
          )}

          {/* Negotiable badge */}
          {negotiable && (
            <span className="absolute top-1.5 left-1.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
              NEG
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-2.5">
          <p className={cn('line-clamp-1 text-[11px] font-medium text-slate-700', isRtl ? 'text-right' : 'text-left')}>
            {title}
          </p>
          <p className={cn('mt-1 text-[11px] font-bold text-primary-700', isRtl ? 'text-right' : 'text-left')}>
            {Number(price).toLocaleString()} {currency}
          </p>
          {city && (
            <p className={cn('mt-0.5 truncate text-[10px] text-slate-400', isRtl ? 'text-right' : 'text-left')}>
              {city}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ListingCardCompact = memo(ListingCardCompactInner);
