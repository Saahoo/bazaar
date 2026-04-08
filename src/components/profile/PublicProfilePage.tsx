'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Calendar, Globe, MapPin, Phone, User, Briefcase, BadgeInfo } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { ProfileRelationButtons } from './ProfileRelationButtons';

export interface PublicProfileData {
  id: string;
  display_name: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  address_line: string | null;
  profile_type: string | null;
  age: number | null;
  sex: string | null;
  company_name: string | null;
  occupation: string | null;
  website: string | null;
  verified_phone: boolean;
  seller_rating: number | null;
  created_at: string;
}

interface PublicProfilePageProps {
  locale: Locale;
  profile: PublicProfileData;
  stats: {
    activeListings: number;
    friends: number;
    favoriteUsers: number;
  };
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ locale, profile, stats }) => {
  const tCommon = useTranslations('common');
  const rtl = isRTL(locale);

  const memberSince = new Date(profile.created_at).toLocaleDateString(
    locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF',
    { year: 'numeric', month: 'long' }
  );

  const profileTypeLabel = profile.profile_type === 'vendor' ? 'Vendor Profile' : 'Personal Profile';
  const location = [profile.city, profile.district, profile.address_line].filter(Boolean).join(', ');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700" />
        <div className="px-6 pb-6">
          <div className={`flex items-end gap-4 -mt-12 mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-slate-100">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <div className={`flex-1 pt-12 ${rtl ? 'text-right' : ''}`}>
              <h1 className="text-2xl font-bold text-slate-900">{profile.display_name || 'User'}</h1>
              <p className="text-sm text-slate-500 mt-1">{profileTypeLabel}</p>
              {profile.company_name && (
                <p className="text-sm text-primary-700 font-medium mt-1">{profile.company_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-slate-900">{stats.activeListings}</div>
              <div className="text-sm text-slate-500">Active Listings</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-slate-900">{stats.friends}</div>
              <div className="text-sm text-slate-500">Friends</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-slate-900">{stats.favoriteUsers}</div>
              <div className="text-sm text-slate-500">Favorite Users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className={`text-lg font-semibold text-slate-900 mb-5 ${rtl ? 'text-right' : ''}`}>Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailRow icon={BadgeInfo} label="Profile Type" value={profileTypeLabel} rtl={rtl} />
          <DetailRow icon={Calendar} label="Age" value={profile.age ? String(profile.age) : '—'} rtl={rtl} />
          <DetailRow icon={User} label="Sex" value={profile.sex || '—'} rtl={rtl} />
          <DetailRow icon={MapPin} label={tCommon('location')} value={location || '—'} rtl={rtl} />
          <DetailRow icon={Phone} label="Phone" value={profile.phone || '—'} rtl={rtl} />
          <DetailRow icon={Calendar} label="Member Since" value={memberSince} rtl={rtl} />
          <DetailRow icon={Briefcase} label="Occupation" value={profile.occupation || '—'} rtl={rtl} />
          <DetailRow icon={Building2} label="Company Name" value={profile.company_name || '—'} rtl={rtl} />
          <DetailRow icon={Globe} label="Website" value={profile.website || '—'} rtl={rtl} />
          <DetailRow icon={BadgeInfo} label="Rating" value={profile.seller_rating ? profile.seller_rating.toFixed(1) : '—'} rtl={rtl} />
        </div>

        {profile.bio && (
          <div className={`mt-6 ${rtl ? 'text-right' : ''}`}>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Bio</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className={`text-lg font-semibold text-slate-900 mb-4 ${rtl ? 'text-right' : ''}`}>Connect</h2>
        <ProfileRelationButtons
          locale={locale}
          targetUserId={profile.id}
          targetName={profile.display_name}
          targetPhone={profile.phone}
        />
      </div>
    </div>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
  rtl,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  rtl: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 bg-slate-50 rounded-xl ${rtl ? 'flex-row-reverse text-right' : ''}`}>
      <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
      <div className="min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm text-slate-800 break-words">{value}</div>
      </div>
    </div>
  );
}