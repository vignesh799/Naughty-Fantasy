import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteProduct,
  productInputSchema,
  updateProduct,
} from "@/lib/server/product-store";

type Params = Promise<{ id: string }>;

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/sitemap.xml");
}

export async function PUT(request: Request, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const input = productInputSchema.parse(await request.json());
    const product = await updateProduct(id, input);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    revalidateStorefront();
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid product data.", issues: error.flatten() }, { status: 400 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
