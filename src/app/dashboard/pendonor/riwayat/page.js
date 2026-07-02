import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { CancelPartisipasiButton } from "@/components/pendonor/cancel-partisipasi-button";

export default async function RiwayatDonorPage() {
  const session = await requireRole("pendonor");
  await connectDB();

  const partisipasiList = await Partisipasi.find({ donorId: session.userId })
    .populate("kegiatanId", "judul lokasi tanggalMulai")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Riwayat Donor</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kegiatan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {partisipasiList.map((p) => (
            <TableRow key={p._id}>
              <TableCell className="font-medium">{p.kegiatanId?.judul}</TableCell>
              <TableCell>
                {new Date(p.kegiatanId?.tanggalMulai).toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  render={<Link href={`/dashboard/pendonor/kuesioner/${p._id}`} />}
                  variant="ghost"
                  size="sm"
                >
                  Kuesioner
                </Button>
                {p.wawancara && (
                  <Button
                    render={<Link href={`/dashboard/pendonor/wawancara/${p._id}`} />}
                    variant="ghost"
                    size="sm"
                  >
                    Wawancara
                  </Button>
                )}
                {p.status === "menunggu_checkin" && (
                  <CancelPartisipasiButton partisipasiId={p._id.toString()} />
                )}
              </TableCell>
            </TableRow>
          ))}
          {partisipasiList.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Anda belum pernah mendaftar donor darah.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
