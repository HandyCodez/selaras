"use client";

import { useActionState } from "react";
import { koreksiStokManual } from "@/actions/stok.actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import { GOLONGAN_DARAH } from "@/lib/blood-types";
import { KOMPONEN_DARAH, KOMPONEN_DARAH_LABELS } from "@/lib/blood-components";

export function StokKoreksiForm() {
  const [state, formAction] = useActionState(koreksiStokManual, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <Select name="golonganDarah" required>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Golongan" />
        </SelectTrigger>
        <SelectContent>
          {GOLONGAN_DARAH.map((gol) => (
            <SelectItem key={gol} value={gol}>
              {gol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select name="komponenDarah" required>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Komponen">
            {(value) => KOMPONEN_DARAH_LABELS[value] ?? "Komponen"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {KOMPONEN_DARAH.map((k) => (
            <SelectItem key={k} value={k}>
              {KOMPONEN_DARAH_LABELS[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        name="delta"
        placeholder="+/- jumlah"
        className="w-32"
        required
      />
      <SubmitButton>Koreksi Stok</SubmitButton>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
