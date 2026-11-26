import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { getKantongByDonor } from "@/actions/kantong.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { CancelPartisipasiButton } from "@/components/pendonor/cancel-partisipasi-button";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { HistoryIcon } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "menunggu_checkin", label: "Menunggu Check-in" },
  { value: "checked_in", label: "Sudah Check-in" },
  { value: "lolos_donor", label: "Lolos" },
  { value: "tidak_lolos", label: "Tidak Lolos" },
  { value: "selesai", label: "Selesai" },
];

export default async function RiwayatDonorPage({ searchParams }) {
  const { status } = await searchParams;
  const session = await requireRole("pendonor");
  await connectDB();
  const filter = { donorId: session.userId };
  if (status) filter.status = status;

  const [partisipasiList, kantongList] = await Promise.all([
    Partisipasi.find(filter)
      .populate("kegiatanId", "judul lokasi tanggalMulai")
      .sort({ createdAt: -1 })
      .lean(),
    getKantongByDonor(session.userId),
  ]);

  // Index kantong by partisipasiId string for O(1) lookup
  const kantongByPartisipasi = Object.fromEntries(
    kantongList.map((k) => [k.partisipasiId?.toString(), k]),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Riwayat Donor</h1>
      <FilterTabs
        options={STATUS_FILTERS}
        activeValue={status}
        baseHref="/dashboard/pendonor/riwayat"
      />
      {partisipasiList.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Belum ada riwayat donor"
          description="Riwayat pendaftaran dan donor darah Anda akan muncul di sini."
          action={
            <Button render={<Link href="/dashboard/pendonor/kegiatan" />} size="sm">
              Lihat Kegiatan Donor
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kegiatan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>No. Kantong</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {partisipasiList.map((p) => {
              const kantong = kantongByPartisipasi[p._id?.toString()];
              return (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.kegiatanId?.judul}</TableCell>
                  <TableCell>
                    {new Date(p.kegiatanId?.tanggalMulai).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    {kantong ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {kantong.nomorKantong}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="flex flex-wrap justify-end gap-2">
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
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
