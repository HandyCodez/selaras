import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getPengirimanByCabang } from "@/actions/pengiriman.actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TruckIcon, ArrowRightIcon } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "disiapkan", label: "Disiapkan" },
  { value: "dikirim", label: "Dikirim" },
  { value: "diterima", label: "Diterima" },
  { value: "selesai", label: "Selesai" },
];

export default async function PetugasPengirimanPage({ searchParams }) {
  const { status } = await searchParams;
  const session = await requireRole("petugas");

  const pengirimanList = await getPengirimanByCabang({
    cabangId: session.cabangId,
    status: status || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeaderIcon
        icon={TruckIcon}
        title="Pengiriman Darah"
        description="Lacak status pengiriman darah ke rumah sakit mitra"
      />

      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status ?? ""}
        baseHref="/dashboard/petugas/pengiriman"
        paramName="status"
      />

      {pengirimanList.length === 0 ? (
        <EmptyState
          icon={TruckIcon}
          title="Belum ada pengiriman"
          description="Pengiriman dibuat setelah permintaan darah dari RS dikonfirmasi."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Resi</TableHead>
                <TableHead>Rumah Sakit</TableHead>
                <TableHead>Jumlah Kantong</TableHead>
                <TableHead>Urgensi</TableHead>
                <TableHead>Tgl. Dibuat</TableHead>
                <TableHead>Tgl. Kirim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pengirimanList.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-mono text-xs">{p.nomorResi}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{p.rumahSakitId?.nama}</div>
                    <div className="text-xs text-muted-foreground">{p.rumahSakitId?.kota}</div>
                  </TableCell>
                  <TableCell>{p.kantongIds?.length ?? 0} kantong</TableCell>
                  <TableCell>
                    {p.permintaanId?.urgensi === "mendesak" ? (
                      <Badge variant="destructive">Mendesak</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Biasa</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(p.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {p.tanggalKirim
                      ? new Date(p.tanggalKirim).toLocaleDateString("id-ID")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      render={<Link href={`/dashboard/petugas/pengiriman/${p._id}`} />}
                      variant="ghost"
                      size="sm"
                    >
                      Detail
                      <ArrowRightIcon className="ml-1 size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
