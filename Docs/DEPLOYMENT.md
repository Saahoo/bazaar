# Deployment Guide - Bazaar

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested locally
- [ ] All pages and components built successfully
- [ ] Mobile responsiveness tested (iPhone + Android)
- [ ] Performance benchmarks met (Lighthouse > 90)
- [ ] Security audit completed
- [ ] SEO meta tags verified for all languages
- [ ] Translations complete for all 3 languages
- [ ] Image optimization verified
- [ ] Analytics setup (Google Analytics 4)

---

## 🚀 Deployment Steps

### Step 1: Local Testing & Build

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

#Visit http://localhost:3000/en, /ps, /fa to test all languages

# Type check
pnpm type-check

# Lint
pnpm lint

# Build for production
pnpm build
```

### Step 2: Setup Supabase

**Create a Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `bazaar`
3. Select region closest to your target audience (e.g., Europe, Asia)
4. Copy project credentials

**Initialize Supabase locally:**
```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Create local development environment
supabase start
```

**Push database schema:**
```bash
# Push migrations to production
supabase db push

# Or seed sample data
supabase db push --includes-seed
```

**Setup environment variables:**
```bash
# Copy from your Supabase dashboard:
cp .env.example .env.local

# Edit .env.local with your credentials:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=xxx...
```

**Enable Authentication Methods in Supabase:**
1. Go to Authentication → Providers
2. Enable Email/Password
3. Enable Google OAuth
4. Configure redirect URLs: `https://yourdomain.com/auth/callback`

### Step 3: Setup File Storage

**Create Storage Buckets:**
```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('listings-photos', 'listings-photos', true, now(), now()),
       ('user-avatars', 'user-avatars', true, now(), now());
```

**Set Storage Policies:**
```sql
-- Allow public read access to photos
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('listings-photos', 'user-avatars'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Step 4: Setup UploadThing (Alternative to Supabase Storage)

```bash
# Get API keys from uploadthing.com
# Add to .env.local:
UPLOADTHING_SECRET=xxx
NEXT_PUBLIC_UPLOADTHING_APP_ID=xxx
```

### Step 5: Deploy to Vercel

**Connect GitHub Repository:**
```bash
# Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/bazaar.git
git push -u origin main
```

**Deploy via Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `UPLOADTHING_SECRET`
   - `NEXT_PUBLIC_UPLOADTHING_APP_ID`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

**Configure Production Branch:**
```bash
# All commits to 'main' trigger production deployment
# Commits to 'dev' trigger preview deployments
```

### Step 6: Setup Custom Domain

**Point Domain DNS to Vercel:**
1. In Vercel Dashboard: Settings → Domains
2. Add custom domain: `bazaar.com`
3. Add DNS records (follow Vercel instructions):
   - A record or CNAME (depending on registrar)
   - Point to Vercel's nameservers

**Enable HTTPS:**
- Vercel automatically enables with Let's Encrypt
- Check "Auto Renew"

### Step 7: Setup Email Service

**Using SendGrid:**
```bash
# Add to .env.local
SENDGRID_API_KEY=xxx

# Create transactional email templates in SendGrid dashboard
```

**Email Templates Needed:**
- Welcome email (signup confirmation)
- Email verification
- Password reset
- Listing posted confirmation
- Message received notification

### Step 8: Setup Monitoring & Analytics

**Add Google Analytics 4:**
```bash
# Add to .env.local
NEXT_PUBLIC_GA_ID=G-xxx

# Create gtag script in _document.tsx
```

**Add Sentry for Error Tracking:**
```bash
# Add to .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx.sentry.io/xxx
```

**Setup Vercel Analytics:**
- Automatically enabled on Vercel
- View in Vercel Dashboard → Analytics

### Step 9: Performance Optimization

**Image Optimization:**
- Use Next.js Image component
- Optimize with Cloudflare or Vercel's Image Optimization

**Caching Strategy:**
```javascript
// next.config.js
headers: async () => [
  {
    source: '/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000' }
    ]
  }
]
```

**Database Optimization:**
```sql
-- Create indexes for frequently searched fields
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_date ON listings(created_at);
CREATE INDEX idx_listings_search ON listings USING GIN(to_tsvector('english', title || description));
```

### Step 10: Security Setup

**Enable Security Headers:**
```javascript
// next.config.js adds automatically:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
```

**Setup Rate Limiting:**
```bash
# Use Vercel's built-in rate limiting or implement with middleware
```

**SSL/TLS:**
- Automatically enabled by Vercel
- Check: https://bazaar.com (green lock)

### Step 11: Database Backups

**Auto-backups with Supabase:**
- Supabase automatically backs up your data weekly
- Access in Supabase Dashboard → Backups

**Manual Backup:**
```bash
supabase db pull --file backup-$(date +%Y%m%d).sql
```

### Step 12: Testing Deployment

**Test All Languages:**
```
https://bazaar.com/en
https://bazaar.com/ps
https://bazaar.com/fa
```

**Test RTL Display:**
- Visit `/ps` and `/fa` pages
- Verify layout is mirrored
- Test language switcher

**Test Mobile:**
- Use Chrome DevTools device emulation
- Test on real iPhone and Android
- Check touch interactions

**Test Forms:**
- Try posting a listing
- Try uploading photos
- Try messaging

**Performance Check:**
```bash
# Use Lighthouse in Chrome DevTools
# Or test online: https://web.dev/measure/
# Target: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

## 🔄 Continuous Deployment (CI/CD)

**GitHub Actions Workflow:**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - dev

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Type check
        run: pnpm type-check
      
      - name: Lint
        run: pnpm lint
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Monitoring & Maintenance

### Weekly Checks
- [ ] Vercel Analytics dashboard
- [ ] Sentry error logs
- [ ] Database performance
- [ ] User feedback

### Monthly Checks
- [ ] Dependency updates
- [ ] Security audit
- [ ] Performance benchmarks
- [ ] Backup verification

### Quarterly Tasks
- [ ] Major version upgrades
- [ ] Database optimization
- [ ] SEO audit
- [ ] User interviews

---

## 🚨 Troubleshooting

### Issue: 500 errors after deployment
```bash
# Check Vercel logs
vercel logs --follow

# Check Supabase logs
supabase logs
```

### Issue: Images not loading
- Verify Supabase bucket permissions
- Check image URLs are correct
- Verify authentication tokens

### Issue: RTL layout broken
- Verify `dir="rtl"` in HTML
- Check Tailwind RTL plugin loaded
- Clear browser cache

### Issue: Slow database queries
```sql
-- Run EXPLAIN to analyze queries
EXPLAIN ANALYZE SELECT * FROM listings WHERE status='active' LIMIT 10;

-- Create missing indexes
CREATE INDEX idx_name ON table(column);
```

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@bazaar.com

---

**Last Updated**: April 7, 2026
