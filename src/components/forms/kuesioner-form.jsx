"use client";

import { useActionState } from "react";
import { daftarKegiatan } from "@/actions/partisipasi.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/forms/submit-button";

export function KuesionerForm({ kegiatanId }) {
  const [state, formAction] = useActionState(daftarKegiatan, null);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="kegiatanId" value={kegiatanId} />
      <div className="space-y-2">
        <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
        <Input id="beratBadan" name="beratBadan" type="number" min="1" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tekananDarahDiketahui">
          Tekanan Darah (jika tahu)
        </Label>
        <Input
          id="tekananDarahDiketahui"
          name="tekananDarahDiketahui"
          placeholder="contoh: 120/80"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sedangMinumObat"
          name="sedangMinumObat"
          className="size-4"
        />
        <Label htmlFor="sedangMinumObat">Sedang mengonsumsi obat rutin</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="detailObat">Detail Obat (jika ada)</Label>
        <Input id="detailObat" name="detailObat" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="donorTerakhir">Tanggal Donor Terakhir (jika ada)</Label>
        <Input id="donorTerakhir" name="donorTerakhir" type="date" />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="kondisiSehat"
          name="kondisiSehat"
          defaultChecked
          className="size-4"
        />
        <Label htmlFor="kondisiSehat">Saya dalam kondisi sehat saat ini</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="catatanTambahan">Catatan Tambahan</Label>
        <Textarea id="catatanTambahan" name="catatanTambahan" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Daftar &amp; Kirim Kuesioner</SubmitButton>
    </form>
  );
}
