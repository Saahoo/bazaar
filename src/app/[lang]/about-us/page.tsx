// src/app/[lang]/about-us/page.tsx
import type { Metadata } from 'next';
import { AboutUsPage } from '@/components/about/AboutUsPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface AboutUsPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'About Us — Bazaar Marketplace',
  ps: 'د بزار په اړه — بازار',
  fa: 'درباره ما — بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: 'Learn about Bazaar — Afghanistan\'s premier classifieds marketplace connecting buyers and sellers across the country with trust, speed, and simplicity.',
  ps: 'د بازار په اړه زده کړئ — افغانستان مخکښ طبقاتي بازار چې پلورونکي او پیرودونکي د باور، سرعت او سادګۍ سره نښلوي.',
  fa: 'درباره بازار بدانید — بازار طبقاتی برتر افغانستان که خریداران و فروشندگان را با اعتماد، سرعت و سادگی متصل می‌کند.',
};

export async function generateMetadata({ params }: AboutUsPageProps): Promise<Metadata> {
  const { lang: locale } = await params;

  return {
    title: META_TITLES[locale] || META_TITLES.en,
    description: META_DESCRIPTIONS[locale] || META_DESCRIPTIONS.en,
    openGraph: {
      title: META_TITLES[locale] || META_TITLES.en,
      description: META_DESCRIPTIONS[locale] || META_DESCRIPTIONS.en,
      type: 'website',
      siteName: 'Bazaar',
      locale: locale === 'ps' ? 'ps_AF' : locale === 'fa' ? 'fa_AF' : 'en_US',
    },
    alternates: {
      languages: {
        en: 'https://bazaar.com/en/about-us',
        ps: 'https://bazaar.com/ps/about-us',
        fa: 'https://bazaar.com/fa/about-us',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function AboutUsRoute({ params }: AboutUsPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <AboutUsPage locale={locale as Locale} />
    </>
  );
}
