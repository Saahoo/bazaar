// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogIn, LogOut, MessageCircle, Search } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { getUnreadCount, subscribeToConversations } from '@/lib/chat/actions';

interface HeaderProps {
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ locale }) => {
  const tCommon = useTranslations('common');
  const tHeader = useTranslations('header');
  const router = useRouter();
  const isRtl = isRTL(locale);
  const { user, loading, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 0) {
      router.push(`/${locale}/search?q=${encodeURIComponent(trimmedQuery)}`);
      return;
    }

    router.push(`/${locale}/search`);
  };

  // Fetch and subscribe to unread message count
  useEffect(() => {
    if (!user) return;

    getUnreadCount(user.id).then(setUnreadCount).catch(() => {});

    const unsubscribe = subscribeToConversations(user.id, () => {
      getUnreadCount(user.id).then(setUnreadCount).catch(() => {});
    });

    return unsubscribe;
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = `/${locale}`;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="py-2">
          <div className={`flex items-center justify-between h-14 gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 font-bold text-xl text-primary-600 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <span className="hidden sm:inline">Bazaar</span>
            </Link>

            {/* Right Actions */}
            <nav className={`flex items-center gap-2 md:gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Link
                href={`/${locale}/post-ad`}
                className="px-3 md:px-4 py-2 bg-accent-500 text-white text-sm md:text-base rounded-lg hover:bg-accent-600 transition font-medium"
              >
                {tCommon('postAd')}
              </Link>

              {!loading && user ? (
                <>
                  <Link
                    href={`/${locale}/messages`}
                    className="relative w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition"
                    title={tCommon('message')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={`/${locale}/profile`}
                    className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-100 transition"
                    title={tCommon('account')}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-600 transition rounded-lg hover:bg-red-50 ${isRtl ? 'flex-row-reverse' : ''}`}
                    title={tCommon('logout')}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">{tCommon('logout')}</span>
                  </button>
                </>
              ) : !loading ? (
                <Link
                  href={`/${locale}/login`}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition rounded-lg hover:bg-slate-50 ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">{tCommon('login')}</span>
                </Link>
              ) : null}

              <LanguageSwitcher currentLocale={locale} compact />
            </nav>
          </div>

          <form onSubmit={handleSearchSubmit} className="pb-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tHeader('searchPlaceholder')}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-24 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
              >
                {tCommon('search')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
