import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getPengirimanDetail } from "@/actions/pengiriman.actions";
import { PengirimanTimeline } from "@/components/shared/pengiriman-timeline";
import { TandaiDikirimButton } from "@/components/petugas/tandai-dikirim-button";
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
  Building2Icon,
  PackageIcon,
  ArrowLeftIcon,
  MapPinIcon,
} from "lucide-react";
import { KOMPONEN_DARAH_SHORT_LABELS } from "@/lib/blood-components";

export default async function PetugasPengirimanDetailPage({ params }) {
  const { id } = await params;
  await requireRole("petugas");

  const pengiriman = await getPengirimanDetail(id);
  if (!pengiriman) notFound();

  const permintaan = pengiriman.permintaanId;
  const rs = pengiriman.rumahSakitId;
  const kantongList = pengiriman.kantongIds ?? [];

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          render={<Link href="/dashboard/petugas/pengiriman" />}
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <PageHeaderIcon
          icon={TruckIcon}
          title={`Pengiriman ${pengiriman.nomorResi}`}
          description={
            <span className="flex items-center gap-1.5 text-sm">
              <MapPinIcon className="size-3.5 shrink-0" />
              {rs?.nama} — {rs?.kota}
            </span>
          }
          action={
            <div className="flex items-center gap-2">
              {permintaan?.urgensi === "mendesak" && (
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

      {/* Action: Tandai Dikirim */}
      {pengiriman.status === "disiapkan" && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <div>
              <p className="text-sm font-medium">Siap dikirim?</p>
              <p className="text-sm text-muted-foreground">
                Klik tombol ini saat darah sudah berangkat menuju rumah sakit.
              </p>
            </div>
            <TandaiDikirimButton pengirimanId={id} />
          </CardContent>
        </Card>
      )}

      {/* Kantong detail */}
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
              Belum ada kantong yang dilampirkan ke pengiriman ini.
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Kantong</TableHead>
                    <TableHead>Pendonor</TableHead>
                    <TableHead>Gol.</TableHead>
                    <TableHead>Komponen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kantongList.map((k) => (
                    <TableRow key={k._id}>
                      <TableCell className="font-mono text-xs">{k.nomorKantong}</TableCell>
                      <TableCell className="text-sm">{k.donorId?.nama ?? "—"}</TableCell>
                      <TableCell className="font-semibold">{k.golonganDarah}</TableCell>
                      <TableCell>
                        {KOMPONEN_DARAH_SHORT_LABELS[k.komponenDarah] ?? k.komponenDarah}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={k.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Info RS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2Icon className="size-4 text-rose-600" />
            Tujuan Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{rs?.nama}</p>
          <p>{rs?.kota}</p>
          <p>{rs?.alamat}</p>
        </CardContent>
      </Card>
    </div>
  );
}
