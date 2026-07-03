import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailField } from "@/components/shared/detail-field";
import {
  ScaleIcon,
  HeartPulseIcon,
  PillIcon,
  CalendarIcon,
  ShieldCheckIcon,
  NotebookPenIcon,
} from "lucide-react";

export default async function KuesionerViewPage({ params }) {
  const { partisipasiId } = await params;
  const session = await requireRole("pendonor");
  await connectDB();

  const partisipasi = await Partisipasi.findOne({
    _id: partisipasiId,
    donorId: session.userId,
  })
    .populate("kegiatanId", "judul")
    .lean();
  if (!partisipasi) notFound();

  const k = partisipasi.kuesioner;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Kuesioner - {partisipasi.kegiatanId?.judul}</CardTitle>
      </CardHeader>
      <CardContent>
        <DetailField icon={ScaleIcon} label="Berat Badan" value={`${k?.beratBadan || "-"} kg`} />
        <DetailField
          icon={HeartPulseIcon}
          label="Tekanan Darah"
          value={k?.tekananDarahDiketahui || "-"}
        />
        <DetailField
          icon={PillIcon}
          label="Sedang Minum Obat"
          value={k?.sedangMinumObat ? `Ya (${k.detailObat || "-"})` : "Tidak"}
        />
        <DetailField
          icon={CalendarIcon}
          label="Donor Terakhir"
          value={
            k?.donorTerakhir
              ? new Date(k.donorTerakhir).toLocaleDateString("id-ID")
              : "-"
          }
        />
        <DetailField
          icon={ShieldCheckIcon}
          label="Kondisi Sehat"
          value={k?.kondisiSehat ? "Ya" : "Tidak"}
        />
        <DetailField icon={NotebookPenIcon} label="Catatan" value={k?.catatanTambahan || "-"} />
      </CardContent>
    </Card>
  );
}
