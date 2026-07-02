"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/role-nav-items";

export function DashboardSidebar({ role, jabatan }) {
  const pathname = usePathname();
  const items = (NAV_ITEMS[role] || []).filter(
    (item) => !item.dokterOnly || jabatan === "dokter",
  );

  return (
    <nav className="flex w-64 shrink-0 flex-col gap-1 border-r bg-zinc-50/50 p-4 dark:bg-zinc-900/50">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
