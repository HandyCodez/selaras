import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { PermintaanDarah } from "@/lib/models";
import { getStokMapByCabang } from "@/actions/stok.actions";
import { getKantongByPermintaan } from "@/actions/kantong.actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { DetailField } from "@/components/shared/detail-field";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermintaanConfirmPanel } from "@/components/petugas/permintaan-confirm-panel";
import { Building2Icon, MapPinIcon, NotebookPenIcon, PackageIcon } from "lucide-react";
import { KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

export default async function PetugasPermintaanDetailPage({ params }) {
  const { id } = await params;
  const session = await requireRole("petugas");
  await connectDB();

  const permintaan = await PermintaanDarah.findOne({
    _id: id,
    cabangId: session.cabangId,
  })
    .populate("rumahSakitId", "nama kota alamat")
    .lean();
  if (!permintaan) notFound();

  const [stokMap, kantongList] = await Promise.all([
    getStokMapByCabang(session.cabangId),
    getKantongByPermintaan(id),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeaderIcon
        icon={Building2Icon}
        title={permintaan.rumahSakitId?.nama}
        description={
          <span className="flex items-center gap-1.5 text-sm">
            <MapPinIcon className="size-3.5 shrink-0" />
            {permintaan.rumahSakitId?.alamat}
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            {permintaan.urgensi === "mendesak" && (
              <Badge variant="destructive">Mendesak</Badge>
            )}
            <StatusBadge status={permintaan.status} />
          </div>
        }
      />

      {permintaan.catatan && (
        <Card>
          <CardContent className="pt-6">
            <DetailField
              icon={NotebookPenIcon}
              label="Catatan RS"
              value={permintaan.catatan}
            />
          </CardContent>
        </Card>
      )}

      {permintaan.status === "menunggu" ? (
        <PermintaanConfirmPanel
          permintaan={JSON.parse(JSON.stringify(permintaan))}
          stokMap={stokMap}
        />
      ) : (
        <Card>
          <CardContent className="space-y-1 pt-6">
            <p className="text-sm text-muted-foreground">Permintaan ini sudah diproses.</p>
            {permintaan.catatanPetugas && (
              <DetailField
                icon={NotebookPenIcon}
                label="Catatan Anda"
                value={permintaan.catatanPetugas}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Kantong darah yang digunakan untuk memenuhi permintaan ini */}
      {kantongList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PackageIcon className="size-4 text-rose-600" />
              Kantong Darah Digunakan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Kantong</TableHead>
                    <TableHead>Pendonor</TableHead>
                    <TableHead>Gol.</TableHead>
                    <TableHead>Komponen</TableHead>
                    <TableHead>Tgl. Donor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kantongList.map((k) => (
                    <TableRow key={k._id}>
                      <TableCell className="font-mono text-xs">{k.nomorKantong}</TableCell>
                      <TableCell className="text-sm">{k.donorId?.nama ?? "—"}</TableCell>
                      <TableCell className="font-semibold">{k.golonganDarah}</TableCell>
                      <TableCell>{KOMPONEN_DARAH_SHORT_LABELS[k.komponenDarah] ?? k.komponenDarah}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(k.tanggalDonor).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
