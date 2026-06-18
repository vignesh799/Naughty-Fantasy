import products from "@/data/products.json";
import reviews from "@/data/reviews.json";
import type { Product, ProductCategory, Review } from "@/types/product";
import { slugify } from "@/lib/utils";

export const categories: ProductCategory[] = [
  "Lingerie",
  "Couples Collection",
  "Wellness Products",
  "Accessories",
  "Fantasy Collections",
];

export const categoryDescriptions: Record<ProductCategory, string> = {
  Lingerie: "Premium silhouettes, lace, mesh, and satin for intimate styling.",
  "Couples Collection": "Tasteful kits and accessories for shared rituals and date nights.",
  "Wellness Products": "Body care and rechargeable wellness essentials made for confidence.",
  Accessories: "Layering pieces, jewelry accents, and finishing details.",
  "Fantasy Collections": "Consent-forward kits that pair imagination with polished design.",
};

export function getSeedProducts(): Product[] {
  return products as Product[];
}

export function getReviews(): Review[] {
  return reviews as Review[];
}

export function findProductBySlug(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function filterProductsByCategory(products: Product[], categorySlug: string) {
  const category = categories.find((item) => slugify(item) === categorySlug);
  if (!category) return [];
  return products.filter((product) => product.category === category);
}

export function getCategoryBySlug(categorySlug: string) {
  return categories.find((item) => slugify(item) === categorySlug);
}

export function getRelatedProducts(products: Product[], product: Product, limit = 4) {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .concat(products.filter((item) => item.category !== product.category))
    .slice(0, limit);
}

export function searchProducts(products: Product[], query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.sku ?? "",
      product.description,
      product.color,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}
