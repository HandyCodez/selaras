import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function PetugasPermintaanPage() {
  const session = await requireRole("petugas");
  await connectDB();
  const permintaanList = await PermintaanDarah.find({ cabangId: session.cabangId })
    .populate("rumahSakitId", "nama kota")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Permintaan Darah</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rumah Sakit</TableHead>
            <TableHead>Jumlah Item</TableHead>
            <TableHead>Urgensi</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {permintaanList.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.rumahSakitId?.nama}</TableCell>
              <TableCell>{p.items.length} golongan darah</TableCell>
              <TableCell className="capitalize">{p.urgensi}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell>
                <Button
                  render={<Link href={`/dashboard/petugas/permintaan/${p._id}`} />}
                  variant="ghost"
                  size="sm"
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {permintaanList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada permintaan darah dari rumah sakit.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
