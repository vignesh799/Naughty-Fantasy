"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/logo";
import { SearchModal } from "@/components/layout/search-modal";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { categories, categoryDescriptions } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function Header() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container-pad flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <div className="group relative">
              <Link href="/shop" className="focus-ring rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">Shop</Link>
              <div className="invisible absolute left-0 top-9 w-[620px] rounded-lg border bg-popover p-5 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Link key={category} href={`/categories/${slugify(category)}`} className="focus-ring rounded-md p-3 hover:bg-muted">
                      <span className="font-semibold">{category}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{categoryDescriptions[category]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {siteConfig.nav.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="focus-ring rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              <Sun className="size-5 dark:hidden" />
              <Moon className="hidden size-5 dark:block" />
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Account">
              <Link href="/account/login"><UserRound className="size-5" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label={`Cart with ${itemCount} items`} className="relative">
              <Link href="/cart">
                <ShoppingBag className="size-5" />
                {itemCount > 0 ? <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{itemCount}</span> : null}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {mobileOpen ? (
          <nav className="container-pad grid gap-2 border-t py-4 lg:hidden" aria-label="Mobile navigation">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="focus-ring rounded-md px-3 py-2 font-medium hover:bg-muted">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
