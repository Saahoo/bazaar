import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { SignUpForm } from '@/components/auth/SignUpForm';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function SignUpPage({ params }: PageProps) {
  const { lang: locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <SignUpForm locale={locale as Locale} />
        </div>
      </main>
    </>
  );
}
