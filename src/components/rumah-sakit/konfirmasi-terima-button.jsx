"use client";

import { useActionState, useEffect } from "react";
import { konfirmasiTerima } from "@/actions/pengiriman.actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

export function KonfirmasiTerimaButton({ pengirimanId }) {
  const [state, formAction, isPending] = useActionState(
    konfirmasiTerima.bind(null, pengirimanId),
    null,
  );

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <Button
        type="submit"
        disabled={isPending}
        className="bg-rose-600 hover:bg-rose-700 text-white"
      >
        <CheckCircle2Icon className="size-4" />
        {isPending ? "Memproses..." : "Konfirmasi Terima"}
      </Button>
    </form>
  );
}
