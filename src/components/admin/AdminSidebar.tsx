"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, MessageSquare, BarChart3, LogOut, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",     href: "/admin",                icon: LayoutDashboard },
  { label: "Products",      href: "/admin/products",       icon: Package },
  { label: "Orders",        href: "/admin/orders",         icon: ShoppingCart },
  { label: "Categories",    href: "/admin/categories",     icon: Layers },
  { label: "Users",         href: "/admin/users",          icon: Users },
  { label: "Coupons",       href: "/admin/coupons",        icon: Tag },
  { label: "Reviews",       href: "/admin/reviews",        icon: Star },
  { label: "Custom Orders", href: "/admin/custom-orders",  icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-brown text-cream/80 flex flex-col z-40">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-cormorant text-2xl font-semibold text-white">Navkala</h2>
        <p className="text-[10px] tracking-[3px] text-blush uppercase mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                active ? "bg-blush-dark text-white" : "hover:bg-white/10 text-cream/70 hover:text-cream")}>
              <item.icon size={17} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-white/10 hover:text-cream transition-all">
          <BarChart3 size={17} /> View Store
        </Link>
        <button onClick={() => signOut(async () => { window.location.href = "/"; })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
