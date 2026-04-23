// src/components/search/SearchPage.tsx
'use client';

import React, { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchCheck, SlidersHorizontal } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useListings } from '@/lib/hooks/useListings';
import {
  FilterSidebar,
  VehicleFilterState,
  EMPTY_VEHICLE_FILTERS,
  RealEstateFilterState,
  EMPTY_REAL_ESTATE_FILTERS,
  ElectronicsFilterState,
  EMPTY_ELECTRONICS_FILTERS,
  FashionFilterState,
  EMPTY_FASHION_FILTERS,
  SparePartsFilterState,
  EMPTY_SPARE_PARTS_FILTERS,
  HealthBeautyFilterState,
  EMPTY_HEALTH_BEAUTY_FILTERS,
  HomeFurnitureFilterState,
  EMPTY_HOME_FURNITURE_FILTERS,
  JobsFilterState,
  EMPTY_JOBS_FILTERS,
  ServicesFilterState,
  EMPTY_SERVICES_FILTERS,
} from './FilterSidebar';
import { ListingCard } from './ListingCard';
import { SortDropdown } from './SortDropdown';
import { BottomSheet } from '@/components/common/BottomSheet';
import { ListingCardSkeleton } from '@/components/common/Skeleton';
import { cn } from '@/lib/utils/cn';

