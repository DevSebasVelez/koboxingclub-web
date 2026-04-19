import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin | KO Boxing Club",
  description: "Panel de administración KO Boxing Club",
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="dark">
      <SidebarProvider>
        <AdminSidebar user={session.user} />
        <SidebarInset className="bg-neutral-950">
          <header className="flex h-14 items-center gap-4 border-b border-neutral-800 px-4">
            <SidebarTrigger className="text-neutral-400 hover:text-white" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
        <Toaster theme="dark" richColors />
      </SidebarProvider>
    </div>
  );
}
