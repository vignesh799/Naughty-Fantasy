import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createProduct,
  listProducts,
  productInputSchema,
} from "@/lib/server/product-store";

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(await listProducts({ includeDrafts: true }), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const input = productInputSchema.parse(await request.json());
    const product = await createProduct(input);
    revalidateStorefront();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid product data.", issues: error.flatten() }, { status: 400 });
    }
    throw error;
  }
}
