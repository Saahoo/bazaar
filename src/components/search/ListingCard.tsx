// src/components/search/ListingCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  new: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  like_new: 'bg-primary-50 text-primary-700 border-primary-200/60',
  good: 'bg-amber-50 text-amber-700 border-amber-200/60',
  fair: 'bg-slate-50 text-slate-600 border-slate-200/60',
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
  const [isHovered, setIsHovered] = React.useState(false);
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-slate-200/50"
    >
      <Link href={`/${locale}/listing/${listing.id}`} className="block">
        {/* Image Section */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          {!imageLoaded && photos.length > 0 && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-100" />
          )}
          {photos.length > 0 ? (
            <Image
              src={photos[0]}
              alt={title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <ImageIcon className="h-12 w-12" />
              <span className="text-xs font-medium">{locale === 'en' ? 'No image' : locale === 'ps' ? 'انځور نشته' : 'بدون تصویر'}</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Condition badge */}
          <span
            className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} rounded-xl border px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${conditionColor}`}
          >
            {conditionLabel}
          </span>

          {/* Favorite button overlay */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFavorite();
            }}
            disabled={favoriteLoading}
            whileTap={{ scale: 0.85 }}
            className={cn(
              'absolute top-3 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all duration-300',
              isRtl ? 'left-3' : 'right-3',
              isFavorite
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/80 text-slate-500 shadow-sm hover:bg-white hover:text-red-500',
              isHovered || isFavorite ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </motion.button>

          {/* View count */}
          <div className={cn('absolute bottom-3 flex items-center gap-1.5 rounded-lg bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md', isRtl ? 'right-3 flex-row-reverse' : 'left-3')}>
            <Eye className="h-3.5 w-3.5" />
            {listing.view_count}
          </div>

          {/* Urgent badge */}
          <AnimatePresence>
            {listing.urgent && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={cn('absolute bottom-3 flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg', isRtl ? 'left-3' : 'right-3')}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                URGENT
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="space-y-2.5 p-4">
          <h3
            className={`line-clamp-2 text-[15px] font-bold text-slate-900 transition-colors duration-200 group-hover:text-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            {title}
          </h3>

          <p className={`text-lg font-black text-primary-600 ${isRtl ? 'text-right' : 'text-left'}`}>
            {formatCurrency(listing.price, listing.currency)}
          </p>

          <div className={`flex items-center gap-3 text-xs text-slate-400 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-3.5 w-3.5" />
              {getCityName(listing.city, locale)}
            </span>

            <span className={`flex items-center gap-1 ml-auto ${isRtl ? 'ml-0 mr-auto flex-row-reverse' : ''}`}>
              <Clock className="h-3.5 w-3.5" />
              {timeAgo}
            </span>
          </div>

          <div className={cn('flex items-center gap-2 text-xs', isRtl && 'flex-row-reverse')}>
            {listing.negotiable ? (
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600 border border-emerald-100">
                {locale === 'en' ? 'Negotiable' : locale === 'ps' ? 'د خبرو وړ' : 'قابل مذاکره'}
              </span>
            ) : (
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 font-semibold text-slate-500 border border-slate-100">
                {conditionLabel}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className={`grid grid-cols-3 gap-1.5 border-t border-slate-100 p-3 sm:grid-cols-6 ${isRtl ? 'text-right' : ''}`}>
        <motion.button
          type="button"
          onClick={handleChat}
          disabled={chatLoading || user?.id === listing.user_id}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{tCommon('chat')}</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleShare}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{tCommon('share')}</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          whileTap={{ scale: 0.92 }}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 disabled:opacity-40',
            isFavorite ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-red-50 hover:text-red-500'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', isFavorite && 'fill-current')} />
          <span className="hidden sm:inline">{tCommon('favorite')}</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleReport}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600"
        >
          <Flag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{tCommon('report')}</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleCall}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{tCommon('call')}</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleAddUser}
          disabled={chatLoading || user?.id === listing.user_id}
          whileTap={{ scale: 0.92 }}
          className="flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-40"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{locale === 'en' ? 'Add' : locale === 'ps' ? 'زیات' : 'افزودن'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
