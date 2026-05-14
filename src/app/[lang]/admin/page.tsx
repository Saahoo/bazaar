import { notFound } from 'next/navigation';
import { Locale, LOCALES } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/server';
import { AdminPanel } from '@/components/admin/AdminPanel';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function AdminPage({ params }: PageProps) {
  const { lang } = await params;

  if (!LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || (profile.role as string) !== 'admin') {
    notFound();
  }

  // AdminPanel has its own sidebar layout, so no Header wrapper needed
  return <AdminPanel locale={locale} />;
}
