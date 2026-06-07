import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-[#faf8f6]">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">{children}</main>
    </div>
  );
}
