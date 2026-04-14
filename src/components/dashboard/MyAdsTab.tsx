// src/components/dashboard/MyAdsTab.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  description: string | null;
  category_id: number;
  price: number;
  currency: string;
  status: string;
  view_count: number;
  photos?: { photo_url: string; display_order: number }[] | null;
}

interface DashboardDraftCategory {
  name_en: string;
  name_ps: string;
  name_fa: string;
}

interface DashboardDraft {
  id: string;
  category_id: number;
  updated_at: string;
  draft_data: Record<string, unknown>;
  categories?: DashboardDraftCategory | DashboardDraftCategory[] | null;
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
  const [myDrafts, setMyDrafts] = useState<DashboardDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DashboardListing | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteNote, setDeleteNote] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<DashboardListing | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editError, setEditError] = useState('');
  const [savingEditId, setSavingEditId] = useState<string | null>(null);

  const getDraftCategoryName = (draft: DashboardDraft) => {
    const categoryMeta = Array.isArray(draft.categories)
      ? draft.categories[0]
      : draft.categories;

    if (categoryMeta) {
      if (locale === 'ps') return categoryMeta.name_ps;
      if (locale === 'fa') return categoryMeta.name_fa;
      return categoryMeta.name_en;
    }
    return getCategoryName(draft.category_id, locale);
  };

  const getDraftTitle = (draft: DashboardDraft) => {
    const data = draft.draft_data || {};
    const formData = (data.formData || {}) as Record<string, unknown>;
    const reData = (data.reData || {}) as Record<string, unknown>;
    const vhData = (data.vhData || {}) as Record<string, unknown>;
    const propertyDetails = (reData.propertyDetails || {}) as Record<string, unknown>;

    return String(
      vhData.title ||
      propertyDetails.title ||
      formData.title ||
      (locale === 'en' ? 'Untitled draft' : locale === 'ps' ? 'بې سرلیکه مسوده' : 'پیش‌نویس بدون عنوان')
    );
  };

  const getDraftPrice = (draft: DashboardDraft) => {
    const data = draft.draft_data || {};
    const formData = (data.formData || {}) as Record<string, unknown>;
    const reData = (data.reData || {}) as Record<string, unknown>;
    const vhData = (data.vhData || {}) as Record<string, unknown>;
    const propertyDetails = (reData.propertyDetails || {}) as Record<string, unknown>;
    const vehicleCondition = (vhData.condition || {}) as Record<string, unknown>;

    const rawPrice = vehicleCondition.price || propertyDetails.price || formData.price;
    const rawCurrency = vehicleCondition.currency || propertyDetails.currency || formData.currency || 'AFN';
    const numericPrice = Number(rawPrice);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return locale === 'en' ? 'Price not set' : locale === 'ps' ? 'بیه نه ده ټاکل شوې' : 'قیمت تعیین نشده';
    }

    return formatCurrency(numericPrice, String(rawCurrency));
  };

  const deleteReasonOptions =
    locale === 'ps'
      ? [
          { value: 'sold', label: 'توکی خرڅ شو' },
          { value: 'no_longer_selling', label: 'نور یې پلورل نه غواړم' },
          { value: 'posted_by_mistake', label: 'په تېروتنه پوسټ شوی و' },
          { value: 'not_available', label: 'توکی نور نشته' },
          { value: 'other', label: 'نور' },
        ]
      : locale === 'fa'
        ? [
            { value: 'sold', label: 'کالا فروخته شد' },
            { value: 'no_longer_selling', label: 'دیگر نمی‌خواهم بفروشم' },
            { value: 'posted_by_mistake', label: 'به اشتباه ثبت شده بود' },
            { value: 'not_available', label: 'کالا دیگر موجود نیست' },
            { value: 'other', label: 'سایر' },
          ]
        : [
            { value: 'sold', label: 'Item is sold' },
            { value: 'no_longer_selling', label: "Don't want to sell anymore" },
            { value: 'posted_by_mistake', label: 'Posted by mistake' },
            { value: 'not_available', label: 'Item is no longer available' },
            { value: 'other', label: 'Other' },
          ];

    const editReasonOptions =
      locale === 'ps'
        ? [
            { value: 'update_information', label: 'د اعلان معلومات تازه کول' },
            { value: 'increase_price', label: 'بیه زیاتول' },
            { value: 'decrease_price', label: 'بیه کمول' },
          ]
        : locale === 'fa'
          ? [
              { value: 'update_information', label: 'به‌روزرسانی اطلاعات آگهی' },
              { value: 'increase_price', label: 'افزایش قیمت' },
              { value: 'decrease_price', label: 'کاهش قیمت' },
            ]
          : [
              { value: 'update_information', label: 'Update post information' },
              { value: 'increase_price', label: 'Increase price' },
              { value: 'decrease_price', label: 'Decrease price' },
            ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadListings = async () => {
      const [listingsResult, draftsResult] = await Promise.all([
        supabase
          .from('listings')
          .select('id, title, description, category_id, price, currency, status, view_count, photos(photo_url, display_order)')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('created_at', { ascending: false }),
        supabase
          .from('listing_drafts')
          .select('id, category_id, updated_at, draft_data, categories(name_en, name_ps, name_fa)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
      ]);

      setMyListings((listingsResult.data as DashboardListing[]) || []);
      setMyDrafts((draftsResult.data as DashboardDraft[]) || []);
      setLoading(false);
    };

    loadListings();
  }, [user, supabase]);

  const openDeleteDialog = (listing: DashboardListing) => {
    setDeleteTarget(listing);
    setDeleteReason('');
    setDeleteNote('');
  };

  const openEditDialog = (listing: DashboardListing) => {
    setEditTarget(listing);
    setEditReason('');
    setEditNote('');
    setEditError('');
    setEditTitle(listing.title);
    setEditDescription(listing.description || '');
    setEditPrice(String(listing.price));
  };

  const closeEditDialog = () => {
    setEditTarget(null);
    setEditReason('');
    setEditNote('');
    setEditError('');
    setEditTitle('');
    setEditDescription('');
    setEditPrice('');
  };

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
    setDeleteReason('');
    setDeleteNote('');
  };

  const confirmDelete = async () => {
    if (!user || !deleteTarget || !deleteReason) return;

    setDeletingId(deleteTarget.id);

    const { error } = await supabase
      .from('listings')
      .update({
        deleted_at: new Date().toISOString(),
        deletion_reason_code: deleteReason,
        deletion_reason_note: deleteReason === 'other' ? deleteNote || null : null,
        status: deleteReason === 'sold' ? 'sold' : 'expired',
      })
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id)
      .is('deleted_at', null);

    setDeletingId(null);

    if (error) {
      return;
    }

    setMyListings((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    closeDeleteDialog();
  };

  const saveEdit = async () => {
    if (!user || !editTarget || !editReason) return;

    const trimmedTitle = editTitle.trim();
    const trimmedDescription = editDescription.trim();
    const newPrice = Number(editPrice);

    if (!trimmedTitle || !Number.isFinite(newPrice) || newPrice <= 0) {
      setEditError(
        locale === 'en'
          ? 'Please provide a valid title and price.'
          : locale === 'ps'
            ? 'مهرباني وکړئ معتبر سرلیک او بیه ورکړئ.'
            : 'لطفا عنوان و قیمت معتبر وارد کنید.'
      );
      return;
    }

    const oldPrice = Number(editTarget.price);
    const priceChangeType = newPrice > oldPrice ? 'increase' : newPrice < oldPrice ? 'decrease' : 'none';

    if (priceChangeType === 'increase' && editReason !== 'increase_price') {
      setEditError(
        locale === 'en'
          ? 'Price increased. Please select "Increase price" as reason.'
          : locale === 'ps'
            ? 'بیه زیاته شوې. مهرباني وکړئ "بیه زیاتول" دلیل وټاکئ.'
            : 'قیمت افزایش یافته است. لطفا دلیل "افزایش قیمت" را انتخاب کنید.'
      );
      return;
    }

    if (priceChangeType === 'decrease' && editReason !== 'decrease_price') {
      setEditError(
        locale === 'en'
          ? 'Price decreased. Please select "Decrease price" as reason.'
          : locale === 'ps'
            ? 'بیه کمه شوې. مهرباني وکړئ "بیه کمول" دلیل وټاکئ.'
            : 'قیمت کاهش یافته است. لطفا دلیل "کاهش قیمت" را انتخاب کنید.'
      );
      return;
    }

    if (priceChangeType === 'none' && editReason !== 'update_information') {
      setEditError(
        locale === 'en'
          ? 'Price did not change. Please select "Update post information".'
          : locale === 'ps'
            ? 'بیه نه ده بدله شوې. مهرباني وکړئ "د اعلان معلومات تازه کول" وټاکئ.'
            : 'قیمت تغییر نکرده است. لطفا "به‌روزرسانی اطلاعات آگهی" را انتخاب کنید.'
      );
      return;
    }

    setEditError('');
    setSavingEditId(editTarget.id);

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        title: trimmedTitle,
        description: trimmedDescription || null,
        price: newPrice,
        last_edit_reason_code: editReason,
        last_edit_reason_note: editNote.trim() || null,
      })
      .eq('id', editTarget.id)
      .eq('user_id', user.id)
      .is('deleted_at', null);

    if (!updateError && priceChangeType !== 'none') {
      await supabase.from('listing_price_history').insert({
        listing_id: editTarget.id,
        old_price: oldPrice,
        new_price: newPrice,
        currency: editTarget.currency,
        change_type: priceChangeType,
        reason_code: editReason,
        changed_by: user.id,
      });
    }

    setSavingEditId(null);

    if (updateError) {
      setEditError(updateError.message);
      return;
    }

    setMyListings((prev) =>
      prev.map((item) =>
        item.id === editTarget.id
          ? {
              ...item,
              title: trimmedTitle,
              description: trimmedDescription || null,
              price: newPrice,
            }
          : item
      )
    );

    closeEditDialog();
  };

  const deleteDraft = async (draftId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('listing_drafts')
      .delete()
      .eq('id', draftId)
      .eq('user_id', user.id);

    if (error) return;

    setMyDrafts((prev) => prev.filter((draft) => draft.id !== draftId));
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">{tCommon('loading')}</div>;
  }

  return (
    <div className="space-y-3">
      {myDrafts.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-sm font-semibold text-slate-900">
              {locale === 'en' ? 'Saved drafts' : locale === 'ps' ? 'ساتل شوې مسودې' : 'پیش‌نویس‌های ذخیره‌شده'}
            </h3>
            <span className="text-xs text-slate-500">{myDrafts.length}</span>
          </div>

          {myDrafts.map((draft) => {
            const title = getDraftTitle(draft);
            const category = getDraftCategoryName(draft);
            const price = getDraftPrice(draft);
            const savedAt = new Date(draft.updated_at).toLocaleDateString(
              locale === 'en' ? 'en-US' : locale === 'ps' ? 'ps-AF' : 'fa-AF',
              { year: 'numeric', month: 'short', day: 'numeric' }
            );

            return (
              <div
                key={draft.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ImageIcon className="w-8 h-8 text-primary-300" />
                  </div>

                  <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <p className="block text-sm font-semibold text-slate-900 truncate">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{category}</p>
                    <p className="text-sm font-bold text-primary-600 mt-1">{price}</p>
                    <div className={`flex items-center gap-2 mt-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles.draft}`}>
                        {t('draft')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {locale === 'en' ? 'Saved' : locale === 'ps' ? 'ساتل شوې' : 'ذخیره شده'}: {savedAt}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Link
                      href={`/${locale}/post-ad?draft=${draft.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{locale === 'en' ? 'Resume' : locale === 'ps' ? 'دوام ورکړئ' : 'ادامه'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
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
        </div>
      )}

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
              <Link href={`/${locale}/listing/${listing.id}`} className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {primaryPhoto ? (
                  <Image src={primaryPhoto} alt={title} fill unoptimized sizes="(max-width: 640px) 64px, 80px" className="object-cover" />
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
                  onClick={() => openEditDialog(listing)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  title={tCommon('edit')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tCommon('edit')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteDialog(listing)}
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

      {myListings.length === 0 && myDrafts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>{t('myAds')}</p>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className={`w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-5 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              {locale === 'en'
                ? 'Why are you deleting this listing?'
                : locale === 'ps'
                  ? 'ولې دا اعلان حذف کوئ؟'
                  : 'چرا این آگهی را حذف می‌کنید؟'}
            </h3>
            <p className="text-sm text-slate-500 mb-4 truncate">{deleteTarget.title}</p>

            <div className="space-y-2 mb-4">
              {deleteReasonOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                    deleteReason === opt.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <input
                    type="radio"
                    name="deleteReason"
                    value={opt.value}
                    checked={deleteReason === opt.value}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="accent-primary-600"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>

            {deleteReason === 'other' && (
              <textarea
                value={deleteNote}
                onChange={(e) => setDeleteNote(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'Please add a short reason...'
                    : locale === 'ps'
                      ? 'مهرباني وکړئ لنډ دلیل ولیکئ...'
                      : 'لطفا دلیل کوتاه بنویسید...'
                }
                className={`w-full px-3 py-2.5 mb-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 ${isRtl ? 'text-right' : 'text-left'}`}
                rows={3}
              />
            )}

            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'justify-end'}`}>
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                {tCommon('cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!deleteReason || deletingId === deleteTarget.id || (deleteReason === 'other' && !deleteNote.trim())}
                className="px-3.5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === deleteTarget.id ? tCommon('loading') : tCommon('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className={`w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-h-[90vh] overflow-y-auto ${isRtl ? 'text-right' : 'text-left'}`}>
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              {locale === 'en' ? 'Edit listing' : locale === 'ps' ? 'اعلان سمول' : 'ویرایش آگهی'}
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="edit-listing-title" className="block text-sm text-slate-600 mb-1">
                  {locale === 'en' ? 'Title' : locale === 'ps' ? 'سرلیک' : 'عنوان'}
                </label>
                <input
                  id="edit-listing-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 ${isRtl ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label htmlFor="edit-listing-description" className="block text-sm text-slate-600 mb-1">
                  {locale === 'en' ? 'Description' : locale === 'ps' ? 'تشریح' : 'توضیحات'}
                </label>
                <textarea
                  id="edit-listing-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 ${isRtl ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label htmlFor="edit-listing-price" className="block text-sm text-slate-600 mb-1">
                  {locale === 'en' ? 'Price' : locale === 'ps' ? 'بیه' : 'قیمت'}
                </label>
                <input
                  id="edit-listing-price"
                  type="number"
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-800 mb-2">
                {locale === 'en' ? 'Reason for edit' : locale === 'ps' ? 'د سمون دلیل' : 'دلیل ویرایش'}
              </p>
              <div className="space-y-2">
                {editReasonOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                      editReason === opt.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <input
                      type="radio"
                      name="editReason"
                      value={opt.value}
                      checked={editReason === opt.value}
                      onChange={(e) => setEditReason(e.target.value)}
                      className="accent-primary-600"
                    />
                    <span className="text-sm text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder={
                  locale === 'en'
                    ? 'Optional note...'
                    : locale === 'ps'
                      ? 'اختیاري یادښت...'
                      : 'یادداشت اختیاری...'
                }
                className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 ${isRtl ? 'text-right' : 'text-left'}`}
                rows={3}
              />
            </div>

            {editError && <p className="text-sm text-red-600 mt-3">{editError}</p>}

            <div className={`mt-5 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'justify-end'}`}>
              <button
                type="button"
                onClick={closeEditDialog}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                {tCommon('cancel')}
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!editReason || savingEditId === editTarget.id}
                className="px-3.5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingEditId === editTarget.id
                  ? tCommon('loading')
                  : locale === 'en'
                    ? 'Save changes'
                    : locale === 'ps'
                      ? 'بدلونونه خوندي کړئ'
                      : 'ذخیره تغییرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
