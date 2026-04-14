// src/components/chat/MessagesPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Conversation,
  fetchConversations,
  subscribeToConversations,
  deleteConversation,
} from '@/lib/chat/actions';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';

interface MessagesPageProps {
  locale: Locale;
  conversationId?: string; // Optional: open specific conversation
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ locale, conversationId }) => {
  const t = useTranslations('common');
  const { user, loading: authLoading } = useAuth();
  const isRtl = isRTL(locale);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSelectConversation = useCallback((conv: Conversation) => {
    setActiveConv({ ...conv, unread_count: 0 });
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c))
    );
  }, []);

  const handleDeleteConversation = useCallback(async (conv: Conversation) => {
    const confirmed = window.confirm(
      locale === 'en'
        ? 'Delete this conversation?'
        : locale === 'ps'
          ? 'دا مکالمه حذف شي؟'
          : 'این گفتگو حذف شود؟'
    );
    if (!confirmed) return;

    try {
      await deleteConversation(conv.id);
      setConversations((prev) => prev.filter((c) => c.id !== conv.id));
      setActiveConv((prev) => (prev?.id === conv.id ? null : prev));
    } catch {
      // Keep UX simple for now
    }
  }, [locale]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const convs = await fetchConversations(user.id);
      setConversations(convs);

      // Auto-select conversation if ID provided
      if (conversationId) {
        const target = convs.find((c) => c.id === conversationId);
        if (target) setActiveConv(target);
      }
    } catch {
      // Silently handle — empty state shown
    } finally {
      setLoading(false);
    }
  }, [user, conversationId]);

  useEffect(() => {
    if (user) loadConversations();
  }, [user, loadConversations]);

  // Subscribe to real-time updates for conversation list refresh
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToConversations(user.id, () => {
      loadConversations();
    });
    return unsubscribe;
  }, [user, loadConversations]);

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 mb-4">{t('loginRequired')}</p>
          <a
            href={`/${locale}/login`}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
          >
            {t('login')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-shell rounded-3xl max-w-6xl mx-auto px-4 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className={`text-xl md:text-2xl font-bold text-slate-900 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('message')}
        </h1>
        <p className={`mt-1 text-sm text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
          {locale === 'en' ? 'Stay connected with buyers and sellers in real time.' : locale === 'ps' ? 'له پېرودونکو او پلورونکو سره په ریښتیني وخت کې اړیکه وساتئ.' : 'با خریداران و فروشندگان در لحظه در ارتباط بمانید.'}
        </p>
      </motion.div>

      <div className="glass-panel mt-4 h-[calc(100vh-220px)] min-h-[560px] overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <div className={`flex h-full ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`
            w-full md:w-80 lg:w-96 border-slate-200 overflow-y-auto flex-shrink-0
            ${isRtl ? 'md:border-l' : 'md:border-r'}
            ${activeConv ? 'hidden md:block' : 'block'}
          `}>
            <ConversationList
              locale={locale}
              conversations={conversations}
              activeId={activeConv?.id || null}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
              loading={loading}
            />
          </div>

          <div className={`flex-1 ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
            {activeConv ? (
              <div className="w-full h-full">
                <ChatWindow
                  locale={locale}
                  conversation={activeConv}
                  onBack={() => setActiveConv(null)}
                  onDelete={handleDeleteConversation}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center px-6">
                  <MessageCircle className="w-16 h-16 mx-auto mb-3 text-slate-200" />
                  <p className="text-sm">{t('selectConversation')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
