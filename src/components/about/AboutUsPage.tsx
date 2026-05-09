'use client';

// src/components/about/AboutUsPage.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  Target,
  Eye,
  Sparkles,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Store,
  Lock,
  BarChart3,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

interface AboutUsPageProps {
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

/* ── Stat card ── */
function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
    >
      <span className="bg-gradient-to-r from-[#c00000] to-[#ff7c00] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
        {value}
      </span>
      <span className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </motion.div>
  );
}

/* ── Feature card ── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-800/60"
    >
      {/* Accent gradient top border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c00000] to-[#ff7c00] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-3 dark:from-red-950/30 dark:to-orange-950/30">
        <Icon className="h-6 w-6 text-[#c00000] dark:text-[#ff7c00]" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
    </motion.div>
  );
}

/* ── Value card ── */
function ValueCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="flex gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c00000] to-[#ff7c00] text-white shadow-md">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-1 font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}

/* ── Timeline step ── */
function TimelineStep({
  year,
  title,
  description,
  index,
  isLast,
}: {
  year: string;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div custom={index} variants={fadeUp} className="relative flex gap-6 pb-8">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute start-[1.1rem] top-10 bottom-0 w-px bg-gradient-to-b from-[#c00000]/30 to-[#ff7c00]/30" />
      )}
      {/* Dot */}
      <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c00000] to-[#ff7c00] text-xs font-bold text-white shadow-md">
        {index + 1}
      </div>
      <div className="pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#ff7c00]">{year}</span>
        <h4 className="mt-1 font-bold text-slate-900 dark:text-slate-100">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════ */
export const AboutUsPage: React.FC<AboutUsPageProps> = ({ locale }) => {
  const isRtl = isRTL(locale);
  const t = useTranslations('aboutUs');

  /* ── Stats data ── */
  const stats = [
    { value: t('statUsersValue'), label: t('statUsersLabel') },
    { value: t('statListingsValue'), label: t('statListingsLabel') },
    { value: t('statCitiesValue'), label: t('statCitiesLabel') },
    { value: t('statTransactionsValue'), label: t('statTransactionsLabel') },
  ];

  /* ── Why Choose Us features ── */
  const features = [
    { icon: Shield, title: t('featureTrustTitle'), description: t('featureTrustDesc') },
    { icon: Zap, title: t('featureFastTitle'), description: t('featureFastDesc') },
    { icon: Globe, title: t('featureLocalTitle'), description: t('featureLocalDesc') },
    { icon: Lock, title: t('featureSecureTitle'), description: t('featureSecureDesc') },
    { icon: MessageCircle, title: t('featureChatTitle'), description: t('featureChatDesc') },
    { icon: BarChart3, title: t('featureAnalyticsTitle'), description: t('featureAnalyticsDesc') },
  ];

  /* ── Core values ── */
  const values = [
    { icon: Heart, title: t('valueCommunityTitle'), description: t('valueCommunityDesc') },
    { icon: Target, title: t('valueExcellenceTitle'), description: t('valueExcellenceDesc') },
    { icon: Eye, title: t('valueTransparencyTitle'), description: t('valueTransparencyDesc') },
    { icon: Sparkles, title: t('valueInnovationTitle'), description: t('valueInnovationDesc') },
  ];

  /* ── Timeline / Journey ── */
  const timeline = [
    { year: t('timeline1Year'), title: t('timeline1Title'), description: t('timeline1Desc') },
    { year: t('timeline2Year'), title: t('timeline2Title'), description: t('timeline2Desc') },
    { year: t('timeline3Year'), title: t('timeline3Title'), description: t('timeline3Desc') },
    { year: t('timeline4Year'), title: t('timeline4Title'), description: t('timeline4Desc') },
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
            <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60">
              <Sparkles className="h-4 w-4 text-[#ff7c00]" />
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
                href={`/${locale}/search`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110"
              >
                {t('heroCta')}
                <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
              </a>
              <a
                href={`/${locale}/post-ad`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <Store className="h-4 w-4" />
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
          STATS BAR
          ═══════════════════════════════════════ */}
      <section className="relative z-10 -mt-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          OUR STORY
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Left: Image / Illustration */}
              <motion.div variants={fadeUp} custom={0} className="relative">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-xl dark:from-red-950/20 dark:to-orange-950/20">
                  {/* Decorative circles */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#c00000]/10 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#ff7c00]/10 blur-2xl" />

                  <div className="relative flex flex-col items-center gap-6 py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c00000] to-[#ff7c00] shadow-lg">
                      <Store className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-3">
                      {[Users, TrendingUp, Globe].map((Icon, i) => (
                        <div
                          key={i}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-md dark:bg-slate-800/80"
                        >
                          <Icon className="h-5 w-5 text-[#c00000] dark:text-[#ff7c00]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Text */}
              <motion.div variants={fadeUp} custom={1}>
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#ff7c00]">
                  {t('storyLabel')}
                </span>
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                  {t('storyTitle')}
                </h2>
                <p className="mb-4 leading-relaxed text-slate-500 dark:text-slate-400">
                  {t('storyParagraph1')}
                </p>
                <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                  {t('storyParagraph2')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MISSION & VISION
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            {/* Section header */}
            <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#ff7c00]">
                {t('missionVisionLabel')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                {t('missionVisionTitle')}
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Mission */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#c00000]/5 blur-3xl" />
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-[#c00000] to-[#ff7c00] p-3 shadow-md">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {t('missionTitle')}
                  </h3>
                  <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                    {t('missionDescription')}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {[t('missionPoint1'), t('missionPoint2'), t('missionPoint3')].map(
                      (point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#c00000] dark:text-[#ff7c00]" />
                          {point}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                variants={fadeUp}
                custom={2}
                className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/60"
              >
                <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[#ff7c00]/5 blur-3xl" />
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-[#ff7c00] to-[#c00000] p-3 shadow-md">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {t('visionTitle')}
                  </h3>
                  <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                    {t('visionDescription')}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {[t('visionPoint1'), t('visionPoint2'), t('visionPoint3')].map(
                      (point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ff7c00] dark:text-[#c00000]" />
                          {point}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US
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
                {t('whyChooseUsLabel')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                {t('whyChooseUsTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                {t('whyChooseUsSubtitle')}
              </p>
            </motion.div>

            {/* Feature grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <FeatureCard
                  key={i}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUR JOURNEY / TIMELINE
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl"
          >
            {/* Section header */}
            <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#ff7c00]">
                {t('journeyLabel')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                {t('journeyTitle')}
              </h2>
            </motion.div>

            {/* Timeline */}
            <div>
              {timeline.map((step, i) => (
                <TimelineStep
                  key={i}
                  year={step.year}
                  title={step.title}
                  description={step.description}
                  index={i}
                  isLast={i === timeline.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUR VALUES
          ═══════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            {/* Section header */}
            <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#ff7c00]">
                {t('valuesLabel')}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                {t('valuesTitle')}
              </h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value, i) => (
                <ValueCard
                  key={i}
                  icon={value.icon}
                  title={value.title}
                  description={value.description}
                  index={i}
                />
              ))}
            </div>
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
            className="mx-auto max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] p-10 text-center shadow-2xl md:p-16"
            >
              {/* Decorative elements */}
              <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
                  {t('ctaTitle')}
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
                  {t('ctaSubtitle')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`/${locale}/post-ad`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#c00000] shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-95"
                  >
                    <Store className="h-4 w-4" />
                    {t('ctaPrimary')}
                  </a>
                  <a
                    href={`/${locale}/search`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                  >
                    {t('ctaSecondary')}
                    <ArrowRight className={cn('h-4 w-4', isRtl && 'rotate-180')} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-8" />
    </main>
  );
};
