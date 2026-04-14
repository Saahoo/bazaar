'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Baby,
  Bike,
  BookOpen,
  Briefcase,
  CarFront,
  HeartHandshake,
  Hammer,
  Home,
  Leaf,
  PawPrint,
  Puzzle,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Wrench,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { cn } from './cn';

const ICON_MAP: Record<string, LucideIcon> = {
  baby: Baby,
  bike: Bike,
  book: BookOpen,
  briefcase: Briefcase,
  car: CarFront,
  hammer: Hammer,
  heart: HeartHandshake,
  home: Home,
  leaf: Leaf,
  paw: PawPrint,
  phone: Smartphone,
  puzzle: Puzzle,
  shirt: Shirt,
  'shopping-bag': ShoppingBag,
  smartphone: Smartphone,
  sofa: Sofa,
  wrench: Wrench,
  zap: Zap,
};

// Mapping from category slugs/names to icon names
const SLUG_TO_ICON_MAP: Record<string, string> = {
  // Vehicles related
  vehicles: 'car',
  'vehicles-bikes': 'bike',
  'spare-parts': 'puzzle',
  // Real Estate
  'real-estate': 'home',
  // Electronics
  electronics: 'smartphone',
  // Fashion
  'fashion-clothing': 'shirt',
  fashion: 'shirt',
  // Home & Furniture
  'home-furniture': 'sofa',
  'home-and-furniture': 'sofa',
  furniture: 'sofa',
  // Health & Beauty
  'health-beauty': 'leaf',
  'health-and-beauty': 'leaf',
  // Others
  services: 'briefcase',
  books: 'book',
  pets: 'paw',
  tools: 'wrench',
};

export function getIconNameFromSlug(slug?: string | null): string {
  if (!slug) return 'home';
  
  const normalized = slug.toLowerCase().trim();
  return SLUG_TO_ICON_MAP[normalized] || 'home';
}

export function resolveCategoryIcon(iconName?: string | null): LucideIcon {
  if (!iconName) {
    return Home;
  }

  return ICON_MAP[iconName] || Home;
}

interface AnimatedCategoryIconProps {
  iconName?: string | null;
  active?: boolean;
  className?: string;
  iconClassName?: string;
}

export function AnimatedCategoryIcon({
  iconName,
  active = false,
  className,
  iconClassName,
}: AnimatedCategoryIconProps) {
  const Icon = resolveCategoryIcon(iconName);

  return (
    <motion.span
      whileHover={{ scale: 1.08, rotate: active ? 0 : -6 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300',
        active && 'border-primary-200 bg-primary-50 text-primary-700 shadow-lg shadow-primary-100',
        className,
      )}
    >
      <Icon className={cn('h-5 w-5 transition-transform duration-300', active && 'drop-shadow-sm', iconClassName)} />
    </motion.span>
  );
}