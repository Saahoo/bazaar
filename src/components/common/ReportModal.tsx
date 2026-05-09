// src/components/common/ReportModal.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Flag, AlertTriangle, Loader2 } from 'lucide-react';
import { Locale, isRTL } from '@/lib/i18n/config';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/common/ToastProvider';
import { useRouter } from 'next/navigation';

interface ReportModalProps {
  locale: Locale;
  listingId: string;
  listingTitle: string;
  open: boolean;
  onClose: () => void;
}

const REASON_OPTIONS = [
  { value: 'spam', labelEn: 'Spam', labelPs: 'سپم', labelFa: 'اسپم' },
  { value: 'fraud_scam', labelEn: 'Fraud / Scam', labelPs: 'درغلۍ', labelFa: 'کلاهبرداری' },
  { value: 'duplicate_listing', labelEn: 'Duplicate Listing', labelPs: 'تکراري اعلان', labelFa: 'آگهی تکراری' },
  { value: 'wrong_category', labelEn: 'Wrong Category', labelPs: 'ناسمه کټګوري', labelFa: 'دسته‌بندی اشتباه' },
  { value: 'prohibited_item', labelEn: 'Prohibited Item', labelPs: 'منع شوی توکی', labelFa: 'کالای ممنوعه' },
  { value: 'offensive_content', labelEn: 'Offensive Content', labelPs: 'توهیني منځپانګه', labelFa: 'محتوای توهین‌آمیز' },
  { value: 'other', labelEn: 'Other', labelPs: 'نور', labelFa: 'سایر' },
] as const;

