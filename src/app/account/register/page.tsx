import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="container-pad flex min-h-[70vh] items-center justify-center py-10">
      <form className="w-full max-w-md rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Profile management hooks can connect to your auth system.</p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" required /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required /></div>
        </div>
        <Button className="mt-6 w-full" type="submit">Register</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-medium text-primary" href="/account/login">Sign in</Link></p>
      </form>
    </div>
  );
}
