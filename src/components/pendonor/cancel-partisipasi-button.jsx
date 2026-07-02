"use client";

import { useActionState } from "react";
import { batalkanPendaftaran } from "@/actions/partisipasi.actions";
import { Button } from "@/components/ui/button";

export function CancelPartisipasiButton({ partisipasiId }) {
  const action = batalkanPendaftaran.bind(null, partisipasiId);
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success) {
    return <p className="text-sm text-muted-foreground">Pendaftaran dibatalkan.</p>;
  }

  return (
    <div className="space-y-1">
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!window.confirm("Batalkan pendaftaran donor ini?")) {
            e.preventDefault();
          }
        }}
      >
        <Button variant="outline" size="sm" type="submit" disabled={isPending}>
          Batalkan Pendaftaran
        </Button>
      </form>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}
