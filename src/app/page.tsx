import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Gift, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Newsletter } from "@/components/sections/newsletter";
import { ReviewCards } from "@/components/sections/review-cards";
import { FAQ } from "@/components/sections/faq";
import { SensualStory } from "@/components/sections/sensual-story";
import { categories, categoryDescriptions, getReviews } from "@/lib/catalog";
import { trustBadges } from "@/lib/constants";
import { listProducts } from "@/lib/server/product-store";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts();
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <>
      <section className="desire-hero relative min-h-[82svh] overflow-hidden bg-[#050204] text-white">
        <Image
          src="/brand/naughty-fantasy-logo.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_45%] opacity-50 md:object-center md:opacity-38"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,2,4,.97)_0%,rgba(5,2,4,.84)_42%,rgba(5,2,4,.18)_78%,rgba(5,2,4,.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,2,4,.04)_55%,#050204_100%)]" />
        <div className="container-pad relative z-10 flex min-h-[82svh] items-center py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff4089]/45 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase text-[#ff7aaa] backdrop-blur">
              <Zap className="size-3.5 fill-current" />Private launch · 20% off curated edits
            </div>
            <p className="mt-7 text-sm font-semibold uppercase text-[#f4c075]">Naughty Fantasy</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.04] sm:text-6xl md:text-7xl">
              Make the night
              <span className="desire-text block">impossible to forget.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Provocative lingerie, playful couples collections, and intimate wellness essentials curated for chemistry, confidence, and complete privacy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[#ff1976] text-white shadow-[0_0_32px_rgba(255,25,118,.35)] hover:bg-[#e90061]">
                <Link href="/shop">Shop the mood <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-black/20 text-white hover:bg-white/10 hover:text-white">
                <Link href="/categories/fantasy-collections">Enter fantasy</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2"><Star className="size-4 fill-[#f4c075] text-[#f4c075]" />4.8 customer rating</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#21d8c7]" />Body-safe selections</span>
              <span className="inline-flex items-center gap-2"><Gift className="size-4 text-[#ff6aa3]" />Discreet delivery</span>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b bg-[#0a0609] py-5 text-white">
        <div className="container-pad grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <badge.icon className="size-4 text-[#f4c075]" />
              </span>
              <span className="text-sm text-white/70">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="category-spectrum py-16">
        <div className="container-pad">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#d90060] dark:text-[#ff5b9c]">Featured desires</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">Find your kind of pleasure.</h2>
            </div>
            <Button asChild variant="ghost"><Link href="/shop">View all <ArrowRight className="size-4" /></Link></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category, index) => {
              const icons = [Sparkles, Gift, ShieldCheck, BadgeCheck, ArrowRight];
              const Icon = icons[index] ?? Sparkles;
              return (
                <Link key={category} href={`/categories/${slugify(category)}`} className={`category-tile category-tile-${index + 1} focus-ring group min-h-60 rounded-lg border p-5 transition hover:-translate-y-1 hover:shadow-xl`}>
                  <span className="flex size-11 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-10 text-xl font-semibold">{category}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
                  <ArrowRight className="mt-5 size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <SensualStory />
      <ProductCarousel title="Best sellers" products={bestSellers} />
      <section className="electric-banner py-14 text-white">
        <div className="container-pad flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#ffd08a]">Couples night in</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-semibold md:text-5xl">Two curious minds. One private delivery.</h2>
            <p className="mt-4 max-w-xl text-white/65">Save 15% when you build a couples edit from selected accessories and wellness favorites.</p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-[#20cfc0] text-[#071311] hover:bg-[#44e2d4]">
            <Link href="/categories/couples-collection">Explore together <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
      <ProductCarousel title="New arrivals" products={newArrivals} />
      <ReviewCards reviews={getReviews()} />
      <FAQ />
      <Newsletter />
    </>
  );
}
