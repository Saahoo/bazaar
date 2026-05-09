'use client';

// src/components/contact/ContactUsPage.tsx
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';
import { contactFormSchema, type ContactFormData } from '@/lib/validators/contact';

interface ContactUsPageProps {
  locale: Locale;
}

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Contact info card ── */
function ContactInfoCard({
  icon: Icon,
  title,
  lines,
  index,
}: {
  icon: React.ElementType;
  title: string;
  lines: string[];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-800/60"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c00000] to-[#ff7c00] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-3 dark:from-red-950/30 dark:to-orange-950/30">
        <Icon className="h-6 w-6 text-[#c00000] dark:text-[#ff7c00]" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {lines.map((line, i) => (
        <p key={i} className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {line}
        </p>
      ))}
    </motion.div>
  );
}

/* ── Main component ── */
export function ContactUsPage({ locale }: ContactUsPageProps) {
  const t = useTranslations('contactUs');
  const rtl = isRTL(locale);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setSubmitStatus('success');
      reset();
    } catch (err: unknown) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('emailTitle'),
      lines: ['support@bazaar.af', 'info@bazaar.af'],
    },
    {
      icon: Phone,
      title: t('phoneTitle'),
      lines: ['+93 700 000 000', '+93 799 000 000'],
    },
    {
      icon: MapPin,
      title: t('addressTitle'),
      lines: [t('addressLine1'), t('addressLine2')],
    },
    {
      icon: Clock,
      title: t('hoursTitle'),
      lines: [t('hoursWeekday'), t('hoursWeekend')],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#c00000]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#ff7c00]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.span
              custom={0}
              variants={fadeUp}
              className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#c00000]/10 to-[#ff7c00]/10 px-4 py-1.5 text-sm font-semibold text-[#c00000] dark:from-[#c00000]/20 dark:to-[#ff7c00]/20 dark:text-[#ff7c00]"
            >
              {t('badge')}
            </motion.span>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {t('heroTitle')}{' '}
              <span className="bg-gradient-to-r from-[#c00000] to-[#ff7c00] bg-clip-text text-transparent">
                {t('heroHighlight')}
              </span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400"
            >
              {t('heroSubtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactInfo.map((info, i) => (
            <ContactInfoCard
              key={i}
              icon={info.icon}
              title={info.title}
              lines={info.lines}
              index={i}
            />
          ))}
        </motion.div>
      </section>

      {/* ── Form + Map Section ── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── Contact Form ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60 sm:p-10">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                {t('formTitle')}
              </h2>
              <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
                {t('formSubtitle')}
              </p>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                      <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                      {t('successTitle')}
                    </h3>
                    <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      {t('successMessage')}
                    </p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
                    >
                      {t('sendAnother')}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                  >
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className={cn(
                          'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300',
                          rtl && 'text-right'
                        )}
                      >
                        {t('fullNameLabel')} <span className="text-[#c00000]">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder={t('fullNamePlaceholder')}
                        {...register('fullName')}
                        className={cn(
                          'w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
                          errors.fullName
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-800'
                            : 'border-slate-200 focus:border-[#c00000] focus:ring-red-100 dark:border-slate-700 dark:focus:ring-red-900'
                        )}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className={cn(
                          'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300',
                          rtl && 'text-right'
                        )}
                      >
                        {t('emailLabel')} <span className="text-[#c00000]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        {...register('email')}
                        className={cn(
                          'w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
                          errors.email
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-800'
                            : 'border-slate-200 focus:border-[#c00000] focus:ring-red-100 dark:border-slate-700 dark:focus:ring-red-900'
                        )}
                      />
                      {errors.email && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className={cn(
                          'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300',
                          rtl && 'text-right'
                        )}
                      >
                        {t('subjectLabel')} <span className="text-[#c00000]">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        placeholder={t('subjectPlaceholder')}
                        {...register('subject')}
                        className={cn(
                          'w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
                          errors.subject
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-800'
                            : 'border-slate-200 focus:border-[#c00000] focus:ring-red-100 dark:border-slate-700 dark:focus:ring-red-900'
                        )}
                      />
                      {errors.subject && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className={cn(
                          'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300',
                          rtl && 'text-right'
                        )}
                      >
                        {t('messageLabel')} <span className="text-[#c00000]">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder={t('messagePlaceholder')}
                        {...register('message')}
                        className={cn(
                          'w-full resize-none rounded-xl border bg-white/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500',
                          errors.message
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:ring-red-800'
                            : 'border-slate-200 focus:border-[#c00000] focus:ring-red-100 dark:border-slate-700 dark:focus:ring-red-900'
                        )}
                      />
                      {errors.message && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Error banner */}
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errorMessage}
                      </motion.div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className={cn(
                        'inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300',
                        submitStatus === 'loading'
                          ? 'cursor-not-allowed bg-slate-400 dark:bg-slate-600'
                          : 'bg-gradient-to-r from-[#c00000] to-[#ff7c00] hover:shadow-xl hover:brightness-110'
                      )}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t('submitButton')}
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Map + Quick Actions ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInRight}
            className="flex flex-col gap-6 lg:col-span-2"
          >
            {/* Embedded Map */}
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
              <div className="p-4">
                <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                  {t('mapTitle')}
                </h3>
              </div>
              <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-700">
                <iframe
                  title="Bazaar Office Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=69.1%2C34.5%2C69.3%2C34.6&layer=mapnik&marker=34.52%2C69.18"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <a
                  href="https://www.google.com/maps?q=34.52,69.18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#c00000] transition-colors hover:text-[#ff7c00] dark:text-[#ff7c00] dark:hover:text-[#c00000]"
                >
                  {t('openInMaps')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Chat Card */}
            <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-[#c00000]/5 to-[#ff7c00]/5 p-6 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:from-[#c00000]/10 dark:to-[#ff7c00]/10">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-3 dark:from-red-950/30 dark:to-orange-950/30">
                <MessageSquare className="h-6 w-6 text-[#c00000] dark:text-[#ff7c00]" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {t('chatTitle')}
              </h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {t('chatDescription')}
              </p>
              <button
                onClick={() => {
                  // @ts-expect-error Tawk.to global
                  if (window.Tawk_API?.toggle) {
                    // @ts-expect-error Tawk.to global
                    window.Tawk_API.toggle();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110"
              >
                <MessageSquare className="h-4 w-4" />
                {t('startChat')}
              </button>
            </div>

            {/* FAQ Teaser */}
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {t('faqTitle')}
              </h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {t('faqDescription')}
              </p>
              <ul className="space-y-2">
                {[t('faq1'), t('faq2'), t('faq3')].map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#c00000] to-[#ff7c00]" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* ── Extra animation variant ── */
const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
