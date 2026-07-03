import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DetailField } from "@/components/shared/detail-field";
import {
  ActivityIcon,
  ScaleIcon,
  DropletIcon,
  NotebookPenIcon,
  ClockIcon,
} from "lucide-react";

export default async function WawancaraViewPage({ params }) {
  const { partisipasiId } = await params;
  const session = await requireRole("pendonor");
  await connectDB();

  const partisipasi = await Partisipasi.findOne({
    _id: partisipasiId,
    donorId: session.userId,
  })
    .populate("kegiatanId", "judul")
    .lean();
  if (!partisipasi || !partisipasi.wawancara) notFound();

  const w = partisipasi.wawancara;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Hasil Wawancara - {partisipasi.kegiatanId?.judul}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <StatusBadge status={partisipasi.status} />
        </div>
        <DetailField
          icon={ActivityIcon}
          label="Tensi"
          value={`${w.tensiSistol}/${w.tensiDiastol}`}
        />
        <DetailField icon={ScaleIcon} label="Berat Badan" value={`${w.beratBadan} kg`} />
        <DetailField icon={DropletIcon} label="Hemoglobin" value={`${w.hemoglobin} g/dL`} />
        <DetailField icon={NotebookPenIcon} label="Catatan" value={w.catatan || "-"} />
        <DetailField
          icon={ClockIcon}
          label="Waktu Wawancara"
          value={new Date(w.interviewedAt).toLocaleString("id-ID")}
        />
      </CardContent>
    </Card>
  );
}
