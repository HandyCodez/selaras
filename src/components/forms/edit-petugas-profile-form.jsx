"use client";

import { useActionState } from "react";
import { updatePetugasProfile } from "@/actions/petugas-profil.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";

export function EditPetugasProfileForm({ user }) {
  const [state, formAction] = useActionState(updatePetugasProfile, null);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama</Label>
        <Input id="nama" name="nama" defaultValue={user.nama} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telepon">No. Telepon</Label>
        <Input id="telepon" name="telepon" defaultValue={user.telepon} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (opsional)</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi Baru (kosongkan jika tidak diubah)</Label>
        <Input id="password" name="password" type="password" minLength={6} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Simpan Perubahan</SubmitButton>
    </form>
  );
}
