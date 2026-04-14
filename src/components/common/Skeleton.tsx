'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]', className)}
      {...props}
    />
  );
}

export function ListingCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn('overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm', compact && 'rounded-xl')}>
      <Skeleton className={cn('aspect-[4/3] w-full rounded-none', compact && 'aspect-[5/4]')} />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}