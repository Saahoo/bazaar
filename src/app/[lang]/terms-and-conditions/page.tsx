// src/app/[lang]/terms-and-conditions/page.tsx
import type { Metadata } from 'next';
import TermsAndConditionsPage from '@/components/terms/TermsAndConditionsPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface TermsAndConditionsPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'Terms & Conditions — Bazaar Marketplace',
  ps: 'شرایط او شرایط — بازار',
  fa: 'شرایط و ضوابط — بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: 'Read the official Terms & Conditions of Bazaar Marketplace. Understand user agreements, posting rules, prohibited items, payments, liability, termination, and governing law.',
  ps: 'د بازار بازار رسمي شرایط او شرایط ولولئ. د کاروونکي تړونونه، د پوسټ کولو قوانین، منع شوي توکي، تادیې، مسؤلیت، پای ته رسیدل، او حاکم قانون پوهیږئ.',
  fa: 'شرایط و ضوابط رسمی بازار را بخوانید. توافق‌نامه‌های کاربر، قوانین ارسال، موارد ممنوعه، پرداخت‌ها، مسئولیت، خاتمه و قانون حاکم را درک کنید.',
};

export async function generateMetadata({ params }: TermsAndConditionsPageProps): Promise<Metadata> {
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
        en: 'https://bazaar.com/en/terms-and-conditions',
        ps: 'https://bazaar.com/ps/terms-and-conditions',
        fa: 'https://bazaar.com/fa/terms-and-conditions',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function TermsAndConditionsRoute({ params }: TermsAndConditionsPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <TermsAndConditionsPage locale={locale as Locale} />
    </>
  );
}