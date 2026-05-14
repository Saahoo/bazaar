'use client';

import React from 'react';
import {
  Shield,
  Tags,
  Building2,
  Coins,
  ClipboardList,
  LayoutGrid,
  Flag,
  Users,
  DollarSign,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';

export type AdminSection =
  | 'dashboard'
  | 'categories'
  | 'cities'
  | 'currencies'
  | 'listingForms'
  | 'homepageLayout'
  | 'moderation'
  | 'reports'
  | 'users'
  | 'monetization';

interface AdminSidebarProps {
  locale: Locale;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const SECTION_CONFIG: { id: AdminSection; icon: React.ElementType; labelKey: string }[] = [
  { id: 'dashboard', icon: Shield, labelKey: 'dashboard' },
  { id: 'categories', icon: Tags, labelKey: 'categories' },
  { id: 'cities', icon: Building2, labelKey: 'cities' },
  { id: 'currencies', icon: Coins, labelKey: 'currencies' },
  { id: 'listingForms', icon: ClipboardList, labelKey: 'listingForms' },
  { id: 'homepageLayout', icon: LayoutGrid, labelKey: 'homepageLayout' },
  { id: 'moderation', icon: Flag, labelKey: 'moderation' },
  { id: 'reports', icon: Flag, labelKey: 'reports' },
  { id: 'users', icon: Users, labelKey: 'users' },
  { id: 'monetization', icon: DollarSign, labelKey: 'monetization' },
];

const LABELS: Record<string, Record<Locale, string>> = {
  dashboard: { en: 'Dashboard', ps: 'ډشبورډ', fa: 'داشبورد' },
  categories: { en: 'Categories', ps: 'کټګورۍ', fa: 'دسته‌بندی‌ها' },
  cities: { en: 'Cities', ps: 'ښارونه', fa: 'شهرها' },
  currencies: { en: 'Currencies', ps: 'اسعار', fa: 'ارزها' },
  listingForms: { en: 'Listing Forms', ps: 'د اعلان فورمونه', fa: 'فرم‌های آگهی' },
  homepageLayout: { en: 'Homepage Layout', ps: 'د کورپاڼې بڼه', fa: 'طرح صفحه اصلی' },
  moderation: { en: 'Content Moderation', ps: 'د اعلان څارنه', fa: 'نظارت محتوا' },
  reports: { en: 'Reports', ps: 'ګزارشونه', fa: 'گزارش‌ها' },
  users: { en: 'User Management', ps: 'د کارونکي اداره', fa: 'مدیریت کاربران' },
  monetization: { en: 'Monetization', ps: 'عاید', fa: 'درآمدزایی' },
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  locale,
  activeSection,
  onSectionChange,
  collapsed,
  onToggleCollapse,
}) => {
  const rtl = isRTL(locale);
  const ChevronIcon = rtl ? (collapsed ? ChevronLeft : ChevronRight) : (collapsed ? ChevronRight : ChevronLeft);

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } h-screen sticky top-0 bg-slate-900 text-white flex flex-col transition-all duration-200 border-r border-slate-700/50`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-slate-700/50 ${rtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center border border-primary-600/30">
            <Shield className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className={rtl ? 'text-right' : 'text-left'}>
              <h1 className="text-sm font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Template Settings</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {SECTION_CONFIG.map(({ id, icon: Icon, labelKey }) => {
            const isActive = activeSection === id;
            const label = LABELS[labelKey]?.[locale] || LABELS[labelKey]?.en || id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSectionChange(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                  } ${rtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-xs"
        >
          <ChevronIcon className="w-4 h-4" />
          {!collapsed && <span>{rtl ? 'بټن' : 'Collapse'}</span>}
        </button>
      </div>
    </aside>
  );
};