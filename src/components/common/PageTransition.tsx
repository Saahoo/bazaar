'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Page enter animation.
 *
 * AnimatePresence with mode="wait" was removed because it intercepts
 * React's unmount cycle using internal reconciler APIs that changed in
 * React 19. When combined with Suspense boundaries (dynamic imports,
 * data fetching), this caused "Cannot read properties of undefined
 * (reading 'call')" at runtime.
 *
 * We keep the mount animation (initial → animate) which is safe, and
 * drop the exit animation to avoid the AnimatePresence + Suspense
 * conflict.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen flex-col"
    >
      {children}
    </motion.div>
  );
}
