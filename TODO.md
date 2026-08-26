# Zero Limit — Production Readiness TODO

> 360° Audit completed. 79 issues found across security, data integrity, e-commerce logic, and frontend.
> This file tracks all issues. Check off items as they're fixed.

---

## Phase 1 — CRITICAL Security & Data Loss (14 issues)

- [x] **1. Delete or protect `/setup` route** — Anyone can visit `/setup`, see hardcoded admin credentials, and create a super_admin account. Zero auth. Files: `src/app/setup/page.tsx`, `src/lib/actions/setup.ts`
- [x] **2. Remove hardcoded admin credentials** — Email/password hardcoded in `src/lib/actions/setup.ts:12-13` and displayed on `src/app/setup/page.tsx:30-31`. Delete these files or gate behind env var + server-side token check.
- [x] **3. Remove service role key from client-callable action** — `src/lib/actions/setup.ts:5-9` uses `SUPABASE_SERVICE_ROLE_KEY` in a `"use server"` function callable by anyone without auth.
- [x] **4. Fix Settings table RLS** — `supabase/migrations/001_initial_schema.sql:387` has `FOR SELECT USING (true)`. If `paystack_secret_key` is stored here, it's public. Remove public SELECT policy, restrict to admin-only reads.
- [x] **5. Add Paystack webhook handler** — No `src/app/api/paystack/webhook/route.ts` exists. If user closes tab after paying but before JS callback, money is taken but no order is created. No recovery. Create webhook route to handle async payment confirmation.
- [x] **6. Verify payment amount server-side in `/api/orders`** — `src/app/api/orders/route.ts:49-77` trusts `total` from client body. Attacker can pay ₦100, POST `total: 500000`, get a confirmed paid order. Must call Paystack verify internally and compare amounts.
- [x] **7. Atomic stock decrement** — `src/app/api/orders/route.ts:110-139` uses read-then-write (non-atomic). Two concurrent orders for last item both succeed → negative stock. Use `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1`.
- [x] **8. Validate stock BEFORE order insert** — `src/app/api/orders/route.ts:62-87` creates order as `status: "confirmed"` before checking stock. Insufficient stock = paid order with no items to fulfill.
- [x] **9. Wrap order creation in database transaction** — Order insert, items insert, and stock decrement are separate non-transactional ops. Mid-failure = inconsistent data (order without items, or items without stock decrement).
- [x] **10. Handle order items insert failure** — `src/app/api/orders/route.ts:102-107` logs and continues if items insert fails. Order exists with zero line items. Should rollback order and return error.
- [x] **11. Handle payment/order creation failure gracefully** — `src/app/(store)/checkout/page.tsx:135-141` — if `/api/orders` fails after successful Paystack verification, money is taken but no order exists. No alert, no retry, cart not cleared.
- [x] **12. Enforce out-of-stock on product page** — `src/app/(store)/product/[slug]/page.tsx:231-244` — "Add to Cart" always enabled regardless of stock. Disable button when `stock <= 0`.
- [x] **13. Enforce quantity limits on product page** — `src/app/(store)/product/[slug]/page.tsx:223` — `+` button has no upper bound. Cap at available stock.
- [x] **14. Enforce max quantity in cart** — `src/store/cart.ts:20-41` — `addItem` and `updateQuantity` accept any quantity. Validate against stock on add/update.

---

## Phase 2 — HIGH Security & Auth (8 issues)

- [x] **15. Add admin role check in middleware** — `src/middleware.ts:66-70` only checks `!user`, not role. Any authenticated customer can access `/admin/*`. Query `profiles.role` in middleware.
- [x] **16. Fix admin data hooks race condition** — `src/hooks/use-admin-*.ts` fire on mount before `src/app/(admin)/admin/layout.tsx` role check completes. Non-admins briefly see data. Move data fetching behind role verification.
- [x] **17. Fix auth callback open redirect** — `src/app/auth/callback/route.ts:7,13` — `next` param used directly. Attacker can craft `?next=//evil.com`. Validate `next` starts with `/` and has no `//`.
- [x] **18. Add duplicate payment reference check** — `src/app/api/orders/route.ts` — no check if `payment_reference` already exists. Same reference can create duplicate orders.
- [x] **19. No CSRF tokens on forms** — Auth and checkout forms lack CSRF protection. Implement tokens or ensure state-changing ops require custom headers.
- [x] **20. Add rate limiting to all API routes** — `/api/paystack/verify`, `/api/orders`, `/api/admin/orders/[id]/status`, auth actions — all open to abuse. Use `@vercel/rate-limit` or edge middleware.
- [x] **21. HTML-escape email template values** — `src/lib/email/order-confirmation.ts:28-39,86-88` and `order-status-update.ts:48-53` interpolate user input directly into HTML. Escape all dynamic values.
- [x] **22. Add input validation with Zod on API routes** — `src/app/api/orders/route.ts:49-57` only checks `items?.length`. No validation on quantity (can be negative), price (client-controlled), or total bounds.

