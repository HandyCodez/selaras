"use client";

import { useActionState } from "react";
import { completeProfile } from "@/actions/pendonor-profile.actions";
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

function toDateInputValue(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function LengkapiProfilForm({ user }) {
  const [state, formAction] = useActionState(completeProfile, null);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Lengkap</Label>
        <Input id="nama" name="nama" defaultValue={user.nama} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nik">NIK</Label>
        <Input
          id="nik"
          name="nik"
          inputMode="numeric"
          pattern="\d{16}"
          maxLength={16}
          defaultValue={user.pendonor?.nik}
          placeholder="16 digit sesuai KTP"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (opsional)</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
          <Input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            defaultValue={toDateInputValue(user.pendonor?.tanggalLahir)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
          <Select
            name="jenisKelamin"
            defaultValue={user.pendonor?.jenisKelamin}
            required
          >
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
        <Label htmlFor="alamat">Alamat</Label>
        <Input id="alamat" name="alamat" defaultValue={user.pendonor?.alamat} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Golongan darah akan diperiksa dan diisi oleh petugas PMI saat Anda
        melakukan wawancara medis di lokasi donor.
      </p>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Simpan Data Diri</SubmitButton>
    </form>
  );
}
