'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  EyeOff,
  Trash2,
  Search,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_LABELS, ListingRow, MODERATION_REASON_OPTIONS } from './adminShared';

interface AdminModerationProps {
  locale: Locale;
}

type ModerationTab = 'active' | 'hidden' | 'removed';

const PAGE_SIZE = 20;

export const AdminModeration: React.FC<AdminModerationProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [tab, setTab] = useState<ModerationTab>('active');
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Moderation reason modal
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonAction, setReasonAction] = useState<'hide' | 'remove' | null>(null);
  const [reasonTargetId, setReasonTargetId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const title = SECTION_LABELS.moderation[locale] || SECTION_LABELS.moderation.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const loadListings = useCallback(async () => {
    setLoading(true);
    clearMessages();
    try {
      let query = supabase
        .from('listings')
        .select('id, title, description, status, created_at, user_id, profiles(display_name)', { count: 'exact' })
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (tab === 'active') {
        query = query.eq('status', 'active');
      } else if (tab === 'hidden') {
        query = query.eq('status', 'hidden');
      } else if (tab === 'removed') {
        query = query.neq('status', 'active').neq('status', 'hidden');
      }

      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, count, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setTotalCount(count || 0);
      setListings((data as unknown as ListingRow[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [supabase, tab, searchQuery, page]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const openReasonModal = (action: 'hide' | 'remove', listingId: string) => {
    setReasonAction(action);
    setReasonTargetId(listingId);
    setSelectedReason('');
    setAdminNote('');
    setShowReasonModal(true);
  };

  const handleModerationAction = async () => {
    if (!reasonTargetId || !reasonAction) return;

    setActionLoading(reasonTargetId);
    clearMessages();

    try {
      const newStatus = reasonAction === 'hide' ? 'hidden' : 'removed';

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          status: newStatus,
          metadata: {
            moderation_reason: selectedReason,
            moderation_note: adminNote,
            moderated_at: new Date().toISOString(),
          },
        })
        .eq('id', reasonTargetId);

      if (updateError) throw updateError;

      setSuccess(L(
        `Listing ${reasonAction === 'hide' ? 'hidden' : 'removed'} successfully`,
        `اعلان په بریالیتوب سره ${reasonAction === 'hide' ? 'پټ' : 'لرې'} شو`,
        `آگهی با موفقیت ${reasonAction === 'hide' ? 'مخفی' : 'حذف'} شد`
      ));

      setShowReasonModal(false);
      await loadListings();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (listingId: string) => {
    setActionLoading(listingId);
    clearMessages();

    try {
      const { error: updateError } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', listingId);

      if (updateError) throw updateError;

      setSuccess(L('Listing restored', 'اعلان بیرته راوګرځول شو', 'آگهی بازیابی شد'));
      await loadListings();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async (listingId: string) => {
    if (!confirm(L(
      'Permanently delete this listing? This cannot be undone.',
      'دا اعلان تل پاتې حذف کړئ؟ دا بیرته نشي کیدی.',
      'این آگهی را برای همیشه حذف کنید؟ این عمل قابل بازگشت نیست.'
    ))) return;

    setActionLoading(listingId);
    clearMessages();

    try {
      const { error: deleteError } = await supabase
        .from('listings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', listingId);

      if (deleteError) throw deleteError;

      setSuccess(L('Listing permanently deleted', 'اعلان تل پاتې حذف شو', 'آگهی برای همیشه حذف شد'));
      await loadListings();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const tabs: { id: ModerationTab; label: string }[] = [
    { id: 'active', label: L('Active Listings', 'فعال اعلانونه', 'آگهی‌های فعال') },
    { id: 'hidden', label: L('Hidden Listings', 'پټ اعلانونه', 'آگهی‌های مخفی') },
    { id: 'removed', label: L('Removed Listings', 'لرې شوي اعلانونه', 'آگهی‌های حذف شده') },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setPage(0); }}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
              tab === t.id
                ? 'bg-white text-blue-700 font-medium shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${rtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className={`w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${rtl ? 'pr-10 pl-4' : ''}`}
            placeholder={L('Search listings by title...', 'د سرلیک له مخې اعلانونه ولټوئ...', 'جستجوی آگهی‌ها بر اساس عنوان...')}
          />
        </div>
        <button
          onClick={loadListings}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          title={L('Refresh', 'تازه کړئ', 'بازنشانی')}
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <span className="text-sm text-slate-500">
            {totalCount} {L('listings found', 'اعلانونه وموندل شول', 'آگهی یافت شد')}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Title', 'سرلیک', 'عنوان')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Posted by', 'خپروونکی', 'توسط')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Status', 'حالت', 'وضعیت')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Date', 'نیټه', 'تاریخ')}
                  </th>
                  <th className={`px-4 py-3 text-right font-medium text-slate-600 ${rtl ? 'text-left' : ''}`}>
                    {L('Actions', 'عملیات', 'عملیات')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50">
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <div className="font-medium text-slate-800 max-w-xs truncate">{listing.title}</div>
                      {listing.description && (
                        <div className="text-xs text-slate-400 max-w-xs truncate mt-0.5">{listing.description}</div>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>
                      {listing.profiles?.display_name || listing.user_id.slice(0, 8) + '...'}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'hidden'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-slate-500 text-xs ${rtl ? 'text-right' : ''}`}>
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                        {tab === 'active' && (
                          <>
                            <button
                              onClick={() => openReasonModal('hide', listing.id)}
                              disabled={actionLoading === listing.id}
                              className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 disabled:opacity-50"
                              title={L('Hide listing', 'اعلان پټ کړئ', 'مخفی کردن آگهی')}
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openReasonModal('remove', listing.id)}
                              disabled={actionLoading === listing.id}
                              className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-50"
                              title={L('Remove listing', 'اعلان لرې کړئ', 'حذف آگهی')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {tab !== 'active' && (
                          <>
                            <button
                              onClick={() => handleRestore(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="p-1.5 rounded hover:bg-green-50 text-green-600 disabled:opacity-50"
                              title={L('Restore listing', 'اعلان بیرته راوګرځوئ', 'بازیابی آگهی')}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(listing.id)}
                              disabled={actionLoading === listing.id}
                              className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-50"
                              title={L('Permanently delete', 'تل پاتې حذف', 'حذف دائمی')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      {L('No listings found', 'اعلانونه ونه موندل شول', 'آگهی یافت نشد')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              {L(`Page ${page + 1} of ${totalPages}`, `پاڼه ${page + 1} له ${totalPages}`, `صفحه ${page + 1} از ${totalPages}`)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                title={L('Previous', 'مخکینی', 'قبلی')}
              >
                <ChevronLeft className={`w-4 h-4 ${rtl ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30"
                title={L('Next', 'بل', 'بعدی')}
              >
                <ChevronRight className={`w-4 h-4 ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {reasonAction === 'hide'
                ? L('Hide Listing', 'اعلان پټ کړئ', 'مخفی کردن آگهی')
                : L('Remove Listing', 'اعلان لرې کړئ', 'حذف آگهی')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  {L('Reason', 'سبب', 'دلیل')}
                </label>
                <div className="space-y-1">
                  {(MODERATION_REASON_OPTIONS[locale] || MODERATION_REASON_OPTIONS.en).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        selectedReason === opt.value
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={opt.value}
                        checked={selectedReason === opt.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  {L('Admin Note (optional)', 'اډمین یادداشت (اختیاري)', 'یادداشت ادمین (اختیاری)')}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder={L('Additional notes...', 'اضافي یادداشتونه...', 'یادداشت‌های اضافی...')}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleModerationAction}
                disabled={!selectedReason || actionLoading !== null}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 text-sm ${
                  reasonAction === 'hide'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {reasonAction === 'hide'
                  ? L('Hide Listing', 'اعلان پټ کړئ', 'مخفی کردن آگهی')
                  : L('Remove Listing', 'اعلان لرې کړئ', 'حذف آگهی')}
              </button>
              <button
                onClick={() => setShowReasonModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm"
              >
                {L('Cancel', 'لغوه', 'لغو')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};