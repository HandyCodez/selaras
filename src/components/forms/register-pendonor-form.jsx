"use client";

import { useActionState } from "react";
import { registerPendonor } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";

export function RegisterPendonorForm() {
  const [state, formAction] = useActionState(registerPendonor, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="telepon">No. Telepon</Label>
        <Input id="telepon" name="telepon" type="tel" required autoFocus />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      <p className="text-xs text-muted-foreground">
        Data diri (nama, tanggal lahir, dll.) bisa dilengkapi nanti saat Anda
        akan mendonorkan darah.
      </p>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton className="w-full">Daftar</SubmitButton>
    </form>
  );
}
