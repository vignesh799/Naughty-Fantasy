"use client";

import * as React from "react";
import Link from "next/link";
import { Edit3, Eye, ImagePlus, PackagePlus, Search, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types/product";

type EditorState = {
  name: string;
  slug: string;
  category: ProductCategory;
  sku: string;
  imageUrl: string;
  description: string;
  details: string;
  price: string;
  compareAtPrice: string;
  rating: string;
  reviewCount: string;
  tags: string;
  badge: string;
  isBestSeller: boolean;
  isNew: boolean;
  color: string;
  inventory: string;
  status: "active" | "draft";
};

const emptyEditor: EditorState = {
  name: "",
  slug: "",
  category: "Lingerie",
  sku: "",
  imageUrl: "",
  description: "",
  details: "",
  price: "",
  compareAtPrice: "",
  rating: "0",
  reviewCount: "0",
  tags: "",
  badge: "none",
  isBestSeller: false,
  isNew: false,
  color: "",
  inventory: "0",
  status: "active",
};

function toEditor(product: Product): EditorState {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    sku: product.sku ?? "",
    imageUrl: product.imageUrl ?? "",
    description: product.description,
    details: product.details.join("\n"),
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    rating: String(product.rating),
    reviewCount: String(product.reviewCount),
    tags: product.tags.join(", "),
    badge: product.badge ?? "none",
    isBestSeller: Boolean(product.isBestSeller),
    isNew: Boolean(product.isNew),
    color: product.color,
    inventory: String(product.inventory),
    status: product.status ?? "active",
  };
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = React.useState(initialProducts);
  const [query, setQuery] = React.useState("");
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editor, setEditor] = React.useState<EditorState>(emptyEditor);
  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [error, setError] = React.useState("");

  const filteredProducts = products.filter((product) =>
    [product.name, product.category, product.slug].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  function openNewProduct() {
    setEditingId(null);
    setEditor(emptyEditor);
    setError("");
    setEditorOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingId(product.id);
    setEditor(toEditor(product));
    setError("");
    setEditorOpen(true);
  }

  function updateEditor<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setEditor((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(file: File) {
    setUploadingImage(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch("/api/admin/uploads/product-image", {
      method: "POST",
      body: formData,
    });
    setUploadingImage(false);
    const result = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !result.url) {
      setError(result.error ?? "Unable to upload image.");
      return;
    }
    updateEditor("imageUrl", result.url);
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      name: editor.name,
      slug: editor.slug,
      category: editor.category,
      sku: editor.sku || undefined,
      imageUrl: editor.imageUrl || undefined,
      description: editor.description,
      details: editor.details.split("\n").map((item) => item.trim()).filter(Boolean),
      price: Number(editor.price),
      compareAtPrice: editor.compareAtPrice ? Number(editor.compareAtPrice) : undefined,
      rating: Number(editor.rating),
      reviewCount: Number(editor.reviewCount),
      tags: editor.tags.split(",").map((item) => item.trim()).filter(Boolean),
      badge: editor.badge === "none" ? undefined : editor.badge,
      isBestSeller: editor.isBestSeller,
      isNew: editor.isNew,
      color: editor.color,
      inventory: Number(editor.inventory),
      status: editor.status,
    };
    const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? "Unable to save product.");
      return;
    }
    const product = (await response.json()) as Product;
    setProducts((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? product : item))
        : [product, ...current],
    );
    setEditorOpen(false);
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (response.ok) setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search products" />
        </div>
        <Button onClick={openNewProduct}><PackagePlus className="size-4" />Add product</Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b last:border-0">
                <td className="px-4 py-4">
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{product.category} / {product.sku || product.slug}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice ? <span className="ml-2 text-xs text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
                </td>
                <td className="px-4 py-4">{product.inventory}</td>
                <td className="px-4 py-4">
                  <Badge className={product.status === "draft" ? "text-muted-foreground" : "text-accent"}>
                    {product.status ?? "active"}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label={`View ${product.name}`}>
                      <Link href={`/product/${product.slug}`}><Eye className="size-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditProduct(product)} aria-label={`Edit ${product.name}`}>
                      <Edit3 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeProduct(product)} aria-label={`Delete ${product.name}`}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveProduct} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2"><Label htmlFor="product-name">Name</Label><Input id="product-name" value={editor.name} onChange={(event) => updateEditor("name", event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="product-slug">Slug</Label><Input id="product-slug" value={editor.slug} onChange={(event) => updateEditor("slug", event.target.value)} placeholder="Generated from name" /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editor.category} onValueChange={(value) => updateEditor("category", value as ProductCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="product-sku">SKU</Label><Input id="product-sku" value={editor.sku} onChange={(event) => updateEditor("sku", event.target.value)} placeholder="Optional stock code" /></div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-image">Product image</Label>
              <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <div
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-muted bg-cover bg-center"
                  style={editor.imageUrl ? { backgroundImage: `url("${editor.imageUrl.replaceAll('"', "%22")}")` } : undefined}
                >
                  {!editor.imageUrl ? <ImagePlus className="size-8 text-muted-foreground" /> : null}
                </div>
                <div className="flex flex-col justify-center rounded-md border border-dashed p-4">
                  <Input
                    id="product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="cursor-pointer"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(file);
                      event.currentTarget.value = "";
                    }}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">JPEG, PNG, or WebP. Maximum size: 8 MB.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" asChild className="pointer-events-none">
                      <span><Upload className="size-4" />{uploadingImage ? "Uploading..." : editor.imageUrl ? "Choose replacement" : "Choose image"}</span>
                    </Button>
                    {editor.imageUrl ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => updateEditor("imageUrl", "")}>
                        <X className="size-4" />Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="product-description">Description</Label><Textarea id="product-description" value={editor.description} onChange={(event) => updateEditor("description", event.target.value)} required /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="product-details">Details, one per line</Label><Textarea id="product-details" value={editor.details} onChange={(event) => updateEditor("details", event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="product-price">Price (INR)</Label><Input id="product-price" type="number" min="0" step="1" value={editor.price} onChange={(event) => updateEditor("price", event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="product-compare-price">Compare-at price (INR)</Label><Input id="product-compare-price" type="number" min="0" step="1" value={editor.compareAtPrice} onChange={(event) => updateEditor("compareAtPrice", event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="product-stock">Inventory</Label><Input id="product-stock" type="number" min="0" value={editor.inventory} onChange={(event) => updateEditor("inventory", event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="product-color">Color</Label><Input id="product-color" value={editor.color} onChange={(event) => updateEditor("color", event.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="product-rating">Rating</Label><Input id="product-rating" type="number" min="0" max="5" step="0.1" value={editor.rating} onChange={(event) => updateEditor("rating", event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="product-reviews">Review count</Label><Input id="product-reviews" type="number" min="0" value={editor.reviewCount} onChange={(event) => updateEditor("reviewCount", event.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="product-tags">Tags, comma separated</Label><Input id="product-tags" value={editor.tags} onChange={(event) => updateEditor("tags", event.target.value)} /></div>
            <div className="space-y-2">
              <Label>Badge</Label>
              <Select value={editor.badge} onValueChange={(value) => updateEditor("badge", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No badge</SelectItem>
                  <SelectItem value="Best seller">Best seller</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Editor pick">Editor pick</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editor.status} onValueChange={(value) => updateEditor("status", value as "active" | "draft")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={editor.isBestSeller} onChange={(event) => updateEditor("isBestSeller", event.target.checked)} />Best seller</label>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={editor.isNew} onChange={(event) => updateEditor("isNew", event.target.checked)} />New arrival</label>
            {error ? <p role="alert" className="text-sm text-destructive md:col-span-2">{error}</p> : null}
            <div className="flex justify-end gap-2 md:col-span-2">
              <Button type="button" variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving || uploadingImage}>{saving ? "Saving..." : uploadingImage ? "Uploading image..." : "Save product"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
