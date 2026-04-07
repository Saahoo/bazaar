// src/components/dashboard/StatsCards.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Eye, MousePointerClick, Package, Star } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MOCK_LISTINGS, MOCK_USERS } from '@/lib/constants/mock-data';

interface StatsCardsProps {
  locale: Locale;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const isRtl = isRTL(locale);

  const currentUser = MOCK_USERS[0];
  const activeListingsCount = MOCK_LISTINGS.filter(
    (l) => l.user_id === 'u1' && l.status === 'active'
  ).length;

  const stats = [
    {
      label: t('totalViews'),
      value: '1,234',
      icon: <Eye className="w-5 h-5 text-primary-600" />,
      bgColor: 'bg-primary-100',
    },
    {
      label: t('totalClicks'),
      value: '567',
      icon: <MousePointerClick className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      label: t('activeListings'),
      value: String(activeListingsCount),
      icon: <Package className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-100',
    },
    {
      label: t('myRating'),
      value: String(currentUser.rating),
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
