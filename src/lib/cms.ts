import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/catalog";

export const cms = {
  products: {
    list: getProducts,
    bySlug: getProductBySlug,
    byCategory: getProductsByCategory,
  },
};
