"use client";

import { useActionState, useEffect } from "react";
import { submitWawancara } from "@/actions/partisipasi.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import { GOLONGAN_DARAH } from "@/lib/blood-types";

const HASIL_LABELS = {
  lolos: "Lolos",
  tidak_lolos: "Tidak Lolos",
};

export function WawancaraForm({ partisipasi, onDone }) {
  const action = submitWawancara.bind(null, partisipasi._id);
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success && onDone) {
      onDone(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tensiSistol">Tensi Sistol</Label>
          <Input id="tensiSistol" name="tensiSistol" type="number" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tensiDiastol">Tensi Diastol</Label>
          <Input id="tensiDiastol" name="tensiDiastol" type="number" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
          <Input id="beratBadan" name="beratBadan" type="number" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
          <Input id="hemoglobin" name="hemoglobin" type="number" step="0.1" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="golonganDarah">Golongan Darah</Label>
        <Select
          name="golonganDarah"
          defaultValue={partisipasi.donorId?.pendonor?.golonganDarah || undefined}
        >
          <SelectTrigger id="golonganDarah" className="w-full">
            <SelectValue placeholder="Pilih golongan darah" />
          </SelectTrigger>
          <SelectContent>
            {GOLONGAN_DARAH.map((gol) => (
              <SelectItem key={gol} value={gol}>
                {gol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea id="catatan" name="catatan" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hasil">Hasil</Label>
        <Select name="hasil" required>
          <SelectTrigger id="hasil" className="w-full">
            <SelectValue placeholder="Pilih hasil">
              {(value) => HASIL_LABELS[value] ?? "Pilih hasil"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lolos">Lolos</SelectItem>
            <SelectItem value="tidak_lolos">Tidak Lolos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Simpan Hasil Wawancara</SubmitButton>
    </form>
  );
}
