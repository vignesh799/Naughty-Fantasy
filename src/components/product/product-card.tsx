"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/product/product-art";
import { useCart } from "@/components/providers/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28 }}
      className="product-card group rounded-lg border bg-card p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <ProductArt product={product} className={compact ? "aspect-[5/4]" : undefined} />
      </Link>
      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${product.slug}`} className="focus-ring rounded-sm font-semibold hover:text-primary">
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={cn("focus-ring rounded-full p-2 hover:bg-muted", wished && "text-primary")}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("size-5", wished && "fill-current")} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount})</span>
          {product.inventory < 10 ? <Badge className="ml-auto text-primary">Low stock</Badge> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <Button
            size="sm"
            className="shadow-[0_8px_24px_hsl(var(--primary)/.2)]"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addItem(product.id);
              trackEvent({ name: "add_to_cart", payload: { productId: product.id } });
            }}
          >
            <ShoppingBag className="size-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
