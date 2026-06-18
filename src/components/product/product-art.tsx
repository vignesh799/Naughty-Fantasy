import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ProductArt({ product, className }: { product: Product; className?: string }) {
  return (
    <div
      className={cn("product-art relative aspect-[4/5] overflow-hidden rounded-lg bg-cover bg-center", className)}
      style={product.imageUrl ? { backgroundImage: `url("${product.imageUrl.replaceAll('"', "%22")}")` } : undefined}
    >
      {product.imageUrl ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
      ) : (
        <>
          <div className="product-glow absolute inset-x-6 bottom-6 top-10 rounded-full blur-sm" />
          <div className="product-silhouette absolute left-1/2 top-1/2 h-2/3 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl" />
          <div className="absolute left-1/2 top-[24%] h-16 w-16 -translate-x-1/2 rounded-full border border-white/30 bg-black/55 shadow-lg" />
        </>
      )}
      <div className="absolute bottom-8 left-1/2 w-2/3 -translate-x-1/2 rounded-md border border-white/15 bg-black/65 p-3 text-center text-white shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{product.color}</p>
        <p className="mt-1 text-sm font-semibold">{product.name}</p>
      </div>
      {product.badge ? <Badge className="absolute left-3 top-3 bg-card/85 backdrop-blur">{product.badge}</Badge> : null}
    </div>
  );
}
