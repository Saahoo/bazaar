'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, Phone, User, ArrowRight,
  CheckCircle2, Loader2, ChevronDown, Search, X, Shield, ShieldCheck, ShieldAlert,
} from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { LegalReadNotice } from '@/components/common/LegalReadNotice';
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  getCountryDisplayName,
  PASSWORD_RULES,
  validatePassword,
  isPasswordValid,
  type CountryCode,
} from '@/lib/constants/country-codes';

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
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const socialFade = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Country Code Dropdown Component ── */
interface CountryCodeDropdownProps {
  locale: string;
  rtl: boolean;
  selected: CountryCode;
  onSelect: (c: CountryCode) => void;
}

const CountryCodeDropdown: React.FC<CountryCodeDropdownProps> = ({ locale, rtl, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = COUNTRY_CODES.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.namePs && c.namePs.includes(q)) ||
      (c.nameFa && c.nameFa.includes(q))
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-3 rounded-2xl border border-slate-200/80 bg-white/60 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-white hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 min-w-[110px] shrink-0"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-slate-600">{selected.dial}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 mt-2 w-72 max-h-72 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden ${
              rtl ? 'left-0' : 'left-0'
            }`}
          >
            {/* Search */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${rtl ? 'right-3' : 'left-3'}`} />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={locale === 'en' ? 'Search country...' : locale === 'ps' ? 'هیواد ولولئ...' : 'کشور را جستجو کنید...'}
                  className={`w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 ${rtl ? 'text-right pr-9 pl-3' : 'text-left'}`}
                  dir={rtl ? 'rtl' : 'ltr'}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    title="Clear search"
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${rtl ? 'left-2' : 'right-2'}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Country list */}
            <div className="overflow-y-auto max-h-56 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  {locale === 'en' ? 'No countries found' : locale === 'ps' ? 'هیواد ونه موندل شو' : 'کشوری یافت نشد'}
                </div>
              ) : (
                filtered.map((country) => (
                  <button
                    key={`${country.code}-${country.dial}`}
                    type="button"
                    onClick={() => {
                      onSelect(country);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-primary-50 ${
                      selected.code === country.code && selected.dial === country.dial
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-slate-700'
                    } ${rtl ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span className="flex-1 truncate">{getCountryDisplayName(country, locale)}</span>
                    <span className="text-slate-400 text-xs font-mono">{country.dial}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Password Requirements Tooltip ── */
interface PasswordTooltipProps {
  password: string;
  locale: string;
  rtl: boolean;
}

const PasswordTooltip: React.FC<PasswordTooltipProps> = ({ password, locale, rtl }) => {
  const results = validatePassword(password);
  const allValid = isPasswordValid(password);
  const hasStarted = password.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-40 w-72 rounded-2xl border bg-white shadow-xl shadow-slate-900/10 p-4 ${
        allValid && hasStarted
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-slate-200'
      } ${rtl ? 'left-0' : 'right-0'}`}
      style={{ top: 'calc(100% + 8px)' }}
    >
      {/* Arrow */}
      <div
        className={`absolute -top-1.5 w-3 h-3 bg-white border-slate-200 border-r border-t rotate-45 ${
          rtl ? 'left-6' : 'right-6'
        } ${allValid && hasStarted ? 'border-emerald-200 bg-emerald-50/50' : ''}`}
      />

      {/* Header */}
      <div className={`flex items-center gap-2 mb-3 ${rtl ? 'flex-row-reverse' : ''}`}>
        {allValid && hasStarted ? (
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        ) : hasStarted ? (
          <ShieldAlert className="w-4 h-4 text-amber-500" />
        ) : (
          <Shield className="w-4 h-4 text-slate-400" />
        )}
        <span className={`text-xs font-semibold uppercase tracking-wider ${
          allValid && hasStarted
            ? 'text-emerald-700'
            : hasStarted
              ? 'text-amber-700'
              : 'text-slate-500'
        }`}>
          {locale === 'en'
            ? allValid && hasStarted ? 'All requirements met' : 'Password requirements'
            : locale === 'ps'
              ? allValid && hasStarted ? 'ټول اړتیاوې پوره شوې' : 'د رمز اړتیاوې'
              : allValid && hasStarted ? 'تمام الزامات برآورده شد' : 'الزامات رمز عبور'}
        </span>
      </div>

      {/* Rules list */}
      <div className="space-y-2">
        {PASSWORD_RULES.map((rule) => {
          const passed = results[rule.key];
          const label = locale === 'ps' ? rule.labelPs : locale === 'fa' ? rule.labelFa : rule.labelEn;
          return (
            <motion.div
              key={rule.key}
              initial={false}
              animate={{ opacity: 1 }}
              className={`flex items-start gap-2.5 ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <div className={`mt-0.5 flex-shrink-0 transition-all duration-300 ${
                passed
                  ? 'text-emerald-500'
                  : hasStarted
                    ? 'text-slate-300'
                    : 'text-slate-300'
              }`}>
                {passed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-current" />
                )}
              </div>
              <span className={`text-xs leading-relaxed transition-colors duration-300 ${
                passed
                  ? 'text-emerald-700 font-medium'
                  : hasStarted
                    ? 'text-slate-600'
                    : 'text-slate-400'
              }`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Strength bar */}
      {hasStarted && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${
              allValid ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {locale === 'en' ? 'Strength' : locale === 'ps' ? 'پیاوړتیا' : 'قدرت'}
            </span>
            <span className={`text-[10px] font-bold ${
              allValid ? 'text-emerald-600' : 'text-slate-400'
            }`}>
              {allValid
                ? (locale === 'en' ? 'Strong' : locale === 'ps' ? 'پیاوړی' : 'قوی')
                : (locale === 'en' ? 'Weak' : locale === 'ps' ? 'ضعیف' : 'ضعیف')}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Object.values(results).filter(Boolean).length / PASSWORD_RULES.length) * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`h-full rounded-full transition-colors duration-300 ${
                allValid
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ── Main SignUpForm ── */
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
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [hasReadLegal, setHasReadLegal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const passwordValid = isPasswordValid(password);

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
  };

  /* ── Form submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid(password)) {
      setError(locale === 'en'
        ? 'Password does not meet all requirements.'
        : locale === 'ps'
          ? 'رمز ټول اړتیاوې نه لري.'
          : 'رمز عبور تمام الزامات را برآورده نمی‌کند.');
      return;
    }

    if (password !== confirmPassword) {
      setError(tForm('passwordMismatch'));
      return;
    }

    if (!phoneNumber.trim()) {
      setError(locale === 'en'
        ? 'Phone number is required.'
        : locale === 'ps'
          ? 'د تلیفون شمیره اړینه ده.'
          : 'شماره تلفن الزامی است.');
      return;
    }

    if (!hasReadLegal || !agreeTerms) {
      setError(tLegal('readRequired'));
      return;
    }

    setLoading(true);

    const fullPhone = `${selectedCountry.dial}${phoneNumber.trim()}`;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          phone: fullPhone,
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

  /* ── Success state ── */
  if (success) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur-xl"
        >
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
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-900">{t('registerTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {locale === 'en' ? 'Join the Bazaar community' : locale === 'ps' ? 'د بازار ټولنې سره یوځای شئ' : 'به جامعه بازار بپیوندید'}
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
            { key: 'apple', icon: AppleIcon, label: 'Apple', color: 'hover:bg-slate-100 hover:border-slate-300 focus:bg-slate-100 focus:border-slate-300' },
            { key: 'github', icon: GitHubIcon, label: 'GitHub', color: 'hover:bg-slate-100 hover:border-slate-300 focus:bg-slate-100 focus:border-slate-300' },
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
          transition={{ delay: 0.2 }}
          className="relative flex items-center gap-3 mb-6"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {locale === 'en' ? 'or sign up with email' : locale === 'ps' ? 'یا بریښنالیک سره ثبت نام' : 'یا با ایمیل ثبت‌نام کنید'}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </motion.div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="relative space-y-4">
          {/* Full Name */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {tForm('name')} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <User className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tForm('name')}
                className={`w-full px-4 py-3 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 placeholder:text-slate-400 ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
                dir={rtl ? 'rtl' : 'ltr'}
                required
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('email')} <span className="text-red-500">*</span>
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

          {/* Phone Number (mandatory) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('phone')} <span className="text-red-500">*</span>
            </label>
            <div className={`flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              {/* Country code dropdown */}
              <CountryCodeDropdown
                locale={locale}
                rtl={rtl}
                selected={selectedCountry}
                onSelect={setSelectedCountry}
              />
              {/* Phone number input */}
              <div className="relative group flex-1">
                <Phone className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-3' : 'right-3'}`} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="7XX XXX XXXX"
                  className={`w-full px-4 py-3 border border-slate-200/80 rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100/50 focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-100/20 placeholder:text-slate-400 ${rtl ? 'text-right pl-10' : 'text-left pr-10'}`}
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Password with floating tooltip */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={8}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('password')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="relative group">
                <Lock className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-12' : 'right-12'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:bg-white focus:shadow-lg placeholder:text-slate-400 ${
                    passwordValid && password.length > 0
                      ? 'border-emerald-300 focus:ring-emerald-100/50 focus:border-emerald-400 focus:shadow-emerald-100/20'
                      : 'border-slate-200/80 focus:ring-primary-100/50 focus:border-primary-400 focus:shadow-primary-100/20'
                  } ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
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
                {/* Password strength indicator dot */}
                {password.length > 0 && (
                  <div className={`absolute top-1/2 -translate-y-1/2 ${rtl ? 'left-3' : 'left-3'}`}>
                    <motion.div
                      initial={false}
                      animate={{
                        scale: passwordValid ? 1 : 0.8,
                        backgroundColor: passwordValid ? '#10b981' : '#f59e0b',
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  </div>
                )}
              </div>

              {/* Floating password requirements tooltip */}
              <AnimatePresence>
                {passwordFocused && (
                  <PasswordTooltip
                    password={password}
                    locale={locale}
                    rtl={rtl}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={9}>
            <label className={`block text-sm font-semibold text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`}>
              {t('confirmPassword')} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Lock className={`w-4.5 h-4.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-primary-500 ${rtl ? 'left-4' : 'right-4'}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-2xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:bg-white focus:shadow-lg placeholder:text-slate-400 ${
                  confirmPassword.length > 0 && password === confirmPassword
                    ? 'border-emerald-300 focus:ring-emerald-100/50 focus:border-emerald-400 focus:shadow-emerald-100/20'
                    : confirmPassword.length > 0 && password !== confirmPassword
                      ? 'border-red-300 focus:ring-red-100/50 focus:border-red-400 focus:shadow-red-100/20'
                      : 'border-slate-200/80 focus:ring-primary-100/50 focus:border-primary-400 focus:shadow-primary-100/20'
                } ${rtl ? 'text-right pl-12' : 'text-left pr-12'}`}
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <div className={`absolute top-1/2 -translate-y-1/2 ${rtl ? 'left-3' : 'left-3'}`}>
                  {password === confirmPassword ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Legal Read Notice */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={10}>
            <LegalReadNotice
              locale={locale}
              initialRead={hasReadLegal}
              onReadChange={setHasReadLegal}
            />
          </motion.div>

          {/* Terms checkbox */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={11}
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
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={12}>
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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

        {/* ── Login Link ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative mt-5 text-center text-sm text-slate-500"
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
    </div>
  );
};
