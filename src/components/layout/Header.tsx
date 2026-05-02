// src/components/layout/Header.tsx
'use client';

import React, { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, LogIn, LogOut, Menu, MessageCircle, Plus, Search, User, ChevronDown, Sparkles } from 'lucide-react';
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
  const [searchFocused, setSearchFocused] = useState(false);
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

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

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
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-500 ease-smooth',
          scrolled
            ? 'bg-white/70 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl border-b border-white/40'
            : 'bg-gradient-to-b from-white/90 via-white/60 to-transparent border-b border-transparent'
        )}
      >
        {/* Decorative gradient line at top */}
        <div className="h-[2px] w-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 opacity-80" />

        <div className="container mx-auto">
          {/* Top Navigation Row - compact on mobile */}
          <div className={cn('flex items-center justify-between px-3 py-2 md:px-4 md:py-3', isRtl && 'flex-row-reverse')}>
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn('flex min-w-0 items-center gap-3', isRtl && 'flex-row-reverse')}
            >
              {/* Mobile Menu Button */}
              <motion.button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition-all hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 hover:ring-primary-200/60 lg:hidden"
                aria-label={locale === 'en' ? 'Open menu' : locale === 'ps' ? 'مېنو خلاص کړئ' : 'باز کردن منو'}
              >
                <Menu className="h-5 w-5" />
              </motion.button>

              {/* Logo */}
              <Link
                href={`/${locale}`}
                className={cn('flex min-w-0 items-center gap-3 group', isRtl && 'flex-row-reverse')}
              >
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-sm font-bold text-white shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
                    B
                  </div>
                  {/* Subtle glow behind logo */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold tracking-tight text-slate-900">Bazaar</p>
                  <p className="hidden text-xs text-slate-500 sm:block whitespace-nowrap">
                    {locale === 'en' ? 'Marketplace' : locale === 'ps' ? 'بازار' : 'بازار'}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Center Navigation - Desktop */}
            <nav className={cn('hidden lg:flex items-center gap-1.5', isRtl && 'flex-row-reverse')}>
              {navigationItems.map(({ href, icon: Icon, label }) => (
                <motion.div key={href} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={href}
                    className="group relative inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:bg-white/80 hover:text-primary-700 hover:shadow-md hover:shadow-primary-100/50"
                  >
                    <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>{label}</span>
                    {/* Active indicator dot */}
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                  {/* Messages Button */}
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                    <Link
                      href={`/${locale}/messages`}
                      className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 shadow-sm ring-1 ring-slate-200/60 transition-all hover:from-primary-50 hover:to-primary-100 hover:text-primary-600 hover:ring-primary-200/60"
                      title={tCommon('message')}
                    >
                      <MessageCircle className="h-4.5 w-4.5" />
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-[10px] font-bold text-white shadow-lg shadow-primary-500/40"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </motion.div>

                  {/* User Menu Dropdown */}
                  <div className="relative z-50" data-user-menu>
                    <motion.button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-primary-200 hover:bg-primary-50/80 hover:text-primary-700 hover:shadow-md hover:shadow-primary-100/30"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-[10px] font-bold text-white">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
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
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className={cn(
                            'absolute z-50 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-900/10 backdrop-blur-xl',
                            isRtl ? 'left-0' : 'right-0'
                          )}
                        >
                          {/* User info header */}
                          <div className="border-b border-slate-100 bg-gradient-to-r from-primary-50/50 to-accent-50/50 px-4 py-3">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              <Sparkles className="inline h-3 w-3 text-primary-500 mr-1" />
                              {locale === 'en' ? 'Active account' : locale === 'ps' ? 'فعاله حساب' : 'حساب فعال'}
                            </p>
                          </div>
                          <Link
                            href={`/${locale}/profile`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-primary-50 hover:text-primary-700"
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
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            {tCommon('logout')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mobile sign out button */}
                    <motion.button
                      onClick={handleSignOut}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-600 shadow-sm ring-1 ring-red-200/60 transition-all hover:from-red-100 hover:to-red-200"
                      title={tCommon('logout')}
                    >
                      <LogOut className="h-4.5 w-4.5" />
                    </motion.button>
                  </div>
                </>
              ) : !loading ? (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogin}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-700 hover:to-primary-600"
                  title={tCommon('login')}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{tCommon('login')}</span>
                </motion.button>
              ) : null}
            </div>
          </div>

          {/* Search Bar Section - compact on mobile */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="px-3 pb-2 md:px-4 md:pb-3"
          >
            <div className={cn(
              'relative overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-500 ease-smooth',
              searchFocused
                ? 'border-primary-300/80 bg-white shadow-lg shadow-primary-100/40 ring-2 md:ring-4 ring-primary-100/30'
                : 'border-slate-200/60 bg-gradient-to-r from-white/95 to-slate-50/95 shadow-sm md:shadow-md hover:shadow-lg'
            )}>
              {/* Animated gradient border glow on focus */}
              <div className={cn(
                'absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-0 transition-opacity duration-500 -z-10 blur-xl',
                searchFocused && 'opacity-100'
              )} />

              <Search className={cn(
                'pointer-events-none absolute top-1/2 h-4 w-4 md:h-4.5 md:w-4.5 -translate-y-1/2 transition-colors duration-300',
                isRtl ? 'right-3 md:right-4' : 'left-3 md:left-4',
                searchFocused ? 'text-primary-500' : 'text-slate-400'
              )} />
              <motion.input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={tHeader('searchPlaceholder')}
                className={cn(
                  'w-full bg-transparent py-2.5 md:py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400',
                  isRtl ? 'pl-24 pr-3 text-right md:pl-32 md:pr-4' : 'pr-24 pl-9 md:pr-32 md:pl-11',
                )}
                whileFocus={{ scale: 1.005 }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-3 py-1.5 md:px-5 md:py-2 text-xs font-semibold text-white shadow-md shadow-primary-500/25 transition-all hover:from-primary-700 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/35',
                  isRtl ? 'left-1.5 md:left-2' : 'right-1.5 md:right-2',
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
        <div className="space-y-5">
          {/* Navigation Items */}
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
                transition={{ delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:from-primary-50 hover:to-accent-50/30 hover:text-primary-700 hover:shadow-md hover:shadow-primary-100/30',
                    isRtl && 'flex-row-reverse'
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all group-hover:bg-primary-100 group-hover:text-primary-600">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className={cn(
              'rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/80 to-white/50 p-4 shadow-sm',
              isRtl && 'text-right'
            )}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
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

          {/* User Section */}
          {!loading && user ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="space-y-2"
            >
              {/* Messages Link */}
              <Link
                href={`/${locale}/messages`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/35',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <MessageCircle className="h-4.5 w-4.5" />
                </span>
                <span className="flex-1">{tCommon('message')}</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Link */}
              <Link
                href={`/${locale}/profile`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all group-hover:bg-primary-100 group-hover:text-primary-600">
                  <User className="h-4.5 w-4.5" />
                </span>
                {tCommon('account')}
              </Link>

              {/* Sign Out */}
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-red-50/50 px-4 py-3.5 text-sm font-medium text-red-600 shadow-sm transition-all hover:from-red-100 hover:to-red-50 hover:shadow-md',
                  isRtl && 'flex-row-reverse'
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-500 transition-all group-hover:bg-red-200">
                  <LogOut className="h-4.5 w-4.5" />
                </span>
                {tCommon('logout')}
              </button>
            </motion.div>
          ) : !loading ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              type="button"
              onClick={handleLogin}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/35',
                isRtl && 'flex-row-reverse'
              )}
            >
              <LogIn className="h-5 w-5" />
              {tCommon('login')}
            </motion.button>
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-500 text-center">
              {tCommon('loading')}
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};
