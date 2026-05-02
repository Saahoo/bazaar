import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PublicProfilePage } from '@/components/profile/PublicProfilePage';
import { Locale, LOCALES } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { getMockUser } from '@/lib/constants/mock-data';

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function PublicProfile({ params }: PageProps) {
  const { lang, id } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;

  /* ── Non-UUID: serve mock user ──────────────────────────────── */
  if (!UUID_PATTERN.test(id)) {
    const mockUser = getMockUser(id);
    if (!mockUser) notFound();

    const mockProfile = {
      id: mockUser.id,
      display_name: mockUser.display_name || mockUser.name,
      phone: mockUser.phone,
      avatar_url: null,
      bio: mockUser.bio || '',
      city: null,
      district: null,
      address_line: null,
      profile_type: 'personal',
      age: null,
      sex: null,
      company_name: null,
      occupation: null,
      website: null,
      verified_phone: mockUser.verified || false,
      seller_rating: mockUser.rating || 0,
      created_at: mockUser.member_since || new Date().toISOString(),
    };

    return (
      <>
        <Header locale={locale} />
        <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50 py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <PublicProfilePage
              locale={locale}
              profile={mockProfile}
              stats={{
                activeListings: mockUser.listing_count || 0,
                friends: 0,
                favoriteUsers: 0,
              }}
            />
          </div>
        </main>
      </>
    );
  }

  /* ── Real Supabase user ─────────────────────────────────────── */

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (profileError) {
    console.error('[profile/[id]] profile fetch error:', profileError.message);
  }

  if (!profile) {
    notFound();
  }

  // Map DB row to PublicProfileData — handles schemas with or without migration columns
  const profileData = {
    id: profile.id as string,
    display_name: (profile.display_name as string) || 'User',
    phone: (profile.phone as string) || null,
    avatar_url: (profile.avatar_url as string) || null,
    bio: (profile.bio as string) || null,
    city: (profile.city as string) || null,
    district: (profile.district as string) || null,
    address_line: (profile.address_line as string) || null,
    profile_type: (profile.profile_type as string) || 'personal',
    age: (profile.age as number) || null,
    sex: (profile.sex as string) || null,
    company_name: (profile.company_name as string) || null,
    occupation: (profile.occupation as string) || null,
    website: (profile.website as string) || null,
    verified_phone: (profile.verified_phone as boolean) || false,
    seller_rating: (profile.seller_rating as number) || null,
    created_at: profile.created_at as string,
  };

  const [{ count: activeListings }, { count: friends }, { count: favoriteUsers }] = await Promise.all([
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id)
      .eq('status', 'active')
      .is('deleted_at', null),
    supabase
      .from('user_relationships')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id)
      .eq('relation_type', 'friend'),
    supabase
      .from('user_relationships')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id)
      .eq('relation_type', 'favorite'),
  ]);

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <PublicProfilePage
            locale={locale}
            profile={profileData}
            stats={{
              activeListings: activeListings || 0,
              friends: friends || 0,
              favoriteUsers: favoriteUsers || 0,
            }}
          />
        </div>
      </main>
    </>
  );
}