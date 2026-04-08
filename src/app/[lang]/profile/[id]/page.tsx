import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PublicProfilePage } from '@/components/profile/PublicProfilePage';
import { Locale, LOCALES } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/server';

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function PublicProfile({ params }: PageProps) {
  const { lang, id } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
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