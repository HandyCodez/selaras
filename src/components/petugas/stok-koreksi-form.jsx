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

export function StokKoreksiForm() {
  const [state, formAction] = useActionState(koreksiStokManual, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <Select name="golonganDarah" required>
        <SelectTrigger className="w-32">
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
