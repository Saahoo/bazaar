'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Tags, Building2, Coins, LayoutGrid, Flag, Users, DollarSign, AlertTriangle, Eye } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_LABELS } from './adminShared';
import type { AdminSection } from './AdminSidebar';

interface AdminDashboardProps {
  locale: Locale;
  onNavigate?: (section: AdminSection) => void;
}

interface DashboardStat {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: string;
  section: AdminSection;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ locale, onNavigate }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [stats, setStats] = useState({
    categories: 0,
    cities: 0,
    currencies: 0,
    listings: 0,
    reports: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, cityRes, currRes, listRes, repRes, userRes] = await Promise.all([
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('cities').select('id', { count: 'exact', head: true }),
        supabase.from('currencies').select('code', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        categories: catRes.count || 0,
        cities: cityRes.count || 0,
        currencies: currRes.count || 0,
        listings: listRes.count || 0,
        reports: repRes.count || 0,
        users: userRes.count || 0,
      });
    } catch {
      // silently fail
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const title = SECTION_LABELS.dashboard[locale] || SECTION_LABELS.dashboard.en;

  const dashboardStats: DashboardStat[] = [
    { label: SECTION_LABELS.categories[locale] || 'Categories', value: stats.categories, icon: Tags, tone: 'from-blue-500 to-cyan-500', section: 'categories' },
    { label: SECTION_LABELS.cities[locale] || 'Cities', value: stats.cities, icon: Building2, tone: 'from-emerald-500 to-teal-500', section: 'cities' },
    { label: SECTION_LABELS.currencies[locale] || 'Currencies', value: stats.currencies, icon: Coins, tone: 'from-violet-500 to-purple-500', section: 'currencies' },
    { label: SECTION_LABELS.moderation[locale] || 'Moderation Queue', value: stats.listings, icon: Eye, tone: 'from-amber-500 to-orange-500', section: 'moderation' },
    { label: SECTION_LABELS.reports[locale] || 'Pending Reports', value: stats.reports, icon: AlertTriangle, tone: 'from-rose-500 to-pink-500', section: 'reports' },
    { label: SECTION_LABELS.users[locale] || 'Users', value: stats.users, icon: Users, tone: 'from-indigo-500 to-blue-500', section: 'users' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm">
        <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div className={rtl ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-white/80 mt-1">
              {locale === 'ps'
                ? 'کټګورۍ، ښارونه، د اعلان فورمونه، کارونکي، او څارنه له یوه ځایه اداره کړئ.'
                : locale === 'fa'
                  ? 'دسته‌بندی‌ها، شهرها، فرم‌های آگهی، کاربران و نظارت را از یک‌جا مدیریت کنید.'
                  : 'Manage categories, cities, listing forms, users, and moderation from one unified dashboard.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.section}
              type="button"
              onClick={() => onNavigate?.(stat.section)}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer text-left"
            >
              <div className={`inline-flex rounded-lg bg-gradient-to-r ${stat.tone} p-2 text-white`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`mt-3 text-xs text-slate-500 ${rtl ? 'text-right' : 'text-left'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold text-slate-900 ${rtl ? 'text-right' : 'text-left'}`}>
                {loading ? '...' : stat.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className={`text-sm font-semibold text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
            {locale === 'ps' ? 'چټک عملونه' : locale === 'fa' ? 'اقدامات سریع' : 'Quick Actions'}
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigate?.('categories')}
              className="w-full px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <Tags className="w-4 h-4" />
              {locale === 'ps' ? 'کټګورۍ اداره کړئ' : locale === 'fa' ? 'مدیریت دسته‌بندی‌ها' : 'Manage Categories'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('monetization')}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {locale === 'ps' ? 'AdSense تنظیم کړئ' : locale === 'fa' ? 'تنظیم AdSense' : 'Configure AdSense'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('users')}
              className="w-full px-4 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              {locale === 'ps' ? 'کارونکي اداره کړئ' : locale === 'fa' ? 'مدیریت کاربران' : 'Manage Users'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className={`text-sm font-semibold text-slate-900 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
            {locale === 'ps' ? 'د اعلان څارنه' : locale === 'fa' ? 'نظارت آگهی‌ها' : 'Content Moderation'}
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigate?.('moderation')}
              className="w-full px-4 py-2.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-2"
            >
              <Flag className="w-4 h-4" />
              {locale === 'ps' ? 'اعلانونه وڅارئ' : locale === 'fa' ? 'نظارت آگهی‌ها' : 'Review Listings'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('reports')}
              className="w-full px-4 py-2.5 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium hover:bg-rose-100 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {locale === 'ps' ? 'ګزارشونه وڅارئ' : locale === 'fa' ? 'بررسی گزارش‌ها' : 'Review Reports'}
              {stats.reports > 0 && (
                <span className="ml-auto bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{stats.reports}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('homepageLayout')}
              className="w-full px-4 py-2.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 transition-colors flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              {locale === 'ps' ? 'کورپاڼې بڼه' : locale === 'fa' ? 'طرح صفحه اصلی' : 'Homepage Layout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};