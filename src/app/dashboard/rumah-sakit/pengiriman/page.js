import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { getPengirimanByRumahSakit } from "@/actions/pengiriman.actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TruckIcon, ArrowRightIcon } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "disiapkan", label: "Disiapkan" },
  { value: "dikirim", label: "Dikirim" },
  { value: "diterima", label: "Diterima" },
  { value: "selesai", label: "Selesai" },
];

export default async function RumahSakitPengirimanPage({ searchParams }) {
  const { status } = await searchParams;
  const user = await requireCurrentUser();
  if (!user.rumahSakit?.rumahSakitId) {
    throw new Error("Data akun rumah sakit tidak lengkap.");
  }

  const pengirimanList = await getPengirimanByRumahSakit({
    rumahSakitId: user.rumahSakit.rumahSakitId.toString(),
    status: status || undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeaderIcon
        icon={TruckIcon}
        title="Pengiriman Masuk"
        description="Lacak pengiriman darah dari PMI ke rumah sakit Anda"
      />

      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status ?? ""}
        baseHref="/dashboard/rumah-sakit/pengiriman"
        paramName="status"
      />

      {pengirimanList.length === 0 ? (
        <EmptyState
          icon={TruckIcon}
          title="Belum ada pengiriman"
          description="Pengiriman akan muncul setelah permintaan darah Anda dikonfirmasi dan dikirim oleh PMI."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Resi</TableHead>
                <TableHead>Cabang PMI</TableHead>
                <TableHead>Jumlah Kantong</TableHead>
                <TableHead>Urgensi</TableHead>
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
                    <div className="text-sm font-medium">{p.cabangId?.nama}</div>
                    <div className="text-xs text-muted-foreground">{p.cabangId?.kota}</div>
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
                    {p.tanggalKirim
                      ? new Date(p.tanggalKirim).toLocaleDateString("id-ID")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      render={
                        <Link href={`/dashboard/rumah-sakit/pengiriman/${p._id}`} />
                      }
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
