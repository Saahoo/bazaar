// src/app/[lang]/dashboard/page.tsx
import { Header } from '@/components/layout/Header';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { Locale } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Dashboard({ params }: PageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50">
        <DashboardPage locale={locale as Locale} />
      </main>
    </>
  );
}
