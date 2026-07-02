import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi } from "@/lib/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function PendonorKegiatanPage() {
  const session = await requireRole("pendonor");
  await connectDB();

  const kegiatanList = await Kegiatan.find({ status: "aktif" })
    .populate("cabangId", "nama kota")
    .sort({ tanggalMulai: 1 })
    .lean();

  const [partisipasiList, terisiAgg] = await Promise.all([
    Partisipasi.find({
      donorId: session.userId,
      kegiatanId: { $in: kegiatanList.map((k) => k._id) },
    }).lean(),
    Partisipasi.aggregate([
      { $match: { kegiatanId: { $in: kegiatanList.map((k) => k._id) } } },
      { $group: { _id: "$kegiatanId", count: { $sum: 1 } } },
    ]),
  ]);
  const statusByKegiatan = Object.fromEntries(
    partisipasiList.map((p) => [p.kegiatanId.toString(), p.status]),
  );
  const terisiMap = Object.fromEntries(
    terisiAgg.map((t) => [t._id.toString(), t.count]),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Kegiatan Donor Darah</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kegiatanList.map((k) => {
          const status = statusByKegiatan[k._id.toString()];
          const terisi = terisiMap[k._id.toString()] || 0;
          const penuh = terisi >= k.kuota;
          return (
            <Card key={k._id}>
              <CardHeader>
                <CardTitle>{k.judul}</CardTitle>
                <CardDescription>
                  {k.cabangId?.nama} &middot; {k.lokasi}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {new Date(k.tanggalMulai).toLocaleString("id-ID")}
                </p>
                <Badge variant="secondary">
                  {terisi}/{k.kuota} pendonor
                </Badge>
                {status ? (
                  <StatusBadge status={status} />
                ) : penuh ? (
                  <Badge variant="destructive">Kuota Penuh</Badge>
                ) : (
                  <Button
                    render={<Link href={`/dashboard/pendonor/kegiatan/${k._id}`} />}
                    size="sm"
                  >
                    Ikut Donor
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {kegiatanList.length === 0 && (
          <p className="text-muted-foreground">
            Belum ada kegiatan donor darah aktif saat ini.
          </p>
        )}
      </div>
    </div>
  );
}
