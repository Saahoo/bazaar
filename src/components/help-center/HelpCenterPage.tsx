'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HelpCircle,
  FileText,
  ShoppingBag,
  User,
  CreditCard,
  Mail,
  Search,
  Globe,
  Shield,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Smartphone,
  Headphones,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';
import { Accordion } from './Accordion';

interface HelpCenterPageProps {
  locale: Locale;
}

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

const sectionCategories = [
  {
    id: 'faq',
    titleKey: 'faq.title',
    descriptionKey: 'faq.description',
    icon: HelpCircle,
    color: 'from-[#c00000] to-[#ff4444]',
    bgColor: 'bg-[#c00000]/5',
  },
  {
    id: 'post-ad',
    titleKey: 'postAd.title',
    descriptionKey: 'postAd.description',
    icon: FileText,
    color: 'from-[#ff7c00] to-[#ffaa44]',
    bgColor: 'bg-[#ff7c00]/5',
  },
  {
    id: 'browse-buy',
    titleKey: 'browseBuy.title',
    descriptionKey: 'browseBuy.description',
    icon: ShoppingBag,
    color: 'from-[#10b981] to-[#34d399]',
    bgColor: 'bg-[#10b981]/5',
  },
  {
    id: 'account',
    titleKey: 'account.title',
    descriptionKey: 'account.description',
    icon: User,
    color: 'from-[#3b82f6] to-[#60a5fa]',
    bgColor: 'bg-[#3b82f6]/5',
  },
  {
    id: 'payment',
    titleKey: 'payment.title',
    descriptionKey: 'payment.description',
    icon: CreditCard,
    color: 'from-[#8b5cf6] to-[#a78bfa]',
    bgColor: 'bg-[#8b5cf6]/5',
  },
  {
    id: 'contact',
    titleKey: 'contact.title',
    descriptionKey: 'contact.description',
    icon: Mail,
    color: 'from-[#ec4899] to-[#f472b6]',
    bgColor: 'bg-[#ec4899]/5',
  },
];

export function HelpCenterPage({ locale }: HelpCenterPageProps) {
  const t = useTranslations('helpCenter');
  const rtl = isRTL(locale);

  // FAQ items
  const faqItems = [
    {
      id: 'faq-1',
      question: t('faq.items.q1'),
      answer: t('faq.items.a1'),
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: 'faq-2',
      question: t('faq.items.q2'),
      answer: t('faq.items.a2'),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'faq-3',
      question: t('faq.items.q3'),
      answer: t('faq.items.a3'),
      icon: <User className="h-4 w-4" />,
    },
    {
      id: 'faq-4',
      question: t('faq.items.q4'),
      answer: t('faq.items.a4'),
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 'faq-5',
      question: t('faq.items.q5'),
      answer: t('faq.items.a5'),
      icon: <Globe className="h-4 w-4" />,
    },
    {
      id: 'faq-6',
      question: t('faq.items.q6'),
      answer: t('faq.items.a6'),
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];

  // Quick help cards
  const quickHelpCards = [
    {
      title: t('quickHelp.liveChat.title'),
      description: t('quickHelp.liveChat.description'),
      icon: <MessageSquare className="h-6 w-6" />,
      action: t('quickHelp.liveChat.action'),
      href: '#',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    },
    {
      title: t('quickHelp.knowledgeBase.title'),
      description: t('quickHelp.knowledgeBase.description'),
      icon: <BookOpen className="h-6 w-6" />,
      action: t('quickHelp.knowledgeBase.action'),
      href: '#',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
    {
      title: t('quickHelp.mobileApp.title'),
      description: t('quickHelp.mobileApp.description'),
      icon: <Smartphone className="h-6 w-6" />,
      action: t('quickHelp.mobileApp.action'),
      href: '#',
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    },
    {
      title: t('quickHelp.contactSupport.title'),
      description: t('quickHelp.contactSupport.description'),
      icon: <Headphones className="h-6 w-6" />,
      action: t('quickHelp.contactSupport.action'),
      href: '#',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c00000] to-[#ff7c00]"
            >
              <HelpCircle className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300"
            >
              {t('hero.description')}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-10 max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder={t('search.placeholder')}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-500 shadow-sm focus:border-[#c00000] focus:outline-none focus:ring-2 focus:ring-[#c00000]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                />
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {t('search.hint')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white"
            >
              {t('categories.title')}
            </motion.h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sectionCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.a
                    key={category.id}
                    href={`#${category.id}`}
                    variants={fadeUp}
                    custom={index}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-900',
                      'hover:scale-[1.02]'
                    )}
                  >
                    <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <ChevronRight
                        className={cn(
                          'h-5 w-5 text-slate-400',
                          rtl && 'rotate-180'
                        )}
                      />
                    </div>
                    <div
                      className={cn(
                        'mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br',
                        category.color
                      )}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                      {t(category.titleKey)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {t(category.descriptionKey)}
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="mb-10 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                {t('faq.title')}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {t('faq.subtitle')}
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Accordion items={faqItems} defaultOpenId="faq-1" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white"
            >
              {t('quickHelp.title')}
            </motion.h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quickHelpCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  custom={index}
                  className={cn(
                    'rounded-xl border p-6 transition-all hover:shadow-lg',
                    card.color
                  )}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/50 dark:bg-black/20">
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                    {card.description}
                  </p>
                  <a
                    href={card.href}
                    className="inline-flex items-center text-sm font-medium text-[#c00000] hover:text-[#ff7c00] dark:text-[#ff7c00] dark:hover:text-[#ffaa44]"
                  >
                    {card.action}
                    <ChevronRight
                      className={cn('ml-1 h-4 w-4', rtl && 'rotate-180')}
                    />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#c00000] to-[#ff7c00] p-8 text-center text-white shadow-xl"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-3xl font-bold"
            >
              {t('contactCta.title')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-8 text-lg opacity-90"
            >
              {t('contactCta.description')}
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/contact-us"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-[#c00000] transition-colors hover:bg-slate-100"
              >
                {t('contactCta.contactButton')}
              </Link>
              <a
                href="mailto:support@bazaar.com"
                className="rounded-lg border-2 border-white bg-transparent px-6 py-3 font-semibold transition-colors hover:bg-white/10"
              >
                {t('contactCta.emailButton')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}