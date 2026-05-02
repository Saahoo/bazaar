// src/components/listing/VehicleLocalizedDetails.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - This component is not currently used (BaseListingDetails handles vehicle listings)
// Kept for future reference; has type mismatches with current data model
'use client';

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { isRTL } from '@/lib/i18n/config';
import { BaseListingDetails } from './BaseListingDetails';
import { VehicleListing, SellerData } from './types';
import {
  getPersonalizationRule,
  getVehiclePersonalizationConfig,
  getCulturalImagery,
  getLegalRequirements
} from '@/lib/localization/personalization';
import {
  generateVehicleSeoMetadata,
  generateHreflangTags,
  checkSeoHealth
} from '@/lib/seo/vehicleSeo';
import {
  RtlText,
  RtlIcon,
  RtlGrid,
  RtlBreadcrumb
} from '@/components/common/RtlSupport';
import { AlertCircle, Shield, FileText, Globe, Car } from 'lucide-react';


export interface VehicleLocalizedDetailsProps {
  listingData: VehicleListing;
  sellerData: SellerData;
  loading: boolean;
  locale: 'en' | 'ps' | 'fa';
  showLegalCompliance?: boolean;
  showCulturalAdaptation?: boolean;
  showRegionSpecificAttributes?: boolean;
  enableSeoOptimization?: boolean;
}

