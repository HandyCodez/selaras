"use client";

import { useActionState } from "react";
import { tandaiDikirim } from "@/actions/pengiriman.actions";
import { Button } from "@/components/ui/button";
import { TruckIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export function TandaiDikirimButton({ pengirimanId }) {
  const [state, formAction, isPending] = useActionState(
    tandaiDikirim.bind(null, pengirimanId),
    null,
  );

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <Button type="submit" disabled={isPending} className="bg-rose-600 hover:bg-rose-700 text-white">
        <TruckIcon className="size-4" />
        {isPending ? "Memproses..." : "Tandai Dikirim"}
      </Button>
    </form>
  );
}
