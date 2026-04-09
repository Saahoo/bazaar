// src/app/[lang]/search/page.tsx
import { Header } from '@/components/layout/Header';
import { SearchPage } from '@/components/search/SearchPage';
import { Locale } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function SearchRoute({ params, searchParams }: PageProps) {
  const { lang: locale } = await params;
  const { category, q } = await searchParams;

  return (
    <>
      <Header locale={locale as Locale} />
      <SearchPage locale={locale as Locale} initialCategory={category} initialQuery={q} />
    </>
  );
}
