import { ShieldCheck, Sparkles, Truck, WalletCards } from "lucide-react";

export const siteConfig = {
  name: "Naughty Fantasy",
  url: "https://naughtyfantasy.example.com",
  description:
    "A premium adult-lifestyle e-commerce experience for lingerie, wellness, accessories, and fantasy collections.",
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "Lingerie", href: "/categories/lingerie" },
    { label: "Couples", href: "/categories/couples-collection" },
    { label: "Wellness", href: "/categories/wellness-products" },
    { label: "Fantasy", href: "/categories/fantasy-collections" },
  ],
};

export const trustBadges = [
  { label: "Discreet packaging", icon: Sparkles },
  { label: "Secure checkout", icon: ShieldCheck },
  { label: "Fast shipping", icon: Truck },
  { label: "Stripe-ready payments", icon: WalletCards },
];
