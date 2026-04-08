// src/components/listing/ActionButtons.tsx
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Heart, Share2, Flag, MessageCircle, Phone, UserPlus } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/context/AuthContext';
import { getOrCreateConversation } from '@/lib/chat/actions';

interface ActionButtonsProps {
  locale: Locale;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerPhone?: string | null;
  phoneVisible?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  locale,
  listingId,
  listingTitle,
  sellerId,
  sellerPhone,
  phoneVisible,
}) => {
  const tCommon = useTranslations('common');
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const isRtl = isRTL(locale);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favoriteLoading, setFavoriteLoading] = React.useState(false);
  const [chatLoading, setChatLoading] = React.useState(false);

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
        .eq('listing_id', listingId)
        .maybeSingle();

      setIsFavorite(Boolean(data));
    };

    checkFavorite();
  }, [user, supabase, listingId]);

  const openLogin = () => router.push(`/${locale}/login`);

  const handleChat = async () => {
    if (!user) {
      openLogin();
      return;
    }
    if (user.id === sellerId) return;

    setChatLoading(true);
    try {
      const conversationId = await getOrCreateConversation(listingId, user.id, sellerId);
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
    if (user.id === sellerId) return;
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
          .eq('listing_id', listingId);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        setIsFavorite(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${locale}/listing/${listingId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: listingTitle, url });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied');
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const handleReport = () => {
    const url = `${window.location.origin}/${locale}/listing/${listingId}`;
    const subject = encodeURIComponent(`Report listing ${listingId}`);
    const body = encodeURIComponent(`Please review this listing:\n${url}`);
    window.location.href = `mailto:support@bazaar.local?subject=${subject}&body=${body}`;
  };

  const handleCall = () => {
    if (!phoneVisible || !sellerPhone) {
      alert('Phone number is not available.');
      return;
    }
    window.location.href = `tel:${sellerPhone}`;
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${isRtl ? 'text-right' : ''}`}>
      <button
        type="button"
        onClick={handleChat}
        disabled={chatLoading || user?.id === sellerId}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{tCommon('chat')}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>{tCommon('share')}</span>
      </button>

      <button
        type="button"
        onClick={handleFavorite}
        disabled={favoriteLoading}
        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 ${
          isFavorite ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        <span>{tCommon('favorite')}</span>
      </button>

      <button
        type="button"
        onClick={handleReport}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Flag className="w-4 h-4" />
        <span>{tCommon('report')}</span>
      </button>

      <button
        type="button"
        onClick={handleCall}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Phone className="w-4 h-4" />
        <span>{tCommon('call')}</span>
      </button>

      <button
        type="button"
        onClick={handleAddUser}
        disabled={chatLoading || user?.id === sellerId}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add User</span>
      </button>
    </div>
  );
};
