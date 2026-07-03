"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword } from "@/actions/password.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/forms/submit-button";
import { CheckCircle2Icon } from "lucide-react";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePassword, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Kata Sandi Baru</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          minLength={6}
          autoComplete="new-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={6}
          autoComplete="new-password"
          required
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2Icon className="size-4" />
          {state.success}
        </p>
      )}
      <SubmitButton>Ubah Kata Sandi</SubmitButton>
    </form>
  );
}
