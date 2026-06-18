import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-16">
      <div className="container-pad newsletter-stage overflow-hidden rounded-lg border border-[#ff3884]/20 p-6 text-white shadow-2xl md:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#f7be6d]">The private list</p>
            <h2 className="mt-2 text-3xl font-semibold">Invitations, new fantasies, and offers worth opening.</h2>
            <p className="mt-3 text-white/65">Join for private drops, discreet offers, and after-dark inspiration.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" action="/newsletter" aria-label="Newsletter signup">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/55" />
              <Input className="border-white/15 bg-black/35 pl-9 text-white placeholder:text-white/45" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" className="bg-[#ff247a] text-white hover:bg-[#e90061]">Join privately</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
