'use client';

// src/components/safety/SafetyTipsPage.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Shield,
  ShoppingCart,
  Store,
  AlertTriangle,
  CreditCard,
  MapPin,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  Lock,
  Users,
  MessageCircle,
  Phone,
  FileWarning,
  ShieldCheck,
  ShieldAlert,
  HandCoins,
  UserCheck,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface SafetyTipsPageProps {
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

/* ── Tip Item ── */
function TipItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      custom={index}
      variants={fadeUp}
      className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c00000] dark:text-[#ff7c00]" />
      <span>{text}</span>
    </motion.li>
  );
}

/* ── Section Card ── */
function SafetySection({
  icon: Icon,
  title,
  description,
  tips,
  index,
  accentColor,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  tips: string[];
  index: number;
  accentColor?: 'red' | 'orange' | 'amber';
}) {
  const colorMap = {
    red: {
      iconBg: 'from-[#c00000] to-[#ff4444]',
      border: 'from-[#c00000]/20 to-transparent',
      dot: 'bg-[#c00000]',
    },
    orange: {
      iconBg: 'from-[#ff7c00] to-[#ffaa44]',
      border: 'from-[#ff7c00]/20 to-transparent',
      dot: 'bg-[#ff7c00]',
    },
    amber: {
      iconBg: 'from-[#d97706] to-[#fbbf24]',
      border: 'from-[#d97706]/20 to-transparent',
      dot: 'bg-[#d97706]',
    },
  };

  const colors = colorMap[accentColor || 'red'];

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-800/60 md:p-8"
    >
      {/* Accent gradient top border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c00000] to-[#ff7c00] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#c00000]/5 to-[#ff7c00]/5 blur-3xl" />

      <div className="relative">
        {/* Icon & Title */}
        <div className="mb-5 flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md',
              colors.iconBg
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>

        {/* Tips list */}
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <TipItem key={i} text={tip} index={i} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ── Quick Tip Banner ── */
function QuickTipBanner({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#ff7c00]/20 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 dark:from-orange-950/20 dark:to-amber-950/20">
      <Icon className="h-5 w-5 flex-shrink-0 text-[#ff7c00]" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════ */
export const SafetyTipsPage: React.FC<SafetyTipsPageProps> = ({ locale }) => {
  const isRtl = isRTL(locale);
  const t = useTranslations('safetyTips');

  /* ── Buyer Tips ── */
  const buyerTips = [
    t('buyerTip1'),
    t('buyerTip2'),
    t('buyerTip3'),
    t('buyerTip4'),
    t('buyerTip5'),
    t('buyerTip6'),
  ];

  /* ── Seller Tips ── */
  const sellerTips = [
    t('sellerTip1'),
    t('sellerTip2'),
    t('sellerTip3'),
    t('sellerTip4'),
    t('sellerTip5'),
    t('sellerTip6'),
  ];

  /* ── Scam Spotting ── */
  const scamTips = [
    t('scamTip1'),
    t('scamTip2'),
    t('scamTip3'),
    t('scamTip4'),
    t('scamTip5'),
    t('scamTip6'),
  ];

  /* ── Safe Payment ── */
  const paymentTips = [
    t('paymentTip1'),
    t('paymentTip2'),
    t('paymentTip3'),
    t('paymentTip4'),
    t('paymentTip5'),
  ];

  /* ── Meeting Safely ── */
  const meetingTips = [
    t('meetingTip1'),
    t('meetingTip2'),
    t('meetingTip3'),
    t('meetingTip4'),
    t('meetingTip5'),
  ];

  /* ── What to do if something goes wrong ── */
  const wrongTips = [
    t('wrongTip1'),
    t('wrongTip2'),
    t('wrongTip3'),
    t('wrongTip4'),
    t('wrongTip5'),
  ];

  /* ── Sections data ── */
  const sections = [
    {
      icon: ShoppingCart,
      title: t('buyerTitle'),
      description: t('buyerDescription'),
      tips: buyerTips,
      accentColor: 'red' as const,
    },
    {
      icon: Store,
      title: t('sellerTitle'),
      description: t('sellerDescription'),
      tips: sellerTips,
      accentColor: 'orange' as const,
    },
    {
      icon: AlertTriangle,
      title: t('scamTitle'),
      description: t('scamDescription'),
      tips: scamTips,
      accentColor: 'amber' as const,
    },
    {
      icon: CreditCard,
      title: t('paymentTitle'),
      description: t('paymentDescription'),
      tips: paymentTips,
      accentColor: 'red' as const,
    },
    {
      icon: MapPin,
      title: t('meetingTitle'),
      description: t('meetingDescription'),
      tips: meetingTips,
      accentColor: 'orange' as const,
    },
    {
      icon: HelpCircle,
      title: t('wrongTitle'),
      description: t('wrongDescription'),
      tips: wrongTips,
      accentColor: 'amber' as const,
    },
  ];

  return (
    <main className="min-h-screen" style={{ background: 'var(--gradient-mesh), var(--bg)' }}>
      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--hero-glow)' }}
        />

        <div className="container relative mx-auto px-4 pb-16 pt-20 md:pb-24 md:pt-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
            >
              <Shield className="h-4 w-4 text-[#ff7c00]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {t('heroBadge')}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl lg:text-6xl"
            >
              {t('heroTitle')}{' '}
              <span className="bg-gradient-to-r from-[#c00000] to-[#ff7c00] bg-clip-text text-transparent">
                {t('heroTitleHighlight')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`/${locale}/contact-us`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
              >
                {t('heroCta')}
                <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
              </a>
              <a
                href={`/${locale}/search`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <Eye className="h-4 w-4" />
                {t('heroCtaSecondary')}
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="var(--bg)"
              fillOpacity="0.6"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUICK TIPS BANNER
          ═══════════════════════════════════════ */}
      <section className="relative z-10 -mt-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickTipBanner icon={ShieldCheck} text={t('quickTip1')} />
            <QuickTipBanner icon={Lock} text={t('quickTip2')} />
            <QuickTipBanner icon={UserCheck} text={t('quickTip3')} />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          MAIN SAFETY SECTIONS
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-6xl"
          >
            {/* Section header */}
            <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#ff7c00]">
                {t('sectionsLabel')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                {t('sectionsTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
                {t('sectionsSubtitle')}
              </p>
            </motion.div>

            {/* Sections grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {sections.map((section, i) => (
                <SafetySection
                  key={i}
                  icon={section.icon}
                  title={section.title}
                  description={section.description}
                  tips={section.tips}
                  index={i + 1}
                  accentColor={section.accentColor}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          IMPORTANT REMINDERS
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-xl backdrop-blur-md dark:border-slate-700/40 dark:from-red-950/20 dark:to-orange-950/20 md:p-12"
            >
              {/* Decorative elements */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c00000]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#ff7c00]/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c00000] to-[#ff7c00] shadow-lg">
                    <ShieldAlert className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
                    {t('remindersTitle')}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: BadgeCheck, text: t('reminder1') },
                    { icon: Clock, text: t('reminder2') },
                    { icon: MessageCircle, text: t('reminder3') },
                    { icon: HandCoins, text: t('reminder4') },
                    { icon: Phone, text: t('reminder5') },
                    { icon: FileWarning, text: t('reminder6') },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      custom={i + 1}
                      variants={fadeUp}
                      className="flex items-start gap-3 rounded-xl bg-white/60 p-4 shadow-sm dark:bg-slate-800/40"
                    >
                      <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c00000] dark:text-[#ff7c00]" />
                      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-4 shadow-md dark:from-red-950/20 dark:to-orange-950/20"
            >
              <Shield className="h-8 w-8 text-[#c00000] dark:text-[#ff7c00]" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl"
            >
              {t('ctaTitle')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400"
            >
              {t('ctaSubtitle')}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`/${locale}/contact-us`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
              >
                {t('ctaPrimary')}
                <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
              </a>
              <a
                href={`/${locale}/about-us`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <Users className="h-4 w-4" />
                {t('ctaSecondary')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
