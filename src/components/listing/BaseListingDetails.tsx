// src/components/listing/BaseListingDetails.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Eye, MapPin, Tag, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ListingCategory, BaseListingDetailsProps as GenericBaseListingDetailsProps } from './types';
import { ActionButtons } from './ActionButtons';
import { SellerCard } from './SellerCard';
import { PhotoLightbox } from './PhotoLightbox';
import { SimilarListingsCarousel } from './SimilarListingsCarousel';
import { getCategoryName } from '@/lib/constants/categories';
import { getFieldsForCategory } from '@/config/listingFields';
import {
  transformFieldsForDisplay,
  groupFieldsBySection,
  validateFieldMapping,
  MappedField,
} from '@/lib/listing/fieldMappingUtils';

// Re-export the generic props interface
export type BaseListingDetailsProps<T extends ListingCategory> = GenericBaseListingDetailsProps<T>;

// Helper function to format field values based on type
const formatFieldValue = (
  value: unknown,
  fieldType: string,
  locale: Locale,
  metadata?: Record<string, unknown>
): string | React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  // Helper function to get proper Intl locale string
  const getIntlLocale = (locale: Locale): string => {
    switch (locale) {
      case 'en': return 'en-US';
      case 'fa': return 'fa-IR';
      case 'ps': return 'ps-AF';
      default: return 'en-US';
    }
  };

  // Helper function to get date locale
  const getDateLocale = (locale: Locale): string => {
    switch (locale) {
      case 'en': return 'en-US';
      case 'fa': return 'fa-IR';
      case 'ps': return 'en-US'; // Pashto uses Gregorian calendar with English month names
      default: return 'en-US';
    }
  };

  // Helper function to get localized units
  const getLocalizedUnit = (unitType: 'area' | 'distance' | 'weight', locale: Locale): string => {
    switch (locale) {
      case 'fa':
        switch (unitType) {
          case 'area': return 'متر مربع';
          case 'distance': return 'کیلومتر';
          case 'weight': return 'کیلوگرم';
          default: return '';
        }
      case 'ps':
        switch (unitType) {
          case 'area': return 'متر مربع';
          case 'distance': return 'کیلومتر';
          case 'weight': return 'کیلوگرم';
          default: return '';
        }
      case 'en':
      default:
        switch (unitType) {
          case 'area': return 'm²';
          case 'distance': return 'km';
          case 'weight': return 'kg';
          default: return '';
        }
    }
  };

  switch (fieldType) {
    case 'currency':
      if (typeof value === 'number') {
        const currencyCode = typeof metadata?.currency === 'string' ? metadata.currency : 'USD';
        return new Intl.NumberFormat(getIntlLocale(locale), {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      }
      return String(value);
    
    case 'number':
      if (typeof value === 'number') {
        return new Intl.NumberFormat(getIntlLocale(locale)).format(value);
      }
      return String(value);
    
    case 'boolean':
      return value === true ? '✓' : '✗';
    
    case 'array':
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
    
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString(getDateLocale(locale), {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return String(value);
    
    case 'area':
      if (typeof value === 'number') {
        return `${new Intl.NumberFormat(getIntlLocale(locale)).format(value)} ${getLocalizedUnit('area', locale)}`;
      }
      return String(value);
    
    case 'distance':
      if (typeof value === 'number') {
        return `${new Intl.NumberFormat(getIntlLocale(locale)).format(value)} ${getLocalizedUnit('distance', locale)}`;
      }
      return String(value);
    
    case 'weight':
      if (typeof value === 'number') {
        return `${new Intl.NumberFormat(getIntlLocale(locale)).format(value)} ${getLocalizedUnit('weight', locale)}`;
      }
      return String(value);
    
    default:
      return String(value);
  }
};


// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl overflow-hidden">
          <div className="h-64 bg-slate-200" />
          <div className="p-4">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1 space-y-8">
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-slate-200 rounded w-full" />
            ))}
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const BaseListingDetails = <T extends ListingCategory>({
  listingData,
  sellerData,
  loading,
  locale,
}: BaseListingDetailsProps<T>) => {
  const t = useTranslations();
  const tListing = useTranslations('listing');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = listingData.photos?.length > 0 ? listingData.photos : ['/placeholder-image.jpg'];

  // Get category-specific fields using dynamic field mapping system
  const { specsFields, highlightsFields, detailsFields } = useMemo(() => {
    const allFields = getFieldsForCategory(listingData.category_id);
    
    // Transform fields for display using comprehensive mapping system
    const mappedFields = transformFieldsForDisplay(
      allFields,
      listingData as unknown as Record<string, unknown>,
      listingData.category_id,
      locale
    );
    
    // Group fields by display section
    const groupedFields = groupFieldsBySection(mappedFields);
    
    // Validate field mapping against original schema (development only)
    if (process.env.NODE_ENV === 'development') {
      const validation = validateFieldMapping(allFields, mappedFields);
      if (!validation.isValid) {
        console.warn('Field mapping validation errors:', validation.errors);
      }
    }
    
    return {
      specsFields: groupedFields.specs,
      highlightsFields: groupedFields.highlights,
      detailsFields: groupedFields.details,
    };
  }, [listingData, locale]);

  // Helper function to format field value with fallback
  const formatMappedFieldValue = (field: MappedField): string | React.ReactNode => {
    if (field.format) {
      return field.format(field.value, locale, listingData.metadata);
    }
    return formatFieldValue(field.value, field.type, locale, listingData.metadata);
  };

  // Helper function to get proper Intl locale string
  const getIntlLocale = useMemo(() => {
    return (locale: Locale): string => {
      switch (locale) {
        case 'en': return 'en-US';
        case 'fa': return 'fa-IR';
        case 'ps': return 'ps-AF';
        default: return 'en-US';
      }
    };
  }, []);

  // Helper function to get date locale
  const getDateLocale = useMemo(() => {
    return (locale: Locale): string => {
      switch (locale) {
        case 'en': return 'en-US';
        case 'fa': return 'fa-IR';
        case 'ps': return 'en-US'; // Pashto uses Gregorian calendar with English month names
        default: return 'en-US';
      }
    };
  }, []);

  // Formatting helpers
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat(getIntlLocale(locale), {
      style: 'currency',
      currency: listingData.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(listingData.price);
  }, [listingData.price, listingData.currency, locale, getIntlLocale]);

  const formattedCondition = useMemo(() => {
    const conditionMap: Record<string, string> = {
      new: tCommon('newCondition'),
      like_new: tCommon('likeNew'),
      used: tCommon('used'),
      for_parts: tCommon('forParts') || 'For Parts',
    };
    return conditionMap[listingData.condition] || listingData.condition;
  }, [listingData.condition, tCommon]);

  // Format created date with proper locale
  const formattedCreatedDate = useMemo(() => {
    return new Date(listingData.created_at).toLocaleDateString(getDateLocale(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [listingData.created_at, locale, getDateLocale]);

  const categoryName = useMemo(() => {
    return getCategoryName(listingData.category_id, locale);
  }, [listingData.category_id, locale]);

  // Navigation functions for image gallery
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Render loading state
  if (loading) {
    return <SkeletonLoader />;
  }

  // Render error state if no listing data
  if (!listingData) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {t('listingNotFound')}
        </h3>
        <p className="text-slate-600">
          {t('listingNotFoundDescription')}
        </p>
      </div>
    );
  }

  // Create metadata object for formatting functions
  const metadata = listingData as unknown as Record<string, unknown>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-slate-600">
        <span className="hover:text-blue-600 cursor-pointer">{tCommon('home')}</span>
        <span className="mx-2">›</span>
        <span className="hover:text-blue-600 cursor-pointer">{categoryName}</span>
        <span className="mx-2">›</span>
        <span className="font-medium text-slate-900">{listingData.title}</span>
      </div>

      {/* Photo Lightbox */}
      <PhotoLightbox
        images={images}
        initialIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - left column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl overflow-hidden">
            <div className="relative">
              <div className="relative h-96 bg-slate-100 cursor-zoom-in">
                {images.length > 0 ? (
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full h-full"
                    aria-label={tListing('openLightbox')}
                  >
                    <Image
                      src={images[currentImageIndex]}
                      alt={listingData.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      priority
                    />
                  </button>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Tag className="w-12 h-12 mx-auto mb-2" />
                      <p>{tListing('noImageAvailable')}</p>
                    </div>
                  </div>
                )}
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 shadow-lg transition-colors`}
                      aria-label={tListing('previousImage')}
                      title={tListing('previousImage')}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 shadow-lg transition-colors`}
                      aria-label={tListing('nextImage')}
                      title={tListing('nextImage')}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="p-4 border-t border-slate-100">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded border-2 ${currentImageIndex === idx ? 'border-blue-600' : 'border-transparent'}`}
                        aria-label={tListing('viewPhoto', { index: idx + 1 })}
                        title={tListing('viewPhoto', { index: idx + 1 })}
                      >
                        <div className="relative w-full h-full bg-slate-100">
                          <Image
                            src={img}
                            alt={`${listingData.title} - ${idx + 1}`}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Title & Metadata */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {listingData.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{listingData.city || ''}, {metadata.province as string || ''}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{tListing('views', { count: listingData.view_count || 0 })}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formattedCreatedDate}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                <span className="text-green-700">{formattedCondition}</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-700">
                {formattedPrice}
              </div>
              {metadata.is_negotiable as boolean && (
                <div className="text-sm text-slate-600 mt-1">
                  {tListing('priceNegotiable')}
                </div>
              )}
            </div>

            {/* Key Highlights */}
            {highlightsFields.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {tListing('keyHighlights')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlightsFields.map((field: MappedField) => {
                    const formattedValue = formatMappedFieldValue(field);
                    
                    return (
                      <div key={field.id} className="flex items-center p-3 bg-blue-50/60 rounded-xl backdrop-blur-sm border border-blue-100/60">
                        <div className="flex-1">
                          <div className="text-sm text-slate-600">
                            {t(field.labelKey)}
                          </div>
                          <div className="font-medium text-slate-900">
                            {formattedValue}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Specifications Table */}
          {specsFields.length > 0 && (
            <section className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {tListing('specifications')}
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200/60">
                <table className="w-full">
                  <tbody>
                    {specsFields.map((field: MappedField, index: number) => {
                      const formattedValue = formatMappedFieldValue(field);
                      
                      return (
                        <tr
                          key={field.id}
                          className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                        >
                          <td className={`px-4 py-3 text-slate-600 font-medium ${isRtl ? 'text-right' : 'text-left'} border-b border-slate-200`}>
                            {t(field.labelKey)}
                          </td>
                          <td className={`px-4 py-3 text-slate-900 ${isRtl ? 'text-right' : 'text-left'} border-b border-slate-200`}>
                            {formattedValue}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Description */}
          <section className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {tListing('description')}
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line text-slate-700">
                {listingData.description || tListing('noDescription')}
              </p>
            </div>
          </section>

          {/* Additional Details */}
          {detailsFields.length > 0 && (
            <section className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {tListing('additionalDetails')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detailsFields.map((field: MappedField) => {
                  const formattedValue = formatMappedFieldValue(field);
                  
                  return (
                    <div key={field.id} className="flex flex-col">
                      <div className="text-sm text-slate-600 mb-1">
                        {t(field.labelKey)}
                      </div>
                      <div className="font-medium text-slate-900">
                        {formattedValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Similar Listings Carousel */}
          <SimilarListingsCarousel
            categoryId={listingData.category_id}
            currentListingId={listingData.id.toString()}
            locale={locale}
          />
        </div>

        {/* Right sidebar - Seller Card, Action Buttons */}
        <div className="lg:col-span-1 space-y-8">
          {/* Seller Card */}
          <SellerCard seller={sellerData} locale={locale} />

          {/* Action Buttons */}
          <ActionButtons
            listingId={listingData.id.toString()}
            listingTitle={listingData.title}
            sellerId={sellerData.id.toString()}
            sellerPhone={sellerData.phone}
            phoneVisible={listingData.phone_visible}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
};
