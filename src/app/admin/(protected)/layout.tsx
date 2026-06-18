import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-card">
        <div className="container-pad flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-5">
            <Logo />
            <span className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:flex">
              <LayoutDashboard className="size-4" />Administrator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link href="/"><Store className="size-4" />View store</Link></Button>
            <form action="/api/admin/logout" method="post">
              <Button variant="ghost" size="sm" type="submit"><LogOut className="size-4" />Logout</Button>
            </form>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
