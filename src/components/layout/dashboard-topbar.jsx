"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, UserRoundIcon, LogOutIcon } from "lucide-react";
import { ROLE_LABELS, ACCOUNT_HREF } from "@/components/layout/role-nav-items";

export function DashboardTopbar({ nama, role, onMenuClick }) {
  const [, startTransition] = useTransition();
  const initials = nama
    ?.split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  const accountHref = ACCOUNT_HREF[role];

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
        <Image
          src="/logo.jpeg"
          alt="Selaras"
          width={374}
          height={331}
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <span className="font-semibold">Selaras</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left text-sm sm:block">
            <p className="font-medium leading-none">{nama}</p>
            <p className="text-muted-foreground">{ROLE_LABELS[role]}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <p className="font-medium">{nama}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {ROLE_LABELS[role]}
              </p>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {accountHref && (
            <DropdownMenuLinkItem render={<Link href={accountHref} />}>
              <UserRoundIcon />
              Akun Saya
            </DropdownMenuLinkItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => startTransition(() => logout())}
          >
            <LogOutIcon />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
