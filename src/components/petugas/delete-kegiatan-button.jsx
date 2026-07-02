"use client";

import { useActionState } from "react";
import { deleteKegiatan } from "@/actions/kegiatan.actions";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

export function DeleteKegiatanButton({ kegiatanId, kegiatanJudul }) {
  const action = deleteKegiatan.bind(null, kegiatanId);
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="flex flex-col items-end gap-1">
      <form
        action={formAction}
        onSubmit={(e) => {
          if (
            !window.confirm(
              `Hapus kegiatan "${kegiatanJudul}"? Tindakan ini tidak bisa dibatalkan.`,
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <Button variant="ghost" size="sm" type="submit" disabled={isPending}>
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      </form>
      {state?.error && (
        <p className="max-w-xs text-right text-xs text-destructive">{state.error}</p>
      )}
    </div>
  );
}
