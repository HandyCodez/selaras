"use client";

import { useActionState } from "react";
import { daftarKegiatan } from "@/actions/partisipasi.actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  KUESIONER_SECTIONS,
  isQuestionApplicable,
} from "@/lib/kuesioner-questions";
import { cn } from "@/lib/utils";

function YaTidakField({ id, text }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 text-sm last:border-0">
      <span className="flex-1 text-sm leading-snug">{text}</span>
      <div className="flex shrink-0 gap-1.5">
        <label>
          <input
            type="radio"
            id={`${id}_ya`}
            name={id}
            value="ya"
            className="peer sr-only"
            required
          />
          <span
            className={cn(
              "block cursor-pointer rounded-md border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors",
              "peer-checked:border-destructive peer-checked:bg-destructive/10 peer-checked:text-destructive",
            )}
          >
            Ya
          </span>
        </label>
        <label>
          <input
            type="radio"
            id={`${id}_tidak`}
            name={id}
            value="tidak"
            className="peer sr-only"
          />
          <span
            className={cn(
              "block cursor-pointer rounded-md border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors",
              "peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 dark:peer-checked:bg-emerald-950 dark:peer-checked:text-emerald-400",
            )}
          >
            Tidak
          </span>
        </label>
      </div>
    </div>
  );
}

export function KuesionerForm({ kegiatanId, jenisKelamin }) {
  const [state, formAction] = useActionState(daftarKegiatan, null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="kegiatanId" value={kegiatanId} />
      <p className="text-sm text-muted-foreground">
        Beri tanda pada jawaban Anda dengan jujur — ini membantu petugas PMI
        memastikan donor darah yang aman untuk Anda dan penerima darah.
      </p>

      {KUESIONER_SECTIONS.map((section) => {
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
                  <YaTidakField id={q.id} text={q.text} />
                  {q.hasDetail && (
                    <div className="flex items-center gap-2 border-b py-2 pl-4 text-sm last:border-0">
                      <Label htmlFor="kehamilanKe" className="font-normal text-muted-foreground">
                        Jika Ya, kehamilan keberapa?
                      </Label>
                      <Input
                        id="kehamilanKe"
                        name="kehamilanKe"
                        type="number"
                        min="1"
                        className="w-20"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="space-y-2">
        <Label htmlFor="catatanTambahan">Catatan Tambahan (opsional)</Label>
        <Textarea id="catatanTambahan" name="catatanTambahan" />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Daftar &amp; Kirim Kuesioner</SubmitButton>
    </form>
  );
}
