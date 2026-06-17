"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";

export function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const results = searchProducts(query).slice(0, 6);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search lingerie, wellness, accessories..." />
        </div>
        <div className="space-y-2">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => onOpenChange(false)}
              className="focus-ring flex items-center justify-between rounded-md p-3 hover:bg-muted"
            >
              <span>
                <span className="block font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </span>
              <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
