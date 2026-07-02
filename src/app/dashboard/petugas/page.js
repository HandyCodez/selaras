import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, PermintaanDarah, StokDarah } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PetugasHomePage() {
  const user = await requireCurrentUser();
  await connectDB();

  const cabangId = user.petugas?.cabangId;
  const [kegiatanAktif, permintaanMenunggu, totalStok] = await Promise.all([
    Kegiatan.countDocuments({ cabangId, status: "aktif" }),
    PermintaanDarah.countDocuments({ cabangId, status: "menunggu" }),
    StokDarah.aggregate([
      { $match: { cabangId } },
      { $group: { _id: null, total: { $sum: "$jumlahKantong" } } },
    ]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {user.nama}</h1>
        <p className="text-muted-foreground">Petugas PMI</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Kegiatan Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{kegiatanAktif}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Permintaan Menunggu
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {permintaanMenunggu}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Stok Kantong Darah
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {totalStok[0]?.total || 0}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
