import type { Product } from "@/types/product";
import type { ProductInput } from "@/lib/server/product-store";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: Product["category"];
  sku: string | null;
  image_url: string | null;
  description: string;
  details: string[];
  price: number | string;
  compare_at_price: number | string | null;
  rating: number | string;
  review_count: number;
  tags: string[];
  badge: Product["badge"] | null;
  is_best_seller: boolean;
  is_new: boolean;
  color: string;
  inventory: number;
  status: "active" | "draft";
  created_at: string;
  updated_at: string;
};

export function productRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    sku: row.sku ?? undefined,
    imageUrl: row.image_url ?? undefined,
    description: row.description,
    details: row.details ?? [],
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tags: row.tags ?? [],
    badge: row.badge ?? undefined,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    color: row.color,
    inventory: row.inventory,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function productInputToRow(input: ProductInput, slug: string) {
  return {
    slug,
    name: input.name,
    category: input.category,
    sku: input.sku ?? null,
    image_url: input.imageUrl ?? null,
    description: input.description,
    details: input.details,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    rating: input.rating,
    review_count: input.reviewCount,
    tags: input.tags,
    badge: input.badge ?? null,
    is_best_seller: input.isBestSeller,
    is_new: input.isNew,
    color: input.color,
    inventory: input.inventory,
    status: input.status,
  };
}
