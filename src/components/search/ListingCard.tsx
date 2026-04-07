// src/components/search/ListingCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Eye, MapPin, Clock, ImageIcon } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { formatCurrency } from '@/lib/constants/currencies';
import { getCityName } from '@/lib/constants/cities';
import type { Listing } from '@/lib/hooks/useListings';

interface ListingCardProps {
  listing: Listing;
  locale: Locale;
}

function getTimeAgo(dateString: string, locale: Locale): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return locale === 'en' ? 'Just now' : locale === 'ps' ? 'اوس مهال' : 'همین الان';
    }
    return locale === 'en'
      ? `${diffHours}h ago`
      : locale === 'ps'
        ? `${diffHours} ساعت مخکې`
        : `${diffHours} ساعت پیش`;
  }
  if (diffDays === 1) {
    return locale === 'en' ? 'Yesterday' : locale === 'ps' ? 'پرون' : 'دیروز';
  }
  if (diffDays < 7) {
    return locale === 'en'
      ? `${diffDays}d ago`
      : locale === 'ps'
        ? `${diffDays} ورځې مخکې`
        : `${diffDays} روز پیش`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === 'en'
      ? `${weeks}w ago`
      : locale === 'ps'
        ? `${weeks} اونۍ مخکې`
        : `${weeks} هفته پیش`;
  }
  const months = Math.floor(diffDays / 30);
  return locale === 'en'
    ? `${months}mo ago`
    : locale === 'ps'
      ? `${months} میاشتې مخکې`
      : `${months} ماه پیش`;
}

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  like_new: 'bg-primary-100 text-primary-700',
  good: 'bg-yellow-100 text-yellow-700',
  fair: 'bg-slate-100 text-slate-600',
};

const conditionKeyMap: Record<string, string> = {
  new: 'newCondition',
  like_new: 'likeNew',
  good: 'good',
  fair: 'fair',
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, locale }) => {
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const title = listing.title;
  const conditionKey = conditionKeyMap[listing.condition] || 'good';
  const conditionLabel = tCommon(conditionKey as 'newCondition' | 'likeNew' | 'good' | 'fair');
  const conditionColor = conditionColors[listing.condition] || conditionColors.good;
  const timeAgo = getTimeAgo(listing.created_at, locale);
  const photos = listing.photos || [];

  return (
    <Link href={`/${locale}/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center">
          {photos.length > 0 ? (
            <img
              src={photos[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-slate-300" />
          )}
          {/* Condition badge */}
          <span
            className={`absolute top-2 ${isRtl ? 'right-2' : 'left-2'} px-2 py-0.5 text-xs font-medium rounded-full ${conditionColor}`}
          >
            {conditionLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Title */}
          <h3
            className={`text-sm font-semibold text-slate-900 line-clamp-2 mb-1.5 group-hover:text-primary-600 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h3>

          {/* Price */}
          <p className={`text-base font-bold text-primary-600 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            {formatCurrency(listing.price, listing.currency)}
          </p>

          {/* Meta info */}
          <div className={`flex items-center gap-3 text-xs text-slate-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {/* City */}
            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin className="w-3.5 h-3.5" />
              {getCityName(listing.city, locale)}
            </span>

            {/* Views */}
            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Eye className="w-3.5 h-3.5" />
              {listing.view_count}
            </span>

            {/* Time */}
            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''} ml-auto ${isRtl ? 'ml-0 mr-auto' : ''}`}>
              <Clock className="w-3.5 h-3.5" />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
