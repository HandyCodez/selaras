import Link from "next/link";
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
import { cn } from "@/lib/utils";

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

  const permintaanList = await PermintaanDarah.find(filter)
    .populate("rumahSakitId", "nama kota")
    .sort({ createdAt: -1 })
    .lean();

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
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value
                ? `/dashboard/petugas/permintaan?status=${f.value}`
                : "/dashboard/petugas/permintaan"
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
