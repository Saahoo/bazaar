'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, side = 'right', children, className }: DrawerProps) {
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
            aria-label="Close drawer"
            className="fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-y-0 z-[80] flex w-[min(88vw,26rem)] flex-col bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl',
              side === 'right' ? 'right-0 border-l border-slate-200/50' : 'left-0 border-r border-slate-200/50',
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                {title && (
                  <h2 className="text-base font-bold text-slate-900">
                    {title}
                  </h2>
                )}
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close drawer"
                title="Close drawer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
