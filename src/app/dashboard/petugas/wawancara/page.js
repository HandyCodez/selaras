import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan } from "@/lib/models";
import { WawancaraPanel } from "@/components/petugas/wawancara-panel";

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
      <h1 className="text-2xl font-semibold">Wawancara Medis</h1>
      <p className="text-muted-foreground">
        Pindai QR Code pendonor yang sudah check-in untuk melakukan wawancara
        kelayakan donor.
      </p>
      <WawancaraPanel kegiatanList={kegiatanList} />
    </div>
  );
}
