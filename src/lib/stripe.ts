export type CheckoutSessionInput = {
  items: Array<{ productId: string; quantity: number }>;
  coupon?: string;
  privateLockBox?: boolean;
};

export async function createCheckoutSession(input: CheckoutSessionInput) {
  return {
    id: "cs_test_placeholder",
    url: "/checkout?session=placeholder",
    mode: "payment" as const,
    itemCount: input.items.reduce((total, item) => total + item.quantity, 0),
  };
}
