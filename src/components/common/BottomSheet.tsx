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
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close filters"
            className="fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {/* Bottom Sheet Panel */}
          <motion.section
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-[80] max-h-[85vh] overflow-hidden rounded-t-[2rem] border border-slate-200/50 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="space-y-1.5">
                {/* Drag handle */}
                <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200/80" />
                {title && (
                  <h2 className="text-base font-bold text-slate-900">{title}</h2>
                )}
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close filters"
                title="Close filters"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            {/* Content */}
            <div className="max-h-[calc(85vh-5rem)] overflow-y-auto px-5 py-4">{children}</div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
