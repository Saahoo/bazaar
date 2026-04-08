'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { POPULAR_CITIES } from '@/lib/constants/cities';

export interface ManagedCity {
  id?: number;
  name_en: string;
  name_ps?: string | null;
  name_fa?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  featured?: boolean;
  sort_order?: number;
}

const mapFallbackCities = (): ManagedCity[] =>
  POPULAR_CITIES.map((city, index) => ({
    name_en: city.name_en,
    name_ps: city.name_ps,
    name_fa: city.name_fa,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    featured: city.featured,
    sort_order: index + 1,
  }));

export const getManagedCityName = (city: ManagedCity, locale: Locale): string => {
  if (locale === 'ps') return city.name_ps || city.name_en;
  if (locale === 'fa') return city.name_fa || city.name_en;
  return city.name_en;
};

export const useCities = () => {
  const supabase = createClient();
  const [cities, setCities] = useState<ManagedCity[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadingCities(true);
      const { data, error } = await supabase
        .from('cities')
        .select('id, name_en, name_ps, name_fa, country, latitude, longitude, featured, sort_order')
        .order('sort_order', { ascending: true })
        .order('name_en', { ascending: true });

      if (!mounted) return;

      if (error || !data || data.length === 0) {
        setCities(mapFallbackCities());
      } else {
        setCities((data as ManagedCity[]) || []);
      }
      setLoadingCities(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return { cities, loadingCities, setCities };
};
