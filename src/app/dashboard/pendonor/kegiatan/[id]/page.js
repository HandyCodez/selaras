import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Kegiatan, Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KuesionerForm } from "@/components/forms/kuesioner-form";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { CancelPartisipasiButton } from "@/components/pendonor/cancel-partisipasi-button";

export default async function PendonorKegiatanDetailPage({ params }) {
  const { id } = await params;
  const session = await requireRole("pendonor");
  await connectDB();

  const kegiatan = await Kegiatan.findById(id).populate("cabangId", "nama kota").lean();
  if (!kegiatan) notFound();

  const [partisipasi, terisi] = await Promise.all([
    Partisipasi.findOne({ donorId: session.userId, kegiatanId: id }).lean(),
    Partisipasi.countDocuments({ kegiatanId: id }),
  ]);
  const penuh = terisi >= kegiatan.kuota;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{kegiatan.judul}</h1>
        <p className="text-muted-foreground">
          {kegiatan.cabangId?.nama} &middot; {kegiatan.lokasi} &middot;{" "}
          {new Date(kegiatan.tanggalMulai).toLocaleString("id-ID")}
        </p>
        <Badge variant="secondary" className="mt-2">
          {terisi}/{kegiatan.kuota} pendonor
        </Badge>
      </div>
      {kegiatan.deskripsi && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {kegiatan.deskripsi}
          </CardContent>
        </Card>
      )}

      {partisipasi ? (
        <Card>
          <CardHeader>
            <CardTitle>Status Pendaftaran Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusBadge status={partisipasi.status} />
            {partisipasi.status === "menunggu_checkin" && (
              <CancelPartisipasiButton partisipasiId={partisipasi._id.toString()} />
            )}
          </CardContent>
        </Card>
      ) : penuh ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Kuota pendonor untuk kegiatan ini sudah penuh.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Isi Kuesioner Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            <KuesionerForm kegiatanId={id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
