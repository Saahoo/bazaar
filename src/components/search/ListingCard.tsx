// src/components/search/ListingCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, MapPin, Clock, ImageIcon, MessageCircle, Share2, Heart, Flag, Phone, UserPlus } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { formatCurrency } from '@/lib/constants/currencies';
import { getCityName } from '@/lib/constants/cities';
import type { Listing } from '@/lib/hooks/useListings';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/context/AuthContext';
import { getOrCreateConversation } from '@/lib/chat/actions';
import { useToast } from '@/components/common/ToastProvider';
import { cn } from '@/lib/utils/cn';

interface ListingCardProps {
  listing: Listing;
  locale: Locale;
}

function getTimeAgo(dateString: string, locale: Locale): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      return locale === 'en' ? 'Just now' : locale === 'ps' ? 'اوس مهال' : 'همین الان';
    }
    return locale === 'en'
      ? `${diffHours}h ago`
      : locale === 'ps'
        ? `${diffHours} ساعت مخکې`
        : `${diffHours} ساعت پیش`;
  }
  if (diffDays === 1) {
    return locale === 'en' ? 'Yesterday' : locale === 'ps' ? 'پرون' : 'دیروز';
  }
  if (diffDays < 7) {
    return locale === 'en'
      ? `${diffDays}d ago`
      : locale === 'ps'
        ? `${diffDays} ورځې مخکې`
        : `${diffDays} روز پیش`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === 'en'
      ? `${weeks}w ago`
      : locale === 'ps'
        ? `${weeks} اونۍ مخکې`
        : `${weeks} هفته پیش`;
  }
  const months = Math.floor(diffDays / 30);
  return locale === 'en'
    ? `${months}mo ago`
    : locale === 'ps'
      ? `${months} میاشتې مخکې`
      : `${months} ماه پیش`;
}

const conditionColors: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  like_new: 'bg-primary-100 text-primary-700',
  good: 'bg-yellow-100 text-yellow-700',
  fair: 'bg-slate-100 text-slate-600',
};

const conditionKeyMap: Record<string, string> = {
  new: 'newCondition',
  like_new: 'likeNew',
  good: 'good',
  fair: 'fair',
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, locale }) => {
  const tCommon = useTranslations('common');
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const isRtl = isRTL(locale);
  const title = listing.title;
  const conditionKey = conditionKeyMap[listing.condition] || 'good';
  const conditionLabel = tCommon(conditionKey as 'newCondition' | 'likeNew' | 'good' | 'fair');
  const conditionColor = conditionColors[listing.condition] || conditionColors.good;
  const timeAgo = getTimeAgo(listing.created_at, locale);
  const photos = listing.photos || [];
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favoriteLoading, setFavoriteLoading] = React.useState(false);
  const [chatLoading, setChatLoading] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listing.id)
        .maybeSingle();

      setIsFavorite(Boolean(data));
    };

    checkFavorite();
  }, [user, supabase, listing.id]);

  const openLogin = () => router.push(`/${locale}/login`);

  const handleChat = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (user.id === listing.user_id) return;

    setChatLoading(true);
    try {
      const conversationId = await getOrCreateConversation(listing.id, user.id, listing.user_id);
      router.push(`/${locale}/messages?conv=${conversationId}`);
    } catch {
      router.push(`/${locale}/messages`);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (user.id === listing.user_id) return;

    // Adding a user creates (or opens) a conversation so they appear in each other's messages.
    await handleChat();
  };

  const handleFavorite = async () => {
    if (!user) {
      openLogin();
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listing.id });
        setIsFavorite(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${locale}/listing/${listing.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(
        locale === 'en' ? 'Link copied to clipboard.' : locale === 'ps' ? 'لینک کاپي شو.' : 'لینک کپی شد.',
        'success',
      );
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const handleReport = () => {
    const url = `${window.location.origin}/${locale}/listing/${listing.id}`;
    const subject = encodeURIComponent(`Report listing ${listing.id}`);
    const body = encodeURIComponent(`Please review this listing:\n${url}`);
    window.location.href = `mailto:support@bazaar.local?subject=${subject}&body=${body}`;
  };

  const handleCall = () => {
    const phone = listing.phone_visible ? listing.seller_phone : null;
    if (!phone) {
      showToast(
        locale === 'en' ? 'Phone number is not available.' : locale === 'ps' ? 'د تلیفون شمېره نشته.' : 'شماره تلفن موجود نیست.',
        'info',
      );
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
    >
      <Link href={`/${locale}/listing/${listing.id}`} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
          {!imageLoaded && photos.length > 0 && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
          {photos.length > 0 ? (
            <Image
              src={photos[0]}
              alt={title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-slate-300" />
          )}
          <span
            className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm ${conditionColor}`}
          >
            {conditionLabel}
          </span>
          <div className={cn('absolute bottom-3 flex items-center gap-1 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm', isRtl ? 'right-3 flex-row-reverse' : 'left-3')}>
            <Eye className="h-3.5 w-3.5" />
            {listing.view_count}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <h3
            className={`mb-1.5 line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h3>

          <p className={`text-lg font-bold text-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}>
            {formatCurrency(listing.price, listing.currency)}
          </p>

          <div className={`flex items-center gap-3 text-xs text-slate-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin className="w-3.5 h-3.5" />
              {getCityName(listing.city, locale)}
            </span>

            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''} ml-auto ${isRtl ? 'ml-0 mr-auto' : ''}`}>
              <Clock className="w-3.5 h-3.5" />
              {timeAgo}
            </span>
          </div>

          <div className={cn('flex items-center gap-2 text-xs text-slate-500', isRtl && 'flex-row-reverse')}>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
              {listing.negotiable ? (locale === 'en' ? 'Negotiable' : locale === 'ps' ? 'د خبرو وړ' : 'قابل مذاکره') : conditionLabel}
            </span>
            {listing.urgent && <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-600">URGENT</span>}
          </div>
        </div>

      </Link>

      <div className={`grid grid-cols-2 gap-2 border-t border-slate-100 p-3 sm:grid-cols-3 ${isRtl ? 'text-right' : ''}`}>
        <button
          type="button"
          onClick={handleChat}
          disabled={chatLoading || user?.id === listing.user_id}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:scale-[1.02] hover:bg-slate-100 disabled:opacity-50"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {tCommon('chat')}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:scale-[1.02] hover:bg-slate-100"
        >
          <Share2 className="w-3.5 h-3.5" />
          {tCommon('share')}
        </button>

        <button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium transition hover:scale-[1.02] hover:bg-slate-100 disabled:opacity-50 ${
            isFavorite ? 'text-red-600' : 'text-slate-700'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          {tCommon('favorite')}
        </button>

        <button
          type="button"
          onClick={handleReport}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:scale-[1.02] hover:bg-slate-100"
        >
          <Flag className="w-3.5 h-3.5" />
          {tCommon('report')}
        </button>

        <button
          type="button"
          onClick={handleCall}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:scale-[1.02] hover:bg-slate-100"
        >
          <Phone className="w-3.5 h-3.5" />
          {tCommon('call')}
        </button>

        <button
          type="button"
          onClick={handleAddUser}
          disabled={chatLoading || user?.id === listing.user_id}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium text-slate-700 transition hover:scale-[1.02] hover:bg-slate-100 disabled:opacity-50"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {locale === 'en' ? 'Add User' : locale === 'ps' ? 'کاروونکی زیات کړئ' : 'افزودن کاربر'}
        </button>
      </div>
    </motion.div>
  );
};
