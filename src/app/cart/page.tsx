import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata = {
  title: "Cart",
  description: "Review your Naughty Fantasy cart and apply coupons before checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
