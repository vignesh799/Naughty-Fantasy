import { NextResponse } from "next/server";
import { listProducts } from "@/lib/server/product-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
