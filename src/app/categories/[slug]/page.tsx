import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { categories, categoryDescriptions, filterProductsByCategory, getCategoryBySlug } from "@/lib/catalog";
import { listProducts } from "@/lib/server/product-store";
import { slugify } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: slugify(category) }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category,
    description: categoryDescriptions[category],
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const products = filterProductsByCategory(await listProducts(), slug);

  return (
    <div className="container-pad py-10">
      <p className="text-sm font-semibold uppercase text-primary">Category</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{category}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{categoryDescriptions[category]}</p>
      <div className="mt-5">
        <Button asChild variant="outline"><Link href={`/shop?category=${slug}`}>Open in shop filters</Link></Button>
      </div>
      <div className="mt-8"><ProductGrid products={products} /></div>
    </div>
  );
}
