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
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Hero banner */}
          <div className="mb-8">
            <HeroSection locale={locale as Locale} config={homepageConfig.header} />
          </div>

          {/* Mobile category grid */}
          <div className="mb-8 lg:hidden">
            <CategoryGrid locale={locale as Locale} />
          </div>

          {/* Marketplace body */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {homepageConfig.blocks.categorySidebar.enabled && (
              <aside className="hidden w-full flex-shrink-0 lg:block lg:w-72">
                <CategorySidebar
                  locale={locale as Locale}
                  titleOverride={pickLocalized(homepageConfig.blocks.categorySidebar.title, locale as Locale)}
                />
              </aside>
            )}

            {homepageConfig.blocks.showcase.enabled && (
              <section className="flex-1 min-w-0 rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-md md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base md:text-lg font-black tracking-tight text-slate-900">
                    {pickLocalized(homepageConfig.blocks.showcase.title, locale as Locale)}
                  </h2>
                  <a
                    href={`/${locale}/search`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-3.5 py-2 text-xs font-bold text-primary-600 transition-all duration-200 hover:bg-primary-100 hover:shadow-sm md:text-sm"
                  >
                    {locale === 'en' ? 'Show all' : locale === 'ps' ? 'ټول وګورئ' : 'نمایش همه'}
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                <FeaturedListings locale={locale as Locale} />
              </section>
            )}
          </div>

          {/* Trending Items */}
          {homepageConfig.blocks.trending.enabled && (
            <div className="mt-8">
              <TrendingItems
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.trending.title, locale as Locale)}
              />
            </div>
          )}

          {/* Most Watched */}
          {homepageConfig.blocks.mostWatched.enabled && (
            <div className="mt-8">
              <MostWatched
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.mostWatched.title, locale as Locale)}
              />
            </div>
          )}

          {/* Popular in Your Area */}
          {homepageConfig.blocks.popularArea.enabled && (
            <div className="mt-8">
              <PopularInYourArea
                locale={locale as Locale}
                titleOverride={pickLocalized(homepageConfig.blocks.popularArea.title, locale as Locale)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-slate-950 text-white py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(192,0,0,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_100%,rgba(255,124,0,0.06),transparent_60%)]" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-lg font-black text-white shadow-lg shadow-primary-500/20">
              B
            </div>
            <p className="text-center text-sm text-slate-400">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