---

## Phase 3 — HIGH E-Commerce Logic (15 issues)

- [x] **23. Implement Paystack webhook route** — (duplicate of #5, critical for both security and e-commerce) Create `src/app/api/paystack/webhook/route.ts` with signature verification.
- [ ] **24. Client-driven payment flow → server-driven** — `src/app/(store)/checkout/page.tsx:84-151` — entire verify → order → email is client-orchestrated. Move to single server-side flow.
- [x] **25. Fix revenue calculation** — `src/hooks/use-admin-stats.ts:46` filters `o.status` against `"paid"` (payment status). Revenue always = 0. Filter on `payment_status === "paid"` instead.
- [x] **26. Sync hardcoded shipping fee with DB** — `src/app/(store)/checkout/page.tsx:60` uses `₦2,500`. DB settings say `₦2,000`. Read from settings table.
- [x] **27. Add customer order cancellation** — No cancel button on order detail page. Add cancel for `pending`/`confirmed` orders.
- [ ] **28. Add return/refund request flow** — Advertised "7-day hassle-free returns" but zero implementation. Create request form and admin review UI.
- [x] **29. Create admin order detail page** — No `src/app/(admin)/admin/orders/[id]/page.tsx`. Admins can't view items, address, payment details, or notes.
- [x] **30. Add tracking number input UI for admin** — API supports `tracking_number` but admin orders page only has status dropdown. Add modal/input field.
- [x] **31. Send admin notification email on new order** — No email sent to store admins when orders arrive.
- [x] **32. Send payment failure email** — If payment fails, no email to customer or admin.
- [x] **33. Fix collection_products RLS** — `supabase/migrations/001_initial_schema.sql:125-130` — no RLS enabled. Any user can read/write.
- [x] **34. Add status transition validation** — Admin can jump from "delivered" to "pending". Enforce valid state machine: `pending → confirmed → processing → shipped → delivered`.
- [x] **35. Fix variant stock decrement** — `src/app/api/orders/route.ts:112` — checkout never sends `variant_id`, so variant stock is never touched.
- [x] **36. Fix guest email fallback** — `src/app/(store)/checkout/page.tsx:400` sends `pending@checkout.com` to Paystack if email empty. Require valid email.
- [x] **37. Fix newsletter form** — `src/app/store/page.tsx:295` — `onSubmit={(e) => e.preventDefault()}` does nothing. Actually save email to DB or mailing list.

---

## Phase 4 — MEDIUM Issues (25 issues)

- [x] **38. Fix cart UNIQUE constraint with NULL variant_id** — `supabase/migrations/001_initial_schema.sql:206` — PostgreSQL `NULL != NULL` in UNIQUE. Two rows with same `(user_id, product_id, NULL)` are allowed. Use COALESCE or partial unique index.
- [x] **39. Add coupon used_count atomic increment** — `supabase/migrations/001_initial_schema.sql:238-251` — no atomic mechanism. Concurrent applications both pass `used_count < max_uses`.
- [x] **40. Add updated_at auto-update triggers** — Tables with `updated_at` columns have no DB trigger. Code manually sets it in some routes but not all.
- [x] **41. Restrict activity_logs INSERT policy** — `supabase/migrations/001_initial_schema.sql:396` — `WITH CHECK (true)` lets any authenticated user insert audit logs.
- [x] **42. Add price filter to shop page** — `src/app/shop/page.tsx` — no price range filter. Essential for fashion e-commerce.
- [x] **43. Fix "Recently Viewed" — currently fake** — `src/app/store/page.tsx:279-284` just shows first 3 products. Implement actual localStorage-based viewed history.
- [x] **44. Remove hardcoded product ratings** — `src/app/(store)/product/[slug]/page.tsx:128-137` always shows "4.8 (42 reviews)". Remove or connect to real review system.
- [x] **45. Add size guide** — Product detail page advertises sizing but no size chart exists. Create `/size-guide` page.
- [x] **46. Show stock on product page** — No stock count or low-stock warning displayed.
- [x] **47. Show variant-level stock** — If size "M" is sold out but "L" is in stock, page shows no indication.
- [ ] **48. Implement coupon/discount system** — `Coupon` type exists (`types/index.ts:100-110`) but no implementation.
- [ ] **49. Implement address book** — `Address` type exists (`types/index.ts:74-84`) but no saved addresses feature.
- [x] **50. Implement product reviews** — Type exists, ratings hardcoded. No review submission or display.
- [x] **51. Add order notes/comments for admin** — Admin cannot add internal notes to orders.
- [x] **52. Add order status transition date tracking** — Timeline shows steps but not when each transition occurred.
- [x] **53. Fix order number generation** — `src/app/api/orders/route.ts:60` — uses `Math.random()`. Use `crypto.randomUUID()` or DB sequence.
- [x] **54. Add delivery state dropdown** — Checkout state field is free text. Should be dropdown of valid Nigerian states.
- [x] **55. Add order review step before Paystack** — No confirmation before opening payment window.
- [x] **56. Log email failures** — `src/app/api/orders/route.ts:157` — `.catch(() => {})` swallows errors silently.
- [x] **57. Add `PAYSTACK_SECRET_KEY` to `.env.example`** — Currently missing, misleading for developers.
- [x] **58. Add plain-text email fallback** — Emails are HTML-only. Some clients strip HTML.
- [x] **59. Fix orders.user_id ON DELETE SET NULL** — `supabase/migrations/001_initial_schema.sql:157` — orphaned orders become invisible. Use ON DELETE RESTRICT.
- [x] **60. Validate admin status update request body** — `src/app/api/admin/orders/[id]/status/route.ts:28` — no try/catch on `request.json()`.
- [x] **61. Implement payment_status transition validation** — Orders can jump from `refunded` back to `paid`.
- [x] **62. Refetch stale cart prices before checkout** — Cart stores Product snapshot. Refresh prices from DB before checkout.

---

## Phase 5 — LOW / Polish (18 issues)

- [x] **63. Add CSP headers** — `next.config.ts`, `vercel.json` — no Content-Security-Policy.
- [x] **64. Add CORS config** — `vercel.json` — no explicit CORS headers.
- [x] **65. Fix `.env.example` gitignore** — `.gitignore:37` gitignores `.env.example`. It should be committed.
- [x] **66. Apply session timeout to admin** — `src/components/layout/store-shell.tsx:36` — 15min timeout only in store, not admin.
- [x] **67. Sanitize error messages** — `src/app/api/admin/orders/[id]/status/route.ts:63` — returns Supabase error messages directly. Hide internal details.
- [x] **68. Restrict wildcard image domains** — `next.config.ts:7-8` — `*.supabase.co` too broad. Use specific subdomain.
- [x] **69. Use `next/image` for product images** — All pages use raw `<img>` tags. No optimization, potential layout shift.
- [x] **70. Add `error.tsx` boundaries** — No error boundaries in route groups. Unhandled errors show blank page.
- [x] **71. Add `loading.tsx` skeletons** — Top-level routes show basic spinners, no skeleton loaders.
- [x] **72. Add `not-found.tsx`** — No custom 404 page.
- [x] **73. Add SEO metadata exports** — Root layout metadata in place. Page-level metadata not feasible for client components.
- [x] **74. Add `sitemap.ts` and `robots.ts`** — No sitemap or robots.txt generation.
- [x] **75. Fix static product IDs vs DB UUIDs** — `src/lib/products.ts` uses `"real-1"` etc. DB uses UUIDs. Static array removed, only `getProductTags` kept.
- [x] **76. Sync TypeScript types with DB schema** — `src/types/index.ts` has `stock`, `is_published` but DB has `stock_quantity`, `is_active`. Mapping already done in hooks.
- [x] **77. Add missing DB indexes** — `orders.payment_reference`, `orders.payment_status + created_at`, `coupons.code`.
- [x] **78. Add product_variants composite unique index** — No `UNIQUE(product_id, size, color)` constraint. Duplicates possible.
- [x] **79. Add product image gallery** — Only first image shown. No carousel for multi-image products.

---

## Summary

| Phase | Issues | Status |
|-------|--------|--------|
| Phase 1 — CRITICAL Security & Data Loss | 14 | ⬜ Not started |
| Phase 2 — HIGH Security & Auth | 8 | ⬜ Not started |
| Phase 3 — HIGH E-Commerce Logic | 15 | ⬜ Not started |
| Phase 4 — MEDIUM Issues | 25 | ⬜ Not started |
| Phase 5 — LOW / Polish | 18 | ⬜ Not started |
| **Total** | **79** | |
