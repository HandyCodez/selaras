import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, PermintaanDarah, StokDarah } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { formatRentangWaktu } from "@/lib/format";
import {
  ShieldCheckIcon,
  CalendarHeartIcon,
  ClipboardListIcon,
  DropletIcon,
  ArrowRightIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "lucide-react";

export default async function PetugasHomePage() {
  const user = await requireCurrentUser();
  await connectDB();

  const cabangId = user.petugas?.cabangId;
  const [kegiatanAktifList, permintaanMenungguList, totalStok] = await Promise.all([
    Kegiatan.find({ cabangId, status: "aktif" }).sort({ tanggalMulai: 1 }).lean(),
    PermintaanDarah.find({ cabangId, status: "menunggu" })
      .populate("rumahSakitId", "nama kota")
      .sort({ urgensi: -1, createdAt: 1 })
      .lean(),
    StokDarah.aggregate([
      { $match: { cabangId } },
      { $group: { _id: null, total: { $sum: "$jumlahKantong" } } },
    ]),
  ]);
  const kegiatanTerdekat = kegiatanAktifList.slice(0, 3);
  const permintaanPerhatian = permintaanMenungguList.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeaderIcon icon={ShieldCheckIcon} title={`Halo, ${user.nama}`} description="Petugas PMI" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={CalendarHeartIcon}
          color="rose"
          label="Kegiatan Aktif"
          value={kegiatanAktifList.length}
        />
        <StatCard
          icon={ClipboardListIcon}
          color={permintaanMenungguList.length > 0 ? "amber" : "emerald"}
          label="Permintaan Menunggu"
          value={permintaanMenungguList.length}
        />
        <StatCard
          icon={DropletIcon}
          color="sky"
          label="Total Stok Kantong Darah"
          value={totalStok[0]?.total || 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarHeartIcon className="size-4 text-rose-600" />
              Kegiatan Aktif
            </CardTitle>
            <Link
              href="/dashboard/petugas/kegiatan"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat semua
              <ArrowRightIcon className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {kegiatanTerdekat.length === 0 ? (
              <EmptyState
                icon={CalendarHeartIcon}
                title="Belum ada kegiatan aktif"
                className="border-none py-4"
              />
            ) : (
              kegiatanTerdekat.map((k) => (
                <Link
                  key={k._id}
                  href={`/dashboard/petugas/kegiatan/${k._id}`}
                  className="block space-y-1.5 rounded-lg border p-3 transition-colors hover:border-primary"
                >
                  <p className="font-medium">{k.judul}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5 shrink-0" />
                      {k.lokasi}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="size-3.5 shrink-0" />
                      {formatRentangWaktu(k.tanggalMulai, k.tanggalSelesai)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardListIcon className="size-4 text-rose-600" />
              Permintaan Perlu Perhatian
            </CardTitle>
            <Link
              href="/dashboard/petugas/permintaan"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat semua
              <ArrowRightIcon className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {permintaanPerhatian.length === 0 ? (
              <EmptyState
                icon={ClipboardListIcon}
                title="Tidak ada permintaan yang menunggu"
                className="border-none py-4"
              />
            ) : (
              permintaanPerhatian.map((p) => (
                <Link
                  key={p._id}
                  href={`/dashboard/petugas/permintaan/${p._id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-medium">{p.rumahSakitId?.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.items.length} item
                    </p>
                  </div>
                  {p.urgensi === "mendesak" ? (
                    <Badge variant="destructive" className="shrink-0">
                      Mendesak
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      Biasa
                    </Badge>
                  )}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
