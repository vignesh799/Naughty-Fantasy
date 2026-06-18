import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ProductArt } from "@/components/product/product-art";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRelatedProducts, getSeedProducts } from "@/lib/catalog";
import { getProductBySlug, listProducts } from "@/lib/server/product-store";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getSeedProducts().map((product) => ({ slug: product.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const products = await listProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = getRelatedProducts(products, product);

  return (
    <>
      <div className="container-pad grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-[88px_1fr]">
          <div className="order-2 grid grid-cols-4 gap-3 md:order-1 md:grid-cols-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductArt key={index} product={product} className="aspect-square" />
            ))}
          </div>
          <ProductArt product={product} className="order-1 md:order-2" />
        </div>
        <div>
          {product.badge ? <Badge className="mb-4">{product.badge}</Badge> : null}
          <h1 className="text-3xl font-semibold md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-primary text-primary" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="mt-5 text-lg text-muted-foreground">{product.description}</p>
          <AddToCartPanel product={product} />
          <Tabs defaultValue="details" className="mt-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {product.details.map((detail) => <li key={detail}>- {detail}</li>)}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="text-sm text-muted-foreground">
              Plain external packaging, tracked shipping, and secure payment placeholders for Stripe checkout.
            </TabsContent>
            <TabsContent value="reviews" className="text-sm text-muted-foreground">
              Customers rate this {product.rating} out of 5 across {product.reviewCount} verified reviews.
            </TabsContent>
          </Tabs>
          <Separator className="my-6" />
          <p className="text-sm text-muted-foreground">Adult customers only. Use products as directed and review materials before purchase.</p>
        </div>
      </div>
      <ProductCarousel title="Related products" products={related} />
    </>
  );
}
