import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan } from "@/lib/models";
import { CheckinPanel } from "@/components/petugas/checkin-panel";

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
      <h1 className="text-2xl font-semibold">Check-in Pendonor</h1>
      <p className="text-muted-foreground">
        Pilih kegiatan, lalu pindai QR Code pendonor untuk melakukan check-in.
      </p>
      <CheckinPanel kegiatanList={kegiatanList} />
    </div>
  );
}
