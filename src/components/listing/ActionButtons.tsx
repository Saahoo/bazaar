// src/components/listing/ActionButtons.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Share2, Flag } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';

interface ActionButtonsProps {
  locale: Locale;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ locale }) => {
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  const actions = [
    {
      icon: Heart,
      label: tCommon('favorite'),
      onClick: () => {},
    },
    {
      icon: Share2,
      label: tCommon('share'),
      onClick: () => {},
    },
    {
      icon: Flag,
      label: tCommon('report'),
      onClick: () => {},
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <action.icon className="w-4 h-4" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
