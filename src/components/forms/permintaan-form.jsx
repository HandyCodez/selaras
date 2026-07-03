"use client";

import { useActionState } from "react";
import { createPermintaan } from "@/actions/permintaan.actions";
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

const URGENSI_LABELS = {
  biasa: "Biasa",
  mendesak: "Mendesak",
};

export function PermintaanForm({ cabangList, defaultCabangId }) {
  const [state, formAction] = useActionState(createPermintaan, null);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cabangId">Cabang PMI Tujuan</Label>
        <Select name="cabangId" defaultValue={defaultCabangId} required>
          <SelectTrigger id="cabangId" className="w-full">
            <SelectValue placeholder="Pilih cabang PMI">
              {(value) => {
                const cabang = cabangList.find((c) => c._id === value);
                return cabang ? `${cabang.nama} - ${cabang.kota}` : "Pilih cabang PMI";
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cabangList.map((cabang) => (
              <SelectItem key={cabang._id} value={cabang._id}>
                {cabang.nama} - {cabang.kota}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Jumlah Kantong Darah Dibutuhkan</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GOLONGAN_DARAH.map((gol) => (
            <div key={gol} className="space-y-1">
              <Label htmlFor={`jumlah_${gol}`} className="text-xs">
                {gol}
              </Label>
              <Input
                id={`jumlah_${gol}`}
                name={`jumlah_${gol}`}
                type="number"
                min="0"
                defaultValue={0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgensi">Urgensi</Label>
        <Select name="urgensi" defaultValue="biasa" required>
          <SelectTrigger id="urgensi" className="w-full">
            <SelectValue>{(value) => URGENSI_LABELS[value] ?? value}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="biasa">Biasa</SelectItem>
            <SelectItem value="mendesak">Mendesak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea id="catatan" name="catatan" />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Ajukan Permintaan</SubmitButton>
    </form>
  );
}
