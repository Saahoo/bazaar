// src/components/listing/ListingDetail.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageIcon, MapPin, ShieldCheck, CalendarDays, Hash } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { formatCurrency } from '@/lib/constants/currencies';
import { getCityName } from '@/lib/constants/cities';
import { SellerCard } from './SellerCard';
import { ActionButtons } from './ActionButtons';
import { SimilarListings } from './SimilarListings';
import { ListingSpecsTable } from './ListingSpecsTable';

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
  price_history?: Array<{
    old_price: number;
    new_price: number;
    currency: string;
    change_type: 'increase' | 'decrease';
    reason_code?: string | null;
    changed_at: string;
  }>;
}

export interface SellerData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string;
  city?: string | null;
  bio?: string | null;
  profile_type?: string | null;
  company_name?: string | null;
  age?: number | null;
  sex?: string | null;
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
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);

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
  const visiblePhotos = listing.photos.slice(0, 12);
  const activePhoto = useMemo(() => {
    if (!hasPhotos) return null;
    return visiblePhotos[Math.min(activePhotoIndex, visiblePhotos.length - 1)] || visiblePhotos[0];
  }, [hasPhotos, visiblePhotos, activePhotoIndex]);

  const showPrevPhoto = () => {
    if (visiblePhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev - 1 + visiblePhotos.length) % visiblePhotos.length);
  };

  const showNextPhoto = () => {
    if (visiblePhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % visiblePhotos.length);
  };

  const priceHistory = listing.price_history || [];

  useEffect(() => {
    if (!isImageOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsImageOpen(false);
        return;
      }
      if (event.key === 'ArrowLeft') {
        showPrevPhoto();
        return;
      }
      if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isImageOpen, visiblePhotos.length]);

  const getReasonLabel = (reasonCode?: string | null) => {
    if (reasonCode === 'increase_price') {
      return locale === 'en' ? 'Price increased by seller' : locale === 'ps' ? 'بیه د پلورونکي لخوا زیاته شوې' : 'قیمت توسط فروشنده افزایش یافت';
    }
    if (reasonCode === 'decrease_price') {
      return locale === 'en' ? 'Price reduced by seller' : locale === 'ps' ? 'بیه د پلورونکي لخوا کمه شوې' : 'قیمت توسط فروشنده کاهش یافت';
    }
    return locale === 'en' ? 'Price updated' : locale === 'ps' ? 'بیه تازه شوه' : 'قیمت به‌روزرسانی شد';
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[1440px]">
      {listing.status === 'sold' && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-center">
          {t('soldOut')}
        </div>
      )}

      <h1 className={`text-2xl md:text-3xl font-bold text-slate-900 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        {title}
      </h1>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 mb-6">
        <div className={`grid grid-cols-1 xl:grid-cols-12 gap-5 ${isRtl ? 'xl:[direction:rtl]' : ''}`}>
          {/* Left: gallery */}
          <div className="xl:col-span-6">
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-[4/3]">
              {activePhoto ? (
                <button
                  type="button"
                  onClick={() => setIsImageOpen(true)}
                  className="w-full h-full"
                  aria-label={locale === 'en' ? 'Open image' : locale === 'ps' ? 'انځور خلاص کړئ' : 'باز کردن تصویر'}
                >
                  <img src={activePhoto} alt={title} className="w-full h-full object-cover" />
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-14 h-14 text-slate-300" />
                </div>
              )}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              {listing.photos.length > 0
                ? `${activePhotoIndex + 1} / ${listing.photos.length} ${locale === 'en' ? 'photos' : locale === 'ps' ? 'انځورونه' : 'عکس'}`
                : locale === 'en' ? 'No photos' : locale === 'ps' ? 'انځور نشته' : 'عکس موجود نیست'}
            </div>

            {visiblePhotos.length > 1 && (
              <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {visiblePhotos.map((photo, index) => (
                  <button
                    key={`${photo}-${index}`}
                    type="button"
                    onClick={() => setActivePhotoIndex(index)}
                    className={`aspect-[4/3] rounded-md overflow-hidden border-2 transition ${
                      activePhotoIndex === index
                        ? 'border-primary-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={photo} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: price + core specs */}
          <div className="xl:col-span-4">
            <div className="rounded-lg border border-slate-200 p-4 mb-4">
              <p className="text-3xl font-extrabold text-primary-700 leading-tight">
                {formatCurrency(listing.price, listing.currency)}
              </p>
              <div className={`mt-3 flex items-center gap-2 text-sm text-slate-600 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <MapPin className="w-4 h-4" />
                <span>{getCityName(listing.city, locale)}</span>
              </div>
              <div className={`mt-2 flex items-center gap-2 text-sm text-slate-600 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <CalendarDays className="w-4 h-4" />
                <span>{postedDate}</span>
              </div>
              <div className={`mt-2 flex items-center gap-2 text-sm text-slate-600 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <Hash className="w-4 h-4" />
                <span>#{listing.id.slice(0, 10)}</span>
              </div>
              <div className="mt-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${conditionColor}`}>
                  {conditionLabel}
                </span>
              </div>
            </div>

            {listing.metadata && Object.keys(listing.metadata).length > 0 && (
              <ListingSpecsTable
                metadata={listing.metadata}
                categoryId={listing.category_id}
                locale={locale}
              />
            )}

            <div className="rounded-lg border border-slate-200 p-3 mb-4">
              <ActionButtons
                locale={locale}
                listingId={listing.id}
                listingTitle={listing.title}
                sellerId={seller.id}
                sellerPhone={seller.phone}
                phoneVisible={listing.phone_visible}
              />
            </div>
          </div>

          {/* Right: seller + safety */}
          <div className="xl:col-span-2 space-y-4">
            <SellerCard seller={seller} locale={locale} />

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {locale === 'en' ? 'Safety Tips' : locale === 'ps' ? 'د خوندیتوب لارښوونې' : 'نکات ایمنی'}
                </h3>
              </div>
              <p className={`text-xs text-slate-600 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {locale === 'en'
                  ? "Don't send money before seeing the vehicle. Meet in a public place and verify documents."
                  : locale === 'ps'
                    ? 'د موټر تر لیدلو مخکې پیسې مه استوئ. په عامه ځای کې ملاقات وکړئ او اسناد تایید کړئ.'
                    : 'قبل از دیدن موتر پول ارسال نکنید. در مکان عمومی ملاقات کرده و اسناد را بررسی کنید.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description + history */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <h2 className={`text-lg font-semibold text-slate-900 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('description')}
        </h2>
        <p className={`text-slate-600 leading-relaxed whitespace-pre-line ${isRtl ? 'text-right' : 'text-left'}`}>
          {description}
        </p>

        {priceHistory.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className={`text-sm font-semibold text-slate-900 mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {locale === 'en' ? 'Price History' : locale === 'ps' ? 'د بیې تاریخچه' : 'تاریخچه قیمت'}
            </h3>
            <div className="space-y-2">
              {priceHistory.map((item, idx) => {
                const changeDate = new Date(item.changed_at).toLocaleDateString(
                  locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                );

                return (
                  <div
                    key={`${item.changed_at}-${idx}`}
                    className={`flex items-center justify-between gap-2 text-xs p-2.5 rounded-lg border ${
                      item.change_type === 'increase' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                    } ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium text-slate-800">
                        {formatCurrency(Number(item.old_price), item.currency)} {'->'} {formatCurrency(Number(item.new_price), item.currency)}
                      </p>
                      <p className="text-slate-500 mt-0.5">{getReasonLabel(item.reason_code)}</p>
                    </div>
                    <span className="text-slate-500 whitespace-nowrap">{changeDate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <SimilarListings categoryId={listing.category_id} currentListingId={listing.id} locale={locale} />

      {isImageOpen && activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 p-4 md:p-8 flex items-center justify-center"
          onClick={() => setIsImageOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'en' ? 'Image viewer' : locale === 'ps' ? 'د انځور لیدونکی' : 'نمایش تصویر'}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 hover:text-white text-3xl leading-none"
            aria-label={locale === 'en' ? 'Close image' : locale === 'ps' ? 'انځور بند کړئ' : 'بستن تصویر'}
          >
            ×
          </button>

          {visiblePhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevPhoto();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/45 hover:bg-black/60 text-white text-2xl leading-none flex items-center justify-center"
                aria-label={locale === 'en' ? 'Previous image' : locale === 'ps' ? 'مخکینی انځور' : 'تصویر قبلی'}
              >
                {isRtl ? '›' : '‹'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextPhoto();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/45 hover:bg-black/60 text-white text-2xl leading-none flex items-center justify-center"
                aria-label={locale === 'en' ? 'Next image' : locale === 'ps' ? 'راتلونکی انځور' : 'تصویر بعدی'}
              >
                {isRtl ? '‹' : '›'}
              </button>
            </>
          )}

          <img
            src={activePhoto}
            alt={title}
            className="max-w-full max-h-[90vh] object-contain rounded-md"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
