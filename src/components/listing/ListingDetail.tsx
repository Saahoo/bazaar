// src/components/listing/ListingDetail.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ImageIcon, MapPin, Clock, Eye, Heart } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { formatCurrency } from '@/lib/constants/currencies';
import { getCityName } from '@/lib/constants/cities';
import { getCategoryName } from '@/lib/constants/categories';
import { SellerCard } from './SellerCard';
import { ActionButtons } from './ActionButtons';
import { SimilarListings } from './SimilarListings';

export interface ListingData {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: string;
  city: string;
  view_count: number;
  favorite_count: number;
  status: string;
  phone_visible?: boolean;
  created_at: string;
  photos: string[];
  metadata?: Record<string, unknown>;
}

export interface SellerData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string;
  verified: boolean;
  rating: number;
  member_since: string;
}

interface ListingDetailProps {
  listing: ListingData;
  seller: SellerData;
  locale: Locale;
}

const conditionKeyMap: Record<string, string> = {
  new: 'newCondition',
  like_new: 'likeNew',
  good: 'good',
  fair: 'fair',
};

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  like_new: 'bg-primary-100 text-primary-700',
  good: 'bg-yellow-100 text-yellow-700',
  fair: 'bg-slate-100 text-slate-600',
};

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, seller, locale }) => {
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  const title = listing.title;
  const description = listing.description || '';
  const conditionKey = conditionKeyMap[listing.condition] || 'good';
  const conditionLabel = tCommon(conditionKey as 'newCondition' | 'likeNew' | 'good' | 'fair');
  const conditionColor = conditionColors[listing.condition] || conditionColors.good;

  const postedDate = new Date(listing.created_at).toLocaleDateString(
    locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const hasPhotos = listing.photos.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Photo gallery */}
      <div className="mb-6">
        {hasPhotos ? (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {/* First photo large */}
            <div className="row-span-2 aspect-video bg-slate-100 relative">
              <img
                src={listing.photos[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Remaining photos */}
            {listing.photos.slice(1, 3).map((photo, index) => (
              <div key={index} className="aspect-video bg-slate-100">
                <img
                  src={photo}
                  alt={`${title} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {listing.photos.length < 3 && (
              <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-lg">
                <ImageIcon className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {/* Main placeholder - spans 2 rows */}
            <div className="row-span-2 aspect-video bg-slate-100 flex items-center justify-center rounded-lg">
              <ImageIcon className="w-16 h-16 text-slate-300" />
            </div>
            {/* Smaller placeholders */}
            <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-lg">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-lg">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
          </div>
        )}
      </div>

      {/* Two-column layout: main content + seller sidebar */}
      <div className={`flex flex-col lg:flex-row gap-6 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sold out banner */}
          {listing.status === 'sold' && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-center">
              {t('soldOut')}
            </div>
          )}

          {/* Title */}
          <h1
            className={`text-2xl md:text-3xl font-bold text-slate-900 mb-3 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h1>

          {/* Price */}
          <p
            className={`text-2xl font-bold text-primary-600 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {formatCurrency(listing.price, listing.currency)}
          </p>

          {/* Condition badge + category */}
          <div className={`flex items-center gap-3 mb-5 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${conditionColor}`}>
              {conditionLabel}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-600">
              {getCategoryName(listing.category_id, locale)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="mb-6 border-b border-slate-200 pb-5">
            <ActionButtons
              locale={locale}
              listingId={listing.id}
              listingTitle={listing.title}
              sellerId={seller.id}
              sellerPhone={seller.phone}
              phoneVisible={listing.phone_visible}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2
              className={`text-lg font-semibold text-slate-900 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {t('description')}
            </h2>
            <p
              className={`text-slate-600 leading-relaxed whitespace-pre-line ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {description}
            </p>
          </div>

          {/* Details / meta info */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6">
            <div className="space-y-3">
              {/* Location */}
              <div
                className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500">{t('location')}:</span>
                <span className="text-slate-700 font-medium">
                  {getCityName(listing.city, locale)}
                </span>
              </div>

              {/* Condition */}
              <div
                className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <span className="w-4 h-4 flex items-center justify-center text-slate-400 flex-shrink-0 text-xs">
                  &#9679;
                </span>
                <span className="text-slate-500">{t('condition')}:</span>
                <span className="text-slate-700 font-medium">{conditionLabel}</span>
              </div>

              {/* Posted date */}
              <div
                className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700">
                  {t('postedOn', { date: postedDate })}
                </span>
              </div>

              {/* View count */}
              <div
                className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Eye className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700">
                  {t('views', { count: listing.view_count })}
                </span>
              </div>

              {/* Favorite count */}
              <div
                className={`flex items-center gap-2 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <Heart className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700">
                  {listing.favorite_count} {tCommon('favorite')}
                </span>
              </div>
            </div>
          </div>

          {/* Similar listings */}
          <SimilarListings categoryId={listing.category_id} currentListingId={listing.id} locale={locale} />
        </div>

        {/* Seller sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <SellerCard seller={seller} locale={locale} />
        </div>
      </div>
    </div>
  );
};
