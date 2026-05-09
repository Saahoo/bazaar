// src/app/[lang]/contact-us/page.tsx
import type { Metadata } from 'next';
import { ContactUsPage } from '@/components/contact/ContactUsPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface ContactUsPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'Contact Us — Bazaar Marketplace',
  ps: 'له موږ سره اړیکه — بازار',
  fa: 'تماس با ما — بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: "Get in touch with Bazaar — we're here to help. Send us a message, start a live chat, or visit our office.",
  ps: 'له بازار سره اړیکه ونیسئ — موږ دلته یو ستاسو د مرستې لپاره. موږ ته پیغام ولیکئ، ژوندی چت پیل کړئ، یا زموږ دفتر ته راځئ.',
  fa: 'با بازار تماس بگیرید — ما این هستیم تا کمک کنیم. برای ما پیام بفرستید، چت زنده شروع کنید، یا به دفتر ما بیایید.',
};

export async function generateMetadata({ params }: ContactUsPageProps): Promise<Metadata> {
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
        en: 'https://bazaar.com/en/contact-us',
        ps: 'https://bazaar.com/ps/contact-us',
        fa: 'https://bazaar.com/fa/contact-us',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function ContactUsRoute({ params }: ContactUsPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <ContactUsPage locale={locale as Locale} />
    </>
  );
}
