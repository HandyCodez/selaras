import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { getPengirimanDetail } from "@/actions/pengiriman.actions";
import { PengirimanTimeline } from "@/components/shared/pengiriman-timeline";
import { KonfirmasiTerimaButton } from "@/components/rumah-sakit/konfirmasi-terima-button";
import { TandaiDigunakanButton } from "@/components/rumah-sakit/tandai-digunakan-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeaderIcon } from "@/components/shared/page-header-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TruckIcon,
  PackageIcon,
  ArrowLeftIcon,
  Building2Icon,
} from "lucide-react";
import { KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

export default async function RumahSakitPengirimanDetailPage({ params }) {
  const { id } = await params;
  const user = await requireCurrentUser();
  if (!user.rumahSakit?.rumahSakitId) {
    throw new Error("Data akun rumah sakit tidak lengkap.");
  }

  const pengiriman = await getPengirimanDetail(id);
  // Guard: ensure this shipment belongs to this RS
  if (
    !pengiriman ||
    pengiriman.rumahSakitId?._id?.toString() !==
      user.rumahSakit.rumahSakitId.toString()
  ) {
    notFound();
  }

  const cabang = pengiriman.cabangId;
  const kantongList = pengiriman.kantongIds ?? [];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/dashboard/rumah-sakit/pengiriman" />}
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <PageHeaderIcon
          icon={TruckIcon}
          title={`Pengiriman ${pengiriman.nomorResi}`}
          description={`Dari ${cabang?.nama} — ${cabang?.kota}`}
          action={
            <div className="flex items-center gap-2">
              {pengiriman.permintaanId?.urgensi === "mendesak" && (
                <Badge variant="destructive">Mendesak</Badge>
              )}
              <StatusBadge status={pengiriman.status} />
            </div>
          }
        />
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TruckIcon className="size-4 text-rose-600" />
            Lacak Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PengirimanTimeline
            pengiriman={JSON.parse(JSON.stringify(pengiriman))}
            createdAt={pengiriman.createdAt}
          />
        </CardContent>
      </Card>

      {/* Action: Konfirmasi Terima */}
      {pengiriman.status === "dikirim" && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <div>
              <p className="text-sm font-medium">Darah sudah tiba?</p>
              <p className="text-sm text-muted-foreground">
                Konfirmasi penerimaan setelah darah tiba di rumah sakit Anda.
              </p>
            </div>
            <KonfirmasiTerimaButton pengirimanId={id} />
          </CardContent>
        </Card>
      )}

      {/* Kantong + Tandai Digunakan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PackageIcon className="size-4 text-rose-600" />
            Daftar Kantong ({kantongList.length})
          </CardTitle>
        </CardHeader>
        {kantongList.length === 0 ? (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Belum ada kantong dalam pengiriman ini.
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Kantong</TableHead>
                    <TableHead>Nama Pendonor</TableHead>
                    <TableHead>Gol.</TableHead>
                    <TableHead>Komponen</TableHead>
                    <TableHead>Status</TableHead>
                    {pengiriman.status === "diterima" && <TableHead />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kantongList.map((k) => (
                    <TableRow key={k._id}>
                      <TableCell className="font-mono text-xs">{k.nomorKantong}</TableCell>
                      {/* RS only sees donor name, not NIK/phone */}
                      <TableCell className="text-sm">{k.donorId?.nama ?? "—"}</TableCell>
                      <TableCell className="font-semibold">{k.golonganDarah}</TableCell>
                      <TableCell>
                        {KOMPONEN_DARAH_SHORT_LABELS[k.komponenDarah] ?? k.komponenDarah}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={k.status} />
                      </TableCell>
                      {pengiriman.status === "diterima" && (
                        <TableCell>
                          {k.status === "diterima_rs" && (
                            <TandaiDigunakanButton kantongId={k._id.toString()} />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Info Cabang PMI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2Icon className="size-4 text-rose-600" />
            Dikirim dari
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{cabang?.nama}</p>
          <p>{cabang?.kota}</p>
          <p>{cabang?.alamat}</p>
          {cabang?.telepon && <p>Telp: {cabang.telepon}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
