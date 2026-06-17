import Link from "next/link";
import { ArrowRight, BadgeCheck, Gift, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Newsletter } from "@/components/sections/newsletter";
import { ReviewCards } from "@/components/sections/review-cards";
import { FAQ } from "@/components/sections/faq";
import { categories, categoryDescriptions, getProducts, getReviews } from "@/lib/catalog";
import { trustBadges } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export default function HomePage() {
  const products = getProducts();
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="container-pad grid min-h-[calc(100vh-4rem)] gap-8 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <Badge className="bg-card">Private launch: 20% off curated edits</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Premium adult-lifestyle essentials, styled with discretion.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Shop refined lingerie, wellness accessories, and fantasy collections with secure checkout and discreet delivery.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/shop">Shop collection <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/categories/fantasy-collections">Explore fantasy edits</Link></Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <badge.icon className="size-4 text-primary" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-panel relative min-h-[440px] overflow-hidden rounded-lg border p-5">
            <div className="absolute inset-5 rounded-lg border border-primary/20" />
            <div className="absolute left-1/2 top-12 h-64 w-44 -translate-x-1/2 rounded-full bg-card/80 shadow-2xl" />
            <div className="absolute bottom-8 left-8 right-8 rounded-lg border bg-background/85 p-5 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold uppercase text-primary">Naughty Fantasy Signature Box</p>
              <h2 className="mt-2 text-2xl font-semibold">Gift-ready. Private. Polished.</h2>
              <p className="mt-2 text-sm text-muted-foreground">A seasonal edit built from best sellers and new arrivals.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container-pad">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">Featured categories</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Shop by fantasy, ritual, and finish</h2>
            </div>
            <Button asChild variant="ghost"><Link href="/shop">View all <ArrowRight className="size-4" /></Link></Button>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {categories.map((category, index) => {
              const icons = [Sparkles, Gift, ShieldCheck, BadgeCheck, ArrowRight];
              const Icon = icons[index] ?? Sparkles;
              return (
                <Link key={category} href={`/categories/${slugify(category)}`} className="focus-ring rounded-lg border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                  <Icon className="size-6 text-primary" />
                  <h3 className="mt-4 font-semibold">{category}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-card py-10">
        <div className="container-pad grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-6">
            <p className="text-sm font-semibold uppercase text-primary">Weekend offer</p>
            <h2 className="mt-2 text-2xl font-semibold">Bundle couples edits and save 15%</h2>
          </div>
          <div className="rounded-lg border bg-background p-6">
            <p className="text-sm font-semibold uppercase text-primary">Discreet dispatch</p>
            <h2 className="mt-2 text-2xl font-semibold">Plain packaging on every order</h2>
          </div>
        </div>
      </section>
      <ProductCarousel title="Best sellers" products={bestSellers} />
      <ProductCarousel title="New arrivals" products={newArrivals} />
      <ReviewCards reviews={getReviews()} />
      <FAQ />
      <Newsletter />
    </>
  );
}
