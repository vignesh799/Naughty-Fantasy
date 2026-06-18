import { CircleDollarSign, Package, PackageCheck, TriangleAlert } from "lucide-react";
import { ProductManager } from "@/components/admin/product-manager";
import { Card, CardContent } from "@/components/ui/card";
import { listProducts } from "@/lib/server/product-store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administrator Dashboard" };

export default async function AdminDashboardPage() {
  const products = await listProducts({ includeDrafts: true });
  const activeProducts = products.filter((product) => product.status !== "draft");
  const lowStock = products.filter((product) => product.inventory < 10);
  const inventoryValue = products.reduce((total, product) => total + product.price * product.inventory, 0);

  const stats = [
    { label: "All products", value: String(products.length), icon: Package },
    { label: "Active products", value: String(activeProducts.length), icon: PackageCheck },
    { label: "Low stock", value: String(lowStock.length), icon: TriangleAlert },
    { label: "Inventory value", value: formatCurrency(inventoryValue), icon: CircleDollarSign },
  ];

  return (
    <div className="container-pad py-8">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Store administration</p>
        <h1 className="mt-2 text-3xl font-semibold">Product management</h1>
        <p className="mt-2 text-muted-foreground">Create products and control pricing, stock, merchandising, and visibility.</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between pt-5">
              <div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="mt-1 text-2xl font-semibold">{stat.value}</p></div>
              <stat.icon className="size-6 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mt-8">
        <ProductManager initialProducts={products} />
      </section>
    </div>
  );
}
