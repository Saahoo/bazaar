'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search,
  RefreshCw,
  Shield,
  ShieldOff,
  Ban,
  UserX,
  UserCheck,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_LABELS, UserProfileRow } from './adminShared';

interface AdminUsersProps {
  locale: Locale;
}

type UserFilter = 'all' | 'blocked' | 'suspended' | 'restricted' | 'admins';

const PAGE_SIZE = 20;

export const AdminUsers: React.FC<AdminUsersProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [users, setUsers] = useState<UserProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Action modals
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'suspend' | 'unsuspend' | 'restrict' | 'unrestrict' | 'delete' | null>(null);
  const [actionTarget, setActionTarget] = useState<UserProfileRow | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [suspendUntil, setSuspendUntil] = useState('');

  // Detail modal
  const [selectedUser, setSelectedUser] = useState<UserProfileRow | null>(null);

  const title = SECTION_LABELS.users[locale] || SECTION_LABELS.users.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    clearMessages();
    try {
      let query = supabase
        .from('profiles')
        .select('id, display_name, phone, avatar_url, city, role, is_blocked, is_suspended, listing_restricted, suspended_until, block_reason, suspension_reason, listing_restriction_reason, created_at, is_seller', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (filter === 'blocked') {
        query = query.eq('is_blocked', true);
      } else if (filter === 'suspended') {
        query = query.eq('is_suspended', true);
      } else if (filter === 'restricted') {
        query = query.eq('listing_restricted', true);
      } else if (filter === 'admins') {
        query = query.eq('role', 'admin');
      }

      if (searchQuery.trim()) {
        query = query.or(`display_name.ilike.%${searchQuery.trim()}%,phone.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`);
      }

      const { data, count, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      setTotalCount(count || 0);
      setUsers((data as UserProfileRow[]) || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [supabase, filter, searchQuery, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openActionModal = (action: typeof actionType, user: UserProfileRow) => {
    setActionType(action);
    setActionTarget(user);
    setActionReason('');
    setSuspendUntil('');
    setShowActionModal(true);
  };

  const handleUserAction = async () => {
    if (!actionTarget || !actionType) return;

    setActionLoading(actionTarget.id);
    clearMessages();

    try {
      const updates: Record<string, unknown> = {};

      switch (actionType) {
        case 'block':
          updates.is_blocked = true;
          updates.block_reason = actionReason || null;
          break;
        case 'unblock':
          updates.is_blocked = false;
          updates.block_reason = null;
          break;
        case 'suspend':
          updates.is_suspended = true;
          updates.suspension_reason = actionReason || null;
          updates.suspended_until = suspendUntil || null;
          break;
        case 'unsuspend':
          updates.is_suspended = false;
          updates.suspension_reason = null;
          updates.suspended_until = null;
          break;
        case 'restrict':
          updates.listing_restricted = true;
          updates.listing_restriction_reason = actionReason || null;
          break;
        case 'unrestrict':
          updates.listing_restricted = false;
          updates.listing_restriction_reason = null;
          break;
      }

      if (actionType === 'delete') {
        // Soft delete by blocking and marking
        updates.is_blocked = true;
        updates.block_reason = actionReason || 'Account deleted by admin';
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', actionTarget.id);

        if (updateError) throw updateError;
      }

      const actionLabels: Record<string, string> = {
        block: L('User blocked', 'کارونکی بندي شو', 'کاربر مسدود شد'),
        unblock: L('User unblocked', 'کارونکی بندي لرې شو', 'کاربر رفع مسدودی شد'),
        suspend: L('User suspended', 'کارونکی معلق شو', 'کاربر معلق شد'),
        unsuspend: L('User unsuspended', 'کارونکی معلق لرې شو', 'کاربر رفع تعلیق شد'),
        restrict: L('User listing restricted', 'د کارونکي اعلان محدود شو', 'محدودیت آگهی کاربر اعمال شد'),
        unrestrict: L('User listing unrestricted', 'د کارونکي اعلان محدودیت لرې شو', 'رفع محدودیت آگهی کاربر'),
        delete: L('User account deleted', 'د کارونکي حساب حذف شو', 'حساب کاربر حذف شد'),
      };

      setSuccess(actionLabels[actionType] || L('Action completed', 'عملیات بشپړ شو', 'عملیات انجام شد'));
      setShowActionModal(false);
      await loadUsers();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const filters: { id: UserFilter; label: string }[] = [
    { id: 'all', label: L('All Users', 'ټول کارونکي', 'همه کاربران') },
    { id: 'blocked', label: L('Blocked', 'بندي شوي', 'مسدود') },
    { id: 'suspended', label: L('Suspended', 'معلق شوي', 'معلق') },
    { id: 'restricted', label: L('Restricted', 'محدود شوي', 'محدود') },
    { id: 'admins', label: L('Admins', 'اډمینان', 'مدیران') },
  ];

  const getUserStatusBadges = (user: UserProfileRow) => {
    const badges: { label: string; className: string }[] = [];
    if (user.role === 'admin') {
      badges.push({ label: 'Admin', className: 'bg-purple-100 text-purple-700' });
    }
    if (user.is_blocked) {
      badges.push({ label: L('Blocked', 'بندي', 'مسدود'), className: 'bg-red-100 text-red-700' });
    }
    if (user.is_suspended) {
      badges.push({ label: L('Suspended', 'معلق', 'معلق'), className: 'bg-orange-100 text-orange-700' });
    }
    if (user.listing_restricted) {
      badges.push({ label: L('Restricted', 'محدود', 'محدود'), className: 'bg-yellow-100 text-yellow-700' });
    }
    if (badges.length === 0) {
      badges.push({ label: L('Active', 'فعال', 'فعال'), className: 'bg-green-100 text-green-700' });
    }
    return badges;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {/* Filters */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setPage(0); }}
            className={`flex-1 min-w-[80px] px-3 py-2 text-sm rounded-md transition-colors ${
              filter === f.id
                ? 'bg-white text-blue-700 font-medium shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
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
            placeholder={L('Search by name, phone, or city...', 'د نوم، تلیفون یا ښار له مخې ولټوئ...', 'جستجو بر اساس نام، تلفن یا شهر...')}
          />
        </div>
        <button
          onClick={loadUsers}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          title={L('Refresh', 'تازه کړئ', 'بازنشانی')}
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <span className="text-sm text-slate-500">
            {totalCount} {L('users', 'کارونکي', 'کاربر')}
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
                    {L('User', 'کارونکی', 'کاربر')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Phone', 'تلیفون', 'تلفن')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('City', 'ښار', 'شهر')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Status', 'حالت', 'وضعیت')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Joined', 'ځایګیر', 'تاریخ عضویت')}
                  </th>
                  <th className={`px-4 py-3 text-right font-medium text-slate-600 ${rtl ? 'text-left' : ''}`}>
                    {L('Actions', 'عملیات', 'عملیات')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium">
                            {(user.display_name || '?')[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{user.display_name || '—'}</div>
                          <div className="text-xs text-slate-400">{user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>
                      {user.phone || '—'}
                    </td>
                    <td className={`px-4 py-3 text-slate-600 ${rtl ? 'text-right' : ''}`}>
                      {user.city || '—'}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <div className="flex flex-wrap gap-1">
                        {getUserStatusBadges(user).map((badge, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-slate-500 text-xs ${rtl ? 'text-right' : ''}`}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                          title={L('View details', 'تفصیلات وګورئ', 'مشاهده جزئیات')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {user.is_blocked ? (
                          <button
                            onClick={() => openActionModal('unblock', user)}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600"
                            title={L('Unblock', 'بندي لرې کړئ', 'رفع مسدودی')}
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal('block', user)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500"
                            title={L('Block', 'بندي کړئ', 'مسدود کردن')}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {user.is_suspended ? (
                          <button
                            onClick={() => openActionModal('unsuspend', user)}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600"
                            title={L('Unsuspend', 'معلق لرې کړئ', 'رفع تعلیق')}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal('suspend', user)}
                            className="p-1.5 rounded hover:bg-orange-50 text-orange-500"
                            title={L('Suspend', 'معلق کړئ', 'تعلیق')}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {user.listing_restricted ? (
                          <button
                            onClick={() => openActionModal('unrestrict', user)}
                            className="p-1.5 rounded hover:bg-green-50 text-green-600"
                            title={L('Remove restriction', 'محدودیت لرې کړئ', 'رفع محدودیت')}
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal('restrict', user)}
                            className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600"
                            title={L('Restrict listings', 'اعلانونه محدود کړئ', 'محدودیت آگهی')}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => openActionModal('delete', user)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500"
                            title={L('Delete account', 'حساب حذف کړئ', 'حذف حساب')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      {L('No users found', 'کارونکي ونه موندل شول', 'کاربری یافت نشد')}
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

      {/* Action Modal */}
      {showActionModal && actionTarget && actionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${
                actionType === 'block' || actionType === 'delete'
                  ? 'bg-red-100'
                  : actionType === 'suspend'
                  ? 'bg-orange-100'
                  : actionType === 'restrict'
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}>
                {actionType === 'block' && <Ban className="w-5 h-5 text-red-600" />}
                {actionType === 'unblock' && <Unlock className="w-5 h-5 text-green-600" />}
                {actionType === 'suspend' && <UserX className="w-5 h-5 text-orange-600" />}
                {actionType === 'unsuspend' && <UserCheck className="w-5 h-5 text-green-600" />}
                {actionType === 'restrict' && <Shield className="w-5 h-5 text-yellow-600" />}
                {actionType === 'unrestrict' && <ShieldOff className="w-5 h-5 text-green-600" />}
                {actionType === 'delete' && <Trash2 className="w-5 h-5 text-red-600" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {actionType === 'block' && L('Block User', 'کارونکی بندي کړئ', 'مسدود کردن کاربر')}
                  {actionType === 'unblock' && L('Unblock User', 'کارونکي بندي لرې کړئ', 'رفع مسدودی کاربر')}
                  {actionType === 'suspend' && L('Suspend User', 'کارونکی معلق کړئ', 'تعلیق کاربر')}
                  {actionType === 'unsuspend' && L('Unsuspend User', 'کارونکي معلق لرې کړئ', 'رفع تعلیق کاربر')}
                  {actionType === 'restrict' && L('Restrict Listings', 'اعلانونه محدود کړئ', 'محدودیت آگهی')}
                  {actionType === 'unrestrict' && L('Remove Restriction', 'محدودیت لرې کړئ', 'رفع محدودیت')}
                  {actionType === 'delete' && L('Delete Account', 'حساب حذف کړئ', 'حذف حساب')}
                </h3>
                <p className="text-sm text-slate-500">{actionTarget.display_name || actionTarget.id.slice(0, 8)}</p>
              </div>
            </div>

            {(actionType === 'block' || actionType === 'suspend' || actionType === 'restrict' || actionType === 'delete') && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    {L('Reason', 'سبب', 'دلیل')} *
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder={L('Provide a reason...', 'سبب وړاندې کړئ...', 'دلیل را وارد کنید...')}
                  />
                </div>
                {actionType === 'suspend' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {L('Suspend Until (optional)', 'تر کله معلق کړئ (اختیاري)', 'تا تاریخ تعلیق (اختیاری)')}
                    </label>
                    <input
                      type="datetime-local"
                      value={suspendUntil}
                      onChange={(e) => setSuspendUntil(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      title={L('Suspension end date', 'د تعلیق پای نیټه', 'تاریخ پایان تعلیق')}
                    />
                  </div>
                )}
              </div>
            )}

            {actionType === 'delete' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {L(
                      'This will block the user and mark their account as deleted. This action cannot be easily undone.',
                      'دا به کارونکی بندي کړي او د هغوی حساب د حذف شوي په توګه نښه کړي. دا عمل اسانه بیرته نشي کیدی.',
                      'این کاربر مسدود شده و حساب او به عنوان حذف شده علامت‌گذاری می‌شود. این عمل به راحتی قابل بازگشت نیست.'
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleUserAction}
                disabled={
                  actionLoading === actionTarget.id ||
                  ((actionType === 'block' || actionType === 'suspend' || actionType === 'restrict' || actionType === 'delete') && !actionReason.trim())
                }
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 text-sm ${
                  actionType === 'unblock' || actionType === 'unsuspend' || actionType === 'unrestrict'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading === actionTarget.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    {actionType === 'block' && <Ban className="w-4 h-4" />}
                    {actionType === 'unblock' && <Unlock className="w-4 h-4" />}
                    {actionType === 'suspend' && <UserX className="w-4 h-4" />}
                    {actionType === 'unsuspend' && <UserCheck className="w-4 h-4" />}
                    {actionType === 'restrict' && <Shield className="w-4 h-4" />}
                    {actionType === 'unrestrict' && <ShieldOff className="w-4 h-4" />}
                    {actionType === 'delete' && <Trash2 className="w-4 h-4" />}
                  </>
                )}
                {actionType === 'block' && L('Block', 'بندي', 'مسدود')}
                {actionType === 'unblock' && L('Unblock', 'بندي لرې', 'رفع مسدودی')}
                {actionType === 'suspend' && L('Suspend', 'معلق', 'تعلیق')}
                {actionType === 'unsuspend' && L('Unsuspend', 'معلق لرې', 'رفع تعلیق')}
                {actionType === 'restrict' && L('Restrict', 'محدود', 'محدود')}
                {actionType === 'unrestrict' && L('Remove Restriction', 'محدودیت لرې', 'رفع محدودیت')}
                {actionType === 'delete' && L('Delete', 'حذف', 'حذف')}
              </button>
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm"
              >
                {L('Cancel', 'لغوه', 'لغو')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              {selectedUser.avatar_url ? (
                <img src={selectedUser.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg text-slate-500 font-medium">
                  {(selectedUser.display_name || '?')[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{selectedUser.display_name || '—'}</h3>
                <p className="text-xs text-slate-400">{selectedUser.id}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400">{L('Phone', 'تلیفون', 'تلفن')}</span>
                  <p className="text-sm text-slate-700">{selectedUser.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('City', 'ښار', 'شهر')}</span>
                  <p className="text-sm text-slate-700">{selectedUser.city || '—'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Role', 'رول', 'نقش')}</span>
                  <p className="text-sm text-slate-700">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Seller', 'پلورونکی', 'فروشنده')}</span>
                  <p className="text-sm text-slate-700">{selectedUser.is_seller ? L('Yes', 'هو', 'بله') : L('No', 'نه', 'خیر')}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Joined', 'ځایګیر', 'عضویت')}</span>
                  <p className="text-sm text-slate-700">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <span className="text-xs text-slate-400">{L('Status', 'حالت', 'وضعیت')}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {getUserStatusBadges(selectedUser).map((badge, idx) => (
                    <span key={idx} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              {selectedUser.block_reason && (
                <div>
                  <span className="text-xs text-slate-400">{L('Block Reason', 'د بندي سبب', 'دلیل مسدودی')}</span>
                  <p className="text-sm text-red-700 mt-1 bg-red-50 p-2 rounded">{selectedUser.block_reason}</p>
                </div>
              )}
              {selectedUser.suspension_reason && (
                <div>
                  <span className="text-xs text-slate-400">{L('Suspension Reason', 'د تعلیق سبب', 'دلیل تعلیق')}</span>
                  <p className="text-sm text-orange-700 mt-1 bg-orange-50 p-2 rounded">{selectedUser.suspension_reason}</p>
                </div>
              )}
              {selectedUser.suspended_until && (
                <div>
                  <span className="text-xs text-slate-400">{L('Suspended Until', 'تر کله معلق', 'تعلیق تا')}</span>
                  <p className="text-sm text-slate-700">{new Date(selectedUser.suspended_until).toLocaleString()}</p>
                </div>
              )}
              {selectedUser.listing_restriction_reason && (
                <div>
                  <span className="text-xs text-slate-400">{L('Restriction Reason', 'د محدودیت سبب', 'دلیل محدودیت')}</span>
                  <p className="text-sm text-yellow-700 mt-1 bg-yellow-50 p-2 rounded">{selectedUser.listing_restriction_reason}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm"
              >
                {L('Close', 'تړئ', 'بستن')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};