// src/components/auth/ResetPasswordForm.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';

interface ResetPasswordFormProps {
  locale: Locale;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ locale }) => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const tForm = useTranslations('form');
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
      >
        {/* Decorative gradient blurs */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25"
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 text-xl font-bold text-slate-900"
          >
            {t('passwordUpdated')}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110"
            >
              {t('loginButton')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      {/* Decorative gradient blurs */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25"
        >
          <ShieldCheck className="h-7 w-7 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-slate-900"
        >
          {t('resetPassword')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-2 flex items-center justify-center gap-1.5 text-sm text-slate-500"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-400" />
          {t('newPasswordDesc')}
        </motion.p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-red-200/60 bg-red-50/80 p-3 text-center text-sm text-red-700 backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        {/* New Password */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className={`mb-1.5 block text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('newPassword')}
          </label>
          <div className="group relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200 focus:border-primary-400 focus:bg-white/80 focus:shadow-lg focus:ring-4 focus:ring-primary-100/50 focus:outline-none ${rtl ? 'text-right' : 'text-left'}`}
              dir="ltr"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 ${rtl ? 'left-3' : 'right-3'}`}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className={`mb-1.5 block text-sm font-medium text-slate-700 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('confirmPassword')}
          </label>
          <div className="group relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-200 focus:border-primary-400 focus:bg-white/80 focus:shadow-lg focus:ring-4 focus:ring-primary-100/50 focus:outline-none ${rtl ? 'text-right' : 'text-left'}`}
              dir="ltr"
              required
            />
            <Lock className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-3' : 'right-3'}`} />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full rounded-2xl bg-gradient-to-r py-3 text-sm font-semibold text-white shadow-lg transition-all ${
              loading
                ? 'cursor-not-allowed from-primary-400 to-primary-400 shadow-primary-200/25'
                : 'from-primary-500 to-primary-600 shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {tCommon('loading')}
              </span>
            ) : (
              t('updatePassword')
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};
