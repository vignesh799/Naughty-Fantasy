import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopControls } from "@/components/shop/shop-controls";
import { categories, getProducts, searchProducts } from "@/lib/catalog";
import { slugify } from "@/lib/utils";

const PAGE_SIZE = 6;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Shop",
  description: "Browse Naughty Fantasy lingerie, wellness products, accessories, and fantasy collections.",
};

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;
  let products = query ? searchProducts(query) : getProducts();

  if (category) {
    products = products.filter((product) => slugify(product.category) === category);
  }

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "new") return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
    return Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller));
  });

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-pad py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase text-primary">Shop all</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Naughty Fantasy catalog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Filter by category, search product notes, and sort by price, rating, or arrivals.</p>
      </div>
      <ShopControls />
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((item) => (
          <Button key={item} asChild variant="outline" size="sm"><Link href={`/categories/${slugify(item)}`}>{item}</Link></Button>
        ))}
      </div>
      <div className="mt-8"><ProductGrid products={visible} /></div>
      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const nextPage = index + 1;
          const nextParams = new URLSearchParams();
          if (query) nextParams.set("q", query);
          if (category) nextParams.set("category", category);
          if (sort !== "featured") nextParams.set("sort", sort);
          nextParams.set("page", String(nextPage));
          return (
            <Button key={nextPage} asChild variant={nextPage === page ? "default" : "outline"} size="sm">
              <Link href={`/shop?${nextParams.toString()}`}>{nextPage}</Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
