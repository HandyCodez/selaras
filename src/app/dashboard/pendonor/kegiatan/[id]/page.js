import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi, User } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KuesionerForm } from "@/components/forms/kuesioner-form";
import { StatusBadge } from "@/components/shared/status-badge";
import { CapacityBar } from "@/components/shared/capacity-bar";
import { Button } from "@/components/ui/button";
import { CancelPartisipasiButton } from "@/components/pendonor/cancel-partisipasi-button";
import { isPendonorProfileComplete, tanggalBolehDonorLagi } from "@/lib/pendonor";
import { formatRentangWaktu } from "@/lib/format";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  CalendarClockIcon,
  ClipboardListIcon,
} from "lucide-react";

export default async function PendonorKegiatanDetailPage({ params }) {
  const { id } = await params;
  const session = await requireRole("pendonor");
  await connectDB();

  const kegiatan = await Kegiatan.findById(id).populate("cabangId", "nama kota").lean();
  if (!kegiatan) notFound();

  const [donor, partisipasi, terisi, lastDonasi] = await Promise.all([
    User.findById(session.userId).lean(),
    Partisipasi.findOne({ donorId: session.userId, kegiatanId: id }).lean(),
    Partisipasi.countDocuments({ kegiatanId: id }),
    Partisipasi.findOne({ donorId: session.userId, status: "selesai" })
      .sort({ selesaiAt: -1 })
      .lean(),
  ]);
  const penuh = terisi >= kegiatan.kuota;
  const profileComplete = isPendonorProfileComplete(donor);
  const eligibleDate = tanggalBolehDonorLagi(lastDonasi?.selesaiAt);
  const belumBolehDonor = eligibleDate && new Date() < eligibleDate;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{kegiatan.judul}</h1>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPinIcon className="size-4 shrink-0" />
            {kegiatan.cabangId?.nama} &middot; {kegiatan.lokasi}
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarDaysIcon className="size-4 shrink-0" />
            {formatRentangWaktu(kegiatan.tanggalMulai, kegiatan.tanggalSelesai)}
          </p>
        </div>
        <CapacityBar terisi={terisi} kuota={kegiatan.kuota} className="mt-3 max-w-xs" />
      </div>
      {kegiatan.deskripsi && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {kegiatan.deskripsi}
          </CardContent>
        </Card>
      )}

      {partisipasi ? (
        <Card>
          <CardHeader>
            <CardTitle>Status Pendaftaran Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusBadge status={partisipasi.status} />
            {partisipasi.status === "menunggu_checkin" && (
              <CancelPartisipasiButton partisipasiId={partisipasi._id.toString()} />
            )}
          </CardContent>
        </Card>
      ) : penuh ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Kuota pendonor untuk kegiatan ini sudah penuh.
          </CardContent>
        </Card>
      ) : !profileComplete ? (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircleIcon className="size-5 text-amber-600" />
              Lengkapi Data Diri Dahulu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Sebelum bisa mendaftar donor darah, lengkapi data diri Anda
              terlebih dahulu.
            </p>
            <Button render={<Link href="/dashboard/pendonor/lengkapi-profil" />}>
              Lengkapi Data Diri
            </Button>
          </CardContent>
        </Card>
      ) : belumBolehDonor ? (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClockIcon className="size-5 text-amber-600" />
              Belum Boleh Donor
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Jarak minimal antar donor darah adalah 12 minggu. Anda baru bisa
            donor lagi mulai{" "}
            <span className="font-medium text-foreground">
              {eligibleDate.toLocaleDateString("id-ID")}
            </span>
            .
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardListIcon className="size-5 text-rose-600" />
              Isi Kuesioner Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KuesionerForm
              kegiatanId={id}
              jenisKelamin={donor.pendonor?.jenisKelamin}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
