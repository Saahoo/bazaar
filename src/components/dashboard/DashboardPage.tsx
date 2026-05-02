// src/components/dashboard/DashboardPage.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Heart, MessageCircle, User } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { StatsCards } from './StatsCards';
import { MyAdsTab } from './MyAdsTab';
import { MyFavoritesTab } from './MyFavoritesTab';
import { MyMessagesTab } from './MyMessagesTab';
import { MyProfileTab } from './MyProfileTab';

interface DashboardPageProps {
  locale: Locale;
}

type TabType = 'ads' | 'favorites' | 'messages' | 'profile';

interface TabItem {
  key: TabType;
  labelKey: string;
  icon: React.ReactNode;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const isRtl = isRTL(locale);
  const [activeTab, setActiveTab] = useState<TabType>('ads');

  const tabs: TabItem[] = [
    { key: 'ads', labelKey: 'myAds', icon: <LayoutGrid className="w-5 h-5" /> },
    { key: 'favorites', labelKey: 'myFavorites', icon: <Heart className="w-5 h-5" /> },
    { key: 'messages', labelKey: 'myMessages', icon: <MessageCircle className="w-5 h-5" /> },
    { key: 'profile', labelKey: 'myProfile', icon: <User className="w-5 h-5" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ads':
        return <MyAdsTab locale={locale} />;
      case 'favorites':
        return <MyFavoritesTab locale={locale} />;
      case 'messages':
        return <MyMessagesTab locale={locale} />;
      case 'profile':
        return <MyProfileTab locale={locale} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-500/8 via-primary-500/4 to-transparent" />

      <StatsCards locale={locale} />

      <div className="mt-6 sticky top-[72px] z-20">
        <nav
          className={`flex gap-1 sm:gap-2 overflow-x-auto rounded-2xl border border-slate-200/60 bg-white/80 p-1.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl ${isRtl ? 'flex-row-reverse' : ''}`}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2.5 text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${isRtl ? 'flex-row-reverse' : ''}
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                  }
                `}
              >
                {tab.icon}
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
