"use client";

import { useActionState } from "react";
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

export function PetugasAccountForm({ action, cabangList, petugas }) {
  const [state, formAction] = useActionState(action, null);
  const isEdit = Boolean(petugas);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama</Label>
        <Input id="nama" name="nama" defaultValue={petugas?.nama} required />
      </div>
      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="telepon">Telepon</Label>
        <Input id="telepon" name="telepon" defaultValue={petugas?.telepon} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cabangId">Cabang PMI</Label>
        <Select
          name="cabangId"
          defaultValue={petugas?.petugas?.cabangId?.toString()}
          required
        >
          <SelectTrigger id="cabangId" className="w-full">
            <SelectValue placeholder="Pilih cabang" />
          </SelectTrigger>
          <SelectContent>
            {cabangList.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.nama} - {c.kota}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="jabatan">Jabatan</Label>
        <Select name="jabatan" defaultValue={petugas?.petugas?.jabatan || "staff"} required>
          <SelectTrigger id="jabatan" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="dokter">Dokter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">
          {isEdit ? "Kata Sandi Baru (kosongkan jika tidak diubah)" : "Kata Sandi"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={6}
          required={!isEdit}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>{isEdit ? "Simpan Perubahan" : "Buat Akun Petugas"}</SubmitButton>
    </form>
  );
}
