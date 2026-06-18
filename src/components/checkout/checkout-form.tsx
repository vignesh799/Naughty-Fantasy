"use client";

import { CreditCard, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { useCatalog } from "@/components/providers/catalog-provider";
import { createCheckoutSession } from "@/lib/stripe";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const { items, coupon, privateLockBox } = useCart();
  const { products } = useCatalog();
  const subtotal = items.reduce((total, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);
  const discount = coupon === "FANTASY10" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div className="container-pad grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <form className="rounded-lg border bg-card p-5">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Address and payment fields are ready for production integration.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" required /></div>
          <div className="space-y-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" required /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" required /></div>
          <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" required /></div>
          <div className="space-y-2"><Label htmlFor="postal">Postal code</Label><Input id="postal" required /></div>
        </div>
        <div className="mt-8 rounded-lg border p-4">
          <div className="flex items-center gap-2 font-semibold"><CreditCard className="size-5 text-primary" /> Payment placeholder</div>
          <p className="mt-2 text-sm text-muted-foreground">Connect Stripe Elements or redirect checkout through createCheckoutSession.</p>
        </div>
        <Button
          type="button"
          size="lg"
          className="mt-6"
          onClick={async () => {
            await createCheckoutSession({ items, coupon, privateLockBox });
          }}
        >
          <LockKeyhole className="size-4" />
          Place secure order
        </Button>
      </form>
      <aside className="h-fit rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => {
            const product = products.find((entry) => entry.id === item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="flex justify-between gap-3">
                <span>{product.name} × {item.quantity}</span>
                <span>{formatCurrency(product.price * item.quantity)}</span>
              </div>
            );
          })}
          {privateLockBox ? (
            <div className="flex justify-between gap-3 text-primary">
              <span>Private number-lock box</span>
              <span>Included</span>
            </div>
          ) : null}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
      </aside>
    </div>
  );
}
