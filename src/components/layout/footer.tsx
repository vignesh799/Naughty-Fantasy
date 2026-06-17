import Link from "next/link";
import { Logo } from "@/components/logo";
import { categories } from "@/lib/catalog";
import { siteConfig, trustBadges } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container-pad grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{siteConfig.description}</p>
          <div className="mt-5 grid gap-2 text-sm">
            {trustBadges.map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-2 text-muted-foreground">
                <badge.icon className="size-4 text-primary" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Shop</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {categories.map((category) => (
              <Link key={category} href={`/categories/${slugify(category)}`} className="text-muted-foreground hover:text-primary">
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Account</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/account/login" className="text-muted-foreground hover:text-primary">Login</Link>
            <Link href="/account/register" className="text-muted-foreground hover:text-primary">Register</Link>
            <Link href="/account/orders" className="text-muted-foreground hover:text-primary">Order history</Link>
            <Link href="/account/profile" className="text-muted-foreground hover:text-primary">Profile</Link>
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Support</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <span>Discreet delivery</span>
            <span>Secure checkout</span>
            <span>Body-safe standards</span>
            <span>18+ only</span>
          </div>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container-pad flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2026 Naughty Fantasy. Original demo storefront.</span>
          <span>Stripe, analytics, and CMS integrations are placeholder-ready.</span>
        </div>
      </div>
    </footer>
  );
}
