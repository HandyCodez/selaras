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
import { CapacityBar } from "@/components/shared/capacity-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { KegiatanStatusActions } from "@/components/petugas/kegiatan-status-actions";
import { CopyKegiatanLink } from "@/components/petugas/copy-kegiatan-link";
import { formatRentangWaktu } from "@/lib/format";
import { MapPinIcon, CalendarDaysIcon, UsersIcon, LinkIcon } from "lucide-react";

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{kegiatan.judul}</h1>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <MapPinIcon className="size-4 shrink-0" />
              {kegiatan.lokasi}
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarDaysIcon className="size-4 shrink-0" />
              {formatRentangWaktu(kegiatan.tanggalMulai, kegiatan.tanggalSelesai)}
            </p>
          </div>
          <CapacityBar
            terisi={partisipasiList.length}
            kuota={kegiatan.kuota}
            className="mt-3 max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={kegiatan.status} />
          <StatusBadge status={kegiatan.tipe} />
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
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="size-4 text-rose-600" />
            Link Kegiatan untuk Pendonor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CopyKegiatanLink kegiatanId={id} />
          {kegiatan.tipe === "internal" && (
            <p className="text-xs text-muted-foreground">
              Kegiatan ini bertipe Internal — tidak muncul di daftar kegiatan
              yang dilihat pendonor. Bagikan link ini secara langsung ke
              pendonor yang dituju.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="size-4 text-rose-600" />
            Peserta ({partisipasiList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {partisipasiList.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="Belum ada pendonor yang mendaftar"
              description="Peserta yang mendaftar untuk kegiatan ini akan muncul di sini."
            />
          ) : (
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
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
