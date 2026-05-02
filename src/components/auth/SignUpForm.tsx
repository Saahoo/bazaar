'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Phone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';

interface SignUpFormProps {
  locale: Locale;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ locale }) => {
  const t = useTranslations('auth');
  const tForm = useTranslations('form');
  const tCommon = useTranslations('common');
  const tLegal = useTranslations('legal');
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [hasReadLegal, setHasReadLegal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(tForm('passwordMismatch'));
      return;
    }
    if (!hasReadLegal || !agreeTerms) {
      setError(tLegal('readRequired'));
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          phone: phone || undefined,
        },
        emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        setError(locale === 'en'
          ? 'An account already exists with this email.'
          : locale === 'ps'
            ? 'دا بریښنالیک له مخکې ثبت سوی دی.'
            : 'حسابی با این ایمیل قبلاً وجود دارد.');
      } else {
        setError(authError.message);
      }
      return;
    }

    // Supabase returns a fake user with no identities when email already exists (to prevent enumeration)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError(locale === 'en'
        ? 'An account already exists with this email.'
        : locale === 'ps'
          ? 'دا بریښنالیک له مخکې ثبت سوی دی.'
          : 'حسابی با این ایمیل قبلاً وجود دارد.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl"
      >
        {/* Decorative gradient blurs */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </motion.div>
        <h2 className="relative text-xl font-bold text-slate-900 mb-2">{t('registerSuccess')}</h2>
        <p className="relative text-slate-500 mb-6 text-sm">
          {locale === 'en' ? 'Check your email to confirm your account.' : locale === 'ps' ? 'خپل بریښنالیک وګورئ د خپل حساب تایید لپاره.' : 'ایمیل خود را برای تأیید حساب بررسی کنید.'}
        </p>
        <Link
          href={`/${locale}/login`}
          className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-700 hover:to-primary-600"
        >
          {t('loginButton')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      {/* Decorative gradient blurs */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center mb-8"
      >
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-xl font-bold text-white shadow-lg shadow-primary-500/30">
            B
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-30 blur-lg" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{t('registerTitle')}</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {locale === 'en' ? 'Join the Bazaar community' : locale === 'ps' ? 'د بازار ټولنې سره یوځای شئ' : 'به جامعه بازار بپیوندید'}
        </p>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-red-50/50 p-4 text-center text-sm text-red-700"
          >
            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px]">!</span>
              {error}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative space-y-4">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {tForm('name')} <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <User className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tForm('name')}
              title={tForm('name')}
              className={`w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
              dir={rtl ? 'rtl' : 'ltr'}
              required
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <Mail className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
              dir="ltr"
              required
            />
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('phone')}
          </label>
          <div className="relative group">
            <Phone className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+93 7XX XXX XXXX"
              className={`w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
              dir="ltr"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('password')} <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <Lock className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-12'}`} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
              dir="ltr"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 ${rtl ? 'right-3' : 'right-3'}`}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className={`block text-sm font-semibold text-slate-700 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('confirmPassword')} <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <Lock className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
              dir="ltr"
              required
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LegalReadNotice
            locale={locale}
            initialRead={hasReadLegal}
            onReadChange={setHasReadLegal}
          />
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}
        >
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition"
            disabled={!hasReadLegal}
            required
          />
          <label
            htmlFor="agree-terms"
            className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
          >
            {t('agreeTerms')} <span className="text-red-500">*</span>
          </label>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="submit"
            disabled={loading || !agreeTerms || !hasReadLegal}
            whileHover={{ scale: (loading || !agreeTerms || !hasReadLegal) ? 1 : 1.01 }}
            whileTap={{ scale: (loading || !agreeTerms || !hasReadLegal) ? 1 : 0.98 }}
            className={`w-full py-3.5 rounded-2xl font-semibold text-white text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              loading || !agreeTerms || !hasReadLegal
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {tCommon('loading')}
              </span>
            ) : (
              <>
                {t('registerButton')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Login Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative mt-6 text-center text-sm text-slate-500"
      >
        {t('alreadyAccount')}{' '}
        <Link
          href={`/${locale}/login`}
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          {t('loginButton')}
        </Link>
      </motion.p>
    </div>
  );
};
