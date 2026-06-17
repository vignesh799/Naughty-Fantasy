import Link from "next/link";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("focus-ring inline-flex items-center gap-2 rounded-md", className)} aria-label="Naughty Fantasy home">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <Sparkle className="size-5" aria-hidden="true" />
      </span>
      <span className="font-semibold tracking-normal">Naughty Fantasy</span>
    </Link>
  );
}
