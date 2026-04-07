'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, Camera, Edit3, ShieldCheck, Package, Heart, MessageSquare, Loader2 } from 'lucide-react';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass = `w-full px-4 py-2.5 border border-slate-300 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 ${rtl ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-medium text-slate-700 mb-1.5 ${rtl ? 'text-right' : 'text-left'}`;

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      // Load profile data from profiles table (not auth metadata)
      supabase
        .from('profiles')
        .select('display_name, phone, city, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setName(data.display_name || '');
            setPhone(data.phone || '');
            setCity(data.city || '');
            setAvatarUrl(data.avatar_url || null);
          }
        });
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
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center bg-slate-100 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Package, label: t('activeListings'), value: 0, color: 'text-primary-600 bg-primary-50' },
              { icon: Heart, label: t('myFavorites'), value: 0, color: 'text-red-500 bg-red-50' },
              { icon: MessageSquare, label: t('myMessages'), value: 0, color: 'text-green-600 bg-green-50' },
              { icon: User, label: t('totalViews'), value: 0, color: 'text-purple-600 bg-purple-50' },
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
