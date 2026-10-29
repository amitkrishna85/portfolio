import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();

  // If already authenticated, redirect directly to admin dashboard
  if (session?.user) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
