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
      display_name: mockUser.display_name,
      phone: mockUser.phone,
      avatar_url: null,
      bio: mockUser.bio,
      city: null,
      district: null,
      address_line: null,
      profile_type: 'personal',
      age: null,
      sex: null,
      company_name: null,
      occupation: null,
      website: null,
      verified_phone: mockUser.verified,
      seller_rating: mockUser.rating,
      created_at: mockUser.member_since,
    };

    return (
      <>
        <Header locale={locale} />
        <main className="flex-1 bg-slate-50 py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <PublicProfilePage
              locale={locale}
              profile={mockProfile}
              stats={{
                activeListings: mockUser.listing_count,
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, phone, avatar_url, bio, city, district, address_line, profile_type, age, sex, company_name, occupation, website, verified_phone, seller_rating, created_at')
    .eq('id', id)
    .single();

  if (!profile) {
    notFound();
  }

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
      <main className="flex-1 bg-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <PublicProfilePage
            locale={locale}
            profile={profile}
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