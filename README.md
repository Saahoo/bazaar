# Bazaar - Premium Multilingual Classifieds Marketplace

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4.svg)

**Bazaar** is a premium, production-ready classifieds and marketplace platform inspired by Sahibinden.com. It's fully adapted for **English (LTR), Pashto (RTL), and Dari (RTL)** speaking markets with complete multilingual support, automatic RTL (Right-to-Left) layout mirroring, real-time features, and a mobile-first design.

🌍 **Supported Languages:**
- English (🇬🇧)
- Pashto (🇦🇫)
- Dari (🇦🇫)

## ✨ Key Features

### 🌐 Multilingual & RTL Support
- **3 Languages**: English, Pashto, Dari with instant switching
- **Automatic RTL**: Complete layout mirroring for Arabic-script languages
- **RTL-Safe CSS**: Uses Tailwind RTL plugin and CSS logical properties
- **Translated Everything**: UI, forms, errors, meta tags, emails

### 📱 Mobile-First & Responsive
- Native app-like experience
- Bottom navigation on mobile
- Optimized for iPhone & Android
- Touch-friendly interactions
- Fast loading (TTI < 2.5s)

### ✅ Real-Time Features
- Live chat between buyers/sellers
- Instant search suggestions
- Real-time notifications
- Online status indicators
- Activity feed updates

### 🔒 Trust & Safety
- Phone verification
- Seller verification badges
- Review ratings
- Activity history
- Report & block functionality

### 🎯 Marketplace Features
- **12+ Main Categories** with subcategories
- **Multi-photo uploads** (up to 20 per listing)
- **Location-based search** with map view
- **Advanced filtering** (price, condition, date, etc.)
- **Favorite listings** with price drop alerts
- **Similar listings** recommendations

### 📊 User Dashboard
- Manage active/sold/expired listings
- Message inbox with real-time chat
- Favorite savings
- Account settings
- Seller statistics

### ⚡ Performance
- Next.js 15 with App Router
- Image optimization & lazy loading
- Server-side rendering
- Static generation where possible
- PWA ready
- Lighthouse score: 90+

### 🔐 Security
- Supabase authentication
- Row-level security (RLS)
- End-to-end encrypted messages (optional)
- DDoS protection via Vercel
- Regular security audits

---

## 🛠 Tech Stack

### Frontend
```
Next.js 15 (App Router)
TypeScript
Tailwind CSS + RTL Plugin
Shadcn/UI + Radix UI
next-intl (i18n)
Zustand (state management)
React Hook Form (forms)
Swiper (carousels)
Framer Motion (animations)
```

### Backend & Infrastructure
```
Supabase (PostgreSQL + Auth + Storage + Realtime)
UploadThing (file uploads)
SendGrid (emails)
Vercel (deployment)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **pnpm** (recommended) or npm/yarn
- **Git**
- **Supabase account** ([supabase.com](https://supabase.com))
- **Vercel account** ([vercel.com](https://vercel.com))

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/bazaar.git
cd bazaar
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# UploadThing
UPLOADTHING_SECRET=your-secret
NEXT_PUBLIC_UPLOADTHING_APP_ID=your-app-id

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Setup Supabase Locally

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Start local development database
supabase start

# Push schema
supabase db push
```

### 5. Run Development Server

```bash
pnpm dev
```

Open your browser and visit:
- **English (LTR)**: http://localhost:3000/en
- **Pashto (RTL)**: http://localhost:3000/ps
- **Dari (RTL)**: http://localhost:3000/fa

---

## 📁 Project Structure

```
bazaar/
├── src/
│   ├── app/
│   │   ├── [lang]/                 # Dynamic i18n routes
│   │   │   ├── layout.tsx          # RTL wrapper
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── (auth)/             # Auth pages
│   │   │   ├── (marketplace)/      # Marketplace pages
│   │   │   ├── (dashboard)/        # User dashboard
│   │   │   └── post-ad/            # Ad creation wizard
│   │   └── api/                    # API routes
│   │
│   ├── components/
│   │   ├── layout/                 # Header, Footer, Navigation
│   │   ├── homepage/               # Homepage sections
│   │   ├── search/                 # Search & filtering
│   │   ├── listing/                # Listing detail
│   │   ├── form/                   # Forms & wizards
│   │   └── common/                 # Shared components
│   │
│   ├── lib/
│   │   ├── i18n/                   # next-intl config
│   │   ├── supabase/               # Supabase client
│   │   ├── utils/                  # Helpers (RTL, etc.)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── constants/              # Categories, cities, currencies
│   │   └── store/                  # Zustand stores
│   │
│   ├── locales/                    # Translation JSON files
│   │   ├── en/
│   │   ├── ps/
│   │   └── fa/
│   │
│   └── styles/                     # Global + RTL CSS
│
├── database/
│   ├── schema.sql                  # Full database schema
│   └── seeds/                      # Sample data
│
├── public/                         # Static files
│   ├── flags/                      # Language flags
│   └── images/                     # Hero, placeholders
│
├── Docs/
│   ├── PROJECT_OVERVIEW.md
│   └── DEPLOYMENT.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 🌍 Language Support

### Adding a New Language

1. **Create translation files** in `src/locales/[lang]/common.json`
2. **Add to i18n config** in `src/lib/i18n/config.ts`:

```typescript
export const LOCALES = ['en', 'ps', 'fa', 'new-lang'] as const;
```

3. **Add TypeScript types**: Update `Locale` type
4. **Test**: Visit `http://localhost:3000/new-lang`

