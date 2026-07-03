import { Badge } from "@/components/ui/badge";

const VARIANTS = {
  draft: "secondary",
  aktif: "default",
  selesai: "secondary",
  dibatalkan: "destructive",
  menunggu_checkin: "secondary",
  checked_in: "default",
  lolos_donor: "default",
  tidak_lolos: "destructive",
  menunggu: "secondary",
  dikonfirmasi: "default",
  sebagian: "default",
  ditolak: "destructive",
  draft_berita: "secondary",
  published: "default",
  umum: "secondary",
  internal: "outline",
};

const LABELS = {
  draft: "Draft",
  aktif: "Aktif",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  menunggu_checkin: "Menunggu Check-in",
  checked_in: "Sudah Check-in",
  lolos_donor: "Lolos, Menunggu Donor",
  tidak_lolos: "Tidak Lolos",
  menunggu: "Menunggu",
  dikonfirmasi: "Dikonfirmasi",
  sebagian: "Dipenuhi Sebagian",
  ditolak: "Ditolak",
  published: "Diterbitkan",
  umum: "Umum",
  internal: "Internal",
};

export function StatusBadge({ status }) {
  return (
    <Badge variant={VARIANTS[status] || "secondary"}>
      {LABELS[status] || status}
    </Badge>
  );
}
