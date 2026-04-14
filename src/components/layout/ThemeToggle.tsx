'use client';

import React from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';

interface ThemeToggleProps {
  label?: string;
}

export function ThemeToggle({ label }: ThemeToggleProps) {
  const { mounted, theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label || 'Toggle theme'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
    >
      {!mounted ? (
        <SunMedium className="h-4 w-4" />
      ) : theme === 'dark' ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <MoonStar className="h-4 w-4" />
      )}
    </button>
  );
}