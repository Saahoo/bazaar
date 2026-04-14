'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={cn('fixed inset-x-0 bottom-0 z-[80] max-h-[85vh] overflow-hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl', className)}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="space-y-1">
                <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-200" />
                {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                title="Close filters"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[calc(85vh-5rem)] overflow-y-auto px-5 py-4">{children}</div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}