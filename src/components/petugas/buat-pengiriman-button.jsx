"use client";

import { useActionState, useEffect } from "react";
import { buatPengiriman } from "@/actions/pengiriman.actions";
import { Button } from "@/components/ui/button";
import { TruckIcon } from "lucide-react";
import { toast } from "sonner";

export function BuatPengirimanButton({ permintaanId }) {
  const [state, formAction, isPending] = useActionState(
    buatPengiriman,
    null,
  );

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="permintaanId" value={permintaanId} />
      <Button
        type="submit"
        disabled={isPending}
        className="bg-rose-600 hover:bg-rose-700 text-white"
      >
        <TruckIcon className="size-4" />
        {isPending ? "Memproses..." : "Buat Pengiriman"}
      </Button>
    </form>
  );
}
