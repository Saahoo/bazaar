'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const currentDragY = useRef(0);
  // Track whether we're mounted in the browser so the portal target exists
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open, but allow touch scrolling inside the sheet
  useEffect(() => {
    if (!open) return;

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

  // Swipe-to-dismiss: track touch drag on the sheet header area
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentDragY.current = e.touches[0].clientY;
    const delta = currentDragY.current - dragStartY.current;
    // If swiping down, translate the sheet
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = 'none';
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = currentDragY.current - dragStartY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      sheetRef.current.style.transition = '';
    }
    // Dismiss if swiped more than 100px down
    if (delta > 100) {
      onClose();
    }
    dragStartY.current = 0;
    currentDragY.current = 0;
  }, [onClose]);

  // Sheet content — rendered via portal to avoid transform-based positioning bugs
  const sheetContent = (
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
          {/* Bottom Sheet Panel */}
          <motion.section
            ref={sheetRef}
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
            {/* Header - touch-draggable for swipe-to-dismiss */}
            <div
              className="flex items-center justify-between border-b border-slate-100 px-5 py-4 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="space-y-1.5">
                {/* Drag handle */}
                <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200/80" />
                {title && (
                  <h2 className="text-base font-bold text-slate-900">{title}</h2>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                title="Close filters"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content - touch-scrollable with momentum */}
            <div
              className="max-h-[calc(85vh-5rem)] overflow-y-auto overscroll-contain px-5 py-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );

  // Render via portal into <body> so that position:fixed works correctly
  // even when parent elements have CSS transforms (e.g. PageTransition's motion.div)
  if (!mounted) return null;
  return createPortal(sheetContent, document.body);
}
