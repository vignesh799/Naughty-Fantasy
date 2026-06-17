"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ProductArt } from "@/components/product/product-art";
import { useCart } from "@/components/providers/cart-provider";
import { getProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, coupon, setCoupon } = useCart();
  const products = getProducts();
  const hydratedItems = items
    .map((item) => ({ item, product: products.find((product) => product.id === item.productId) }))
    .filter((entry): entry is { item: typeof items[number]; product: NonNullable<typeof entry.product> } => Boolean(entry.product));
  const subtotal = hydratedItems.reduce((total, entry) => total + entry.product.price * entry.item.quantity, 0);
  const discount = coupon === "FANTASY10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  if (hydratedItems.length === 0) {
    return (
      <div className="container-pad py-16 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Browse the collection and add your favorites.</p>
        <Button asChild className="mt-6"><Link href="/shop">Shop now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container-pad grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-3xl font-semibold">Shopping cart</h1>
        <div className="mt-6 space-y-4">
          {hydratedItems.map(({ item, product }) => (
            <div key={product.id} className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-[120px_1fr_auto]">
              <ProductArt product={product} className="aspect-square" />
              <div>
                <Link href={`/product/${product.slug}`} className="font-semibold hover:text-primary">{product.name}</Link>
                <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                <p className="mt-3 font-semibold">{formatCurrency(product.price)}</p>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex h-10 items-center rounded-md border">
                  <button className="focus-ring px-3" onClick={() => updateQuantity(product.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="size-4" /></button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button className="focus-ring px-3" onClick={() => updateQuantity(product.id, item.quantity + 1)} aria-label="Increase quantity"><Plus className="size-4" /></button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(product.id)} aria-label="Remove item"><Trash2 className="size-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="h-fit rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-4 flex gap-2">
          <Input defaultValue={coupon} placeholder="Coupon code" onBlur={(event) => setCoupon(event.target.value)} />
          <Button variant="outline" onClick={() => setCoupon(coupon || "FANTASY10")}>Apply</Button>
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        <Button asChild size="lg" className="mt-5 w-full"><Link href="/checkout">Checkout</Link></Button>
        <p className="mt-3 text-xs text-muted-foreground">Secure checkout placeholder. Use code FANTASY10 for demo discount.</p>
      </aside>
    </div>
  );
}
