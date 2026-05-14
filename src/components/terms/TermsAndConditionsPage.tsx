'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';
import {
  FileText,
  Shield,
  User,
  AlertCircle,
  CreditCard,
  Scale,
  Globe,
  Lock,
  Ban,
  Mail,
  ChevronRight,
} from 'lucide-react';

interface TermsAndConditionsPageProps {
  locale: Locale;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  index: number;
}

function Section({ icon: Icon, title, children, index }: SectionProps) {
  return (
    <motion.section
      custom={index}
      variants={fadeUp}
      className="mb-10 scroll-mt-20 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      id={title.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>
      <div className="prose prose-slate max-w-none dark:prose-invert prose-p:text-slate-600 prose-p:dark:text-slate-300 prose-ul:my-4 prose-li:text-slate-600 prose-li:dark:text-slate-300">
        {children}
      </div>
    </motion.section>
  );
}

export default function TermsAndConditionsPage({
  locale,
}: TermsAndConditionsPageProps) {
  const t = useTranslations('helpCenter.terms');
  const rtl = isRTL(locale);

  const sections = [
    {
      icon: FileText,
      title: t('section1.title') || 'User Agreement',
      content: (
        <>
          <p>
            {t('section1.p1') ||
              'These Terms and Conditions govern your use of the Bazaar Marketplace platform. By accessing or using our services, you agree to be bound by these terms. If you do not agree, you must not use our platform.'}
          </p>
          <ul>
            <li>
              <strong>{t('section1.li1strong') || 'Eligibility:'}</strong> {t('section1.li1text') || 'You must be at least 18 years old to use Bazaar. By using the platform, you represent that you meet this requirement.'}
            </li>
            <li>
              <strong>{t('section1.li2strong') || 'Account Responsibility:'}</strong> {t('section1.li2text') || 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.'}
            </li>
            <li>
              <strong>{t('section1.li3strong') || 'Platform Changes:'}</strong> {t('section1.li3text') || 'We reserve the right to modify, suspend, or discontinue any part of the service at any time.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: User,
      title: t('section2.title') || 'User Accounts',
      content: (
        <>
          <p>
            {t('section2.p1') || 'Creating an account on Bazaar grants you access to post listings, communicate with other users, and utilize marketplace features.'}
          </p>
          <ul>
            <li>{t('section2.li1') || 'Accurate Information: You must provide accurate, current, and complete information during registration and keep it updated.'}</li>
            <li>{t('section2.li2') || 'One Account Per User: Each user may maintain only one account unless expressly permitted by Bazaar.'}</li>
            <li>{t('section2.li3') || 'Account Security: Notify us immediately if you suspect unauthorized access to your account.'}</li>
            <li>{t('section2.li4') || 'Termination: We may suspend or terminate accounts that violate these terms or engage in fraudulent activity.'}</li>
          </ul>
        </>
      ),
    },
    {
      icon: AlertCircle,
      title: t('section3.title') || 'Posting Rules',
      content: (
        <>
          <p>
            {t('section3.p1') || 'All listings must comply with our community guidelines and applicable laws.'}
          </p>
          <ul>
            <li>{t('section3.li1') || 'Accurate Descriptions: Listings must truthfully describe the item or service being offered.'}</li>
            <li>{t('section3.li2') || 'Clear Photos: Upload clear, relevant photos that accurately represent the item.'}</li>
            <li>{t('section3.li3') || 'Pricing Transparency: The listed price must include all mandatory fees unless clearly stated otherwise.'}</li>
            <li>{t('section3.li4') || 'Category Appropriateness: Listings must be placed in the most relevant category.'}</li>
            <li>{t('section3.li5') || 'Prohibited Content: Do not post content that is illegal, offensive, infringing, or otherwise violates our policies.'}</li>
          </ul>
        </>
      ),
    },
    {
      icon: Ban,
      title: t('section4.title') || 'Prohibited Items & Activities',
      content: (
        <>
          <p>{t('section4.p1') || 'The following items and activities are strictly prohibited on Bazaar:'}</p>
          <ul>
            <li>{t('section4.li1') || 'Illegal drugs, substances, or paraphernalia'}</li>
            <li>{t('section4.li2') || 'Weapons, firearms, ammunition, or explosives'}</li>
            <li>{t('section4.li3') || 'Stolen goods or property'}</li>
            <li>{t('section4.li4') || 'Counterfeit or pirated items'}</li>
            <li>{t('section4.li5') || 'Live animals (except where explicitly permitted)'}</li>
            <li>{t('section4.li6') || 'Hazardous materials'}</li>
            <li>{t('section4.li7') || 'Adult content or services'}</li>
            <li>{t('section4.li8') || 'Multi-level marketing schemes'}</li>
            <li>{t('section4.li9') || 'Any item that promotes hate, violence, or discrimination'}</li>
          </ul>
          <p>{t('section4.p2') || 'Bazaar reserves the right to remove any listing that violates these prohibitions and may report such activity to authorities.'}</p>
        </>
      ),
    },
    {
      icon: CreditCard,
      title: t('section5.title') || 'Payments & Transactions',
      content: (
        <>
          <p>{t('section5.p1') || 'Bazaar provides a platform for buyers and sellers to connect but does not directly process payments for most transactions.'}</p>
          <ul>
            <li>
              <strong>{t('section5.li1strong') || 'Transaction Responsibility:'}</strong> {t('section5.li1text') || 'Users are solely responsible for arranging payment methods, delivery, and any associated risks.'}
            </li>
            <li>
              <strong>{t('section5.li2strong') || 'No Warranty:'}</strong> {t('section5.li2text') || 'Bazaar does not guarantee the quality, safety, or legality of items listed, nor the accuracy of listings.'}
            </li>
            <li>
              <strong>{t('section5.li3strong') || 'Disputes:'}</strong> {t('section5.li3text') || 'Any disputes arising from transactions must be resolved directly between the buyer and seller. Bazaar may provide assistance but is not obligated to intervene.'}
            </li>
            <li>
              <strong>{t('section5.li4strong') || 'Fees:'}</strong> {t('section5.li4text') || 'Certain premium features may incur fees, which will be clearly disclosed before purchase.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Shield,
      title: t('section6.title') || 'Liability & Disclaimers',
      content: (
        <>
          <p>{t('section6.p1') || 'Bazaar provides the platform "as is" without warranties of any kind.'}</p>
          <ul>
            <li>
              <strong>{t('section6.li1strong') || 'No Guarantee:'}</strong> {t('section6.li1text') || 'We do not guarantee uninterrupted, secure, or error‑free service.'}
            </li>
            <li>
              <strong>{t('section6.li2strong') || 'Limitation of Liability:'}</strong> {t('section6.li2text') || 'To the fullest extent permitted by law, Bazaar shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.'}
            </li>
            <li>
              <strong>{t('section6.li3strong') || 'Indemnification:'}</strong> {t('section6.li3text') || 'You agree to indemnify and hold harmless Bazaar, its affiliates, and employees from any claims resulting from your violation of these terms.'}
            </li>
            <li>
              <strong>{t('section6.li4strong') || 'Third‑Party Links:'}</strong> {t('section6.li4text') || 'The platform may contain links to third‑party websites. We are not responsible for their content or practices.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: t('section7.title') || 'Termination',
      content: (
        <>
          <p>{t('section7.p1') || 'Bazaar may suspend or terminate your access to the platform at its sole discretion, with or without cause, and with or without notice.'}</p>
          <ul>
            <li>
              <strong>{t('section7.li1strong') || 'Grounds for Termination:'}</strong> {t('section7.li1text') || 'Violation of these terms, fraudulent activity, or any behavior that harms the platform or other users.'}
            </li>
            <li>
              <strong>{t('section7.li2strong') || 'Effect of Termination:'}</strong> {t('section7.li2text') || 'Upon termination, your right to use the platform ceases immediately, and we may delete or deactivate your account and associated content.'}
            </li>
            <li>
              <strong>{t('section7.li3strong') || 'Survival:'}</strong> {t('section7.li3text') || 'Provisions regarding liability, indemnification, governing law, and dispute resolution shall survive termination.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Globe,
      title: t('section8.title') || 'Governing Law & Dispute Resolution',
      content: (
        <>
          <p>{t('section8.p1') || 'These Terms are governed by the laws of the Islamic Republic of Afghanistan, without regard to its conflict of law principles.'}</p>
          <ul>
            <li>
              <strong>{t('section8.li1strong') || 'Jurisdiction:'}</strong> {t('section8.li1text') || 'Any legal action or proceeding shall be brought exclusively in the courts located in Kabul, Afghanistan.'}
            </li>
            <li>
              <strong>{t('section8.li2strong') || 'Dispute Resolution:'}</strong> {t('section8.li2text') || 'Parties agree to attempt to resolve disputes informally for at least 30 days before initiating any formal proceeding.'}
            </li>
            <li>
              <strong>{t('section8.li3strong') || 'Class Action Waiver:'}</strong> {t('section8.li3text') || 'You waive any right to participate in a class action lawsuit or class‑wide arbitration.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Mail,
      title: t('section9.title') || 'Contact & Updates',
      content: (
        <>
          <p>{t('section9.p1') || 'Bazaar may update these Terms from time to time. We will notify users of material changes via email or platform notifications.'}</p>
          <ul>
            <li>
              <strong>{t('section9.li1strong') || 'Effective Date:'}</strong> {t('section9.li1text') || 'These Terms are effective as of May 1, 2026.'}
            </li>
            <li>
              <strong>{t('section9.li2strong') || 'Contact Information:'}</strong> {t('section9.li2text') || 'For questions about these Terms, please contact our legal team at legal@bazaar.com.'}
            </li>
            <li>
              <strong>{t('section9.li3strong') || 'Continued Use:'}</strong> {t('section9.li3text') || 'Your continued use of the platform after changes constitutes acceptance of the revised Terms.'}
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className={cn('min-h-screen bg-slate-50 py-8 dark:bg-slate-950', rtl ? 'text-right' : 'text-left')}>
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary-50 p-3 dark:bg-primary-900/30">
            <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            {t('title') || 'Terms & Conditions'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {t('subtitle') ||
              'Please read these terms carefully before using Bazaar Marketplace.'}
          </p>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>
              <strong>Last Updated:</strong> May 1, 2026 •{' '}
              <a
                href="#contact-updates"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                View update history
              </a>
            </p>
          </div>
        </motion.header>

        {/* Quick Navigation */}
        <motion.nav
          variants={fadeUp}
          className="sticky top-4 z-10 mb-10 rounded-xl border border-slate-200 bg-white/90 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90"
        >
          <h3 className="mb-3 font-semibold text-slate-800 dark:text-slate-200">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap gap-2">
            {sections.map((section, idx) => (
              <a
                key={idx}
                href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
              >
                <section.icon className="h-3 w-3" />
                {section.title}
                <ChevronRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {sections.map((section, idx) => (
            <Section
              key={idx}
              icon={section.icon}
              title={section.title}
              index={idx}
            >
              {section.content}
            </Section>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.footer
          variants={fadeUp}
          className="mt-12 rounded-lg border border-slate-200 bg-slate-100 p-6 text-center dark:border-slate-800 dark:bg-slate-900"
        >
          <Scale className="mx-auto mb-3 h-8 w-8 text-slate-500 dark:text-slate-400" />
          <p className="text-slate-700 dark:text-slate-300">
            {t('footerNote1') || 'By using Bazaar, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.'}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('footerNote2') || 'If you do not agree, you must discontinue use of the platform immediately.'}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}