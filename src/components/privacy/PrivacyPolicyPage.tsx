'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Locale, isRTL } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';
import {
  Shield,
  Database,
  Eye,
  Share2,
  Cookie,
  Lock,
  UserCheck,
  RefreshCw,
  Mail,
  ChevronRight,
} from 'lucide-react';

interface PrivacyPolicyPageProps {
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

export default function PrivacyPolicyPage({
  locale,
}: PrivacyPolicyPageProps) {
  const t = useTranslations('helpCenter.privacy');
  const rtl = isRTL(locale);

  const sections = [
    {
      icon: Database,
      title: t('section1.title') || 'Information We Collect',
      content: (
        <>
          <p>
            {t('section1.p1') ||
              'Bazaar Marketplace collects certain information to provide, improve, and secure our services. This section describes the types of information we collect and how we obtain them.'}
          </p>
          <ul>
            <li>
              <strong>{t('section1.li1strong') || 'Personal Information:'}</strong> {t('section1.li1text') || 'When you create an account, we collect your name, email address, phone number, and profile details. This information is necessary to authenticate you and provide our services.'}
            </li>
            <li>
              <strong>{t('section1.li2strong') || 'Listing Data:'}</strong> {t('section1.li2text') || 'When you post an ad, we collect the item details, description, photos, price, location, and contact preferences you provide. This data is publicly visible on the platform to facilitate transactions.'}
            </li>
            <li>
              <strong>{t('section1.li3strong') || 'Communication Data:'}</strong> {t('section1.li3text') || 'Messages exchanged between users through our chat system are stored on our servers to ensure message delivery, moderation, and dispute resolution.'}
            </li>
            <li>
              <strong>{t('section1.li4strong') || 'Device & Usage Data:'}</strong> {t('section1.li4text') || 'We automatically collect information about your device (type, operating system, browser), IP address, pages visited, search queries, click patterns, and session duration for analytics and security purposes.'}
            </li>
            <li>
              <strong>{t('section1.li5strong') || 'Location Data:'}</strong> {t('section1.li5text') || 'With your consent, we may collect approximate location data to show relevant local listings and improve search results. You can disable location services at any time in your device settings.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: t('section2.title') || 'How We Use Your Information',
      content: (
        <>
          <p>
            {t('section2.p1') ||
              'We use the information we collect for the following purposes:'}
          </p>
          <ul>
            <li>
              <strong>{t('section2.li1strong') || 'Service Delivery:'}</strong> {t('section2.li1text') || 'To operate and maintain the Bazaar platform, process your listings, enable communication between buyers and sellers, and provide customer support.'}
            </li>
            <li>
              <strong>{t('section2.li2strong') || 'Personalization:'}</strong> {t('section2.li2text') || 'To tailor your experience by showing relevant listings, recommendations, and localized content based on your preferences and browsing behavior.'}
            </li>
            <li>
              <strong>{t('section2.li3strong') || 'Safety & Moderation:'}</strong> {t('section2.li3text') || 'To detect, prevent, and address fraud, illegal activity, security breaches, and content that violates our community guidelines.'}
            </li>
            <li>
              <strong>{t('section2.li4strong') || 'Analytics & Improvement:'}</strong> {t('section2.li4text') || 'To analyze usage patterns, measure feature effectiveness, identify bugs, and improve platform performance and user experience.'}
            </li>
            <li>
              <strong>{t('section2.li5strong') || 'Communication:'}</strong> {t('section2.li5text') || 'To send you service notifications, security alerts, policy updates, and — with your consent — promotional information about new features or services.'}
            </li>
            <li>
              <strong>{t('section2.li6strong') || 'Legal Compliance:'}</strong> {t('section2.li6text') || 'To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Share2,
      title: t('section3.title') || 'Sharing of Information',
      content: (
        <>
          <p>
            {t('section3.p1') ||
              'We do not sell your personal information to third parties. We may share your information only in the following circumstances:'}
          </p>
          <ul>
            <li>
              <strong>{t('section3.li1strong') || 'Public Listings:'}</strong> {t('section3.li1text') || 'Information you voluntarily include in your listings (item details, photos, price, and preferred contact method) is visible to all platform users.'}
            </li>
            <li>
              <strong>{t('section3.li2strong') || 'Service Providers:'}</strong> {t('section3.li2text') || 'We work with trusted third-party vendors who assist us in hosting, analytics, payment processing, email delivery, and customer support. These providers are contractually obligated to handle your data securely and only for the purposes we specify.'}
            </li>
            <li>
              <strong>{t('section3.li3strong') || 'Legal Requirements:'}</strong> {t('section3.li3text') || 'We may disclose information when required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.'}
            </li>
            <li>
              <strong>{t('section3.li4strong') || 'Business Transfers:'}</strong> {t('section3.li4text') || 'In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections.'}
            </li>
            <li>
              <strong>{t('section3.li5strong') || 'With Your Consent:'}</strong> {t('section3.li5text') || 'We may share information with third parties when you have given us explicit consent to do so.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Cookie,
      title: t('section4.title') || 'Cookies & Tracking Technologies',
      content: (
        <>
          <p>
            {t('section4.p1') ||
              'Bazaar uses cookies and similar tracking technologies to enhance your browsing experience and collect analytical data.'}
          </p>
          <ul>
            <li>
              <strong>{t('section4.li1strong') || 'Essential Cookies:'}</strong> {t('section4.li1text') || 'Required for the platform to function properly — these enable login, session management, security features, and language preferences. They cannot be disabled.'}
            </li>
            <li>
              <strong>{t('section4.li2strong') || 'Analytics Cookies:'}</strong> {t('section4.li2text') || 'Help us understand how users interact with the platform, which features are popular, and where improvements are needed. Data is aggregated and anonymized where possible.'}
            </li>
            <li>
              <strong>{t('section4.li3strong') || 'Advertising Cookies:'}</strong> {t('section4.li3text') || 'Used by our advertising partners to display relevant ads and measure ad effectiveness. These cookies may track browsing activity across different websites.'}
            </li>
            <li>
              <strong>{t('section4.li4strong') || 'Managing Cookies:'}</strong> {t('section4.li4text') || 'You can manage your cookie preferences through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling certain cookies may affect platform functionality.'}
            </li>
          </ul>
          <p>
            {t('section4.p2') ||
              'We also use local storage and similar technologies to store preferences and improve performance. These are subject to the same privacy principles as cookies.'}
          </p>
        </>
      ),
    },
    {
      icon: Lock,
      title: t('section5.title') || 'Data Security',
      content: (
        <>
          <p>
            {t('section5.p1') ||
              'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.'}
          </p>
          <ul>
            <li>
              <strong>{t('section5.li1strong') || 'Encryption:'}</strong> {t('section5.li1text') || 'All data transmitted between your device and our servers is encrypted using TLS/SSL protocols. Sensitive data such as passwords is hashed and never stored in plain text.'}
            </li>
            <li>
              <strong>{t('section5.li2strong') || 'Access Controls:'}</strong> {t('section5.li2text') || 'Strict role-based access controls limit employee access to personal data. Only authorized personnel with a legitimate need may access user information.'}
            </li>
            <li>
              <strong>{t('section5.li3strong') || 'Regular Audits:'}</strong> {t('section5.li3text') || 'We conduct regular security audits, vulnerability assessments, and penetration testing to identify and address potential threats.'}
            </li>
            <li>
              <strong>{t('section5.li4strong') || 'Incident Response:'}</strong> {t('section5.li4text') || 'We maintain an incident response plan and will notify affected users promptly in the event of a data breach, in accordance with applicable laws.'}
            </li>
          </ul>
          <p>
            {t('section5.p2') ||
              'While we strive to protect your data, no method of electronic storage or transmission is 100% secure. We encourage you to use strong passwords and to not share your login credentials with anyone.'}
          </p>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: t('section6.title') || 'Your Rights',
      content: (
        <>
          <p>
            {t('section6.p1') ||
              'You have the following rights regarding your personal information:'}
          </p>
          <ul>
            <li>
              <strong>{t('section6.li1strong') || 'Access:'}</strong> {t('section6.li1text') || 'You can request a copy of the personal data we hold about you. We will provide this information within 30 days of receiving a verified request.'}
            </li>
            <li>
              <strong>{t('section6.li2strong') || 'Correction:'}</strong> {t('section6.li2text') || 'You can update or correct your profile information at any time through your account settings. If you believe we hold inaccurate data, please contact us.'}
            </li>
            <li>
              <strong>{t('section6.li3strong') || 'Deletion:'}</strong> {t('section6.li3text') || 'You can request deletion of your account and associated personal data. We will process such requests within 30 days, subject to legal retention requirements.'}
            </li>
            <li>
              <strong>{t('section6.li4strong') || 'Data Portability:'}</strong> {t('section6.li4text') || 'You may request to receive your personal data in a structured, commonly used, machine-readable format for transfer to another service.'}
            </li>
            <li>
              <strong>{t('section6.li5strong') || 'Opt-Out:'}</strong> {t('section6.li5text') || 'You can opt out of promotional communications at any time by updating your notification preferences or clicking the unsubscribe link in any promotional email.'}
            </li>
            <li>
              <strong>{t('section6.li6strong') || 'Restriction:'}</strong> {t('section6.li6text') || 'In certain circumstances, you may request that we restrict the processing of your personal data while we resolve a dispute or verify the accuracy of the data.'}
            </li>
          </ul>
          <p>
            {t('section6.p2') ||
              'To exercise any of these rights, please contact us at privacy@bazaar.com. We will respond to all legitimate requests within the timeframe required by applicable law.'}
          </p>
        </>
      ),
    },
    {
      icon: RefreshCw,
      title: t('section7.title') || 'Changes to This Policy',
      content: (
        <>
          <p>
            {t('section7.p1') ||
              'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.'}
          </p>
          <ul>
            <li>
              <strong>{t('section7.li1strong') || 'Notification:'}</strong> {t('section7.li1text') || 'We will notify you of material changes by posting a prominent notice on the platform, sending an email, or providing an in-app notification at least 7 days before the changes take effect.'}
            </li>
            <li>
              <strong>{t('section7.li2strong') || 'Review:'}</strong> {t('section7.li2text') || 'We encourage you to review this page periodically for the latest information on our privacy practices. The "Last Updated" date at the top of this page indicates when the policy was last revised.'}
            </li>
            <li>
              <strong>{t('section7.li3strong') || 'Continued Use:'}</strong> {t('section7.li3text') || 'Your continued use of the platform after any changes become effective constitutes your acceptance of the revised Privacy Policy.'}
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Mail,
      title: t('section8.title') || 'Contact Us',
      content: (
        <>
          <p>
            {t('section8.p1') ||
              'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:'}
          </p>
          <ul>
            <li>
              <strong>{t('section8.li1strong') || 'Email:'}</strong> {t('section8.li1text') || 'privacy@bazaar.com — for privacy inquiries, data requests, and opt-out requests.'}
            </li>
            <li>
              <strong>{t('section8.li2strong') || 'Support:'}</strong> {t('section8.li2text') || 'support@bazaar.com — for general support and account-related questions.'}
            </li>
            <li>
              <strong>{t('section8.li3strong') || 'Legal:'}</strong> {t('section8.li3text') || 'legal@bazaar.com — for legal inquiries and formal data subject requests.'}
            </li>
            <li>
              <strong>{t('section8.li4strong') || 'Address:'}</strong> {t('section8.li4text') || 'Bazaar Marketplace, Kabul, Afghanistan.'}
            </li>
          </ul>
          <p>
            {t('section8.p2') ||
              'We aim to respond to all inquiries within 5 business days. For urgent data protection matters, please mark your email as "URGENT — Privacy Request" in the subject line.'}
          </p>
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
            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            {t('title') || 'Privacy Policy'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {t('subtitle') ||
              'This Privacy Policy explains how Bazaar Marketplace collects, uses, discloses, and safeguards your information.'}
          </p>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>
              <strong>Last Updated:</strong> May 1, 2026 •{' '}
              <a
                href="#contact-us"
                className="text-primary-600 hover:underline dark:text-primary-400"
              >
                Contact us about this policy
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
          <Shield className="mx-auto mb-3 h-8 w-8 text-slate-500 dark:text-slate-400" />
          <p className="text-slate-700 dark:text-slate-300">
            {t('footerNote1') || 'By using Bazaar Marketplace, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein.'}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('footerNote2') || 'If you do not agree with this policy, you must discontinue use of the platform immediately.'}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}