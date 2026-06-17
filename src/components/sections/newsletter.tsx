import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-12">
      <div className="container-pad luxury-panel rounded-lg border p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Private list</p>
            <h2 className="mt-2 text-2xl font-semibold">Early access to launches and private edits</h2>
            <p className="mt-3 text-muted-foreground">Join for refined product drops, discreet offers, and seasonal styling notes.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" action="/newsletter" aria-label="Newsletter signup">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
