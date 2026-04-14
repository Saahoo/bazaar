'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { User, Mail, Phone, MapPin, Camera, Edit3, ShieldCheck, Package, Heart, MessageSquare, Loader2, Building2, Briefcase, Globe, BadgeInfo } from 'lucide-react';
import { isRTL, Locale } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface ProfilePageProps {
  locale: Locale;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tForm = useTranslations('form');
  const tAuth = useTranslations('auth');
  const rtl = isRTL(locale);
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [profileType, setProfileType] = useState<'personal' | 'vendor'>('personal');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeListings: 0,
    favorites: 0,
    messages: 0,
    friends: 0,
    favoriteUsers: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass = `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');

      const loadProfile = async () => {
        const [{ data }, { count: activeListings }, { count: favorites }, { count: messages }, { count: friends }, { count: favoriteUsers }] = await Promise.all([
          supabase
            .from('profiles')
            .select('display_name, phone, city, district, address_line, avatar_url, profile_type, age, sex, company_name, occupation, website, bio')
            .eq('id', user.id)
            .single(),
          supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'active')
            .is('deleted_at', null),
          supabase
            .from('favorites')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('conversations')
            .select('id', { count: 'exact', head: true })
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
          supabase
            .from('user_relationships')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('relation_type', 'friend'),
          supabase
            .from('user_relationships')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('relation_type', 'favorite'),
        ]);

        if (data) {
          setName(data.display_name || '');
          setPhone(data.phone || '');
          setCity(data.city || '');
          setDistrict(data.district || '');
          setAddressLine(data.address_line || '');
          setAvatarUrl(data.avatar_url || null);
          setProfileType((data.profile_type as 'personal' | 'vendor') || 'personal');
          setAge(data.age ? String(data.age) : '');
          setSex(data.sex || '');
          setCompanyName(data.company_name || '');
          setOccupation(data.occupation || '');
          setWebsite(data.website || '');
          setBio(data.bio || '');
        }

        setStats({
          activeListings: activeListings || 0,
          favorites: favorites || 0,
          messages: messages || 0,
          friends: friends || 0,
          favoriteUsers: favoriteUsers || 0,
        });
      };

      loadProfile();
    }
  }, [user, supabase]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError(null);

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      // Step 1: Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error('Storage upload failed:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Step 2: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      // Step 3: Save avatar URL to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithCacheBuster })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update failed:', profileError);
        throw new Error(`Failed to save avatar: ${profileError.message}`);
      }

      setAvatarUrl(urlWithCacheBuster);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload avatar. Please try again.';
      setError(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Save profile data to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: name,
          phone,
          city,
          district,
          address_line: addressLine,
          profile_type: profileType,
          age: age ? Number(age) : null,
          sex: sex || null,
          company_name: profileType === 'vendor' ? companyName : null,
          occupation: occupation || null,
          website: website || null,
          bio: bio || null,
          is_seller: profileType === 'vendor',
        })
        .eq('id', user!.id);

      if (profileError) throw profileError;

      setIsEditing(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">{tAuth('loginTitle')}</h2>
        <p className="text-slate-500 mb-6 text-sm">You need to be logged in to view your profile.</p>
        <Link
          href={`/${locale}/login`}
          className="inline-block px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
        >
          {tAuth('loginButton')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">&times;</button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700" />

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className={`flex items-end gap-4 -mt-12 mb-6 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className="relative">
              <div className="relative w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center bg-slate-100 overflow-hidden">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill unoptimized sizes="96px" className="object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition"
              >
                {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
            </div>
            <div className={`flex-1 pt-12 ${rtl ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse justify-end' : ''}`}>
                <h1 className="text-xl font-bold text-slate-900">{name || 'User'}</h1>
                {user.email_confirmed_at && (
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-xs text-primary-700 font-medium mt-1">{profileType === 'vendor' ? 'Vendor Profile' : 'Personal Profile'}</p>
              {profileType === 'vendor' && companyName && (
                <p className="text-sm text-slate-700 mt-1">{companyName}</p>
              )}
              <p className="text-sm text-slate-500">{email}</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              } ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <Edit3 className="w-4 h-4" />
              {saving ? tCommon('loading') : isEditing ? tCommon('save') : tCommon('edit')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Package, label: t('activeListings'), value: stats.activeListings, color: 'text-primary-600 bg-primary-50' },
              { icon: Heart, label: t('myFavorites'), value: stats.favorites, color: 'text-red-500 bg-red-50' },
              { icon: MessageSquare, label: t('myMessages'), value: stats.messages, color: 'text-green-600 bg-green-50' },
              { icon: User, label: 'Friends', value: stats.friends, color: 'text-indigo-600 bg-indigo-50' },
              { icon: BadgeInfo, label: 'Favorite Users', value: stats.favoriteUsers, color: 'text-amber-600 bg-amber-50' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900">{stat.value}</span>
                <span className="text-xs text-slate-500 text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className={`text-lg font-semibold text-slate-900 mb-6 ${rtl ? 'text-right' : ''}`}>
          {t('accountSettings')}
        </h2>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Profile Type</label>
            {isEditing ? (
              <select value={profileType} onChange={(e) => setProfileType(e.target.value as 'personal' | 'vendor')} className={`${inputClass} bg-white`}>
                <option value="personal">Personal</option>
                <option value="vendor">Vendor</option>
              </select>
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{profileType === 'vendor' ? 'Vendor Profile' : 'Personal Profile'}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>{tForm('name')}</label>
            {isEditing ? (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{name || '—'}</span>
              </div>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className={labelClass}>{tAuth('email')}</label>
            <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700" dir="ltr">{email}</span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>{tAuth('phone')}</label>
            {isEditing ? (
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="ltr" />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700" dir="ltr">{phone || '—'}</span>
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className={labelClass}>{tForm('location')}</label>
            {isEditing ? (
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{city || '—'}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>District</label>
            {isEditing ? (
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{district || '—'}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Address</label>
            {isEditing ? (
              <input type="text" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{addressLine || '—'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              {isEditing ? (
                <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} dir="ltr" />
              ) : (
                <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{age || '—'}</span>
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Sex</label>
              {isEditing ? (
                <select value={sex} onChange={(e) => setSex(e.target.value)} className={`${inputClass} bg-white`}>
                  <option value="">Select sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{sex || '—'}</span>
                </div>
              )}
            </div>
          </div>

          {profileType === 'vendor' && (
            <div>
              <label className={labelClass}>Company Name</label>
              {isEditing ? (
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
              ) : (
                <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{companyName || '—'}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className={labelClass}>Occupation</label>
            {isEditing ? (
              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className={inputClass} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700">{occupation || '—'}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Website</label>
            {isEditing ? (
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputClass} dir="ltr" />
            ) : (
              <div className={`flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 break-all">{website || '—'}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            {isEditing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className={`${inputClass} min-h-28 resize-y`} dir={rtl ? 'rtl' : 'ltr'} />
            ) : (
              <div className={`flex items-start gap-3 px-4 py-2.5 bg-slate-50 rounded-lg ${rtl ? 'flex-row-reverse' : ''}`}>
                <BadgeInfo className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="text-slate-700 whitespace-pre-line">{bio || '—'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: `/${locale}/dashboard`, label: t('myAds'), icon: Package },
            { href: `/${locale}/dashboard`, label: t('myFavorites'), icon: Heart },
            { href: `/${locale}/dashboard`, label: t('myMessages'), icon: MessageSquare },
            { href: `/${locale}/post-ad`, label: tCommon('postAd'), icon: Edit3 },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition group ${rtl ? 'flex-row-reverse' : ''}`}
            >
              <link.icon className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition" />
              <span className="font-medium text-slate-700 group-hover:text-primary-600 transition">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
