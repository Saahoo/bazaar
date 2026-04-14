// src/components/layout/Header.tsx
'use client';

import React, { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, LogIn, LogOut, Menu, MessageCircle, Plus, Search, User, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Drawer } from '@/components/common/Drawer';
import { cn } from '@/lib/utils/cn';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const navigationItems = useMemo(
    () => [
      { href: `/${locale}`, icon: Home, label: locale === 'en' ? 'Home' : locale === 'ps' ? 'کور' : 'خانه' },
      { href: `/${locale}/search`, icon: Search, label: tCommon('search') },
      { href: `/${locale}/post-ad`, icon: Plus, label: tCommon('postAd') },
    ],
    [locale, tCommon],
  );

  // Detect scroll for dynamic header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = deferredQuery.trim();

    startTransition(() => {
      if (trimmedQuery.length > 0) {
        router.push(`/${locale}/search?q=${encodeURIComponent(trimmedQuery)}`);
        return;
      }

      router.push(`/${locale}/search`);
    });
  }, [deferredQuery, locale, router]);

  // Fetch and subscribe to unread message count
  useEffect(() => {
    if (!user) return;

    getUnreadCount(user.id).then(setUnreadCount).catch(() => {});

    const unsubscribe = subscribeToConversations(user.id, () => {
      getUnreadCount(user.id).then(setUnreadCount).catch(() => {});
    });

    return unsubscribe;
  }, [user]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace(`/${locale}`);
    router.refresh();
    setMobileMenuOpen(false);
  }, [locale, router, signOut]);

  const handleLogin = useCallback(() => {
    router.push(`/${locale}/login`);
    setMobileMenuOpen(false);
  }, [locale, router]);

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 shadow-[0_4px_20px_rgba(15,23,42,0.1)] backdrop-blur-md border-b border-slate-200/50'
            : 'bg-gradient-to-b from-white via-white/95 to-white/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border-b border-white/60'
        )}
      >
        <div className="container mx-auto">
          {/* Top Navigation Row */}
          <div className={cn('flex items-center justify-between px-4 py-4', isRtl && 'flex-row-reverse')}>
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn('flex min-w-0 items-center gap-4', isRtl && 'flex-row-reverse')}
            >
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 lg:hidden"
                aria-label={locale === 'en' ? 'Open menu' : locale === 'ps' ? 'مېنو خلاص کړئ' : 'باز کردن منو'}
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link
                href={`/${locale}`}
                className={cn('flex min-w-0 items-center gap-3 group', isRtl && 'flex-row-reverse')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-sm font-bold text-white shadow-lg shadow-primary-200/50 group-hover:shadow-xl group-hover:shadow-primary-300/60 transition">
                  B
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-slate-900">Bazaar</p>
                  <p className="hidden text-xs text-slate-500 sm:block whitespace-nowrap">
                    {locale === 'en' ? 'Market place' : locale === 'ps' ? 'بازار' : 'بازار'}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Center Navigation */}
            <nav className={cn('hidden lg:flex items-center gap-1', isRtl && 'flex-row-reverse')}>
              {navigationItems.map(({ href, icon: Icon, label }) => (
                <motion.div key={href} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-primary-700 hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Action Section */}
            <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
              <ThemeToggle label={locale === 'en' ? 'Toggle theme' : locale === 'ps' ? 'رنګ بدل کړئ' : 'تغییر پوسته'} />
              <div className="hidden sm:block">
                <LanguageSwitcher currentLocale={locale} compact />
              </div>

              {!loading && user ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={`/${locale}/messages`}
                      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-primary-100 hover:text-primary-700"
                      title={tCommon('message')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-md"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>

                  {/* User Menu Dropdown */}
                  <div className="relative z-50">
                    <motion.button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <User className="h-4 w-4" />
                      <span>{tCommon('account')}</span>
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-300',
                          userMenuOpen && 'rotate-180'
                        )}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            'absolute z-50 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg',
                            isRtl ? 'left-0' : 'right-0'
                          )}
                        >
                          <Link
                            href={`/${locale}/profile`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-primary-700 rounded-t-xl"
                          >
                            <User className="h-4 w-4" />
                            {tCommon('account')}
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              handleSignOut();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 rounded-b-xl"
                          >
                            <LogOut className="h-4 w-4" />
                            {tCommon('logout')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={handleSignOut}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200"
                      title={tCommon('logout')}
                    >
                      <LogOut className="h-4 w-4" />
                    </motion.button>
                  </div>
                </>
              ) : !loading ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-lg shadow-primary-200/50 transition hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-300/60"
                  title={tCommon('login')}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{tCommon('login')}</span>
                </motion.button>
              ) : null}
            </div>
          </div>

          {/* Search Bar Section */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="px-4 pb-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-white/95 to-slate-50/95 shadow-md hover:shadow-lg transition-all duration-300 focus-within:border-primary-300 focus-within:shadow-lg focus-within:shadow-primary-100">
              <Search className={cn('pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400', isRtl ? 'right-4' : 'left-4')} />
              <motion.input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tHeader('searchPlaceholder')}
                className={cn(
                  'w-full bg-transparent py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 sm:text-base',
                  isRtl ? 'pl-32 pr-4 text-right' : 'pl-11 pr-32',
                )}
                whileFocus={{ scale: 1.01 }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-xs font-medium text-white shadow-md transition hover:bg-primary-700 sm:text-sm',
                  isRtl ? 'left-2' : 'right-2',
                )}
              >
                {tCommon('search')}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title={locale === 'en' ? 'Navigation' : locale === 'ps' ? 'لارښود' : 'ناوبری'}
        side={isRtl ? 'left' : 'right'}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {navigationItems.map(({ href, icon: Icon, label }, idx) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn('flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700', isRtl && 'flex-row-reverse')}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn('rounded-xl border border-slate-200 bg-slate-50 p-4', isRtl && 'text-right')}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              {locale === 'en' ? 'Preferences' : locale === 'ps' ? 'غوراوي' : 'ترجیحات'}
            </p>
            <div className={cn('flex items-center justify-between gap-3', isRtl && 'flex-row-reverse')}>
              <span className="text-sm font-medium text-slate-700">
                {locale === 'en' ? 'Theme & Language' : locale === 'ps' ? 'رنګ او ژبه' : 'پوسته و زبان'}
              </span>
              <div className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
                <ThemeToggle />
                <LanguageSwitcher currentLocale={locale} compact />
              </div>
            </div>
          </motion.div>

          {!loading && user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Link
                href={`/${locale}/messages`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn('flex w-full items-center gap-3 rounded-xl bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-primary-200/50', isRtl && 'flex-row-reverse')}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="flex-1">{tCommon('message')}</span>
                {unreadCount > 0 && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </Link>
              <Link
                href={`/${locale}/profile`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn('flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700', isRtl && 'flex-row-reverse')}
              >
                <User className="h-5 w-5" />
                {tCommon('account')}
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className={cn('flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100', isRtl && 'flex-row-reverse')}
              >
                <LogOut className="h-5 w-5" />
                {tCommon('logout')}
              </button>
            </motion.div>
          ) : !loading ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              type="button"
              onClick={handleLogin}
              className={cn('flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-primary-200/50', isRtl && 'flex-row-reverse')}
            >
              <LogIn className="h-5 w-5" />
              {tCommon('login')}
            </motion.button>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {tCommon('loading')}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};
