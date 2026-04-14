'use client';

import React, { Suspense, lazy } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { PanelSkeleton } from '@/components/common/Skeleton';

const LazyPostAdWizard = lazy(async () => {
  const mod = await import('./PostAdWizard');
  return { default: mod.PostAdWizard };
});

export function PostAdWizardShell({ locale }: { locale: Locale }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <PanelSkeleton />
          <PanelSkeleton />
        </div>
      }
    >
      <LazyPostAdWizard locale={locale} />
    </Suspense>
  );
}