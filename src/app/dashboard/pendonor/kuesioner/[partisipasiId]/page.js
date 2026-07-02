import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

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
        <Field label="Berat Badan" value={`${k?.beratBadan || "-"} kg`} />
        <Field label="Tekanan Darah" value={k?.tekananDarahDiketahui || "-"} />
        <Field
          label="Sedang Minum Obat"
          value={k?.sedangMinumObat ? `Ya (${k.detailObat || "-"})` : "Tidak"}
        />
        <Field
          label="Donor Terakhir"
          value={
            k?.donorTerakhir
              ? new Date(k.donorTerakhir).toLocaleDateString("id-ID")
              : "-"
          }
        />
        <Field label="Kondisi Sehat" value={k?.kondisiSehat ? "Ya" : "Tidak"} />
        <Field label="Catatan" value={k?.catatanTambahan || "-"} />
      </CardContent>
    </Card>
  );
}
