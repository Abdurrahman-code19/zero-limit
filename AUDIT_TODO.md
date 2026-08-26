# Zero Limit — Production Readiness Audit Checklist

## P0 — CRITICAL (Fix before going live)

### Security
- [x] Verify `.env.local` is in `.gitignore` and never committed to GitHub
- [ ] Verify Supabase RLS policies are active on ALL tables (profiles, products, product_variants, orders, order_items, reviews, coupons, addresses, activity_logs, return_requests, store_settings, cms_content)
- [x] Add Content-Security-Policy header to `next.config.ts`
- [x] Add Strict-Transport-Security header to `next.config.ts`
- [x] Rate-limit the `signUp` server action (prevent mass account creation)
- [x] Move admin CRUD operations (products, coupons, settings, roles) to server-side API routes with admin auth checks

### Missing Database Tables
- [x] Create `store_settings` table (migration 004)
- [x] Create `cms_content` table (migration 004)
- [x] Create `newsletter_subscribers` table (migration 004)
- [x] Create `notifications` table (migration 004)
- [x] Verify `store_settings` has seed data — created via psql direct connection
- [x] Verify `cms_content` has seed data — created via psql direct connection

### Database Seeding
- [x] Seed `products` table with real products (migration 004)
- [x] Seed `product_variants` table with real sizes, colors, prices (migration 004)
- [x] Seed `categories` table with real categories — already in DB (4 categories)
- [x] Seed `collections` table with real collections — already in DB (4 collections)
- [x] Verify all 7 products show on store page — confirmed in DB (7 products, 54 variants)

---

## P1 — HIGH (Fix within first week)

### Wire Hardcoded Data to Database
- [x] Homepage hero slides — editorial content, kept hardcoded (appropriate for brand)
- [x] Homepage collections — now pulls from `collections` table via `useCollections` hook
- [x] Store page categories — now pulls from `categories` table via `useCategories` hook
- [x] Store page featured collections — now pulls from `collections` table via `useCollections` hook
- [ ] Remove duplicate `PRODUCT_CATEGORIES` from `src/constants/index.ts` — **still used by shop/collections pages as DB fallback**
- [x] Checkout shipping fee — now reads from `store_settings` table via `useStoreSettings` hook

### Newsletter Fix
- [x] Fix `/api/newsletter/route.ts` to insert into `newsletter_subscribers` table
- [ ] Verify admin marketing page shows real subscriber count

### SEO
- [ ] Verify `robots.txt` allows search engine crawling
- [ ] Verify all pages have proper `<title>` and `<meta description>` tags
- [ ] Convert key pages to Server Components for SSR/SEO
- [x] Verify sitemap includes all pages — dynamic sitemap with products already exists

---

## P2 — MEDIUM (Fix within first month)

### Notifications System
- [x] Create `notifications` table in Supabase (migration 004)
- [x] Build notification API routes (GET/PATCH/DELETE)
- [x] Wire notifications page to real DB data
- [x] Remove all hardcoded fake notifications
- [ ] Add real-time notifications via Supabase Realtime

### Contact Form
- [x] Contact form has proper required fields (name, email, subject, message)
- [ ] Create `/api/contact/route.ts` that sends email via Resend (P2 — current mailto works)
- [ ] Send confirmation email to customer + notification to admin

### Webhook & Payment Hardening
- [x] Fix webhook to return `{ received: false }` on DB errors (Paystack retries)
- [x] Add error handling for `decrement_stock_atomic` RPC failures
- [x] Implement actual Paystack refund API call when returns are approved
- [ ] Add payment status verification in order detail page

### Social Media Links
- [x] Updated Instagram to real URL
- [x] Updated WhatsApp to real URL (+23409044325763)
- [x] Removed TikTok and Facebook (not used)

### Wishlist Sync
- [ ] Wire wishlist to `wishlist` database table (currently localStorage only)
- [ ] Sync wishlist across devices when user is logged in

---

## P3 — LOW (Fix when possible)

### Performance
- [ ] Convert product listing pages to Server Components with streaming
- [ ] Add Next.js `Image` optimization for all product images
- [ ] Implement ISR for product pages
- [ ] Add loading states and Suspense boundaries for client components

### Admin Improvements
- [x] Add server-side input validation for product creation/editing (Zod)
- [x] Add server-side validation for coupon creation
- [x] Add server-side validation for settings updates
- [ ] Add audit logging for all admin mutations
- [ ] Implement analytics charts

### Content
- [ ] Update FAQ page to pull from `cms_content` table
- [ ] Update shipping page to pull from `store_settings`
- [ ] Update size guide page to pull from `cms_content` table
- [ ] Add real product images for all products
- [x] Remove "COMING SOON" tags from in-stock products

### Error Handling
- [ ] Add proper error boundaries for all page routes
- [ ] Add error logging service (Sentry or similar)
- [ ] Handle missing/unexpected data gracefully in all components
- [ ] Add retry logic for failed API calls

### Testing
- [ ] Write unit tests for server actions
- [ ] Write integration tests for API routes
- [ ] Write E2E tests for checkout flow
- [ ] Write E2E tests for admin CRUD operations

---

## ALREADY WORKING ✅

- [x] Paystack payment integration (inline + webhook)
- [x] Payment signature verification
- [x] Order creation with stock validation
- [x] Atomic stock decrement (RPC)
- [x] Order status state machine with enforced transitions
- [x] Email templates (confirmation, status update, admin notification, failed payment)
- [x] HTML injection protection in emails (`escapeHtml`)
- [x] Admin role-based access control (middleware)
- [x] Rate limiting on API routes (in-memory)
- [x] CSRF origin check on mutating requests
- [x] Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, CSP, HSTS)
- [x] Google OAuth integration
- [x] Supabase auth (sign in, sign up, sign out, password reset)
- [x] Cart with localStorage persistence
- [x] Address management (CRUD with default handling)
- [x] Coupon validation (expiry, usage limits, min order)
- [x] Return request system (customer + admin + Paystack refund)
- [x] Dynamic sitemap with products
- [x] Google Search Console verification
- [x] Sitemap submitted to Google (18 pages indexed)
- [x] Order status change → in-app notification
- [x] Server-side admin CRUD with Zod validation + auth checks
