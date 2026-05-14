// src/app/[lang]/privacy-policy/page.tsx
import type { Metadata } from 'next';
import PrivacyPolicyPage from '@/components/privacy/PrivacyPolicyPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface PrivacyPolicyPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'Privacy Policy — Bazaar Marketplace',
  ps: 'د محرمیت پالیسي — بازار',
  fa: 'سیاست حفظ حریم خصوصی — بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: 'Read the official Privacy Policy of Bazaar Marketplace. Learn how we collect, use, share, and protect your personal information, cookies, data security, and your rights.',
  ps: 'د بازار بازار رسمي محرمیت پالیسي ولولئ. زده کړئ چې موږ ستاسو شخصي معلومات څنګه راټولوو، کاروو، شریکوو، او ساتوو.',
  fa: 'سیاست حفظ حریم خصوصی رسمی بازار را بخوانید. نحوه جمع‌آوری، استفاده، اشتراک‌گذاری و محافظت از اطلاعات شخصی شما را بیاموزید.',
};

export async function generateMetadata({ params }: PrivacyPolicyPageProps): Promise<Metadata> {
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
        en: 'https://bazaar.com/en/privacy-policy',
        ps: 'https://bazaar.com/ps/privacy-policy',
        fa: 'https://bazaar.com/fa/privacy-policy',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function PrivacyPolicyRoute({ params }: PrivacyPolicyPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <PrivacyPolicyPage locale={locale as Locale} />
    </>
  );
}