import {
  NewspaperIcon,
  CalendarHeartIcon,
  HistoryIcon,
  UserRoundIcon,
  QrCodeIcon,
  ScanLineIcon,
  StethoscopeIcon,
  DropletIcon,
  ClipboardListIcon,
  ClipboardCheckIcon,
  HeartHandshakeIcon,
  LayoutDashboardIcon,
  Building2Icon,
  UsersIcon,
} from "lucide-react";

export const NAV_ITEMS = {
  pendonor: [
    { href: "/dashboard/pendonor", label: "Beranda", icon: LayoutDashboardIcon },
    { href: "/syarat-donor", label: "Syarat Donor", icon: ClipboardCheckIcon },
    { href: "/berita", label: "Berita", icon: NewspaperIcon },
    { href: "/komunitas", label: "Komunitas", icon: HeartHandshakeIcon },
    { href: "/dashboard/pendonor/kegiatan", label: "Kegiatan Donor", icon: CalendarHeartIcon },
    { href: "/dashboard/pendonor/stok", label: "Stok Darah", icon: DropletIcon },
    { href: "/dashboard/pendonor/riwayat", label: "Riwayat Donor", icon: HistoryIcon },
    { href: "/dashboard/pendonor/akun", label: "Akun Saya", icon: UserRoundIcon },
  ],
  petugas: [
    { href: "/dashboard/petugas", label: "Beranda", icon: LayoutDashboardIcon },
    { href: "/dashboard/petugas/kegiatan", label: "Kegiatan Donor", icon: CalendarHeartIcon },
    { href: "/dashboard/petugas/checkin", label: "Check-in Pendonor", icon: QrCodeIcon },
    { href: "/dashboard/petugas/wawancara", label: "Wawancara Medis", icon: StethoscopeIcon },
    { href: "/dashboard/petugas/permintaan", label: "Permintaan Darah", icon: ClipboardListIcon },
    { href: "/dashboard/petugas/stok", label: "Stok Darah", icon: DropletIcon },
    { href: "/dashboard/petugas/berita", label: "Kelola Berita", icon: NewspaperIcon },
    { href: "/dashboard/petugas/akun", label: "Akun Saya", icon: UserRoundIcon },
  ],
  rumah_sakit: [
    { href: "/dashboard/rumah-sakit", label: "Beranda", icon: LayoutDashboardIcon },
    { href: "/dashboard/rumah-sakit/permintaan", label: "Permintaan Darah", icon: ScanLineIcon },
    { href: "/dashboard/rumah-sakit/stok", label: "Stok Darah", icon: DropletIcon },
    { href: "/dashboard/rumah-sakit/akun", label: "Akun Saya", icon: UserRoundIcon },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Beranda", icon: LayoutDashboardIcon },
    { href: "/dashboard/admin/cabang", label: "Cabang PMI", icon: Building2Icon },
    { href: "/dashboard/admin/petugas", label: "Petugas PMI", icon: UsersIcon },
  ],
};

export const ROLE_LABELS = {
  pendonor: "Pendonor",
  petugas: "Petugas PMI",
  rumah_sakit: "Rumah Sakit",
  admin: "Admin",
};

export const ACCOUNT_HREF = {
  pendonor: "/dashboard/pendonor/akun",
  petugas: "/dashboard/petugas/akun",
  rumah_sakit: "/dashboard/rumah-sakit/akun",
};
