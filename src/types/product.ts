export type ProductCategory =
  | "Lingerie"
  | "Couples Collection"
  | "Wellness Products"
  | "Accessories"
  | "Fantasy Collections";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  details: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: "Best seller" | "New" | "Limited" | "Editor pick";
  isBestSeller?: boolean;
  isNew?: boolean;
  color: string;
  inventory: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
