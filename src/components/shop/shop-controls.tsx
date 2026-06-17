"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/catalog";
import { slugify } from "@/lib/utils";

export function ShopControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <form
        className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          updateParam("q", query);
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search products" />
        </div>
        <Select defaultValue={searchParams.get("category") ?? "all"} onValueChange={(value) => updateParam("category", value)}>
          <SelectTrigger aria-label="Filter by category"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={slugify(category)}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={searchParams.get("sort") ?? "featured"} onValueChange={(value) => updateParam("sort", value)}>
          <SelectTrigger aria-label="Sort products"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="new">New arrivals</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="accent">
          <SlidersHorizontal className="size-4" />
          Apply
        </Button>
      </form>
    </div>
  );
}
