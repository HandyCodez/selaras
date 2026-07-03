import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isPendonorProfileComplete, tanggalBolehDonorLagi } from "@/lib/pendonor";
import { TriangleAlertIcon } from "lucide-react";

export default async function PendonorHomePage() {
  const user = await requireCurrentUser();
  await connectDB();
  const [totalDonor, lastDonasi] = await Promise.all([
    Partisipasi.countDocuments({ donorId: user._id, status: "selesai" }),
    Partisipasi.findOne({ donorId: user._id, status: "selesai" })
      .sort({ selesaiAt: -1 })
      .lean(),
  ]);
  const profileComplete = isPendonorProfileComplete(user);
  const eligibleDate = tanggalBolehDonorLagi(lastDonasi?.selesaiAt);
  const belumBolehDonor = eligibleDate && new Date() < eligibleDate;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {user.nama || user.telepon}</h1>
        <p className="text-muted-foreground">
          Terima kasih telah menjadi pendonor darah.
        </p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Golongan Darah
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {user.pendonor?.golonganDarah || "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Donor Selesai
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalDonor}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Donor Berikutnya
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {belumBolehDonor
              ? eligibleDate.toLocaleDateString("id-ID")
              : "Sudah bisa donor"}
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Ingin donor darah?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/dashboard/pendonor/kegiatan" />} className="w-full">
              Lihat Kegiatan Donor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
