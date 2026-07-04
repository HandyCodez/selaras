import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan } from "@/lib/models";
import { CheckinPanel } from "@/components/petugas/checkin-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { QrCodeIcon, CalendarHeartIcon } from "lucide-react";

export default async function CheckinPage() {
  const session = await requireRole("petugas");
  await connectDB();
  const kegiatanList = JSON.parse(
    JSON.stringify(
      await Kegiatan.find({ cabangId: session.cabangId, status: "aktif" })
        .sort({ tanggalMulai: 1 })
        .lean(),
    ),
  );

  return (
    <div className="space-y-6">
      <PageHeaderIcon
        icon={QrCodeIcon}
        title="Check-in Pendonor"
        description="Pilih kegiatan, lalu pindai QR Code pendonor untuk melakukan check-in."
      />
      {kegiatanList.length === 0 ? (
        <EmptyState
          icon={CalendarHeartIcon}
          title="Belum ada kegiatan aktif"
          description="Buat atau aktifkan kegiatan donor darah terlebih dahulu sebelum bisa melakukan check-in."
        />
      ) : (
        <CheckinPanel kegiatanList={kegiatanList} />
      )}
    </div>
  );
}
