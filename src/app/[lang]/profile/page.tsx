import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { ProfilePage } from '@/components/auth/ProfilePage';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Profile({ params }: PageProps) {
  const { lang: locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProfilePage locale={locale as Locale} />
        </div>
      </main>
    </>
  );
}
