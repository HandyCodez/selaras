import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function RumahSakitHomePage() {
  const user = await requireCurrentUser();
  await connectDB();
  const permintaanMenunggu = await PermintaanDarah.countDocuments({
    rumahSakitId: user.rumahSakit?.rumahSakitId,
    status: "menunggu",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {user.nama}</h1>
        <p className="text-muted-foreground">Dashboard Rumah Sakit</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Butuh darah?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              render={<Link href="/dashboard/rumah-sakit/permintaan/baru" />}
              className="w-full"
            >
              Ajukan Permintaan Darah
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
