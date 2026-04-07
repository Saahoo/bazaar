// src/app/[lang]/listing/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ListingDetail } from '@/components/listing/ListingDetail';
import { Locale, LOCALES } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function ListingPage({ params }: PageProps) {
  const { lang, id } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const supabase = await createClient();

  // Fetch listing with seller profile and photos
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      profiles(id, display_name, avatar_url, phone, verified_phone, is_seller, seller_rating, seller_badge, created_at),
      photos(photo_url, display_order)
    `)
    .eq('id', id)
    .single();

  if (!listing) {
    notFound();
  }

  // Flatten joined data
  const profile = listing.profiles as Record<string, unknown> | null;
  const photos = (listing.photos as { photo_url: string; display_order: number }[] | null) || [];

  const seller = {
    id: (profile?.id as string) || listing.user_id,
    display_name: (profile?.display_name as string) || '',
    avatar_url: (profile?.avatar_url as string) || null,
    phone: (profile?.phone as string) || '',
    verified: (profile?.verified_phone as boolean) || false,
    rating: Number(profile?.seller_rating) || 0,
    member_since: (profile?.created_at as string) || listing.created_at,
  };

  const listingData = {
    ...listing,
    photos: photos
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => p.photo_url),
  };

  // Increment view count (fire and forget)
  supabase.rpc('increment_view_count', { listing_uuid: id }).then(() => {});

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 bg-slate-50">
        <ListingDetail listing={listingData} seller={seller} locale={locale} />
      </main>
    </>
  );
}
