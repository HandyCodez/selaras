import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function RumahSakitPermintaanDetailPage({ params }) {
  const { id } = await params;
  const user = await requireCurrentUser();
  if (!user.rumahSakit?.rumahSakitId) {
    // Cookies can't be cleared from a Server Component render — throw so
    // dashboard/error.js (a Client Component) can log the user out properly.
    throw new Error("Data akun rumah sakit tidak lengkap.");
  }
  await connectDB();

  const permintaan = await PermintaanDarah.findOne({
    _id: id,
    rumahSakitId: user.rumahSakit.rumahSakitId,
  })
    .populate("cabangId", "nama kota")
    .lean();
  if (!permintaan) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detail Permintaan</h1>
          <p className="text-muted-foreground">
            {permintaan.cabangId?.nama} - {permintaan.cabangId?.kota}
          </p>
        </div>
        <StatusBadge status={permintaan.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Diminta</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Golongan Darah</TableHead>
                <TableHead>Diminta</TableHead>
                <TableHead>Dipenuhi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permintaan.items.map((item) => (
                <TableRow key={item.golonganDarah}>
                  <TableCell>{item.golonganDarah}</TableCell>
                  <TableCell>{item.jumlahDiminta}</TableCell>
                  <TableCell>{item.jumlahDipenuhi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {permintaan.catatan && (
        <Card>
          <CardHeader>
            <CardTitle>Catatan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {permintaan.catatan}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
