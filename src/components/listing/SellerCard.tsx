// src/components/listing/SellerCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User, CheckCircle, Phone, Eye, EyeOff, Star, Building2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import type { SellerData } from './ListingDetail';
import { ProfileRelationButtons } from '@/components/profile/ProfileRelationButtons';

interface SellerCardProps {
  seller: SellerData;
  locale: Locale;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, locale }) => {
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const [showPhone, setShowPhone] = useState(false);

  const memberSinceDate = new Date(seller.member_since).toLocaleDateString(
    locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF',
    { year: 'numeric', month: 'long' }
  );

  const maskedPhone = seller.phone
    ? seller.phone.slice(0, 4) + ' *** ** **'
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden sticky top-24">
      {/* Seller header */}
      <Link
        href={`/${locale}/profile/${seller.id}`}
        className={`flex items-center gap-3 p-4 border-b border-slate-100 hover:bg-slate-50 transition ${isRtl ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
          {seller.avatar_url ? (
            <img src={seller.avatar_url} alt={seller.display_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-slate-400" />
          )}
        </div>

        <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
            <h3 className="font-bold text-primary-700 truncate text-sm leading-tight">
              {seller.display_name || 'Seller'}
            </h3>
            {seller.verified && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          {seller.verified && (
            <span className="text-xs text-green-600 font-medium">
              {tCommon('verified')}
            </span>
          )}
          {seller.profile_type === 'vendor' && seller.company_name && (
            <div className={`mt-1 flex items-center gap-1 text-xs text-primary-700 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              <Building2 className="w-3 h-3" />
              <span>{seller.company_name}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Seller info */}
      <div className="px-4 py-3 border-b border-slate-100">
        {/* Member since */}
        <p className={`text-xs text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('seller_since', { date: memberSinceDate })}
        </p>

        {/* Rating */}
        {seller.rating > 0 && (
          <div className={`flex items-center gap-1 mt-1.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(seller.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-medium text-slate-600 ms-1">{seller.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Phone numbers table */}
      {seller.phone && (
        <div className="border-b border-slate-100">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-50">
                <td className={`px-4 py-2.5 text-slate-500 font-medium bg-slate-50/80 w-20 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('phone')}</span>
                  </div>
                </td>
                <td className={`px-4 py-2.5 font-medium text-slate-800 ${isRtl ? 'text-right' : 'text-left'}`} dir="ltr">
                  {showPhone ? seller.phone : maskedPhone}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Show/hide phone toggle */}
          <button
            onClick={() => setShowPhone(!showPhone)}
            className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50/50 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            {showPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPhone ? (tCommon('hide') || 'Hide') : (t('viewPhone'))}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="p-4 space-y-3">
        {seller.phone && (
          <a
            href={`tel:${seller.phone}`}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Phone className="w-4 h-4" />
            {t('callSeller')}
          </a>
        )}

        <ProfileRelationButtons
          locale={locale}
          targetUserId={seller.id}
          targetName={seller.display_name}
          targetPhone={seller.phone}
          compact
        />
      </div>
    </div>
  );
};
