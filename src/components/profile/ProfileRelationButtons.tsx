'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, Phone, UserPlus, UserCheck } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { getOrCreateDirectConversation } from '@/lib/chat/actions';

interface ProfileRelationButtonsProps {
  locale: Locale;
  targetUserId: string;
  targetName: string;
  targetPhone?: string | null;
  compact?: boolean;
}

export const ProfileRelationButtons: React.FC<ProfileRelationButtonsProps> = ({
  locale,
  targetUserId,
  targetName,
  targetPhone,
  compact = false,
}) => {
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const rtl = isRTL(locale);

  const [isFriend, setIsFriend] = React.useState(false);
  const [isFavoriteUser, setIsFavoriteUser] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user || user.id === targetUserId) {
      setIsFriend(false);
      setIsFavoriteUser(false);
      return;
    }

    const loadRelations = async () => {
      const { data } = await supabase
        .from('user_relationships')
        .select('relation_type')
        .eq('user_id', user.id)
        .eq('target_user_id', targetUserId)
        .in('relation_type', ['friend', 'favorite']);

      setIsFriend((data || []).some((item) => item.relation_type === 'friend'));
      setIsFavoriteUser((data || []).some((item) => item.relation_type === 'favorite'));
    };

    loadRelations();
  }, [user, targetUserId, supabase]);

  if (user?.id === targetUserId) return null;

  const openLogin = () => router.push(`/${locale}/login`);

  const toggleRelation = async (relationType: 'friend' | 'favorite') => {
    if (!user) {
      openLogin();
      return;
    }

    const active = relationType === 'friend' ? isFriend : isFavoriteUser;
    setLoading(relationType);
    try {
      if (active) {
        await supabase
          .from('user_relationships')
          .delete()
          .eq('user_id', user.id)
          .eq('target_user_id', targetUserId)
          .eq('relation_type', relationType);
      } else {
        await supabase.from('user_relationships').insert({
          user_id: user.id,
          target_user_id: targetUserId,
          relation_type: relationType,
        });
      }

      if (relationType === 'friend') setIsFriend(!active);
      if (relationType === 'favorite') setIsFavoriteUser(!active);
    } finally {
      setLoading(null);
    }
  };

  const handleChat = async () => {
    if (!user) {
      openLogin();
      return;
    }

    setLoading('chat');
    try {
      const conversationId = await getOrCreateDirectConversation(user.id, targetUserId);
      router.push(`/${locale}/messages?conv=${conversationId}`);
    } catch {
      router.push(`/${locale}/messages`);
    } finally {
      setLoading(null);
    }
  };

  const handleCall = () => {
    if (!targetPhone) return;
    window.location.href = `tel:${targetPhone}`;
  };

  const buttonClass = compact
    ? `flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${rtl ? 'flex-row-reverse' : ''}`
    : `flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${rtl ? 'flex-row-reverse' : ''}`;

  return (
    <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-2`}>
      <button
        type="button"
        onClick={() => toggleRelation('friend')}
        disabled={loading !== null}
        className={`${buttonClass} ${isFriend ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} disabled:opacity-50`}
      >
        {isFriend ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        <span>{isFriend ? 'Friend Added' : 'Add Friend'}</span>
      </button>

      <button
        type="button"
        onClick={() => toggleRelation('favorite')}
        disabled={loading !== null}
        className={`${buttonClass} ${isFavoriteUser ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} disabled:opacity-50`}
      >
        <Heart className={`w-4 h-4 ${isFavoriteUser ? 'fill-current' : ''}`} />
        <span>{isFavoriteUser ? 'Favorited' : 'Favorite User'}</span>
      </button>

      <button
        type="button"
        onClick={handleChat}
        disabled={loading !== null}
        className={`${buttonClass} bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50`}
        aria-label={`Chat with ${targetName}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{tCommon('chat')}</span>
      </button>

      <button
        type="button"
        onClick={handleCall}
        disabled={!targetPhone}
        className={`${buttonClass} bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Phone className="w-4 h-4" />
        <span>{tCommon('call')}</span>
      </button>
    </div>
  );
};