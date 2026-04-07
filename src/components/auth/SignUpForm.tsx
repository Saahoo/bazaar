'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Phone, User } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';

interface SignUpFormProps {
  locale: Locale;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ locale }) => {
  const t = useTranslations('auth');
  const tForm = useTranslations('form');
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass = `w-full px-4 py-3 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(tForm('passwordMismatch'));
      return;
    }
    if (!agreeTerms) return;

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
            ? 'دا بریښنالیک له مخکې ثبت شوی دی.'
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
          ? 'دا بریښنالیک له مخکې ثبت شوی دی.'
          : 'حسابی با این ایمیل قبلاً وجود دارد.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{t('registerSuccess')}</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Check your email to confirm your account.
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          {t('loginButton')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          B
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{t('registerTitle')}</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {tForm('name')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              dir={rtl ? 'rtl' : 'ltr'}
              required
            />
            <User className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
              dir="ltr"
              required
            />
            <Mail className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('phone')}
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+93 7XX XXX XXXX"
              className={inputClass}
              dir="ltr"
            />
            <Phone className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('password')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              dir="ltr"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${rtl ? 'left-3' : 'right-3'}`}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className={`block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('confirmPassword')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              dir="ltr"
              required
            />
            <Lock className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${rtl ? 'left-3' : 'right-3'}`} />
          </div>
        </div>

        {/* Terms */}
        <div className={`flex items-start gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            required
          />
          <label
            htmlFor="agree-terms"
            className={`text-sm text-slate-600 cursor-pointer ${rtl ? 'text-right' : 'text-left'}`}
          >
            {t('agreeTerms')} <span className="text-red-500">*</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            loading || !agreeTerms
              ? 'bg-primary-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {loading ? tCommon('loading') : t('registerButton')}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-slate-600">
        {t('alreadyAccount')}{' '}
        <Link
          href={`/${locale}/login`}
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          {t('loginButton')}
        </Link>
      </p>
    </div>
  );
};
