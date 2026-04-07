// src/app/[lang]/page.tsx
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategorySidebar } from '@/components/homepage/CategorySidebar';
import { FeaturedListings } from '@/components/homepage/FeaturedListings';
import { Header } from '@/components/layout/Header';
import { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/request';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang: locale } = await params;
  const messages = await getMessages(locale as Locale);
  const t = (key: string) => {
    const keys = key.split('.');
    let result: Record<string, unknown> = messages;
    for (const k of keys) {
      result = result[k] as Record<string, unknown>;
    }
    return result as unknown as string;
  };

  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-slate-50">
        <div className="container mx-auto px-4 py-6">
          {/* Top row: Sidebar + Hero banner */}
          <div className="flex gap-5">
            {/* Category Sidebar - hidden on mobile */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <CategorySidebar locale={locale as Locale} />
            </aside>

            {/* Hero banner */}
            <div className="flex-1 min-w-0">
              <HeroSection locale={locale as Locale} />
            </div>
          </div>

          {/* Listings section */}
          <div className="flex gap-5 mt-6">
            {/* Spacer for sidebar alignment on desktop */}
            <div className="hidden lg:block w-60 flex-shrink-0" />

            {/* Listings area */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  {t('homepage.featured')}
                </h2>
                <span className="text-xs text-slate-500">
                  {t('search.sortNewest')}
                </span>
              </div>

              <FeaturedListings locale={locale as Locale} />
            </div>
          </div>
        </div>

        {/* Popular Cities Section */}
        <section className="py-10 md:py-14 bg-white border-t border-slate-200 mt-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
              {t('homepage.cities')}
            </h2>
            <p className="text-slate-600 text-center">{t('homepage.popular')}</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-400">{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  );
}
