'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

let channelCounter = 0;

export interface Listing {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: string;
  phone_visible: boolean;
  from_owner: boolean;
  urgent: boolean;
  negotiable: boolean;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  view_count: number;
  favorite_count: number;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  expires_at: string;
  updated_at: string;
  // Joined fields
  seller_name?: string;
  seller_avatar?: string | null;
  seller_phone?: string | null;
  photos?: string[];
}

export interface VehicleFilters {
  vehicleMake?: string;          // metadata.make
  vehicleModel?: string;         // metadata.model
  yearMin?: number;
  yearMax?: number;
  fuelTypes?: string[];          // metadata.engineType
  gearTypes?: string[];          // metadata.gearType
  bodyTypes?: string[];          // metadata.bodyType
  kmMin?: number;
  kmMax?: number;
  enginePowerRange?: string;     // bucket e.g. '51_75'
  engineCapacityRange?: string;  // bucket e.g. '1.3_1.6'
  vehicleColor?: string;         // metadata.color
  numberPlateCity?: string;      // metadata.numberPlateCity
  fromOwner?: boolean | null;    // from_owner column
  vehicleWheelDrive?: string;    // metadata.wheelDriveType
}

export interface RealEstateFilters {
  purpose?: string;
  propertyType?: string;
  areaGrossMin?: number;
  areaGrossMax?: number;
  areaNetMin?: number;
  areaNetMax?: number;
  rooms?: number;
  balcony?: number;
  buildingAge?: string;
}

export interface ElectronicsFilters {
  subcategory?: string;
  postedDate?: string;
  sellerType?: string;
  make?: string;
  model?: string;
  condition?: string;
  keywords?: string;
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface FashionFilters {
  subcategory?: string;
  postedDate?: string;
  sellerType?: string;
  keywords?: string;
  condition?: string;
  brand?: string;
  clothingType?: string;
  gender?: string;
  size?: string[];
  fitType?: string;
  color?: string[];
  material?: string;
  sleeveType?: string;
  pattern?: string;
  season?: string;
  occasion?: string;
  authenticity?: string;
  warranty?: string;
  tagsAvailable?: string;
  model?: string;
  shoeType?: string;
  originalBox?: string;
  usageType?: string;
  bagType?: string;
  closureType?: string;
  strapType?: string;
  waterproof?: string;
  type?: string;
  style?: string;
  displayType?: string;
  strapMaterial?: string;
  dialShape?: string;
  movement?: string;
  waterResistant?: string;
  stoneType?: string;
  certification?: string;
}

export interface SparePartsFilters {
  subcategory?: string;
  postedDate?: string;
  seller_type?: string;
  keyword?: string;
  condition?: string;
  brand?: string;
  make?: string;
  model?: string;
  year_from?: string;
  year_to?: string;
  engine_type?: string;
  transmission?: string;
  device_type?: string;
  compatible_brand?: string;
  compatible_model?: string;
  version_series?: string;
  part_name?: string;
  part_type?: string[];
  part_number?: string;
  oem_aftermarket?: string;
  material?: string;
  color?: string;
  weight_min?: string;
  weight_max?: string;
  dimension_length?: string;
  dimension_width?: string;
  dimension_height?: string;
  warranty?: string;
  availability?: string;
  placement?: string;
  mileage?: string;
  installation_type?: string;
  included_components?: string[];
  certification?: string;
  voltage?: string;
  power_rating?: string;
  connector_type?: string;
  compatibility_type?: string;
  safety_certification?: string;
  machine_type?: string;
  load_capacity?: string;
  operating_pressure?: string;
  temperature_range?: string;
  industrial_grade?: string;
  priceMin?: string;
  priceMax?: string;
  city?: string;
}

export interface ListingFilters {
  category?: number | null;
  query?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  conditions?: string[];
  wheelDriveType?: 'fwd' | 'rwd' | 'awd' | '4wd';
  sortBy?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'mostViewed' | 'mostFavorited';
  limit?: number;
  searchTick?: number;
  vehicleFilters?: VehicleFilters;
  realEstateFilters?: RealEstateFilters;
  electronicsFilters?: ElectronicsFilters;
  fashionFilters?: FashionFilters;
  sparePartsFilters?: SparePartsFilters;
}

// ─── Engine Power / Capacity helpers ────────────────────────────────────────

function matchEnginePower(raw: unknown, range: string): boolean {
  const hp = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''));
  if (isNaN(hp)) return false;
  switch (range) {
    case 'up_50':    return hp <= 50;
    case '51_75':    return hp > 50  && hp <= 75;
    case '76_100':   return hp > 75  && hp <= 100;
    case '101_150':  return hp > 100 && hp <= 150;
    case '151_200':  return hp > 150 && hp <= 200;
    case '201_300':  return hp > 200 && hp <= 300;
    case '300_plus': return hp > 300;
    default: return true;
  }
}

