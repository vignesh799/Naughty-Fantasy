import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("focus-ring inline-flex items-center gap-2 rounded-md", className)}
      aria-label="Naughty Fantasy home"
    >
      <Image
        src="/brand/naughty-fantasy-logo.png"
        alt=""
        width={48}
        height={48}
        sizes="48px"
        className="size-12 shrink-0 rounded-md object-cover shadow-sm"
        priority
      />
      <span className="hidden font-semibold tracking-normal sm:inline">Naughty Fantasy</span>
    </Link>
  );
}
