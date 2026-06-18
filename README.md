# Naughty Fantasy

Modern premium adult-lifestyle e-commerce storefront built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style Radix UI primitives, and Framer Motion.

## Features

- App Router pages for homepage, shop, product detail, categories, cart, checkout, and account flows
- URL-driven product search, category filters, sorting, and pagination
- Persistent cart and wishlist via local storage
- Indian rupee pricing across catalog, cart, checkout, and administration
- Optional private number-lock packing preview in the cart
- Supabase-backed product database with a local JSON fallback
- Supabase Auth-backed administrator login when configured
- Protected administrator dashboard for product CRUD, pricing, inventory, badges, and draft visibility
- Stripe checkout placeholder in `src/lib/stripe.ts`
- CMS-ready catalog adapter in `src/lib/cms.ts`
- SEO metadata, Open Graph defaults, robots, and sitemap generation
- Dark and light mode with `next-themes`
- Original CSS-generated placeholder product imagery and logo
- Accessible controls, semantic landmarks, keyboard-focus states, and responsive mobile-first layout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Administrator

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Without Supabase credentials, the app uses these local development defaults:

```text
Email: admin@naughtyfantasy.local
Password: Admin123!
```

For production, connect Supabase and replace all values in `.env.local`:

```bash
ADMIN_EMAIL=your-admin@example.com
ADMIN_SESSION_SECRET=use-at-least-32-random-characters
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
SUPABASE_SECRET_KEY=sb_secret_your-server-only-key
```

The administrator session uses a signed, HttpOnly, same-site cookie. Supabase Auth validates the email and password when Supabase is configured.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. In Authentication > Users, create an administrator user whose email matches `ADMIN_EMAIL`.
4. Copy the project URL, publishable key, and secret key from the project's Connect dialog into `.env.local`.
5. Import the included sample products:

```bash
npm run supabase:seed
```

If an existing Supabase project already contains the original USD catalog, run
`supabase/migrations/20260618_convert_prices_to_inr.sql` once in the SQL Editor.
The included migration converts values at `₹83` per US dollar and records the currency as INR.

Restart the development server after changing environment variables.

The server-only `SUPABASE_SECRET_KEY` must never use the `NEXT_PUBLIC_` prefix or be exposed to browser code. The included SQL enables Row Level Security and permits public reads only for active products. Product writes are performed by protected server routes.

Administrators can upload product images directly from the product editor. Supabase deployments store them in the public `product-images` Storage bucket. Existing projects should run `supabase/migrations/20260618_add_product_image_storage.sql` once. Local development stores images under `public/uploads/products`.

## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

## Project Structure

```text
src/app                 App Router pages, metadata, sitemap, robots
src/components          Layout, sections, product, cart, checkout, and UI components
src/data                Sample product and review JSON
src/lib                 Catalog access, CMS adapter, Stripe placeholder, utilities
src/types               Shared TypeScript domain types
```

## Commerce Notes

When Supabase is configured, products are stored in the `public.products` table. Without Supabase credentials, the application falls back to `data/products.runtime.json` and then the seed catalog in `src/data/products.json`.

The product storage boundary is implemented in `src/lib/server/product-store.ts`, so it can still be replaced with another database or CMS without changing the storefront components.

Checkout is intentionally a placeholder. Wire `createCheckoutSession` in `src/lib/stripe.ts` to your server-side Stripe integration and replace the checkout form payment block with Stripe Elements or hosted Checkout.

## Demo Coupon

Use `FANTASY10` in the cart to apply a 10% demo discount.
