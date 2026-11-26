import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { StokDarahLog } from "@/lib/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { HistoryIcon } from "lucide-react";
import { KOMPONEN_DARAH_LABELS } from "@/lib/blood-components";

const ALASAN_LABELS = {
  donasi_selesai: "Donor Selesai",
  permintaan_dipenuhi: "Permintaan Dipenuhi",
  koreksi_manual: "Koreksi Manual",
};

export default async function RiwayatStokPage() {
  const session = await requireRole("petugas");
  await connectDB();

  const logs = await StokDarahLog.find({ cabangId: session.cabangId })
    .populate("actorId", "nama")
    .populate({
      path: "kantongId",
      select: "nomorKantong donorId",
      populate: { path: "donorId", select: "nama" },
    })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeaderIcon icon={HistoryIcon} title="Riwayat Stok Darah" />
      {logs.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Belum ada riwayat perubahan stok"
          description="Setiap penambahan atau pengurangan stok darah akan tercatat di sini."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Golongan</TableHead>
                <TableHead>Komponen</TableHead>
                <TableHead>Perubahan</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>No. Kantong</TableHead>
                <TableHead>Pendonor</TableHead>
                <TableHead>Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-sm">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium">{log.golonganDarah}</TableCell>
                  <TableCell>{KOMPONEN_DARAH_LABELS[log.komponenDarah] || log.komponenDarah}</TableCell>
                  <TableCell>
                    <Badge variant={log.delta > 0 ? "default" : "destructive"}>
                      {log.delta > 0 ? `+${log.delta}` : log.delta}
                    </Badge>
                  </TableCell>
                  <TableCell>{ALASAN_LABELS[log.alasan] || log.alasan}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.kantongId?.nomorKantong ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.kantongId?.donorId?.nama ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">{log.actorId?.nama || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