interface SearchPageProps {
  locale: Locale;
  initialCategory?: string;
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ locale, initialCategory, initialQuery }) => {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Helper to convert category parameter (could be slug or ID) to numeric ID
  const parseCategoryParam = (param: string | undefined): number | null => {
    if (!param) return null;
    
    // Try to parse as number first
    const asNumber = Number(param);
    if (!isNaN(asNumber)) return asNumber;
    
    // If not a number, try to match common slugs
    const slug = param.toLowerCase().trim();
    const slugToId: Record<string, number> = {
      'vehicles': 1,
      'real-estate': 2,
      'electronics': 3,
      'fashion': 4,
      'spare-parts': 5,
      'home-furniture': 6,
      'jobs': 8,
      'services': 9, // Database has Services as ID 9
      'health-beauty': 13,
      'health-and-beauty': 13,
    };
    
    return slugToId[slug] || null;
  };

  // Database has been fixed - IDs now match constants
  // No correction needed anymore
  const correctCategoryId = (categoryId: number | null): number | null => {
    return categoryId;
  };

  // Base filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    parseCategoryParam(initialCategory)
  );
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWheelDriveType, setSelectedWheelDriveType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [electronicsSearchTick, setElectronicsSearchTick] = useState(0);
  const [fashionSearchTick, setFashionSearchTick] = useState(0);
  const [sparePartsSearchTick, setSparePartsSearchTick] = useState(0);
  const [healthBeautySearchTick, setHealthBeautySearchTick] = useState(0);
  const [homeFurnitureSearchTick, setHomeFurnitureSearchTick] = useState(0);
  const [jobsSearchTick, setJobsSearchTick] = useState(0);
  const [servicesSearchTick, setServicesSearchTick] = useState(0);

  // Vehicle-specific filter group
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilterState>(EMPTY_VEHICLE_FILTERS);
  // Real estate-specific filter group
  const [realEstateFilters, setRealEstateFilters] = useState<RealEstateFilterState>(EMPTY_REAL_ESTATE_FILTERS);
  // Electronics-specific filter group
  const [electronicsFilters, setElectronicsFilters] = useState<ElectronicsFilterState>(EMPTY_ELECTRONICS_FILTERS);
  // Fashion-specific filter group
  const [fashionFilters, setFashionFilters] = useState<FashionFilterState>(EMPTY_FASHION_FILTERS);
  // Spare parts-specific filter group
  const [sparePartsFilters, setSparePartsFilters] = useState<SparePartsFilterState>(EMPTY_SPARE_PARTS_FILTERS);
  // Health & Beauty-specific filter group
  const [healthBeautyFilters, setHealthBeautyFilters] = useState<HealthBeautyFilterState>(EMPTY_HEALTH_BEAUTY_FILTERS);
  // Home & Furniture-specific filter group
  const [homeFurnitureFilters, setHomeFurnitureFilters] = useState<HomeFurnitureFilterState>(EMPTY_HOME_FURNITURE_FILTERS);
  // Jobs-specific filter group
  const [jobsFilters, setJobsFilters] = useState<JobsFilterState>(EMPTY_JOBS_FILTERS);
  // Services-specific filter group
  const [servicesFilters, setServicesFilters] = useState<ServicesFilterState>(EMPTY_SERVICES_FILTERS);

  // Reset category-specific filters when leaving their category
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const correctedId = correctCategoryId(categoryId);
    if (correctedId !== 1) setVehicleFilters(EMPTY_VEHICLE_FILTERS);
    if (correctedId !== 2) setRealEstateFilters(EMPTY_REAL_ESTATE_FILTERS);
    if (correctedId !== 3) setElectronicsFilters(EMPTY_ELECTRONICS_FILTERS);
    if (correctedId !== 4) setFashionFilters(EMPTY_FASHION_FILTERS);
    if (correctedId !== 5) setSparePartsFilters(EMPTY_SPARE_PARTS_FILTERS);
    if (correctedId !== 13) setHealthBeautyFilters(EMPTY_HEALTH_BEAUTY_FILTERS);
    if (correctedId !== 6) setHomeFurnitureFilters(EMPTY_HOME_FURNITURE_FILTERS);
    if (correctedId !== 8) setJobsFilters(EMPTY_JOBS_FILTERS);
    if (correctedId !== 9) setServicesFilters(EMPTY_SERVICES_FILTERS);
  }, []);

  // Apply category ID correction for known wrong IDs in database
  const correctedSelectedCategory = correctCategoryId(selectedCategory);
  
  const isVehicles = correctedSelectedCategory === 1;
  const isRealEstate = correctedSelectedCategory === 2;
  const isElectronics = correctedSelectedCategory === 3;
  const isFashion = correctedSelectedCategory === 4;
  const isSpareParts = correctedSelectedCategory === 5;
  const isHealthBeauty = correctedSelectedCategory === 13;
  const isHomeFurniture = correctedSelectedCategory === 6;
  const isJobs = correctedSelectedCategory === 8;
  const isServices = correctedSelectedCategory === 9;

  // Build filters for the hook
  // Use selectedCategory (database ID) for filtering, not correctedSelectedCategory (constant ID)
  const filters = useMemo(() => ({
    category: selectedCategory,
    query: (isVehicles
      ? vehicleFilters.keywords
      : isElectronics
        ? electronicsFilters.keywords
        : isFashion
          ? fashionFilters.keywords
          : isSpareParts
            ? sparePartsFilters.keyword
            : isHealthBeauty
              ? healthBeautyFilters.keywords
              : isHomeFurniture
                ? homeFurnitureFilters.keywords
              : isJobs
                ? jobsFilters.keywords
              : isServices
                ? servicesFilters.keywords
            : initialQuery)?.trim() || undefined,
    city: selectedCity || undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
    wheelDriveType: (!isVehicles && !isElectronics && selectedWheelDriveType) ? selectedWheelDriveType as 'fwd' | 'rwd' | 'awd' | '4wd' : undefined,
    sortBy: sortBy as 'newest' | 'oldest' | 'priceLow' | 'priceHigh',
    searchTick: electronicsSearchTick + fashionSearchTick + sparePartsSearchTick + healthBeautySearchTick + homeFurnitureSearchTick + jobsSearchTick + servicesSearchTick,
    vehicleFilters: isVehicles ? {
      vehicleMake: vehicleFilters.make || undefined,
      vehicleModel: vehicleFilters.model || undefined,
      yearMin: vehicleFilters.yearMin ? Number(vehicleFilters.yearMin) : undefined,
      yearMax: vehicleFilters.yearMax ? Number(vehicleFilters.yearMax) : undefined,
      fuelTypes: vehicleFilters.fuelTypes.length > 0 ? vehicleFilters.fuelTypes : undefined,
      gearTypes: vehicleFilters.gearTypes.length > 0 ? vehicleFilters.gearTypes : undefined,
      bodyTypes: vehicleFilters.bodyTypes.length > 0 ? vehicleFilters.bodyTypes : undefined,
      kmMin: vehicleFilters.kmMin ? Number(vehicleFilters.kmMin) : undefined,
      kmMax: vehicleFilters.kmMax ? Number(vehicleFilters.kmMax) : undefined,
      enginePowerRange: vehicleFilters.enginePowerRange || undefined,
      engineCapacityRange: vehicleFilters.engineCapacityRange || undefined,
      vehicleWheelDrive: vehicleFilters.wheelDrive || undefined,
      vehicleColor: vehicleFilters.color || undefined,
      numberPlateCity: vehicleFilters.numberPlateCity || undefined,
      fromOwner: vehicleFilters.fromOwner === 'true' ? true : vehicleFilters.fromOwner === 'false' ? false : null,
    } : undefined,
    realEstateFilters: isRealEstate ? {
      purpose: realEstateFilters.purpose || undefined,
      propertyType: realEstateFilters.propertyType || undefined,
      city: realEstateFilters.city || undefined,
      area: realEstateFilters.area || undefined,
      priceMin: realEstateFilters.priceMin ? Number(realEstateFilters.priceMin) : undefined,
      priceMax: realEstateFilters.priceMax ? Number(realEstateFilters.priceMax) : undefined,
      currency: realEstateFilters.currency || undefined,
      bedroomsMin: realEstateFilters.bedroomsMin ? Number(realEstateFilters.bedroomsMin) : undefined,
      bedroomsMax: realEstateFilters.bedroomsMax ? Number(realEstateFilters.bedroomsMax) : undefined,
      bathroomsMin: realEstateFilters.bathroomsMin ? Number(realEstateFilters.bathroomsMin) : undefined,
      bathroomsMax: realEstateFilters.bathroomsMax ? Number(realEstateFilters.bathroomsMax) : undefined,
      areaSizeMin: realEstateFilters.areaSizeMin ? Number(realEstateFilters.areaSizeMin) : undefined,
      areaSizeMax: realEstateFilters.areaSizeMax ? Number(realEstateFilters.areaSizeMax) : undefined,
      floorNumber: realEstateFilters.floorNumber ? Number(realEstateFilters.floorNumber) : undefined,
      yearBuiltMin: realEstateFilters.yearBuiltMin ? Number(realEstateFilters.yearBuiltMin) : undefined,
      yearBuiltMax: realEstateFilters.yearBuiltMax ? Number(realEstateFilters.yearBuiltMax) : undefined,
      parkingSpaces: realEstateFilters.parkingSpaces ? Number(realEstateFilters.parkingSpaces) : undefined,
      balcony: realEstateFilters.balcony === 'yes' ? true : realEstateFilters.balcony === 'no' ? false : undefined,
      elevator: realEstateFilters.elevator === 'yes' ? true : realEstateFilters.elevator === 'no' ? false : undefined,
      furnishing: realEstateFilters.furnishing || undefined,
      condition: realEstateFilters.condition || undefined,
      kitchenType: realEstateFilters.kitchenType || undefined,
      commercialType: realEstateFilters.commercialType || undefined,
      meetingRooms: realEstateFilters.meetingRooms ? Number(realEstateFilters.meetingRooms) : undefined,
      washrooms: realEstateFilters.washrooms ? Number(realEstateFilters.washrooms) : undefined,
      landType: realEstateFilters.landType || undefined,
      roadAccess: realEstateFilters.roadAccess === 'yes' ? true : realEstateFilters.roadAccess === 'no' ? false : undefined,
      cornerPlot: realEstateFilters.cornerPlot === 'yes' ? true : realEstateFilters.cornerPlot === 'no' ? false : undefined,
      industrialType: realEstateFilters.industrialType || undefined,
      ceilingHeight: realEstateFilters.ceilingHeight || undefined,
      loadingDocks: realEstateFilters.loadingDocks || undefined,
    } : undefined,
    electronicsFilters: isElectronics ? {
      ...electronicsFilters,
    } : undefined,
    fashionFilters: isFashion ? {
      ...fashionFilters,
    } : undefined,
    sparePartsFilters: isSpareParts ? {
      ...sparePartsFilters,
      priceMin: priceMin || undefined,
      priceMax: priceMax || undefined,
      city: selectedCity || undefined,
    } : undefined,
    healthBeautyFilters: isHealthBeauty ? {
      ...healthBeautyFilters,
    } : undefined,
    homeFurnitureFilters: isHomeFurniture ? {
      ...homeFurnitureFilters,
    } : undefined,
    jobsFilters: isJobs ? {
      ...jobsFilters,
    } : undefined,
    servicesFilters: isServices ? {
      ...servicesFilters,
    } : undefined,
  }), [
    selectedCategory, initialQuery, selectedCity, priceMin, priceMax,
    selectedConditions, selectedWheelDriveType, sortBy, isVehicles, isRealEstate, isElectronics, isFashion, isSpareParts, isHealthBeauty, isHomeFurniture, isJobs, isServices, vehicleFilters, realEstateFilters, electronicsFilters, fashionFilters, sparePartsFilters, healthBeautyFilters, homeFurnitureFilters, jobsFilters, servicesFilters, electronicsSearchTick, fashionSearchTick, sparePartsSearchTick, healthBeautySearchTick, homeFurnitureSearchTick, jobsSearchTick, servicesSearchTick,
  ]);

  const deferredFilters = useDeferredValue(filters);
  const { listings, loading, error } = useListings(deferredFilters);

  const triggerCategorySearch = useCallback(() => {
    if (isElectronics) setElectronicsSearchTick((value) => value + 1);
    if (isFashion) setFashionSearchTick((value) => value + 1);
    if (isSpareParts) setSparePartsSearchTick((value) => value + 1);
    if (isHealthBeauty) setHealthBeautySearchTick((value) => value + 1);
    if (isHomeFurniture) setHomeFurnitureSearchTick((value) => value + 1);
    if (isJobs) setJobsSearchTick((value) => value + 1);
    if (isServices) setServicesSearchTick((value) => value + 1);
  }, [isElectronics, isFashion, isHealthBeauty, isHomeFurniture, isSpareParts, isJobs, isServices]);

  const activeFilterCount = useMemo(() => {
    return [correctedSelectedCategory, priceMin, priceMax, selectedCity, selectedWheelDriveType]
      .filter(Boolean)
      .length + selectedConditions.length;
  }, [priceMax, priceMin, correctedSelectedCategory, selectedCity, selectedConditions.length, selectedWheelDriveType]);

  const handleMobileApplyFilters = useCallback(() => {
    triggerCategorySearch();
    setMobileFiltersOpen(false);

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [triggerCategorySearch]);

  const filterSidebar = (
    <FilterSidebar
      locale={locale}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      priceMin={priceMin}
      onPriceMinChange={setPriceMin}
      priceMax={priceMax}
      onPriceMaxChange={setPriceMax}
      selectedConditions={selectedConditions}
      onConditionsChange={setSelectedConditions}
      selectedCity={selectedCity}
      onCityChange={setSelectedCity}
      selectedWheelDriveType={selectedWheelDriveType}
      onWheelDriveTypeChange={setSelectedWheelDriveType}
      vehicleFilters={vehicleFilters}
      onVehicleFiltersChange={setVehicleFilters}
      realEstateFilters={realEstateFilters}
      onRealEstateFiltersChange={setRealEstateFilters}
      electronicsFilters={electronicsFilters}
      onElectronicsFiltersChange={setElectronicsFilters}
      fashionFilters={fashionFilters}
      onFashionFiltersChange={setFashionFilters}
      sparePartsFilters={sparePartsFilters}
      onSparePartsFiltersChange={setSparePartsFilters}
      onElectronicsClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setElectronicsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onElectronicsSearch={() => {
        setElectronicsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onFashionClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setFashionSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onFashionSearch={() => {
        setFashionSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onSparePartsClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setSparePartsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onSparePartsSearch={() => {
        setSparePartsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      healthBeautyFilters={healthBeautyFilters}
      onHealthBeautyFiltersChange={setHealthBeautyFilters}
      onHealthBeautyClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setHealthBeautySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onHealthBeautySearch={() => {
        setHealthBeautySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      homeFurnitureFilters={homeFurnitureFilters}
      onHomeFurnitureFiltersChange={setHomeFurnitureFilters}
      onHomeFurnitureClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setHomeFurnitureSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onHomeFurnitureSearch={() => {
        setHomeFurnitureSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      jobsFilters={jobsFilters}
      onJobsFiltersChange={setJobsFilters}
      onJobsClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setJobsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onJobsSearch={() => {
        setJobsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      servicesFilters={servicesFilters}
      onServicesFiltersChange={setServicesFilters}
      onServicesClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setServicesSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onServicesSearch={() => {
        setServicesSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
    />
  );

  return (
    <main className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className={cn('mb-4 flex items-center justify-between gap-3 rounded-[1.6rem] border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden', isRtl && 'flex-row-reverse')}>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filter')}
            {activeFilterCount > 0 && <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>}
          </button>
          <SortDropdown locale={locale} value={sortBy} onChange={setSortBy} />
        </div>

        <div className={`flex gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <aside className="sticky top-28 hidden h-fit w-72 flex-shrink-0 lg:block">
            {filterSidebar}
          </aside>

          <div ref={resultsRef} className="flex-1 min-w-0">
            <div className={cn('mb-4 rounded-[1.75rem] border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-5', isRtl && 'text-right')}>
              <div className={cn('flex flex-wrap items-center justify-between gap-3', isRtl && 'flex-row-reverse')}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {locale === 'en' ? 'Search results' : locale === 'ps' ? 'د لټون پايلې' : 'نتایج جست‌وجو'}
                  </p>
                  <p className={`mt-1 text-sm text-slate-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                {loading ? '...' : t('results', { count: listings.length })}
                  </p>
                </div>
                <div className="hidden lg:block">
                  <SortDropdown locale={locale} value={sortBy} onChange={setSortBy} />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListingCardSkeleton key={index} />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence>
                  {listings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: Math.min(index * 0.025, 0.15), duration: 0.22 }}
                    >
                      <ListingCard listing={listing} locale={locale} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <SearchCheck className="h-7 w-7" />
                </div>
                <p className="text-base font-semibold text-slate-900">{t('noResults')}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {locale === 'en'
                    ? 'Try clearing a few filters or widening your search.'
                    : locale === 'ps'
                      ? 'ځينې فلټرونه پاک کړئ يا لټون پراخ کړئ.'
                      : 'چند فیلتر را حذف کنید یا جست‌وجو را گسترده‌تر کنید.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <BottomSheet
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title={locale === 'en' ? 'Filters' : locale === 'ps' ? 'فلټرونه' : 'فیلترها'}
        >
          <div className="space-y-4">
            {filterSidebar}
            <button
              type="button"
              onClick={handleMobileApplyFilters}
              className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700"
            >
              {tCommon('search')}
            </button>
          </div>
        </BottomSheet>
      </div>
    </main>
  );
};
