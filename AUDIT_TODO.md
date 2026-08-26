# Zero Limit — Production Readiness Audit Checklist

## P0 — CRITICAL (Fix before going live)

### Security
- [ ] Verify `.env.local` is in `.gitignore` and never committed to GitHub
- [ ] Verify Supabase RLS policies are active on ALL tables (profiles, products, product_variants, orders, order_items, reviews, coupons, addresses, activity_logs, return_requests, store_settings, cms_content)
- [ ] Add Content-Security-Policy header to `next.config.ts`
- [ ] Add Strict-Transport-Security header to `next.config.ts`
- [ ] Rate-limit the `signUp` server action (prevent mass account creation)
- [ ] Move admin CRUD operations (products, coupons, settings, roles) to server-side API routes with admin auth checks

### Missing Database Tables
- [ ] Create `store_settings` table (store_name, store_email, store_address, shipping_fee, free_shipping_threshold, currency, etc.)
- [ ] Create `cms_content` table (key, title, content fields for hero, about, size guide)
- [ ] Create `newsletter_subscribers` table (email, subscribed_at, source)
- [ ] Verify `store_settings` has seed data (store name, email, shipping fee, currency)
- [ ] Verify `cms_content` has seed data (hero title, hero subtitle, about text, size guide)

### Database Seeding
- [ ] Seed `products` table with real products (Lightning Strike, Bernie, Tank Top, Plain Polo, Polo Shirt, Checkers Shirt, Quarter Zip)
- [ ] Seed `product_variants` table with real sizes, colors, prices, and stock for each product
- [ ] Seed `categories` table with real categories (T-Shirts, Shirts, Caps & Beanies, Hoodies & Quarter Zips)
- [ ] Seed `collections` table with real collections
- [ ] Verify all 7 products show on store page with correct images, prices, and stock

---

## P1 — HIGH (Fix within first week)

### Wire Hardcoded Data to Database
- [ ] Homepage hero slides (`src/app/page.tsx:21-25`) — pull from `cms_content` table or remove hardcoded array
- [ ] Homepage collections (`src/app/page.tsx:34-53`) — pull from `collections` table
- [ ] Store page categories (`src/app/store/page.tsx:19-24`) — pull from `categories` table (remove duplicate hardcoded array)
- [ ] Store page featured collections (`src/app/store/page.tsx:26-45`) — pull from `collections` table
- [ ] Remove duplicate `PRODUCT_CATEGORIES` from `src/constants/index.ts:9-14` — use single source from DB
- [ ] Checkout shipping fee (`src/app/(store)/checkout/page.tsx:92`) — read from `store_settings` table instead of hardcoded `2000`

### Newsletter Fix
- [ ] Fix `/api/newsletter/route.ts` to insert into `newsletter_subscribers` table (not just `activity_logs`)
- [ ] Verify admin marketing page (`src/app/(admin)/admin/marketing/page.tsx`) shows real subscriber count

### SEO
- [ ] Verify `robots.txt` allows search engine crawling
- [ ] Verify all pages have proper `<title>` and `<meta description>` tags
- [ ] Convert key pages (homepage, store, product pages) to Server Components for SSR/SEO
- [ ] Verify sitemap includes all pages with correct lastmod dates

---

## P2 — MEDIUM (Fix within first month)

### Notifications System
- [ ] Create `notifications` table in Supabase (user_id, type, title, message, read, created_at)
- [ ] Build notification API routes (GET list, PATCH mark as read, DELETE)
- [ ] Wire notifications page (`src/app/(store)/notifications/page.tsx`) to real DB data
- [ ] Remove all hardcoded fake notifications (order numbers, promo codes, coupon codes)
- [ ] Add real-time notifications for order status changes via Supabase Realtime

### Contact Form
- [ ] Replace `mailto:` action in `src/app/(store)/contact/page.tsx` with proper API route
- [ ] Create `/api/contact/route.ts` that sends email via Resend
- [ ] Add form validation (name, email, message fields)
- [ ] Send confirmation email to customer + notification to admin

### Webhook & Payment Hardening
- [ ] Fix webhook to return `{ received: false }` on DB errors (so Paystack retries)
- [ ] Add error handling for `decrement_stock_atomic` RPC failures in `/api/orders/route.ts`
- [ ] Implement actual Paystack refund API call when returns are approved (`src/app/api/admin/returns/route.ts:66`)
- [ ] Add payment status verification in order detail page

### Social Media Links
- [ ] Update TikTok `href="#"` to real URL in `src/app/page.tsx:239`
- [ ] Update WhatsApp `href="#"` to real URL in `src/app/page.tsx:243`
- [ ] Update Facebook `href="#"` to real URL (if applicable)

### Wishlist Sync
- [ ] Wire wishlist to `wishlist` database table (currently localStorage only)
- [ ] Sync wishlist across devices when user is logged in
- [ ] Keep localStorage fallback for anonymous users

---

## P3 — LOW (Fix when possible)

### Performance
- [ ] Convert product listing pages to Server Components with streaming
- [ ] Add Next.js `Image` optimization for all product images
- [ ] Implement ISR (Incremental Static Regeneration) for product pages
- [ ] Add loading states and Suspense boundaries for client components

### Admin Improvements
- [ ] Add server-side input validation for product creation/editing
- [ ] Add server-side validation for coupon creation (discount value range check)
- [ ] Add server-side validation for settings updates
- [ ] Add audit logging for all admin mutations
- [ ] Implement analytics charts (currently placeholder text)

### Content
- [ ] Update FAQ page (`src/app/(store)/faq/page.tsx`) to pull from `cms_content` table
- [ ] Update shipping page (`src/app/(store)/shipping/page.tsx`) to pull from `store_settings`
- [ ] Update size guide page (`src/app/size-guide/page.tsx`) to pull from `cms_content` table
- [ ] Add real product images for all products
- [ ] Remove "COMING SOON" tags from in-stock products (`src/lib/products.ts:6`)

### Error Handling
- [ ] Add proper error boundaries for all page routes
- [ ] Add error logging service (Sentry or similar)
- [ ] Handle missing/unexpected data gracefully in all components
- [ ] Add retry logic for failed API calls

### Testing
- [ ] Write unit tests for server actions (`src/lib/actions/auth.ts`)
- [ ] Write integration tests for API routes (orders, payments, reviews)
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
- [x] Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy)
- [x] Google OAuth integration
- [x] Supabase auth (sign in, sign up, sign out, password reset)
- [x] Cart with localStorage persistence
- [x] Address management (CRUD with default handling)
- [x] Coupon validation (expiry, usage limits, min order)
- [x] Return request system (customer + admin)
- [x] Dynamic sitemap with products
- [x] Google Search Console verification
- [x] Sitemap submitted to Google (18 pages indexed)
