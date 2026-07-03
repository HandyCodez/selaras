import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi } from "@/lib/models";
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
import { PlusIcon } from "lucide-react";
import { KegiatanStatusActions } from "@/components/petugas/kegiatan-status-actions";
import { DeleteKegiatanButton } from "@/components/petugas/delete-kegiatan-button";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "draft", label: "Draft" },
  { value: "aktif", label: "Aktif" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export default async function PetugasKegiatanPage({ searchParams }) {
  const { status } = await searchParams;
  const session = await requireRole("petugas");
  await connectDB();
  const filter = { cabangId: session.cabangId };
  if (status) filter.status = status;

  const kegiatanList = await Kegiatan.find(filter)
    .sort({ tanggalMulai: -1 })
    .lean();

  const terisiAgg = await Partisipasi.aggregate([
    { $match: { kegiatanId: { $in: kegiatanList.map((k) => k._id) } } },
    { $group: { _id: "$kegiatanId", count: { $sum: 1 } } },
  ]);
  const terisiMap = Object.fromEntries(
    terisiAgg.map((t) => [t._id.toString(), t.count]),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kegiatan Donor Darah</h1>
        <Button render={<Link href="/dashboard/petugas/kegiatan/baru" />}>
          <PlusIcon className="size-4" />
          Buat Kegiatan
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value
                ? `/dashboard/petugas/kegiatan?status=${f.value}`
                : "/dashboard/petugas/kegiatan"
            }
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              (status || "") === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Terisi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Untuk</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {kegiatanList.map((k) => (
            <TableRow key={k._id}>
              <TableCell className="font-medium">{k.judul}</TableCell>
              <TableCell>{k.lokasi}</TableCell>
              <TableCell>{new Date(k.tanggalMulai).toLocaleString("id-ID")}</TableCell>
              <TableCell>
                {terisiMap[k._id.toString()] || 0}/{k.kuota}
              </TableCell>
              <TableCell>
                <StatusBadge status={k.status} />
              </TableCell>
              <TableCell>
                <StatusBadge status={k.tipe} />
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  render={<Link href={`/dashboard/petugas/kegiatan/${k._id}`} />}
                  variant="ghost"
                  size="sm"
                >
                  Detail
                </Button>
                <KegiatanStatusActions kegiatanId={k._id.toString()} status={k.status} />
                <DeleteKegiatanButton
                  kegiatanId={k._id.toString()}
                  kegiatanJudul={k.judul}
                />
              </TableCell>
            </TableRow>
          ))}
          {kegiatanList.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Belum ada kegiatan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
