import Link from "next/link";
import mongoose from "mongoose";
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
import { StatCard } from "@/components/shared/stat-card";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { CapacityBar } from "@/components/shared/capacity-bar";
import { PlusIcon, CalendarHeartIcon, CalendarClockIcon, CheckCircle2Icon } from "lucide-react";
import { KegiatanStatusActions } from "@/components/petugas/kegiatan-status-actions";
import { DeleteKegiatanButton } from "@/components/petugas/delete-kegiatan-button";
import { formatRentangWaktu } from "@/lib/format";

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

  const [kegiatanList, statusCounts] = await Promise.all([
    Kegiatan.find(filter).sort({ tanggalMulai: -1 }).lean(),
    Kegiatan.aggregate([
      { $match: { cabangId: new mongoose.Types.ObjectId(session.cabangId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);
  const countByStatus = Object.fromEntries(
    statusCounts.map((s) => [s._id, s.count]),
  );

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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={CalendarHeartIcon}
          color="rose"
          label="Kegiatan Aktif"
          value={countByStatus.aktif || 0}
        />
        <StatCard
          icon={CalendarClockIcon}
          color="amber"
          label="Draft"
          value={countByStatus.draft || 0}
        />
        <StatCard
          icon={CheckCircle2Icon}
          color="emerald"
          label="Selesai"
          value={countByStatus.selesai || 0}
        />
      </div>

      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status}
        baseHref="/dashboard/petugas/kegiatan"
      />

      {kegiatanList.length === 0 ? (
        <EmptyState
          icon={CalendarHeartIcon}
          title="Belum ada kegiatan"
          description="Kegiatan donor darah yang kamu buat akan muncul di sini."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Waktu</TableHead>
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
                <TableCell>{formatRentangWaktu(k.tanggalMulai, k.tanggalSelesai)}</TableCell>
                <TableCell>
                  <CapacityBar
                    terisi={terisiMap[k._id.toString()] || 0}
                    kuota={k.kuota}
                    className="w-28"
                  />
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
          </TableBody>
        </Table>
      )}
    </div>
  );
}
