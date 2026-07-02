import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

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
        <Field label="Tensi" value={`${w.tensiSistol}/${w.tensiDiastol}`} />
        <Field label="Berat Badan" value={`${w.beratBadan} kg`} />
        <Field label="Hemoglobin" value={`${w.hemoglobin} g/dL`} />
        <Field label="Catatan" value={w.catatan || "-"} />
        <Field
          label="Waktu Wawancara"
          value={new Date(w.interviewedAt).toLocaleString("id-ID")}
        />
      </CardContent>
    </Card>
  );
}
