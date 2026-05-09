'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
  itemClassName?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  className,
  itemClassName,
}: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              'rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50 overflow-hidden',
              itemClassName
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#c00000]/10 text-[#c00000] dark:bg-[#ff7c00]/20 dark:text-[#ff7c00]">
                  {item.icon || <HelpCircle className="h-4 w-4" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {item.question}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-4 flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-16">
                    <div className="prose prose-slate max-w-none dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-300">
                      <p className="whitespace-pre-line">{item.answer}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}