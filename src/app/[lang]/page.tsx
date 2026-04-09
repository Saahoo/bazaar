// src/app/[lang]/page.tsx
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategorySidebar } from '@/components/homepage/CategorySidebar';
import { FeaturedListings } from '@/components/homepage/FeaturedListings';
import { TrendingItems } from '@/components/homepage/TrendingItems';
import { MostWatched } from '@/components/homepage/MostWatched';
import { PopularInYourArea } from '@/components/homepage/PopularInYourArea';
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
          {/* Top banner */}
          <div className="mb-6">
            <HeroSection locale={locale as Locale} />
          </div>

          {/* Marketplace body */}
          <div className="flex flex-col lg:flex-row gap-5">
            <aside className="w-full lg:w-60 flex-shrink-0">
              <CategorySidebar locale={locale as Locale} />
            </aside>

            <section className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base md:text-lg font-semibold text-slate-900">
                  {locale === 'en' ? 'Homepage Showcase' : locale === 'ps' ? 'د کورپاڼې نندارتون' : 'ویترین صفحه اصلی'}
                </h2>
                <a
                  href={`/${locale}/search`}
                  className="text-xs md:text-sm text-primary-600 hover:text-primary-700"
                >
                  {locale === 'en' ? 'Show all showcase ads' : locale === 'ps' ? 'ټول اعلانونه وګورئ' : 'نمایش همه آگهی‌ها'}
                </a>
              </div>
              <FeaturedListings locale={locale as Locale} />
            </section>
          </div>

          {/* Trending Items */}
          <div className="mt-6">
            <TrendingItems locale={locale as Locale} />
          </div>

          {/* Most Watched */}
          <div className="mt-6">
            <MostWatched locale={locale as Locale} />
          </div>

          {/* Popular in Your Area */}
          <div className="mt-6">
            <PopularInYourArea locale={locale as Locale} />
          </div>
        </div>
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
