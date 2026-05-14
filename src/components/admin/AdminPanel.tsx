'use client';

import React, { useState } from 'react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminCategories } from './AdminCategories';
import { AdminCities } from './AdminCities';
import { AdminCurrencies } from './AdminCurrencies';
import { AdminListingForms } from './AdminListingForms';
import { AdminHomepageLayout } from './AdminHomepageLayout';
import { AdminModeration } from './AdminModeration';
import { AdminReports } from './AdminReports';
import { AdminUsers } from './AdminUsers';
import { AdminMonetization } from './AdminMonetization';

interface AdminPanelProps {
  locale: Locale;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard locale={locale} />;
      case 'categories':
        return <AdminCategories locale={locale} />;
      case 'cities':
        return <AdminCities locale={locale} />;
      case 'currencies':
        return <AdminCurrencies locale={locale} />;
      case 'listingForms':
        return <AdminListingForms locale={locale} />;
      case 'homepageLayout':
        return <AdminHomepageLayout locale={locale} />;
      case 'moderation':
        return <AdminModeration locale={locale} />;
      case 'reports':
        return <AdminReports locale={locale} />;
      case 'users':
        return <AdminUsers locale={locale} />;
      case 'monetization':
        return <AdminMonetization locale={locale} />;
      default:
        return <AdminDashboard locale={locale} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${rtl ? 'flex-row-reverse' : ''}`}>
      <AdminSidebar
        locale={locale}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};
