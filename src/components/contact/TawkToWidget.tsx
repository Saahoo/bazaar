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
    // Debug logging for production diagnosis - enhanced
    const isProduction = process.env.NODE_ENV === 'production';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server';
    
    console.log('TawkToWidget: Initializing', {
      hasPropertyId: !!propertyId,
      hasWidgetId: !!widgetId,
      propertyId: propertyId ? `${propertyId.substring(0, 4)}...` : 'missing',
      widgetId: widgetId ? `${widgetId.substring(0, 4)}...` : 'missing',
      environment: process.env.NODE_ENV,
      hostname,
      isProduction,
      timestamp: new Date().toISOString()
    });

    if (!propertyId || !widgetId) {
      console.error(
        'Tawk.to is not configured. Set NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID in environment variables.',
        {
          propertyId,
          widgetId,
          envKeys: Object.keys(process.env).filter(key => key.includes('TAWK') || key.includes('NEXT_PUBLIC'))
        }
      );
      
      // Show a visual indicator in development that widget is not configured
      if (!isProduction) {
        const warningDiv = document.createElement('div');
        warningDiv.id = 'tawkto-config-warning';
        warningDiv.style.cssText = `
          position: fixed;
          bottom: 10px;
          left: 10px;
          background: #ff6b6b;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 999999;
          max-width: 300px;
        `;
        warningDiv.textContent = 'Tawk.to widget not configured (check env vars)';
        document.body.appendChild(warningDiv);
      }
      return;
    }

    // Prevent double-initialization in React Strict Mode
    if (document.getElementById('tawkto-script')) {
      console.log('TawkToWidget: Script already loaded, skipping');
      return;
    }

    // Only access window inside useEffect (client-side only)
    // @ts-expect-error Tawk.to global API
    window.Tawk_API = window.Tawk_API || {};
    // @ts-expect-error Tawk.to global
    window.Tawk_LoadStart = new Date();

    // Set up Tawk_API callbacks for debugging
    // @ts-expect-error Tawk.to global API
    window.Tawk_API.onLoad = function() {
      console.log('TawkToWidget: Tawk.to API loaded successfully');
    };

    // @ts-expect-error Tawk.to global API
    window.Tawk_API.onChatMaximized = function() {
      console.log('TawkToWidget: Chat maximized');
    };

    // @ts-expect-error Tawk.to global API
    window.Tawk_API.onChatMinimized = function() {
      console.log('TawkToWidget: Chat minimized');
    };

    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.setAttribute('data-domain', hostname);

    // Add comprehensive error handling for script loading
    script.onerror = (error) => {
      console.error('TawkToWidget: Failed to load Tawk.to script.', {
        error,
        src: script.src,
        hostname,
        propertyId: propertyId ? `${propertyId.substring(0, 4)}...` : 'missing',
        widgetId: widgetId ? `${widgetId.substring(0, 4)}...` : 'missing',
        possibleIssues: [
          'Check if domain is whitelisted in Tawk.to dashboard',
          'Check CSP headers',
          'Check network connectivity',
          'Verify environment variables are set on Vercel'
        ]
      });
      
      // Show error indicator in development
      if (!isProduction) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'tawkto-load-error';
        errorDiv.style.cssText = `
          position: fixed;
          bottom: 50px;
          left: 10px;
          background: #ffa500;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 999999;
          max-width: 300px;
        `;
        errorDiv.textContent = 'Tawk.to script failed to load (check console)';
        document.body.appendChild(errorDiv);
      }
    };
    
    script.onload = () => {
      console.log('TawkToWidget: Script loaded successfully', {
        src: script.src,
        hostname,
        timestamp: new Date().toISOString()
      });
      
      // Check if Tawk.to widget initialized properly after a delay
      setTimeout(() => {
        const tawkWidget = document.querySelector('.tawk-button, .tawk-min-container, iframe[src*="tawk.to"]');
        if (!tawkWidget) {
          console.warn('TawkToWidget: Script loaded but no widget elements found after 2s. Possible domain whitelisting issue.');
        } else {
          console.log('TawkToWidget: Widget elements found', tawkWidget);
        }
      }, 2000);
    };

    // Try multiple insertion methods for maximum compatibility
    let inserted = false;
    
    // Method 1: Insert before first script tag
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
      inserted = true;
      console.log('TawkToWidget: Script inserted before first script tag');
    }
    
    // Method 2: Append to head if first method failed
    if (!inserted && document.head) {
      document.head.appendChild(script);
      inserted = true;
      console.log('TawkToWidget: Script appended to document head');
    }
    
    // Method 3: Append to body as fallback
    if (!inserted && document.body) {
      document.body.appendChild(script);
      console.log('TawkToWidget: Script appended to document body (fallback)');
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
            width: 60px !important;
            height: 60px !important;
          }
          
          /* Ensure iframe is visible */
          iframe[src*="tawk.to"] {
            display: block !important;
            visibility: visible !important;
          }
        }
        
        /* Additional production fixes */
        .tawk-button {
          transition: all 0.3s ease !important;
        }
        
        /* Ensure widget is above other elements */
        #tawkchat-container, .tawk-chat-container {
          z-index: 999999 !important;
        }
      `;
      
      if (document.head) {
        document.head.appendChild(style);
        console.log('TawkToWidget: Mobile CSS injected');
      }
    }

    return () => {
      // Cleanup: remove the Tawk.to widget when component unmounts
      const existing = document.getElementById('tawkto-script');
      if (existing) existing.remove();
      
      // Remove any Tawk.to iframes
      const iframes = document.querySelectorAll('iframe[src*="tawk.to"]');
      iframes.forEach(iframe => {
        const container = iframe.closest('div');
        if (container) container.remove();
      });
      
      // Remove mobile CSS
      const mobileStyle = document.getElementById('tawkto-mobile-css');
      if (mobileStyle) mobileStyle.remove();
      
      // Remove any debug indicators
      const warningDiv = document.getElementById('tawkto-config-warning');
      if (warningDiv) warningDiv.remove();
      
      const errorDiv = document.getElementById('tawkto-load-error');
      if (errorDiv) errorDiv.remove();
      
      console.log('TawkToWidget: Cleanup completed');
    };
  }, [propertyId, widgetId]);

  // This component renders nothing visible — Tawk.to injects its own UI
  return null;
}
