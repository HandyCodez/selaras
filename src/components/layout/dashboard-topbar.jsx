"use client";

import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { ROLE_LABELS } from "@/components/layout/role-nav-items";

export function DashboardTopbar({ nama, role, onMenuClick }) {
  const initials = nama
    ?.split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          title="Menu"
        >
          <MenuIcon className="size-5" />
        </Button>
        <span className="font-semibold">Selaras</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden text-sm sm:block">
          <p className="font-medium leading-none">{nama}</p>
          <p className="text-muted-foreground">{ROLE_LABELS[role]}</p>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="icon" type="submit" title="Keluar">
            <LogOutIcon className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
