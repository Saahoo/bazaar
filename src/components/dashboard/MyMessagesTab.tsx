// src/components/dashboard/MyMessagesTab.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { Conversation, fetchConversations } from '@/lib/chat/actions';
import { Skeleton } from '@/components/common/Skeleton';

interface MyMessagesTabProps {
  locale: Locale;
}

function formatMessageTime(dateString: string, locale: Locale): string {
  const now = new Date();
  const msgDate = new Date(dateString);
  const diffMs = now.getTime() - msgDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return locale === 'en' ? 'Just now' : locale === 'ps' ? 'اوس مهال' : 'همین الان';
  }
  if (diffHours < 24) {
    return locale === 'en' ? `${diffHours}h ago` : locale === 'ps' ? `${diffHours} ساعت مخکې` : `${diffHours} ساعت پیش`;
  }
  if (diffDays === 1) {
    return locale === 'en' ? 'Yesterday' : locale === 'ps' ? 'پرون' : 'دیروز';
  }
  if (diffDays < 7) {
    return locale === 'en' ? `${diffDays}d ago` : locale === 'ps' ? `${diffDays} ورځې مخکې` : `${diffDays} روز پیش`;
  }
  return msgDate.toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-AF');
}

export const MyMessagesTab: React.FC<MyMessagesTabProps> = ({ locale }) => {
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchConversations(user.id)
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-slate-500 shadow-sm">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>{tCommon('noMessages')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Link to full messages page */}
      <div className={`mb-3 ${isRtl ? 'text-left' : 'text-right'}`}>
        <a
          href={`/${locale}/messages`}
          className={`inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          {tCommon('message')}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {conversations.slice(0, 5).map((conv, index) => {
          const initial = (conv.other_user_name || 'U').charAt(0).toUpperCase();
          const timeAgo = formatMessageTime(conv.last_message_at, locale);
          const isLast = index === Math.min(conversations.length, 5) - 1;
          const hasUnread = (conv.unread_count || 0) > 0;

          return (
            <motion.a
              key={conv.id}
              href={`/${locale}/messages?conv=${conv.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className={`
                block w-full p-4 transition-colors
                ${isRtl ? 'text-right' : 'text-left'}
                ${hasUnread ? 'bg-primary-50 hover:bg-primary-100/70' : 'hover:bg-slate-50'}
                ${!isLast ? 'border-b border-slate-200' : ''}
              `}
            >
              <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {initial}
                </div>
                <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {conv.other_user_name || 'User'}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">{timeAgo}</span>
                  </div>
                  {conv.listing_title && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{conv.listing_title}</p>
                  )}
                  <div className={`flex items-center gap-2 mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <p className="text-sm text-slate-600 truncate flex-1">{conv.last_message || '...'}</p>
                    {hasUnread && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
