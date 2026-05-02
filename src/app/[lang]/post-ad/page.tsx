import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { PostAdWizardShell } from '@/components/post-ad/PostAdWizardShell';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function PostAdPage({ params }: PageProps) {
  const { lang: locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <PostAdWizardShell locale={locale as Locale} />
        </div>
      </main>
    </>
  );
}
