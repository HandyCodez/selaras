"use client";

import { useActionState, useEffect } from "react";
import { tandaiDigunakan } from "@/actions/pengiriman.actions";
import { Button } from "@/components/ui/button";
import { HeartHandshakeIcon } from "lucide-react";
import { toast } from "sonner";

export function TandaiDigunakanButton({ kantongId }) {
  const [state, formAction, isPending] = useActionState(
    tandaiDigunakan.bind(null, kantongId),
    null,
  );

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <Button type="submit" disabled={isPending} variant="outline" size="sm">
        <HeartHandshakeIcon className="size-4" />
        {isPending ? "..." : "Tandai Digunakan"}
      </Button>
    </form>
  );
}
