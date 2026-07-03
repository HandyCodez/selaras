"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ROLE_LABELS } from "@/components/layout/role-nav-items";
import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";

export function DashboardSidebar({ role, nama, open, onNavigate }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] || [];
  const initials = nama
    ?.split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <nav
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r bg-zinc-50 p-4 transition-transform duration-200 ease-in-out dark:bg-zinc-900",
        "md:static md:z-auto md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <Link href="/" className="mb-4 flex items-center gap-2 px-1 md:hidden">
        <Image
          src="/logo.jpeg"
          alt="Selaras"
          width={374}
          height={331}
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <span className="font-semibold">Selaras</span>
      </Link>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-medium leading-none">{nama}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="icon" type="submit" title="Keluar">
            <LogOutIcon className="size-4" />
          </Button>
        </form>
      </div>
    </nav>
  );
}