export const ReportModal: React.FC<ReportModalProps> = ({
  locale,
  listingId,
  listingTitle,
  open,
  onClose,
}) => {
  const rtl = isRTL(locale);
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (!open || !mounted) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, mounted]);

  // Focus management: trap focus inside modal and restore on close
  useEffect(() => {
    if (!open || !mounted) return;

    // Save the currently focused element so we can restore it later
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the modal container after a tick (allow portal to render)
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      // Restore focus to the element that had focus before the modal opened
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        try {
          previousFocusRef.current.focus();
        } catch {
          // Element may have been removed from DOM
        }
      }
    };
  }, [open, mounted]);

  // Escape key handler
  useEffect(() => {
    if (!open || !mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, mounted, submitting]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLabel = useCallback(
    (opt: (typeof REASON_OPTIONS)[number]) => {
      if (locale === 'ps') return opt.labelPs;
      if (locale === 'fa') return opt.labelFa;
      return opt.labelEn;
    },
    [locale]
  );

  const t = useCallback(
    (key: string): string => {
      const texts: Record<string, Record<string, string>> = {
        title: { en: 'Report Listing', ps: 'اعلان راپور کړئ', fa: 'گزارش آگهی' },
        subtitle: {
          en: `Report "${listingTitle}"`,
          ps: `"${listingTitle}" راپور کړئ`,
          fa: `گزارش "${listingTitle}"`,
        },
        reasonLabel: { en: 'Reason *', ps: 'دلیل *', fa: 'دلیل *' },
        reasonPlaceholder: {
          en: 'Select a reason...',
          ps: 'دلیل وټاکئ...',
          fa: 'دلیل را انتخاب کنید...',
        },
        descriptionLabel: {
          en: 'Additional details (optional)',
          ps: 'اضافي جزئیات (اختیاري)',
          fa: 'جزئیات بیشتر (اختیاری)',
        },
        descriptionPlaceholder: {
          en: 'Provide any additional context that might help us review this listing...',
          ps: 'هر اضافي معلومات چې زموږ د څارنې لپاره مرسته وکړي...',
          fa: 'هرگونه اطلاعات تکمیلی که به بررسی این آگهی کمک می‌کند...',
        },
        descriptionHint: {
          en: 'The more detail you provide, the faster we can review this report.',
          ps: 'هرڅومره ډیر جزئیات ورکړئ، هغومره ژر به وڅارل شي.',
          fa: 'هرچه جزئیات بیشتری ارائه دهید، سریع‌تر بررسی خواهد شد.',
        },
        submit: { en: 'Submit Report', ps: 'راپور وسپارئ', fa: 'ارسال گزارش' },
        submitting: { en: 'Submitting...', ps: 'سپارل کیږي...', fa: 'در حال ارسال...' },
        cancel: { en: 'Cancel', ps: 'لغوه', fa: 'انصراف' },
        reasonRequired: { en: 'Please select a reason', ps: 'مهرباني وکړئ دلیل وټاکئ', fa: 'لطفاً دلیل را انتخاب کنید' },
        loginRequired: {
          en: 'Please log in to report a listing',
          ps: 'د اعلان راپور لپاره ننوځئ',
          fa: 'برای گزارش آگهی وارد شوید',
        },
        success: { en: 'Report submitted successfully', ps: 'راپور په بریالیتوب سره وسپارل شو', fa: 'گزارش با موفقیت ارسال شد' },
        duplicate: {
          en: 'You have already reported this listing',
          ps: 'تاسو دا اعلان دمخه راپور کړی دی',
          fa: 'شما قبلاً این آگهی را گزارش کرده‌اید',
        },
        error: { en: 'Failed to submit report. Please try again.', ps: 'راپور سپارل ناکام شو. بیا هڅه وکړئ.', fa: 'ارسال گزارش ناموفق بود. دوباره تلاش کنید.' },
        warning: {
          en: 'Reports are reviewed by our moderation team. Misuse of the report system may result in account restrictions.',
          ps: 'راپورونه د زموږ د څارنې ټیم لخوا کتل کیږي. د راپور سیسټم ناسم کارول د حساب محدودیت لامل کیدی شي.',
          fa: 'گزارش‌ها توسط تیم نظارت بررسی می‌شوند. سوءاستفاده از سیستم گزارش ممکن است منجر به محدودیت حساب شود.',
        },
      };
      return texts[key]?.[locale] ?? texts[key]?.['en'] ?? key;
    },
    [locale, listingTitle]
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!reason) {
      newErrors.reason = t('reasonRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [reason, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast(t('loginRequired'), 'error');
      router.push(`/${locale}/login`);
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          reason,
          description: description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          showToast(t('duplicate'), 'error');
        } else {
          showToast(data.error || t('error'), 'error');
        }
        return;
      }

      showToast(t('success'), 'success');
      setReason('');
      setDescription('');
      setErrors({});
      onClose();
    } catch {
      showToast(t('error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setReason('');
    setDescription('');
    setErrors({});
    onClose();
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        // Prevent any click on the overlay from propagating to elements behind it
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden ${rtl ? 'text-right' : 'text-left'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        tabIndex={-1}
        onClick={(e) => {
          // Prevent clicks inside the modal from propagating
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-red-50 to-orange-50">
          <div className={`flex items-center gap-2.5 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Flag className="w-4.5 h-4.5" />
            </div>
            <h2 id="report-modal-title" className="text-base font-bold text-slate-900">
              {t('title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Listing title */}
          <p className="text-sm text-slate-500 truncate" title={listingTitle}>
            {t('subtitle')}
          </p>

          {/* Reason select */}
          <div>
            <label htmlFor="report-reason" className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('reasonLabel')}
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) setErrors((prev) => ({ ...prev, reason: '' }));
              }}
              className={`w-full px-3 py-2.5 border rounded-xl bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                errors.reason ? 'border-red-300 bg-red-50/30' : 'border-slate-300'
              }`}
            >
              <option value="">{t('reasonPlaceholder')}</option>
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {getLabel(opt)}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Description textarea */}
          <div>
            <label htmlFor="report-description" className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('descriptionLabel')}
            </label>
            <textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            <div className={`flex items-center justify-between mt-1 ${rtl ? 'flex-row-reverse' : ''}`}>
              <p className="text-xs text-slate-400">{t('descriptionHint')}</p>
              <p className="text-xs text-slate-400">{description.length}/1000</p>
            </div>
          </div>

          {/* Warning */}
          <div className={`rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 flex gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t('warning')}</span>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-2 pt-1 ${rtl ? 'flex-row-reverse' : ''}`}>
            <button
              type="submit"
              disabled={submitting || !reason}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4" />
                  {t('submit')}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
