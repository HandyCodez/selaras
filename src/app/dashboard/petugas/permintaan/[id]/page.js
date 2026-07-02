import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { getStokByCabang } from "@/actions/stok.actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { PermintaanConfirmPanel } from "@/components/petugas/permintaan-confirm-panel";

export default async function PetugasPermintaanDetailPage({ params }) {
  const { id } = await params;
  const session = await requireRole("petugas");
  await connectDB();

  const permintaan = await PermintaanDarah.findOne({
    _id: id,
    cabangId: session.cabangId,
  })
    .populate("rumahSakitId", "nama kota alamat")
    .lean();
  if (!permintaan) notFound();

  const stok = await getStokByCabang(session.cabangId);
  const stokMap = Object.fromEntries(stok.map((s) => [s.golonganDarah, s.jumlahKantong]));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{permintaan.rumahSakitId?.nama}</h1>
          <p className="text-muted-foreground">{permintaan.rumahSakitId?.alamat}</p>
        </div>
        <StatusBadge status={permintaan.status} />
      </div>

      {permintaan.catatan && (
        <p className="text-sm text-muted-foreground">Catatan: {permintaan.catatan}</p>
      )}

      {permintaan.status === "menunggu" ? (
        <PermintaanConfirmPanel
          permintaan={JSON.parse(JSON.stringify(permintaan))}
          stokMap={stokMap}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Permintaan ini sudah diproses.
        </p>
      )}
    </div>
  );
}
