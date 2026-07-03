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
import { CapacityBar } from "@/components/shared/capacity-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { tanggalBolehDonorLagi } from "@/lib/pendonor";
import { formatRentangWaktu } from "@/lib/format";
import { CalendarHeartIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";

export default async function PendonorKegiatanPage() {
  const session = await requireRole("pendonor");
  await connectDB();

  const kegiatanList = await Kegiatan.find({ status: "aktif", tipe: "umum" })
    .populate("cabangId", "nama kota")
    .sort({ tanggalMulai: 1 })
    .lean();

  const [partisipasiList, terisiAgg, lastDonasi] = await Promise.all([
    Partisipasi.find({
      donorId: session.userId,
      kegiatanId: { $in: kegiatanList.map((k) => k._id) },
    }).lean(),
    Partisipasi.aggregate([
      { $match: { kegiatanId: { $in: kegiatanList.map((k) => k._id) } } },
      { $group: { _id: "$kegiatanId", count: { $sum: 1 } } },
    ]),
    Partisipasi.findOne({ donorId: session.userId, status: "selesai" })
      .sort({ selesaiAt: -1 })
      .lean(),
  ]);
  const statusByKegiatan = Object.fromEntries(
    partisipasiList.map((p) => [p.kegiatanId.toString(), p.status]),
  );
  const terisiMap = Object.fromEntries(
    terisiAgg.map((t) => [t._id.toString(), t.count]),
  );
  const eligibleDate = tanggalBolehDonorLagi(lastDonasi?.selesaiAt);
  const belumBolehDonor = eligibleDate && new Date() < eligibleDate;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kegiatan Donor Darah</h1>
        <p className="text-muted-foreground">
          Pilih kegiatan donor darah terdekat dan ikut berpartisipasi.
        </p>
      </div>
      {kegiatanList.length === 0 ? (
        <EmptyState
          icon={CalendarHeartIcon}
          title="Belum ada kegiatan aktif"
          description="Kegiatan donor darah aktif akan muncul di sini. Cek lagi nanti ya."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kegiatanList.map((k) => {
            const status = statusByKegiatan[k._id.toString()];
            const terisi = terisiMap[k._id.toString()] || 0;
            const penuh = terisi >= k.kuota;
            return (
              <Card key={k._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{k.judul}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    {k.cabangId?.nama} &middot; {k.lokasi}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDaysIcon className="size-4 shrink-0" />
                    {formatRentangWaktu(k.tanggalMulai, k.tanggalSelesai)}
                  </div>
                  <CapacityBar terisi={terisi} kuota={k.kuota} />
                  <div>
                    {status ? (
                      <StatusBadge status={status} />
                    ) : penuh ? (
                      <Badge variant="destructive">Kuota Penuh</Badge>
                    ) : belumBolehDonor ? (
                      <Badge variant="outline">
                        Boleh donor mulai {eligibleDate.toLocaleDateString("id-ID")}
                      </Badge>
                    ) : (
                      <Button
                        render={<Link href={`/dashboard/pendonor/kegiatan/${k._id}`} />}
                        size="sm"
                        className="w-full"
                      >
                        Ikut Donor
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
