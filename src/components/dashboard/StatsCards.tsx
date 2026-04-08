// src/components/dashboard/StatsCards.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, MousePointerClick, Package, Star } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface StatsCardsProps {
  locale: Locale;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const isRtl = isRTL(locale);
  const { user } = useAuth();
  const supabase = createClient();
  const [statsData, setStatsData] = useState({
    totalViews: 0,
    totalClicks: 0,
    activeListings: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user) return;

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
    };

    loadStats();
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
      icon: <Star className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-slate-200 p-4"
        >
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              {stat.icon}
            </div>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
