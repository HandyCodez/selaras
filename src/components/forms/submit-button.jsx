"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({ children, className, ...props }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} {...props}>
      {pending && <Loader2Icon className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}