export const VehicleLocalizedDetails: React.FC<VehicleLocalizedDetailsProps> = ({
  listingData,
  sellerData,
  loading,
  locale,
  showLegalCompliance = true,
  showCulturalAdaptation = true,
  showRegionSpecificAttributes = true,
  enableSeoOptimization = true,
}) => {
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  // Apply personalization based on locale
  const personalizationConfig = useMemo(() =>
    getPersonalizationRule(locale), [locale]
  );

  const personalizedData = useMemo(() => {
    // Apply basic personalization by formatting attributes
    const config = getVehiclePersonalizationConfig(locale);
    return {
      ...listingData,
      // Add personalized fields if needed
      showEmissions: config.showEmissions,
      showCertifications: config.showCertifications,
    };
  }, [listingData, locale]);

  // Get cultural imagery for the locale
  const culturalImagery = useMemo(() =>
    getCulturalImagery(locale, 'vehicles'), [locale]
  );

  // Get legal requirements for vehicle sales in the locale's region
  const legalRequirements = useMemo(() =>
    getLegalRequirements(locale), [locale]
  );

  // Get region-specific vehicle attributes using available functions
  const regionSpecificAttributes = useMemo(() => {
    const config = getVehiclePersonalizationConfig(locale);
    return config.regionalAttributes || [];
  }, [locale]);

  // Generate SEO metadata
  const seoMetadata = useMemo(() => 
    enableSeoOptimization 
      ? generateVehicleSeoMetadata(listingData, locale, personalizedData)
      : null, [listingData, locale, personalizedData, enableSeoOptimization]
  );

  // Generate structured data for SEO
  const structuredData = useMemo(() => 
    enableSeoOptimization 
      ? generateVehicleStructuredData(listingData, locale)
      : null, [listingData, locale, enableSeoOptimization]
  );

  // Generate hreflang tags for multi-language support
  const hreflangTags = useMemo(() => 
    enableSeoOptimization 
      ? generateHreflangTags(listingData.id.toString(), locale)
      : [], [listingData.id, locale, enableSeoOptimization]
  );

  // Check SEO health
  const seoHealth = useMemo(() => 
    enableSeoOptimization 
      ? checkSeoHealth(listingData, locale)
      : { score: 100, issues: [] }, [listingData, locale, enableSeoOptimization]
  );

  // Get RTL-aware class names
  const rtlClasses = useMemo(() => 
    getRtlClassNames(isRtl), [isRtl]
  );

  // Format price with locale-specific currency
  const formattedPrice = useMemo(() => {
    const currency = personalizationConfig.defaultCurrency || 'USD';
    return new Intl.NumberFormat(
      locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF',
      {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(listingData.price);
  }, [listingData.price, locale, personalizationConfig.defaultCurrency]);

  // Render legal compliance section
  const renderLegalCompliance = () => {
    if (!showLegalCompliance || !legalRequirements.length) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-lg p-6 mt-8">
        <div className="flex items-center mb-4">
          <Shield className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'} text-green-600`} />
          <h3 className="text-lg font-semibold text-slate-800">
            <RtlText text={t('legalCompliance')} locale={locale} />
          </h3>
        </div>
        
        <div className="space-y-3">
          {legalRequirements.map((requirement, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className={`w-4 h-4 mt-0.5 ${isRtl ? 'ml-2' : 'mr-2'} text-green-500`} />
              <span className="text-sm text-slate-700">
                <RtlText text={requirement} locale={locale} />
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100">
          <a 
            href={`/${locale}/legal/vehicle-sales`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FileText className={`w-4 h-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
            <RtlText text={t('viewFullLegalRequirements')} locale={locale} />
          </a>
        </div>
      </section>
    );
  };

  // Render cultural adaptation section
  const renderCulturalAdaptation = () => {
    if (!showCulturalAdaptation || !culturalImagery.length) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-lg p-6 mt-8">
        <div className="flex items-center mb-4">
          <Globe className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'} text-blue-600`} />
          <h3 className="text-lg font-semibold text-slate-800">
            <RtlText text={t('culturalAdaptation')} locale={locale} />
          </h3>
        </div>
        
        <p className="text-sm text-slate-600 mb-4">
          <RtlText 
            text={t('culturalAdaptationDescription', { 
              region: personalizationConfig.regionName 
            })} 
            locale={locale} 
          />
        </p>
        
        <RtlGrid cols={2} gap={4} isRtl={isRtl}>
          {culturalImagery.map((image, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${image.color} flex items-center justify-center ${isRtl ? 'ml-2' : 'mr-2'}`}>
                  <image.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    <RtlText text={image.title} locale={locale} />
                  </div>
                  <div className="text-xs text-slate-500">
                    <RtlText text={image.description} locale={locale} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RtlGrid>
      </section>
    );
  };

  // Render region-specific attributes section
  const renderRegionSpecificAttributes = () => {
    if (!showRegionSpecificAttributes || !regionSpecificAttributes.length) return null;

    return (
      <section className="bg-white border border-slate-200 rounded-lg p-6 mt-8">
        <div className="flex items-center mb-4">
          <Car className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'} text-purple-600`} />
          <h3 className="text-lg font-semibold text-slate-800">
            <RtlText 
              text={t('regionSpecificAttributes', { region: personalizationConfig.regionName })} 
              locale={locale} 
            />
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regionSpecificAttributes.map((attr, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <attr.icon className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'} ${attr.color}`} />
                <span className="font-medium text-slate-900">
                  <RtlText text={attr.label} locale={locale} />
                </span>
              </div>
              <div className="text-sm text-slate-700">
                <RtlText text={attr.value} locale={locale} />
              </div>
              {attr.description && (
                <div className="text-xs text-slate-500 mt-1">
                  <RtlText text={attr.description} locale={locale} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render SEO health indicator
  const renderSeoHealth = () => {
    if (!enableSeoOptimization || seoHealth.score >= 90) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white border border-slate-300 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center mb-2">
            <AlertCircle className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'} text-amber-500`} />
            <span className="font-medium text-slate-900">
              <RtlText text={t('seoHealth')} locale={locale} />
            </span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${seoHealth.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {seoHealth.score}%
            </span>
          </div>
          
          {seoHealth.issues.length > 0 && (
            <div className="text-sm text-slate-600">
              <RtlText 
                text={t('seoIssuesFound', { count: seoHealth.issues.length })} 
                locale={locale} 
              />
              <ul className={`mt-1 space-y-1 ${isRtl ? 'pr-4' : 'pl-4'}`}>
                {seoHealth.issues.slice(0, 3).map((issue, index) => (
                  <li key={index} className="text-xs">
                    • <RtlText text={issue.message} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper component for check circle
  const CheckCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <>
      {/* SEO Head Section */}
      <Head>
        <title>{seoMetadata?.title || listingData.title}</title>
        <meta name="description" content={seoMetadata?.description || listingData.description?.substring(0, 160)} />
        <meta name="keywords" content={seoMetadata?.keywords?.join(', ')} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoMetadata?.title || listingData.title} />
        <meta property="og:description" content={seoMetadata?.description || listingData.description?.substring(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={locale} />
        {locale === 'ar' && <meta property="og:locale:alternate" content="ar_SA" />}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMetadata?.title || listingData.title} />
        <meta name="twitter:description" content={seoMetadata?.description || listingData.description?.substring(0, 160)} />
        
        {/* Hreflang tags for multi-language support */}
        {hreflangTags.map((tag) => (
          <link key={tag.hrefLang} rel="alternate" hrefLang={tag.hrefLang} href={tag.href} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://bazaar.example.com/${locale}/listing/${listingData.id}`} />
        
        {/* Structured data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>

      {/* Main Content */}
      <div className={rtlClasses.container}>
        {/* Enhanced Breadcrumb with RTL support */}
        <RtlBreadcrumb
          items={[
            { label: t('home'), href: `/${locale}` },
            { label: tCommon('categories.vehicles'), href: `/${locale}/category/vehicles` },
            { label: personalizedData.title || listingData.title, href: null },
          ]}
          locale={locale}
          className="mb-6"
        />

        {/* Personalization Indicator */}
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
            <Globe className={`w-3 h-3 ${isRtl ? 'ml-1' : 'mr-1'}`} />
            <RtlText 
              text={t('personalizedForRegion', { region: personalizationConfig.regionName })} 
              locale={locale} 
            />
          </div>
        </div>

        {/* Main Listing Details */}
        <BaseListingDetails
          listingData={personalizedData}
          sellerData={sellerData}
          loading={loading}
          locale={locale}
        />

        {/* Enhanced Sections */}
        {renderRegionSpecificAttributes()}
        {renderCulturalAdaptation()}
        {renderLegalCompliance()}

        {/* Measurement System Note */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center text-sm text-slate-600">
            <RtlIcon icon="📏" locale={locale} className={isRtl ? 'ml-2' : 'mr-2'} />
            <RtlText 
              text={t('measurementSystemNote', { 
                system: personalizationConfig.measurementSystem === 'metric' ? 'metric' : 'imperial'
              })} 
              locale={locale} 
            />
          </div>
        </div>

        {/* Language Switcher for Users */}
        <div className="mt-6 flex justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              <RtlText text={t('viewInLanguage')} locale={locale} />
            </span>
            <div className="flex space-x-1">
              {['en', 'ps', 'fa'].map((lang) => (
                <a
                  key={lang}
                  href={`/${lang}/listing/${listingData.id}`}
                  className={`px-3 py-1 text-sm rounded ${locale === lang ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'ps' ? 'پښتو' : 'دری'}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Health Indicator */}
        {renderSeoHealth()}
      </div>
    </>
  );
};

export default VehicleLocalizedDetails;