// src/app/[lang]/safety-tips/page.tsx
import type { Metadata } from 'next';
import { SafetyTipsPage } from '@/components/safety/SafetyTipsPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface SafetyTipsPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'Safety Tips — Bazaar Marketplace',
  ps: 'د خوندیتوب لارښوونې — بازار',
  fa: 'نکات ایمنی — بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: 'Stay safe on Bazaar — learn how to protect yourself when buying and selling online. Tips for spotting scams, safe payments, meeting safely, and more.',
  ps: 'په بازار کې خوندي اوسئ — آنلاین پیرودلو او پلورلو کې د ځان ساتنې لارې زده کړئ. د درغلۍ پیژندلو، خوندي تادیې، خوندي کیدو او نورو لارښوونو.',
  fa: 'در بازار ایمن باشید — نحوه محافظت از خود هنگام خرید و فروش آنلاین را بیاموزید. نکاتی برای شناسایی کلاهبرداری، پرداخت ایمن، ملاقات ایمن و بیشتر.',
};

export async function generateMetadata({ params }: SafetyTipsPageProps): Promise<Metadata> {
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
        en: 'https://bazaar.com/en/safety-tips',
        ps: 'https://bazaar.com/ps/safety-tips',
        fa: 'https://bazaar.com/fa/safety-tips',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function SafetyTipsRoute({ params }: SafetyTipsPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <SafetyTipsPage locale={locale as Locale} />
    </>
  );
}
