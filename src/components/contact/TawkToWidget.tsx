'use client';

// src/components/contact/TawkToWidget.tsx
import { useEffect } from 'react';

/**
 * Tawk.to Live Chat Widget
 *
 * Setup:
 * 1. Create a free account at https://www.tawk.to
 * 2. Add NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID to .env
 * 3. Import this component in your root layout
 *
 * The widget renders a floating chat button in the bottom-right corner.
 */
export function TawkToWidget() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  useEffect(() => {
    if (!propertyId || !widgetId) {
      console.warn(
        'Tawk.to is not configured. Set NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID in .env'
      );
      return;
    }

    // Prevent double-initialization in React Strict Mode
    if (document.getElementById('tawkto-script')) return;

    // Only access window inside useEffect (client-side only)
    // @ts-expect-error Tawk.to global API
    window.Tawk_API = window.Tawk_API || {};
    // @ts-expect-error Tawk.to global
    window.Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      // Fallback: append to document head
      document.head.appendChild(script);
    }

    // Add mobile-specific CSS to ensure widget is visible
    const styleId = 'tawkto-mobile-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Ensure Tawk.to widget is visible on mobile */
        @media (max-width: 768px) {
          .tawk-min-container,
          .tawk-button,
          .tawk-button-circle,
          #tawkchat-container,
          .tawk-chat-container {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 99999 !important;
          }
          
          /* Fix positioning for mobile */
          .tawk-button {
            bottom: 20px !important;
            right: 20px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup: remove the Tawk.to widget when component unmounts
      const existing = document.getElementById('tawkto-script');
      if (existing) existing.remove();
      const iframe = document.querySelector('iframe[title*="chat"]')?.parentElement;
      if (iframe) iframe.remove();
      // Remove mobile CSS
      const mobileStyle = document.getElementById('tawkto-mobile-css');
      if (mobileStyle) mobileStyle.remove();
    };
  }, [propertyId, widgetId]);

  // This component renders nothing visible — Tawk.to injects its own UI
  return null;
}
