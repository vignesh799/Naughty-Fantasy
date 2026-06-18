"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Unable to sign in.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <LockKeyhole className="size-5" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Administrator login</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage products, prices, inventory, and storefront visibility.</p>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Administrator email</Label>
          <Input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
      </div>
      {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
      <Button className="mt-6 w-full" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in to dashboard"}
      </Button>
    </form>
  );
}
