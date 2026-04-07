# Bazaar - Complete Project Documentation

**Version:** 1.0.0  
**Project Type:** Full-Stack Marketplace Platform  
**Domain:** bazaar.com  
**Build Status:** Production-Ready  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features & Pages](#features--pages)
5. [Language & RTL Support](#language--rtl-support)
6. [Getting Started](#getting-started)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)
9. [Development Guidelines](#development-guidelines)

---

## 🎯 Project Overview

**Bazaar** (meaning "From the Owner") is a premium, multilingual classifieds marketplace platform inspired by Sahibinden.com, but fully adapted for **English (LTR), Pashto (RTL), and Dari (RTL)** speaking markets, particularly targeting Afghanistan, Pakistan, and surrounding regions.

### Core USPs
- ✅ **Multi-language Support**: English, Pashto, Dari with instant switching
- ✅ **Full RTL Implementation**: Automatic layout mirroring for Arabic-script languages
- ✅ **Mobile-First Design**: Native app-like experience on all devices
- ✅ **Real-time Features**: Live chat, notifications, instant search suggestions
- ✅ **Trust & Safety**: Verified sellers, phone verification, safe payment options
- ✅ **Performance**: Optimized images, fast loading, PWA-ready
- ✅ **SEO Optimized**: Multi-language meta tags, structured data, sitemaps

---

## 🛠 Tech Stack

### Frontend
```
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (with RTL plugin)
- Shadcn/UI + Radix UI
- next-intl (i18n)
- Swiper (carousels)
- Leaflet (maps)
- React Query (data fetching)
- Zustand (state management)
- Framer Motion (animations)
```

### Backend & Infrastructure
```
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- UploadThing (photo uploads)
- SendGrid (emails)
- Stripe/Zarinpal (payments - optional)
```

### DevOps & Tools
```
- Vercel (deployment)
- GitHub Actions (CI/CD)
- Supabase CLI (local development)
- TypeScript ESLint (code quality)
```

---

## 📁 Project Structure

```
bazaar/
├── public/
│   ├── flags/
│   │   ├── en.svg
│   │   ├── ps.svg
│   │   └── fa.svg
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── logo.svg
│   │   └── placeholder-listings/
│   └── manifest.json (PWA)
│
├── src/
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── layout.tsx (RTL wrapper)
│   │   │   ├── page.tsx (Homepage)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (marketplace)/
│   │   │   │   ├── search/page.tsx
│   │   │   │   ├── [category]/page.tsx
│   │   │   │   └── listing/[id]/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── my-ads/page.tsx
│   │   │   │   ├── favorites/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   ├── post-ad/
│   │   │   │   └── [[...step]]/page.tsx (wizard)
│   │   │   ├── (info)/
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── safety/page.tsx
│   │   │   │   └── help/page.tsx
│   │   │   └── offline.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth].ts
│   │   │   ├── listings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── search/
│   │   │   │   └── suggestions/route.ts
│   │   │   ├── messages/
│   │   │   │   └── route.ts
│   │   │   └── upload/route.ts
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileBottomNav.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── homepage/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── FeaturedListings.tsx
│   │   │   ├── PopularCities.tsx
│   │   │   └── TrustSignals.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   └── MapView.tsx
│   │   ├── listing/
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ListingDetails.tsx
│   │   │   ├── SellerCard.tsx
│   │   │   ├── SimilarListings.tsx
│   │   │   └── ChatBox.tsx
│   │   ├── form/
│   │   │   ├── AdWizard/
│   │   │   │   ├── Step1Category.tsx
│   │   │   │   ├── Step2Details.tsx
│   │   │   │   ├── Step3Location.tsx
│   │   │   │   ├── Step4Photos.tsx
│   │   │   │   └── Step5Preview.tsx
│   │   │   └── DynamicFields.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── ui/ (shadcn/ui components)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── modal.tsx
│   │       ├── input.tsx
│   │       └── ... (all shadcn/ui components)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── i18n/
│   │   │   ├── config.ts
│   │   │   ├── routing.ts
│   │   │   └── request.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── currency.ts
│   │   │   └── rtl-helpers.ts
│   │   ├── hooks/
│   │   │   ├── useTranslation.ts
│   │   │   ├── useRTL.ts
│   │   │   ├── useListings.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useChat.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── searchStore.ts
│   │   └── constants/
│   │       ├── categories.ts
│   │       ├── cities.ts
│   │       ├── currencies.ts
│   │       └── validations.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── rtl.css
│   │   └── theme.css
│   │
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── homepage.json
│       │   ├── auth.json
│       │   ├── search.json
│       │   └── listing.json
│       ├── ps/
│       │   ├── common.json
│       │   ├── homepage.json
│       │   ├── auth.json
│       │   ├── search.json
│       │   └── listing.json
│       └── fa/
│           ├── common.json
│           ├── homepage.json
│           ├── auth.json
│           ├── search.json
│           └── listing.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── send-message/
│   │   ├── notify-user/
│   │   └── process-payment/
│   └── seed.sql
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
│       └── seed-listings.ts
│
├── .env.example
├── .env.local (gitignored)
├── .eslintrc.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## ✨ Features & Pages

### 1. **Homepage (Hero Section)**
- Full-width hero with search bar with real-time suggestions
- Language switcher (flags in header)
- 12+ main categories with subcategories
- Featured listings carousel with "Verified" badge
- Popular cities chips
- Trust signals section
- Newsletter subscription

### 2. **Search & Category Pages**
- Advanced filtering sidebar
  - Price range slider
  - Location filter
  - Condition filter
  - Posted date filter
  - "From Owner" toggle
  - "Urgent" filter
  - "Negotiable" filter
  - Verified seller filter
- Map view toggle
- Sort options (newest, price low-high, high-low)
- Infinite scroll with lazy loading
- Beautiful listing cards

### 3. **Listing Detail Page**
- Large image gallery (Swiper)
- Title, price, description
- Dynamic attributes table (varies by category)
- Seller card with verification badge
- Message/Chat button
- Call button
- Share buttons
- Report listing button
- Similar listings section
- View count & posted time

### 4. **Post New Ad (Multi-Step Wizard)**
- **Step 1**: Category selection (triggers dynamic form)
- **Step 2**: Title, description, price, negotiable checkbox
- **Step 3**: Location picker (map-based)
- **Step 4**: Photo upload (drag & drop, up to 20 photos)
- **Step 5**: Preview & publish (with premium options)
- Draft auto-save
- Step progress indicator

### 5. **User Dashboard**
- **My Ads**: Active, Sold, Expired with bulk actions
- **Favorites**: Heart-marked listings
- **Messages/Inbox**: Real-time chat with sellers/buyers
- **Profile**: Avatar, phone verification, location, bio
- **Account Settings**: Password, privacy, notifications

### 6. **Real-Time Features**
- Live chat (Supabase Realtime)
- Notifications bell (new messages, status updates)
- Instant search suggestions (debounced)
- Online status indicator

### 7. **Authentication**
- Email registration
- Phone number registration
- Google OAuth
- Email verification
- Phone verification
- Password reset

### 8. **Additional Pages**
- About Us
- Safety Tips & Guidelines
- Help Center / FAQ
- Contact Us
- Terms & Conditions
- Privacy Policy
- Blog (optional)

---

## 🌍 Language & RTL Support

### Supported Languages
1. **English (en)** - LTR | Flag: 🇬🇧
2. **Pashto (ps)** - RTL | Flag: 🇦🇫
3. **Dari (fa)** - RTL | Flag: 🇦🇫

### i18n Implementation
- **Library**: next-intl
- **Routing**: Dynamic route segments `[lang]`
- **Fallback**: English
- **Direction Detection**: Auto-detect based on locale
- **Font Stack**: 
  - English: `'system-ui', 'Segoe UI', 'Helvetica Neue'`
  - Pashto/Dari: `'Noto Sans Arabic', 'Noto Sans Pashto', 'Droid Arabic Fonts'`

### RTL Implementation
- **CSS Approach**: Tailwind RTL plugin + logical CSS properties
- **Utilities**: Custom `rtl-helpers.ts` for dynamic classes
- **Layout**: Flexbox with `flex-row-reverse` for RTL
- **Icons**: Automatic mirroring using CSS or SVG variants
- **Text Direction**: `dir="rtl"` on `<html>` tag
- **Margins/Padding**: Use logical properties (e.g., `ps-4` instead of `ps-4`)

### Translation Files Structure
Each locale has the following JSON files:
```json
{
  "common": {
    "home": "...",
    "search": "...",
    "language": "..."
  },
  "homepage": {
    "heroTitle": "...",
    "searchPlaceholder": "..."
  },
  // ... per domain
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Git
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/bazaar.git
cd bazaar

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start local development
pnpm dev

# Open browser
# http://localhost:3000/en
# http://localhost:3000/ps
# http://localhost:3000/fa
```

### Environment Variables (.env.local)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# UploadThing
UPLOADTHING_SECRET=xxx
NEXT_PUBLIC_UPLOADTHING_APP_ID=xxx

# SendGrid
SENDGRID_API_KEY=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🗄 Database Schema

### Tables Overview

#### users
```sql
id UUID PRIMARY KEY
email VARCHAR UNIQUE NOT NULL
phone VARCHAR UNIQUE
password_hash VARCHAR
avatar_url TEXT
display_name VARCHAR
bio TEXT
verified_email BOOLEAN DEFAULT false
verified_phone BOOLEAN DEFAULT false
is_seller BOOLEAN DEFAULT false
seller_rating DECIMAL(3,2)
seller_badge VARCHAR (bronze/silver/gold)
location GEOMETRY DEFAULT NULL
languages TEXT[] DEFAULT '{"en"}'
created_at TIMESTAMP DEFAULT now()
updated_at TIMESTAMP DEFAULT now()
```

#### listings
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users NOT NULL
category_id INTEGER REFERENCES categories NOT NULL
title VARCHAR NOT NULL
description TEXT
price DECIMAL(12,2) NOT NULL
currency VARCHAR DEFAULT 'AFN'
condition VARCHAR (new/like_new/good/fair)
phone_visible BOOLEAN DEFAULT false
from_owner BOOLEAN DEFAULT true
urgent BOOLEAN DEFAULT false
negotiable BOOLEAN DEFAULT true
verified_seller BOOLEAN DEFAULT false
location GEOMETRY NOT NULL
city VARCHAR NOT NULL
address TEXT
latitude DECIMAL(10,7)
longitude DECIMAL(10,8)
view_count INTEGER DEFAULT 0
favorite_count INTEGER DEFAULT 0
status VARCHAR DEFAULT 'active' (active/sold/expired)
created_at TIMESTAMP DEFAULT now()
expires_at TIMESTAMP DEFAULT now() + '30 days'
updated_at TIMESTAMP DEFAULT now()
```

#### photos
```sql
id UUID PRIMARY KEY
listing_id UUID REFERENCES listings ON DELETE CASCADE NOT NULL
photo_url TEXT NOT NULL
thumbnail_url TEXT
display_order INTEGER
created_at TIMESTAMP DEFAULT now()
```

#### categories
```sql
id INTEGER PRIMARY KEY
name_en VARCHAR NOT NULL
name_ps VARCHAR NOT NULL
name_fa VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL
parent_id INTEGER REFERENCES categories
icon_name VARCHAR
created_at TIMESTAMP DEFAULT now()
```

#### messages
```sql
id UUID PRIMARY KEY
sender_id UUID REFERENCES users NOT NULL
recipient_id UUID REFERENCES users NOT NULL
listing_id UUID REFERENCES listings
message_text TEXT NOT NULL
file_url TEXT
is_read BOOLEAN DEFAULT false
created_at TIMESTAMP DEFAULT now()
```

#### favorites
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users NOT NULL
listing_id UUID REFERENCES listings ON DELETE CASCADE NOT NULL
created_at TIMESTAMP DEFAULT now()
UNIQUE(user_id, listing_id)
```

#### attributes
```sql
id INTEGER PRIMARY KEY
category_id INTEGER REFERENCES categories NOT NULL
attribute_name_en VARCHAR
attribute_name_ps VARCHAR
attribute_name_fa VARCHAR
attribute_type VARCHAR (text/number/select)
sort_order INTEGER
```

#### listing_attributes
```sql
id UUID PRIMARY KEY
listing_id UUID REFERENCES listings ON DELETE CASCADE
attribute_id INTEGER REFERENCES attributes
value TEXT
```

---

## 🛰 Deployment

### Pre-Deployment Checklist
- [ ] Environment variables set in production
- [ ] Database migrations applied
- [ ] Images optimized and uploaded to CDN
- [ ] SEO meta tags verified
- [ ] Translations complete for all languages
- [ ] Mobile testing completed (iOS & Android)
- [ ] Security audit passed
- [ ] Performance budget (Lighthouse > 90)

### Deployment Steps

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Deploy Supabase Database**
```bash
supabase link --project-ref xxx
supabase db push
supabase seed [seed file]
```

**Step 3: Deploy to Vercel**
```bash
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all env vars
vercel
```

**Step 4: Configure Domain**
- Point DNS to Vercel nameservers
- Enable HTTPS
- Setup Vercel custom domain

**Step 5: Setup CDN (optional)**
- Cloudflare for image optimization
- Setup cache rules

---

## 📋 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for variables, PascalCase for components
- **Files**: Organize by feature/domain
- **Imports**: Absolute paths using `@/`

### Component Structure
```typescript
// Type definitions first
interface ComponentProps {
  title: string;
  isLoading?: boolean;
}

// Component
export const MyComponent: React.FC<ComponentProps> = ({
  title,
  isLoading = false,
}) => {
  return <div>{title}</div>;
};
```

### Styling Rules
- Use Tailwind classes
- Use `rtl:` prefix for RTL-specific styles
- Use logical properties (ps-, pe-, ms-, me-, etc.)
- No inline styles unless absolutely necessary

### i18n Usage
```typescript
import { useTranslations } from 'next-intl';

export const MyComponent = () => {
  const t = useTranslations('homepage');
  return <h1>{t('heroTitle')}</h1>;
};
```

### Git Workflow
- Feature branches: `feature/description`
- Bugfix branches: `bugfix/description`
- Main branch: protected, requires PR review
- Commit messages: Conventional Commits style

### Testing
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright
- Run tests: `pnpm test`
- Coverage threshold: 80%

---

## 📞 Support & Resources

- **Documentation**: `/docs`
- **Design System**: Figma link (add here)
- **API Documentation**: Swagger/OpenAPI
- **Issue Tracker**: GitHub Issues
- **Discussion**: GitHub Discussions

---

## 📄 License

MIT License - See LICENSE file

---

## 🤝 Contributing

See CONTRIBUTING.md for guidelines.

---

**Last Updated**: April 7, 2026  
**Maintained By**: Development Team
