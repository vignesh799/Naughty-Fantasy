import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { getSeedProducts } from "@/lib/catalog";
import {
  productInputToRow,
  productRowToProduct,
  type ProductRow,
} from "@/lib/supabase/product-mapper";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types/product";

const runtimeDirectory = path.join(process.cwd(), "data");
const runtimeFile = path.join(runtimeDirectory, "products.runtime.json");

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140).optional().default(""),
  category: z.enum([
    "Lingerie",
    "Couples Collection",
    "Wellness Products",
    "Accessories",
    "Fantasy Collections",
  ]),
  sku: z.string().trim().max(80).optional(),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^https?:\/\//i.test(value) || /^\/uploads\/products\/[a-z0-9-]+\.(jpg|png|webp)$/i.test(value),
      "Image must be an uploaded product image or a valid URL.",
    )
    .optional()
    .transform((value) => value || undefined),
  description: z.string().trim().min(10).max(1000),
  details: z.array(z.string().trim().min(1).max(180)).max(20).default([]),
  price: z.number().min(0).max(10000000),
  compareAtPrice: z.number().min(0).max(10000000).optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  badge: z.enum(["Best seller", "New", "Limited", "Editor pick"]).optional(),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  color: z.string().trim().min(1).max(80),
  inventory: z.number().int().min(0).max(100000),
  status: z.enum(["active", "draft"]).default("active"),
});

export type ProductInput = z.infer<typeof productInputSchema>;

let writeQueue = Promise.resolve();

async function readRuntimeProducts(): Promise<Product[]> {
  try {
    const contents = await fs.readFile(runtimeFile, "utf8");
    return JSON.parse(contents) as Product[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return getSeedProducts().map((product) => ({ ...product, status: product.status ?? "active" }));
    }
    throw error;
  }
}

async function listSupabaseProducts(options: { includeDrafts?: boolean } = {}) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (!options.includeDrafts) query = query.eq("status", "active");
  const { data, error } = await query;
  if (error) throw new Error(`Unable to load Supabase products: ${error.message}`);
  return (data as ProductRow[]).map(productRowToProduct);
}

async function persistProducts(products: Product[]) {
  await fs.mkdir(runtimeDirectory, { recursive: true });
  const temporaryFile = `${runtimeFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await fs.rm(runtimeFile, { force: true });
  await fs.rename(temporaryFile, runtimeFile);
}

function queueWrite<T>(operation: () => Promise<T>) {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function listProducts(options: { includeDrafts?: boolean } = {}) {
  if (isSupabaseConfigured()) return listSupabaseProducts(options);
  const products = await readRuntimeProducts();
  return options.includeDrafts ? products : products.filter((product) => product.status !== "draft");
}

export async function getProductBySlug(slug: string, options: { includeDrafts?: boolean } = {}) {
  const products = await listProducts(options);
  return products.find((product) => product.slug === slug);
}

export async function createProduct(input: ProductInput) {
  if (isSupabaseConfigured()) {
    const parsed = productInputSchema.parse(input);
    const products = await listSupabaseProducts({ includeDrafts: true });
    const slug = createUniqueSlug(products, parsed.slug || parsed.name);
    const supabase = createSupabaseAdminClient();
    const timestamp = new Date().toISOString();
    const row = {
      id: `prd_${crypto.randomUUID()}`,
      ...productInputToRow(parsed, slug),
      created_at: timestamp,
      updated_at: timestamp,
    };
    const { data, error } = await supabase.from("products").insert(row).select("*").single();
    if (error) throw new Error(`Unable to create Supabase product: ${error.message}`);
    return productRowToProduct(data as ProductRow);
  }

  return queueWrite(async () => {
    const products = await readRuntimeProducts();
    const parsed = productInputSchema.parse(input);
    const slug = createUniqueSlug(products, parsed.slug || parsed.name);
    const timestamp = new Date().toISOString();
    const product: Product = {
      ...parsed,
      id: `prd_${crypto.randomUUID()}`,
      slug,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    products.unshift(product);
    await persistProducts(products);
    return product;
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  if (isSupabaseConfigured()) {
    const parsed = productInputSchema.parse(input);
    const products = await listSupabaseProducts({ includeDrafts: true });
    if (!products.some((product) => product.id === id)) return null;
    const slug = createUniqueSlug(products, parsed.slug || parsed.name, id);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("products")
      .update({
        ...productInputToRow(parsed, slug),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`Unable to update Supabase product: ${error.message}`);
    return productRowToProduct(data as ProductRow);
  }

  return queueWrite(async () => {
    const products = await readRuntimeProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index < 0) return null;
    const parsed = productInputSchema.parse(input);
    const slug = createUniqueSlug(products, parsed.slug || parsed.name, id);
    const updated: Product = {
      ...products[index],
      ...parsed,
      slug,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    await persistProducts(products);
    return updated;
  });
}

export async function deleteProduct(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseAdminClient();
    const { count, error } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw new Error(`Unable to delete Supabase product: ${error.message}`);
    return Boolean(count);
  }

  return queueWrite(async () => {
    const products = await readRuntimeProducts();
    const nextProducts = products.filter((product) => product.id !== id);
    if (nextProducts.length === products.length) return false;
    await persistProducts(nextProducts);
    return true;
  });
}

function createUniqueSlug(products: Product[], value: string, currentId?: string) {
  const baseSlug = slugify(value) || `product-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  while (products.some((product) => product.id !== currentId && product.slug === slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }
  return slug;
}