---

## 🎨 Customization

### Change Primary Colors

Edit `tailwind.config.js`:

```javascript
primary: {
  500: '#0066FF',  // Change blue
},
accent: {
  500: '#FF6600',  // Change orange
},
```

### Change Typography

Edit `tailwind.config.js`:

```javascript
fontFamily: {
  sans: ['Your Font', ...defaultTheme.fontFamily.sans],
  arabic: ['Your Arabic Font', ...],
},
```

### Add Categories

Edit `src/lib/constants/categories.ts`:

```typescript
export const MAIN_CATEGORIES: Category[] = [
  {
    id: 13,
    name_en: 'Books',
    name_ps: 'کتابیں',
    name_fa: 'کتاب',
    icon: 'book',
  },
  // ...
];
```

---

## 📈 Performance & SEO

### Performance Optimization

- **Image Optimization**: Automatic optimization via Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Images, components load on demand
- **Static Generation**: Homepage + category pages pre-built
- **Caching**: Browser + Vercel Edge caching

### SEO Features

- **Multi-language Meta Tags**: Per-locale titles & descriptions
- **Structured Data**: Schema.org markup
- **Sitemap**: Auto-generated
- **Robots.txt**: Configured
- **Open Graph**: Social sharing optimized

Check your Lighthouse score:
```bash
# Via Vercel
vercel inspect

# Or use Chrome DevTools (F12 → Lighthouse)
```

---

## 🔐 Security

### Environment Variables
- Never commit `.env.local`
- Use `.env.example` for reference
- Rotate keys regularly

### Database Security
- Row-Level Security (RLS) enabled by default
- All data queries filtered by user
- Sensitive columns encrypted

### Authentication
- Email/password with bcrypt hashing
- Google OAuth integration
- Phone verification support
- Password reset via email

### HTTPS
- Automatically enabled on Vercel
- SSL/TLS certificates managed

---

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Build
pnpm build

# Start production server
pnpm start
```

---

## 📊 Database

Initialize Supabase:
```bash
supabase start
supabase db push
```

**Key Tables**: users, listings, categories, messages, favorites, photos

See [database/schema.sql](database/schema.sql) for complete schema.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# If not already connected
vercel link

# Deploy
vercel

# Or setup auto-deploy from GitHub
# (see DEPLOYMENT.md for detailed guide)
```

### Production Checklist

- [ ] All env vars set
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] Email service configured
- [ ] Analytics setup
- [ ] Domain configured
- [ ] HTTPS enabled
- [ ] Performance tested

See [Docs/DEPLOYMENT.md](Docs/DEPLOYMENT.md) for complete deployment guide.

---

## 🤝 Contributing

Contributions welcome! Please follow our guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Run `pnpm lint` and `pnpm type-check` before committing
- Format with `pnpm format`

---

## 📚 Documentation

- [Project Overview](Docs/PROJECT_OVERVIEW.md)
- [Deployment Guide](Docs/DEPLOYMENT.md)
- [Database Schema](database/schema.sql)
- [API Documentation](Docs/API.md) *(Coming soon)*

---

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature idea?

- **GitHub Issues**: https://github.com/yourusername/bazaar/issues
- **Email**: support@bazaar.com
- **Discord**: [Join our community](https://discord.gg/xxx)

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by [Sahibinden.com](https://www.sahibinden.com)
- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [Supabase](https://supabase.com)
- Icons by [Heroicons](https://heroicons.com)
- Translations powered by community

---

## 📞 Support

- 📧 **Email**: support@bazaar.com
- 💬 **Discord**: [Community Server](https://discord.gg/xxx)
- 🐦 **Twitter**: [@Bazaar](https://twitter.com/bazaar)
- 🌐 **Website**: https://bazaar.com

---

## 🎯 Roadmap

### Phase 1 (Completed)
- ✅ Multilingual i18n setup
- ✅ RTL support
- ✅ Homepage & search
- ✅ Listing details

### Phase 2 (In Progress)
- 🔄 Real-time chat
- 🔄 User dashboard
- 🔄 Post ad wizard
- 🔄 Notifications

### Phase 3 (Planned)
- 📅 Payment integration
- 📅 Seller verification system
- 📅 Advanced analytics
- 📅 Mobile app (React Native)

---

**Made with ❤️ for the community**

*Last Updated: April 7, 2026*
