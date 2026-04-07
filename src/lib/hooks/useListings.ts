'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  photos?: string[];
}

export interface ListingFilters {
  category?: number | null;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  conditions?: string[];
  sortBy?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh';
  limit?: number;
}

export function useListings(filters: ListingFilters = {}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles(display_name, avatar_url),
          photos(photo_url, display_order)
        `)
        .eq('status', 'active')
        .is('deleted_at', null);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
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
        const profiles = row.profiles as { display_name: string; avatar_url: string | null } | null;
        const photos = row.photos as { photo_url: string; display_order: number }[] | null;

        return {
          ...row,
          seller_name: profiles?.display_name || '',
          seller_avatar: profiles?.avatar_url || null,
          photos: (photos || [])
            .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
            .map((p: { photo_url: string }) => p.photo_url),
        } as Listing;
      });

      setListings(transformed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load listings.';
      setError(message);
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    supabase,
    filters.category,
    filters.city,
    filters.priceMin,
    filters.priceMax,
    filters.conditions,
    filters.sortBy,
    filters.limit,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Real-time subscription for new/updated/deleted listings
  useEffect(() => {
    const channel = supabase
      .channel('realtime-listings')
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
