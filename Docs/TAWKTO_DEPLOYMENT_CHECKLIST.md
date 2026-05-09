# Tawk.to Chat Widget Deployment Checklist

## Issue Summary
The Tawk.to live chat widget works on localhost but not on the production Vercel deployment (https://bazaar-on8l.vercel.app).

## Root Causes Investigated
1. ✅ **Environment Variables** - Checked `.env.example` and local configuration
2. ✅ **Component Implementation** - Enhanced `TawkToWidget.tsx` with better debugging
3. ✅ **CSP Headers** - No restrictive CSP in `next.config.ts`
4. ⚠️ **Domain Whitelisting** - Most likely cause: production domain not whitelisted in Tawk.to dashboard
5. ⚠️ **Vercel Environment Variables** - Need to verify variables are set on Vercel

## Fixes Applied

### 1. Enhanced TawkToWidget Component
- Added comprehensive debug logging for production diagnosis
- Added visual indicators in development when widget fails to load
- Improved error handling with specific error messages
- Added mobile-specific CSS fixes
- Added multiple script insertion methods for compatibility
- Added Tawk.to API callbacks for monitoring

### 2. Debugging Features
The component now logs:
- Environment variable status (masked for security)
- Hostname and environment detection
- Script loading success/failure
- Widget element detection after load
- Timestamps for tracking

### 3. Production-Specific Checks
- Checks if Tawk.to widget elements appear after script load
- Provides specific troubleshooting suggestions in console
- Visual indicators in development mode

## Deployment Steps

### Step 1: Verify Vercel Environment Variables
1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Ensure these variables are set:
   - `NEXT_PUBLIC_TAWK_PROPERTY_ID=69ff42786dc8a01c3401b6b8`
   - `NEXT_PUBLIC_TAWK_WIDGET_ID=1jo6hnaff`
3. Redeploy after adding/changing variables

### Step 2: Whitelist Production Domain in Tawk.to
1. Log in to [Tawk.to dashboard](https://dashboard.tawk.to)
2. Go to your widget settings
3. Find "Whitelist Domains" or "Allowed Domains"
4. Add: `bazaar-on8l.vercel.app`
5. Also add: `*.vercel.app` (wildcard for all Vercel deployments)
6. Save changes

### Step 3: Test Production Deployment
1. Deploy the updated code to Vercel
2. Open https://bazaar-on8l.vercel.app/en
3. Open browser console (F12 → Console)
4. Look for TawkToWidget debug messages
5. Check for any CSP or network errors

### Step 4: Verify Widget Appearance
1. Wait 3-5 seconds for widget to load
2. Look for chat button in bottom-right corner
3. On mobile: ensure widget is visible (added mobile CSS fixes)
4. Click the widget to test functionality

## Troubleshooting Guide

### If widget still doesn't appear:

#### Check Console Errors:
1. **"Tawk.to is not configured"** → Environment variables missing on Vercel
2. **"Failed to load Tawk.to script"** → CSP blocking or domain not whitelisted
3. **No errors but no widget** → Domain whitelisting issue

#### Manual Script Test:
```html
<!-- Test script directly in browser console -->
const script = document.createElement('script');
script.src = 'https://embed.tawk.to/69ff42786dc8a01c3401b6b8/1jo6hnaff';
document.head.appendChild(script);
```

#### CSP Issues:
If you see CSP errors, add to `next.config.ts` headers:
```javascript
{
  key: 'Content-Security-Policy',
  value: "script-src 'self' https://embed.tawk.to;"
}
```

## Expected Console Output on Success

```
TawkToWidget: Initializing {hasPropertyId: true, hasWidgetId: true, ...}
TawkToWidget: Script inserted before first script tag
TawkToWidget: Script loaded successfully
TawkToWidget: Tawk.to API loaded successfully
TawkToWidget: Widget elements found <div class="tawk-button">
```

## Mobile-Specific Fixes
- Added CSS to ensure widget visibility on mobile
- Fixed positioning for mobile screens
- Increased z-index to ensure widget appears above other elements

## Rollback Plan
If issues persist, the component will:
1. Show visual debug indicators in development
2. Log detailed errors to console
3. Not break the application (fails gracefully)

## Support
For Tawk.to account issues:
- Verify property ID and widget ID in Tawk.to dashboard
- Check widget is active and published
- Ensure free plan supports external domains

## Last Updated
2026-05-09