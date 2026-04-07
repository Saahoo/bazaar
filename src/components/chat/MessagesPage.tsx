// src/components/chat/MessagesPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Conversation,
  fetchConversations,
  subscribeToConversations,
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
        <div className="text-center">
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className={`text-xl font-bold text-slate-900 mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        {t('message')}
      </h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className={`flex h-full ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Conversation List — hidden on mobile when a chat is open */}
          <div className={`
            w-full md:w-80 lg:w-96 border-slate-200 overflow-y-auto flex-shrink-0
            ${isRtl ? 'md:border-l' : 'md:border-r'}
            ${activeConv ? 'hidden md:block' : 'block'}
          `}>
            <ConversationList
              locale={locale}
              conversations={conversations}
              activeId={activeConv?.id || null}
              onSelect={(conv) => setActiveConv(conv)}
              loading={loading}
            />
          </div>

          {/* Chat Window */}
          <div className={`flex-1 ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
            {activeConv ? (
              <div className="w-full h-full">
                <ChatWindow
                  locale={locale}
                  conversation={activeConv}
                  onBack={() => setActiveConv(null)}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
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
