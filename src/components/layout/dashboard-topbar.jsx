"use client";

import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";
import { ROLE_LABELS } from "@/components/layout/role-nav-items";

export function DashboardTopbar({ nama, role }) {
  const initials = nama
    ?.split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
      <div className="font-semibold">Selaras</div>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
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
