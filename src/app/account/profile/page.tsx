import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="container-pad py-10">
      <h1 className="text-3xl font-semibold">Profile management</h1>
      <form className="mt-6 max-w-2xl rounded-lg border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" /></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="address">Default delivery address</Label><Input id="address" /></div>
        </div>
        <Button className="mt-6" type="submit">Save profile</Button>
      </form>
    </div>
  );
}
