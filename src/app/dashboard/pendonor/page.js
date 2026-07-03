import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi, Kegiatan, Berita } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { CapacityBar } from "@/components/shared/capacity-bar";
import { isPendonorProfileComplete, tanggalBolehDonorLagi } from "@/lib/pendonor";
import { formatRentangWaktu } from "@/lib/format";
import {
  TriangleAlertIcon,
  DropletIcon,
  AwardIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  HeartPulseIcon,
  CalendarHeartIcon,
  MapPinIcon,
  CalendarDaysIcon,
  NewspaperIcon,
  ArrowRightIcon,
} from "lucide-react";

export default async function PendonorHomePage() {
  const user = await requireCurrentUser();
  await connectDB();
  const [totalDonor, lastDonasi, kegiatanTerdekat, beritaTerbaru] = await Promise.all([
    Partisipasi.countDocuments({ donorId: user._id, status: "selesai" }),
    Partisipasi.findOne({ donorId: user._id, status: "selesai" })
      .sort({ selesaiAt: -1 })
      .lean(),
    Kegiatan.find({
      status: "aktif",
      tipe: "umum",
      tanggalMulai: { $gte: new Date() },
    })
      .populate("cabangId", "nama kota")
      .sort({ tanggalMulai: 1 })
      .limit(3)
      .lean(),
    Berita.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const terisiAgg = kegiatanTerdekat.length
    ? await Partisipasi.aggregate([
        { $match: { kegiatanId: { $in: kegiatanTerdekat.map((k) => k._id) } } },
        { $group: { _id: "$kegiatanId", count: { $sum: 1 } } },
      ])
    : [];
  const terisiMap = Object.fromEntries(terisiAgg.map((t) => [t._id.toString(), t.count]));

  const profileComplete = isPendonorProfileComplete(user);
  const eligibleDate = tanggalBolehDonorLagi(lastDonasi?.selesaiAt);
  const belumBolehDonor = eligibleDate && new Date() < eligibleDate;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
          <HeartPulseIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Halo, {user.nama || user.telepon}</h1>
          <p className="text-muted-foreground">
            Terima kasih telah menjadi pendonor darah.
          </p>
        </div>
      </div>

      {!profileComplete && (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <div className="flex items-center gap-2 text-sm">
              <TriangleAlertIcon className="size-4 shrink-0 text-amber-600" />
              Lengkapi data diri Anda agar bisa mendonorkan darah.
            </div>
            <Button
              render={<Link href="/dashboard/pendonor/lengkapi-profil" />}
              size="sm"
            >
              Lengkapi Sekarang
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={DropletIcon}
          color="rose"
          label="Golongan Darah"
          value={user.pendonor?.golonganDarah || "Belum diketahui"}
        />
        <StatCard
          icon={AwardIcon}
          color="emerald"
          label="Total Donor Selesai"
          value={totalDonor}
        />
        <StatCard
          icon={belumBolehDonor ? CalendarClockIcon : CalendarCheckIcon}
          color={belumBolehDonor ? "amber" : "emerald"}
          label="Donor Berikutnya"
          value={
            belumBolehDonor ? eligibleDate.toLocaleDateString("id-ID") : "Sudah bisa donor"
          }
        />
      </div>

      <Card className="border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40">
        <CardHeader>
          <CardTitle>Siap menyelamatkan nyawa hari ini?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-sm text-muted-foreground">
            Satu kantong darah bisa menyelamatkan hingga tiga nyawa. Cari
            kegiatan donor darah terdekat sekarang.
          </p>
          <Button render={<Link href="/dashboard/pendonor/kegiatan" />}>
            Lihat Kegiatan Donor
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarHeartIcon className="size-4 text-rose-600" />
              Kegiatan Donor Terdekat
            </CardTitle>
            <Link
              href="/dashboard/pendonor/kegiatan"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat semua
              <ArrowRightIcon className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {kegiatanTerdekat.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Belum ada kegiatan donor aktif saat ini.
              </p>
            ) : (
              kegiatanTerdekat.map((k) => (
                <Link
                  key={k._id}
                  href={`/dashboard/pendonor/kegiatan/${k._id}`}
                  className="block space-y-2 rounded-lg border p-3 transition-colors hover:border-primary"
                >
                  <p className="font-medium">{k.judul}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5 shrink-0" />
                      {k.cabangId?.nama} &middot; {k.lokasi}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="size-3.5 shrink-0" />
                      {formatRentangWaktu(k.tanggalMulai, k.tanggalSelesai)}
                    </span>
                  </div>
                  <CapacityBar terisi={terisiMap[k._id.toString()] || 0} kuota={k.kuota} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <NewspaperIcon className="size-4 text-rose-600" />
              Berita Terbaru
            </CardTitle>
            <Link
              href="/berita"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Lihat semua
              <ArrowRightIcon className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {beritaTerbaru.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Belum ada berita seputar donor darah.
              </p>
            ) : (
              beritaTerbaru.map((b) => (
                <Link
                  key={b._id}
                  href={`/berita/${b.slug}`}
                  className="flex items-center gap-3 rounded-lg border p-2 transition-colors hover:border-primary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.coverImage || "/placeholder-berita.svg"}
                    alt={b.judul}
                    className="size-14 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="line-clamp-2 text-sm font-medium">{b.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.publishedAt).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
