"use client";

import { useActionState } from "react";
import { updateRumahSakitProfile } from "@/actions/rumah-sakit-profil.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditRumahSakitForm({ user, rumahSakit }) {
  const [state, formAction] = useActionState(updateRumahSakitProfile, null);

  return (
    <form action={formAction} className="max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data PIC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Rumah Sakit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Rumah Sakit</Label>
            <Input value={rumahSakit?.nama} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kotaRumahSakit">Kota</Label>
            <Input
              id="kotaRumahSakit"
              name="kotaRumahSakit"
              defaultValue={rumahSakit?.kota}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamatRumahSakit">Alamat</Label>
            <Input
              id="alamatRumahSakit"
              name="alamatRumahSakit"
              defaultValue={rumahSakit?.alamat}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teleponRumahSakit">Telepon Rumah Sakit</Label>
            <Input
              id="teleponRumahSakit"
              name="teleponRumahSakit"
              defaultValue={rumahSakit?.telepon}
            />
          </div>
        </CardContent>
      </Card>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>Simpan Perubahan</SubmitButton>
    </form>
  );
}
