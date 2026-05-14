'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';

/* ── Social provider SVG icons ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.18 0-1.11.49-2.22.44-3.06-.4C4.08 16.28 4.5 10.08 8.28 9.88c1.2-.06 2.02.62 2.72.66.72-.02 1.64-.78 2.78-.66 1.36.12 2.36.78 2.92 1.94-2.56 1.52-2.14 4.98.4 5.98-.5 1.28-1.16 2.56-2.06 3.48zM12.04 9.86c-.08-2.18 1.62-3.96 3.54-4.08.3 2.32-1.98 4.08-3.54 4.08z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const socialFade = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface LoginFormProps {
  locale: Locale;
}

export const LoginForm: React.FC<LoginFormProps> = ({ locale }) => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  /* ── Social login handlers ── */
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple' | 'github') => {
    setSocialLoading(provider);
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: provider === 'facebook' ? 'facebook' : provider,
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    });
    if (authError) {
      setError(authError.message);
      setSocialLoading(null);
    }
    // If successful, Supabase redirects automatically
  };

  /* ── Email/password login ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        setError(locale === 'en'
          ? 'Please confirm your email first. Check your inbox for the confirmation link.'
          : locale === 'ps'
            ? 'لطفاً اول خپل بریښنالیک تایید کړئ.'
            : 'لطفاً ابتدا ایمیل خود را تأیید کنید.');
      } else {
        setError(authError.message);
      }
      return;
    }

    window.location.href = `/${locale}`;
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* ── Card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary-500/5 blur-[80px] pointer-events-none" />

        {/* ── Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="relative text-center mb-6"
        >
          <div className="relative mx-auto mb-3 h-14 w-14">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-lg font-bold text-white shadow-lg shadow-primary-500/30">
              B
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-30 blur-lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('loginTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {locale === 'en' ? 'Welcome back to Bazaar' : locale === 'ps' ? 'بازار ته بیرته ښه راغلاست' : 'به بازار خوش آمدید'}
          </p>
        </motion.div>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-red-50/50 p-3 text-center text-sm text-red-700"
            >
              <span className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold">!</span>
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Social Login Buttons ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="relative grid grid-cols-2 gap-3 mb-6"
        >
          {([
            { key: 'google', icon: GoogleIcon, label: 'Google', color: 'hover:bg-red-50 hover:border-red-200 focus:bg-red-50 focus:border-red-200' },
            { key: 'facebook', icon: FacebookIcon, label: 'Facebook', color: 'hover:bg-blue-50 hover:border-blue-200 focus:bg-blue-50 focus:border-blue-200' },
            { key: 'apple', icon: AppleIcon, label: 'Apple', color: 'hover:bg-slate-100 hover:border-slate-300 focus:bg-slate-100 focus:border-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600' },
            { key: 'github', icon: GitHubIcon, label: 'GitHub', color: 'hover:bg-slate-100 hover:border-slate-300 focus:bg-slate-100 focus:border-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600' },
          ] as const).map((social, i) => (
            <motion.button
              key={social.key}
              type="button"
              variants={socialFade}
              custom={i}
              onClick={() => handleSocialLogin(social.key as 'google' | 'facebook' | 'apple' | 'github')}
              disabled={socialLoading !== null}
              className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/60 text-sm font-medium text-slate-700 transition-all duration-300 ${social.color} disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]`}
            >
              {socialLoading === social.key ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              ) : (
                <social.icon />
              )}
              <span>{social.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative flex items-center gap-3 mb-6"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {locale === 'en' ? 'or continue with email' : locale === 'ps' ? 'یا بریښنالیک سره' : 'یا با ایمیل'}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </motion.div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="relative space-y-4">
          {/* Email */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('email')}
            </label>
            <div className="relative group">
              <Mail className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full px-4 py-3 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 placeholder:text-slate-400 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
                dir="ltr"
                required
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <div className={`flex items-center justify-between mb-1.5 ${rtl ? 'flex-row-reverse' : ''}`}>
              <label className="text-sm font-semibold text-slate-700">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => window.location.href = `/${locale}/forgot-password`}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <div className="relative group">
              <Lock className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-12'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 placeholder:text-slate-400 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3.5 rounded-2xl font-semibold text-white text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40'
              }`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {tCommon('loading')}
                </span>
              ) : (
                <>
                  {t('loginButton')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* ── Sign Up Link ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative mt-5 text-center text-sm text-slate-500"
        >
          {t('noAccount')}{' '}
          <Link
            href={`/${locale}/signup`}
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            {t('registerButton')}
          </Link>
        </motion.p>
      </div>
    </div>
  );
};
