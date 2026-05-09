// src/app/[lang]/help-center/page.tsx
import type { Metadata } from 'next';
import { HelpCenterPage } from '@/components/help-center/HelpCenterPage';
import { Header } from '@/components/layout/Header';
import { Locale, LOCALES } from '@/lib/i18n/config';

interface HelpCenterPageProps {
  params: Promise<{ lang: string }>;
}

const META_TITLES: Record<string, string> = {
  en: 'Help Center | Bazaar',
  ps: 'د مرستې مرکز | بازار',
  fa: 'مرکز کمک | بازار',
};

const META_DESCRIPTIONS: Record<string, string> = {
  en: 'Get help with Bazaar Marketplace. Find answers to frequently asked questions, learn how to post ads, browse & buy safely, manage your account, and contact support.',
  ps: 'په بازار مارکیټ پلیس کې مرسته ترلاسه کړئ. د ډیرو پوښتل شوو پوښتنو ځوابونه ومومئ، د اعلاناتو پوسټ کولو، خوندي پیرودلو او پلورلو، د خپل حساب مدیریت او د ملاتړ سره اړیکې لارې زده کړئ.',
  fa: 'در بازار مارکت‌پلیس کمک دریافت کنید. پاسخ به سوالات متداول، نحوه ارسال آگهی، مرور و خرید ایمن، مدیریت حساب و تماس با پشتیبانی را بیاموزید.',
};

export async function generateMetadata({ params }: HelpCenterPageProps): Promise<Metadata> {
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
        en: 'https://bazaar.com/en/help-center',
        ps: 'https://bazaar.com/ps/help-center',
        fa: 'https://bazaar.com/fa/help-center',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function HelpCenterRoute({ params }: HelpCenterPageProps) {
  const { lang: locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <HelpCenterPage locale={locale as Locale} />
    </>
  );
}