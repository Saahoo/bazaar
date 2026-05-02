'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const drawerContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              onClose();
            }}
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
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                title="Close drawer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-5"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  // Render via portal into <body> so that position:fixed works correctly
  // even when parent elements have CSS transforms (e.g. PageTransition's motion.div)
  if (!mounted) return null;
  return createPortal(drawerContent, document.body);
}
