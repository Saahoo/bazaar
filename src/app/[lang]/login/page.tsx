import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { LoginForm } from '@/components/auth/LoginForm';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { lang: locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <LoginForm locale={locale as Locale} />
        </div>
      </main>
    </>
  );
}
