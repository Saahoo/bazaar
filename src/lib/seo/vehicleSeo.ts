// src/lib/seo/vehicleSeo.ts
// Technical SEO best practices for vehicle listing details pages

import { Locale } from '@/lib/i18n/config';

export interface VehicleSeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredData: Record<string, unknown>;
  hreflang: Array<{lang: string, href: string}>;
  robots: string;
}

export interface VehicleListingData {
  id: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  make: string;
  model: string;
  condition: string;
  mileage?: number;
  location: string;
  category: string;
  description?: string;
  photos: string[];
}

// Generate locale-specific title
export const generateSeoTitle = (
  vehicle: VehicleListingData,
  locale: Locale
): string => {
  const { year, make, model, condition, price, currency, location } = vehicle;
  
  const currencySymbols: Record<string, string> = {
    USD: '$',
    AFN: '؋',
    IRR: '﷼',
    PKR: '₨',
  };
  
  const formattedPrice = `${currencySymbols[currency] || currency}${price.toLocaleString(locale === 'en' ? 'en-US' : 'fa-AF')}`;
  
  const titleTemplates: Record<Locale, string> = {
    en: `{year} {make} {model} - {condition} - {price} - {location} | Bazaar Vehicles`,
    ps: `{year} {make} {model} - {condition} - {price} - {location} | بازار موټرونه`,
    fa: `{year} {make} {model} - {condition} - {price} - {location} | بازار خودرو`,
  };
  
  const template = titleTemplates[locale] || titleTemplates.en;
  
  return template
    .replace('{year}', year.toString())
    .replace('{make}', make)
    .replace('{model}', model)
    .replace('{condition}', condition)
    .replace('{price}', formattedPrice)
    .replace('{location}', location);
};

// Generate locale-specific description
export const generateSeoDescription = (
  vehicle: VehicleListingData,
  locale: Locale
): string => {
  const { year, make, model, condition, mileage, description, location } = vehicle;
  
  const descriptionTemplates: Record<Locale, string> = {
    en: `Buy {year} {make} {model} in {condition} condition${mileage ? ` with ${mileage.toLocaleString('en-US')} miles` : ''}. Located in ${location}. ${description ? description.substring(0, 100) + '...' : 'Check out this vehicle listing on Bazaar.'}`,
    ps: `{year} {make} {model} په {condition} حالت کې واخلئ${mileage ? ` د ${mileage.toLocaleString('ps-AF')} مایلو سره` : ''}. په ${location} کې موقعیت لري. ${description ? description.substring(0, 100) + '...' : 'دا موټر په بازار کې وګورئ.'}`,
    fa: `خرید {year} {make} {model} در وضعیت {condition}${mileage ? ` با ${mileage.toLocaleString('fa-IR')} کیلومتر` : ''}. واقع در ${location}. ${description ? description.substring(0, 100) + '...' : 'این خودرو را در بازار مشاهده کنید.'}`,
  };
  
  const template = descriptionTemplates[locale] || descriptionTemplates.en;
  
  return template
    .replace('{year}', year.toString())
    .replace('{make}', make)
    .replace('{model}', model)
    .replace('{condition}', condition)
    .replace('{location}', location)
    .replace('{mileage}', mileage ? mileage.toLocaleString(locale === 'en' ? 'en-US' : locale === 'fa' ? 'fa-IR' : 'ps-AF') : '');
};

// Generate locale-specific keywords
export const generateSeoKeywords = (
  vehicle: VehicleListingData,
  locale: Locale
): string[] => {
  const { year, make, model, condition, location, category } = vehicle;
  
  const baseKeywords = [
    `${year} ${make} ${model}`,
    `${make} ${model}`,
    `${year} ${make}`,
    `${condition} vehicle`,
    `cars in ${location}`,
    `used cars ${location}`,
    `buy car ${location}`,
    category,
  ];
  
  const localeSpecificKeywords: Record<Locale, string[]> = {
    en: [
      'used cars for sale',
      'car dealership',
      'auto sales',
      'vehicle listing',
      'car prices',
      'car comparison',
    ],
    ps: [
      'کارې موټرونه',
      'د موټرونو خرڅلا',
      'موټر پلورنځی',
      'د موټر لیست',
      'د موټر قیمتونه',
      'د موټر پرتله',
    ],
    fa: [
      'خودروهای کارکرده',
      'فروش خودرو',
      'نمایشگاه خودرو',
      'لیست خودرو',
      'قیمت خودرو',
      'مقایسه خودرو',
    ],
  };
  
  return [...baseKeywords, ...(localeSpecificKeywords[locale] || localeSpecificKeywords.en)];
};

// Generate structured data (JSON-LD) for vehicle
export const generateStructuredData = (
  vehicle: VehicleListingData,
  locale: Locale
): Record<string, unknown> => {
  const { id, title, price, currency, year, make, model, condition, mileage, location, description, photos } = vehicle;
  
  // Map condition to schema.org condition
  const conditionMap: Record<string, string> = {
    new: 'https://schema.org/NewCondition',
    like_new: 'https://schema.org/UsedCondition',
    used: 'https://schema.org/UsedCondition',
    for_parts: 'https://schema.org/DamagedCondition',
  };
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': `https://bazaar.example.com/vehicles/${id}`,
    name: title,
    description: description || `${year} ${make} ${model} for sale`,
    image: photos.length > 0 ? photos[0] : '/placeholder-vehicle.jpg',
    brand: {
      '@type': 'Brand',
      name: make,
    },
    model: model,
    vehicleModelDate: `${year}-01-01`,
    vehicleIdentificationNumber: `VIN-${id}`,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: mileage || 0,
      unitCode: mileage ? 'MI' : 'KM',
    },
    vehicleTransmission: 'Automatic', // This should come from actual data
    fuelType: 'Gasoline', // This should come from actual data
    numberOfPreviousOwners: 1,
    vehicleInteriorColor: 'Black',
    vehicleExteriorColor: 'White',
    itemCondition: conditionMap[condition] || 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: `https://bazaar.example.com/${locale}/listing/${id}`,
    },
    seller: {
      '@type': 'Organization',
      name: 'Bazaar Marketplace',
    },
    areaServed: {
      '@type': 'Place',
      name: location,
    },
  };
  
  return structuredData;
};

