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
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Riwayat Stok Darah</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Golongan</TableHead>
            <TableHead>Perubahan</TableHead>
            <TableHead>Alasan</TableHead>
            <TableHead>Oleh</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>
                {new Date(log.createdAt).toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="font-medium">{log.golonganDarah}</TableCell>
              <TableCell>
                <Badge variant={log.delta > 0 ? "default" : "destructive"}>
                  {log.delta > 0 ? `+${log.delta}` : log.delta}
                </Badge>
              </TableCell>
              <TableCell>{ALASAN_LABELS[log.alasan] || log.alasan}</TableCell>
              <TableCell>{log.actorId?.nama || "-"}</TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada riwayat perubahan stok.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
