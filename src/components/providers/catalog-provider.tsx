"use client";

import * as React from "react";
import { getSeedProducts } from "@/lib/catalog";
import type { Product } from "@/types/product";

type CatalogContextValue = {
  products: Product[];
  refreshProducts: () => Promise<void>;
};

const CatalogContext = React.createContext<CatalogContextValue | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(getSeedProducts());

  const refreshProducts = React.useCallback(async () => {
    const response = await fetch("/api/products", { cache: "no-store" });
    if (!response.ok) return;
    setProducts((await response.json()) as Product[]);
  }, []);

  React.useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  const value = React.useMemo(() => ({ products, refreshProducts }), [products, refreshProducts]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = React.useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}
