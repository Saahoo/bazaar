// src/app/[lang]/not-found.tsx
export default function NotFound() {
  return (
    <main className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      </div>
    </main>
  );
}