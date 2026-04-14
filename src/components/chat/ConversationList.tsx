// src/components/chat/ConversationList.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { Conversation } from '@/lib/chat/actions';
import { Skeleton } from '@/components/common/Skeleton';

interface ConversationListProps {
  locale: Locale;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
  onDelete: (conv: Conversation) => void;
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
  onDelete,
  loading,
}) => {
  const t = useTranslations('common');
  const isRtl = isRTL(locale);

  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-3">
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
      <div className="p-8 text-center text-slate-400">
        <MessageCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">{t('noMessages')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        const hasUnread = (conv.unread_count || 0) > 0;
        const initial = (conv.other_user_name || 'U').charAt(0).toUpperCase();

        return (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(conv)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(conv);
              }
            }}
            className={`
              w-full rounded-2xl border p-3 transition-all cursor-pointer
              ${isRtl ? 'text-right' : 'text-left'}
              ${isActive ? 'bg-primary-50 border-primary-300 shadow-sm' : hasUnread ? 'bg-primary-50/60 border-primary-100 hover:bg-primary-50' : 'border-transparent hover:border-slate-200 hover:bg-white'}
            `}
          >
            <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="relative w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0 overflow-hidden">
                {conv.other_user_avatar ? (
                  <Image src={conv.other_user_avatar} alt={conv.other_user_name || 'User'} fill unoptimized sizes="40px" className="object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  {conv.other_user_id ? (
                    <Link
                      href={`/${locale}/profile/${conv.other_user_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-sm truncate hover:underline ${hasUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}
                    >
                      {conv.other_user_name || 'User'}
                    </Link>
                  ) : (
                    <span className={`text-sm truncate ${hasUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {conv.other_user_name || 'User'}
                    </span>
                  )}
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv);
                    }}
                    className="rounded-lg px-1.5 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={t('delete')}
                    title={t('delete')}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
