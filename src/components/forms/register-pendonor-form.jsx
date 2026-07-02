"use client";

import { useActionState } from "react";
import { registerPendonor } from "@/actions/auth.actions";
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
import { GOLONGAN_DARAH } from "@/lib/blood-types";

export function RegisterPendonorForm() {
  const [state, formAction] = useActionState(registerPendonor, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Lengkap</Label>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
          <Input id="tanggalLahir" name="tanggalLahir" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
          <Select name="jenisKelamin" required>
            <SelectTrigger id="jenisKelamin" className="w-full">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="golonganDarah">Golongan Darah (jika tahu)</Label>
        <Select name="golonganDarah">
          <SelectTrigger id="golonganDarah" className="w-full">
            <SelectValue placeholder="Belum tahu" />
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
        <Label htmlFor="alamat">Alamat</Label>
        <Input id="alamat" name="alamat" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton className="w-full">Daftar</SubmitButton>
    </form>
  );
}
