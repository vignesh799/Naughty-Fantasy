import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

export function ProductCarousel({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="py-12">
      <div className="container-pad">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Curated edit</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
