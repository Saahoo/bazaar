// src/app/[lang]/listing/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ListingDetails } from '@/components/listing/ListingDetails';
import { Locale, LOCALES } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { getMockListing, getMockUser, getListingTitle, getListingDescription } from '@/lib/constants/mock-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function ListingPage({ params }: PageProps) {
  const { lang, id } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const supabase = await createClient();

  if (!UUID_PATTERN.test(id)) {
    const mockListing = getMockListing(id);
    if (!mockListing) {
      notFound();
    }

    const mockSeller = getMockUser(mockListing.user_id);
    if (!mockSeller) {
      notFound();
    }

    const seller = {
      id: mockSeller.id,
      display_name: mockSeller.display_name || mockSeller.name,
      avatar_url: null,
      phone: mockSeller.phone,
      city: null,
      bio: mockSeller.bio || '',
      profile_type: 'personal',
      company_name: null,
      age: null,
      sex: null,
      verified: mockSeller.verified || false,
      rating: mockSeller.rating || 0,
      member_since: mockSeller.member_since || new Date().toISOString(),
    };

    const listingData = {
      id: mockListing.id,
      user_id: mockListing.user_id,
      category_id: mockListing.category_id,
      title: getListingTitle(mockListing, locale),
      description: getListingDescription(mockListing, locale),
      price: mockListing.price,
      currency: mockListing.currency,
      condition: mockListing.condition,
      city: mockListing.city || 'Unknown City',
      view_count: mockListing.view_count || 0,
      favorite_count: mockListing.favorite_count || 0,
      status: mockListing.status || 'active',
      phone_visible: true,
      from_owner: Boolean(mockListing.from_owner),
      created_at: mockListing.created_at,
      photos: mockListing.photos || [],
      metadata: {},
      price_history: [],
    };

    return (
      <>
        <Header locale={locale} />
        <main className="flex-1 bg-slate-50">
          <ListingDetails listing={listingData} seller={seller} locale={locale} />
        </main>
      </>
    );
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .is('deleted_at', null)
    .maybeSingle();

  if (!listing) {
    notFound();
  }

  const [{ data: profile, error: profileError }, { data: photos }, { data: priceHistory }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', listing.user_id)
      .maybeSingle(),
    supabase
      .from('photos')
      .select('photo_url, display_order')
      .eq('listing_id', id)
      .order('display_order', { ascending: true }),
    supabase
      .from('listing_price_history')
      .select('old_price, new_price, currency, change_type, reason_code, changed_at')
      .eq('listing_id', id)
      .order('changed_at', { ascending: false }),
  ]);

  if (profileError) {
    console.error('[listing/[id]] profile fetch error:', profileError.message);
  }

  const seller = {
    id: (profile?.id as string) || listing.user_id,
    display_name: (profile?.display_name as string) || 'Unknown Seller',
    avatar_url: (profile?.avatar_url as string) || null,
    phone: (profile?.phone as string) || '',
    city: (profile?.city as string) || '',
    bio: (profile?.bio as string) || '',
    profile_type: (profile?.profile_type as string) || 'personal',
    company_name: (profile?.company_name as string) || '',
    age: Number(profile?.age) || null,
    sex: (profile?.sex as string) || '',
    verified: (profile?.verified_phone as boolean) || false,
    rating: Number(profile?.seller_rating) || 0,
    member_since: (profile?.created_at as string) || listing.created_at,
  };

  const listingData = {
    ...listing,
    from_owner: Boolean((listing as { from_owner?: boolean | null }).from_owner),
    photos: (photos || []).map((p) => p.photo_url),
    price_history: priceHistory || [],
  };

  // Increment view count (fire and forget)
  supabase.rpc('increment_view_count', { listing_uuid: id }).then(() => {});

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 bg-slate-50">
        <ListingDetails listing={listingData} seller={seller} locale={locale} />
      </main>
    </>
  );
}
