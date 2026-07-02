"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";

export function CabangForm({ action, cabang }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Cabang</Label>
        <Input id="nama" name="nama" defaultValue={cabang?.nama} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="kota">Kota</Label>
        <Input id="kota" name="kota" defaultValue={cabang?.kota} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Input id="alamat" name="alamat" defaultValue={cabang?.alamat} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telepon">Telepon</Label>
        <Input id="telepon" name="telepon" defaultValue={cabang?.telepon} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>{cabang ? "Simpan Perubahan" : "Buat Cabang"}</SubmitButton>
    </form>
  );
}
