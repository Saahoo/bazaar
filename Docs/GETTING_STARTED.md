# Getting Started Guide - Bazaar

## ⚡ 5-Minute Quick Start

### Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version

# Install pnpm if missing
npm install -g pnpm

# Verify pnpm
pnpm --version
```

### 1. Clone & Install (1 min)
```bash
git clone https://github.com/yourusername/bazaar.git
cd bazaar
pnpm install
```

### 2. Setup Environment (2 min)
```bash
# Copy template
cp .env.example .env.local

# ✏️ Edit .env.local with your Supabase credentials
# (Get from: https://supabase.com/dashboard)
```

Minimal required:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### 3. Start Development (2 min)
```bash
pnpm dev
```

👉 Open your browser:
- **English**: http://localhost:3000/en
- **پښتو (Pashto)**: http://localhost:3000/ps
- **دری (Dari)**: http://localhost:3000/fa

🎉 **Done!** You now have Bazaar running locally!

---

## 📋 Full Setup Guide (30 minutes)

### Step 1: Create Supabase Project (5 min)

1. Go to https://supabase.com and sign up
2. Create new project:
   - **Name**: `bazaar`
   - **Password**: Save it safely
   - **Region**: Choose closest to you
3. Wait for project to initialize (1-2 min)

### Step 2: Get Supabase Credentials (3 min)

In Supabase Dashboard:
1. Go to **Settings → API**
2. Copy these values to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[PASTE_HERE]
   SUPABASE_SERVICE_ROLE_KEY=[PASTE_HERE]
   ```

### Step 3: Setup Database (5 min)

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install CLI
npm install -g supabase

# Login
supabase login
# This opens browser - authenticate

# Link project
supabase link --project-ref abc123xyz
# (Find project ref in Supabase dashboard)

# Push schema
supabase db push
# This runs database/schema.sql
```

**Option B: Manual Import**

1. In Supabase, go to **SQL Editor**
2. Click **+ New Query**
3. Copy entire content of `database/schema.sql`
4. Paste into SQL editor
5. Click **Run**

### Step 4: Setup Authentication (3 min)

In Supabase Dashboard:

1. **Go to Auth → Providers**
2. **Enable Email/Password**:
   - Email confirmations: off (for testing)
3. **Enable Google OAuth**:
   - Create Google OAuth app: https://console.cloud.google.com
   - Get Client ID & Secret
   - Paste into Supabase

### Step 5: Create Storage Buckets (2 min)

In Supabase Dashboard:

1. **Go to Storage**
2. **Create Bucket 1**:
   - Name: `listings-photos`
   - Make public: ✅
3. **Create Bucket 2**:
   - Name: `user-avatars`
   - Make public: ✅

### Step 6: Start Local Development (1 min)

```bash
# Install dependencies (if not done)
pnpm install

# Run dev server
pnpm dev

# In another terminal, start Supabase locally (optional)
supabase start
```

You're all set! 🚀

---

## 🎯 Project Structure Overview

```
src/
├── app/[lang]/           ← Pages with i18n
│   ├── page.tsx          ← Homepage
│   ├── layout.tsx        ← RTL wrapper
│   └── (marketplace)/    ← Feature folders
│
├── components/
│   ├── homepage/         ← Hero, categories
│   ├── layout/           ← Header, footer
│   └── common/           ← Reusable components
│
├── lib/
│   ├── i18n/             ← next-intl config
│   ├── supabase/         ← Database client
│   ├── utils/            ← RTL helpers
│   └── constants/        ← Categories, cities
│
└── locales/              ← Translations (JSON)
    ├── en/
    ├── ps/
    └── fa/
```

---

## 🌍 How Languages Work

### URL-Based Routing
All pages use dynamic routes:
```
/en/search       ← English version
/ps/search       ← Pashto version (RTL)
/fa/search       ← Dari version (RTL)
```

### Automatic RTL
The layout automatically flips for Pashto (`ps`) and Dari (`fa`):
```html
<!-- English (LTR) -->
<html dir="ltr" lang="en">

