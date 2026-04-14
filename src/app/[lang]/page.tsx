// src/app/[lang]/page.tsx
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategoryGrid } from '@/components/homepage/CategoryGrid';
import { CategorySidebar } from '@/components/homepage/CategorySidebar';
import { FeaturedListings } from '@/components/homepage/FeaturedListings';
import { TrendingItems } from '@/components/homepage/TrendingItems';
import { MostWatched } from '@/components/homepage/MostWatched';
import { PopularInYourArea } from '@/components/homepage/PopularInYourArea';
import { Header } from '@/components/layout/Header';
import { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_HOMEPAGE_CONFIG, normalizeHomepageConfig, pickLocalized } from '@/lib/content/homepageSettings';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang: locale } = await params;
  const messages = await getMessages(locale as Locale);
  const supabase = await createClient();

  let homepageConfig = DEFAULT_HOMEPAGE_CONFIG;
  const { data: homepageSettings } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', 'homepage')
    .maybeSingle();

  if (homepageSettings?.setting_value) {
    homepageConfig = normalizeHomepageConfig(homepageSettings.setting_value);
  }

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
      <main className="marketplace-shell flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Top banner */}
          <div className="mb-6">
            <HeroSection locale={locale as Locale} config={homepageConfig.header} />
          </div>

          <div className="mb-6 lg:hidden">
            <CategoryGrid locale={locale as Locale} />
          </div>

          {/* Marketplace body */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {homepageConfig.blocks.categorySidebar.enabled && (
              <aside className="hidden w-full flex-shrink-0 lg:block lg:w-72">
                <CategorySidebar
                  locale={locale as Locale}
                  titleOverride={pickLocalized(homepageConfig.blocks.categorySidebar.title, locale as Locale)}
                />
              </aside>
            )}

            {homepageConfig.blocks.showcase.enabled && (
              <section className="flex-1 min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.06)] md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    {pickLocalized(homepageConfig.blocks.showcase.title, locale as Locale)}
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
            )}
          </div>

          {/* Trending Items */}
          {homepageConfig.blocks.trending.enabled && (
            <div className="mt-6">
              <TrendingItems
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.trending.title, locale as Locale)}
              />
            </div>
          )}

          {/* Most Watched */}
          {homepageConfig.blocks.mostWatched.enabled && (
            <div className="mt-6">
              <MostWatched
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.mostWatched.title, locale as Locale)}
              />
            </div>
          )}

          {/* Popular in Your Area */}
          {homepageConfig.blocks.popularArea.enabled && (
            <div className="mt-6">
              <PopularInYourArea
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.popularArea.title, locale as Locale)}
              />
            </div>
          )}
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
