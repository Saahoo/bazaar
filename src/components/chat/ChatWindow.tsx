// src/components/chat/ChatWindow.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Message,
  Conversation,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from '@/lib/chat/actions';

interface ChatWindowProps {
  locale: Locale;
  conversation: Conversation;
  onBack: () => void;
  onDelete: (conv: Conversation) => void;
}

function formatTime(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(dateString: string, locale: Locale): string {
  const d = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return locale === 'en' ? 'Today' : locale === 'ps' ? 'نن' : 'امروز';
  }
  if (d.toDateString() === yesterday.toDateString()) {
    return locale === 'en' ? 'Yesterday' : locale === 'ps' ? 'پرون' : 'دیروز';
  }
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'fa-AF', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ locale, conversation, onBack, onDelete }) => {
  const t = useTranslations('common');
  const { user } = useAuth();
  const isRtl = isRTL(locale);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchMessages(conversation.id).then((msgs) => {
      if (!cancelled) {
        setMessages(msgs);
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    });

    // Mark as read
    if (user) {
      markMessagesAsRead(conversation.id, user.id).catch(() => {});
    }

    return () => { cancelled = true; };
  }, [conversation.id, user, scrollToBottom]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToMessages(conversation.id, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);

      // Mark as read if not from current user
      if (user && newMsg.sender_id !== user.id) {
        markMessagesAsRead(conversation.id, user.id).catch(() => {});
      }
    });

    return unsubscribe;
  }, [conversation.id, user, scrollToBottom]);

  const handleSend = async () => {
    if (!newText.trim() || !user || sending) return;

    const text = newText.trim();
    setNewText('');
    setSending(true);

    try {
      const msg = await sendMessage(conversation.id, user.id, text);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setTimeout(scrollToBottom, 100);
    } catch {
      setNewText(text); // Restore on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  messages.forEach((msg) => {
    const dateStr = new Date(msg.created_at).toDateString();
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === dateStr) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date: dateStr, msgs: [msg] });
    }
  });

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-3 border-b border-slate-200 bg-white/90 p-3 backdrop-blur ${isRtl ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          title={locale === 'en' ? 'Back' : locale === 'ps' ? 'شاته' : 'بازگشت'}
        >
          <BackArrow className="w-5 h-5" />
        </button>
        <div className="relative w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm flex-shrink-0 overflow-hidden">
          {conversation.other_user_avatar ? (
            <Image src={conversation.other_user_avatar} alt={conversation.other_user_name || 'User'} fill unoptimized sizes="36px" className="object-cover" />
          ) : (
            (conversation.other_user_name || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
          {conversation.other_user_id ? (
            <Link
              href={`/${locale}/profile/${conversation.other_user_id}`}
              className="text-sm font-semibold text-slate-900 truncate hover:text-primary-600 hover:underline"
            >
              {conversation.other_user_name || 'User'}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-slate-900 truncate">
              {conversation.other_user_name || 'User'}
            </p>
          )}
          {conversation.listing_title && (
            <p className="text-xs text-slate-500 truncate">{conversation.listing_title}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(conversation)}
          className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
          aria-label={t('delete')}
          title={t('delete')}
        >
          {t('delete')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            {t('startConversation')}
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">
                  {formatDateSeparator(group.msgs[0].created_at, locale)}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Messages */}
              {group.msgs.map((msg, idx) => {
                const isMine = user?.id === msg.sender_id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.015 }}
                    className={`flex mb-2 ${isMine ? (isRtl ? 'justify-start' : 'justify-end') : (isRtl ? 'justify-end' : 'justify-start')}`}
                  >
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl ${
                        isMine
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-slate-400'} ${isRtl ? 'text-left' : 'text-right'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`border-t border-slate-200 bg-white/95 p-3 backdrop-blur ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeMessage')}
            className={`flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 ${isRtl ? 'text-right' : 'text-left'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!newText.trim() || sending}
            title={locale === 'en' ? 'Send message' : locale === 'ps' ? 'پیغام ولېږئ' : 'ارسال پیام'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
              newText.trim() && !sending
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
