'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { isRTL, Locale } from '@/lib/i18n/config';

interface ProfileFieldNoticeProps {
  locale: Locale;
}

/**
 * A notice banner displayed above locked profile fields in the listing wizard.
 * Tells users that contact details come from their profile and directs them
 * to update their profile if they want to change these values.
 */
export const ProfileFieldNotice: React.FC<ProfileFieldNoticeProps> = ({ locale }) => {
  const rtl = isRTL(locale);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 ${rtl ? 'flex-row-reverse text-right' : 'text-left'}`}
    >
      <Lock className="h-4 w-4 shrink-0" />
      <span>
        {rtl
          ? 'تفاصيل الاتصال تأتي من ملفك الشخصي. '
          : 'Contact details come from your profile. '}
        <Link
          href={`/${locale}/dashboard?tab=profile`}
          className="underline font-medium hover:text-blue-900"
        >
          {rtl ? 'تحديث الملف الشخصي' : 'Update profile'}
        </Link>
        {rtl ? ' لتغييرها.' : ' to change them.'}
      </span>
    </div>
  );
};