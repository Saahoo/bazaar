// src/components/dashboard/MyFavoritesTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Locale } from '@/lib/i18n/config';
import { ListingCard } from '@/components/search/ListingCard';
import type { Listing } from '@/lib/hooks/useListings';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface MyFavoritesTabProps {
  locale: Locale;
}

interface FavoriteRow {
  listing: Record<string, unknown> | Record<string, unknown>[] | null;
}

export const MyFavoritesTab: React.FC<MyFavoritesTabProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const supabase = createClient();
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select(`
          listing:listings(
            *,
            profiles(display_name, avatar_url, phone),
            photos(photo_url, display_order)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const rows = ((data || []) as FavoriteRow[])
        .map((row) => (Array.isArray(row.listing) ? row.listing[0] : row.listing))
        .filter(Boolean)
        .map((listing) => {
          const current = listing as Record<string, unknown>;
          const profiles = current.profiles as { display_name: string; avatar_url: string | null; phone: string | null } | null;
          const photos = current.photos as { photo_url: string; display_order: number }[] | null;

          return {
            ...current,
            seller_name: profiles?.display_name || '',
            seller_avatar: profiles?.avatar_url || null,
            seller_phone: profiles?.phone || null,
            photos: (photos || [])
              .sort((a, b) => a.display_order - b.display_order)
              .map((photo) => photo.photo_url),
          } as Listing;
        });

      setFavoriteListings(rows as Listing[]);
      setLoading(false);
    };

    loadFavorites();
  }, [user, supabase]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">{tCommon('loading')}</div>;
  }

  if (favoriteListings.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>{t('myFavorites')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} locale={locale} />
      ))}
    </div>
  );
};
