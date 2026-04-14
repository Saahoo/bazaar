// src/components/dashboard/StatsCards.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Eye, MousePointerClick, Package, Star } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/common/Skeleton';

interface StatsCardsProps {
  locale: Locale;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const isRtl = isRTL(locale);
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalViews: 0,
    totalClicks: 0,
    activeListings: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      const [{ data: listings }, { data: profile }] = await Promise.all([
        supabase
          .from('listings')
          .select('view_count, favorite_count, status')
          .eq('user_id', user.id)
          .is('deleted_at', null),
        supabase
          .from('profiles')
          .select('seller_rating')
          .eq('id', user.id)
          .single(),
      ]);

      const rows = listings || [];
      setStatsData({
        totalViews: rows.reduce((sum, item) => sum + (item.view_count || 0), 0),
        totalClicks: rows.reduce((sum, item) => sum + (item.favorite_count || 0), 0),
        activeListings: rows.filter((item) => item.status === 'active').length,
        rating: Number(profile?.seller_rating) || 0,
      });
      setLoading(false);
    };

    loadStats().catch(() => setLoading(false));
  }, [user, supabase]);

  const stats = [
    {
      label: t('totalViews'),
      value: String(statsData.totalViews),
      icon: <Eye className="w-5 h-5 text-primary-600" />,
      bgColor: 'bg-primary-100',
    },
    {
      label: t('totalClicks'),
      value: String(statsData.totalClicks),
      icon: <MousePointerClick className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      label: t('activeListings'),
      value: String(statsData.activeListings),
      icon: <Package className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-100',
    },
    {
      label: t('myRating'),
      value: statsData.rating > 0 ? statsData.rating.toFixed(1) : '0.0',
      icon: <Star className="w-5 h-5 text-rose-600" />,
      bgColor: 'bg-rose-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: index * 0.05 }}
          className="glass-panel rounded-2xl border border-slate-200 p-4 shadow-sm"
        >
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              {stat.icon}
            </div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
