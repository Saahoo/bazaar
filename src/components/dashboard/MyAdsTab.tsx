// src/components/dashboard/MyAdsTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ImageIcon, Pencil, Trash2, Eye } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { getCategoryName } from '@/lib/constants/categories';
import { formatCurrency } from '@/lib/constants/currencies';

interface MyAdsTabProps {
  locale: Locale;
}

interface DashboardListing {
  id: string;
  title: string;
  category_id: number;
  price: number;
  currency: string;
  status: string;
  view_count: number;
  photos?: { photo_url: string; display_order: number }[] | null;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  sold: 'bg-amber-100 text-amber-700',
  expired: 'bg-red-100 text-red-700',
  draft: 'bg-primary-100 text-primary-700',
};

export const MyAdsTab: React.FC<MyAdsTabProps> = ({ locale }) => {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const isRtl = isRTL(locale);
  const { user } = useAuth();
  const supabase = createClient();
  const [myListings, setMyListings] = useState<DashboardListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadListings = async () => {
      const { data } = await supabase
        .from('listings')
        .select('id, title, category_id, price, currency, status, view_count, photos(photo_url, display_order)')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      setMyListings((data as DashboardListing[]) || []);
      setLoading(false);
    };

    loadListings();
  }, [user, supabase]);

  if (loading) {
    return <div className="text-center py-12 text-slate-400">{tCommon('loading')}</div>;
  }

  return (
    <div className="space-y-3">
      {myListings.map((listing) => {
        const title = listing.title;
        const category = getCategoryName(listing.category_id, locale);
        const price = formatCurrency(listing.price, listing.currency);
        const statusLabel = t(listing.status as 'active' | 'sold' | 'expired' | 'draft');
        const statusStyle = statusStyles[listing.status] || statusStyles.active;
        const primaryPhoto = (listing.photos || [])
          .sort((a, b) => a.display_order - b.display_order)[0]?.photo_url;

        return (
          <div
            key={listing.id}
            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}
            >
              {/* Thumbnail placeholder */}
              <Link href={`/${locale}/listing/${listing.id}`} className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {primaryPhoto ? (
                  <img src={primaryPhoto} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </Link>

              {/* Listing info */}
              <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                <Link href={`/${locale}/listing/${listing.id}`} className="block text-sm font-semibold text-slate-900 truncate hover:text-primary-600">
                  {title}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{category}</p>
                <p className="text-sm font-bold text-primary-600 mt-1">{price}</p>
                <div
                  className={`flex items-center gap-2 mt-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle}`}
                  >
                    {statusLabel}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs text-slate-400 ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {listing.view_count}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div
                className={`flex items-center gap-2 flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  title={tCommon('edit')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tCommon('edit')}</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  title={tCommon('delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tCommon('delete')}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {myListings.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>{t('myAds')}</p>
        </div>
      )}
    </div>
  );
};
