import type { MetadataRoute } from "next";
import { categories, getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/shop", "/cart", "/checkout", "/account/login", "/account/register"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
  const productRoutes = getProducts().map((product) => ({
    url: `${siteConfig.url}/product/${product.slug}`,
    lastModified: new Date(),
  }));
  const categoryRoutes = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${slugify(category)}`,
    lastModified: new Date(),
  }));
  return [...routes, ...productRoutes, ...categoryRoutes];
}
