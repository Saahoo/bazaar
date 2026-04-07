// src/components/chat/ConversationList.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { Conversation } from '@/lib/chat/actions';

interface ConversationListProps {
  locale: Locale;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
  loading: boolean;
}

function timeAgo(dateString: string, locale: Locale): string {
  const now = new Date();
  const d = new Date(dateString);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return locale === 'en' ? 'Now' : locale === 'ps' ? 'اوس' : 'الان';
  if (diffMin < 60) return locale === 'en' ? `${diffMin}m` : `${diffMin}د`;
  if (diffHrs < 24) return locale === 'en' ? `${diffHrs}h` : `${diffHrs}س`;
  if (diffDays === 1) return locale === 'en' ? 'Yesterday' : locale === 'ps' ? 'پرون' : 'دیروز';
  if (diffDays < 7) return locale === 'en' ? `${diffDays}d` : `${diffDays}ر`;
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-AF', { month: 'short', day: 'numeric' });
}

export const ConversationList: React.FC<ConversationListProps> = ({
  locale,
  conversations,
  activeId,
  onSelect,
  loading,
}) => {
  const t = useTranslations('common');
  const isRtl = isRTL(locale);

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
        {t('loading')}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        <MessageCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">{t('noMessages')}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        const hasUnread = (conv.unread_count || 0) > 0;
        const initial = (conv.other_user_name || 'U').charAt(0).toUpperCase();

        return (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv)}
            className={`
              w-full p-3 transition-colors cursor-pointer
              ${isRtl ? 'text-right' : 'text-left'}
              ${isActive ? 'bg-primary-50 border-l-2 border-primary-500' : hasUnread ? 'bg-primary-50/50 hover:bg-primary-50' : 'hover:bg-slate-50'}
            `}
          >
            <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {initial}
              </div>
              <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-sm truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {conv.other_user_name || 'User'}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {timeAgo(conv.last_message_at, locale)}
                  </span>
                </div>
                {conv.listing_title && (
                  <p className="text-xs text-primary-500 truncate mt-0.5">{conv.listing_title}</p>
                )}
                <div className={`flex items-center gap-2 mt-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <p className={`text-sm truncate flex-1 ${hasUnread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {conv.last_message || '...'}
                  </p>
                  {hasUnread && (
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
