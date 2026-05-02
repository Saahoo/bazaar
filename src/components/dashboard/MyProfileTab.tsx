// src/components/dashboard/MyProfileTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { User, Star, CheckCircle, Mail, Phone, Calendar, Building2, MapPin } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface MyProfileTabProps {
  locale: Locale;
}

interface DashboardProfile {
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  verified_phone: boolean | null;
  seller_rating: number | null;
  created_at: string;
  company_name: string | null;
  profile_type: string | null;
  city: string | null;
}

function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const loc = locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF';
  return date.toLocaleDateString(loc, options);
}

export const MyProfileTab: React.FC<MyProfileTabProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [listingCount, setListingCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const [{ data }, { count }] = await Promise.all([
        supabase
          .from('profiles')
          .select('display_name, phone, avatar_url, bio, verified_phone, seller_rating, created_at, company_name, profile_type, city')
          .eq('id', user.id)
          .single(),
        supabase
          .from('listings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active')
          .is('deleted_at', null),
      ]);

      setProfile((data as DashboardProfile) || null);
      setListingCount(count || 0);
    };

    loadProfile();
  }, [user, supabase]);

  if (!user || !profile) {
    return <div className="text-center py-12 text-slate-400">{tCommon('loading')}</div>;
  }

  const rating = Number(profile.seller_rating) || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      <div className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-xl p-6 sm:p-8 w-full max-w-lg">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 overflow-hidden">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.display_name || 'User'} fill unoptimized sizes="80px" className="rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-xl font-bold text-slate-900">{profile.display_name || 'User'}</h2>
            {profile.verified_phone && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full"
                title={tCommon('verified')}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {tCommon('verified')}
              </span>
            )}
          </div>
          {profile.profile_type === 'vendor' && profile.company_name && (
            <div className="inline-flex items-center gap-1 mt-2 text-sm text-primary-700 font-medium">
              <Building2 className="w-4 h-4" />
              {profile.company_name}
            </div>
          )}

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
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className={`text-sm text-slate-600 mt-5 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
          {profile.bio || '—'}
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
            <span className="text-slate-700">{profile.phone || '—'}</span>
          </div>

          <div
            className={`flex items-center gap-3 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700">{profile.city || '—'}</span>
          </div>

          {/* Member since */}
          <div
            className={`flex items-center gap-3 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-700">{formatDate(profile.created_at, locale)}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">{listingCount}</p>
            <p className="text-xs text-slate-500">{t('activeListings')}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{rating.toFixed(1)}</p>
            <p className="text-xs text-slate-500">{t('myRating')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
