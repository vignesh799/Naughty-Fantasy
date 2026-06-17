# Naughty Fantasy

Modern premium adult-lifestyle e-commerce storefront built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style Radix UI primitives, and Framer Motion.

## Features

- App Router pages for homepage, shop, product detail, categories, cart, checkout, and account flows
- URL-driven product search, category filters, sorting, and pagination
- Persistent cart and wishlist via local storage
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

Products currently come from `src/data/products.json`. To connect a CMS, replace the implementation behind `src/lib/cms.ts` or `src/lib/catalog.ts` while keeping the same typed product contract.

Checkout is intentionally a placeholder. Wire `createCheckoutSession` in `src/lib/stripe.ts` to your server-side Stripe integration and replace the checkout form payment block with Stripe Elements or hosted Checkout.

## Demo Coupon

Use `FANTASY10` in the cart to apply a 10% demo discount.
