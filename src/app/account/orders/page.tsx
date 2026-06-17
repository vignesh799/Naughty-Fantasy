import { PackageCheck } from "lucide-react";

export const metadata = { title: "Order History" };

export default function OrdersPage() {
  return (
    <div className="container-pad py-10">
      <h1 className="text-3xl font-semibold">Order history</h1>
      <div className="mt-6 rounded-lg border bg-card p-8 text-center">
        <PackageCheck className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
        <p className="mt-2 text-muted-foreground">Completed orders will appear here once authentication and payments are connected.</p>
      </div>
    </div>
  );
}