// Generate hreflang tags for multi-language support
export const generateHreflangTags = (
  vehicleId: string,
  availableLocales: Locale[]
): Array<{lang: string, href: string}> => {
  const baseUrl = 'https://bazaar.example.com';
  
  return availableLocales.map(locale => ({
    lang: locale === 'en' ? 'en-US' : 
          locale === 'ps' ? 'ps-AF' : 
          'fa-IR',
    href: `${baseUrl}/${locale}/listing/${vehicleId}`,
  }));
};

// Generate complete SEO metadata for a vehicle listing
export const generateVehicleSeoMetadata = (
  vehicle: VehicleListingData,
  locale: Locale,
  availableLocales: Locale[] = ['en', 'ps', 'fa']
): VehicleSeoMetadata => {
  const baseUrl = 'https://bazaar.example.com';
  
  return {
    title: generateSeoTitle(vehicle, locale),
    description: generateSeoDescription(vehicle, locale),
    keywords: generateSeoKeywords(vehicle, locale),
    canonicalUrl: `${baseUrl}/${locale}/listing/${vehicle.id}`,
    ogImage: vehicle.photos.length > 0 ? vehicle.photos[0] : `${baseUrl}/og-vehicle-default.jpg`,
    structuredData: generateStructuredData(vehicle, locale),
    hreflang: generateHreflangTags(vehicle.id, availableLocales),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  };
};

// Generate meta tags array for Next.js Head component
export const generateMetaTags = (seoMetadata: VehicleSeoMetadata) => {
  const metaTags: Array<Record<string, string>> = [
    // Basic meta tags
    { name: 'description', content: seoMetadata.description },
    { name: 'keywords', content: seoMetadata.keywords.join(', ') },
    { name: 'robots', content: seoMetadata.robots },
    
    // Open Graph tags
    { property: 'og:title', content: seoMetadata.title },
    { property: 'og:description', content: seoMetadata.description },
    { property: 'og:image', content: seoMetadata.ogImage },
    { property: 'og:url', content: seoMetadata.canonicalUrl },
    { property: 'og:type', content: 'website' },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoMetadata.title },
    { name: 'twitter:description', content: seoMetadata.description },
    { name: 'twitter:image', content: seoMetadata.ogImage },
    
    // Canonical URL
    { rel: 'canonical', href: seoMetadata.canonicalUrl },
  ];
  
  // Add hreflang tags
  seoMetadata.hreflang.forEach(({ lang, href }) => {
    metaTags.push({ rel: 'alternate', 'hrefLang': lang, href });
  });
  
  // Add x-default hreflang
  metaTags.push({ rel: 'alternate', 'hrefLang': 'x-default', href: seoMetadata.canonicalUrl });
  
  return metaTags;
};

// Generate JSON-LD script for structured data
export const generateJsonLdScript = (structuredData: Record<string, unknown>): string => {
  return JSON.stringify(structuredData, null, 2);
};

// Check SEO health for a vehicle listing
export const checkSeoHealth = (vehicle: VehicleListingData, locale: Locale): Array<{issue: string, severity: 'high' | 'medium' | 'low', fix: string}> => {
  const issues: Array<{issue: string, severity: 'high' | 'medium' | 'low', fix: string}> = [];
  
  // Check title length
  const title = generateSeoTitle(vehicle, locale);
  if (title.length > 60) {
    issues.push({
      issue: 'Title too long',
      severity: 'medium',
      fix: `Reduce title length from ${title.length} to under 60 characters`,
    });
  }
  
  // Check description length
  const description = generateSeoDescription(vehicle, locale);
  if (description.length < 120) {
    issues.push({
      issue: 'Description too short',
      severity: 'medium',
      fix: `Increase description length from ${description.length} to at least 120 characters`,
    });
  } else if (description.length > 160) {
    issues.push({
      issue: 'Description too long',
      severity: 'low',
      fix: `Reduce description length from ${description.length} to under 160 characters`,
    });
  }
  
  // Check for images
  if (vehicle.photos.length === 0) {
    issues.push({
      issue: 'No images',
      severity: 'high',
      fix: 'Add at least one high-quality image of the vehicle',
    });
  }
  
  // Check description content
  if (!vehicle.description || vehicle.description.length < 50) {
    issues.push({
      issue: 'Insufficient description',
      severity: 'medium',
      fix: 'Add more detailed description about the vehicle condition, features, and history',
    });
  }
  
  return issues;
};

// Generate sitemap entry for vehicle listing
export const generateSitemapEntry = (
  vehicle: VehicleListingData,
  locale: Locale,
  lastmod: string = new Date().toISOString().split('T')[0]
): string => {
  const baseUrl = 'https://bazaar.example.com';
  const url = `${baseUrl}/${locale}/listing/${vehicle.id}`;
  
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
};