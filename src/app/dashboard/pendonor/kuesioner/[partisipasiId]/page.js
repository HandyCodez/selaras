import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailField } from "@/components/shared/detail-field";
import { NotebookPenIcon } from "lucide-react";
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
