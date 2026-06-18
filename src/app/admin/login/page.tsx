import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = { title: "Administrator Login" };

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");
  return (
    <div className="container-pad flex min-h-[75vh] items-center justify-center py-10">
      <AdminLoginForm />
    </div>
  );
}
