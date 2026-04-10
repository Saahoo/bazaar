'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, isRTL } from '@/lib/i18n/config';

interface LegalReadNoticeProps {
  locale: Locale;
  initialRead?: boolean;
  onReadChange: (read: boolean) => void;
}

export const LegalReadNotice: React.FC<LegalReadNoticeProps> = ({
  locale,
  initialRead = false,
  onReadChange,
}) => {
  const t = useTranslations('legal');
  const rtl = isRTL(locale);
  const [open, setOpen] = useState(false);
  const [hasRead, setHasRead] = useState(initialRead);

  useEffect(() => {
    onReadChange(hasRead);
  }, [hasRead, onReadChange]);

  const sectionTitleClass = `text-sm font-semibold text-slate-800 ${rtl ? 'text-right' : 'text-left'}`;
  const textClass = `text-sm text-slate-600 ${rtl ? 'text-right' : 'text-left'}`;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
      <div className={`flex items-center justify-between gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
        <p className={textClass}>{t('readRequired')}</p>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:border-primary-400"
        >
          {t('readButton')}
        </button>
      </div>

      {open && (
        <div className="space-y-4">
          <section className="space-y-1.5">
            <h4 className={sectionTitleClass}>{t('termsTitle')}</h4>
            <h4 className={sectionTitleClass}>{t('termsTitle1')}</h4>
            <ul className={`list-disc pl-5 space-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              <li className="text-sm text-slate-600">{t('termsPoint1')}</li>
              <li className="text-sm text-slate-600">{t('termsPoint2')}</li>
              <li className="text-sm text-slate-600">{t('termsPoint3')}</li>
              <li className="text-sm text-slate-600">{t('termsPoint4')}</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className={sectionTitleClass}>{t('disclaimerTitle')}</h4>
            <ul className={`list-disc pl-5 space-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              <li className="text-sm text-slate-600">{t('disclaimerPoint1')}</li>
              <li className="text-sm text-slate-600">{t('disclaimerPoint2')}</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h4 className={sectionTitleClass}>{t('safeTitle')}</h4>
            <ul className={`list-disc pl-5 space-y-1 ${rtl ? 'text-right' : 'text-left'}`}>
              <li className="text-sm text-slate-600">{t('safePoint1')}</li>
              <li className="text-sm text-slate-600">{t('safePoint2')}</li>
              <li className="text-sm text-slate-600">{t('safePoint3')}</li>
              <li className="text-sm text-slate-600">{t('safePoint4')}</li>
            </ul>
          </section>

          <div className={`flex ${rtl ? 'justify-start' : 'justify-end'}`}>
            <button
              type="button"
              onClick={() => {
                setHasRead(true);
                setOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              {t('markRead')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
