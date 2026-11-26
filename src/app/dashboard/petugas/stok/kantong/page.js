import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getKantongByCabang } from "@/actions/kantong.actions";
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
import { PackageIcon, ArrowLeftIcon } from "lucide-react";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "tersedia", label: "Tersedia" },
  { value: "terpakai", label: "Terpakai" },
  { value: "kadaluarsa", label: "Kadaluarsa" },
  { value: "dibuang", label: "Dibuang" },
];

const GOLONGAN_FILTERS = [
  { value: "", label: "Semua Gol." },
  ...GOLONGAN_DARAH.map((g) => ({ value: g, label: g })),
];

function isNearExpiry(tanggalKadaluarsa) {
  const diff = new Date(tanggalKadaluarsa) - new Date();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
}

export default async function KantongDarahPage({ searchParams }) {
  const { status, golongan, komponen } = await searchParams;
  const session = await requireRole("petugas");

  const { kantongList, total } = await getKantongByCabang({
    cabangId: session.cabangId,
    golonganDarah: golongan,
    komponenDarah: komponen,
    status,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/dashboard/petugas/stok" />}
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <PageHeaderIcon
          icon={PackageIcon}
          title="Kantong Darah"
          description={`${total} kantong tercatat`}
        />
      </div>

      {/* Status filter */}
      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status ?? ""}
        baseHref="/dashboard/petugas/stok/kantong"
        paramName="status"
        extraParams={
          Object.fromEntries(
            [golongan && ["golongan", golongan], komponen && ["komponen", komponen]].filter(Boolean),
          )
        }
      />

      {/* Golongan filter */}
      <FilterTabs
        options={GOLONGAN_FILTERS}
        activeValue={golongan ?? ""}
        baseHref="/dashboard/petugas/stok/kantong"
        paramName="golongan"
        extraParams={
          Object.fromEntries(
            [status && ["status", status], komponen && ["komponen", komponen]].filter(Boolean),
          )
        }
      />

      {kantongList.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="Belum ada kantong darah"
          description="Kantong darah akan muncul di sini setelah ada donasi yang selesai."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kantong</TableHead>
                <TableHead>Pendonor</TableHead>
                <TableHead>Gol.</TableHead>
                <TableHead>Komponen</TableHead>
                <TableHead>Tgl. Donor</TableHead>
                <TableHead>Kedaluarsa</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kantongList.map((k) => {
                const nearExpiry = k.status === "tersedia" && isNearExpiry(k.tanggalKadaluarsa);
                return (
                  <TableRow key={k._id} className={nearExpiry ? "bg-amber-50/60 dark:bg-amber-950/20" : ""}>
                    <TableCell className="font-mono text-xs">
                      {k.nomorKantong}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {k.donorId?.nama || "—"}
                      </div>
                      {k.donorId?.pendonor?.nik && (
                        <div className="text-xs text-muted-foreground">
                          NIK: {k.donorId.pendonor.nik}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">{k.golonganDarah}</TableCell>
                    <TableCell>{KOMPONEN_DARAH_SHORT_LABELS[k.komponenDarah] ?? k.komponenDarah}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(k.tanggalDonor).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={nearExpiry ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>
                        {new Date(k.tanggalKadaluarsa).toLocaleDateString("id-ID")}
                      </span>
                      {nearExpiry && (
                        <Badge variant="outline" className="ml-1.5 border-amber-400 text-amber-600 text-xs dark:border-amber-500 dark:text-amber-400">
                          Hampir Exp
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={k.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
