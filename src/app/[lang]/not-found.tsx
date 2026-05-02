// src/app/[lang]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[50vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-50 via-white/30 to-slate-50">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 px-10 py-12 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
          <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}