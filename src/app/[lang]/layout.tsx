// src/app/[lang]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { IntlProvider } from '@/components/providers/IntlProvider';
import { getDir, isRTL, LOCALES, Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/request';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ToastProvider } from '@/components/common/ToastProvider';
import { PageTransition } from '@/components/common/PageTransition';
import '@/styles/globals.css';
import '@/styles/rtl.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066FF',
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { lang: locale } = await params;

  const titles: Record<string, string> = {
    en: 'Bazaar - Buy & Sell Anything from Anyone',
    ps: 'Bazaar - اسانه چټک او دباور وړ',
    fa: 'Bazaar - آسان، سریع و قابل اعتماد',
  };

  const descriptions: Record<string, string> = {
    en: 'Premium classifieds marketplace for buying and selling anything from the owner.',
    ps: 'مستقیم د مالک څخه هر څه ته چي اړتیا لرئ واخلئ',
    fa: 'بازار طبقاتی برتر برای خرید و فروش هرچیز مستقیم از مالک',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    icons: {
      icon: '/favicon.ico',
    },
    metadataBase: new URL('https://bazaar.com'),
    alternates: {
      languages: {
        en: 'https://bazaar.com/en',
        ps: 'https://bazaar.com/ps',
        fa: 'https://bazaar.com/fa',
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang: locale } = await params;

  if (!LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;
  const dir = getDir(validLocale);
  const isRtl = isRTL(validLocale);

  const messages = await getMessages(validLocale);

  return (
    <html lang={locale} dir={dir} className={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className="text-slate-900 antialiased">
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <PageTransition>{children}</PageTransition>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
