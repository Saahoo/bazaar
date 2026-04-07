# Bazaar - Project Context & Architecture

**Project Status**: 🚀 Production-Ready Boilerplate  
**Last Updated**: April 7, 2026  
**Created For**: Turkish/Afghan/Pakistani Markets  

---

## 📌 Executive Summary

Bazaar is a complete, scalable, production-grade classifieds marketplace inspired by Sahibinden.com. It features:

- ✅ **3 Languages**: English, Pashto, Dari (with automatic RTL)
- ✅ **Mobile-First**: Native app-like UX
- ✅ **Real-Time**: Live chat, instant notifications
- ✅ **Secure**: Supabase RLS, verified sellers
- ✅ **Fast**: Lighthouse 90+, TTI < 2.5s
- ✅ **Dev-Friendly**: TypeScript, clean architecture

---

## 🏗 System Architecture

```
┌─────────────────────┐
│   Frontend - Vercel │
│  (Next.js 15 + TS)  │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────────────────────────┐
│     Supabase Backend - Cloud            │
├─────────────────────────────────────────┤
│ ├─ PostgreSQL (Database)                │
│ ├─ Auth (Email, Google OAuth)           │
│ ├─ Storage (Photos, Avatars)            │
│ ├─ Realtime (Live chat, notifications)  │
│ └─ Edge Functions (Serverless)          │
└─────────────────────────────────────────┘
           │
           ├─ SendGrid (Emails)
           ├─ Stripe (Payments)
           └─ Google Maps (Location)
```

---

## 📊 Data Model

### Core Tables
- **users**: User accounts + seller profiles
- **listings**: Buy/sell listings
- **photos**: Images for listings
- **categories**: Buy/sell categories
- **messages**: Real-time chat messages
- **favorites**: Bookmarked listings
- **reviews**: Seller ratings

See `database/schema.sql` for complete schema.

---

## 🔄 Request Flow

```
1. User visits /en/search?q=car
   ↓
2. Next.js routes to [lang]/search/page.tsx
   ↓
3. Component calls useTranslations('search')
   ↓
4. Locale JSON loaded: src/locales/en/search.json
   ↓
5. useEffect calls Supabase query
   ↓
6. Results rendered + RTL applied automatically
```

---

## 🌐 i18n Architecture

### File Structure
```
src/locales/
├── en/common.json        # English translations
├── ps/common.json        # Pashto (RTL) translations
└── fa/common.json        # Dari (RTL) translations
```

### Implementation
```typescript
// next-intl plugin handles routing
app/[lang]/ → matches /en, /ps, /fa

// Components use useTranslations hook
const t = useTranslations('domain');
// → Loads src/locales/[lang]/domain.json
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px  (sm)
Tablet:  640-1024px (md)
Desktop: > 1024px (lg)
```

**Mobile-First Approach**:
```typescript
// Small on mobile, big on desktop
<h1 className="text-2xl md:text-4xl">Title</h1>
```

---

## 🎯 Key Components

### Layout Components
```
Header
├─ Logo/Brand
├─ Search Bar
├─ Language Switcher
└─ User Menu

Navigation (Mobile)
├─ Home
├─ Search
├─ Post Ad
├─ Favorites
└─ Account

Footer
└─ Links + Copyright
```

### Page Components
```
/[lang]/page.tsx (Homepage)
├─ HeroSection
├─ CategoryGrid
├─ FeaturedListings
└─ PopularCities

/[lang]/search/page.tsx (Search)
├─ FilterSidebar
├─ ListingCard (Grid)
└─ MapView (Optional)

/[lang]/listing/[id]/page.tsx (Detail)
├─ ImageGallery
├─ ListingDetails
├─ SellerCard
└─ SimilarListings
```

---

## 🔐 Security Layers

### Frontend
- XSS protection via React
- CSRF tokens for forms
- Input validation

### Backend (Supabase)
- Row-Level Security (RLS) policies
- Auth tokens validated
- Rate limiting

### Infrastructure
- HTTPS/TLS encryption
- DDoS protection (Vercel)
- Regular backups

---

## 🚀 Deployment Architecture

```
GitHub
  ↓
GitHub Actions (CI)
  ├─ Type check
  ├─ Lint
  └─ Build
  ↓
Vercel (CD)
  ├─ Deploy to CDN
  ├─ Preview URLs
  └─ Production
```

---

## 📈 Performance Strategy

### Frontend
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: Browser + Vercel Edge
- **Lazy Loading**: Components & images

### Database
- **Indexes**: On frequently queried columns
- **RLS**: Filters at database level
- **Connection Pooling**: Via Supabase

### Content Delivery
- **CDN**: Vercel's global CDN
- **Compression**: gzip + brotli
- **Minification**: Automatic

---

## 🔄 Data Flow Examples

### Creating a Listing

```
User fills form
   ↓
Validation (client)
   ↓
POST /api/listings
   ↓
Server validates + sanitizes
   ↓
Supabase stores:
   ├─ listing record
   ├─ photos
   └─ attributes
   ↓
Response with listing ID
   ↓
Redirect to /listing/[id]
```

### Real-Time Chat

```
User 1 sends message
   ↓
PUT /api/messages
   ↓
Supabase stores + broadcasts via Realtime
   ↓
User 2 receives via WebSocket
   ↓
Message appears instantly
```

---

## 🛠 Development Workflow

### Branch Strategy
```
main (production)
├─ Must be deployable
├─ Protected: needs review
└─ Auto-deploy to production

dev (development)
├─ Integration branch
├─ Auto-deploy to Vercel preview
└─ Merge to main when ready

feature/* (feature branches)
├─ One per feature
├─ Branch from dev
└─ PR to dev
```

### Commit Style
```
type(scope): description

fix(search): fix price filter not working
feat(auth): add Google OAuth
docs(README): update setup instructions
```

---

## 📋 Environment Management

### Development
```
.env.local (git-ignored)
└─ Local Supabase + test keys
```

### Production
```
.env.production (in Vercel)
└─ Production Supabase + real keys
```

**Never commit secrets!**

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **next-intl**: https://next-intl-docs.vercel.app/

---

## 📞 Support & Maintenance

### When Issues Occur
1. Check logs: `vercel logs`
2. Check Supabase: `supabase logs`
3. Check Discord/GitHub Issues

### Regular Maintenance
- Weekly: Monitor analytics
- Monthly: Dependency updates
- Quarterly: Security audit

---

## 🎯 Success Metrics

Track these KPIs:
- **Performance**: Lighthouse score > 90
- **Reliability**: 99.9% uptime
- **User Experience**: < 2s TTI
- **Engagement**: Active users, listings posted
- **Trust**: Verified seller adoption

---

## 📚 Related Documentation

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Detailed features
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- [ROOT/README.md](../README.md) - Quick reference
- [database/schema.sql](../database/schema.sql) - DB schema

---

**Happy building! 🚀**
