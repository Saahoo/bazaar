// src/components/chat/ContactSellerButton.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { getOrCreateConversation } from '@/lib/chat/actions';

interface ContactSellerButtonProps {
  locale: Locale;
  listingId: string;
  sellerId: string;
  variant?: 'primary' | 'outline';
  className?: string;
}

export const ContactSellerButton: React.FC<ContactSellerButtonProps> = ({
  locale,
  listingId,
  sellerId,
  variant = 'outline',
  className = '',
}) => {
  const t = useTranslations('common');
  const { user } = useAuth();
  const router = useRouter();
  const isRtl = isRTL(locale);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }

    if (user.id === sellerId) return; // Can't message yourself

    setLoading(true);
    try {
      const conversationId = await getOrCreateConversation(listingId, user.id, sellerId);
      router.push(`/${locale}/messages?conv=${conversationId}`);
    } catch {
      // Fallback to messages page
      router.push(`/${locale}/messages`);
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = `w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${isRtl ? 'flex-row-reverse' : ''}`;
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'border border-primary-600 text-primary-600 hover:bg-primary-50';

  return (
    <button
      onClick={handleClick}
      disabled={loading || (user?.id === sellerId)}
      className={`${baseStyles} ${variantStyles} ${loading ? 'opacity-60 cursor-wait' : ''} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
      {t('contactSeller')}
    </button>
  );
};
