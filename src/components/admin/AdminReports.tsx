'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Flag,
  Search,
} from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { createClient } from '@/lib/supabase/client';
import { SECTION_LABELS, ReportRow, REPORT_REASON_LABELS } from './adminShared';

interface AdminReportsProps {
  locale: Locale;
}

type ReportFilter = 'pending' | 'resolved' | 'rejected' | 'all';

const PAGE_SIZE = 20;

export const AdminReports: React.FC<AdminReportsProps> = ({ locale }) => {
  const rtl = isRTL(locale);
  const supabase = createClient();

  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Detail modal
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const title = SECTION_LABELS.reports[locale] || SECTION_LABELS.reports.en;

  const L = (en: string, ps: string, fa: string) => locale === 'ps' ? ps : locale === 'fa' ? fa : en;

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const loadReports = useCallback(async () => {
    setLoading(true);
    clearMessages();
    try {
      let query = supabase
        .from('reports')
        .select('id, listing_id, reported_by, reason, description, status, admin_notes, resolved_by, resolved_at, created_at, listings(title)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      if (searchQuery.trim()) {
        query = query.or(`description.ilike.%${searchQuery.trim()}%,reason.ilike.%${searchQuery.trim()}%`);
      }

      const { data, count, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      // Map the joined listing title
      const mapped = (data || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        listing_id: r.listing_id as string,
        listing_title: (r.listings as Record<string, unknown>)?.title as string || '',
        reported_by: r.reported_by as string,
        reporter_name: (r.reported_by as string).slice(0, 8) + '...',
        reason: r.reason as string,
        description: r.description as string | null,
        status: r.status as string,
        admin_notes: r.admin_notes as string | null,
        resolved_by: r.resolved_by as string | null,
        resolved_at: r.resolved_at as string | null,
        created_at: r.created_at as string,
      }));

      setTotalCount(count || 0);
      setReports(mapped as ReportRow[]);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [supabase, filter, searchQuery, page]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const openDetail = (report: ReportRow) => {
    setSelectedReport(report);
    setAdminNotes(report.admin_notes || '');
  };

  const handleResolve = async (reportId: string, action: 'resolved' | 'rejected') => {
    setActionLoading(reportId);
    clearMessages();

    try {
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: action,
          admin_notes: adminNotes || null,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      setSuccess(L(
        `Report ${action === 'resolved' ? 'resolved' : 'rejected'}`,
        `گزارش ${action === 'resolved' ? 'حل شد' : 'رد شد'}`,
        `گزارش ${action === 'resolved' ? 'حل شد' : 'رد شد'}`
      ));

      setSelectedReport(null);
      await loadReports();
    } catch (err) {
      setError(String(err));
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const filters: { id: ReportFilter; label: string }[] = [
    { id: 'pending', label: L('Pending', 'انتظار', 'در انتظار') },
    { id: 'resolved', label: L('Resolved', 'حل شوی', 'حل شده') },
    { id: 'rejected', label: L('Rejected', 'رد شوی', 'رد شده') },
    { id: 'all', label: L('All', 'ټول', 'همه') },
  ];

  const getReasonLabel = (reason: string) => {
    return REPORT_REASON_LABELS[reason]?.[locale] || REPORT_REASON_LABELS[reason]?.en || reason;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {/* Filters */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setPage(0); }}
            className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
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
            placeholder={L('Search reports...', 'گزارشونه ولټوئ...', 'جستجوی گزارش‌ها...')}
          />
        </div>
        <button
          onClick={loadReports}
          className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          title={L('Refresh', 'تازه کړئ', 'بازنشانی')}
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Flag className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-500">
            {totalCount} {L('reports', 'گزارشونه', 'گزارش')}
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
                    {L('Listing', 'اعلان', 'آگهی')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Reason', 'سبب', 'دلیل')}
                  </th>
                  <th className={`px-4 py-3 text-left font-medium text-slate-600 ${rtl ? 'text-right' : ''}`}>
                    {L('Description', 'تشریح', 'توضیحات')}
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <div className="font-medium text-slate-800 max-w-[150px] truncate">
                        {report.listing_title || report.listing_id.slice(0, 8) + '...'}
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                        {getReasonLabel(report.reason)}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-slate-500 max-w-[200px] truncate ${rtl ? 'text-right' : ''}`}>
                      {report.description || '—'}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-right' : ''}`}>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-slate-500 text-xs ${rtl ? 'text-right' : ''}`}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 ${rtl ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => openDetail(report)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                          title={L('View details', 'تفصیلات وګورئ', 'مشاهده جزئیات')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setAdminNotes(report.admin_notes || '');
                                handleResolve(report.id, 'resolved');
                              }}
                              disabled={actionLoading === report.id}
                              className="p-1.5 rounded hover:bg-green-50 text-green-600 disabled:opacity-50"
                              title={L('Resolve', 'حل کړئ', 'حل')}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReport(report);
                                setAdminNotes(report.admin_notes || '');
                                handleResolve(report.id, 'rejected');
                              }}
                              disabled={actionLoading === report.id}
                              className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-50"
                              title={L('Reject', 'رد کړئ', 'رد')}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      {L('No reports found', 'گزارشونه ونه موندل شول', 'گزارشی یافت نشد')}
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

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {L('Report Details', 'د گزارش تفصیلات', 'جزئیات گزارش')}
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400">{L('Listing', 'اعلان', 'آگهی')}</span>
                  <p className="text-sm font-medium text-slate-700">{selectedReport.listing_title || selectedReport.listing_id}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Reason', 'سبب', 'دلیل')}</span>
                  <p className="text-sm font-medium text-slate-700">{getReasonLabel(selectedReport.reason)}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Status', 'حالت', 'وضعیت')}</span>
                  <p className="text-sm">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">{L('Reported', 'گزارش شوی', 'گزارش شده')}</span>
                  <p className="text-sm text-slate-700">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedReport.description && (
                <div>
                  <span className="text-xs text-slate-400">{L('Description', 'تشریح', 'توضیحات')}</span>
                  <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-2 rounded">{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.admin_notes && (
                <div>
                  <span className="text-xs text-slate-400">{L('Previous Admin Notes', 'مخکني اډمین یادداشتونه', 'یادداشت‌های قبلی ادمین')}</span>
                  <p className="text-sm text-slate-700 mt-1 bg-blue-50 p-2 rounded">{selectedReport.admin_notes}</p>
                </div>
              )}

              {selectedReport.resolved_at && (
                <div>
                  <span className="text-xs text-slate-400">{L('Resolved At', 'حل شوی په', 'حل شده در')}</span>
                  <p className="text-sm text-slate-700">{new Date(selectedReport.resolved_at).toLocaleString()}</p>
                </div>
              )}

              {selectedReport.status === 'pending' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {L('Admin Notes', 'اډمین یادداشتونه', 'یادداشت ادمین')}
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder={L('Add notes...', 'یادداشتونه اضافه کړئ...', 'اضافه کردن یادداشت...')}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              {selectedReport.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleResolve(selectedReport.id, 'resolved')}
                    disabled={actionLoading === selectedReport.id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {L('Resolve', 'حل کړئ', 'حل')}
                  </button>
                  <button
                    onClick={() => handleResolve(selectedReport.id, 'rejected')}
                    disabled={actionLoading === selectedReport.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    {L('Reject', 'رد کړئ', 'رد')}
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedReport(null)}
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