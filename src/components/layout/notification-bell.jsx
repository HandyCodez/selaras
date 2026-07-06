"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  CalendarHeartIcon,
  DropletIcon,
  StethoscopeIcon,
  ClipboardListIcon,
  Building2Icon,
  UserPlusIcon,
  CheckCheckIcon,
} from "lucide-react";

// Static example notifications, tampilan saja — belum terhubung ke data asli.
const NOTIFIKASI_PER_ROLE = {
  pendonor: [
    {
      icon: CalendarHeartIcon,
      color: "text-rose-600 bg-rose-100 dark:bg-rose-950",
      title: "Kegiatan donor darah baru",
      desc: "Ada kegiatan donor darah baru di cabang PMI dekat Anda.",
      waktu: "10 menit lalu",
      unread: true,
    },
    {
      icon: StethoscopeIcon,
      color: "text-sky-600 bg-sky-100 dark:bg-sky-950",
      title: "Hasil wawancara medis tersedia",
      desc: "Hasil wawancara medis donor terakhir Anda sudah bisa dilihat.",
      waktu: "2 jam lalu",
      unread: true,
    },
    {
      icon: DropletIcon,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
      title: "Anda sudah bisa donor lagi",
      desc: "Sudah 12 minggu sejak donor terakhir Anda.",
      waktu: "1 hari lalu",
      unread: false,
    },
  ],
  petugas: [
    {
      icon: ClipboardListIcon,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-950",
      title: "Permintaan darah baru",
      desc: "RS Harapan Bunda mengajukan permintaan darah mendesak.",
      waktu: "5 menit lalu",
      unread: true,
    },
    {
      icon: DropletIcon,
      color: "text-rose-600 bg-rose-100 dark:bg-rose-950",
      title: "Stok darah menipis",
      desc: "Stok golongan O- di cabang Anda tinggal sedikit.",
      waktu: "1 jam lalu",
      unread: true,
    },
    {
      icon: CalendarHeartIcon,
      color: "text-sky-600 bg-sky-100 dark:bg-sky-950",
      title: "Pendonor menunggu check-in",
      desc: "3 pendonor telah mendaftar untuk kegiatan hari ini.",
      waktu: "3 jam lalu",
      unread: false,
    },
  ],
  rumah_sakit: [
    {
      icon: CheckCheckIcon,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
      title: "Permintaan darah dikonfirmasi",
      desc: "Permintaan darah Anda telah dikonfirmasi oleh PMI.",
      waktu: "20 menit lalu",
      unread: true,
    },
    {
      icon: DropletIcon,
      color: "text-sky-600 bg-sky-100 dark:bg-sky-950",
      title: "Stok darah tersedia",
      desc: "Golongan AB- kini tersedia di cabang PMI langganan Anda.",
      waktu: "4 jam lalu",
      unread: false,
    },
  ],
  admin: [
    {
      icon: UserPlusIcon,
      color: "text-sky-600 bg-sky-100 dark:bg-sky-950",
      title: "Petugas baru ditambahkan",
      desc: "Akun petugas baru berhasil dibuat untuk cabang PMI.",
      waktu: "1 hari lalu",
      unread: true,
    },
    {
      icon: Building2Icon,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
      title: "Cabang PMI baru terdaftar",
      desc: "Satu cabang PMI baru telah ditambahkan ke sistem.",
      waktu: "3 hari lalu",
      unread: false,
    },
  ],
};

export function NotificationBell({ role }) {
  const notifikasi = NOTIFIKASI_PER_ROLE[role] || [];
  const unreadCount = notifikasi.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        title="Notifikasi"
      >
        <BellIcon className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-rose-600" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifikasi</span>
            {unreadCount > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                {unreadCount} belum dibaca
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifikasi.length === 0 ? (
          <p className="px-1.5 py-4 text-center text-sm text-muted-foreground">
            Belum ada notifikasi.
          </p>
        ) : (
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {notifikasi.map((n) => (
              <div
                key={n.title}
                className="flex items-start gap-2.5 rounded-md p-1.5 hover:bg-accent"
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${n.color}`}
                >
                  <n.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.unread && (
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-600" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{n.desc}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{n.waktu}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
