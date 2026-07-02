import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi } from "@/lib/models";
import { Button } from "@/components/ui/button";
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
import { KegiatanStatusActions } from "@/components/petugas/kegiatan-status-actions";

export default async function KegiatanDetailPage({ params }) {
  const { id } = await params;
  const session = await requireRole("petugas");
  await connectDB();

  const kegiatan = await Kegiatan.findOne({
    _id: id,
    cabangId: session.cabangId,
  }).lean();
  if (!kegiatan) notFound();

  const partisipasiList = await Partisipasi.find({ kegiatanId: id })
    .populate("donorId", "nama telepon")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{kegiatan.judul}</h1>
          <p className="text-muted-foreground">
            {kegiatan.lokasi} &middot;{" "}
            {new Date(kegiatan.tanggalMulai).toLocaleString("id-ID")} &middot; Kuota{" "}
            {partisipasiList.length}/{kegiatan.kuota}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={kegiatan.status} />
          <KegiatanStatusActions kegiatanId={id} status={kegiatan.status} />
          <Button
            render={<Link href={`/dashboard/petugas/kegiatan/${id}/edit`} />}
            variant="outline"
          >
            Edit
          </Button>
        </div>
      </div>

      {kegiatan.deskripsi && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {kegiatan.deskripsi}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Peserta ({partisipasiList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partisipasiList.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.donorId?.nama}</TableCell>
                  <TableCell>{p.donorId?.telepon}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
              {partisipasiList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Belum ada pendonor yang mendaftar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
