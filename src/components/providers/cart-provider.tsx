"use client";

import * as React from "react";
import type { CartItem } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  wishlist: string[];
  coupon: string;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setCoupon: (coupon: string) => void;
};

const CartContext = React.createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "nf-commerce";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [coupon, setCouponState] = React.useState("");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Pick<CartContextValue, "items" | "wishlist" | "coupon">;
      setItems(parsed.items ?? []);
      setWishlist(parsed.wishlist ?? []);
      setCouponState(parsed.coupon ?? "");
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, wishlist, coupon }));
  }, [items, wishlist, coupon]);

  const addItem = React.useCallback((productId: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (!existing) return [...current, { productId, quantity }];
      return current.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
      );
    });
  }, []);

  const removeItem = React.useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = React.useCallback(() => setItems([]), []);

  const toggleWishlist = React.useCallback((productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  }, []);

  const setCoupon = React.useCallback((nextCoupon: string) => setCouponState(nextCoupon.trim().toUpperCase()), []);

  const value = React.useMemo(
    () => ({ items, wishlist, coupon, addItem, removeItem, updateQuantity, clearCart, toggleWishlist, setCoupon }),
    [items, wishlist, coupon, addItem, removeItem, updateQuantity, clearCart, toggleWishlist, setCoupon],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
