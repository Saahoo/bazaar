// src/components/dashboard/DashboardPage.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutGrid, Heart, MessageCircle, User } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MOCK_USERS } from '@/lib/constants/mock-data';
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

  const currentUser = MOCK_USERS[0];

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
        return <MyProfileTab locale={locale} user={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats Cards - always visible */}
      <StatsCards locale={locale} />

      {/* Tab Navigation */}
      <div className="mt-6 border-b border-slate-200">
        <nav
          className={`flex gap-1 sm:gap-2 overflow-x-auto ${isRtl ? 'flex-row-reverse' : ''}`}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors duration-200
                  ${isRtl ? 'flex-row-reverse' : ''}
                  ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};
