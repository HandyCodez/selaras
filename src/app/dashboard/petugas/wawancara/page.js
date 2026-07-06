import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan } from "@/lib/models";
import { WawancaraPanel } from "@/components/petugas/wawancara-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { pilihKegiatanDefault } from "@/lib/kegiatan";
import { StethoscopeIcon, CalendarHeartIcon } from "lucide-react";

export default async function WawancaraPage() {
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
        icon={StethoscopeIcon}
        title="Wawancara Medis"
        description="Pindai QR Code pendonor yang sudah check-in untuk melakukan wawancara kelayakan donor."
      />
      {kegiatanList.length === 0 ? (
        <EmptyState
          icon={CalendarHeartIcon}
          title="Belum ada kegiatan aktif"
          description="Buat atau aktifkan kegiatan donor darah terlebih dahulu sebelum bisa melakukan wawancara."
        />
      ) : (
        <WawancaraPanel
          kegiatanList={kegiatanList}
          defaultKegiatanId={pilihKegiatanDefault(kegiatanList)?._id}
        />
      )}
    </div>
  );
}
