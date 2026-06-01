"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  BarChart3, Image, FileText, Settings, ShieldCheck,
  Warehouse, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",   href: "/admin",            icon: LayoutDashboard },
      { label: "Reports",     href: "/admin/reports",    icon: BarChart3 },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products",    href: "/admin/products",   icon: Package },
      { label: "Inventory",   href: "/admin/inventory",  icon: Warehouse },
      { label: "Banners",     href: "/admin/banners",    icon: Image },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders",      href: "/admin/orders",     icon: ShoppingCart },
      { label: "Customers",   href: "/admin/customers",  icon: Users },
      { label: "Coupons",     href: "/admin/coupons",    icon: Tag },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog",        href: "/admin/blog",       icon: FileText },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings",    href: "/admin/settings",   icon: Settings },
      { label: "Admins",      href: "/admin/admins",     icon: ShieldCheck },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen flex flex-col flex-shrink-0 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center text-white text-xs font-bold font-serif"
            style={{ background: "var(--brand-primary)" }}
          >
            P
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-charcoal leading-none">Prakash&apos;s</p>
            <p className="text-[10px] text-muted">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 mb-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon    = item.icon;
                const active  = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm transition-colors group",
                        active
                          ? "bg-brand-light text-brand-primary font-medium"
                          : "text-muted hover:bg-gray-50 hover:text-charcoal"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm text-muted hover:bg-gray-50 hover:text-charcoal transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm text-muted hover:bg-red-50 hover:text-red-500 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
