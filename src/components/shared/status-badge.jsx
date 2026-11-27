import { Badge } from "@/components/ui/badge";

const VARIANTS = {
  // kegiatan
  draft: "secondary",
  aktif: "default",
  selesai: "secondary",
  dibatalkan: "destructive",
  // partisipasi
  menunggu_checkin: "secondary",
  checked_in: "default",
  lolos_donor: "default",
  tidak_lolos: "destructive",
  // permintaan
  menunggu: "secondary",
  dikonfirmasi: "default",
  sebagian: "default",
  ditolak: "destructive",
  // berita
  draft_berita: "secondary",
  published: "default",
  // kegiatan tipe
  umum: "secondary",
  internal: "outline",
  // kantong darah (new lifecycle)
  tersedia: "default",
  dialokasikan: "default",
  dalam_pengiriman: "default",
  diterima_rs: "default",
  digunakan: "secondary",
  dikembalikan: "outline",
  terpakai: "secondary",
  kadaluarsa: "destructive",
  dibuang: "outline",
  // pengiriman
  disiapkan: "secondary",
  dikirim: "default",
  diterima: "default",
};

const LABELS = {
  // kegiatan
  draft: "Draft",
  aktif: "Aktif",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  // partisipasi
  menunggu_checkin: "Menunggu Check-in",
  checked_in: "Sudah Check-in",
  lolos_donor: "Lolos, Menunggu Donor",
  tidak_lolos: "Tidak Lolos",
  // permintaan
  menunggu: "Menunggu",
  dikonfirmasi: "Dikonfirmasi",
  sebagian: "Dipenuhi Sebagian",
  ditolak: "Ditolak",
  // berita
  published: "Diterbitkan",
  // kegiatan tipe
  umum: "Umum",
  internal: "Internal",
  // kantong darah (new lifecycle)
  tersedia: "Tersedia",
  dialokasikan: "Dialokasikan",
  dalam_pengiriman: "Dalam Pengiriman",
  diterima_rs: "Diterima RS",
  digunakan: "Digunakan",
  dikembalikan: "Dikembalikan",
  terpakai: "Terpakai",
  kadaluarsa: "Kadaluarsa",
  dibuang: "Dibuang",
  // pengiriman
  disiapkan: "Disiapkan",
  dikirim: "Sedang Dikirim",
  diterima: "Diterima",
};

export function StatusBadge({ status }) {
  return (
    <Badge variant={VARIANTS[status] || "secondary"}>
      {LABELS[status] || status}
    </Badge>
  );
}
