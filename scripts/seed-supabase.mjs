import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.");
}

const products = JSON.parse(
  await readFile(new URL("../src/data/products.json", import.meta.url), "utf8"),
);
const timestamp = new Date().toISOString();

const rows = products.map((product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  category: product.category,
  sku: product.sku ?? null,
  image_url: product.imageUrl ?? null,
  description: product.description,
  details: product.details,
  price: product.price,
  compare_at_price: product.compareAtPrice ?? null,
  currency: "INR",
  rating: product.rating,
  review_count: product.reviewCount,
  tags: product.tags,
  badge: product.badge ?? null,
  is_best_seller: product.isBestSeller ?? false,
  is_new: product.isNew ?? false,
  color: product.color,
  inventory: product.inventory,
  status: product.status ?? "active",
  created_at: product.createdAt ?? timestamp,
  updated_at: timestamp,
}));

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });

if (error) throw error;
console.log(`Seeded ${rows.length} products into Supabase.`);
