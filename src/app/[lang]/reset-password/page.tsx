import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang: locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <ResetPasswordForm locale={locale as Locale} />
        </div>
      </main>
    </>
  );
}
