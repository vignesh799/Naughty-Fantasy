import { filterProductsByCategory } from "@/lib/catalog";
import { getProductBySlug, listProducts } from "@/lib/server/product-store";

export const cms = {
  products: {
    list: listProducts,
    bySlug: getProductBySlug,
    byCategory: async (categorySlug: string) =>
      filterProductsByCategory(await listProducts(), categorySlug),
  },
};
