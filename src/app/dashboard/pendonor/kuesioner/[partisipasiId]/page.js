import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partisipasi } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailField } from "@/components/shared/detail-field";
import {
  ArrowLeftIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
} from "lucide-react";
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
  const hasHasil = hasJawaban && typeof k.lolosOtomatis === "boolean";
  const jenisKelamin = partisipasi.donorId?.pendonor?.jenisKelamin;

  return (
    <div className="max-w-xl space-y-4">
      <Link
        href={`/dashboard/pendonor/kegiatan/${partisipasi.kegiatanId?._id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" />
        Kembali ke Kegiatan
      </Link>

      {hasHasil && (
        <Card
          className={
            k.lolosOtomatis
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950"
              : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
          }
        >
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <div
              className={
                k.lolosOtomatis
                  ? "flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900"
                  : "flex size-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900"
              }
            >
              {k.lolosOtomatis ? (
                <ShieldCheckIcon className="size-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlertIcon className="size-7 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold">
                {k.lolosOtomatis ? "Lolos Skrining Awal" : "Perlu Perhatian Petugas"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {k.lolosOtomatis
                  ? "Jawaban kuesioner Anda tidak menunjukkan faktor risiko. Kelayakan akhir tetap ditentukan petugas saat wawancara medis."
                  : "Beberapa jawaban Anda menunjukkan kemungkinan faktor risiko. Petugas akan meninjau lebih lanjut saat wawancara medis."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
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
    </div>
  );
}
