"use client";

import { useActionState } from "react";
import { registerRumahSakit } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";

export function RegisterRumahSakitForm({ cabangList }) {
  const [state, formAction] = useActionState(registerRumahSakit, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Anda (PIC)</Label>
        <Input id="nama" name="nama" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telepon">No. Telepon</Label>
        <Input id="telepon" name="telepon" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="namaRumahSakit">Nama Rumah Sakit</Label>
        <Input id="namaRumahSakit" name="namaRumahSakit" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="kotaRumahSakit">Kota Rumah Sakit</Label>
        <Input id="kotaRumahSakit" name="kotaRumahSakit" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="alamatRumahSakit">Alamat Rumah Sakit</Label>
        <Input id="alamatRumahSakit" name="alamatRumahSakit" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="defaultCabangId">Cabang PMI Terdekat</Label>
        <Select name="defaultCabangId" required>
          <SelectTrigger id="defaultCabangId" className="w-full">
            <SelectValue placeholder="Pilih cabang PMI" />
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
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton className="w-full">Daftar</SubmitButton>
    </form>
  );
}
