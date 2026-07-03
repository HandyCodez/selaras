"use client";

import { useActionState } from "react";
import { batalkanPermintaan } from "@/actions/permintaan.actions";
import { Button } from "@/components/ui/button";

export function CancelPermintaanButton({ permintaanId }) {
  const action = batalkanPermintaan.bind(null, permintaanId);
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success) {
    return <p className="text-sm text-muted-foreground">Permintaan dibatalkan.</p>;
  }

  return (
    <div className="space-y-1">
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!window.confirm("Batalkan permintaan darah ini?")) {
            e.preventDefault();
          }
        }}
      >
        <Button variant="outline" size="sm" type="submit" disabled={isPending}>
          Batalkan Permintaan
        </Button>
      </form>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}
