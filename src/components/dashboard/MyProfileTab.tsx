// src/components/dashboard/MyProfileTab.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { User, Star, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { MockUser } from '@/lib/constants/mock-data';

interface MyProfileTabProps {
  locale: Locale;
  user: MockUser;
}

function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const loc = locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF';
  return date.toLocaleDateString(loc, options);
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({ locale, user }) => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);

  const fullStars = Math.floor(user.rating);
  const hasHalfStar = user.rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 w-full max-w-lg">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-slate-400" />
          </div>

          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-xl font-bold text-slate-900">{user.display_name}</h2>
            {user.verified && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full"
                title={tCommon('verified')}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {tCommon('verified')}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            {hasHalfStar && (
              <Star key="half" className="w-4 h-4 text-amber-400 fill-amber-200" />
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />
            ))}
            <span className="text-sm text-slate-500 ml-1.5">
              {user.rating} ({user.review_count})
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className={`text-sm text-slate-600 mt-5 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
          {user.bio}
        </p>

        {/* Details */}
        <div className="mt-6 space-y-3">
          {/* Email */}
          <div
            className={`flex items-center gap-3 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700">{user.email}</span>
          </div>

          {/* Phone */}
          <div
            className={`flex items-center gap-3 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700">{user.phone}</span>
          </div>

          {/* Member since */}
          <div
            className={`flex items-center gap-3 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700">{formatDate(user.member_since, locale)}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">{user.listing_count}</p>
            <p className="text-xs text-slate-500">{t('activeListings')}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user.review_count}</p>
            <p className="text-xs text-slate-500">{t('myRating')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
