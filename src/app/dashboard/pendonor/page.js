import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PendonorHomePage() {
  const user = await requireCurrentUser();
  await connectDB();
  const totalDonor = await Partisipasi.countDocuments({
    donorId: user._id,
    status: "selesai",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {user.nama}</h1>
        <p className="text-muted-foreground">
          Terima kasih telah menjadi pendonor darah.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
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