function matchEngineCapacity(raw: unknown, range: string): boolean {
  // stored as e.g. "2.0" liters
  const liters = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''));
  if (isNaN(liters)) return false;
  switch (range) {
    case 'up_1.3':  return liters <= 1.3;
    case '1.3_1.6': return liters > 1.3 && liters <= 1.6;
    case '1.6_2.0': return liters > 1.6 && liters <= 2.0;
    case '2.0_2.5': return liters > 2.0 && liters <= 2.5;
    case '2.5_3.0': return liters > 2.5 && liters <= 3.0;
    case '3.0_plus': return liters > 3.0;
    default: return true;
  }
}

function normalizeToken(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function matchesLooseToken(raw: unknown, selected: string): boolean {
  if (!selected) return true;
  const rawStr = String(raw ?? '');
  if (!rawStr) return false;
  if (rawStr === selected) return true;
  return normalizeToken(rawStr) === normalizeToken(selected);
}

function applyVehicleFilters(listings: Listing[], vf?: VehicleFilters): Listing[] {
  if (!vf) return listings;
  return listings.filter((l) => {
    const m = l.metadata as Record<string, unknown>;
    if (vf.vehicleMake && !matchesLooseToken(m.make, vf.vehicleMake)) return false;
    if (vf.vehicleModel && !matchesLooseToken(m.model, vf.vehicleModel)) return false;
    if (vf.vehicleColor   && m.color       !== vf.vehicleColor) return false;
    if (vf.vehicleWheelDrive && m.wheelDriveType !== vf.vehicleWheelDrive) return false;
    if (vf.numberPlateCity && m.numberPlateCity !== vf.numberPlateCity) return false;

    const year = Number(m.year);
    if (vf.yearMin && !isNaN(year) && year < vf.yearMin) return false;
    if (vf.yearMax && !isNaN(year) && year > vf.yearMax) return false;

    const km = Number(m.mileage);
    if (vf.kmMin !== undefined && !isNaN(km) && km < vf.kmMin) return false;
    if (vf.kmMax !== undefined && !isNaN(km) && km > vf.kmMax) return false;

    if (vf.fuelTypes && vf.fuelTypes.length > 0 && !vf.fuelTypes.includes(String(m.engineType ?? ''))) return false;
    if (vf.gearTypes && vf.gearTypes.length > 0 && !vf.gearTypes.includes(String(m.gearType ?? '')))  return false;
    if (vf.bodyTypes && vf.bodyTypes.length > 0 && !vf.bodyTypes.includes(String(m.bodyType ?? '')))  return false;

    if (vf.enginePowerRange    && !matchEnginePower(m.enginePower, vf.enginePowerRange))       return false;
    if (vf.engineCapacityRange && !matchEngineCapacity(m.engineSize, vf.engineCapacityRange))  return false;

    return true;
  });
}

function toNumberOrNaN(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function applyRealEstateFilters(listings: Listing[], rf?: RealEstateFilters): Listing[] {
  if (!rf) return listings;

  return listings.filter((l) => {
    const m = l.metadata as Record<string, unknown>;

    if (rf.purpose && String(m.purpose ?? '') !== rf.purpose) return false;
    if (rf.propertyType && String(m.propertyType ?? '') !== rf.propertyType) return false;

    const areaGross = toNumberOrNaN(m.areaGross);
    if (rf.areaGrossMin !== undefined && !isNaN(areaGross) && areaGross < rf.areaGrossMin) return false;
    if (rf.areaGrossMax !== undefined && !isNaN(areaGross) && areaGross > rf.areaGrossMax) return false;

    const areaNet = toNumberOrNaN(m.areaNet);
    if (rf.areaNetMin !== undefined && !isNaN(areaNet) && areaNet < rf.areaNetMin) return false;
    if (rf.areaNetMax !== undefined && !isNaN(areaNet) && areaNet > rf.areaNetMax) return false;

    const rooms = toNumberOrNaN(m.rooms);
    if (rf.rooms !== undefined && !isNaN(rooms) && rooms !== rf.rooms) return false;

    const balcony = toNumberOrNaN(m.balcony);
    if (rf.balcony !== undefined && !isNaN(balcony) && balcony !== rf.balcony) return false;

    if (rf.buildingAge && String(m.buildingAge ?? '') !== rf.buildingAge) return false;

    return true;
  });
}

function applyElectronicsFilters(listings: Listing[], ef?: ElectronicsFilters): Listing[] {
  if (!ef) return listings;

  const fieldMap: Record<string, string[]> = {
    make: ['make', 'brand'],
    model: ['model'],
    internalStorage: ['storage', 'internalStorage'],
    ram: ['ram'],
    batteryCapacity: ['batteryCapacity'],
    refreshRate: ['refreshRate'],
    cameraRearMp: ['cameraRearMp', 'rearCamera'],
    cameraFrontMp: ['cameraFrontMp', 'frontCamera'],
    supports5g: ['supports5g', 'fiveG'],
    dualSim: ['dualSim'],
    operatingSystem: ['operatingSystem', 'os'],
    color: ['color'],
    warranty: ['warranty'],
    accessoriesIncluded: ['accessoriesIncluded'],
    boxAvailable: ['boxAvailable'],
    resolution: ['resolution'],
    smartTv: ['smartTv'],
    panelType: ['panelType'],
    hdmiPorts: ['hdmiPorts'],
    wallMountIncluded: ['wallMountIncluded'],
    processor: ['processor', 'cpu'],
    storageType: ['storageType'],
    storageSize: ['storageSize'],
    gpu: ['gpu'],
    touchscreen: ['touchscreen'],
    batteryLife: ['batteryLife'],
    usageType: ['usageType'],
    keyboardBacklight: ['keyboardBacklight'],
    fingerprintSensor: ['fingerprintSensor'],
    formFactor: ['formFactor'],
    monitorIncluded: ['monitorIncluded'],
    keyboardMouseIncluded: ['keyboardMouseIncluded'],
    applianceType: ['applianceType'],
    energyRating: ['energyRating'],
    refrigeratorCapacityLiters: ['refrigeratorCapacityLiters'],
    refrigeratorType: ['refrigeratorType'],
    defrostType: ['defrostType'],
    refrigeratorInverter: ['refrigeratorInverter'],
    washingMachineType: ['washingMachineType'],
    washingMachineCapacityKg: ['washingMachineCapacityKg'],
    spinSpeed: ['spinSpeed'],
    washingMode: ['washingMode'],
    acType: ['acType'],
    acCapacity: ['acCapacity'],
    acInverter: ['acInverter'],
    coolingArea: ['coolingArea'],
    instrumentType: ['instrumentType'],
    acousticElectric: ['acousticElectric'],
    skillLevel: ['skillLevel'],
    deviceType: ['deviceType'],
    features: ['features'],
    screenSize: ['screenSize'],
  };

  return listings.filter((l) => {
    const m = l.metadata as Record<string, unknown>;
    const specs = (m.specs as Record<string, unknown>) ?? {};

    // subcategory is already filtered server-side; skip here to avoid double-filtering issues
    if (ef.condition && String(l.condition ?? '') !== ef.condition) return false;

    for (const [key, rawValue] of Object.entries(ef)) {
      if (
        rawValue === undefined ||
        rawValue === '' ||
        key === 'subcategory' ||
        key === 'condition' ||
        key === 'postedDate' ||
        key === 'sellerType' ||
        key === 'keywords'
      ) {
        continue;
      }

      const metadataKeys = fieldMap[key] || [key];
      // Electronics specs are stored under metadata.specs — check there first, then root
      const metadataValue = metadataKeys
        .map((k) => specs[k] ?? m[k])
        .find((v) => v !== undefined && v !== null && String(v).trim() !== '');

      if (Array.isArray(rawValue)) {
        if (rawValue.length === 0) continue;

        if (Array.isArray(metadataValue)) {
          const rawTokens = rawValue.map((v) => normalizeToken(v));
          const metaTokens = metadataValue.map((v) => normalizeToken(v));
          if (!rawTokens.some((token) => metaTokens.includes(token))) return false;
        } else {
          const token = normalizeToken(metadataValue);
          if (!rawValue.some((v) => normalizeToken(v) === token)) return false;
        }
      } else {
        if (!matchesLooseToken(metadataValue, String(rawValue))) return false;
      }
    }

    return true;
  });
}

function normalizeYesNo(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  return String(value ?? '').trim().toLowerCase();
}

function applyFashionFilters(listings: Listing[], ff?: FashionFilters): Listing[] {
  if (!ff) return listings;

  const skipFields = new Set(['subcategory', 'postedDate', 'sellerType', 'keywords', 'condition']);

  return listings.filter((l) => {
    const m = l.metadata as Record<string, unknown>;

    if (ff.condition && !matchesLooseToken(m.condition ?? l.condition, ff.condition)) return false;

    for (const [key, rawValue] of Object.entries(ff)) {
      if (skipFields.has(key) || rawValue === undefined || rawValue === '') continue;

      const metadataValue = m[key];

      if (Array.isArray(rawValue)) {
        if (rawValue.length === 0) continue;

        if (Array.isArray(metadataValue)) {
          const selectedTokens = rawValue.map((v) => normalizeToken(v));
          const metadataTokens = metadataValue.map((v) => normalizeToken(v));
          if (!selectedTokens.some((token) => metadataTokens.includes(token))) return false;
        } else {
          const metadataToken = normalizeToken(metadataValue);
          if (!rawValue.some((v) => normalizeToken(v) === metadataToken)) return false;
        }
        continue;
      }

      const selectedString = String(rawValue);
      if (selectedString === 'yes' || selectedString === 'no') {
        if (normalizeYesNo(metadataValue) !== selectedString) return false;
        continue;
      }

      if (!matchesLooseToken(metadataValue, selectedString)) return false;
    }

    return true;
  });
}

function applySparePartsFilters(listings: Listing[], sf?: SparePartsFilters): Listing[] {
  if (!sf) return listings;

  const skipFields = new Set(['subcategory', 'postedDate', 'seller_type', 'keyword', 'priceMin', 'priceMax', 'city']);

  return listings.filter((l) => {
    const m = l.metadata as Record<string, unknown>;

    if (sf.condition && !matchesLooseToken(m.condition ?? l.condition, sf.condition)) return false;

    if (sf.priceMin) {
      const min = Number(sf.priceMin);
      if (!Number.isNaN(min) && Number(l.price) < min) return false;
    }
    if (sf.priceMax) {
      const max = Number(sf.priceMax);
      if (!Number.isNaN(max) && Number(l.price) > max) return false;
    }
    if (sf.city && !matchesLooseToken(l.city, sf.city)) return false;

    const weightRaw = m.weight;
    const weight = typeof weightRaw === 'number' ? weightRaw : parseFloat(String(weightRaw ?? ''));
    if (sf.weight_min) {
      const min = Number(sf.weight_min);
      if (!Number.isNaN(min) && !Number.isNaN(weight) && weight < min) return false;
    }
    if (sf.weight_max) {
      const max = Number(sf.weight_max);
      if (!Number.isNaN(max) && !Number.isNaN(weight) && weight > max) return false;
    }

    for (const [key, rawValue] of Object.entries(sf)) {
      if (skipFields.has(key) || rawValue === undefined || rawValue === '') continue;

      const metadataValue = m[key];

      if (Array.isArray(rawValue)) {
        if (rawValue.length === 0) continue;

        if (Array.isArray(metadataValue)) {
          const selectedTokens = rawValue.map((v) => normalizeToken(v));
          const metadataTokens = metadataValue.map((v) => normalizeToken(v));
          if (!selectedTokens.some((token) => metadataTokens.includes(token))) return false;
        } else {
          const metadataToken = normalizeToken(metadataValue);
          if (!rawValue.some((v) => normalizeToken(v) === metadataToken)) return false;
        }
        continue;
      }

      const selectedString = String(rawValue);
      if (selectedString === 'yes' || selectedString === 'no') {
        if (normalizeYesNo(metadataValue) !== selectedString) return false;
        continue;
      }

      if (key === 'year_from') {
        const listingYear = Number(m.year_from);
        const fromYear = Number(selectedString);
        if (!Number.isNaN(fromYear) && !Number.isNaN(listingYear) && listingYear < fromYear) return false;
        continue;
      }
      if (key === 'year_to') {
        const listingYear = Number(m.year_to);
        const toYear = Number(selectedString);
        if (!Number.isNaN(toYear) && !Number.isNaN(listingYear) && listingYear > toYear) return false;
        continue;
      }

      if (!matchesLooseToken(metadataValue, selectedString)) return false;
    }

    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────

export function useListings(filters: ListingFilters = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  // Each hook instance gets its own unique channel name to avoid Supabase
  // "cannot add callbacks after subscribe()" errors when multiple instances coexist.
  const channelName = useRef(`realtime-listings-${++channelCounter}`).current;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles(display_name, avatar_url, phone),
          photos(photo_url, display_order)
        `)
        .eq('status', 'active')
        .is('deleted_at', null);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters.query) {
        const normalizedQuery = filters.query.trim().replace(/,/g, '');
        if (normalizedQuery.length > 0) {
          query = query.or(`title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`);
        }
      }
      if (filters.city) {
        query = query.ilike('city', filters.city);
      }
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters.conditions && filters.conditions.length > 0) {
        query = query.in('condition', filters.conditions);
      }
      if (filters.wheelDriveType) {
        query = query.contains('metadata', { wheelDriveType: filters.wheelDriveType });
      }
      if (filters.electronicsFilters?.subcategory) {
        query = query.contains('metadata', { subcategory: filters.electronicsFilters.subcategory });
      }
      if (filters.electronicsFilters?.sellerType === 'individual') {
        query = query.eq('from_owner', true);
      }
      if (filters.electronicsFilters?.sellerType === 'dealer') {
        query = query.eq('from_owner', false);
      }

      if (filters.electronicsFilters?.postedDate) {
        const now = new Date();
        const from = new Date(now);
        if (filters.electronicsFilters.postedDate === 'today') {
          from.setHours(0, 0, 0, 0);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.electronicsFilters.postedDate === 'last7') {
          from.setDate(now.getDate() - 7);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.electronicsFilters.postedDate === 'last30') {
          from.setDate(now.getDate() - 30);
          query = query.gte('created_at', from.toISOString());
        }
      }

      if (filters.fashionFilters?.subcategory) {
        query = query.contains('metadata', { subcategory: filters.fashionFilters.subcategory });
      }
      if (filters.fashionFilters?.sellerType === 'Individual') {
        query = query.eq('from_owner', true);
      }
      if (filters.fashionFilters?.sellerType === 'Dealer') {
        query = query.eq('from_owner', false);
      }
      if (filters.fashionFilters?.postedDate) {
        const now = new Date();
        const from = new Date(now);
        if (filters.fashionFilters.postedDate === 'today') {
          from.setHours(0, 0, 0, 0);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.fashionFilters.postedDate === 'last7') {
          from.setDate(now.getDate() - 7);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.fashionFilters.postedDate === 'last30') {
          from.setDate(now.getDate() - 30);
          query = query.gte('created_at', from.toISOString());
        }
      }

      if (filters.sparePartsFilters?.subcategory) {
        query = query.contains('metadata', { subcategory: filters.sparePartsFilters.subcategory });
      }
      if (filters.sparePartsFilters?.seller_type === 'Individual') {
        query = query.eq('from_owner', true);
      }
      if (filters.sparePartsFilters?.seller_type === 'Dealer') {
        query = query.eq('from_owner', false);
      }
      if (filters.sparePartsFilters?.postedDate) {
        const now = new Date();
        const from = new Date(now);
        if (filters.sparePartsFilters.postedDate === 'today') {
          from.setHours(0, 0, 0, 0);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.sparePartsFilters.postedDate === 'last7') {
          from.setDate(now.getDate() - 7);
          query = query.gte('created_at', from.toISOString());
        } else if (filters.sparePartsFilters.postedDate === 'last30') {
          from.setDate(now.getDate() - 30);
          query = query.gte('created_at', from.toISOString());
        }
      }

      // Vehicle-specific: fromOwner is a direct column
      const vf = filters.vehicleFilters;
      if (vf?.fromOwner !== undefined && vf?.fromOwner !== null) {
        query = query.eq('from_owner', vf.fromOwner);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'priceLow':
          query = query.order('price', { ascending: true });
          break;
        case 'priceHigh':
          query = query.order('price', { ascending: false });
          break;
        case 'mostViewed':
          query = query.order('view_count', { ascending: false });
          break;
        case 'mostFavorited':
          query = query.order('favorite_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data to flatten joined fields
      const transformed: Listing[] = (data || []).map((row: Record<string, unknown>) => {
        const profiles = row.profiles as { display_name: string; avatar_url: string | null; phone: string | null } | null;
        const photos = row.photos as { photo_url: string; display_order: number }[] | null;

        return {
          ...row,
          seller_name: profiles?.display_name || '',
          seller_avatar: profiles?.avatar_url || null,
          seller_phone: profiles?.phone || null,
          photos: (photos || [])
            .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
            .map((p: { photo_url: string }) => p.photo_url),
        } as Listing;
      });

      const vehicleFiltered = applyVehicleFilters(transformed, filters.vehicleFilters);
      const realEstateFiltered = applyRealEstateFilters(vehicleFiltered, filters.realEstateFilters);
      const electronicsFiltered = applyElectronicsFilters(realEstateFiltered, filters.electronicsFilters);
      const fashionFiltered = applyFashionFilters(electronicsFiltered, filters.fashionFilters);
      const sparePartsFiltered = applySparePartsFilters(fashionFiltered, filters.sparePartsFilters);
      setListings(sparePartsFiltered);
    } catch (err: unknown) {      const message = err instanceof Error ? err.message : 'Failed to load listings.';
      setError(message);
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    supabase,
    filters.category,
    filters.query,
    filters.city,
    filters.priceMin,
    filters.priceMax,
    filters.conditions,
    filters.wheelDriveType,
    filters.sortBy,
    filters.limit,
    filters.searchTick,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.vehicleFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.realEstateFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.electronicsFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.fashionFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.sparePartsFilters),
  ]);

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Real-time subscription for new/updated/deleted listings
  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        () => {
          // Re-fetch on any change to get properly joined data
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchListings]);

  return { listings, loading, error, refetch: fetchListings };
}
