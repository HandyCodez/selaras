import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailField } from "@/components/shared/detail-field";
import { NotebookPenIcon, ShieldCheckIcon, ShieldAlertIcon } from "lucide-react";
import { KUESIONER_SECTIONS, isQuestionApplicable } from "@/lib/kuesioner-questions";

export default async function KuesionerViewPage({ params }) {
  const { partisipasiId } = await params;
  const session = await requireRole("pendonor");
  await connectDB();

  const partisipasi = await Partisipasi.findOne({
    _id: partisipasiId,
    donorId: session.userId,
  })
    .populate("kegiatanId", "judul")
    .populate("donorId", "pendonor.jenisKelamin")
    .lean();
  if (!partisipasi) notFound();

  const k = partisipasi.kuesioner;
  const hasJawaban = k?.jawaban && Object.keys(k.jawaban).length > 0;
  const jenisKelamin = partisipasi.donorId?.pendonor?.jenisKelamin;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Kuesioner - {partisipasi.kegiatanId?.judul}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasJawaban && typeof k.lolosOtomatis === "boolean" && (
          <div
            className={
              k.lolosOtomatis
                ? "flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950"
                : "flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950"
            }
          >
            {k.lolosOtomatis ? (
              <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : (
              <ShieldAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
            )}
            <div className="text-sm">
              <p className="font-medium">
                {k.lolosOtomatis
                  ? "Lolos skrining awal"
                  : "Perlu perhatian petugas saat wawancara"}
              </p>
              <p className="text-muted-foreground">
                {k.lolosOtomatis
                  ? "Jawaban kuesioner Anda tidak menunjukkan faktor risiko. Kelayakan akhir tetap ditentukan petugas saat wawancara medis."
                  : "Beberapa jawaban Anda menunjukkan kemungkinan faktor risiko. Petugas akan meninjau lebih lanjut saat wawancara medis."}
              </p>
            </div>
          </div>
        )}
        {!hasJawaban ? (
          <p className="text-sm text-muted-foreground">
            Data kuesioner untuk pendaftaran ini menggunakan format lama dan
            tidak dapat ditampilkan di sini.
          </p>
        ) : (
          KUESIONER_SECTIONS.map((section) => {
            const questions = section.questions.filter((q) =>
              isQuestionApplicable(q, jenisKelamin),
            );
            if (questions.length === 0) return null;
            return (
              <div key={section.label} className="space-y-1">
                <h3 className="text-xs font-semibold tracking-wide text-rose-600 uppercase">
                  {section.label}
                </h3>
                <div>
                  {questions.map((q) => (
                    <div key={q.id}>
                      <DetailField
                        label={q.text}
                        value={
                          <Badge variant={k.jawaban[q.id] ? "destructive" : "secondary"}>
                            {k.jawaban[q.id] ? "Ya" : "Tidak"}
                          </Badge>
                        }
                      />
                      {q.hasDetail && k.jawaban[q.id] && k.kehamilanKe && (
                        <DetailField
                          label="Kehamilan keberapa"
                          value={k.kehamilanKe}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <div className="space-y-1">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-rose-600 uppercase">
            <NotebookPenIcon className="size-3.5" />
            Catatan Tambahan
          </h3>
          <p className="text-sm text-muted-foreground">{k?.catatanTambahan || "-"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
