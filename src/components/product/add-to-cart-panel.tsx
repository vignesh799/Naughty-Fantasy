"use client";

import * as React from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function AddToCartPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);
  const { addItem, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
        {product.compareAtPrice ? <span className="text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{product.inventory} available for immediate dispatch</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-11 items-center rounded-md border">
          <button className="focus-ring px-3" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button className="focus-ring px-3" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(product.inventory, value + 1))}>
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            addItem(product.id, quantity);
            trackEvent({ name: "add_to_cart", payload: { productId: product.id, quantity } });
          }}
        >
          <ShoppingBag className="size-4" />
          Add to cart
        </Button>
        <Button variant="outline" size="icon" aria-label="Toggle wishlist" onClick={() => toggleWishlist(product.id)} className={cn(wished && "text-primary")}>
          <Heart className={cn("size-4", wished && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