<!-- Pashto (RTL) -->
<html dir="rtl" lang="ps">
```

### Using Translations in Components
```typescript
// src/components/MyComponent.tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('homepage');
  return <h1>{t('heroTitle')}</h1>;
}
```

---

## 🎨 Customizing Design

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0066FF',   // ← Change this blue
  },
  accent: {
    500: '#FF6600',   // ← Change this orange
  }
}
```

### Change Fonts

Edit `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your Font Name', ...defaultTheme.fontFamily.sans],
  // For Pashto/Dari, we use Noto Sans Arabic
}
```

### Add More Categories

Edit `src/lib/constants/categories.ts`:
```typescript
{
  id: 13,
  name_en: 'Books',
  name_ps: 'کتابیں',
  name_fa: 'کتاب',
  icon: 'book',
},
```

---

## 🔧 Common Developing Tasks

### Add a New Page

```typescript
// src/app/[lang]/my-page/page.tsx
import { Locale } from '@/lib/i18n/config';

export default function MyPage({ params }: { params: { lang: string } }) {
  const locale = params.lang as Locale;
  
  return <div>My awesome page</div>;
}
```

### Add Translations

1. **Add to all locales**:
   ```javascript
   // src/locales/en/common.json
   { "myKey": "Hello" }
   
   // src/locales/ps/common.json
   { "myKey": "سلام" }
   
   // src/locales/fa/common.json
   { "myKey": "سلام" }
   ```

2. **Use in component**:
   ```typescript
   const t = useTranslations('common');
   <p>{t('myKey')}</p>
   ```

### Query Database

```typescript
// src/lib/supabase/queries.ts
import { supabaseClient } from './client';

export async function getListings() {
  const { data, error } = await supabaseClient
    .from('listings')
    .select('*')
    .eq('status', 'active');
    
  if (error) throw error;
  return data;
}
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```

### Supabase connection not working
```bash
# Check environment variables
cat .env.local

# Verify Supabase URL and key are correct
# Visit https://supabase.com/dashboard
```

### RTL not working
```bash
# Make sure Tailwind RTL plugin is installed
pnpm install tailwindcss-rtl

# Check HTML has correct dir attribute
# <html dir="rtl" lang="ps">

# Check component uses logical properties
# Bad: ml-4 ms-4
# Good: ps-4 (padding-start)
```

### TypeScript errors
```bash
# Run type check
pnpm type-check

# This will show all TypeScript errors
# Fix them before deploying
```

---

## 📝 Next Steps

After local setup works:

1. **Explore the code**
   - Check `src/components/homepage/` for examples
   - Look at `src/lib/i18n/` for i18n setup
   - Read database schema in `database/schema.sql`

2. **Add content**
   - Add more translations in `src/locales/`
   - Add more categories in `src/lib/constants/`
   - Add more pages in `src/app/[lang]/`

3. **Setup Supabase locally** (optional, speeds up development)
   ```bash
   supabase start
   # Now your local DB stays in sync
   ```

4. **Deploy to production** (when ready)
   - See Docs/DEPLOYMENT.md for step-by-step guide
   - Push to GitHub
   - Connect to Vercel
   - Done! 🚀

---

## 🆘 Getting Help

- **Docs**: See `Docs/` folder
- **Code**: Check `src/` for examples
- **Issues**: GitHub Issues
- **Chat**: Discord server (coming soon)

---

## ✅ Verify Setup

Run this checklist to verify everything:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Project cloned and dependencies installed
- [ ] `.env.local` created with Supabase credentials
- [ ] Database schema pushed
- [ ] `pnpm dev` starts without errors
- [ ] http://localhost:3000/en works
- [ ] http://localhost:3000/ps shows RTL layout
- [ ] Language switcher appears in header
- [ ] Hero section displays correctly

If all ✅, you're ready to build! 🎉

---

**Happy coding!** 👨‍💻👩‍💻

Questions? Check the docs or open an issue on GitHub.
