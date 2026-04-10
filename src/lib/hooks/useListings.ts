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
  vehicleFilters?: VehicleFilters;
  realEstateFilters?: RealEstateFilters;
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
      setListings(realEstateFiltered);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.vehicleFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filters.realEstateFilters),
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
