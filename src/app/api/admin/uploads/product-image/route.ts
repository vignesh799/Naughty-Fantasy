import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const allowedTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

function hasValidSignature(bytes: Uint8Array, mimeType: keyof typeof allowedTypes) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") {
    return bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index]);
  }
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Select an image to upload." }, { status: 400 });
  }
  if (!(file.type in allowedTypes)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, or WebP image." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "The image must be smaller than 8 MB." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = file.type as keyof typeof allowedTypes;
  if (!hasValidSignature(bytes, mimeType)) {
    return NextResponse.json({ error: "The selected file is not a valid image." }, { status: 400 });
  }

  const filename = `${crypto.randomUUID()}.${allowedTypes[mimeType]}`;

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseAdminClient();
    const storagePath = `products/${filename}`;
    const { error } = await supabase.storage.from("product-images").upload(storagePath, bytes, {
      contentType: mimeType,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: `Unable to upload image: ${error.message}` }, { status: 500 });
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(storagePath);
    return NextResponse.json({ url: data.publicUrl });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "products");
  await fs.mkdir(uploadDirectory, { recursive: true });
  await fs.writeFile(path.join(uploadDirectory, filename), bytes);
  return NextResponse.json({ url: `/uploads/products/${filename}` });
}
