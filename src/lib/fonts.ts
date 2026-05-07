// src/lib/fonts.ts
// Centralized font configuration using next/font for optimal loading
// Replaces the render-blocking @import in globals.css

import { Inter } from 'next/font/google';
import { Noto_Sans_Arabic } from 'next/font/google';

// Inter: Latin text font - preloaded for LTR pages
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
});

// Noto Sans Arabic: Covers both Arabic (Dari/Farsi) and Pashto scripts
export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-arabic',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
});
