import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PmiCabang, User } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHomePage() {
  const user = await getCurrentUser();
  await connectDB();

  const [totalCabang, totalPetugas] = await Promise.all([
    PmiCabang.countDocuments({ isActive: true }),
    User.countDocuments({ role: "petugas", isActive: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {user.nama}</h1>
        <p className="text-muted-foreground">Administrator Selaras</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Cabang PMI Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalCabang}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Petugas Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalPetugas}</CardContent>
        </Card>
      </div>
    </div>
  );
}
