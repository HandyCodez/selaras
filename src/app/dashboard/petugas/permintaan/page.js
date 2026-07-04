import Link from "next/link";
import mongoose from "mongoose";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  ClipboardListIcon,
  TriangleAlertIcon,
  CheckCircle2Icon,
} from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "sebagian", label: "Sebagian" },
  { value: "ditolak", label: "Ditolak" },
  { value: "selesai", label: "Selesai" },
];

export default async function PetugasPermintaanPage({ searchParams }) {
  const { status } = await searchParams;
  const session = await requireRole("petugas");
  await connectDB();
  const filter = { cabangId: session.cabangId };
  if (status) filter.status = status;

  const [permintaanList, [stats]] = await Promise.all([
    PermintaanDarah.find(filter)
      .populate("rumahSakitId", "nama kota")
      .sort({ createdAt: -1 })
      .lean(),
    PermintaanDarah.aggregate([
      { $match: { cabangId: new mongoose.Types.ObjectId(session.cabangId) } },
      {
        $facet: {
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          mendesakMenunggu: [
            { $match: { status: "menunggu", urgensi: "mendesak" } },
            { $count: "count" },
          ],
        },
      },
    ]),
  ]);
  const countByStatus = Object.fromEntries(
    stats.byStatus.map((s) => [s._id, s.count]),
  );
  const menungguCount = countByStatus.menunggu || 0;
  const mendesakCount = stats.mendesakMenunggu[0]?.count || 0;
  const selesaiCount = countByStatus.selesai || 0;

  // Surface what needs attention first: still-pending requests, mendesak
  // ones ahead of biasa within that group.
  permintaanList.sort((a, b) => {
    const pendingA = a.status === "menunggu" ? 0 : 1;
    const pendingB = b.status === "menunggu" ? 0 : 1;
    if (pendingA !== pendingB) return pendingA - pendingB;
    const urgentA = a.urgensi === "mendesak" ? 0 : 1;
    const urgentB = b.urgensi === "mendesak" ? 0 : 1;
    return urgentA - urgentB;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Permintaan Darah</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardListIcon}
          color={menungguCount > 0 ? "amber" : "emerald"}
          label="Menunggu"
          value={menungguCount}
        />
        <StatCard
          icon={TriangleAlertIcon}
          color={mendesakCount > 0 ? "rose" : "emerald"}
          label="Mendesak"
          value={mendesakCount}
        />
        <StatCard icon={CheckCircle2Icon} color="emerald" label="Selesai" value={selesaiCount} />
      </div>

      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status}
        baseHref="/dashboard/petugas/permintaan"
      />

      {permintaanList.length === 0 ? (
        <EmptyState
          icon={ClipboardListIcon}
          title="Belum ada permintaan darah"
          description="Permintaan darah dari rumah sakit akan muncul di sini."
        />
      ) : (
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
              <TableRow
                key={p._id}
                className={
                  p.urgensi === "mendesak" && p.status === "menunggu"
                    ? "bg-destructive/5"
                    : undefined
                }
              >
                <TableCell>{p.rumahSakitId?.nama}</TableCell>
                <TableCell>{p.items.length} golongan darah</TableCell>
                <TableCell>
                  {p.urgensi === "mendesak" ? (
                    <Badge variant="destructive">Mendesak</Badge>
                  ) : (
                    <Badge variant="secondary">Biasa</Badge>
                  )}
                </TableCell>
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
          </TableBody>
        </Table>
      )}
    </div>
  );
}
