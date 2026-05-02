import { Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { MessagesPage } from '@/components/chat/MessagesPage';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ conv?: string }>;
}

export default async function Messages({ params, searchParams }: PageProps) {
  const { lang: locale } = await params;
  const { conv } = await searchParams;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50">
        <MessagesPage locale={locale as Locale} conversationId={conv} />
      </main>
    </>
  );
}
