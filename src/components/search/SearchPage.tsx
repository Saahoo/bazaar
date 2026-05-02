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
  SportsHobbyFilterState,
  EMPTY_SPORTS_HOBBY_FILTERS,
  AnimalsLivestockFilterState,
  EMPTY_ANIMALS_LIVESTOCK_FILTERS,
  FoodAgricultureFilterState,
  EMPTY_FOOD_AGRICULTURE_FILTERS,
  BooksEducationFilterState,
  EMPTY_BOOKS_EDUCATION_FILTERS,
  BabyKidsFilterState,
  EMPTY_BABY_KIDS_FILTERS,
  BusinessIndustryFilterState,
  EMPTY_BUSINESS_INDUSTRY_FILTERS,
  ShoppingGroceriesFilterState,
  EMPTY_SHOPPING_GROCERIES_FILTERS,
} from './FilterSidebar';

import { VehicleFilterState, EMPTY_VEHICLE_FILTERS } from './VehicleFilter';

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
  // Animals & Livestock-specific filter group
  const [animalsLivestockFilters, setAnimalsLivestockFilters] = useState<AnimalsLivestockFilterState>(EMPTY_ANIMALS_LIVESTOCK_FILTERS);
  // Food & Agriculture-specific filter group
  const [foodAgricultureFilters, setFoodAgricultureFilters] = useState<FoodAgricultureFilterState>(EMPTY_FOOD_AGRICULTURE_FILTERS);
  // Books & Education-specific filter group
  const [booksEducationFilters, setBooksEducationFilters] = useState<BooksEducationFilterState>(EMPTY_BOOKS_EDUCATION_FILTERS);
  // Baby & Kids-specific filter group
  const [babyKidsFilters, setBabyKidsFilters] = useState<BabyKidsFilterState>(EMPTY_BABY_KIDS_FILTERS);
  // Business & Industry-specific filter group
  const [businessIndustryFilters, setBusinessIndustryFilters] = useState<BusinessIndustryFilterState>(EMPTY_BUSINESS_INDUSTRY_FILTERS);
  // Shopping & Groceries-specific filter group
  const [shoppingGroceriesFilters, setShoppingGroceriesFilters] = useState<ShoppingGroceriesFilterState>(EMPTY_SHOPPING_GROCERIES_FILTERS);
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
      'services': 9,
      'animals-livestock': 10,
      'animalsandlivestock': 10,
      'food-agriculture': 11,
      'books-education': 12,
      'books-and-education': 12,
      'health-beauty': 13,
      'health-and-beauty': 13,
      'sports-hobby': 14,
      'sports-and-hobby': 14,
      'kids-baby': 15,
      'business-industry': 16,
      'shopping-groceries': 17,
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
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [electronicsSearchTick, setElectronicsSearchTick] = useState(0);
  const [fashionSearchTick, setFashionSearchTick] = useState(0);
  const [sparePartsSearchTick, setSparePartsSearchTick] = useState(0);
  const [healthBeautySearchTick, setHealthBeautySearchTick] = useState(0);
  const [homeFurnitureSearchTick, setHomeFurnitureSearchTick] = useState(0);
  const [jobsSearchTick, setJobsSearchTick] = useState(0);
  const [servicesSearchTick, setServicesSearchTick] = useState(0);
  const [sportsHobbySearchTick, setSportsHobbySearchTick] = useState(0);
  const [foodAgricultureSearchTick, setFoodAgricultureSearchTick] = useState(0);
  const [booksEducationSearchTick, setBooksEducationSearchTick] = useState(0);
  const [babyKidsSearchTick, setBabyKidsSearchTick] = useState(0);
  const [businessIndustrySearchTick, setBusinessIndustrySearchTick] = useState(0);
  const [shoppingGroceriesSearchTick, setShoppingGroceriesSearchTick] = useState(0);

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
  // Sports & Hobby-specific filter group
  const [sportsHobbyFilters, setSportsHobbyFilters] = useState<SportsHobbyFilterState>(EMPTY_SPORTS_HOBBY_FILTERS);
  // Food & Agriculture filter state is declared above near other category filters

  // Reset category-specific filters when leaving their category
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const correctedId = correctCategoryId(categoryId);
    if (correctedId !== 1) setVehicleFilters(EMPTY_VEHICLE_FILTERS);
    if (correctedId !== 2) setRealEstateFilters(EMPTY_REAL_ESTATE_FILTERS);
    if (correctedId !== 3) setElectronicsFilters(EMPTY_ELECTRONICS_FILTERS);
    if (correctedId !== 4) setFashionFilters(EMPTY_FASHION_FILTERS);
    if (correctedId !== 5) setSparePartsFilters(EMPTY_SPARE_PARTS_FILTERS);
    if (correctedId !== 10) setAnimalsLivestockFilters(EMPTY_ANIMALS_LIVESTOCK_FILTERS);
    if (correctedId !== 11) setFoodAgricultureFilters(EMPTY_FOOD_AGRICULTURE_FILTERS);
    if (correctedId !== 12) setBooksEducationFilters(EMPTY_BOOKS_EDUCATION_FILTERS);
    if (correctedId !== 15) setBabyKidsFilters(EMPTY_BABY_KIDS_FILTERS);
    if (correctedId !== 16) setBusinessIndustryFilters(EMPTY_BUSINESS_INDUSTRY_FILTERS);
    if (correctedId !== 17) setShoppingGroceriesFilters(EMPTY_SHOPPING_GROCERIES_FILTERS);
    if (correctedId !== 13) setHealthBeautyFilters(EMPTY_HEALTH_BEAUTY_FILTERS);
    if (correctedId !== 6) setHomeFurnitureFilters(EMPTY_HOME_FURNITURE_FILTERS);
    if (correctedId !== 8) setJobsFilters(EMPTY_JOBS_FILTERS);
    if (correctedId !== 9) setServicesFilters(EMPTY_SERVICES_FILTERS);
    if (correctedId !== 14) setSportsHobbyFilters(EMPTY_SPORTS_HOBBY_FILTERS);
  }, []);

  // Apply category ID correction for known wrong IDs in database
  const correctedSelectedCategory = correctCategoryId(selectedCategory);
  
  const isVehicles = correctedSelectedCategory === 1;
  const isRealEstate = correctedSelectedCategory === 2;
  const isElectronics = correctedSelectedCategory === 3;
  const isFashion = correctedSelectedCategory === 4;
  const isSpareParts = correctedSelectedCategory === 5;
  const isHomeFurniture = correctedSelectedCategory === 6;
  const isJobs = correctedSelectedCategory === 8;
  const isServices = correctedSelectedCategory === 9;
  const isAnimalsLivestock = correctedSelectedCategory === 10;
  const isFoodAgriculture = correctedSelectedCategory === 11;
  const isBooksEducation = correctedSelectedCategory === 12;
  const isHealthBeauty = correctedSelectedCategory === 13;
  const isSportsHobby = correctedSelectedCategory === 14;
  const isBabyKids = correctedSelectedCategory === 15;
  const isBusinessIndustry = correctedSelectedCategory === 16;
  const isShoppingGroceries = correctedSelectedCategory === 17;

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
            : isAnimalsLivestock
              ? animalsLivestockFilters.keywords
              : isFoodAgriculture
                ? foodAgricultureFilters.keywords
                : isBooksEducation
                  ? booksEducationFilters.keywords
                  : isBabyKids
                    ? babyKidsFilters.keywords
                    : isBusinessIndustry
                      ? businessIndustryFilters.keywords
                      : isShoppingGroceries
                        ? shoppingGroceriesFilters.keywords
                        : isHealthBeauty
                ? healthBeautyFilters.keywords
                : isHomeFurniture
                  ? homeFurnitureFilters.keywords
                : isJobs
                  ? jobsFilters.keywords
                : isServices
                  ? servicesFilters.keywords
                : isSportsHobby
                  ? sportsHobbyFilters.keywords
                : initialQuery)?.trim() || undefined,
        animalsLivestockFilters: isAnimalsLivestock ? {
          ...animalsLivestockFilters,
          quantity: animalsLivestockFilters.quantity ? Number(animalsLivestockFilters.quantity) : undefined,
          age: animalsLivestockFilters.age ? Number(animalsLivestockFilters.age) : undefined,
          price: animalsLivestockFilters.price ? Number(animalsLivestockFilters.price) : undefined,
        } : undefined,
        foodAgricultureFilters: isFoodAgriculture ? {
          ...foodAgricultureFilters,
          quantity: foodAgricultureFilters.quantity ? Number(foodAgricultureFilters.quantity) : undefined,
          price: foodAgricultureFilters.price ? Number(foodAgricultureFilters.price) : undefined,
          minOrder: foodAgricultureFilters.minOrder ? Number(foodAgricultureFilters.minOrder) : undefined,
        } : undefined,
        booksEducationFilters: isBooksEducation ? {
          ...booksEducationFilters,
          price: booksEducationFilters.price ? Number(booksEducationFilters.price) : undefined,
          publicationYear: booksEducationFilters.publicationYear ? Number(booksEducationFilters.publicationYear) : undefined,
          pages: booksEducationFilters.pages ? Number(booksEducationFilters.pages) : undefined,
          lessonsCount: booksEducationFilters.lessonsCount ? Number(booksEducationFilters.lessonsCount) : undefined,
          experienceYears: booksEducationFilters.experienceYears ? Number(booksEducationFilters.experienceYears) : undefined,
          quantity: booksEducationFilters.quantity ? Number(booksEducationFilters.quantity) : undefined,
        } : undefined,
        babyKidsFilters: isBabyKids ? {
          ...babyKidsFilters,
          price: babyKidsFilters.price ? Number(babyKidsFilters.price) : undefined,
        } : undefined,
        businessIndustryFilters: isBusinessIndustry ? {
          ...businessIndustryFilters,
          price: businessIndustryFilters.price ? Number(businessIndustryFilters.price) : undefined,
          quantity: businessIndustryFilters.quantity ? Number(businessIndustryFilters.quantity) : undefined,
          minOrder: businessIndustryFilters.minOrder ? Number(businessIndustryFilters.minOrder) : undefined,
          experienceYears: businessIndustryFilters.experienceYears ? Number(businessIndustryFilters.experienceYears) : undefined,
          teamSize: businessIndustryFilters.teamSize ? Number(businessIndustryFilters.teamSize) : undefined,
          productionCapacity: businessIndustryFilters.productionCapacity ? Number(businessIndustryFilters.productionCapacity) : undefined,
          leadTime: businessIndustryFilters.leadTime ? Number(businessIndustryFilters.leadTime) : undefined,
          yearOfManufacture: businessIndustryFilters.yearOfManufacture ? Number(businessIndustryFilters.yearOfManufacture) : undefined,
          operatingHours: businessIndustryFilters.operatingHours ? Number(businessIndustryFilters.operatingHours) : undefined,
          powerRating: businessIndustryFilters.powerRating ? Number(businessIndustryFilters.powerRating) : undefined,
        } : undefined,
        shoppingGroceriesFilters: isShoppingGroceries ? {
          ...shoppingGroceriesFilters,
          price: shoppingGroceriesFilters.price ? Number(shoppingGroceriesFilters.price) : undefined,
          quantity: shoppingGroceriesFilters.quantity ? Number(shoppingGroceriesFilters.quantity) : undefined,
          minOrder: shoppingGroceriesFilters.minOrder ? Number(shoppingGroceriesFilters.minOrder) : undefined,
        } : undefined,
    city: selectedCity || undefined,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
    sortBy: sortBy as 'newest' | 'oldest' | 'priceLow' | 'priceHigh',
    searchTick: electronicsSearchTick + fashionSearchTick + sparePartsSearchTick + healthBeautySearchTick + homeFurnitureSearchTick + jobsSearchTick + servicesSearchTick + sportsHobbySearchTick + foodAgricultureSearchTick + booksEducationSearchTick + babyKidsSearchTick + businessIndustrySearchTick + shoppingGroceriesSearchTick,
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
    sportsHobbyFilters: isSportsHobby ? {
      ...sportsHobbyFilters,
    } : undefined,
  }), [
    selectedCategory, initialQuery, selectedCity, priceMin, priceMax,
    selectedConditions, sortBy, isVehicles, isRealEstate, isElectronics, isFashion, isSpareParts, isHealthBeauty, isHomeFurniture, isJobs, isServices, isSportsHobby, isFoodAgriculture, isBooksEducation, isBabyKids, isBusinessIndustry, isShoppingGroceries, vehicleFilters, realEstateFilters, electronicsFilters, fashionFilters, sparePartsFilters, healthBeautyFilters, homeFurnitureFilters, jobsFilters, servicesFilters, sportsHobbyFilters, foodAgricultureFilters, booksEducationFilters, babyKidsFilters, businessIndustryFilters, shoppingGroceriesFilters, electronicsSearchTick, fashionSearchTick, sparePartsSearchTick, healthBeautySearchTick, homeFurnitureSearchTick, jobsSearchTick, servicesSearchTick, sportsHobbySearchTick, foodAgricultureSearchTick, booksEducationSearchTick, babyKidsSearchTick, businessIndustrySearchTick, shoppingGroceriesSearchTick,
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
    if (isSportsHobby) setSportsHobbySearchTick((value) => value + 1);
    if (isFoodAgriculture) setFoodAgricultureSearchTick((value) => value + 1);
    if (isBooksEducation) setBooksEducationSearchTick((value) => value + 1);
    if (isBabyKids) setBabyKidsSearchTick((value) => value + 1);
    if (isBusinessIndustry) setBusinessIndustrySearchTick((value) => value + 1);
    if (isShoppingGroceries) setShoppingGroceriesSearchTick((value) => value + 1);
  }, [isElectronics, isFashion, isHealthBeauty, isHomeFurniture, isSpareParts, isJobs, isServices, isSportsHobby, isFoodAgriculture, isBooksEducation, isBabyKids, isBusinessIndustry, isShoppingGroceries]);

  const activeFilterCount = useMemo(() => {
    return [correctedSelectedCategory, priceMin, priceMax, selectedCity]
      .filter(Boolean)
      .length + selectedConditions.length;
  }, [priceMax, priceMin, correctedSelectedCategory, selectedCity, selectedConditions.length]);

  const handleMobileApplyFilters = useCallback(() => {
    triggerCategorySearch();
    setMobileFiltersOpen(false);

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [triggerCategorySearch]);

  const filterSidebar = (
    <FilterSidebar
            animalsLivestockFilters={animalsLivestockFilters}
            onAnimalsLivestockFiltersChange={setAnimalsLivestockFilters}
            onAnimalsLivestockClear={() => {
              setAnimalsLivestockFilters(EMPTY_ANIMALS_LIVESTOCK_FILTERS);
              setPriceMin('');
              setPriceMax('');
              setSelectedCity('');
              setMobileFiltersOpen(false);
            }}
            onAnimalsLivestockSearch={() => {
              setMobileFiltersOpen(false);
            }}
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
      sportsHobbyFilters={sportsHobbyFilters}
      onSportsHobbyFiltersChange={setSportsHobbyFilters}
      onSportsHobbyClear={() => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setSportsHobbySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onSportsHobbySearch={() => {
        setSportsHobbySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      foodAgricultureFilters={foodAgricultureFilters}
      onFoodAgricultureFiltersChange={setFoodAgricultureFilters}
      onFoodAgricultureClear={() => {
        setFoodAgricultureFilters(EMPTY_FOOD_AGRICULTURE_FILTERS);
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setFoodAgricultureSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onFoodAgricultureSearch={() => {
        setFoodAgricultureSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      booksEducationFilters={booksEducationFilters}
      onBooksEducationFiltersChange={setBooksEducationFilters}
      onBooksEducationClear={() => {
        setBooksEducationFilters(EMPTY_BOOKS_EDUCATION_FILTERS);
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setBooksEducationSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onBooksEducationSearch={() => {
        setBooksEducationSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      babyKidsFilters={babyKidsFilters}
      onBabyKidsFiltersChange={setBabyKidsFilters}
      onBabyKidsClear={() => {
        setBabyKidsFilters(EMPTY_BABY_KIDS_FILTERS);
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setBabyKidsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onBabyKidsSearch={() => {
        setBabyKidsSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      businessIndustryFilters={businessIndustryFilters}
      onBusinessIndustryFiltersChange={setBusinessIndustryFilters}
      onBusinessIndustryClear={() => {
        setBusinessIndustryFilters(EMPTY_BUSINESS_INDUSTRY_FILTERS);
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setBusinessIndustrySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onBusinessIndustrySearch={() => {
        setBusinessIndustrySearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      shoppingGroceriesFilters={shoppingGroceriesFilters}
      onShoppingGroceriesFiltersChange={setShoppingGroceriesFilters}
      onShoppingGroceriesClear={() => {
        setShoppingGroceriesFilters(EMPTY_SHOPPING_GROCERIES_FILTERS);
        setPriceMin('');
        setPriceMax('');
        setSelectedCity('');
        setShoppingGroceriesSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
      onShoppingGroceriesSearch={() => {
        setShoppingGroceriesSearchTick((value) => value + 1);
        setMobileFiltersOpen(false);
      }}
    />
  );

  return (
    <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Mobile Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'mb-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-md backdrop-blur-md lg:hidden',
            isRtl && 'flex-row-reverse'
          )}
        >
          <motion.button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:from-primary-50 hover:to-white hover:text-primary-700 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filter')}
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-[10px] font-bold text-white shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
          <SortDropdown locale={locale} value={sortBy} onChange={setSortBy} />
        </motion.div>

        <div className={`flex gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Desktop Sidebar */}
          <aside className="sticky top-28 hidden h-fit w-72 flex-shrink-0 lg:block">
            {filterSidebar}
          </aside>

          {/* Results Area */}
          <div ref={resultsRef} className="flex-1 min-w-0">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'mb-5 overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white/80 px-5 py-4 shadow-md backdrop-blur-md md:px-6',
                isRtl && 'text-right'
              )}
            >
              <div className={cn('flex flex-wrap items-center justify-between gap-3', isRtl && 'flex-row-reverse')}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {locale === 'en' ? 'Search results' : locale === 'ps' ? 'د لټون پايلې' : 'نتایج جست‌وجو'}
                  </p>
                  <p className={`mt-1 text-sm font-medium text-slate-600 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {loading ? '...' : t('results', { count: listings.length })}
                  </p>
                </div>
                <div className="hidden lg:block">
                  <SortDropdown locale={locale} value={sortBy} onChange={setSortBy} />
                </div>
              </div>
            </motion.div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-red-50/50 px-5 py-4 text-sm text-red-700 shadow-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ListingCardSkeleton />
                  </motion.div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence>
                  {listings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
                      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ListingCard listing={listing} locale={locale} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white/80 p-12 text-center shadow-md backdrop-blur-md"
              >
                {/* Decorative blurs */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-500/5 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-500/5 blur-2xl" />

                <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-500 shadow-sm">
                  <SearchCheck className="h-9 w-9" />
                </div>
                <p className="relative text-lg font-bold text-slate-900">{t('noResults')}</p>
                <p className="relative mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                  {locale === 'en'
                    ? 'Try clearing a few filters or widening your search.'
                    : locale === 'ps'
                      ? 'ځينې فلټرونه پاک کړئ يا لټون پراخ کړئ.'
                      : 'چند فیلتر را حذف کنید یا جست‌وجو را گسترده‌تر کنید.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Filter Bottom Sheet */}
        <BottomSheet
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title={locale === 'en' ? 'Filters' : locale === 'ps' ? 'فلټرونه' : 'فیلترها'}
        >
          <div className="space-y-5">
            {filterSidebar}
            <motion.button
              type="button"
              onClick={handleMobileApplyFilters}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/35"
            >
              {tCommon('search')}
            </motion.button>
          </div>
        </BottomSheet>
      </div>
    </main>
  );
};
