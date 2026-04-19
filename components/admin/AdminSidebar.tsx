"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Tag,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/fighters", label: "Peleadores", icon: Users, exact: false },
  { href: "/admin/events", label: "Eventos", icon: CalendarDays, exact: false },
  { href: "/admin/categories", label: "Categorías", icon: Tag, exact: false },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <Sidebar className="border-r border-neutral-800 bg-neutral-900">
      <SidebarHeader className="border-b border-neutral-800 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥊</span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-white text-sm">KO Boxing Club</span>
            <span className="text-xs text-neutral-400">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map(({ href, label, icon: Icon, exact }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-9 w-full rounded-lg px-3 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white",
                      isActive(href, exact) &&
                        "bg-neutral-800 text-white border-l-2 border-[#c11737]",
                    )}
                  >
                    <Link href={href} className="flex items-center gap-3">
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-neutral-400 truncate">{user.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
